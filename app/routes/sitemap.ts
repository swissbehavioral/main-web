import {team} from "../data/team";
import { listContentRecords } from "../lib/content.server";
import type { Route } from "./+types/sitemap";

/**
 * XML sitemap (§4 SEO). Public pages + program pages + resource articles.
 * `/admin`, `/api/*` and `/healthz` are intentionally excluded.
 */
export async function loader({ request }: Route.LoaderArgs) {
  const origin =
    process.env.SITE_URL?.replace(/\/$/, "") || new URL(request.url).origin;

  const records = await listContentRecords();
  const paths = records
    .filter(
      (r) =>
        !r.archived &&
        r.published &&
        (!r.published.reviewRequired ||
          (!r.published.customized && r.id !== "page-additional-program")),
    )
    .map((r) => r.path);

  paths.push("/verify-insurance");
  paths.push(...team.members.filter(member=>member.verified).map(member=>`/team/${member.id}`));
  const escapeXml = (value:string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
  const urls = [...new Set(paths)]
    .flatMap(path => [
      {path, url:origin+path},
      {path, url:origin+path+'?lang=es'}
    ])
    .map(
      ({path,url}) =>
        `  <url>\n    <loc>${escapeXml(url)}</loc>\n    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(origin+path+'?lang=en')}"/>\n    <xhtml:link rel="alternate" hreflang="es" href="${escapeXml(origin+path+'?lang=es')}"/>\n    <changefreq>${
          path === "/" ? "weekly" : "monthly"
        }</changefreq>\n  </url>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
