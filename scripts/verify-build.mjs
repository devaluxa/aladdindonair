import {readFile,readdir,stat,access} from 'node:fs/promises';
import {join,resolve,relative} from 'node:path';
import assert from 'node:assert/strict';
const root=resolve('dist');
const products=JSON.parse(await readFile('src/data/products.json','utf8'));
async function walk(dir){let files=[];for(const name of await readdir(dir)){const p=join(dir,name);if((await stat(p)).isDirectory())files.push(...await walk(p));else files.push(p);}return files;}
const files=await walk(root), htmlFiles=files.filter(f=>f.endsWith('.html'));
assert.equal(htmlFiles.length,10,'Home, catalogue, seven products and 404');
for(const file of htmlFiles){
 const html=await readFile(file,'utf8');assert.match(html,/noindex,nofollow/);assert.match(html,/mailto:Admin@aladdindonair.Com/);assert.match(html,/https:\/\/theorderguys.com\//);
 assert.doesNotMatch(html,/[A-Z]:[\\/]/,'No Windows paths');
 assert.doesNotMatch(html.replace(/<link rel="canonical"[^>]*>/g,''),/(?:src|href)=["']https:\/\/aladdindonair.com\/(?:wp-content|wp-admin|products|chicken|burgers)/,'No runtime or navigation dependency on WordPress');
 assert.doesNotMatch(html,/\[email.?protected\]|cdn-cgi|onbooking|iorders|orderance/i);
 for(const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)){
  const url=match[1];if(!url.startsWith('/')||url.startsWith('//'))continue;
  const path=url.split(/[?#]/)[0];if(!path)continue;
  const target=join(root,path,path.endsWith('/')?'index.html':'');await access(target);
  // Exact-case check for future Linux hosting.
  const segments=relative(root,target).split(/[\\/]/);let current=root;
  for(const segment of segments){assert.ok((await readdir(current)).includes(segment),`Case mismatch: ${url}`);current=join(current,segment);}
 }
}
for(const p of products){const html=await readFile(join(root,p.slug,'index.html'),'utf8');assert.match(html,/tel:\+17804580201/);for(const i of p.images)assert.ok(html.includes(i.local));for(const paragraph of p.paragraphs)assert.ok(html.includes(paragraph.replaceAll('&','&amp;')),`${p.slug}: missing source copy`);}
for(const file of files.filter(f=>f.endsWith('.css'))){const css=await readFile(file,'utf8');assert.doesNotMatch(css,/https?:\/\/(?:aladdindonair|fonts.googleapis|fonts.gstatic)/);}
assert.ok(files.some(f=>f.endsWith('.woff2')),'Fonts bundled locally');
console.log(`Verified ${htmlFiles.length} static HTML pages, all local links/assets, exact filename case, original product copy, review noindex and local fonts.`);
