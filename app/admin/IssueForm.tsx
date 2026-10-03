"use client";

import { useActionState } from "react";
import { issue } from "./actions";
import { CopyButton } from "./controls";

const input = "w-full rounded-2xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-brand";
const label = "mb-1.5 block text-xs font-medium text-mute";

export function IssueForm() {
  const [state, action, pending] = useActionState(issue, null);
  return (
    <details className="group rounded-3xl border border-line bg-white" open={!!state?.key || undefined}>
      <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-4">
        <span className="font-semibold">Generate a licence</span>
        <span className="rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-white group-open:hidden">+ New licence</span>
        <span className="hidden text-xs text-mute group-open:inline">Close</span>
      </summary>
      <form action={action} className="border-t border-line px-6 py-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div><label className={label}>Customer email</label><input name="email" type="email" required placeholder="name@example.com" className={input} /></div>
          <div><label className={label}>Name (optional)</label><input name="name" className={input} /></div>
          <div>
            <label className={label}>Plan</label>
            <select name="plan" defaultValue="personal" className={input}>
              <option value="personal">Personal · 1 site</option>
              <option value="business">Business · 5 sites</option>
              <option value="agency">Agency · 20 sites</option>
            </select>
          </div>
          <div>
            <label className={label}>Duration</label>
            <select name="term" defaultValue="365" className={input}>
              <option value="365">1 year</option>
              <option value="30">30 days</option>
              <option value="lifetime">Lifetime</option>
            </select>
          </div>
          <div>
            <label className={label}>Source</label>
            <select name="source" defaultValue="manual" className={input}>
              <option value="manual">Manual</option>
              <option value="early_access">Early access</option>
            </select>
          </div>
          <div><label className={label}>Note (optional)</label><input name="note" className={input} /></div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button disabled={pending} className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white disabled:opacity-60">
            {pending ? "Generating..." : "Generate key"}
          </button>
          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        </div>

        {state?.key && (
          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl bg-[var(--arch)] px-5 py-4">
            <span className="text-sm text-mute">New key</span>
            <span className="select-all font-mono text-base font-semibold text-brand">{state.key}</span>
            <CopyButton text={state.key} />
          </div>
        )}
      </form>
    </details>
  );
}
