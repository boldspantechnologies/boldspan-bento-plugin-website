export const btn =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-transform hover:-translate-y-0.5";
export const btnDark = `${btn} bg-ink text-white`;
export const btnLight = `${btn} border border-ink/15 bg-white text-ink hover:border-ink`;
export const btnBrand = `${btn} bg-brand text-white`;

export const wrap = "mx-auto max-w-7xl px-6 sm:px-10";

export function Dot() {
  return <span className="mr-3 inline-block h-1.5 w-1.5 rounded-full bg-brand" />;
}

export function Badge({ pro }: { pro?: boolean }) {
  return (
    <span className={`w-fit justify-self-start rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${pro ? "bg-brand text-white" : "bg-ink/10 text-ink"}`}>
      {pro ? "Pro" : "Free"}
    </span>
  );
}

export function PageHead({ title, accent, sub }: { title: string; accent?: string; sub?: string }) {
  return (
    <div className="glow-top mb-6"><section className={`${wrap} pb-14 pt-16 text-center`}>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
        {title} {accent && <span className="text-brand">{accent}</span>}
      </h1>
      {sub && <p className="mx-auto mt-6 max-w-2xl text-lg text-mute">{sub}</p>}
    </section></div>
  );
}

export function Faq({ items }: { items: [string, string][] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map(([q, a]) => (
        <details key={q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-medium">
            {q}
            <span className="text-xl transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mute">{a}</p>
        </details>
      ))}
    </div>
  );
}
