"use client";

import { useState } from "react";

type V = { id: string; title: string; time: string };

export function Videos({ videos }: { videos: V[] }) {
  const [active, setActive] = useState(0);
  const v = videos[active];
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="relative aspect-video overflow-hidden rounded-3xl bg-ink">
        {v.id ? (
          <iframe
            key={v.id}
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${v.id}`}
            title={v.title}
            allow="accelerometer; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-center text-white/70">
            <div>
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full border border-white/30">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8z" /></svg>
              </div>
              <p className="text-sm">Video coming soon</p>
            </div>
          </div>
        )}
      </div>
      <ul className="flex flex-col gap-2">
        {videos.map((x, i) => (
          <li key={x.title}>
            <button
              onClick={() => setActive(i)}
              className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left text-sm transition-colors ${
                i === active ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"
              }`}
            >
              <span className="font-medium">{x.title}</span>
              <span className={i === active ? "text-white/60" : "text-mute"}>{x.time}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
