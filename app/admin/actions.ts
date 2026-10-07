"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, endSession, requireAdmin, startSession } from "../../lib/admin-auth";
import { prisma } from "../../lib/db";
import { issueLicense, PLANS } from "../../lib/store";

export async function login(_: string | null, form: FormData) {
  if (!checkPassword(String(form.get("password") ?? ""))) return "Wrong password.";
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

const done = () => revalidatePath("/admin");
const addDays = (from: Date | null, days: number) => {
  const base = from && from > new Date() ? from : new Date();
  return new Date(base.getTime() + days * 864e5);
};
const id = (form: FormData) => String(form.get("id"));

export type IssueResult = { key?: string; error?: string } | null;

export async function issue(_: IssueResult, form: FormData): Promise<IssueResult> {
  await requireAdmin();
  const email = String(form.get("email") ?? "").trim();
  const plan = String(form.get("plan") ?? "personal");
  const term = String(form.get("term") ?? "365");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email." };
  if (!PLANS[plan]) return { error: "Unknown plan." };
  const lic = await issueLicense(prisma, {
    email,
    name: String(form.get("name") ?? "").trim(),
    plan,
    expiresAt: term === "lifetime" ? null : addDays(null, Number(term) || 365),
    source: form.get("source") === "early_access" ? "early_access" : "manual",
    note: String(form.get("note") ?? "").trim(),
  });
  done();
  return { key: lic.key };
}

export async function setStatus(form: FormData) {
  await requireAdmin();
  await prisma.license.update({ where: { id: id(form) }, data: { status: form.get("status") === "revoked" ? "revoked" : "active" } });
  done();
}

export async function extend(form: FormData) {
  await requireAdmin();
  const days = String(form.get("days"));
  const lic = await prisma.license.findUnique({ where: { id: id(form) } });
  if (!lic) return;
  await prisma.license.update({
    where: { id: lic.id },
    data: { expiresAt: days === "lifetime" ? null : addDays(lic.expiresAt, Number(days) || 365) },
  });
  done();
}

export async function setMaxSites(form: FormData) {
  await requireAdmin();
  const n = String(form.get("max_sites") ?? "").trim();
  await prisma.license.update({ where: { id: id(form) }, data: { maxSites: n === "" ? null : Math.max(1, Number(n) || 1) } });
  done();
}

export async function resetActivations(form: FormData) {
  await requireAdmin();
  await prisma.activation.updateMany({ where: { licenseId: id(form), deactivatedAt: null }, data: { deactivatedAt: new Date() } });
  done();
}

export async function deactivateSite(form: FormData) {
  await requireAdmin();
  await prisma.activation.updateMany({
    where: { id: String(form.get("aid")), licenseId: id(form), deactivatedAt: null },
    data: { deactivatedAt: new Date() },
  });
  done();
}

export async function saveNote(form: FormData) {
  await requireAdmin();
  await prisma.license.update({ where: { id: id(form) }, data: { note: String(form.get("note") ?? "").slice(0, 500) } });
  done();
}

export async function deleteLicense(form: FormData) {
  await requireAdmin();
  await prisma.license.deleteMany({ where: { id: id(form) } });
  done();
}

// Early-access requests: approve issues a 1-year Personal key, reject just closes it.
export async function approveRequest(form: FormData) {
  await requireAdmin();
  const req = await prisma.earlyAccessRequest.findUnique({ where: { id: id(form) } });
  if (!req || req.status !== "pending") return;
  await prisma.$transaction(async (tx) => {
    const lic = await issueLicense(tx, {
      email: req.email,
      plan: "personal",
      expiresAt: addDays(null, 365),
      source: "early_access",
      note: `Early access: ${req.reason || "-"}`.slice(0, 500),
    });
    await tx.earlyAccessRequest.update({ where: { id: req.id }, data: { status: "approved", licenseId: lic.id } });
  }, { maxWait: 10_000, timeout: 15_000 });
  done();
}

export async function rejectRequest(form: FormData) {
  await requireAdmin();
  await prisma.earlyAccessRequest.updateMany({ where: { id: id(form), status: "pending" }, data: { status: "rejected" } });
  done();
}
