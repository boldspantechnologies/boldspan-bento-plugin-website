import { generateKey } from "./license";
import type { Prisma } from "../generated/prisma/client";

export const PLANS: Record<string, { name: string; maxSites: number | null }> = {
  personal: { name: "Personal", maxSites: 1 },
  business: { name: "Business", maxSites: 5 },
  agency: { name: "Agency", maxSites: 20 },
};

type Tx = Prisma.TransactionClient;

export async function issueLicense(
  db: Tx,
  o: {
    email: string;
    name?: string;
    plan: string;
    maxSites?: number | null;
    expiresAt: Date | null;
    source?: "purchase" | "manual" | "early_access";
    note?: string;
  },
) {
  for (let i = 0; i < 5; i++) {
    const key = generateKey();
    if (await db.license.findUnique({ where: { key }, select: { id: true } })) continue;
    return db.license.create({
      data: {
        key,
        email: o.email,
        name: o.name ?? "",
        plan: o.plan,
        maxSites: o.maxSites === undefined ? (PLANS[o.plan]?.maxSites ?? 1) : o.maxSites,
        expiresAt: o.expiresAt,
        source: o.source ?? "manual",
        note: o.note ?? "",
      },
    });
  }
  throw new Error("Could not generate a unique key");
}
