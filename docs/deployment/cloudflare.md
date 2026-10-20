# Reversible Cloudflare static hosting option

This repository did not specify an intended Cloudflare account, hostname or deployment target. This is an **unprovisioned option**, not a selected production host or a release. No account, domain, Worker, database, auth service or provider has been created or contacted for application data. Existing native Vite/Vue Router, browser-only JSON imports and LUM rendering remain intact.

## Artifact and routing contract

`npm run build` creates the normal `dist/` SPA. `wrangler.jsonc` binds only that directory to `ASSETS`; `deploy/static.ts` is a small standards-based response handler. It has no external fetches, APIs, secrets, Node compatibility flag or persistent resources. Both Workers development URLs and preview URLs are disabled in configuration; the Worker name is a placeholder, with no account ID or routes.

The handler runs first for every request. Cloudflare's automatic SPA fallback and HTML redirects are disabled (`not_found_handling: none`, `html_handling: none`). This is intentional: a blanket SPA fallback can turn missing module/font requests into successful HTML. Headers are applied by the handler to **all** responses, including generated errors; an `_headers` file alone would not cover those responses.

| Request | HTTP result | Browser cache |
| --- | --- | --- |
| `/`, `/index.html` | 200 built index | `no-cache` (revalidate) |
| `/tournament/<single path segment>` with optional trailing slash | 200 index, native Vue route/data loader | `no-cache` |
| Existing fingerprinted JS/CSS/WOFF2 under `/assets/` | Original bytes/MIME, 200; conditional ETag 304 | `public, max-age=31536000, immutable` |
| Missing resource/file-like path, including under `/assets/`, regardless of HTML Accept | Plain-text 404, never index | `no-store`, never immutable |
| Unknown document route with `Accept: text/html` | **404 index shell**, then Vue's existing Page Not Found view | `no-store` |
| Other unknown requests | Plain-text 404 | `no-store` |
| Methods other than GET/HEAD | Plain-text 405, `Allow: GET, HEAD` | `no-store` |
| Unavailable built index | Plain-text 503 | `no-store` |

HEAD returns the same status/security/cache headers without a body. The asset binding performs matching, not a user-controlled filesystem path. Immutable caching is applied only after a successful asset response or ETag 304, never by a broad path-only header rule on errors. Static nonfingerprinted files use `no-cache`. Fingerprinted resources can remain cached for a year; an atomic future release must retain its matching HTML/assets. No CDN plan/cache-rule behavior is claimed from localhost testing.

Unknown-route semantics are deliberately mixed: a **direct/reloaded** unknown HTML URL has HTTP 404 and renders the client not-found page. A client-side navigation after an already successful document cannot retroactively change that document's HTTP status. Known tournament URL shapes get 200 even if the client data loader later reports an unknown tournament; this preserves the existing client behavior and is not an HTTP data-existence API. File-like path segments are treated as resource requests rather than SPA documents. Development URLs `/library`, `/lab`, `/dock-iterations` and `/tailwind-test` are unknown production routes.

## Origin-root base only

Vite explicitly uses `base: '/'`; Vue Router uses `createWebHistory(import.meta.env.BASE_URL)`. HTML references absolute `/assets/...` URLs; CSS references locally bundled fingerprinted Geist/Geist Mono fonts. No CDN fonts or external scripts are required. A nonexistent stock `/vite.svg` link was removed. Missing favicon requests remain ordinary uncached 404s.

This option does **not** support mounting under `/some-prefix/`. Runtime tests check that prefixed document paths are not mistaken for valid tournament routes and prefixed missing assets remain 404. A future subdirectory host requires a coordinated Vite base, Vue Router base and handler-prefix change with another rehearsal; changing only a dashboard setting is insufficient.

Production build checks inspect every emitted JS chunk for development page/navigation markers and the Node/provider MCP prototype. The development navigation is behind a development-only async import, so its path strings and component are not emitted into production JS. Development routes remain available for existing cloud visual comparisons; their markup/layout is unchanged.

## Security headers and CSP inventory

The response policy is centralized in `deploy/static.ts` and tested on documents, successful assets, conditional responses and missing resources:

