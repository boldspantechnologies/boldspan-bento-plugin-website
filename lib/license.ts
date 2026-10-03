import { randomInt, randomBytes, createHash } from "node:crypto";

// No 0/O/1/I, so keys can be read aloud and typed from an email.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateKey(): string {
  const block = () => Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");
  return `BENTO-${block()}-${block()}-${block()}`;
}

// Mirrors bento_normalize_key() in the plugin.
export const normalizeKey = (k: unknown) => String(k ?? "").trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");

// Mirrors bento_site_id() in the plugin.
export function normalizeSiteId(raw: unknown): string {
  const s = String(raw ?? "").trim().toLowerCase().replace(/^[a-z]+:\/\//, "").replace(/^www\./, "");
  return s.replace(/\/+$/, "");
}

export const newToken = () => randomBytes(32).toString("base64url");
export const hashToken = (t: string) => createHash("sha256").update(t).digest("hex");

const DEV_HOST =
  /^(localhost|127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+)$|\.(local|test|localhost|invalid|example)$|^staging\.|\.staging\.|\.wpengine\.com$|\.kinsta\.cloud$|\.instawp\.xyz$/;

export function devKind(siteId: string, environment: unknown): "host" | "env" | null {
  const host = siteId.split("/")[0].split(":")[0];
  if (DEV_HOST.test(host)) return "host";
  if (["local", "development", "staging"].includes(String(environment))) return "env";
  return null;
}

// The plugin keeps working this long after the paid-up date.
export const EXPIRY_GRACE_DAYS = 14;
export const graceEnd = (d: Date | null) => (d ? new Date(d.getTime() + EXPIRY_GRACE_DAYS * 864e5) : null);
