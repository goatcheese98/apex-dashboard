# Scope and verification

Only `goatcheese98/apex-dashboard` is changed. Branch: `codex/lum-dashboard-workspace`, based on current default `main` at `ee8a53665e32ef6bd564f7a3e51f05e84df81a47`, matching the restored source inventory. Original checkout was clean. One draft PR contains a separately verified foundation commit followed by the complete workspace and focused imported-player name/key identity corrections. No merge, release, provider request, secret provisioning or deployment was performed.

Restored helper SHA-256 fingerprints (read only, not rerun):

- `/workspace/onboarding/start.sh`: `45e3f5c73942c76a054a1ee69e1df42f18b04f28e30c74c577c902a23f5e37ba`
- `/workspace/onboarding/checks.py`: `ff6ae54e68f418381db1df0c030612f8dfd72a6de2d687b7e47e1f874b6e9970`
- `/workspace/onboarding/copy.py`: `d3e148e9f141c959c38b554150453642447de5a8afc5adfc08969d4faca3054b`

Dependencies reused from the restored Apex setup copy via an ignored node_modules symlink. Scratch, caches and intermediate logs are ignored under `work/`. No dependencies, lockfile versions or other repositories were upgraded. Node 24.19.0 / npm 11.9.0; Vite 7.0.5 / Vue 3.5.17 / TypeScript 5.8.3 / Vitest 3.2.4. Browser: cloud `/usr/bin/chromium`; no personal Chrome profile, local Paper or desktop automation.

## Baseline failures reproduced

| Command | Exit | Finding |
| --- | --- | --- |
| `npm run typecheck` | 2 | Dock experiment CSS position type; unresolved optional Component Forge imports |
| `npm run build` | 1 | Same type errors |
| `npm run test -- --run --maxWorkers=2` | 0 | Existing five Icon tests preserved |
| `npm exec eslint -- .` | 2 | No ESLint 9 flat configuration |
| New calculation test before implementation | 1 | Missing real shared calculation module |

## Final commands

| Command | Exit | Evidence |
| --- | --- | --- |
| `npm run typecheck` | 0 | Strict Vue application plus strict browser-test/ESLint tool config |
| `npm run lint` | 0 | Read-only flat config, no `--fix` |
| `npm run test -- --run --maxWorkers=2` | 0 | 14 tests across 4 files, including original five |
| `npm run build` | 0 | Static Vite output; development routes and optional sibling imports excluded |
| `APEX_TEST_URL=http://127.0.0.1:5176 CHROMIUM_PATH=/usr/bin/chromium npm run test:browser` | 0 | Production preview, six viewport/theme combinations and reduced-motion/storage checks |
| `git diff --check` | 0 | No whitespace errors |

The foundation index was materialized into an ignored plain copy (no extra Git checkout) and independently passed strict typecheck, 10 tests, read-only lint and build before committing.

Unit discovery is bounded to `src/**/*.spec.ts`, so temporary verification copies cannot inflate test counts.

The browser matrix exercises home-to-tournament navigation, default 20 teams, top-five cropping, keyboard range arrows/Home/End and visible focus, play advancement, pause-on-scrub, chart switching, player breakdown, triangulation via keyboard while keeping the plot visible, cumulative vs individual fixed fixture values, cross-chart synchronization, filters/reset, success/import, invalid/retry with retained stale data, empty data and no page overflow at 320/768/1440 in light/dark. Reduced motion disables playback/transitions; system theme follows media changes; denied localStorage remains usable. No page errors in the production matrix. Component regression explicitly exercises loading, aborting superseded reads and stale results, including replacing a pending import with an oversized file. Screenshots supplement these behavior assertions.

## Limits and review

