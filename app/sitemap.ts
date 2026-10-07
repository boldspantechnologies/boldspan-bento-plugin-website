import type { MetadataRoute } from "next";
import { pages, siteUrl } from "./site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return pages.map((p) => ({
    url: p.path === "/" ? siteUrl : `${siteUrl}${p.path}`,
    lastModified,
    changeFrequency: p.priority >= 0.8 ? "weekly" : "monthly",
    priority: p.priority,
  }));
}
