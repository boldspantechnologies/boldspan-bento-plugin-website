import type { Metadata } from "next";
import Link from "next/link";
import { adminConfigured, requireAdmin } from "../../lib/admin-auth";
import { prisma } from "../../lib/db";
import type { License } from "../../generated/prisma/client";
import { approveRequest, deactivateSite, deleteLicense, extend, logout, rejectRequest, resetActivations, saveNote, setMaxSites, setStatus } from "./actions";
import { CopyButton, SubmitButton } from "./controls";
import { IssueForm } from "./IssueForm";

export const metadata: Metadata = { title: "Admin | BoldSpan", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const DAY = 864e5;
const field = "rounded-xl border border-line bg-white px-3 py-1.5 text-sm outline-none focus:border-brand";
const date = (d: Date | null, empty = "Lifetime") => (d ? d.toISOString().slice(0, 10) : empty);
const hidden = (v: string) => <input type="hidden" name="id" value={v} />;

type Kind = "active" | "expiring" | "expired" | "revoked";

function kind(l: License): Kind {
  if (l.status === "revoked") return "revoked";
  if (l.expiresAt && l.expiresAt.getTime() < Date.now()) return "expired";
  if (l.expiresAt && l.expiresAt.getTime() - Date.now() < 30 * DAY) return "expiring";
  return "active";
}

const pill: Record<Kind, { label: string; cls: string }> = {
  active: { label: "Active", cls: "bg-green-100 text-green-700" },
  expiring: { label: "Expiring soon", cls: "bg-amber-100 text-amber-700" },
  expired: { label: "Expired", cls: "bg-red-100 text-red-700" },
  revoked: { label: "Revoked", cls: "bg-ink/10 text-ink/70" },
};

function remaining(l: License) {
  if (!l.expiresAt) return "Lifetime";
  const days = Math.ceil((l.expiresAt.getTime() - Date.now()) / DAY);
  if (days < 0) return `Expired ${-days}d ago`;
  if (days === 0) return "Expires today";
  return `${days} day${days === 1 ? "" : "s"} left`;
}

const filters: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "expiring", label: "Expiring" },
  { id: "expired", label: "Expired" },
  { id: "revoked", label: "Revoked" },
];

function Stat({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="rounded-3xl border border-line bg-white p-5">
      <p className="text-xs font-medium text-mute">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-xs text-mute">{hint}</p>}
    </div>
  );
}

