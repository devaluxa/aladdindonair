# Aladdin Donair Wholesale

Static Astro migration of the public WordPress site, now published at **https://aladdindonair.com/** on the supplied CloudPanel server. The original logo, images, page copy, product information and attribution are retained.

## Workspace and commands

Project: `G:\ASTRO SITES\aladdindonair`. The preferred G: drive was writable with about 1.76 TB free when inspected. No duplicate checkout or storage fallback was required. Use Node 24 (minimum 22.12) and npm; the lockfile pins resolved dependencies.

```powershell
cd "G:\ASTRO SITES\aladdindonair"
npm ci
npm run dev
```

- `npm run dev`: http://127.0.0.1:4350/ (loopback only; review noindex).
- `npm run check`: Astro and TypeScript checks.
- `npm test`: seven focused tests, using mocked API transports only.
- `npm run build`: checks, tests, static review build and export verification.
- `npm run build:production`: the same checks with production indexing enabled.
- `npm run preview`: serve the latest `dist/` at http://127.0.0.1:4351/.
- `npm run optimize:images`: recreate WebP assets from retained originals and update their manifest. Review packaging text after recompression.

`PUBLIC_SITE_MODE=production` controls indexing at build time. Normal development and review builds remain `noindex,nofollow` with robots disallow. Production builds emit `index,follow`, robots allow and a nine-page sitemap. The previous `/sitemap_index.xml` URL remains useful as an index of the new sitemap.

## Pages and components

Home `/`, catalogue `/products/`, a static 404, and seven product pages:

- `/chicken/`
- `/burgers/`
- `/grilled-chicken-donair-shawarma/`
- `/grilled-beef-donair/`
- `/cooked-sliced-beef-donair-loaf/`
- `/beef-donair-cones/`
- `/chicken-donair-cone-shawarma/`

`src/pages/[slug].astro` renders typed product data from `src/data/products.json` and `src/data/products.ts`. Home and catalogue copy are separate JSON files. `src/layouts/Layout.astro` shares the header/footer; `Photo`, `ProductCard`, `EmailLink` and `Enquiry` are small shared components. All product content and photographs are available without JavaScript. `docs/route-inventory.json` records coverage; the generated WordPress taxonomy archive was not imported because it duplicates product content and is absent from navigation.

The header is now a solid, flush black band in normal document flow, with the original white logo and aligned navigation. The building hero is centred beneath it. This removes the awkward translucent bar and gap shown in the review screenshot. Catalogue spacing, touch targets, focus states and mobile stacking are cleaned up. Product galleries show the full original image sets without autoplay dependencies and link to full local photographs.

## Original images and fonts

`assets/source/` retains 19 required public originals. `public/images/` contains their WebP versions and responsive variants. Originals total 8,933,234 bytes; the 19 main optimized files total 3,042,764 bytes, a 65.9% reduction. Responsive files are additional variants. Source URLs, local paths, dimensions, byte counts and SHA-256 hashes are recorded in `docs/asset-manifest.json`.

Computed source styles use Raleway for the main site, Open Sans for the inquiry heading and Montserrat for attribution. Used Latin weights are bundled locally through Fontsource, with licences in `docs/`. Essential assets do not depend on WordPress. The existing brand icon supplies the favicon. Google Maps remains an optional external embed alongside written address and directions.

The business email uses Cloudflare's documented per-address `email_off` markers so the existing published mailto remains usable without an injected decoder. The zone's existing security settings were preserved. Reference: https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/

## Contact form and business configuration

Business/contact details are centralized in `src/data/site.ts`: Alaadin Rakhamiah, office (780) 458-0201, cell (780) 983-7871 (After Hours), 12555 127 Ave NW, Edmonton, AB T5L 3E5, and Admin@aladdindonair.Com. Quote actions use the office `tel:+17804580201`. Both source product buttons still lead to `/products/`. Customer Feedback retains the source `#` destination. The footer keeps Powered By Web Design Edmonton and https://theorderguys.com/.

The form now sends real enquiries to the user-supplied, verified Aladdin OnBooking route:

`https://api.onbooking.ca/v1/submissions/62656a87-eac7-4a49-b6fc-8f41630c7fd6`

The route was confirmed active under Aladdin Donair in the connected forms admin; notification settings were not changed. The JSON contract was read from that route's Integration screen. `src/lib/enquiry.ts` submits `fields` entries for `full_name`, `email`, `phone` and `message`, plus the query-free `pageUrl` and actual `timeOnPageMs`. CORS preflight permits Content-Type and Idempotency-Key.

