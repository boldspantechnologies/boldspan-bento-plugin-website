import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "bg_admin";
const MAX_AGE = 60 * 60 * 8; // 8 hours

const secret = () => process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";
const sign = (p: string) => createHmac("sha256", secret()).update(p).digest("base64url");

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export const adminConfigured = () => !!process.env.ADMIN_PASSWORD;

export function checkPassword(input: string) {
  const pw = process.env.ADMIN_PASSWORD;
  return !!pw && safeEqual(createHmac("sha256", "pw").update(input).digest("hex"), createHmac("sha256", "pw").update(pw).digest("hex"));
}

export async function startSession() {
  const exp = Date.now() + MAX_AGE * 1000;
  (await cookies()).set(COOKIE, `${exp}.${sign(String(exp))}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
}

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const v = (await cookies()).get(COOKIE)?.value ?? "";
  const [exp, mac] = v.split(".");
  return !!exp && !!mac && safeEqual(mac, sign(exp)) && Number(exp) > Date.now();
}

/** Call at the top of every admin page and server action. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
