import { allFaq, pages, site, siteDescription, siteUrl } from "../site";

// Plain-text summary for AI assistants and answer engines (llmstxt.org).
export function GET() {
  const body = [
    `# ${site.name}`,
    "",
    `> ${siteDescription}`,
    "",
    "## Pages",
    ...pages.filter((p) => p.priority >= 0.5).map((p) => `- [${p.title}](${siteUrl}${p.path === "/" ? "" : p.path}): ${p.description}`),
    "",
    "## Links",
    `- [Free plugin on WordPress.org](${site.freeUrl})`,
    `- Support: ${site.email}`,
    "",
    "## FAQ",
    ...allFaq.map(([q, a]) => `### ${q}\n${a}\n`),
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
