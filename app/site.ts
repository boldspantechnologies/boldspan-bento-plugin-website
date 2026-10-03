// Edit these once: every CTA on the site reads from here.
export const site = {
  name: "BoldSpan Bento Grid",
  maker: "BoldSpan",
  email: "bentogrid@boldspan.tech",
  freeUrl: "https://wordpress.org/plugins/boldspan-bento-grid/",
  proUrl: "/pricing/",
  price: { pro: "$5", unit: "/month" },
};

export type Billing = "monthly" | "annual" | "lifetime";

// TODO: replace prices and checkout links (`buy`) once payments are set up.
export const tiers = [
  { slug: "personal", name: "Personal", sites: "1 site", featured: false, price: { monthly: 5, annual: 35, lifetime: 105 }, buy: { monthly: "#", annual: "#", lifetime: "#" } },
  { slug: "business", name: "Business", sites: "5 sites", featured: true, price: { monthly: 10, annual: 70, lifetime: 210 }, buy: { monthly: "#", annual: "#", lifetime: "#" } },
  { slug: "agency", name: "Agency", sites: "20 sites", featured: false, price: { monthly: 20, annual: 140, lifetime: 420 }, buy: { monthly: "#", annual: "#", lifetime: "#" } },
];

export const freeFeatures = [
  "2 to 5 tiles per grid",
  "9 layout presets + 9 patterns",
  "Colours, gradients, borders, overlays",
  "Lift, image zoom and glow hovers",
  "Gutenberg and Elementor",
  "Community support",
];

export const proFeatures = [
  "Everything in Free",
  "Up to 12 tiles, 26 layouts",
  "Glass tiles",
  "3D tilt, reveal, border glow, spotlight",
  "Fade, slide and zoom scroll reveals",
  "Updates and priority email support",
];

// Paste a YouTube video ID into `id` to make a video go live. Empty = "coming soon" slot.
export const videos = [
  { id: "", title: "Install & your first grid", time: "2 min" },
  { id: "", title: "Layouts & presets", time: "3 min" },
  { id: "", title: "Hover effects & scroll reveals", time: "3 min" },
  { id: "", title: "Using it in Elementor", time: "2 min" },
  { id: "", title: "Buy & activate Pro", time: "2 min" },
];

export const steps = [
  { n: "01", title: "Install", body: "Plugins → Add New → search “BoldSpan Bento Grid” → Activate." },
  { n: "02", title: "Pick a layout", body: "Choose a tile count and one of the visual presets." },
  { n: "03", title: "Fill the tiles", body: "Add images, titles, captions, links or any blocks." },
  { n: "04", title: "Publish", body: "Style it, add a hover effect, hit Update. Done." },
];

export const compare: [string, string, string][] = [
  ["Editors", "Gutenberg + Elementor", "Gutenberg + Elementor"],
  ["Tiles per grid", "2 to 5", "2 to 12"],
  ["Layout presets", "9", "26 total"],
  ["Block patterns", "9 ready-made", "Same patterns"],
  ["Tile content", "Image + text, or any blocks", "Everything in Free"],
  ["Colours, gradients, borders, overlay", "Yes", "Yes"],
  ["Glass tiles", "No", "Yes"],
  ["Hover: Lift, Image zoom, Glow", "Yes", "Yes"],
  ["Hover: 3D tilt, Reveal, Border glow, Spotlight", "No", "Yes"],
  ["Scroll reveals: Fade, Slide, Zoom", "No", "Yes"],
  ["Support", "Community", "Priority email"],
];

export const presets: { n: number; free: string[]; pro: string[] }[] = [
  { n: 2, free: ["Split 50/50", "Asymmetric 70/30"], pro: [] },
  { n: 3, free: ["Hero Focus", "Triple Row"], pro: [] },
  { n: 4, free: ["Balanced Quad", "Showcase 4"], pro: ["Editorial Mosaic", "Spotlight", "Magazine"] },
  { n: 5, free: ["Feature 5", "Asymmetric 5", "Strip 5"], pro: ["Masonry Bento", "Gallery Wall", "App Dashboard"] },
  { n: 6, free: [], pro: ["Hero Six", "Even 3 x 2"] },
  { n: 7, free: [], pro: ["Feature Seven"] },
  { n: 8, free: [], pro: ["Mosaic Eight", "Even 4 x 2"] },
  { n: 9, free: [], pro: ["Even 3 x 3"] },
  { n: 10, free: [], pro: ["Feature Ten", "Even 5 x 2"] },
  { n: 11, free: [], pro: ["Banner Eleven"] },
  { n: 12, free: [], pro: ["Mosaic Twelve", "Even 4 x 3"] },
];

export const comingSoon = [
  "Dynamic grids from posts or WooCommerce",
  "Mesh gradients & video backgrounds",
  "Custom per-tile span builder",
  "Saved reusable layout libraries",
  "Per-breakpoint preset overrides",
  "Lightbox / filterable gallery",
  "Download, anchor and popup link targets",
  "Animated icon & counter tiles",
  "Global bento style presets",
];

export const faq: [string, string][] = [
  ["Do I need the free plugin to use Pro?", "Yes. Pro is an add-on and needs the free plugin installed and active."],
  ["Does it work with Elementor?", "Yes. Gutenberg and Elementor are both supported in Free and Pro, with the same layouts and output."],
  ["What happens if my Pro licence expires or I remove Pro?", "Nothing breaks. Published grids keep their saved content and markup. Elementor grids fall back to the Free layout with the same tile count, Pro-only controls lock again, and Free layouts and effects keep working."],
  ["What is the difference between monthly, annual and lifetime?", "Monthly and annual are subscriptions: you get Pro features, updates and priority support while the plan is active. Annual costs less per month. Lifetime is a single payment: you pay once and it is yours for life, with no renewals. All three unlock the same Pro features."],
  ["Can I upgrade my licence?", "Yes. An annual licence can be upgraded to Lifetime, and a discount is applied for the time remaining on your annual plan. A single-site licence can also be upgraded to a bigger pack."],
  ["Can I use extra staging, dev and local sites with a single licence?", "Yes. Valid staging, dev and local sites do not use up your licence quota. Only your live production sites count. To move a key to a new production site, deactivate it first."],
  ["Do you offer a refund?", "Yes, we have a 30-day refund policy. If you are not satisfied with your purchase for any reason, request a refund within 30 days of the purchase date. Email " + site.email + " with your purchase details and we will take it from there."],
  ["Will it slow my site down?", "The Free output is static, cache-friendly markup with no jQuery. The stylesheet only loads on pages that render a grid."],
];

