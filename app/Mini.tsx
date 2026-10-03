import type { Preset } from "./bento-data";

const tones = ["#3560d8", "#9db8f2", "#dfe8fb", "#c3d4f7", "#e9effc"];

export function Mini({ p }: { p: Preset }) {
  return (
    <div className="group rounded-2xl border border-line bg-white p-4 transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg">
      <div
        className="grid h-36 gap-1.5 rounded-xl bg-bg p-2"
        style={{ gridTemplateColumns: "repeat(12,1fr)", gridTemplateRows: `repeat(${p.rows},1fr)` }}
      >
        {p.tiles.map((t, i) => (
          <div
            key={i}
            className="rounded-md transition-transform group-hover:scale-[0.97]"
            style={{ gridColumn: t.x ? `${t.x} / span ${t.c}` : `span ${t.c}`, gridRow: t.y ? `${t.y} / span ${t.r}` : `span ${t.r}`, background: tones[i === 0 ? 0 : 1 + ((i - 1) % (tones.length - 1))] }}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between gap-2">
        <p className="text-sm font-medium">{p.name}</p>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${p.pro ? "bg-brand text-white" : "bg-ink/10 text-ink"}`}>
          {p.pro ? "Pro" : "Free"}
        </span>
      </div>
    </div>
  );
}
