import type { Metadata } from "next";
import Link from "next/link";
import { site } from "../site";
import { PageHead, btnDark, btnLight, wrap } from "../ui";

export const metadata: Metadata = { title: "About | BoldSpan Bento Grid" };

const principles = [
  { h: "Simple", p: "A visual editor anyone can use. No code needed to build a modern layout." },
  { h: "Free to start", p: "The free plugin is on WordPress.org. Pro is there when you want more." },
  { h: "Your site never breaks", p: "If a Pro licence expires, published grids keep their layouts and effects." },
  { h: "Real support", p: `A real inbox, not a ticket maze: ${site.email}.` },
];

export default function About() {
  return (
    <main>
      <PageHead title="About" accent="BoldSpan." />

      <section className={`${wrap} grid gap-4 pb-4 lg:grid-cols-3`}>
        <div className="rounded-3xl bg-ink p-8 text-white sm:p-12 lg:col-span-2">
          <p className="text-xs uppercase tracking-widest text-white/50">What we make</p>
          <p className="mt-4 text-2xl font-semibold leading-snug sm:text-3xl">
            BoldSpan Bento Grid is a WordPress plugin, made by BoldSpan, for building highly customizable bento box layouts, the clean tile grids you see on modern sites, without writing code.
          </p>
        </div>
        <div className="flex flex-col justify-between rounded-3xl bg-brand p-8 text-white">
          <p className="text-xs uppercase tracking-widest text-white/70">Why</p>
          <p className="mt-8 text-xl font-semibold leading-snug">Great layouts should take minutes, not a developer.</p>
        </div>
      </section>

      <section className={`${wrap} grid gap-4 pb-4 sm:grid-cols-2 lg:grid-cols-4`}>
        {principles.map((x) => (
          <div key={x.h} className="rounded-3xl border border-line bg-white p-7">
            <h2 className="text-lg font-semibold">{x.h}</h2>
            <p className="mt-2 text-sm leading-relaxed text-mute">{x.p}</p>
          </div>
        ))}
      </section>

      <section className={`${wrap} pb-24 pt-4`}>
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-line bg-white p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Questions or ideas?</h2>
            <a href={`mailto:${site.email}`} className="mt-1 inline-block text-mute hover:text-brand">{site.email}</a>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={site.freeUrl} className={btnDark}>Get free</a>
            <Link href="/contact/" className={btnLight}>Contact</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
