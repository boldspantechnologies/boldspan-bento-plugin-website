# bentogrid.boldspan.tech: site, dashboard and licence server

Build spec for the website that sells **BoldSpan Bento Grid Pro**, sends licence keys, and answers the licence checks from the Pro plugin. You can hand this file to a developer or an AI builder as is. Section 12 has a ready-to-paste generator prompt; section 13 lists the acceptance tests.

> **Domain:** `https://bentogrid.boldspan.tech`. The shipped plugins call this host, so the site and API must live here.
>
> **Contact email:** `bentogrid@boldspan.tech`. Use it everywhere: site footer, `/contact/`, pricing FAQ, docs, the reply-to of every email, and the support line in the admin. The plugins already show this address.
>
> **The plugins are finished.** Free 1.0.2 and Pro 1.0.0 already contain everything the server needs (licence client, early-access handover, automatic updates). The server is built to the contract below; the plugins do not change. Section 0 explains exactly what the plugin does with each answer.

---

## 0. What the shipped plugin already does (read first)

Everything here is in Pro 1.0.0 (`boldspan-bento-grid-pro/includes/class-bento-pro-license.php` and `class-bento-pro-updater.php`). Build the server to match; do not expect plugin changes.

| When | Plugin calls | What it does with the answer |
|---|---|---|
| Admin pastes a key on **Bento Grid → Licence** | `POST /license/activate` | `200` + `valid` → stores `token` and `expires_at`, editor unlocks. `4xx` JSON → shows `message`, stays locked. `5xx` / timeout / not JSON → "could not reach the licence server". |
| Weekly WP-Cron, and the "Check now" link | `POST /license/check` | `valid` → stays unlocked, updates `expires_at`. Any other status → locks the editor and shows `message`. Outage → stays unlocked up to **14 days** after the last good check, then locks as "could not verify". |
| Admin clicks **Deactivate** | `POST /license/deactivate` | Clears the local record whatever the answer. |
| Plugin is deleted | `POST /license/deactivate` | Fire and forget (does not wait). |
| WordPress update check (about twice a day; cached 12 h, 1 h after a failure) | `POST /update` | Shows the update; installs `package` when it is not empty. |
| Early-access site: activation, weekly check, and a daily background sync | `POST /license/activate` | See § 6.1 rule 10. |
| Every day without a request | none | Locks locally once `expires_at` has passed, and when the site's address changes. |

Things the plugin sends with every licence call: `plugin_version`, `wp_version`. Timeout: 15 s (licence), 10 s (update). Requests are JSON `POST`s over HTTPS with certificate verification.

What the customer sees in WordPress: status, masked key, site, expiry ("Lifetime" when `expires_at` is `null`), last check, a **Renew** button when expired (→ `/account/`), a **Manage licence** link (→ `/account/`), "Your account" and "Support" links on the Plugins screen, and `bentogrid@boldspan.tech` for help. So `/account/` must exist at launch.

---

## 1. What the site does

1. **Marketing site**: what the plugin does, a layout gallery, pricing, docs, changelog.
2. **Checkout** through a payment provider. A paid order creates a customer and a licence key **automatically**, and emails the key with the Pro zip download.
3. **Customer account** (magic-link login): see keys, see the sites using them, free up a site, download the latest Pro, renew or upgrade, get invoices.
4. **Admin dashboard**: orders, licences, customers, activations, releases, emails, stats. Manual actions: issue, extend, revoke, reset sites.
5. **Licence API** used by the plugin: `activate`, `check`, `deactivate`, plus `update` for automatic Pro updates.
6. **Scheduled jobs**: expiry reminders and cleanup.

---

## 2. Recommended stack

| Concern | Choice | Why |
|---|---|---|
| App | **Next.js (App Router) + TypeScript** on Vercel | One codebase for site, dashboard and API |
| DB | **Postgres** (Neon or Supabase) + Drizzle or Prisma | Relational data, transactions |
| Payments | **Paddle** or **Lemon Squeezy** (merchant of record) | They handle global VAT/GST, invoices and refunds. Use Stripe only if your company is in a Stripe country and you want to handle tax yourself. |
| Email | **Resend** + React Email | Simple API, good deliverability. Set up SPF, DKIM and DMARC on the sending domain. |
| Auth | Auth.js (email magic link) or Supabase Auth | No passwords for customers. Admins get the same login plus an `is_admin` flag and 2FA. |
| File storage | Cloudflare R2 / S3 / Supabase Storage, **private bucket** | Pro zips are only downloadable through signed URLs |
| Cron | Vercel Cron | Daily reminders |
| Errors | Sentry | API failures must be visible to you |

The plugin calls **`/wp-json/bentogrid/v1/license/{action}`**. The site does not need to be WordPress. Serve that path from Next.js at `app/wp-json/bentogrid/v1/license/[action]/route.ts`. **Keep these paths working forever**, because every installed copy of Pro has them built in: `/wp-json/bentogrid/v1/license/{activate|check|deactivate}` and `/wp-json/bentogrid/v1/update`.

---

## 3. Pages

### Public

| Path | Content |
|---|---|
| `/` | Hero, layout gallery, effects demo (tilt, reveal, glass, spotlight), Free vs Pro, testimonials, CTA |
| `/pricing/` | Plan cards (yearly plans + a **lifetime** plan), FAQ, refund policy, and the expiry promise below. **Already linked from the plugin with UTM tags. Keep this path.** |
| `/features/` | Full comparison table. It mirrors the plugin's Upgrade page, including the "Coming soon" items. |
| `/docs/` | Install, activate the key, move a site, Elementor, troubleshooting |
| `/changelog/` | Generated from the `releases` table |
| `/checkout/success/` | "Check your email. Your key is on its way." Also shows the key if the webhook has already been processed (poll by checkout id). |
| `/contact/` | `bentogrid@boldspan.tech` (mailto) plus a contact form that emails that address |
| `/terms/`, `/privacy/`, `/refund-policy/` | Required by the payment providers |
| `/login/` | Magic-link form |

**Expiry promise** (show it on `/pricing/`, in the FAQ and in the reminder emails):

> **Your site never breaks.** If your licence expires, every published grid keeps its Pro layouts and effects. Renew to keep editing Pro features and to get updates and support. You also get 14 days after expiry to renew before anything locks.

### Customer account (`/account/…`, login required)

