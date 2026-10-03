import { isAdmin } from "../../../lib/admin-auth";
import { prisma } from "../../../lib/db";
import { graceEnd, normalizeKey } from "../../../lib/license";

export const dynamic = "force-dynamic";

// Admin-only, read-only: open /admin/status?key=BENTO-XXXX-XXXX-XXXX in the browser
// to see what the licence API would answer for that key and which sites hold it.
export async function GET(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Sign in at /admin/login first." }, { status: 401 });

  const key = normalizeKey(new URL(req.url).searchParams.get("key"));
  const lic = await prisma.license.findUnique({ where: { key }, include: { activations: { orderBy: { activatedAt: "desc" } } } });
  if (!lic) return Response.json({ key, status: "invalid", message: "No such key." }, { status: 404 });

  const end = graceEnd(lic.expiresAt);
  const status = lic.status === "revoked" ? "revoked" : end && end.getTime() < Date.now() ? "expired" : "valid";
  const sites = lic.activations.map((a) => ({
    site: a.siteId,
    activated: !a.deactivatedAt,
    environment: a.environment || "production",
    dev_site_free: a.isDev,
    plugin_version: a.pluginVersion,
    last_check: a.lastCheckAt,
    deactivated_at: a.deactivatedAt,
  }));
  return Response.json({
    key: lic.key,
    status,
    plan: lic.plan,
    email: lic.email,
    expires_at: lic.expiresAt,
    max_sites: lic.maxSites,
    sites_in_use: sites.filter((s) => s.activated && !s.dev_site_free).length,
    sites,
  });
}
