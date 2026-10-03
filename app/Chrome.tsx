import Link from "next/link";
import { site } from "./site";
import { wrap } from "./ui";

const links = [
  { href: "/features/", label: "Features" },
  { href: "/layouts/", label: "Layouts" },
  { href: "/effects/", label: "Effects" },
  { href: "/pricing/", label: "Pricing" },
  { href: "/docs/", label: "Docs" },
  { href: "/videos/", label: "Videos" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur">
      <nav className={`${wrap} flex h-16 items-center justify-between gap-6 text-sm`}>
        <Link href="/" className="flex items-center gap-3" aria-label={site.name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon-256x256.gif" alt="" width={32} height={32} className="h-8 w-8 rounded-lg" />
          <span className="font-semibold">{site.name}</span>
        </Link>

        <div className="hidden gap-8 text-mute md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-ink">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a href={site.freeUrl} className="rounded-full bg-ink px-4 py-2 text-white">
            Get free
          </a>
          <details className="relative md:hidden">
            <summary className="cursor-pointer list-none rounded-full border border-line bg-white px-4 py-2">Menu</summary>
            <div className="absolute right-0 top-12 flex w-44 flex-col gap-1 rounded-2xl border border-line bg-white p-2 shadow-lg">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="rounded-xl px-3 py-2 hover:bg-bg">
                  {l.label}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}

export function Footer() {
  const cols = [
    { h: "Product", items: [["Features", "/features/"], ["Layouts", "/layouts/"], ["Effects", "/effects/"], ["Pricing", "/pricing/"]] },
    { h: "Learn", items: [["Docs", "/docs/"], ["Videos", "/videos/"], ["About", "/about/"], ["Contact", "/contact/"]] },
    { h: "Legal", items: [["Terms", "/terms/"], ["Privacy", "/privacy/"], ["Refunds", "/refund-policy/"]] },
  ];
  return (
    <footer className="border-t border-line bg-white">
      <div className={`${wrap} grid gap-10 py-14 text-sm sm:grid-cols-[1.5fr_repeat(3,1fr)]`}>
        <div>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon-256x256.gif" alt="" width={32} height={32} className="h-8 w-8 rounded-lg" />
            <p className="font-semibold">{site.name}</p>
          </div>
          <a href={`mailto:${site.email}`} className="mt-3 inline-block text-mute hover:text-ink">
            {site.email}
          </a>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <p className="mb-3 text-xs uppercase tracking-widest text-mute">{c.h}</p>
            <ul className="space-y-2">
              {c.items.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-brand">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className={`${wrap} pb-8 text-xs text-mute`}>
        © {new Date().getFullYear()} {site.name}
      </p>
    </footer>
  );
}
