import type { Metadata } from "next";
import Link from "next/link";
import { ProEffects } from "../ProEffects";
import { Badge, PageHead, btn, wrap } from "../ui";

export const metadata: Metadata = { title: "Effects | BoldSpan Bento Grid" };

const freeFx = [
  { cls: "demo-lift", name: "Lift", text: "The tile rises slightly on hover.", bg: "bg-brand text-white" },
  { cls: "demo-zoom", name: "Image zoom", text: "The tile image zooms in.", bg: "bg-ink text-white" },
  { cls: "demo-glow", name: "Glow", text: "A highlight glows around the tile.", bg: "bg-[var(--arch)]" },
];

const reveals = [
  ["Fade up", "Tiles fade in from below as the grid enters the viewport."],
  ["Slide in", "Tiles slide into place."],
  ["Zoom in", "Tiles scale up into view."],
];

export default function Effects() {
  return (
    <main>
      <PageHead
        title="Subtle motion."
        accent="Big polish."
        sub="Apply an effect to every tile from the grid settings, or fine-tune it per tile. Everything respects reduced-motion preferences."
      />

      <section className={`${wrap} pb-16`}>
        <div className="mb-6 flex items-center gap-3"><h2 className="text-2xl font-semibold">Hover effects</h2><Badge /></div>
        <p className="mb-6 text-sm text-mute">CSS only, no JavaScript. Try them:</p>
        <div className="grid gap-5 md:grid-cols-3">
          {freeFx.map((f) => (
            <div key={f.name} className={`demo ${f.cls} ${f.bg}`}>
              <div className="demo-in flex h-56 flex-col justify-end p-7">
                <p className="text-2xl font-semibold">{f.name}</p>
                <p className="mt-1 text-sm opacity-70">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={`${wrap} pb-16`}>
        <div className="mb-6 flex items-center gap-3"><h2 className="text-2xl font-semibold">More hover effects</h2><Badge pro /></div>
        <ProEffects />
        <p className="mt-4 text-sm text-mute">Hover each card to try it. Pro also lets you combine the available effects.</p>
      </section>

      <section className={`${wrap} pb-16`}>
        <div className="mb-6 flex items-center gap-3"><h2 className="text-2xl font-semibold">Scroll reveals</h2><Badge pro /></div>
        <div className="grid gap-4 md:grid-cols-3">
          {reveals.map(([n, t]) => (
            <div key={n} className="rounded-3xl border border-line bg-white p-7">
              <p className="text-xl font-semibold">{n}</p>
              <p className="mt-3 text-sm text-mute">{t}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={`${wrap} pb-24`}>
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-ink p-8 text-white sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-2xl font-semibold">Motion that stays out of the way</h2>
            <p className="mt-2 max-w-xl text-sm text-white/60">Visitors whose system asks for reduced motion get no animation, on Free and Pro.</p>
          </div>
          <Link href="/pricing/" className={`${btn} bg-white text-ink`}>Get Pro</Link>
        </div>
      </section>
    </main>
  );
}
