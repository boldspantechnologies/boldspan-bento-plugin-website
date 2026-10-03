import type { Metadata } from "next";
import { Videos } from "../Videos";
import { videos } from "../site";
import { PageHead, wrap } from "../ui";

export const metadata: Metadata = { title: "Videos | BoldSpan Bento Grid" };

export default function VideosPage() {
  return (
    <main>
      <PageHead title="Watch it" accent="work." />
      <section className={`${wrap} pb-24`}>
        <Videos videos={videos} />
      </section>
    </main>
  );
}
