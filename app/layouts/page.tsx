import type { Metadata } from "next";
import Link from "next/link";
import { presets, site, pageMeta } from "../site";
import { Badge, PageHead, btnBrand, btnDark, wrap } from "../ui";

export const metadata: Metadata = pageMeta("/layouts");

export default function Layouts() {
  return (
    <main>
      <PageHead
        title="26 layouts."
        accent="One click each."
        sub="Pick a tile count, then a visual preset. The count and the preset list always stay in sync. Free includes 9 presets; Pro adds 17 more and raises the limit from 5 to 12 tiles."
      />

      <section className={`${wrap} grid gap-4 pb-12 sm:grid-cols-3`}>
        <div className="rounded-3xl bg-ink p-8 text-white"><p className="text-5xl font-semibold">9</p><p className="mt-2 text-sm text-white/60">Free presets, 2–5 tiles</p></div>
        <div className="rounded-3xl bg-brand p-8 text-white"><p className="text-5xl font-semibold">26</p><p className="mt-2 text-sm text-white/70">Presets with Pro, 2–12 tiles</p></div>
        <div className="rounded-3xl border border-line bg-white p-8"><p className="text-5xl font-semibold">9</p><p className="mt-2 text-sm text-mute">Ready-made block patterns under Patterns → Bento Grid</p></div>
      </section>

      <section className={`${wrap} pb-16`}>
        <div className="overflow-hidden rounded-3xl border border-line bg-white">
          {presets.map((g) => (
            <div key={g.n} className="grid gap-4 border-b border-line p-6 last:border-0 sm:grid-cols-[140px_1fr] sm:p-8">
              <div>
                <p className="text-4xl font-semibold">{g.n}</p>
                <p className="text-xs uppercase tracking-widest text-mute">tiles</p>
              </div>
              <div className="flex flex-wrap content-start gap-2">
                {g.free.map((p) => (
                  <span key={p} className="inline-flex items-center gap-2 rounded-full bg-bg px-4 py-2 text-sm">{p}</span>
                ))}
                {g.pro.map((p) => (
                  <span key={p} className="inline-flex items-center gap-2 rounded-full bg-[var(--arch)] px-4 py-2 text-sm">
                    {p} <Badge pro />
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={`${wrap} pb-24`}>
        <div className="rounded-3xl border border-line bg-white p-8 sm:p-10">
          <h2 className="text-2xl font-semibold tracking-tight">Finished from the first click</h2>
          <p className="mt-3 max-w-2xl text-mute">
            Patterns come with styled text and gradients, so a new section looks complete before you add images. In an empty grid, “Fill empty tiles” adds demo titles, captions and gradients without overwriting tiles you’ve already edited.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={site.freeUrl} className={btnDark}>Get free</a>
            <Link href="/pricing/" className={btnBrand}>Unlock all 26</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
