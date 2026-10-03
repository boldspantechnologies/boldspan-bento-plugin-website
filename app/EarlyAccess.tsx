"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "./site";

export function EarlyAccessButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    emailRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, reason, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent("Early access request")}&body=${encodeURIComponent(`Email: ${email}\nWhy I want it: ${reason}`)}`;
  const field = "mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand";

  return (
    <>
      <button type="button" onClick={() => { setStatus("idle"); setOpen(true); }} className={className}>
        Get 1 year early access
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/50 p-4" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ea-title"
            className="relative w-full max-w-md rounded-[28px] bg-white p-8 text-ink"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="absolute right-5 top-5 text-2xl leading-none text-mute hover:text-ink">×</button>

            {status === "done" ? (
              <div className="py-6 text-center">
                <h3 id="ea-title" className="text-2xl font-semibold tracking-tight">Request received</h3>
                <p className="mt-3 text-sm text-mute">Thanks. We will review it and email you at {email} if you are selected.</p>
                <button type="button" onClick={() => setOpen(false)} className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white">Close</button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <h3 id="ea-title" className="text-2xl font-semibold tracking-tight">Get 1 year of Pro early access</h3>
                <p className="mt-2 text-sm text-mute">Personal plan, 1 site. Tell us who you are and why you would use it.</p>

                <label className="mt-6 block text-sm font-medium">
                  Email address
                  <input ref={emailRef} type="email" required maxLength={200} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={field} />
                </label>
                <label className="mt-4 block text-sm font-medium">
                  Why do you want to use it?
                  <textarea required minLength={5} maxLength={1500} rows={4} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="What will you build with it?" className={field} />
                </label>
                <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={(e) => setWebsite(e.target.value)} className="hidden" />

                {status === "error" && (
                  <p className="mt-4 text-sm text-red-600">
                    {error} You can also <a href={mailto} className="underline">email us instead</a>.
                  </p>
                )}

                <button type="submit" disabled={status === "sending"} className="mt-6 w-full rounded-full bg-ink px-6 py-3 text-sm font-medium text-white disabled:opacity-60">
                  {status === "sending" ? "Sending..." : "Request early access"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
