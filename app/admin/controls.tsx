"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

const base = "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-50";
const variants = {
  default: "border border-ink/15 bg-white hover:border-ink",
  primary: "bg-ink text-white hover:bg-ink/85",
  danger: "border border-red-200 bg-white text-red-600 hover:border-red-500 hover:bg-red-50",
};

/** Submit button with a pending state and an optional confirm prompt. */
export function SubmitButton({
  children,
  confirm,
  variant = "default",
}: {
  children: React.ReactNode;
  confirm?: string;
  variant?: keyof typeof variants;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
      className={`${base} ${variants[variant]}`}
    >
      {pending ? "Working..." : children}
    </button>
  );
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {}
      }}
      className={`${base} ${variants.default}`}
    >
      {done ? "Copied" : label}
    </button>
  );
}
