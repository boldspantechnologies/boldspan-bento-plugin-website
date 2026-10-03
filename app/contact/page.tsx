import type { Metadata } from "next";
import { site } from "../site";
import { PageHead, btnDark, wrap } from "../ui";

export const metadata: Metadata = { title: "Contact | BoldSpan Bento Grid" };

export default function Contact() {
  return (
    <main>
      <PageHead title="Say" accent="hello." sub="Questions, licence help or feature ideas. One inbox." />
      <section className={`${wrap} pb-24`}>
        <a href={`mailto:${site.email}`} className="display block break-all text-3xl font-semibold underline decoration-brand decoration-4 underline-offset-8 sm:text-6xl">
          {site.email}
        </a>
        <a href={`mailto:${site.email}`} className={`${btnDark} mt-10`}>Email us</a>
      </section>
    </main>
  );
}
