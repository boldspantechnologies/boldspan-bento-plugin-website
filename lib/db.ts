import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";

// Reuse one client across hot reloads in dev.
const g = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  g.prisma ?? new PrismaClient({ adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }) });

if (process.env.NODE_ENV !== "production") g.prisma = prisma;
