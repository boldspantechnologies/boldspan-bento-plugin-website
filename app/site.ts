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


// Canonical origin. Set NEXT_PUBLIC_SITE_URL in Vercel if the domain differs.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://boldspan.tech").replace(/\/$/, "");

export const siteDescription =
  "BoldSpan Bento Grid is a WordPress bento grid plugin for Gutenberg and Elementor. Build responsive bento box layouts in minutes with 26 layout presets, hover effects and scroll reveals. Free plugin, Pro from $5/month.";

// Public, indexable pages. Drives sitemap.xml and llms.txt.
export const pages: { path: string; title: string; description: string; priority: number }[] = [
  { path: "/", title: "BoldSpan Bento Grid: Bento Grid Plugin for WordPress", description: siteDescription, priority: 1 },
  { path: "/features", title: "Features: Bento Grid Layouts, Effects & Blocks for WordPress", description: "Everything in the BoldSpan Bento Grid WordPress plugin: responsive bento layouts, colours, gradients, glass tiles, hover effects, scroll reveals, Gutenberg and Elementor support.", priority: 0.9 },
  { path: "/pricing", title: "Pricing: Bento Grid Pro for WordPress from $5/month", description: "Bento Grid Pro pricing. Monthly, annual and lifetime licences for 1, 5 or 20 WordPress sites. 30-day refund policy. The core plugin is free.", priority: 0.9 },
  { path: "/layouts", title: "Bento Grid Layouts: 26 Presets for 2 to 12 Tiles", description: "Browse every bento grid layout preset: split, hero focus, masonry, magazine, gallery wall, dashboard and even grids from 2 to 12 tiles.", priority: 0.8 },
  { path: "/effects", title: "Bento Grid Hover Effects & Scroll Animations", description: "Lift, image zoom, glow, 3D tilt, reveal, border glow and spotlight hover effects, plus fade, slide and zoom scroll reveals for WordPress bento grids.", priority: 0.8 },
  { path: "/docs", title: "Documentation: How to Build a Bento Grid in WordPress", description: "Install the plugin, pick a layout, fill the tiles and publish. Step-by-step docs for Gutenberg and Elementor, plus Pro licence activation.", priority: 0.8 },
  { path: "/videos", title: "Video Tutorials: Bento Grid for WordPress", description: "Video walkthroughs: installing, layouts and presets, hover effects, scroll reveals, Elementor and activating Pro.", priority: 0.5 },
  { path: "/about", title: "About BoldSpan", description: "BoldSpan builds focused WordPress plugins. Learn about the team behind the BoldSpan Bento Grid plugin.", priority: 0.5 },
  { path: "/contact", title: "Contact & Support", description: "Contact BoldSpan for support, licence questions or refunds on the Bento Grid WordPress plugin.", priority: 0.5 },
  { path: "/privacy", title: "Privacy Policy", description: "How BoldSpan handles your data.", priority: 0.2 },
  { path: "/terms", title: "Terms of Service", description: "Terms of service for the BoldSpan Bento Grid plugin and licences.", priority: 0.2 },
  { path: "/refund-policy", title: "Refund Policy: 30-Day Money Back", description: "BoldSpan Bento Grid Pro has a 30-day refund policy. Here is how to request one.", priority: 0.3 },
];

export const pageMeta = (path: string) => {
  const p = pages.find((x) => x.path === path)!;
  return {
    title: { absolute: p.title },
    description: p.description,
    alternates: { canonical: path },
    openGraph: { title: p.title, description: p.description, url: path },
  };
};

// Extra FAQs aimed at common search queries. Merged with `faq` for FAQPage JSON-LD and the FAQ sections.
export const seoFaq: [string, string][] = [
  ["What is a bento grid in WordPress?", "A bento grid is a layout of tiles of different sizes arranged like a bento box, popular for feature sections, portfolios and landing pages. BoldSpan Bento Grid lets you build one in WordPress without writing CSS."],
  ["What is the best bento grid plugin for WordPress?", "BoldSpan Bento Grid is a free WordPress bento grid plugin with 9 free layout presets, Gutenberg and Elementor support, and optional Pro features: 26 layouts, up to 12 tiles, glass tiles, hover effects and scroll reveals."],
  ["Is there a free bento grid plugin for WordPress?", "Yes. The core BoldSpan Bento Grid plugin is free on WordPress.org and includes 2 to 5 tile grids, 9 layout presets, 9 block patterns, colours, gradients, borders and overlays."],
  ["How do I create a bento grid in Gutenberg or Elementor?", "Install and activate BoldSpan Bento Grid, add the Bento Grid block or Elementor widget, choose a tile count and layout preset, fill each tile with an image and text, then publish."],
];

export const allFaq: [string, string][] = [...seoFaq, ...faq];
