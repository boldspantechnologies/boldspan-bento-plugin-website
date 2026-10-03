"use client";

import { useRef } from "react";

const cardBase = "relative h-48 overflow-hidden rounded-3xl p-7 text-white";
const bg = "linear-gradient(145deg,#3560d8,#1d2b64)";

function reduced() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function Tilt() {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || reduced()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateX(${(-y * 16).toFixed(1)}deg) rotateY(${(x * 16).toFixed(1)}deg) scale(1.04)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <div className="[perspective:700px]">
      <div
        ref={ref}
        onMouseMove={move}
        onMouseLeave={leave}
        className={`${cardBase} transition-transform duration-150 ease-out will-change-transform`}
        style={{ background: bg }}
      >
        <p className="text-xl font-semibold">3D tilt</p>
        <p className="mt-3 text-sm text-white/75">Follows the visitor’s pointer. Tilt strength is adjustable.</p>
      </div>
    </div>
  );
}

function Reveal() {
  return (
    <div className={`${cardBase} group`} style={{ background: bg }}>
      <p className="text-xl font-semibold transition-transform duration-300 group-hover:-translate-y-2">Hover reveal</p>
      <p className="mt-3 text-sm text-white/75 transition-opacity duration-300 group-hover:opacity-0">Reveals tile content on hover.</p>
      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-white p-6 text-ink transition-transform duration-300 ease-out group-hover:translate-y-0">
        <p className="text-sm font-semibold">Hidden until you hover</p>
        <p className="mt-1 text-xs text-mute">Captions, buttons or any blocks.</p>
      </div>
    </div>
  );
}

function BorderGlow() {
  return (
    <div className="gborder rounded-3xl p-[2px]">
      <div className={`${cardBase} h-[11.5rem]`} style={{ background: "linear-gradient(145deg,#2a4fc0,#1d2b64)" }}>
        <p className="text-xl font-semibold">Gradient border glow</p>
        <p className="mt-3 text-sm text-white/75">An animated gradient outline.</p>
      </div>
    </div>
  );
}

function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div ref={ref} onMouseMove={move} className={`${cardBase} spot`} style={{ background: bg }}>
      <p className="relative text-xl font-semibold">Spotlight</p>
      <p className="relative mt-3 text-sm text-white/75">A light that follows the pointer across the tile.</p>
    </div>
  );
}

export function ProEffects() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Tilt />
      <Reveal />
      <BorderGlow />
      <Spotlight />
    </div>
  );
}
