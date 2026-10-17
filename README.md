# Aladdin Donair Wholesale — local Astro migration

Local review only. Nothing has been deployed. The live WordPress site, hosting, and DNS were not changed.

## Location and setup

Actual project: `G:\ASTRO SITES\aladdindonair`. The G: drive was writable and had approximately 1.76 TB free at inspection. No fallback location or duplicate checkout was required.

Use Node 24 (minimum 22.12) and npm. This follows the nearby static Astro projects. Astro is pinned to 7.3.5; `package-lock.json` records resolved dependencies.

```powershell
cd "G:\ASTRO SITES\aladdindonair"
npm ci
npm run dev
```

- Development: http://127.0.0.1:4350/
- Built production preview: `npm run preview` → http://127.0.0.1:4351/
- `npm run check` — Astro/TypeScript diagnostics.
- `npm test` — content, packaging, image and form safety checks.
- `npm run build` — check, tests, static build, internal link/asset/filename-case verification.
- `npm run optimize:images` — recreate WebP images from the retained public originals; updates the manifest. Review packaging lettering after recompression.

Both servers bind to loopback. No public tunnel, deployment automation, CMS, database, PHP, SSR, ordering integration or analytics was added.

## Pages and source structure

Home `/`, catalogue `/products/`, and seven product routes:

1. `/chicken/`
2. `/burgers/`
3. `/grilled-chicken-donair-shawarma/`
4. `/grilled-beef-donair/`
5. `/cooked-sliced-beef-donair-loaf/`
6. `/beef-donair-cones/`
7. `/chicken-donair-cone-shawarma/`

`src/pages/[slug].astro` generates products from `src/data/products.json`, with typed interfaces and separately labelled packaging in `src/data/products.ts`. The sixth-card catalogue remains faithful to the source; the seventh product is also reachable from the catalogue and More Products links. `src/layouts/Layout.astro` shares the header/footer. `Photo`, `ProductCard` and `Enquiry` are small Astro components. All core product content is static HTML.

`docs/route-inventory.json` records coverage. The page and post sitemaps together contain these nine content pages. The generated `/category/products/` archive was not imported because the requested scope is relevant visible pages; it duplicates product content and is absent from the site's public navigation. No relevant public document download was found in the audited navigation/content.

## Design and assets

The existing logo, warehouse hero, product photography, copy, black/white palette, product red accents, contact blocks and sawtooth footer are retained. Refinements: a shorter header and oversized gaps, consistent catalogue cards, responsive stacking, native keyboard-accessible mobile navigation, focus states, explicit size/carton tables, and static image galleries. The galleries show all photographs without carousel/autoplay dependencies and link to full local images. Original gallery order and loaf front/back order are retained.

`assets/source/` holds only the 19 required original public image files; `public/images/` holds WebP versions and responsive variants. See `docs/asset-manifest.json` for source URL, local path, dimensions, bytes and SHA-256 hashes. Originals total 8,933,234 bytes; the 19 main optimized images total 3,042,764 bytes, a 65.9% reduction. Smaller variants are additional files; browser loading uses the appropriate variant. Essential images are not hotlinked.

Computed styles identify Raleway for the principal site, Open Sans 600 for the inquiry heading, and Montserrat for the attribution. These are served locally through Fontsource packages; the Latin subsets and used weights are bundled. Licences are in `docs/`. The existing brand icon is reused for the favicon. Google Maps remains an optional external embed, with a normal directions link and the full written address.

## Contact and enquiry

Central configuration: `src/data/site.ts`. Published contact name remains **Alaadin Rakhamiah**, office **(780) 458-0201**, and cell **(780) 983-7871 (After Hours)**. Quote links use `tel:+17804580201`. The visible common footer publishes **Admin@aladdindonair.Com**, recovered from the rendered page; it now has a real mailto link. The attribution remains **Powered By Web Design Edmonton**, linking to https://theorderguys.com/.

Both Retail Products and Whole Sales Products go to `/products/`, as on the source. Customer Feedback is a source `#` link, preserved without an invented review destination.