All four inputs are required. The UI disables the fieldset during a request, prevents duplicate submissions, uses a 20-second timeout, retains inputs on error and clears them only after an accepted response. An unchanged retry reuses both the same idempotency key and identical payload. Receipt wording does not claim email delivery. The old preview-only message and error-demo button are removed. There is no body logging, localStorage or URL-query submission. Fields/buttons remain disabled until their handlers attach; without JavaScript, phone and email alternatives remain available.

Form browser QA intercepted the POST before it reached the service, fulfilled a 500 error then a 201 acceptance, and verified retained input, retry identity, success feedback and reset. No real enquiry or notification email was sent during testing. Email-inbox delivery was therefore not claimed as tested.

## Production deployment

- Host: `148.116.84.122`, CloudPanel site/user `aladdindonair`.
- Active root: `/home/aladdindonair/htdocs/aladdindonair-release-20261017-0120/site-email-final`.
- Static files were uploaded/extracted through the authorized CloudPanel file manager and the root was switched after checking the staged HTML.
- The original `/home/aladdindonair/htdocs/aladdindonair.com` directory remains untouched for rollback. Prior staged releases also remain; no unrelated files were removed.
- A trusted Let's Encrypt certificate was installed for apex and www, valid to January 15, 2027. Direct origin HTTPS certificate verification passed.
- `docs/cloudpanel-vhost.conf` records the template with real directory handling and `error_page 404 /404.html`. Unknown routes return HTTP 404, not a homepage fallback.
- HTTP and www redirect to `https://aladdindonair.com/`.
- Cloudflare already pointed apex to the supplied server with www as a proxied CNAME. No DNS, MX, mail-service or Cloudflare security settings were changed.
- A new site-specific Ed25519 deployment key was generated outside the repository with restrictive local permissions. Fingerprint: `SHA256:EYwRhHeF5CmL8IYgy2PGOSNK8lA/yiUMlHmn6bpH3w0`. After explicit owner confirmation, the public key was saved in CloudPanel. SSH authentication with that key, `IdentitiesOnly=yes`, `BatchMode=yes` and strict host-key checking passed: `whoami` returned `aladdindonair` and `pwd` returned `/home/aladdindonair`. No existing key or password was replaced. The initial file-manager deployment did not require that new SSH access.

Rollback: restore the prior CloudPanel root value (`aladdindonair.com` for the original placeholder, or the previous retained release). Do not delete directories as part of a rollback. Future publication should stage a fresh directory, verify its extracted contents, switch the root, and verify public routes/assets.

No persistent application server, PHP, CMS, database, checkout, ordering provider, analytics, new GitHub Actions or hosting integration was added. Production consists only of the static build. The old WordPress installation was not modified or deleted.

## Validation evidence

- Final Astro check: zero errors, warnings and hints.
- All seven tests passed; production static build and export verifier passed.
- Build checks cover ten HTML pages, case-sensitive local links/assets, original product copy, image association, correct form endpoint, indexing, robots, sitemap and bundled fonts.
- Initial migration QA covered all nine content pages at 320, 390, 768, 1024 and 1440 px (45 route/width checks), plus static content without JavaScript and without WordPress access.
- Header changes passed five-width checks: top at 0, solid background, hero immediately below, no horizontal overflow. See `docs/qa-header-launch.json`.
- Form contract, error/receipt states and identical idempotent retry passed intercepted browser testing. See `docs/qa-form-launch.json`.
- Production verification fetched all 63 files at both the origin and public host: origin bytes match the final build exactly; public assets match exactly and HTML matches after accounting only for the existing Cloudflare JavaScript-detection injection and email marker removal. See `docs/qa-production.json`.
- Public indexing, correct endpoint, static mailto, real custom 404 and canonical redirects passed. Desktop/mobile browser screenshots and source comparisons were inspected. No pixel-perfect claim is made.

## Source discrepancies retained for business review

- The visible stray loaf-front/back caption on the beef-cones page was removed as cleanup.
- Beef 9 kg/12 kg source files are byte-identical, as are chicken 8 kg/10 kg source files. The supplied artwork is retained without fabricated labels. The two loaf-front filenames also contain identical copies.
- An older embedded catalogue footer contained info@; the shared visible source footer and home publish Admin@aladdindonair.Com, used consistently here.
- Existing halal/certification/no-MSG, inspection, delivery and health claims remain source copy; they were not expanded or independently verified. Review continued accuracy and older addresses printed on packaging as needed.
- Customer Feedback has no substantive destination on the source.

## Repository

Origin is exactly https://github.com/devaluxa/aladdindonair.git, using main only. The remote began empty; existing local migration history is preserved. No force push, extra branch, PR, repository-visibility change or deployment workflow was used. Required originals, optimized assets, source, lockfile and documentation are tracked; build output, dependencies, credentials and SSH keys are excluded.
