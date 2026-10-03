"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function AdminLogin() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <main className="mx-auto max-w-sm px-4 py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
      <form action={action} className="mt-6">
        <input
          name="password"
          type="password"
          required
          autoFocus
          placeholder="Password"
          className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand"
        />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button disabled={pending} className="mt-4 w-full rounded-full bg-ink px-6 py-3 text-sm font-medium text-white disabled:opacity-60">
          {pending ? "Checking..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
