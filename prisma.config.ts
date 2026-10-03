import { defineConfig, env } from "prisma/config";

// Prisma CLI does not load env files on its own.
try {
  process.loadEnvFile(".env");
} catch {}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // Migrations need Neon's direct (non-pooled) connection string when you have one.
  datasource: { url: process.env.DIRECT_URL ? env("DIRECT_URL") : env("DATABASE_URL") },
});