| Path | Content |
|---|---|
| `/account/` | Licences: masked key with a copy button, plan, status, expiry, sites used / allowed, renew or upgrade button |
| `/account/licenses/[id]` | Full key, activations (site, environment, plugin version, last check), a **Deactivate** button per site, and a download button for the latest Pro zip |
| `/account/downloads/` | Latest release plus previous versions |
| `/account/billing/` | Invoices and payment method (link to the provider's customer portal), cancel auto-renew |
| `/account/profile/` | Change email (with verification), name |

### Admin (`/admin/…`, admins only)

| Path | Content |
|---|---|
| `/admin/` | KPIs: revenue (30 d / MRR), new licences, active sites, renewals due, refunds, check-ins per day, Pro and WP version spread |
| `/admin/orders` | Search, view the raw webhook payload, resend the licence email, refund (links to the provider) |
| `/admin/licenses` | Search by key or email, filter by status/plan. Actions: **issue manual key** (comp/early access), extend expiry, change plan / max sites, revoke, un-revoke, reset all activations, add a note |
| `/admin/customers` | Profile, licences, orders, emails sent, merge duplicates |
| `/admin/activations` | Every site: last check, versions, environment, flagged rows (too many dev sites). A filter for **early-access licences**, showing which of the 10 have moved to the server (have an activation) |
| `/admin/releases` | Upload a Pro zip, version, `requires` / `tested` / `requires_php`, changelog (Markdown), channel (`stable` / `beta`), publish switch |
| `/admin/emails` | Log of every email (template, to, status, provider id), resend |
| `/admin/webhooks` | Log of every incoming event (provider, type, processed or error), replay button |
| `/admin/audit` | Who did what in the admin |
| `/admin/settings` | Plans (slug, name, price id at the provider, max sites, duration), email sender, maintenance switch |

---

## 4. Data model (Postgres)

```sql
create table customers (
  id            uuid primary key default gen_random_uuid(),
  email         citext unique not null,
  name          text,
  provider_customer_id text,             -- Paddle / Lemon Squeezy customer id
  is_admin      boolean not null default false,
  created_at    timestamptz not null default now()
);

create table plans (
  slug          text primary key,        -- 'personal', 'business', 'agency', 'lifetime'
  name          text not null,
  provider_price_id text unique,         -- price/variant id at the provider
  max_sites     int,                     -- null = unlimited
  duration_days int,                     -- null = lifetime
  active        boolean not null default true
);

create table orders (
  id            uuid primary key default gen_random_uuid(),
  customer_id   uuid not null references customers(id),
  provider      text not null,           -- 'paddle' | 'lemonsqueezy' | 'manual'
  provider_order_id text not null,
  provider_subscription_id text,
  plan_slug     text not null references plans(slug),
  amount_cents  int not null,
  currency      text not null,
  status        text not null,           -- 'paid' | 'refunded' | 'chargeback'
  created_at    timestamptz not null default now(),
  unique (provider, provider_order_id)
);

create table licenses (
  id            uuid primary key default gen_random_uuid(),
  key           text unique not null,    -- BENTO-XXXX-XXXX-XXXX (uppercase)
  customer_id   uuid not null references customers(id),
  order_id      uuid references orders(id),          -- null for manual / early access
  provider_subscription_id text,
  plan_slug     text not null references plans(slug),
  max_sites     int,                     -- copied from plan, editable per licence
  status        text not null default 'active',      -- 'active' | 'revoked'
  expires_at    timestamptz,             -- null = lifetime
  source        text not null default 'purchase',    -- 'purchase' | 'manual' | 'early_access'
  note          text,
  created_at    timestamptz not null default now()
);

create table activations (
  id            uuid primary key default gen_random_uuid(),
  license_id    uuid not null references licenses(id),
  site_id       text not null,           -- normalised: host + path, no scheme, no www
  site_url      text,
  site_name     text,
  environment   text,                    -- production | staging | development | local
  is_dev        boolean not null default false,      -- does not use a site slot
  token_hash    text not null,           -- sha256 of the token we gave the plugin
  plugin_version text,
  wp_version    text,
  activated_at  timestamptz not null default now(),
  last_check_at timestamptz,
  deactivated_at timestamptz
);
create unique index one_live_activation_per_site
  on activations (license_id, site_id) where deactivated_at is null;

create table releases (
  id            uuid primary key default gen_random_uuid(),
  version       text unique not null,    -- '1.0.0'
  channel       text not null default 'stable',
  storage_key   text not null,           -- object key in the private bucket
  requires_wp   text, tested_wp text, requires_php text,
  changelog_md  text,
  published     boolean not null default false,
  released_at   timestamptz not null default now()
);

create table webhook_events (
  id            text primary key,        -- provider event id (idempotency)
  provider      text not null,
  type          text not null,
  payload       jsonb not null,
  processed_at  timestamptz,
  error         text,
  received_at   timestamptz not null default now()
);

create table email_log (
  id            uuid primary key default gen_random_uuid(),
  customer_id   uuid references customers(id),
  license_id    uuid references licenses(id),
  template      text not null,
  to_email      citext not null,
  provider_message_id text,
  status        text not null,           -- 'sent' | 'failed'
  created_at    timestamptz not null default now(),
  unique (license_id, template)          -- drop for templates that may repeat; keeps reminders one-shot
);

create table audit_log (
  id bigserial primary key, actor_id uuid, action text, target text, data jsonb,
  created_at timestamptz not null default now()
);
```

---

## 5. Flows

### 5.1 Purchase → key in the inbox (fully automatic)

```
Pricing page → provider checkout (overlay) → payment
  → provider sends webhook  "order paid" / "transaction.completed" / "subscription_created"
  → POST /api/webhooks/{provider}
      1. verify the signature on the RAW body; reject with 401 if bad
      2. insert into webhook_events (id = event id); if it already exists, return 200 (already handled)
      3. in one DB transaction:
           upsert customer by email
           insert order
           insert licence: new key, plan, max_sites, expires_at = now + duration (null for lifetime)
      4. send email "license-issued": key, download link, 3-step setup, account link
      5. mark the event processed; return 200
  → /checkout/success shows "check your email" (or the key, once ready)
```

Fail safe: if the email fails, the licence still exists. Log it, show it in `/admin/emails`, and let the customer see the key in `/account`.

### 5.2 Renewal (subscription)

Provider "subscription renewed / payment succeeded" event → find the licence by `provider_subscription_id` → `expires_at = max(expires_at, now) + duration` → email "license-renewed". The plugin picks up the new date on its next weekly check, or right away with "Check now".

### 5.3 Cancel, refund, chargeback

| Event | Action |
|---|---|
| Subscription cancelled | Nothing now. The licence runs until `expires_at`. Email "auto-renew off". |
| Refund (full) | `licenses.status = 'revoked'`, `orders.status = 'refunded'`. The plugin locks the editor at its next check. Published pages keep working. |
| Chargeback | Same as refund. Flag the customer. |
| Plan upgrade | Update `plan_slug` / `max_sites` on the same licence. **The key never changes.** |

### 5.4 Expiry reminders (daily cron)

`/api/cron/reminders`, protected by `CRON_SECRET`. One-shot templates: `expiry-30d`, `expiry-7d`, `expired`, `grace-ending`. Skip licences with auto-renew on, except to say "we will charge you on …". Uniqueness on `(license_id, template)` stops duplicates. Reset that row on renewal, or name the template per period.

### 5.5 Plugin activation, weekly check, move site

```
Licence screen → POST /license/activate  {key, site_url, site_id, environment, …}
   valid → plugin stores token + expires_at, editor unlocks
Weekly WP-Cron → POST /license/check  {key, token, site_id}
   valid → stays unlocked;  expired/revoked/site_mismatch/invalid → editor locks
   5xx / timeout / non-JSON → outage: stays unlocked up to 14 days after the last good check
Deactivate (plugin or /account) → activation.deactivated_at = now, slot freed
```

### 5.6 Automatic updates

```
WP update check (twice a day) → POST /update {slug, plugin_version, license_key, token, site_id, …}
   → latest published release; "package" = signed download URL only if the licence is valid on that site
WP downloads the package → GET /download/pro?t=<signed> → 302 to a short-lived bucket URL
```

---

## 6. APIs

### 6.1 Plugin-facing: the licence contract (MUST match exactly)

Base: `https://bentogrid.boldspan.tech/wp-json/bentogrid/v1/license`. Every call is a `POST` with a JSON body. Every body also has `plugin_version` and `wp_version`: store them on the activation.

| Endpoint | Body | Success `200` |
|---|---|---|
| `/activate` | `license_key, site_url, site_id, site_name, environment` | `{ "success": true, "status": "valid", "token": "…", "expires_at": "2027-09-30T00:00:00Z" \| null }` |
| `/check` | `license_key, token, site_id` | same shape (the token may be omitted) |
| `/deactivate` | `license_key, token, site_id` | `{ "success": true }` |

Failure: HTTP `4xx` with `{ "success": false, "status": "<status>", "message": "<shown to the admin>" }`.

Statuses: `valid`, `invalid` (unknown key), `expired`, `revoked`, `site_mismatch`. Anything else is read as `invalid`.

**Hard rules. The plugin's behaviour depends on these:**

1. **Always answer in JSON.** A `4xx` JSON reply is a *verdict* and can lock the editor. A `5xx`, a timeout or a non-JSON body is an *outage*, and the plugin stays unlocked for 14 days.
2. **Never use a 4xx for your own problems.** Rate limiting, maintenance, a DB error, an uncaught exception: always return **`503`** (or 500). A `429` with JSON on `/check` would lock paying customers.
3. **`/activate` is idempotent.** The same key and the same `site_id` succeed again. Issue a new token and invalidate the old one.
4. **`/check` is `valid` only if** the key is active, not expired, **and** a live activation exists for this `site_id` whose `token_hash` matches.
5. **Dev sites are free.** A host matching `localhost`, `*.local`, `*.test`, `*.localhost`, `staging.*`, `*.staging.*`, `*.wpengine.com`-style staging hosts, or an IP address, does not use a slot. A dev site identified only by `environment` (`local` / `development` / `staging`) on a normal domain is also free, but **cap it** (e.g. 3 per licence), because a customer can set that value to anything.
6. `expires_at`: ISO-8601 UTC, or `null` for lifetime. Send the **paid-up date + 14 days** (the grace period, see § 7.2), not the bare paid-up date. The plugin locks locally on whatever date you send.
7. `site_id` arrives normalised (lower case host + path, no scheme, no `www.`, no trailing slash). Normalise it again on the server anyway.
8. Paths have **no trailing slash** (`…/license/activate`). Do not redirect them; a redirect turns the POST into a GET.
9. Never put the full key in a `message`. Put another site's address in it only for that key's own owner (the `site_mismatch` message), and that is fine.
10. **Answer `invalid` only for keys that do not exist.** The plugin treats `invalid` as "the server does not know this key" and then lets the 10 early-access keys fall back to its built-in list. For a key that exists, always send its real state (`valid`, `expired`, `revoked`, `site_mismatch`). Once the server knows an early-access key, the plugin follows the server, and a `valid` answer turns the site into a normal server licence with no action from the customer.
11. **Import the 10 early-access keys before launch** (§ 10 step 3). Until a key is imported, anyone who has the Pro zip can use it through the plugin's built-in list. The first site to call `/activate` after import takes the slot, so pre-bind each key to its owner's `site_id` when you know it.

### 6.2 Plugin-facing: updates

`POST /wp-json/bentogrid/v1/update`

```json
{ "slug": "boldspan-bento-grid-pro", "plugin_version": "1.0.0", "wp_version": "6.8",
  "php_version": "8.2", "license_key": "…", "token": "…", "site_id": "example.com" }
```

Reply `200`:

```json
{
  "slug": "boldspan-bento-grid-pro",
  "new_version": "1.0.1",
  "requires": "6.4", "tested": "6.8", "requires_php": "7.4",
  "last_updated": "2026-11-02 10:00:00",
  "homepage": "https://bentogrid.boldspan.tech/",
  "changelog": "<h4>1.0.1</h4><ul><li>…</li></ul>",
  "package": "https://bentogrid.boldspan.tech/download/pro?t=…"
}
```

- `package` is `""` when the licence is not valid for that site, or once it is past its **paid-up date** (no grace for updates). WordPress then shows the update with "Automatic update is unavailable", which is a good nudge to renew.
- Make the signed `t` valid for **48 hours**, because WordPress caches the update info for up to 12 hours. Sign it with HMAC over `release_id | license_id | expiry`.
- `GET /download/pro?t=…`: verify the signature, log it, then `302` to a bucket URL that lives 5 minutes.

Reference code for `/update` and the download: § 7.4.

### 6.3 Payment webhooks

| Endpoint | Notes |
|---|---|
| `POST /api/webhooks/paddle` | Verify the `Paddle-Signature` header (`ts=…;h1=…`, HMAC-SHA256 of `ts:rawBody`). Events: `transaction.completed`, `subscription.updated`, `subscription.canceled`, `adjustment.created` (refund). |
| `POST /api/webhooks/lemonsqueezy` | Verify `X-Signature` (hex HMAC-SHA256 of the raw body). Events: `order_created`, `subscription_payment_success`, `subscription_cancelled`, `order_refunded`. |

Read the raw body before parsing JSON. Return `200` quickly. Idempotency comes from `webhook_events.id`.

### 6.4 Customer API (session cookie)

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/magic-link` | Send the login link (rate-limited per email and IP) |
| GET | `/api/me/licenses` | Licences with activations |
| POST | `/api/me/licenses/:id/activations/:aid/deactivate` | Free a site remotely (that site locks at its next check) |
| GET | `/api/me/downloads` | Releases + a signed URL for each |
| POST | `/api/me/licenses/:id/resend` | Email the key again |
| GET | `/api/me/billing-portal` | Redirect URL to the provider's customer portal |
| GET | `/api/checkout/:checkoutId/status` | For `/checkout/success` polling: `pending` or the masked key |

### 6.5 Admin API (admin session + 2FA, every write goes to `audit_log`)

| Method | Path | Body / query | Does |
|---|---|---|---|
| GET | `/api/admin/licenses` | `q` (key or email), `status`, `plan`, `source`, `page` | List with customer, plan, expiry, sites used / allowed |
| POST | `/api/admin/licenses` | `email, name?, plan_slug, expires_at? (null = lifetime), max_sites?, source ('manual' \| 'early_access'), key? (to import an existing key), bind_site_id?, send_email (bool), note?` | **Issue a key by hand.** Creates the customer if needed, generates a key unless `key` is given, optionally pre-binds a site, optionally sends `license-issued` |
| POST | `/api/admin/licenses/import` | CSV: `key,email,name,plan_slug,expires_at,site_id,source` | Bulk version of the above (used for the 10 early-access keys). Dry-run first, then commit |
| GET | `/api/admin/licenses/:id` | | Full detail: key, activations, orders, emails, audit trail |
| PATCH | `/api/admin/licenses/:id` | any of `plan_slug, max_sites, expires_at, status ('active' \| 'revoked'), note, customer_id` | Change plan, extend, revoke / un-revoke, transfer to another customer |
| POST | `/api/admin/licenses/:id/reset-activations` | | Deactivates every site (they lock at their next check) |
| POST | `/api/admin/activations/:id/deactivate` | | Free one site |
| POST | `/api/admin/licenses/:id/resend` | `template` (default `license-issued`) | Email the key again |
| GET | `/api/admin/orders` | `q`, `status`, `from`, `to` | Orders with the raw webhook payload |
| GET | `/api/admin/customers` · `/:id` | `q` | Customers, their licences, orders and emails |
| POST | `/api/admin/customers/:id/merge` | `into_customer_id` | Merge duplicates |
| GET | `/api/admin/activations` | `q` (site), `license_id`, `stale`, `flagged`, `early_access` | All sites |
| POST | `/api/admin/releases` | multipart: `zip, version, channel, requires_wp, tested_wp, requires_php, changelog_md` | Uploads to the private bucket. Rejects a version that is not higher than the latest, and a zip whose main file's `Version:` header differs from `version` |
| PATCH | `/api/admin/releases/:id` | `published`, `changelog_md`, `channel` | Publish or unpublish (the `/update` endpoint only serves published stable releases) |
| GET | `/api/admin/emails` · POST `/:id/resend` | | Email log and resend |
| GET | `/api/admin/webhooks` · POST `/:id/replay` | | Webhook log and replay |
| GET | `/api/admin/stats` | `range` | Revenue, MRR, new licences, active sites, renewals due, refunds, check-ins per day, plugin / WP version spread |
| GET / PATCH | `/api/admin/settings` | plans, sender, maintenance | Settings |
| GET | `/api/admin/audit` | `actor`, `target` | Audit log |

### 6.6 Cron

`GET /api/cron/reminders` (daily), `GET /api/cron/cleanup` (weekly: purge `webhook_events` older than 1 year, mark activations with no check for 90 days as stale). Both require `Authorization: Bearer $CRON_SECRET`.

---

## 7. Reference code (licence API)

### 7.1 Keys, tokens, site ids: `lib/license.ts`

```ts
import { randomInt, randomBytes, createHash } from 'node:crypto';

// No 0/O/1/I, so keys can be read aloud and typed from an email.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateKey(): string {
  const block = () => Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('');
  return `BENTO-${block()}-${block()}-${block()}`; // 60 bits; retry on a unique-index clash
}

