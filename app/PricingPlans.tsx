"use client";

import { useState } from "react";
import { compare, freeFeatures, proFeatures, site, tiers, type Billing } from "./site";
import { Badge } from "./ui";
import { EarlyAccessButton } from "./EarlyAccess";

function Check({ light }: { light?: boolean }) {
  return (
    <svg className={`mt-0.5 h-4 w-4 shrink-0 ${light ? "text-white" : "text-brand"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-10" /></svg>
  );
}

const options: { id: Billing; label: string }[] = [
  { id: "monthly", label: "Monthly" },
  { id: "annual", label: "Annual" },
  { id: "lifetime", label: "Lifetime" },
];

const unit: Record<Billing, string> = { monthly: "/month", annual: "/year", lifetime: " once" };
const note: Record<Billing, string> = {
  monthly: "Billed monthly. Flexible.",
  annual: "Billed yearly. Best for most sites.",
  lifetime: "One payment. No renewals, ever.",
};

export function PricingPlans() {
  const [b, setB] = useState<Billing>("annual");

  return (
    <div>
      <div className="flex justify-center">
        <div role="tablist" className="inline-flex rounded-full border border-line bg-white p-1">
          {options.map((o) => (
            <button
              key={o.id}
              role="tab"
              aria-selected={b === o.id}
              onClick={() => setB(o.id)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                b === o.id ? "bg-ink text-white" : "text-mute hover:text-ink"
              }`}
            >
              {o.label}
              {o.id === "annual" && (
                <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${b === o.id ? "bg-brand text-white" : "bg-[var(--arch)] text-brand"}`}>
                  Save ~40%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-mute">{note[b]}</p>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="flex flex-col rounded-[28px] border border-line bg-white p-8">
          <p className="text-sm font-medium text-mute">Free</p>
          <p className="mt-4 text-6xl font-semibold tracking-tight">$0</p>
          <p className="mt-2 h-5 text-sm text-mute">Free on WordPress.org</p>
          <p className="mt-6 border-t border-line pt-6 text-sm font-medium">Use on your sites</p>
          <ul className="mt-5 flex-1 space-y-3 text-sm">
            {freeFeatures.map((f) => (<li key={f} className="flex gap-3"><Check />{f}</li>))}
          </ul>
          <a href={site.freeUrl} className="mt-8 inline-flex items-center justify-center rounded-full border border-ink/15 bg-white px-6 py-3 text-sm font-medium transition-transform hover:-translate-y-0.5 hover:border-ink">Download free</a>
        </div>
        {tiers.map((t) => {
          const isFree = t.slug === "personal";
          const price = isFree ? 0 : t.price[b];
          const yearly = t.price.monthly * 12;
          const perMonth = (t.price.annual / 12).toFixed(2).replace(/\.00$/, "");
          const save = Math.round((1 - t.price.annual / yearly) * 100);
          return (
            <div
              key={t.slug}
              className={`flex flex-col rounded-[28px] p-8 ${t.featured ? "text-white" : "border border-line bg-white"}`}
              style={t.featured ? { background: "linear-gradient(145deg,#3560d8,#1d2b64)" } : undefined}
            >
              <div className="flex items-center justify-between">
                <p className={`text-sm font-medium ${t.featured ? "text-white/70" : "text-mute"}`}>{t.name}</p>
                {t.slug === "personal" ? (
                  <span className="rounded-full bg-[var(--arch)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-brand">Early access</span>
                ) : (
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${t.featured ? "bg-white text-brand" : "bg-[var(--arch)] text-brand"}`}>Coming soon</span>
                )}
              </div>
              <p className="mt-4 text-6xl font-semibold tracking-tight">
                ${price}
                <span className={`text-lg font-medium ${t.featured ? "text-white/60" : "text-mute"}`}>{isFree ? "/year" : unit[b]}</span>
              </p>
              <p className={`mt-2 h-5 text-sm ${t.featured ? "text-white/70" : "text-mute"}`}>
                {isFree && "Free for 1 year, early access"}
                {!isFree && b === "annual" && `$${perMonth}/month, save ${save}%`}
                {!isFree && b === "monthly" && "Pay month to month"}
                {!isFree && b === "lifetime" && "Pay once. Yours for life."}
              </p>
              <p className={`mt-6 border-t pt-6 text-sm font-medium ${t.featured ? "border-white/20" : "border-line"}`}>{t.sites}</p>
              <ul className="mt-5 flex-1 space-y-3 text-sm">
                {proFeatures.map((f) => (<li key={f} className="flex gap-3"><Check light={t.featured} />{f}</li>))}
              </ul>
              {t.slug === "personal" ? (
                <EarlyAccessButton className="mt-8 inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5" />
              ) : (
                <span
                  aria-disabled="true"
                  className={`mt-8 inline-flex cursor-not-allowed items-center justify-center rounded-full px-6 py-3 text-sm font-medium ${
                    t.featured ? "bg-white/20 text-white" : "bg-ink/10 text-mute"
                  }`}
                >
                  Coming soon
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col items-start gap-4 rounded-3xl bg-[var(--arch)] p-6 sm:flex-row sm:items-center sm:p-8">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-brand">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" /><path d="M9 12l2 2 4-4" /></svg>
        </span>
        <div>
          <p className="font-semibold">30-day money-back guarantee</p>
          <p className="mt-1 text-sm text-ink/70">Not satisfied for any reason? Request a refund within 30 days of purchase.</p>
        </div>
        <a
          href={`mailto:${site.email}?subject=${encodeURIComponent("Refund request")}`}
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 sm:ml-auto"
        >
          Send email
        </a>
      </div>

      <div className="mt-20">
        <h2 className="mb-8 text-3xl font-semibold tracking-tight">Compare Free and Pro</h2>
        <div className="overflow-hidden rounded-3xl border border-line bg-white">
          <div className="grid grid-cols-[1.6fr_1fr_1fr] border-b border-line bg-bg px-6 py-4 sm:px-10">
            <span /><Badge /><Badge pro />
          </div>
          {compare.map(([name, free, pro]) => (
            <div key={name} className="grid grid-cols-[1.6fr_1fr_1fr] items-center gap-2 border-b border-line px-6 py-5 text-sm last:border-0 sm:px-10">
              <span className="font-medium">{name}</span>
              <span className="text-mute">{free}</span>
              <span className="font-medium text-brand">{pro}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
