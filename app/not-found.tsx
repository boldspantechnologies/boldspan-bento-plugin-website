import type { Metadata } from "next";
import Link from "next/link";
import { site } from "./site";
import { btnDark, btnLight, wrap } from "./ui";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: true } };

const links: [string, string][] = [
  ["/features", "Features"],
  ["/layouts", "Layouts"],
  ["/effects", "Effects"],
  ["/docs", "Docs"],
  ["/pricing", "Pricing"],
  ["/contact", "Contact"],
];

export default function NotFound() {
  return (
    <main className="glow-top">
      <section className={`${wrap} pb-24 pt-20 text-center sm:pt-28`}>
        <p className="text-sm font-semibold text-brand">Error 404</p>
        <h1 className="display mt-4 text-7xl font-semibold tracking-tight sm:text-9xl">
          4<span className="text-brand">0</span>4
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-mute">
          This page does not exist or has moved. Try one of the links below, or head back home.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/" className={btnDark}>Back to home</Link>
          <a href={site.freeUrl} className={btnLight}>Get the free plugin</a>
        </div>
        <nav aria-label="Popular pages" className="mx-auto mt-12 flex max-w-xl flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-medium">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="underline decoration-brand decoration-2 underline-offset-4">{label}</Link>
          ))}
        </nav>
      </section>
    </main>
  );
}
