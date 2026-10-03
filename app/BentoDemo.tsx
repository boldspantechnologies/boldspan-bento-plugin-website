"use client";

import { useState } from "react";
import { gallery, tileStyles, tileTitles } from "./bento-data";

const ids = ["g-hero", "g-asym", "g-edit", "g-mag", "g-app", "g-mas"];
const presets = ids.map((i) => gallery.find((g) => g.id === i)!);

export function BentoDemo() {
  const [id, setId] = useState("g-hero");
  const p = presets.find((x) => x.id === id) ?? presets[0];

  return (
    <div className="overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_40px_80px_-30px_rgba(53,96,216,.35)]">
      <div className="flex items-center gap-2 border-b border-line bg-bg px-5 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        <span className="mx-auto hidden rounded-full bg-white px-4 py-1 text-xs text-mute sm:block">yoursite.com</span>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-line px-5 py-4">
        {presets.map((x) => (
          <button
            key={x.id}
            onClick={() => setId(x.id)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              x.id === id ? "bg-ink text-white" : "bg-bg text-mute hover:text-ink"
            }`}
          >
            {x.name}
            {x.pro && <span className="ml-2 rounded-full bg-brand px-1.5 py-0.5 text-[9px] uppercase text-white">Pro</span>}
          </button>
        ))}
      </div>

      <div className="p-5 sm:p-8">
        <div key={p.id} className="bento-grid">
          {p.tiles.map((t, i) => {
            const s = tileStyles[i % tileStyles.length];
            return (
              <div
                key={i}
                className="bt"
                style={{ ["--gc" as string]: `${t.x} / span ${t.c}`, ["--gr" as string]: `${t.y} / span ${t.r}`, background: s.bg, color: s.fg }}
              >
                <span className="text-[11px] uppercase tracking-widest opacity-60">0{i + 1}</span>
                <span className="text-lg font-semibold sm:text-2xl">{tileTitles[i % tileTitles.length]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