- CSP defaults deny; scripts are same-origin only with no `unsafe-inline` or `unsafe-eval`. `script-src-attr 'none'` denies inline event handlers. Native production templates are precompiled; Vue event listeners use JavaScript rather than HTML handlers. A real browser insertion test proves an inline script is blocked.
- **Styles are not strict:** chart widths, team colors, SVG/player stacks and control state use Vue style attributes. `style-src-attr 'unsafe-inline'` deliberately permits them, with a same-origin stylesheet source. Modern browsers' `style-src-elem 'self'` disallows inline style blocks; older browsers lacking that split directive can fall back to the broader `style-src 'self' 'unsafe-inline'`. No nonce/hash-based strict-CSP claim is made. Removing this allowance requires a separate chart/style implementation, not a header-only change.
- Images allow same-origin and `data:` for the CSS/SVG mask inventory. Fonts are same-origin. `connect-src 'self'` accommodates Vite's module-preload fetch fallback; the application needs no remote provider requests. No `blob:`, arbitrary remote script/style/font host, worker or WebSocket allowance is added.
- Objects, framing, base URI and form submissions are denied. `nosniff`, `X-Frame-Options: DENY`, no-referrer, camera/microphone/geolocation denial and same-origin opener/resource policies are included.

Tests run the real app first with **zero CSP violations**, including dynamic chart styles and imports, then verify the explicit style-attribute allowance and inline-script denial. The policy trusts same-origin compiled scripts and permits inline style attributes; it is not a complete XSS defense. HTTPS/TLS, HSTS policy, real edge cache configuration, logs and Safari/Firefox behavior are not certified by local workerd/Chromium. No real domain was chosen on which to configure them.

## Rehearsal, without login or credentials

Run only in the cloud workspace/CI. Node 24 is used; Wrangler **4.151.2**, workerd **1.20261019.1** and all dependencies are frozen in the lockfile. Installation uses the configured cloud package proxy; the rehearsal after installation is local/offline.

```sh
npm ci --include=dev --no-audit --no-fund
npm run typecheck
npm run lint
npm run test:lint-discovery
npm run test -- --run --maxWorkers=2
npm run test:dependencies
npm run build
npm run cloudflare:dry-run
npm run cloudflare:local
```

In another cloud shell, while the local server is ready on **127.0.0.1:8787**:

```sh
# Set CHROMIUM_PATH=/usr/bin/chromium for this managed cloud's system browser;
# CI uses the frozen Playwright browser installed by its existing workflow.
npm run test:cloudflare
APEX_TEST_URL=http://127.0.0.1:8787 APEX_SCREENSHOT_DIR=work/cloudflare-browser npm run test:browser
npm audit --json
npm audit --omit=dev --json
```

The wrapper exposes only `local` and `dry-run` modes. Its child process receives an environment allowlist (PATH/temp location/CI flags), **no Cloudflare credentials/account ID or proxy variables**. Wrangler configuration/logs are isolated under ignored `work/wrangler-config`; telemetry and automatic `Request.cf` metadata fetching are explicitly disabled. No `.env`/`.dev.vars` file is needed or present; do not add one for this static rehearsal. The first attempted local startup exposed Wrangler's default metadata lookup, which failed at DNS/timeout in this cloud. Setting `CLOUDFLARE_CF_FETCH_ENABLED=false` removes that lookup; the clean local startup uses only the local asset binding. No token, browser profile or credential handoff was used.

`cloudflare:dry-run` runs Wrangler's packaging command with `--dry-run`, writes the bundle under ignored `work/cloudflare-dry-run`, reports its `ASSETS` binding and exits **without upload**. It is not proof of account permissions, a successful edge release or an asset upload. The local command starts Miniflare/workerd, not Vite preview; Ctrl-C stops its process group, with a bounded five-second kill fallback. Install/build before starting it: reinstalling dependencies underneath an existing workerd session invalidated that development session during verification; restarting after the frozen install restored the clean rehearsal. CI always installs/builds before startup. Disposable local state is under ignored `work/`. Wrangler's generated `.wrangler/` directory is ignored by Git and lint, like `dist/`; no application-source exclusion or quality rule was relaxed. Worker/CLI/test code is included in strict tool typecheck and lint.

