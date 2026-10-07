const EVENTS: Record<string, { title: string; color: number }> = {
  visit: { title: "New visitor", color: 0x3560d8 },
  pricing_view: { title: "Looking at pricing", color: 0xf59e0b },
  click: { title: "Button clicked", color: 0x16a34a },
};

const BOTS = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|vercel|monitor|curl|wget|python|node-fetch/i;

const clamp = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");

export async function POST(req: Request) {
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) return new Response(null, { status: 204 });

  const ua = req.headers.get("user-agent") ?? "";
  if (!ua || BOTS.test(ua)) return new Response(null, { status: 204 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const meta = EVENTS[clamp(body.event, 20)];
  if (!meta) return new Response(null, { status: 400 });

  const path = clamp(body.path, 200) || "/";
  if (path.startsWith("/admin")) return new Response(null, { status: 204 });
  const detail = clamp(body.detail, 200);
  const referrer = clamp(body.referrer, 200);
  const country = req.headers.get("x-vercel-ip-country");
  const city = req.headers.get("x-vercel-ip-city");
  const where = [city && decodeURIComponent(city), country].filter(Boolean).join(", ");
  const device = /mobile|android|iphone/i.test(ua) ? "Mobile" : "Desktop";

  const fields = [
    ...(detail ? [{ name: "What", value: detail }] : []),
    { name: "Page", value: path, inline: true },
    { name: "Device", value: device, inline: true },
    ...(where ? [{ name: "Location", value: where, inline: true }] : []),
    ...(referrer ? [{ name: "Came from", value: referrer }] : []),
  ];

  await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      allowed_mentions: { parse: [] },
      embeds: [{ title: meta.title, color: meta.color, fields, timestamp: new Date().toISOString() }],
    }),
  }).catch((e) => console.error("Track webhook failed", e));

  return new Response(null, { status: 204 });
}
