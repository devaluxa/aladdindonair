import type { APIRoute } from 'astro';
export const GET: APIRoute = () => new Response(
 import.meta.env.PUBLIC_SITE_MODE === 'production'
  ? 'User-agent: *\nAllow: /\nSitemap: https://aladdindonair.com/sitemap.xml\n'
  : 'User-agent: *\nDisallow: /\n',
 { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
);