// Mirrors bento_normalize_key() in the plugin.
export const normalizeKey = (k: unknown) => String(k ?? '').trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');

// Mirrors bento_site_id() in the plugin.
export function normalizeSiteId(raw: unknown): string {
  let s = String(raw ?? '').trim().toLowerCase().replace(/^[a-z]+:\/\//, '').replace(/^www\./, '');
  return s.replace(/\/+$/, '');
}

export const newToken = () => randomBytes(32).toString('base64url');
export const hashToken = (t: string) => createHash('sha256').update(t).digest('hex');

const DEV_HOST = /^(localhost|127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+)$|\.(local|test|localhost|invalid|example)$|^staging\.|\.staging\.|\.wpengine\.com$|\.kinsta\.cloud$|\.instawp\.xyz$/;

export function devKind(siteId: string, environment: unknown): 'host' | 'env' | null {
  const host = siteId.split('/')[0].split(':')[0];
  if (DEV_HOST.test(host)) return 'host';
  if (['local', 'development', 'staging'].includes(String(environment))) return 'env';
  return null;
}
```

### 7.2 Route: `app/wp-json/bentogrid/v1/license/[action]/route.ts`

```ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db'; // postgres.js / Neon tagged template
import { normalizeKey, normalizeSiteId, newToken, hashToken, devKind } from '@/lib/license';

export const dynamic = 'force-dynamic';

const ENV_DEV_CAP = 3;
// Expiry policy: the plugin keeps working for 14 days after the paid-up date.
// The API reports the grace end as `expires_at`, because the plugin also
// locks locally on that date. The dashboard and emails show the real date.
const EXPIRY_GRACE_DAYS = 14;
const graceEnd = (d: Date | null) => (d ? new Date(d.getTime() + EXPIRY_GRACE_DAYS * 864e5) : null);
const ACCOUNT_URL = 'https://bentogrid.boldspan.tech/account/';

type Status = 'valid' | 'invalid' | 'expired' | 'revoked' | 'site_mismatch';

const json = (http: number, body: object) => NextResponse.json(body, { status: http, headers: { 'Cache-Control': 'no-store' } });
const fail = (http: number, status: Status, message: string) => json(http, { success: false, status, message });
const ok = (lic: License, token?: string) =>
  json(200, { success: true, status: 'valid', ...(token ? { token } : {}), expires_at: graceEnd(lic.expires_at)?.toISOString() ?? null });

type License = { id: string; status: string; expires_at: Date | null; max_sites: number | null };

async function loadLicense(key: string) {
  const [lic] = await sql<License[]>`select id, status, expires_at, max_sites from licenses where key = ${key}`;
  if (!lic) return { error: fail(404, 'invalid', 'This licence key is not valid. Copy it from your purchase email.') };
  if (lic.status === 'revoked') return { error: fail(403, 'revoked', 'This licence has been revoked. Contact support if this is a mistake.') };
  if (lic.expires_at && graceEnd(lic.expires_at)!.getTime() < Date.now()) return { error: fail(403, 'expired', `This licence expired. Renew it at ${ACCOUNT_URL}`) };
  return { lic };
}

async function activate(b: any) {
  const key = normalizeKey(b.license_key);
  const siteId = normalizeSiteId(b.site_id);
  if (key.length < 8 || !siteId) return fail(400, 'invalid', 'Missing licence key or site.');

  const { lic, error } = await loadLicense(key);
  if (error) return error;

  const dev = devKind(siteId, b.environment);
  const token = newToken();
  const meta = { site_url: String(b.site_url ?? ''), site_name: String(b.site_name ?? '').slice(0, 200), environment: String(b.environment ?? ''), plugin_version: String(b.plugin_version ?? ''), wp_version: String(b.wp_version ?? '') };

  return sql.begin(async (tx) => {
    await tx`select id from licenses where id = ${lic!.id} for update`; // serialise activations per key

    // Rule 3: same site again -> succeed, rotate the token.
    const [same] = await tx`select id from activations where license_id = ${lic!.id} and site_id = ${siteId} and deactivated_at is null`;
    if (same) {
      await tx`update activations set ${tx({ token_hash: hashToken(token), last_check_at: new Date(), ...meta })} where id = ${same.id}`;
      return ok(lic!, token);
    }

    if (dev === 'env') {
      const [{ n }] = await tx`select count(*)::int n from activations where license_id = ${lic!.id} and is_dev and deactivated_at is null`;
      if (n >= ENV_DEV_CAP) return fail(403, 'site_mismatch', `This key already has ${ENV_DEV_CAP} staging sites. Free one at ${ACCOUNT_URL}`);
    } else if (!dev && lic!.max_sites !== null) {
      const live = await tx`select site_id from activations where license_id = ${lic!.id} and not is_dev and deactivated_at is null order by activated_at`;
      if (live.length >= lic!.max_sites) {
        const where = lic!.max_sites === 1 ? `on ${live[0].site_id}` : `on ${live.length} sites`;
        return fail(403, 'site_mismatch', `This key is already active ${where}. Deactivate it there, or manage sites at ${ACCOUNT_URL}`);
      }
    }

    await tx`insert into activations ${tx({ license_id: lic!.id, site_id: siteId, is_dev: dev !== null, token_hash: hashToken(token), last_check_at: new Date(), ...meta })}`;
    return ok(lic!, token);
  });
}

async function check(b: any) {
  const key = normalizeKey(b.license_key);
  const siteId = normalizeSiteId(b.site_id);
  const { lic, error } = await loadLicense(key);
  if (error) return error;

  const [act] = await sql`
    update activations set last_check_at = now(), plugin_version = ${String(b.plugin_version ?? '')}, wp_version = ${String(b.wp_version ?? '')}
    where license_id = ${lic!.id} and site_id = ${siteId} and token_hash = ${hashToken(String(b.token ?? ''))} and deactivated_at is null
    returning id`;
  if (!act) return fail(403, 'site_mismatch', 'This key is no longer active on this site. Activate it again on the Licence screen.');
  return ok(lic!);
}

async function deactivate(b: any) {
  const key = normalizeKey(b.license_key);
  const siteId = normalizeSiteId(b.site_id);
  await sql`
    update activations a set deactivated_at = now()
    from licenses l
    where l.id = a.license_id and l.key = ${key} and a.site_id = ${siteId}
      and a.token_hash = ${hashToken(String(b.token ?? ''))} and a.deactivated_at is null`;
  return json(200, { success: true }); // idempotent
}

const HANDLERS: Record<string, (b: any) => Promise<Response>> = { activate, check, deactivate };

export async function POST(req: NextRequest, { params }: { params: Promise<{ action: string }> }) {
  const handler = HANDLERS[(await params).action];
  if (!handler) return fail(404, 'invalid', 'Unknown action.');

  // Add rate limiting here (e.g. Upstash): on overflow return json(503, …), never a 4xx.
  try {
    const body = await req.json().catch(() => ({}));
    return await handler(body);
  } catch (e) {
    console.error(e); // Sentry
    return json(503, { success: false, message: 'Licence server error. Try again shortly.' }); // outage, not a verdict
  }
}
```

### 7.3 Fulfilment: `lib/fulfil.ts` (called by every payment webhook after the signature check)

```ts
export async function fulfilOrder(e: {
  provider: 'paddle' | 'lemonsqueezy'; eventId: string; orderId: string; subscriptionId?: string;
  email: string; name?: string; priceId: string; amountCents: number; currency: string;
}) {
  const fresh = await sql`insert into webhook_events (id, provider, type, payload) values (${e.eventId}, ${e.provider}, 'order.paid', ${sql.json(e)}) on conflict do nothing returning id`;
  if (!fresh.length) return; // already handled

  const licenseId = await sql.begin(async (tx) => {
    const [plan] = await tx`select * from plans where provider_price_id = ${e.priceId}`;
    if (!plan) throw new Error(`Unknown price ${e.priceId}`);
    const [c] = await tx`insert into customers (email, name) values (${e.email}, ${e.name ?? null})
                         on conflict (email) do update set name = coalesce(customers.name, excluded.name) returning id`;
    const [o] = await tx`insert into orders (customer_id, provider, provider_order_id, provider_subscription_id, plan_slug, amount_cents, currency, status)
                         values (${c.id}, ${e.provider}, ${e.orderId}, ${e.subscriptionId ?? null}, ${plan.slug}, ${e.amountCents}, ${e.currency}, 'paid') returning id`;
    const expires = plan.duration_days ? new Date(Date.now() + plan.duration_days * 864e5) : null;
    for (let i = 0; i < 5; i++) {
      const rows = await tx`insert into licenses (key, customer_id, order_id, provider_subscription_id, plan_slug, max_sites, expires_at)
                            values (${generateKey()}, ${c.id}, ${o.id}, ${e.subscriptionId ?? null}, ${plan.slug}, ${plan.max_sites}, ${expires})
                            on conflict (key) do nothing returning id`;
      if (rows.length) return rows[0].id;
    }
    throw new Error('Could not generate a unique key');
  });

  await sendLicenseEmail(licenseId, 'license-issued'); // logs to email_log; a failure here does not undo the licence
  await sql`update webhook_events set processed_at = now() where id = ${e.eventId}`;
}
```

If anything throws, record `error` on the event and return `500`, so the provider retries. The `on conflict` on the event id means a retry after partial success starts again cleanly only if the transaction rolled back. So delete the event row in the `catch` before you return 500.

### 7.4 Updates and downloads: `app/wp-json/bentogrid/v1/update/route.ts` and `app/download/pro/route.ts`

```ts
// lib/download-token.ts
import { createHmac, timingSafeEqual } from 'node:crypto';
const SECRET = process.env.DOWNLOAD_SIGNING_SECRET!;
const sign = (p: string) => createHmac('sha256', SECRET).update(p).digest('base64url');

export function makeDownloadToken(releaseId: string, licenseId: string, ttlHours = 48) {
  const payload = `${releaseId}.${licenseId}.${Math.floor(Date.now() / 1000) + ttlHours * 3600}`;
  return `${Buffer.from(payload).toString('base64url')}.${sign(payload)}`;
}

export function readDownloadToken(t: string) {
  const [b64, mac] = String(t).split('.');
  if (!b64 || !mac) return null;
  const payload = Buffer.from(b64, 'base64url').toString();
  const good = Buffer.from(sign(payload));
  if (good.length !== Buffer.from(mac).length || !timingSafeEqual(good, Buffer.from(mac))) return null;
  const [releaseId, licenseId, exp] = payload.split('.');
  return Number(exp) * 1000 > Date.now() ? { releaseId, licenseId } : null;
}
```

```ts
// app/wp-json/bentogrid/v1/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { marked } from 'marked';
import { sql } from '@/lib/db';
import { normalizeKey, normalizeSiteId, hashToken } from '@/lib/license';
import { makeDownloadToken } from '@/lib/download-token';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const b = await req.json().catch(() => ({}));
    const [rel] = await sql`select * from releases where published and channel = 'stable' order by released_at desc limit 1`;
    if (!rel) return NextResponse.json({ error: 'no release' }, { status: 404 });

    // A package only for a licence that is active, paid up (no grace) and bound to this site with this token.
    const [lic] = await sql`
      select l.id from licenses l
      join activations a on a.license_id = l.id and a.deactivated_at is null
      where l.key = ${normalizeKey(b.license_key)} and l.status = 'active'
        and (l.expires_at is null or l.expires_at > now())
        and a.site_id = ${normalizeSiteId(b.site_id)} and a.token_hash = ${hashToken(String(b.token ?? ''))}`;

    return NextResponse.json({
      slug: 'boldspan-bento-grid-pro',
      new_version: rel.version,
      requires: rel.requires_wp, tested: rel.tested_wp, requires_php: rel.requires_php,
      last_updated: new Date(rel.released_at).toISOString().replace('T', ' ').slice(0, 19),
      homepage: 'https://bentogrid.boldspan.tech/',
      changelog: await marked.parse(rel.changelog_md ?? ''),
      package: lic ? `${process.env.APP_URL}/download/pro?t=${makeDownloadToken(rel.id, lic.id)}` : '',
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'server' }, { status: 503 });
  }
}
```

```ts
// app/download/pro/route.ts: also used by the account area and the licence email
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { readDownloadToken } from '@/lib/download-token';
import { presignGet } from '@/lib/storage'; // S3/R2 presigned GET, 5 minutes

