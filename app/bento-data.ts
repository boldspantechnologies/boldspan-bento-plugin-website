export type T = { c: number; r: number; x?: number; y?: number };
export type Preset = { id: string; name: string; pro?: boolean; rows: number; tiles: T[] };

const even = (n: number, c: number, r: number): T[] => Array.from({ length: n }, () => ({ c, r }));

// 12-column grid; r = row units.
export const presets: Preset[] = [
  { id: "split", name: "Split 50/50", rows: 4, tiles: even(2, 6, 4) },
  { id: "hero", name: "Hero Focus", rows: 4, tiles: [{ c: 8, r: 4 }, { c: 4, r: 2 }, { c: 4, r: 2 }] },
  { id: "quad", name: "Balanced Quad", rows: 4, tiles: even(4, 6, 2) },
  { id: "feature5", name: "Feature 5", rows: 4, tiles: [{ c: 6, r: 4 }, ...even(4, 3, 2)] },
  {
    id: "mosaic8", name: "Mosaic Eight", pro: true, rows: 6,
    tiles: [{ c: 6, r: 4 }, ...even(4, 3, 2).slice(0, 4), ...even(3, 4, 2)].slice(0, 8),
  },
  { id: "even9", name: "Even 3 x 3", pro: true, rows: 6, tiles: even(9, 4, 2) },
];

export const tileStyles: { bg: string; fg: string }[] = [
  { bg: "linear-gradient(135deg,#3560d8,#6ea0f5)", fg: "#fff" },
  { bg: "#0d0d0d", fg: "#fff" },
  { bg: "linear-gradient(135deg,#d6e3ff,#f0f5ff)", fg: "#0d0d0d" },
  { bg: "linear-gradient(135deg,#1d2b64,#3560d8)", fg: "#fff" },
  { bg: "#ffffff", fg: "#0d0d0d" },
  { bg: "linear-gradient(135deg,#6ea0f5,#b9f0f7)", fg: "#0d0d0d" },
];

export const tileTitles = ["Design", "Launch", "Create", "Grow", "Ship", "Style", "Build", "Share", "Scale", "Motion", "Layout", "Showcase"];

// Illustrative thumbnails for the home gallery (explicit x/y placement).
const t = (x: number, y: number, c: number, r: number): T => ({ x, y, c, r });

export const gallery: Preset[] = [
  { id: "g-hero", name: "Hero Focus", rows: 4, tiles: [t(1, 1, 8, 4), t(9, 1, 4, 2), t(9, 3, 4, 2)] },
  { id: "g-asym", name: "Asymmetric 5", rows: 4, tiles: [t(1, 1, 7, 2), t(8, 1, 5, 3), t(1, 3, 3, 2), t(4, 3, 4, 2), t(8, 4, 5, 1)] },
  { id: "g-edit", name: "Editorial Mosaic", pro: true, rows: 4, tiles: [t(1, 1, 5, 4), t(6, 1, 7, 2), t(6, 3, 4, 2), t(10, 3, 3, 2)] },
  { id: "g-mag", name: "Magazine", pro: true, rows: 5, tiles: [t(1, 1, 8, 3), t(9, 1, 4, 3), t(1, 4, 4, 2), t(5, 4, 8, 2)] },
  { id: "g-app", name: "App Dashboard", pro: true, rows: 6, tiles: [t(1, 1, 3, 6), t(4, 1, 9, 2), t(4, 3, 5, 4), t(9, 3, 4, 2), t(9, 5, 4, 2)] },
  { id: "g-mas", name: "Masonry Bento", pro: true, rows: 6, tiles: [t(1, 1, 5, 6), t(6, 1, 3, 3), t(9, 1, 4, 2), t(9, 3, 4, 4), t(6, 4, 3, 3)] },
  { id: "g-f5", name: "Feature 5", rows: 4, tiles: [t(1, 1, 6, 4), t(7, 1, 3, 2), t(10, 1, 3, 2), t(7, 3, 3, 2), t(10, 3, 3, 2)] },
  {
    id: "g-ban", name: "Banner Eleven", pro: true, rows: 6,
    tiles: [t(1, 1, 12, 2), t(1, 3, 3, 2), t(4, 3, 3, 2), t(7, 3, 3, 2), t(10, 3, 3, 2), t(1, 5, 2, 2), t(3, 5, 2, 2), t(5, 5, 2, 2), t(7, 5, 2, 2), t(9, 5, 2, 2), t(11, 5, 2, 2)],
  },
  {
    id: "g-m12", name: "Mosaic Twelve", pro: true, rows: 6,
    tiles: [t(1, 1, 4, 4), t(5, 1, 3, 2), t(8, 1, 2, 2), t(10, 1, 3, 2), t(5, 3, 4, 2), t(9, 3, 4, 2), t(1, 5, 3, 2), t(4, 5, 3, 2), t(7, 5, 2, 2), t(9, 5, 2, 2), t(11, 5, 2, 1), t(11, 6, 2, 1)],
  },
];
