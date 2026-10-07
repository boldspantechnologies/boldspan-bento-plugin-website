import type { Metadata } from "next";
import { site, pageMeta } from "../site";
import { PageHead, wrap } from "../ui";

export const metadata: Metadata = pageMeta("/docs");

type Sec = { id: string; h: string; intro?: string; list?: string[]; ordered?: boolean; more?: { h: string; list: string[] }[] };

const sections: Sec[] = [
  {
    id: "requirements",
    h: "Requirements",
    list: ["WordPress 6.4 or newer", "PHP 7.4 or newer", "Elementor is optional; use its current supported version"],
  },
  {
    id: "install",
    h: "Install the free plugin",
    more: [
      { h: "From WordPress.org", list: ["Plugins → Add New, search “BoldSpan Bento Grid”", "Install Now, then Activate", "Open Bento Grid in the admin menu for the three-step quick start"] },
      { h: "From a ZIP", list: ["Plugins → Add New → Upload Plugin", "Select the ZIP, Install Now, then Activate Plugin", "Or extract the boldspan-bento-grid folder into wp-content/plugins/ and activate it"] },
    ],
  },
  {
    id: "first-grid",
    h: "Create your first grid",
    more: [
      { h: "Gutenberg", list: ["Edit a page or post", "Insert Bento Grid, or a pattern from Patterns → Bento Grid", "Choose the tile count and a preset", "Select a tile: add an image, title, caption, link or inner blocks", "Adjust spacing, colours, text position and hover effects", "Publish or update"] },
      { h: "Elementor", list: ["Edit the page with Elementor", "Search “Bento Grid” in the BoldSpan Bento category and drag it in", "Choose a preset and configure the tile repeater", "Add content, links, styling and effects", "Update"] },
    ],
  },
  {
    id: "buy-pro",
    h: "Buy and install Pro",
    list: [
      `Buy Bento Grid Pro on this site and keep the licence key from your purchase`,
      "Download the Pro add-on ZIP",
      "Keep the free plugin installed and active, as Pro needs it",
      "Plugins → Add New → Upload Plugin, select the Pro ZIP, Install Now, Activate Plugin",
      "Upload the ZIP exactly as supplied; don’t merge files into the free plugin by hand",
    ],
    ordered: true,
  },
  {
    id: "activate",
    h: "Activate your licence",
    intro: "Installed isn’t the same as licensed: Pro controls stay locked until the key is activated.",
    list: [
      "Open Bento Grid → Pro licence",
      "Enter your licence key and submit",
      "The add-on checks the key and your site URL with the licensing service",
      "On success Pro unlocks in Gutenberg and Elementor; reload the editor if it was open",
    ],
    ordered: true,
  },
  {
    id: "move",
    h: "Deactivate or move a licence",
    intro: "A licence is intended for one active production site. Localhost and supported staging domains don’t use the production activation.",
    list: ["Open Bento Grid → Pro licence", "Choose Deactivate licence before moving the site or reusing the key", "Activate the key on the new domain", "A revoked, expired or moved licence returns the site to Free limits"],
  },
  {
    id: "expiry",
    h: "If Pro is removed or expires",
    list: ["Existing Gutenberg content isn’t rewritten", "Published grids keep their saved content and markup", "Elementor grids fall back to the Free layout with the same tile count", "Pro-only controls lock again; Free layouts and effects keep working"],
  },
  {
    id: "troubleshooting",
    h: "Troubleshooting",
    more: [
      { h: "Pro controls are still locked", list: ["Confirm both plugins are active", "Confirm the licence screen reports an active licence on this site", "Reload the editor", "If the site URL changed, deactivate and reactivate the key"] },
      { h: "Widget missing in Elementor", list: ["Confirm Elementor is installed and active", "Check the WordPress and PHP requirements", "Look under the BoldSpan Bento category"] },
      { h: "A grid looks different after Pro changes", list: ["Check Pro is active and the licence is valid", "An expired or removed add-on falls back to Free behaviour without deleting saved content"] },
    ],
    intro: `Still stuck? Email ${site.email}. Pro customers get priority replies.`,
  },
];

function List({ items, ordered }: { items: string[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={`mt-4 space-y-2 pl-5 text-mute ${ordered ? "list-decimal" : "list-disc"} marker:text-brand`}>
      {items.map((t) => (<li key={t} className="pl-1 leading-relaxed">{t}</li>))}
    </Tag>
  );
}

export default function Docs() {
  return (
    <main>
      <PageHead title="Docs." sub="Install, build, go Pro. Everything you need in one place." />
      <div className={`${wrap} grid gap-12 pb-24 lg:grid-cols-[220px_1fr]`}>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-mute lg:flex-col">
            {sections.map((s) => (
              <li key={s.id}><a href={`#${s.id}`} className="hover:text-ink">{s.h}</a></li>
            ))}
          </ul>
        </aside>
        <div className="max-w-2xl space-y-14">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <p className="text-sm font-semibold text-brand">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">{s.h}</h2>
              {s.intro && <p className="mt-3 text-mute">{s.intro}</p>}
              {s.list && <List items={s.list} ordered={s.ordered} />}
              {s.more?.map((m) => (
                <div key={m.h} className="mt-6">
                  <h3 className="font-semibold">{m.h}</h3>
                  <List items={m.list} />
                </div>
              ))}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