export async function GET(req: NextRequest) {
  const tok = readDownloadToken(req.nextUrl.searchParams.get('t') ?? '');
  if (!tok) return new NextResponse('This download link has expired. Get a new one at https://bentogrid.boldspan.tech/account/', { status: 410 });
  const [rel] = await sql`select storage_key, version from releases where id = ${tok.releaseId}`;
  if (!rel) return new NextResponse('Not found', { status: 404 });
  await sql`insert into audit_log (action, target, data) values ('download', ${tok.licenseId}, ${sql.json({ version: rel.version })})`;
  return NextResponse.redirect(await presignGet(rel.storage_key, 300, `boldspan-bento-grid-pro.zip`), 302);
}
```

The zip must unpack to a folder named `boldspan-bento-grid-pro/`, otherwise WordPress installs the update as a second plugin. The account area and `license-issued` email use the same token with `ttlHours = 168` (7 days).

---

## 8. Emails

| Template | When | Must contain |
|---|---|---|
| `magic-link` | Login | Link (15 min, single use) |
| `license-issued` | Order paid | **Key** in a monospace box, Pro zip download button (signed link, 7 days), 3 steps: install the free plugin from WordPress.org → upload Pro under Plugins → Add New → paste the key on **Bento Grid → Licence**. Account link, support reply-to. |
| `license-renewed` | Renewal paid | New expiry date |
| `auto-renew-off` | Subscription cancelled | Date it stops, reactivate link |
| `expiry-30d`, `expiry-7d` | Cron | Renew button with a **renewal discount** (e.g. 25 % off, coupon at the provider). Include the expiry promise (§ 3). |
| `expired` | Cron, on the paid-up date | "Pro editing locks on <date + 14 days>. Your site keeps working." Same discount. |
| `grace-ending` | Cron, 3 days before the grace end | Last reminder, same discount |
| `license-revoked` | Refund | Short and neutral |
| `site-deactivated` | Deactivated from `/account` | Which site, and when it locks |
| `new-release` (opt-in) | Release published | Version, highlights |

Send from `licenses@bentogrid.boldspan.tech` (or `bentogrid@boldspan.tech` itself) with reply-to **`bentogrid@boldspan.tech`**. Every email footer: "Questions? Reply to this email or write to bentogrid@boldspan.tech."

---

## 9. Security checklist

- [ ] Webhook signatures verified on the raw body, and replays blocked by the event id
- [ ] Licence API: rate-limit per IP and per key (return **503**, see rule 2), always `Cache-Control: no-store`
- [ ] Tokens stored only as SHA-256 hashes
- [ ] Keys shown masked in lists, in full only on the licence detail page and in the email
- [ ] Private bucket; downloads only through signed, expiring URLs; log every download
- [ ] Admin: separate role, 2FA, every write in `audit_log`
- [ ] Magic links: single use, 15 min, rate-limited per email and per IP
- [ ] CSRF protection on account/admin forms (same-site cookies + origin check)
- [ ] Automatic DB backups, and a monthly restore test
- [ ] Uptime monitor on `/license/check` (a POST with a dummy key must return a 404 JSON reply)

---

## 10. Launch order

1. DB + plans seeded (`personal` 1 site, `business` 5, `agency` unlimited, durations 365 d, plus a `lifetime` plan with `duration_days = null`).
2. Licence API (§ 7.2) deployed. Test it against a local site with `define( 'BOLDSPAN_BENTO_GRID_PRO_API', 'https://<preview>.vercel.app/wp-json/bentogrid/v1/license' );`.
3. **Import the 10 early-access keys** (`/api/admin/licenses/import`) as `source = 'early_access'`, plan `agency` (or whatever you promised), `expires_at` as promised, customer = the buyer's email, and `site_id` when known (pre-binds it; see § 6.1 rules 10–11). Do this **before** the API answers publicly. Then watch `/admin/activations`: each early site moves over within a day of an admin visiting it.
4. Payments in sandbox → webhook → licence → email, end to end.
5. Account area + admin.
6. Releases + `/update` + download. Upload the current Pro zip (1.0.0) as the first release. Pro 1.0.0 already has the updater and the early-access handover, so every later version arrives through Dashboard → Updates.
7. Go live: switch the provider to live mode, set live webhook secrets, run one real purchase and refund it.

---

## 11. Environment variables

```
DATABASE_URL=
APP_URL=https://bentogrid.boldspan.tech
AUTH_SECRET=
RESEND_API_KEY=
EMAIL_FROM="BoldSpan Bento Grid <licenses@bentogrid.boldspan.tech>"
EMAIL_REPLY_TO=bentogrid@boldspan.tech
CONTACT_EMAIL=bentogrid@boldspan.tech
PADDLE_API_KEY=            # or LEMONSQUEEZY_API_KEY
PADDLE_WEBHOOK_SECRET=     # or LEMONSQUEEZY_WEBHOOK_SECRET
PADDLE_CLIENT_TOKEN=       # checkout overlay
STORAGE_BUCKET= STORAGE_ACCESS_KEY= STORAGE_SECRET= STORAGE_ENDPOINT=
DOWNLOAD_SIGNING_SECRET=
CRON_SECRET=
SENTRY_DSN=
```

---

## 12. Generator prompt

Paste this into your AI builder (Claude Code, v0, Lovable, Bolt…) **together with this whole file** as an attachment. The prompt is the brief; the file is the spec.

````text
Build the production website and licence server for "BoldSpan Bento Grid Pro", a premium
WordPress plugin add-on. Domain: https://bentogrid.boldspan.tech. The attached file
bentogrid-site.md is the spec. Where this prompt and the file differ, the file wins.

CONTACT
The contact and support email is bentogrid@boldspan.tech: footer, /contact/ (mailto + a form
that emails it), pricing FAQ, docs, and the reply-to of every email.

The WordPress plugins are finished and must not need changes. Build the server to spec
sections 0 and 6 exactly, and make every acceptance test in section 13 pass.

STACK
Next.js (App Router, TypeScript, Server Components, Route Handlers), Tailwind CSS,
Postgres with Drizzle ORM, Auth.js email magic-link login, Resend + React Email,
Paddle Billing for checkout (keep the payment code behind a small provider interface so
Lemon Squeezy can be added), Cloudflare R2 (S3 API) for private plugin zips, Vercel Cron,
Zod for every request body. Deploy target: Vercel.

1. PUBLIC MARKETING SITE
Pages: /, /pricing/, /features/, /docs/ (MDX), /changelog/ (from the releases table),
/checkout/success/, /contact/, /terms/, /privacy/, /refund-policy/, /login/.
Design: clean, modern, light and dark mode. Neutral greys with one violet accent #6d28d9
for anything Pro. The hero shows animated bento grids (CSS grid tiles with gradients,
hover tilt, glass tiles, scroll reveal). Fast: Lighthouse 95+, no layout shift, real
semantic HTML, OG images, sitemap, JSON-LD Product schema.
Pricing reads plans from the DB: Personal (1 site), Business (5 sites), Agency (unlimited),
yearly with auto-renew, plus a one-time Lifetime plan. Pricing and FAQ show the expiry promise
from spec section 3 ("Your site never breaks…"). Leave prices editable in the admin. Buttons open the Paddle
overlay checkout with the customer's email prefilled when logged in. The /pricing/ URL
must keep working with UTM query strings.

2. AUTOMATED FULFILMENT
POST /api/webhooks/paddle: verify the Paddle-Signature header on the raw body, store the
event in webhook_events (event id = primary key, for idempotency), then in one transaction
upsert the customer, insert the order and create a licence with a key in the format
BENTO-XXXX-XXXX-XXXX (alphabet ABCDEFGHJKLMNPQRSTUVWXYZ23456789, crypto random, unique),
max_sites from the plan, expires_at = now + plan duration. Then email the key (template
license-issued: key in a monospace box, a signed 7-day download link for the latest Pro zip,
3 setup steps, account link). Handle renewals (extend expires_at from max(now, expires_at)),
cancellations (no change until expiry, send an email), refunds and chargebacks (revoke).
/checkout/success polls /api/checkout/:id/status and shows the key once it exists.

3. LICENCE API. IMPLEMENT EXACTLY AS IN SPEC §6.1 AND §7.2
POST /wp-json/bentogrid/v1/license/activate | /check | /deactivate (no trailing slash,
no redirects). JSON in, JSON out. Status vocabulary: valid, invalid, expired, revoked,
site_mismatch. Verdicts use 4xx + JSON. Every internal problem, including rate limiting,
must return 503, never a 4xx, because the WordPress plugin treats 4xx as "lock the editor"
and 5xx as "outage, keep working for 14 days". /activate is idempotent per site_id and
rotates the token. Tokens are stored as SHA-256 hashes only. Development hosts (localhost,
*.local, *.test, staging.*, IP addresses, known host staging domains) do not use a site slot.
environment=local|development|staging on a normal domain is also free, but capped at 3 per
licence. Log plugin_version and wp_version on every call.
Also POST /wp-json/bentogrid/v1/update (spec §6.2): returns the latest published release
and a "package" download URL signed for 48 h, but only if the licence is valid for that
site_id + token and not past its paid-up date, otherwise package is "".
Expiry grace: the licence API keeps answering valid for 14 days after expires_at and reports
expires_at + 14 days to the plugin (spec section 7.2). Dashboard and emails show the real date. GET /download/pro?t=… verifies the signature and
302-redirects to a 5-minute R2 presigned URL.
Write integration tests (Vitest) for every rule in §6.1, including: idempotent activate,
site_mismatch on the second production site for a 1-site plan, a free dev site, expired,
revoked, check with a wrong token, deactivate then re-activate elsewhere, and 503 on a
DB failure.

4. CUSTOMER ACCOUNT (/account, magic-link login)
Licences list (masked key + copy, plan, status, expiry, sites used / allowed), licence
detail (full key, activations with site, environment, plugin version and last check, a
Deactivate button per site), downloads (latest + previous Pro zips through signed URLs),
billing (link to the Paddle customer portal, invoices), profile (change email with
verification). Upgrade a plan without changing the key.

5. ADMIN DASHBOARD (/admin, is_admin + TOTP 2FA)
KPI overview (revenue 30 d, MRR, new licences, active sites, renewals due, refunds, daily
check-ins, plugin and WP version charts), orders (with raw payload), licences (search by key
or email; issue a manual key; extend; change plan/max_sites; revoke/unrevoke; reset
activations; resend email; notes), customers, activations, releases (upload zip to R2,
version, requires/tested/requires_php, Markdown changelog, stable/beta, publish switch),
email log with resend, webhook log with replay, audit log of every admin write, settings
(plans and provider price ids, sender address). Bulk import of licences from CSV
(key, email, plan, expires_at, source) for the 10 existing early-access keys.

6. JOBS
Daily /api/cron/reminders: expiry-30d, expiry-7d, expired and grace-ending emails, each
sent once per licence period, with a renewal discount coupon. Weekly /api/cron/cleanup. Both protected by CRON_SECRET.

7. QUALITY BAR
Strict TypeScript, Zod validation, DB migrations, seed script (plans + an admin user),
.env.example, README with local setup, Paddle sandbox setup and deployment steps.
Accessibility: keyboard navigation, focus states, WCAG AA contrast. All emails as React Email
templates with a plain-text part. Error tracking with Sentry. No secrets in client bundles.

Deliver the full repository, then a short list of anything that needs my input
(prices, legal text, logo, Paddle product ids).
````

---

## 13. Acceptance tests (definition of done)

Automate the API ones (Vitest + a test DB). Do the WordPress ones by hand on a local site with Pro 1.0.0 and `define( 'BOLDSPAN_BENTO_GRID_PRO_API', '<preview-url>/wp-json/bentogrid/v1/license' );` plus `define( 'BOLDSPAN_BENTO_GRID_PRO_UPDATE_API', '<preview-url>/wp-json/bentogrid/v1/update' );`.

**Licence API**
1. Unknown key on `/activate` → `404` `invalid`.
2. Valid key, new production site → `200` `valid`, token, `expires_at` = paid-up date + 14 days (or `null` for lifetime).
3. Same key and same site again → `200` `valid` with a **new** token; the old token now fails `/check`.
4. 1-site plan, second production site → `403` `site_mismatch` naming the first site.
5. Same key on `mysite.local`, `localhost`, `staging.example.com` → `200`, no slot used.
6. `environment: "staging"` on a normal domain → `200` up to 3 times, the 4th → `403`.
7. `/check` with the right token → `200`; with a wrong token or another site → `403` `site_mismatch`.
8. Revoked key → `403` `revoked` on `/activate` and `/check`.
9. Paid-up date passed by 5 days → still `valid`; by 15 days → `403` `expired`.
10. `/deactivate` → `200`, the slot is free, and another site can activate; calling it twice → `200`.
11. DB down / thrown error / rate limit → `503` JSON, never `4xx`.
12. Imported early-access key pre-bound to `a.com`: `/activate` from `a.com` → `valid`; from `b.com` → `site_mismatch`.

**Updates**
13. `/update` with a valid activation → `package` set; the link downloads the zip; after 48 h → `410`.
14. `/update` with no key, a wrong token, a revoked key, or past the paid-up date → `package: ""`, other fields present.
15. Only published `stable` releases are served.

**Payments and emails**
16. Sandbox purchase → one customer, one order, one licence, one `license-issued` email with the key and a working download link.
17. The same webhook delivered twice → still one licence and one email.
18. Bad signature → `401`, nothing created.
19. Renewal → `expires_at` extended from `max(now, expires_at)`; the plugin shows the new date after "Check now".
20. Refund → licence revoked; the plugin locks at "Check now"; the published page is unchanged.
21. Reminder cron sends `expiry-30d`, `expiry-7d`, `expired` and `grace-ending` once each, from `bentogrid@boldspan.tech` as reply-to.

**Account and admin**
22. Magic-link login works once and expires after 15 minutes.
23. Customer deactivates a site in `/account` → that site locks at its next check.
24. Admin issues a manual key with "send email" → the customer gets it; the audit log shows who did it.
25. CSV import of the 10 early-access keys: dry run shows 10 rows, commit creates them, and re-running creates nothing new.

**In WordPress (by hand)**
26. Activate, Check now, Deactivate on the Licence screen all show the right message.
27. An early-access site (activated before the server knew the key) shows a normal licence with a real expiry within a day of the key being imported.
28. Publish 1.1.1 → Dashboard → Updates offers it, "View details" shows the changelog, update installs into the same folder.
29. Server unreachable (wrong URL) → Pro stays unlocked; after 14 days without a good check it locks as "Could not verify".
