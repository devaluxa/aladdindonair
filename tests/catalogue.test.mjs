import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const products=JSON.parse(readFileSync(new URL('../src/data/products.json',import.meta.url),'utf8'));
const bySlug=Object.fromEntries(products.map(p=>[p.slug,p]));
test('complete public product inventory has distinct, resolvable image sets',()=>{
 assert.equal(products.length,7);
 for(const p of products){assert.ok(p.paragraphs.length);assert.equal(p.related.length,7);for(const image of [...p.images,p.card]){assert.ok(image.width>0&&image.height>0);assert.ok(existsSync(new URL('../public'+image.local,import.meta.url)));assert.ok(image.source.startsWith('https://aladdindonair.com/wp-content/uploads/'));}}
 assert.match(bySlug['grilled-chicken-donair-shawarma'].images[0].local,/grilled-chicken/);
 assert.match(bySlug['grilled-beef-donair'].images[0].local,/grilled-beef/);
});
test('source product sizes, cuts and carton quantities are preserved',()=>{
 const text=s=>bySlug[s].paragraphs.join(' ');
 for(const size of ['4 oz','5 oz','6 oz','7 oz','8 oz'])assert.ok(text('burgers').includes(size));
 for(const s of ['grilled-chicken-donair-shawarma','grilled-beef-donair'])assert.match(text(s),/500 g/);
 assert.match(text('cooked-sliced-beef-donair-loaf'),/1 kg/);
 for(const q of ['3 x 5 kg','2 x 9 kg','1 x 12 kg'])assert.ok(text('beef-donair-cones').includes(q));
 for(const q of ['3 x 5 kg','2 x 8 kg','2 x 10 kg'])assert.ok(text('chicken-donair-cone-shawarma').includes(q));
 assert.match(text('chicken'),/Thighs, legs, breasts/);assert.match(text('chicken'),/skin on and skin off/);
 const loaf=bySlug['cooked-sliced-beef-donair-loaf'].images;
 assert.equal(loaf.length,2);assert.match(loaf[0].local,/aladdin-sliced-beef-loaf/);assert.match(loaf[1].local,/loaf-back/);
});
test('review form cannot send enquiries to WordPress or another endpoint',()=>{
 const form=readFileSync(new URL('../src/components/Enquiry.astro',import.meta.url),'utf8');
 assert.match(form,/preventDefault/);assert.match(form,/No enquiry has been sent/);
 assert.doesNotMatch(form,/fetch\(|XMLHttpRequest|localStorage|admin-ajax|onbooking/i);
 assert.match(form,/<fieldset id="enquiry-fields" disabled>/,'No-JavaScript preview cannot submit');
 assert.match(form,/<form[^>]+method="post"/,'Native fallback cannot encode personal data in the URL');
 const config=readFileSync(new URL('../src/data/site.ts',import.meta.url),'utf8');assert.match(config,/endpoint: null/);
});
