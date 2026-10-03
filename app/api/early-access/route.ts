import { prisma } from "../../../lib/db";

// Early-access requests are saved to the DB and posted to a Discord channel.
// Set DISCORD_WEBHOOK_URL in .env.local (and in your host's env settings).
export async function POST(request: Request) {
  let body: { email?: unknown; reason?: unknown; website?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real users never fill this in.
  if (body.website) return Response.json({ ok: true });

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const reason = typeof body.reason === "string" ? body.reason.trim() : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (reason.length < 5 || reason.length > 1500) {
    return Response.json({ error: "Please tell us briefly why you want it." }, { status: 400 });
  }

  // Keep a copy for the admin dashboard. A DB problem must not block the Discord alert.
  try {
    await prisma.earlyAccessRequest.create({ data: { email, reason } });
  } catch (e) {
    console.error("Could not save early-access request", e);
  }

  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) {
    console.error("DISCORD_WEBHOOK_URL is not set");
    return Response.json({ error: "Not configured." }, { status: 500 });
  }

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      allowed_mentions: { parse: [] },
      embeds: [
        {
          title: "New early-access request (Personal, 1 year)",
          color: 0x3560d8,
          fields: [
            { name: "Email", value: email },
            { name: "Why they want it", value: reason },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    }),
  });

  if (!res.ok) {
    console.error("Discord webhook failed", res.status);
    return Response.json({ error: "Could not send. Please try again." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
