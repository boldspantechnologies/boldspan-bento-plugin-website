import type { Metadata } from "next";
import Link from "next/link";
import { comingSoon, compare, site } from "../site";
import { Badge, PageHead, btnBrand, btnDark, wrap } from "../ui";

export const metadata: Metadata = { title: "Features | BoldSpan Bento Grid" };

const blocks: { h: string; p: string; items: string[]; pro?: boolean }[] = [
  {
    h: "Grid controls",
    p: "Set up the whole section visually. No CSS required.",
    items: ["Row height 80px–480px, or treat it as a minimum so long content grows", "Padding and margin, linked or per side", "Visual gap and corner-radius controls", "Grid background colour"],
  },
  {
    h: "Tile content",
    p: "Each tile is as simple or as custom as you want.",
    items: ["Image with overlaid text, or separate image and text", "Any Gutenberg blocks: buttons, lists, icons, embeds", "Title and caption, title level H2–H6 or plain paragraph", "Whole-tile link with new-tab and nofollow options"],
  },
  {
    h: "Tile styling",
    p: "Make it look finished before the images arrive.",
    items: ["Background colour or linear-gradient()", "Text colour, border width and colour", "Adjustable image overlay shade for readable text", "Title position on a 3 × 3 grid"],
  },
  {
    h: "Glass tiles",
    p: "A frosted, translucent surface with background blur.",
    items: ["Works with the tile’s existing content and layout", "Combine with any hover effect"],
    pro: true,
  },
  {
    h: "Responsive by default",
    p: "Same breakpoints in the editor and on the live page.",
    items: ["Under 768px: one column", "768–1024px: 4- and 5-tile layouts step to two columns", "Follows normal, wide and full-width containers"],
  },
  {
    h: "Fast and accessible",
    p: "Clean output that respects your visitors.",
    items: ["Static, cache-friendly markup, no jQuery for Free effects", "Stylesheet loads only on pages with a grid", "Reduced-motion preference respected", "URLs, CSS and numbers validated before output"],
  },
];

export default function Features() {
  return (
    <main>
      <PageHead
        title="Everything in"
        accent="the grid."
        sub="Responsive, modern tile sections that work in Gutenberg and Elementor. The free plugin is useful on its own; Pro adds scale and motion."
      />

      <section className={`${wrap} grid gap-4 pb-16 md:grid-cols-2 lg:grid-cols-3`}>
        {blocks.map((b) => (
          <div key={b.h} className="rounded-3xl border border-line bg-white p-8">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">{b.h}</h2>
              {b.pro && <Badge pro />}
            </div>
            <p className="mt-2 text-sm text-mute">{b.p}</p>
            <ul className="mt-6 space-y-2.5 text-sm">
              {b.items.map((i) => (
                <li key={i} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className={`${wrap} pb-16`}>
        <h2 className="mb-8 text-3xl font-semibold tracking-tight">Free vs Pro</h2>
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
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={site.freeUrl} className={btnDark}>Get free</a>
          <Link href="/pricing/" className={btnBrand}>Get Pro</Link>
        </div>
      </section>

      <section className={`${wrap} pb-24`}>
        <h2 className="text-3xl font-semibold tracking-tight">On the roadmap</h2>
        <p className="mt-2 text-mute">Not available yet in Free or Pro.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {comingSoon.map((c) => (
            <span key={c} className="rounded-full border border-dashed border-ink/25 px-4 py-2 text-sm text-mute">{c}</span>
          ))}
        </div>
      </section>
    </main>
  );
}
