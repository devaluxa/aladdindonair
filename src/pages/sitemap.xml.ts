import type { APIRoute } from 'astro';
import { products } from '../data/products';
export const GET: APIRoute = () => {
 const routes = ['/', '/products/', ...products.map(product => `/${product.slug}/`)];
 return new Response('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
  routes.map(route => `<url><loc>https://aladdindonair.com${route}</loc></url>`).join('') + '</urlset>',
  { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
