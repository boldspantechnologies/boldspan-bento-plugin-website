import { defineConfig } from "prisma/config";

// Prisma CLI does not load env files on its own.
try {
  process.loadEnvFile(".env");
} catch {}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // Migrations need Neon's direct (non-pooled) connection string when you have one.
  // `generate` needs no database, so fall back to a placeholder when neither var is set (e.g. at build time).
  datasource: { url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "postgresql://placeholder" },
});