The source enquiry depends on Elementor Pro Forms, WordPress `wp-admin/admin-ajax.php` and Google reCAPTCHA. Name, Email, Tel and Message are all required. The replacement uses browser validation and a local mock only. The entire fieldset and buttons start disabled until the local handlers are attached, so JavaScript-disabled browsers cannot send a default request or put inputs into a URL. It shows a pending state, blocks duplicate clicks and truthfully reports **Local preview only. No enquiry has been sent.** An explicitly labelled preview button demonstrates an error while retaining the inputs. There are no outbound form requests, storage, query-string submissions or body logging. `enquiryConfig.endpoint` is `null`; changing it alone does not enable delivery. A verified Aladdin-specific endpoint plus its submission/anti-abuse integration must be implemented and tested before launch. No private submissions or customer records were accessed.

## Validation

- Dependency installation succeeded.
- Astro check: zero errors, warnings or hints.
- Three focused tests passed.
- Static build emits ten HTML files: nine content pages and a 404.
- Build verifier checks route assets, internal links, exact filename case, source product paragraphs, required images, contact links, local fonts and review noindex.
- Browser checks covered all nine content pages at 320, 390, 768, 1024 and 1440 px: 45 checks with no overflow, broken loaded images or links back to WordPress. Details: `docs/qa-responsive.json`.
- Source desktop and mobile screenshots were captured; local screenshots were compared at the same desktop/mobile widths. This is a faithful refinement, not a pixel-perfect claim. The shortened header/spacing and expanded galleries are intentional differences. Some full-page local screenshot captures failed in the browser tool; viewport screenshots, scrolling, DOM checks and direct asset checks were used successfully.
- Mobile menu navigation was exercised. Form tests used synthetic data only: four required fields rejected an empty form; pending disabled the send button; success and error messages were truthful; error retained inputs; no POST was emitted.
- All nine pages were checked on the built preview with JavaScript disabled and requests to the original host blocked. See `docs/qa-without-js.json`. Custom 404 returned HTTP 404. Nested route direct entry/refresh succeeded. Telephone/email targets were inspected without placing calls or sending mail.
- No browser console errors/warnings were observed in the local route checks. Production preview and development server returned HTTP 200.

## Source discrepancies and launch review

- A visible stray **Cooked Sliced Beef Donair Loaf Front, Cooked Sliced Beef Donair Loaf Back** paragraph was on the beef-cones page. It was removed as a cleanup; product copy and quantities were retained.
- Source files for beef 9 kg and 12 kg are byte-identical. Chicken 8 kg and 10 kg are also byte-identical. They remain mapped to the original filenames; no labels or packaging artwork were fabricated. Correct distinct photographs require business review if desired. The two loaf front filenames are also identical copies.
- An embedded catalogue footer has older `info@aladdindonair.com` copy, while the shared visible footer and home show `Admin@aladdindonair.Com`. The shared published address is used consistently.
- Existing halal/certified/no-MSG, inspection, delivery, and health marketing claims are retained as source copy, without new claims or independent verification. Confirm their continued accuracy and any older addresses printed on packaging before launch.
- Customer Feedback has no substantive destination on the source.

## Git and deployment safety

Origin: https://github.com/devaluxa/aladdindonair.git. The remote was empty. The unborn local default `review` branch was renamed to `main` before the first commit; no existing history was overwritten and no other branch was created or pushed.

No workflow files, active local hooks or deployment scripts exist. GitHub settings showed no repository webhooks and GitHub Pages disabled. Installed apps with access include Cloudflare Workers and Pages and Vercel. Their hosting-side project connections could not be verified. Per the brief, the source push is held to avoid any possibility of an automatic deployment. No repository settings or app permissions were changed. The completed source is committed locally on main.

Future hosting is intentionally inactive: serve `dist/` as static files, configure directory indexes and the 404, connect and verify real enquiry delivery, review canonical/social URL metadata, remove review `noindex,nofollow` only when launch is authorized, and approve/verify any hosting integration before the first source push. Do not deploy this preview build as-is.
