import { NextRequest, NextResponse } from "next/server";
import { devKind, graceEnd, hashToken, newToken, normalizeKey, normalizeSiteId } from "../../../../../../lib/license";
import { prisma } from "../../../../../../lib/db";
import type { License } from "../../../../../../generated/prisma/client";

export const dynamic = "force-dynamic";

const ENV_DEV_CAP = 3;
// Neon can take a few seconds to hand out a connection; Prisma defaults to 2s.
const TX = { maxWait: 10_000, timeout: 15_000 };
const ACCOUNT_URL = "https://bentogrid.boldspan.tech/account/";

type Status = "valid" | "invalid" | "expired" | "revoked" | "site_mismatch";
type Body = Record<string, unknown>;

const json = (http: number, body: object) =>
  NextResponse.json(body, { status: http, headers: { "Cache-Control": "no-store" } });
const fail = (http: number, status: Status, message: string) => json(http, { success: false, status, message });
const ok = (lic: License, token?: string) =>
  json(200, { success: true, status: "valid", ...(token ? { token } : {}), expires_at: graceEnd(lic.expiresAt)?.toISOString() ?? null });

// Returns an error response, or null when the licence may be used.
function verdict(lic: License | null): NextResponse | null {
  if (!lic) return fail(404, "invalid", "This licence key is not valid. Copy it from your purchase email.");
  if (lic.status === "revoked") return fail(403, "revoked", "This licence has been revoked. Contact support if this is a mistake.");
  const end = graceEnd(lic.expiresAt);
  if (end && end.getTime() < Date.now()) return fail(403, "expired", `This licence expired. Renew it at ${ACCOUNT_URL}`);
  return null;
}

async function activate(b: Body) {
  const key = normalizeKey(b.license_key);
  const siteId = normalizeSiteId(b.site_id);
  if (key.length < 8 || !siteId) return fail(400, "invalid", "Missing licence key or site.");

  return prisma.$transaction(async (tx) => {
    const lic = await tx.license.findUnique({ where: { key } });
    const err = verdict(lic);
    if (err) return err;
    const l = lic!;
    // Serialise activations per key so two sites cannot both take the last slot.
    await tx.$queryRaw`SELECT id FROM "License" WHERE id = ${l.id} FOR UPDATE`;

    const dev = devKind(siteId, b.environment);
    const token = newToken();
    const meta = {
      siteUrl: String(b.site_url ?? ""),
      siteName: String(b.site_name ?? "").slice(0, 200),
      environment: String(b.environment ?? ""),
      pluginVersion: String(b.plugin_version ?? ""),
      wpVersion: String(b.wp_version ?? ""),
    };
    const live = await tx.activation.findMany({ where: { licenseId: l.id, deactivatedAt: null } });

    // Same site again: succeed and rotate the token.
    const same = live.find((a) => a.siteId === siteId);
    if (same) {
      await tx.activation.update({ where: { id: same.id }, data: { ...meta, tokenHash: hashToken(token), lastCheckAt: new Date() } });
      return ok(l, token);
    }

    if (dev === "env") {
      if (live.filter((a) => a.isDev).length >= ENV_DEV_CAP)
        return fail(403, "site_mismatch", `This key already has ${ENV_DEV_CAP} staging sites. Free one at ${ACCOUNT_URL}`);
    } else if (!dev && l.maxSites !== null) {
      const prod = live.filter((a) => !a.isDev);
      if (prod.length >= l.maxSites) {
        const where = l.maxSites === 1 ? `on ${prod[0].siteId}` : `on ${prod.length} sites`;
        return fail(403, "site_mismatch", `This key is already active ${where}. Deactivate it there, or manage sites at ${ACCOUNT_URL}`);
      }
    }

    await tx.activation.create({
      data: { licenseId: l.id, siteId, isDev: dev !== null, tokenHash: hashToken(token), lastCheckAt: new Date(), ...meta },
    });
    return ok(l, token);
  }, TX);
}

async function check(b: Body) {
  const key = normalizeKey(b.license_key);
  const siteId = normalizeSiteId(b.site_id);
  const lic = await prisma.license.findUnique({ where: { key } });
  const err = verdict(lic);
  if (err) return err;

  const res = await prisma.activation.updateMany({
    where: { licenseId: lic!.id, siteId, tokenHash: hashToken(String(b.token ?? "")), deactivatedAt: null },
    data: { lastCheckAt: new Date(), pluginVersion: String(b.plugin_version ?? ""), wpVersion: String(b.wp_version ?? "") },
  });
  if (!res.count) return fail(403, "site_mismatch", "This key is no longer active on this site. Activate it again on the Licence screen.");
  return ok(lic!);
}

async function deactivate(b: Body) {
  const key = normalizeKey(b.license_key);
  const siteId = normalizeSiteId(b.site_id);
  await prisma.activation.updateMany({
    where: { license: { key }, siteId, tokenHash: hashToken(String(b.token ?? "")), deactivatedAt: null },
    data: { deactivatedAt: new Date() },
  });
  return json(200, { success: true }); // idempotent
}

const HANDLERS: Record<string, (b: Body) => Promise<NextResponse>> = { activate, check, deactivate };

export async function POST(req: NextRequest, { params }: { params: Promise<{ action: string }> }) {
  const handler = HANDLERS[(await params).action];
  if (!handler) return fail(404, "invalid", "Unknown action.");
  try {
    const body = await req.json().catch(() => ({}));
    return await handler(body && typeof body === "object" ? body : {});
  } catch (e) {
    console.error(e);
    // Outage, not a verdict: the plugin must never read this as "lock the editor".
    return json(503, {
      success: false,
      message: "Licence server error. Try again shortly.",
      ...(process.env.NODE_ENV !== "production" && { debug: String(e).slice(0, 500) }),
    });
  }
}