- No API/AI provider is connected. Original generated sample is labeled; JSON import is an explicit alternate source. No fake accounts, live status, prize money, live metrics or AI controls remain on the production journey. Original Node-only MCP prototype is untouched and excluded from browser bundles.
- JSON follows existing `TournamentData` (`id`, `name`, `totalGames`, `teams`, `games`). Runtime validation enforces finite nonnegative values, bounded arrays/numbers, unique IDs/game numbers, valid team references and safe color syntax; import is capped at 2 MB. The original schema has no ID-to-name association: imported player statistics are labeled by stable `playerId`, never by roster position. Only the internal sample generator supplies a separate explicit ID-to-name map; a successful import always clears it, even if tournament/team/player IDs match the sample. Roster names remain accepted as metadata, not inferred player identity. The implementation does not silently reconcile inconsistent supplied team/player totals.
- This is not a full-repository migration. Strict typecheck covers all source, including retained experiments. Read-only lint excludes large development-only pages, the preexisting malformed `Icon.spec.vue` non-test artifact, generated declarations and personal shell/Python helpers; original Node MCP `any`/unused prototype declarations are explicitly exempted. New calculation, import, UI and browser code is typed.
- Dock experiments, Library and Lab remain development routes. The undeclared optional sibling library now reports unavailability when absent; no sibling source was edited or copied. Production Vite output contains no Component Forge integration. Existing experiment layouts retain legacy theme rules, isolated from the product.
- Reviewed calculations, external parsing, request lifecycle, route/source changes, playback cleanup, accessible controls, theme persistence and production bundle boundaries. No embedded credentials are consumed. Fonts carry licenses. No secret/dependency/build directories are committed.
- Existing Browserslist data warning and unused GSAP manual chunk are inherited, nonfatal build warnings. No broad dependency refresh was performed.
- The new bounded CI workflow uses Node 24 and the proven command sequence; GitHub-hosted execution and Playwright's bundled browser may differ from cloud system Chromium. CI results must be read independently; local cloud results are not a claim of completed hosted CI.
- With browser storage denied, Vite's development client errors before application startup; the actual production build passes the same condition. This is a development-tool limitation.
- Cloudflare Pages can consume `dist` after `npm ci` / `npm run build` (verified static output). The history-router preview handles direct tournament paths locally. Keep SPA fallback enabled when configuring hosting. No Cloudflare account, Wrangler command, Worker adapter or hosted route behavior was tested; no deployment is claimed or triggered by this task.
- The supplied Paper PNG remains unavailable. No PR attachment app tool is exposed in this session; review links and repository screenshot links are supplied directly.

## Imported player identity correction

Coordinator review of `b7258d92b3888d2c29f362198c08a0e6da6f30ff` identified positional name assignment after accumulation by stable ID. The two new regressions failed before repair (2 failed / 5 passed in the focused domain suite). A three-game/two-player fixture now verifies reversed ordering, a missing player, cumulative and individual modes and game filters. A store/composable regression verifies correct generated sample labels under reordered/missing stats and clears source-specific names on reimport of identical IDs. The browser matrix verifies imported IDs and exact values in both scatter and damage views, plus preserved generated sample names, at all six viewport/theme combinations. The JSON schema is unchanged; no positional identity contract is claimed.

[Cloud capture: imported player ID with individual-game values](screens/1440-dark-imported-identity.png). Existing eight sample captures remain unchanged because the correction preserves their generated sample names and layout.

## Team-scoped scatter keys

Coordinator review of `8355341d4c96c1d686c41bfe9dacafe372b5bda0` found that SVG and player-list loops used a player-only Vue key even though IDs are team-scoped. Both loops now share `JSON.stringify([teamId, playerId])`, retaining a stable, collision-safe tuple key without changing the accepted schema. A new component regression failed before repair: a ranking change rendered five buttons for four players. It now verifies preservation of every SVG/list DOM node, exact labels/values, selected-team state, triangulation and no duplicate-key warnings through timeline, metric/ranking and cumulative/individual updates. Its fixture includes two teams sharing `p1` and the delimiter-collision pair `(a, b:c)` / `(a:b, c)`.

The full cloud browser matrix repeats that import and the same updates in all six width/theme combinations, checking both overlapping `p1` labels/values, original button nodes, selected-team state, triangulation and duplicate-key console messages. [Cloud capture](screens/1440-dark-shared-player-ids.png). The earlier imported-name regressions remain green. No other chart calculation, schema or production behavior was rewritten.