export default async function Admin({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  if (!adminConfigured()) {
    return (
      <main className="mx-auto max-w-xl px-4 py-24">
        <h1 className="text-2xl font-semibold">Admin is not configured</h1>
        <p className="mt-3 text-sm text-mute">Set ADMIN_PASSWORD in .env, then restart the server.</p>
      </main>
    );
  }
  await requireAdmin();

  const sp = await searchParams;
  const q = (sp.q ?? "").trim().toLowerCase();
  const status = filters.some((f) => f.id === sp.status) ? sp.status! : "all";

  const [all, requests] = await Promise.all([
    prisma.license.findMany({ orderBy: { createdAt: "desc" }, include: { activations: { orderBy: { activatedAt: "desc" } } } }),
    prisma.earlyAccessRequest.findMany({ where: { status: "pending" }, orderBy: { createdAt: "asc" } }),
  ]);

  const kinds = all.map((l) => [l, kind(l)] as const);
  const count = (k: Kind) => kinds.filter(([, x]) => x === k).length;
  const liveSites = all.reduce((n, l) => n + l.activations.filter((a) => !a.deactivatedAt).length, 0);
  const rows = kinds
    .filter(([l, k]) => status === "all" || k === status)
    .filter(([l]) => !q || [l.key, l.email, l.name, l.note].some((v) => v.toLowerCase().includes(q)))
    .map(([l]) => l);

  const href = (s: string) => `/admin?${new URLSearchParams({ ...(q ? { q } : {}), ...(s !== "all" ? { status: s } : {}) })}`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Licences</h1>
          <p className="mt-1 text-sm text-mute">Generate keys, manage sites and review early-access requests.</p>
        </div>
        <form action={logout}><SubmitButton>Sign out</SubmitButton></form>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat label="Total licences" value={all.length} />
        <Stat label="Active" value={count("active") + count("expiring")} hint={`${count("expiring")} expiring in 30 days`} />
        <Stat label="Live sites" value={liveSites} />
        <Stat label="Expired / revoked" value={count("expired") + count("revoked")} />
        <Stat label="Pending requests" value={requests.length} />
      </div>

      <div className="mt-6"><IssueForm /></div>

      {requests.length > 0 && (
        <section className="mt-6 rounded-3xl border border-brand/30 bg-white p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            Early-access requests
            <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-semibold text-white">{requests.length}</span>
          </h2>
          <ul className="mt-3 divide-y divide-line text-sm">
            {requests.map((r) => (
              <li key={r.id} className="flex flex-wrap items-start gap-x-4 gap-y-3 py-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{r.email} <span className="font-normal text-mute">· {date(r.createdAt)}</span></p>
                  <p className="mt-1 whitespace-pre-wrap text-mute">{r.reason}</p>
                </div>
                <div className="flex gap-2">
                  <form action={approveRequest}>{hidden(r.id)}<SubmitButton variant="primary">Approve · 1 year key</SubmitButton></form>
                  <form action={rejectRequest}>{hidden(r.id)}<SubmitButton confirm="Reject this request?">Reject</SubmitButton></form>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <Link
              key={f.id}
              href={href(f.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${status === f.id ? "bg-ink text-white" : "border border-line bg-white text-mute hover:text-ink"}`}
            >
              {f.label}
            </Link>
          ))}
        </div>
        <form className="min-w-[220px] flex-1">
          {status !== "all" && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={q} placeholder="Search key, email, name or note" className={`${field} w-full rounded-full px-5 py-2.5`} />
        </form>
      </div>
      <p className="mt-3 text-xs text-mute">{rows.length} of {all.length} shown</p>

      <div className="mt-3 space-y-3">
        {rows.length === 0 && (
          <div className="rounded-3xl border border-dashed border-line bg-white py-16 text-center text-sm text-mute">
            {all.length === 0 ? "No licences yet. Generate your first one above." : "No licences match this filter."}
          </div>
        )}

        {rows.map((l) => {
          const k = kind(l);
          const live = l.activations.filter((a) => !a.deactivatedAt);
          const used = live.filter((a) => !a.isDev).length;
          const pct = l.maxSites ? Math.min(100, (used / l.maxSites) * 100) : 0;
          return (
            <details key={l.id} className="group rounded-3xl border border-line bg-white open:shadow-sm">
              <summary className="grid cursor-pointer list-none grid-cols-1 items-center gap-x-4 gap-y-2 px-5 py-4 sm:grid-cols-[1.3fr_1fr_auto_auto] sm:px-6">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-semibold">{l.key}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${pill[k].cls}`}>{pill[k].label}</span>
                  </div>
                  <p className="mt-1 truncate text-sm text-mute">{l.email}{l.name && ` · ${l.name}`}</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium capitalize">{l.plan}</p>
                  <p className="text-xs text-mute">{remaining(l)}</p>
                </div>
                <div className="w-28">
                  <p className="text-xs text-mute">{used}/{l.maxSites ?? "∞"} sites</p>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink/10">
                    <div className={`h-full rounded-full ${pct >= 100 ? "bg-amber-500" : "bg-brand"}`} style={{ width: `${l.maxSites ? pct : 0}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CopyButton text={l.key} label="Copy key" />
                  <span className="text-mute transition-transform group-open:rotate-180">▾</span>
                </div>
              </summary>

              <div className="space-y-6 border-t border-line px-5 py-5 text-sm sm:px-6">
                <dl className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
                  <div><dt className="text-mute">Expires</dt><dd className="mt-0.5 text-sm font-medium">{date(l.expiresAt)}</dd></div>
                  <div><dt className="text-mute">Created</dt><dd className="mt-0.5 text-sm font-medium">{date(l.createdAt)}</dd></div>
                  <div><dt className="text-mute">Source</dt><dd className="mt-0.5 text-sm font-medium capitalize">{l.source.replace("_", " ")}</dd></div>
                  <div><dt className="text-mute">Free dev sites</dt><dd className="mt-0.5 text-sm font-medium">{live.filter((a) => a.isDev).length}</dd></div>
                </dl>

                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-mute">Validity</p>
                  <div className="flex flex-wrap gap-2">
                    {[["30", "+30 days"], ["365", "+1 year"], ["lifetime", "Make lifetime"]].map(([days, label]) => (
                      <form key={days} action={extend}>{hidden(l.id)}<input type="hidden" name="days" value={days} /><SubmitButton>{label}</SubmitButton></form>
                    ))}
                    <form action={setStatus}>
                      {hidden(l.id)}
                      <input type="hidden" name="status" value={l.status === "active" ? "revoked" : "active"} />
                      {l.status === "active" ? (
                        <SubmitButton variant="danger" confirm="Revoke this licence? Sites lock at their next check.">Revoke</SubmitButton>
                      ) : (
                        <SubmitButton variant="primary">Un-revoke</SubmitButton>
                      )}
                    </form>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[auto_1fr]">
                  <form action={setMaxSites} className="flex items-center gap-2">
                    {hidden(l.id)}
                    <label className="text-xs text-mute">Max sites</label>
                    <input name="max_sites" defaultValue={l.maxSites ?? ""} placeholder="∞" className={`${field} w-20`} />
                    <SubmitButton>Save</SubmitButton>
                  </form>
                  <form action={saveNote} className="flex items-center gap-2">
                    {hidden(l.id)}
                    <input name="note" defaultValue={l.note} placeholder="Add a note" className={`${field} min-w-0 flex-1`} />
                    <SubmitButton>Save note</SubmitButton>
                  </form>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-wide text-mute">Sites ({live.length} live)</p>
                    {live.length > 0 && (
                      <form action={resetActivations}>{hidden(l.id)}<SubmitButton confirm="Deactivate every site on this key?">Reset all sites</SubmitButton></form>
                    )}
                  </div>
                  {l.activations.length === 0 ? (
                    <p className="rounded-2xl bg-bg px-4 py-3 text-mute">Not activated anywhere yet.</p>
                  ) : (
                    <ul className="divide-y divide-line rounded-2xl border border-line">
                      {l.activations.map((a) => (
                        <li key={a.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
                          <div className="min-w-0 flex-1">
                            <p className={`truncate font-medium ${a.deactivatedAt ? "text-mute line-through" : ""}`}>{a.siteId}</p>
                            <p className="text-xs text-mute">
                              {a.environment || "production"}{a.isDev && " · free dev site"} · Pro v{a.pluginVersion || "?"} · WP {a.wpVersion || "?"} · last check {date(a.lastCheckAt, "never")}
                            </p>
                          </div>
                          {a.deactivatedAt ? (
                            <span className="text-xs text-mute">Deactivated {date(a.deactivatedAt)}</span>
                          ) : (
                            <form action={deactivateSite}>
                              {hidden(l.id)}<input type="hidden" name="aid" value={a.id} />
                              <SubmitButton confirm={`Deactivate ${a.siteId}? It locks at its next check.`}>Deactivate</SubmitButton>
                            </form>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex justify-end border-t border-line pt-4">
                  <form action={deleteLicense}>
                    {hidden(l.id)}
                    <SubmitButton variant="danger" confirm="Permanently delete this licence and its site history?">Delete licence</SubmitButton>
                  </form>
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </main>
  );
}
