"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { site } from "./site";

function send(event: string, detail: string, path: string) {
  try {
    const body = JSON.stringify({ event, detail, path, referrer: document.referrer });
    if (!navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }))) {
      fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
    }
  } catch {}
}

// Fire each event at most once per browser session so a Discord channel isn't flooded.
function once(key: string, fn: () => void) {
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {}
  fn();
}

// Pings the Discord webhook on visits, pricing views and key button clicks. Skips admin and localhost.
export function Tracker() {
  const path = usePathname();
  const skip = path.startsWith("/admin");

  useEffect(() => {
    if (skip || location.hostname === "localhost") return;
    once("t:visit", () => send("visit", "", path));
    if (path === "/pricing") once("t:pricing-page", () => send("pricing_view", "Opened the Pricing page", path));
  }, [path, skip]);

  // Home page: the Free & Pro pricing section scrolled into view.
  useEffect(() => {
    if (skip || location.hostname === "localhost") return;
    const el = document.getElementById("pricing-section");
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        once("t:pricing-section", () => send("pricing_view", "Scrolled to the Free & Pro pricing section", path));
        io.disconnect();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [path, skip]);

  useEffect(() => {
    if (skip || location.hostname === "localhost") return;
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest("a,button");
      if (!el) return;
      const label = (el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 80);
      const href = el.getAttribute("href") ?? "";
      let detail = "";
      if (href === site.freeUrl) detail = `Free plugin: "${label}"`;
      else if (/^\/pricing\/?$/.test(href)) detail = `Pricing link: "${label}"`;
      else if (el.tagName === "BUTTON" && /early access/i.test(label)) detail = `Early access: "${label}"`;
      else if (el.tagName === "A" && href === "#" && el.closest("#pricing, main")) detail = `Buy button: "${label}"`;
      if (detail) send("click", detail, location.pathname);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [skip]);

  return null;
}
