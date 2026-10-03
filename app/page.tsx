import Image from "next/image";
import Link from "next/link";
import { BentoDemo } from "./BentoDemo";
import { Mini } from "./Mini";
import { gallery } from "./bento-data";
import { faq, site, steps } from "./site";
import { Faq, btn, btnDark, btnLight, wrap } from "./ui";

const facts = ["Gutenberg + Elementor", "Responsive by default", "No jQuery for Free effects", "WordPress 6.4+"];

const freeList = ["2–5 tiles per grid", "9 layout presets + 9 patterns", "Colours, gradients, borders, overlays", "Lift, image zoom & glow hovers", "Gutenberg and Elementor", "Community support"];
const proList = ["Everything in Free", "2–12 tiles per grid", "26 layout presets", "Glass tiles", "3D tilt, reveal, border glow, spotlight", "Fade, slide & zoom scroll reveals", "Priority email support"];

function Eyebrow({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return <p className={`text-sm font-semibold ${dark ? "text-[#8fb2ff]" : "text-brand"}`}>{children}</p>;
}

function Check({ dark }: { dark?: boolean }) {
  return (
    <svg className={`mt-0.5 h-4 w-4 shrink-0 ${dark ? "text-white" : "text-brand"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l5 5 9-10" />
    </svg>
  );
}

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="glow-top">
        <div className={`${wrap} pb-20 pt-16 text-center sm:pt-24`}>
          <Link href="/pricing/" className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 text-xs font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" /> Pro 1.0 is out
          </Link>
          <h1 className="mx-auto mt-8 max-w-5xl text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
            Bento grids for WordPress, <span className="text-brand">built in a minute.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-mute">
            Pick a layout, fill the tiles, publish. Works in Gutenberg and Elementor.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href={site.freeUrl} className={btnDark}>Get the free plugin</a>
            <Link href="/pricing/" className={btnLight}>Go Pro for {site.price.pro}{site.price.unit}</Link>
          </div>

          <div className="mx-auto mt-16 max-w-5xl text-left">
            <BentoDemo />
            <p className="mt-4 text-center text-xs text-mute">Live demo. Switch layouts above.</p>
          </div>
        </div>
      </section>

      {/* FACTS */}
      <section className="border-y border-line bg-white">
        <div className={`${wrap} grid grid-cols-2 divide-x divide-line md:grid-cols-4`}>
          {facts.map((f) => (
            <p key={f} className="px-4 py-6 text-center text-sm font-medium">{f}</p>
          ))}
        </div>
      </section>

      {/* LAYOUTS */}
      <section className="bg-white py-24">
        <div className={wrap}>
          <div className="grid items-end gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <Eyebrow>Layouts</Eyebrow>
              <h2 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">26 layouts. One click each.</h2>
              <p className="mt-5 max-w-lg text-mute">Choose a tile count, then a visual preset. The count and the preset list always stay in sync.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-bg p-5">
                <p className="text-4xl font-semibold tracking-tight">9</p>
                <p className="mt-1 text-sm text-mute">Free · 2–5 tiles</p>
              </div>
              <div className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(145deg,#3560d8,#1d2b64)" }}>
                <p className="text-4xl font-semibold tracking-tight">+17</p>
                <p className="mt-1 text-sm text-white/70">Pro · up to 12 tiles</p>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((p) => (<Mini key={p.id} p={p} />))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-mute">Illustrative previews. Plus 9 ready-made block patterns, styled and ready to publish.</p>
            <Link href="/layouts/" className={btnDark}>Browse all 26 layouts</Link>
          </div>
        </div>
      </section>

      {/* STYLE */}
      <section className="bg-bg py-24">
        <div className={`${wrap} grid items-center gap-14 lg:grid-cols-[1.2fr_1fr]`}>
          <div className="order-2 grid grid-cols-3 gap-3 lg:order-1">
            <div className="col-span-2 flex h-44 items-end rounded-3xl p-5 text-white" style={{ background: "linear-gradient(135deg,#3560d8,#6ea0f5)" }}>
              <span className="text-xl font-semibold">Gradient</span>
            </div>
            <div className="flex h-44 items-end rounded-3xl bg-ink p-5 text-white"><span className="font-semibold">Solid</span></div>
            <div className="flex h-44 items-end rounded-3xl border-2 border-brand bg-white p-5"><span className="font-semibold">Border</span></div>
            <div className="relative col-span-2 h-44 overflow-hidden rounded-3xl bg-[#2b46b8] p-3">
              <span className="absolute -left-2 -top-6 h-36 w-36 rounded-full bg-[#8fb2ff] blur-2xl" />
              <span className="absolute right-4 top-0 h-28 w-28 rounded-full bg-[#ff8fe0] blur-2xl" />
              <span className="absolute -bottom-6 left-1/3 h-32 w-32 rounded-full bg-[#6fe8ff] blur-2xl" />
              <div className="relative flex h-full items-end justify-between rounded-2xl border border-white/40 bg-white/15 p-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.5),0_8px_30px_-8px_rgba(0,0,0,.4)] backdrop-blur-xl">
                <span className="text-xl font-semibold">Glass</span>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-brand">Pro</span>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <Eyebrow>Styling</Eyebrow>
            <h2 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Looks finished before the images arrive.</h2>
            <ul className="mt-6 space-y-3 text-mute">
              {["Colours, gradients and borders per tile", "Image overlay shade for readable text", "Title position on a 3 × 3 grid", "Row height, gap, radius, padding and margin"].map((t) => (
                <li key={t} className="flex gap-3"><Check />{t}</li>
              ))}
            </ul>
            <Link href="/features/" className="mt-8 inline-flex text-sm font-medium underline underline-offset-4 hover:text-brand">All features →</Link>
          </div>
        </div>
      </section>

      {/* MOTION */}
      <section className="bg-ink py-24 text-white">
        <div className={`${wrap} grid items-center gap-14 lg:grid-cols-[1fr_1.2fr]`}>
          <div>
            <Eyebrow dark>Effects</Eyebrow>
            <h2 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Subtle motion, big polish.</h2>
            <p className="mt-5 max-w-md text-white/60">
              Lift, zoom and glow are free and CSS-only. Pro adds 3D tilt, hover reveal, border glow, spotlight and scroll reveals.
            </p>
            <Link href="/effects/" className={`${btn} mt-8 bg-white text-ink`}>See the effects</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[["demo-lift", "Lift", "bg-brand"], ["demo-zoom", "Zoom", "bg-white/10"], ["demo-glow", "Glow", "bg-white/10"]].map(([c, n, bg]) => (
              <div key={n} className={`demo ${c} ${bg}`}>
                <div className="demo-in flex h-44 items-end p-5"><span className="text-lg font-semibold">{n}</span></div>
              </div>
            ))}
            <p className="text-xs text-white/40 sm:col-span-3">Hover the tiles. Reduced-motion preferences are respected.</p>
          </div>
        </div>
      </section>

      {/* FREE VS PRO */}
      <section className="bg-white py-24">
        <div className={wrap}>
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>Free &amp; Pro</Eyebrow>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Start free. Grow into Pro.</h2>
          </div>
          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            <div className="rounded-[28px] border border-line bg-bg p-8 sm:p-12">
              <p className="text-sm font-medium text-mute">Free</p>
              <p className="mt-2 text-6xl font-semibold tracking-tight">$0</p>
              <ul className="mt-8 space-y-3 text-sm">
                {freeList.map((t) => (<li key={t} className="flex gap-3"><Check />{t}</li>))}
              </ul>
              <a href={site.freeUrl} className={`${btnDark} mt-10`}>Download free</a>
            </div>
            <div className="rounded-[28px] bg-brand p-8 text-white sm:p-12" style={{ background: "linear-gradient(145deg,#3560d8,#1d2b64)" }}>
              <p className="text-sm font-medium text-white/70">Pro</p>
              <p className="mt-2 text-6xl font-semibold tracking-tight">{site.price.pro}<span className="text-xl font-medium text-white/60">{site.price.unit}</span></p>
              <ul className="mt-8 space-y-3 text-sm">
                {proList.map((t) => (<li key={t} className="flex gap-3"><Check dark />{t}</li>))}
              </ul>
              <Link href="/pricing/" className={`${btn} mt-10 bg-white text-ink`}>Get Pro</Link>
              <p className="mt-4 text-xs text-white/60">30-day money-back guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="bg-bg py-24">
        <div className={wrap}>
          <h2 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">From install to published in four steps.</h2>
          <div className="relative mt-14 grid gap-10 md:grid-cols-4">
            <div className="absolute left-0 right-0 top-5 hidden h-px bg-line md:block" />
            {steps.map((d) => (
              <div key={d.n} className="relative">
                <span className="relative grid h-10 w-10 place-items-center rounded-full bg-ink text-sm font-semibold text-white">{d.n}</span>
                <h3 className="mt-6 text-lg font-semibold">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{d.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex gap-6 text-sm font-medium">
            <Link href="/docs/" className="underline underline-offset-4 hover:text-brand">Read the docs →</Link>
            <Link href="/videos/" className="underline underline-offset-4 hover:text-brand">Watch the videos →</Link>
          </div>
        </div>
      </section>

      {/* PROMISE */}
      <section className="bg-white py-24">
        <div className={`${wrap} text-center`}>
          <p className="mx-auto max-w-4xl text-3xl font-semibold leading-snug tracking-tight sm:text-5xl">
            “Your site never breaks. If a licence expires, published grids <span className="text-brand">keep working.</span>”
          </p>
          <Link href="/about/" className="mt-8 inline-flex text-sm font-medium underline underline-offset-4 hover:text-brand">About BentoGrid →</Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-line bg-bg py-24">
        <div className={`${wrap} grid gap-12 lg:grid-cols-[1fr_1.6fr]`}>
          <div>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">Questions</h2>
            <p className="mt-4 text-mute">Or email <a href={`mailto:${site.email}`} className="text-brand underline underline-offset-4">{site.email}</a></p>
          </div>
          <Faq items={faq} />
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-6 pt-6 sm:px-6">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] px-6 pt-20 text-center text-white sm:px-10" style={{ background: "linear-gradient(160deg,#3560d8,#1d2b64)" }}>
          <h2 className="mx-auto max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">Make your next section a bento.</h2>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href={site.freeUrl} className={`${btn} bg-white text-ink`}>Get the free plugin</a>
            <Link href="/pricing/" className={`${btn} border border-white/30 text-white`}>See Pro plans</Link>
          </div>
          <div className="mx-auto mt-16 max-w-5xl overflow-hidden rounded-t-3xl">
            <Image src="/banner-1544x500.png" alt="BoldSpan Bento Grid: build stunning and modern bento grids for WordPress" width={1544} height={500} className="h-auto w-full" />
          </div>
        </div>
      </section>
    </main>
  );
}
