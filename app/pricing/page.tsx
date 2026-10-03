import type { Metadata } from "next";
import { PricingPlans } from "../PricingPlans";
import { faq } from "../site";
import { Faq, PageHead, wrap } from "../ui";

export const metadata: Metadata = { title: "Pricing | BoldSpan Bento Grid Pro" };

export default function Pricing() {
  return (
    <main>
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
        <Faq items={faq} />
      </section>
    </main>
  );
}