## Failure evidence and bounded CI

[HTTP control comparison](preview-vs-workerd.json) and [observed runtime HTTP results](http-results.json) records the actual built dist under Vite preview versus the workerd target. With HTML Accept, preview returned **200 index HTML** for unknown routes and missing fingerprinted JS/CSS/WOFF2, without CSP. Workerd returns **404 plain text/no-store** for those missing assets, and **404 index/no-store** only for unknown HTML document routes. This comparison is a local control, not a claim that preview was deployed anywhere.

The runtime check compares bytes/MIME for every emitted asset, tests HEAD and conditional ETags, repeated missing-resource requests, root/direct/reloaded tournament URLs, unknown routes, base-path assumptions, unavailable development routes and all security headers. At 320px/1440px it exercises local font loading, chart styles, imported JSON with prototype-looking/shared player IDs, invalid-color rejection, prior frame/selection, unknown-route reload/back navigation and CSP enforcement. The existing **six** production browser cases are additionally rerun against workerd, retaining all byte/aggregate/player budgets, identity/math/filter/focus/playback tests. Existing Vite preview tests and all 60 visual pairs remain enabled.

CI has a one-minute packaging step and a five-minute runtime/browser step. It waits at most 30 seconds for localhost, uses five-second HTTP request timeouts and ten-second focused browser waits, and traps server cleanup. Failure responses/logs are retained, not turned into success. Its 14-day evidence artifact includes workerd logs, dry-run output, HTTP results, screenshots and all existing visual evidence. Full/runtime audit gates remain enabled at zero findings.

## Future release decision (outside this task)

No deployment command is wired into CI or an npm release script. Before any separately authorized release, the owner must choose the intended account/Worker name and root hostname, review routing/TLS/cache policies and Cloudflare plan limits, and decide whether the explicit unknown-route 404 shell is acceptable. This option invokes a Worker for every request; plan/request limits must be evaluated for that future host. Rebuild and repeat this rehearsal against the exact proposed release tree, then use a separately approved release procedure. Nothing in this runbook provisions resources or authorizes a live deployment.

Official references: [asset binding/routing options](https://developers.cloudflare.com/workers/static-assets/binding/), [HTML handling](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/), [headers and Worker-response caveat](https://developers.cloudflare.com/workers/static-assets/headers/), [Wrangler commands](https://developers.cloudflare.com/workers/wrangler/commands/). The actual offline CLI help/config schema and Miniflare metadata flag were also inspected for the pinned versions.

## Recorded verification result

Cloud Node 24.19.0 / npm 11.9.0 with system Chromium 154.0.8037.57: frozen installation, strict app/tool/Worker typecheck, lint, lint-discovery fixtures, **46 unit/component tests**, two offline MCP protocol round-trips, production build and offline Wrangler dry-run all exit 0. The focused workerd HTTP suite and both 320/1440 browser cases pass; the existing six production cases also pass against workerd. All **60 visual pairs** retain identical dimensions/headings/fonts (42 pixel-identical, including all 18 production captures). [Full audit](audit-full.json) and [runtime audit](audit-runtime.json) both report **zero**, exit 0, including the newly pinned Wrangler graph.

Workerd screenshots retain the selected Beta and the imported frame after a rejected color: [1440px](../design/screens/1440-workerd-import-retained.png), [320px](../design/screens/320-workerd-import-retained.png). The exact published-head hosted run and artifact are linked from PR #1; its bounded runtime step repeats these checks from a fresh frozen install. These checks establish local workerd readiness, not a Cloudflare edge release, real account access or human design approval. Original Paper PNGs/human approval and the exact session model ID/reasoning setting remain unavailable.

The first [hosted runtime run](https://github.com/goatcheese98/apex-dashboard/actions/runs/39392995693) retained its failure artifact: all HTTP and existing browser checks passed, but the 1440px style probe sampled an animated bar before its first positive-width frame. The probe now waits at most ten seconds for that rendered condition before asserting it; no application, CSP or quality gate was weakened. The complete pipeline is rerun on the follow-up head.
