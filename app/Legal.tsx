import { site } from "./site";
import { PageHead, wrap } from "./ui";

// Draft legal copy: have it reviewed before launch.
export function Legal({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <main>
      <PageHead title={title} />
      <section className={`${wrap} max-w-3xl pb-24 sm:mx-auto`}>
        <div className="space-y-8">
          {items.map(([h, p]) => (
            <div key={h}>
              <h2 className="font-semibold">{h}</h2>
              <p className="mt-2 leading-relaxed text-mute">{p}</p>
            </div>
          ))}
          <p className="text-sm text-mute">Questions: {site.email}</p>
        </div>
      </section>
    </main>
  );
}
