import type { Metadata } from "next";
import { PricingPlans } from "../PricingPlans";
import { allFaq, pageMeta, siteUrl, tiers } from "../site";
import { JsonLd } from "../JsonLd";
import { Faq, PageHead, wrap } from "../ui";

export const metadata: Metadata = pageMeta("/pricing");

export default function Pricing() {
  return (
    <main>
      <JsonLd data={[
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: allFaq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteUrl }, { "@type": "ListItem", position: 2, name: "Pricing", item: `${siteUrl}/pricing` }] },
        ...tiers.map((t) => ({ "@context": "https://schema.org", "@type": "Product", name: `BoldSpan Bento Grid Pro, ${t.name} (${t.sites})`, description: `Bento Grid Pro licence for ${t.sites}.`, brand: { "@type": "Brand", name: "BoldSpan" }, offers: { "@type": "Offer", price: t.price.monthly, priceCurrency: "USD", availability: "https://schema.org/InStock", url: `${siteUrl}/pricing` } })),
      ]} />
      <PageHead
        title="Start free."
        accent="Upgrade when ready."
        sub="The free plugin is useful on its own. Pro is an add-on that needs the free plugin active. Pick how many sites, then how you want to pay."
      />

      <section className={`${wrap} pb-16`}>
        <PricingPlans />
      </section>

      <section className={`${wrap} pb-20`}>
        <div className="rounded-3xl bg-[var(--arch)] p-8 sm:p-10">
          <p className="text-xl font-semibold">Your site never breaks.</p>
          <p className="mt-2 max-w-2xl text-sm text-ink/70">
            If your plan ends or Pro is removed, published grids keep their saved content and markup. Pro-only controls lock again and Free layouts and effects keep working.
          </p>
        </div>
      </section>

      <section className={`${wrap} pb-24`}>
        <h2 className="mb-8 text-3xl font-semibold tracking-tight">Questions</h2>
        <Faq items={allFaq} />
      </section>
    </main>
  );
}
