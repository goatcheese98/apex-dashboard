# Development dependency follow-up

2026-10-20, cloud Node 24.19.0 / npm 11.9.0. Continues the 4f9f41e checkpoint on the same draft branch. The full graph is **not clean**: 19 affected-package entries (15 high, 4 moderate) become **8 (6 high, 2 moderate)**. The declared runtime graph remains **0**. These are propagated package entries, not 19 distinct advisories. [Previous full report](audit-after.json), [new full report](audit-development-follow-up.json), [new runtime report](audit-runtime-follow-up.json).

## Repairs and compatibility evidence

- MCP memory: 2025.4.25 pins SDK 1.0.1. Registry metadata confirms 2025.8.4 and 2025.9.24 still pin it; 2025.11.25 accepts SDK ^1.19.1 and can resolve patched 1.31.0, but its `create_entities` response fails the SDK's output-schema validation (`entities/0 must NOT have additional properties`). The first subsequent published release, **2026.1.26**, declares SDK ^1.25.2 and passes initialization, tool discovery, entity creation and graph readback. That establishes the historical compatible floor. Installation metadata then identified all date-based versions as deprecated and directed users to the resumed semantic release line. The selected **1.0.0** successor requires SDK ^1.31.0 and passes the same round-trip; it is the minimum nondeprecated compatible release, without the SDK 2 migration in latest 2.0.0.
- Sequential-thinking: **2025.11.25**, the next release after 2025.7.1, replaces pinned SDK 0.5.0 with ^1.19.1. Frozen resolution shares direct SDK **1.31.0**. The date-based candidate is also deprecated; the selected **1.0.0** semantic successor requires SDK ^1.31.0 and passes initialization, tool discovery and a completed thought round-trip. Both servers are local stdio subprocesses; smoke tests use an isolated temporary memory file, clean it up, and make no HTTP/provider calls. The SDK advisory concerns DNS rebinding in HTTP servers, not stdio. Retaining vulnerable nested packages was still avoidable. No old nested SDK remains.
- Vue ESLint: **10.6.0** is the first 10.x release whose metadata accepts selector-parser ^7.1.0. Frozen resolution **7.1.6** meets the advisory's minimum fixed version. Existing Vue/TS lint configuration and rules are unchanged; full lint passes. No global selector-parser override.
- TypeScript ESLint: **8.48.0** is the first stable release after 8.38.0 replacing `fast-glob` with `tinyglobby` in `typescript-estree`. The existing compatible ^8.x parent ranges resolve the coordinated family to **8.72.0**. Its tinyglobby/picomatch chain is audited without findings. Node 24 satisfies declared engine ranges. Strict tool/app typecheck and lint pass; Vue's independent fast-glob use remains separately reported.
- Typography **0.5.16** is removed: it was a declared dependency but was never registered in `tailwind.config.js`, imported in source or used through prose classes. Removing that unused plugin eliminates its exact vulnerable selector-parser 6.0.10 pin without altering generated CSS behavior. Latest 0.5.20 metadata still pins 6.0.10; upgrading it would not repair the chain.

A frozen `npm ci --include=dev --no-audit --no-fund` succeeds in the isolated Apex cloud runtime. `npm run test:dependencies` is retained as a strict TypeScript compatibility regression and runs in CI. No force upgrades, advisory exclusions, new lint exclusions or disabled checks were used.

## Exact advisory chains and reachable inputs

| Advisory | Before chains | Current disposition / exposure |
| --- | --- | --- |
| [SDK DNS rebinding, <1.24.0](https://github.com/advisories/GHSA-w48q-cv73-mx4w) | memory → SDK 1.0.1; sequential-thinking → SDK 0.5.0 | Both removed. Direct/resolved SDK 1.31.0. Retained binaries use stdio; not imported into browser bundle. A separately configured HTTP MCP server would be the advisory's reachable network surface. |
| [Braces stack exhaustion, <=3.0.3](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) | TS ESLint → estree → fast-glob → micromatch → braces; Vue ESLint config → fast-glob → micromatch → braces; Tailwind → fast-glob/micromatch or chokidar → braces | TS ESLint chain removed. Vue config and Tailwind chains remain. Developer-controlled source patterns, content globs and watcher inputs reach these tools during lint/build/dev; hostile source/config contributions can exhaust a process. Imported JSON never supplies glob patterns or changes config. |
| [Selector parser quadratic CPU, <7.1.6](https://github.com/advisories/GHSA-rj75-hqrm-r3gf) | Vue ESLint plugin; typography; Tailwind → parser; Tailwind → postcss-nested → parser | Vue ESLint now 7.1.6; unused typography removed. Tailwind/parser 6.1.5 and postcss-nested 6.2.0/parser 6.1.5 remain. Repository CSS/selectors reach parsing at build/dev time. Untrusted imports cannot supply CSS selectors; their color/schema validation is unchanged. This does not make hostile repository CSS safe. |

## Eight remaining entries and smallest migration options

| Entry | Locked version | Immediate cause |
| --- | --- | --- |
| @vue/eslint-config-typescript | 14.6.0 | fast-glob |
| braces | 3.0.3 | GHSA-vfj7-8cjw-p6xm |
| chokidar | 3.6.0 | braces |
| fast-glob | 3.3.3 | micromatch |
| micromatch | 4.0.8 | braces |
| postcss-nested | 6.2.0 | selector-parser |
| postcss-selector-parser | 6.1.5 (two copies) | GHSA-rj75-hqrm-r3gf |
| tailwindcss | 3.4.17 | preceding CSS/glob chains |

Registry checks substantiate the upstream blockers: **Braces latest is still 3.0.3**, with no fixed version published; latest Tailwind 3 **3.4.19** still requires chokidar ^3.6.0, fast-glob ^3.3.2, micromatch ^4.0.8, postcss-nested ^6.2.0 and selector-parser ^6.1.2. A same-major Tailwind refresh cannot repair either advisory. Latest Vue config **14.9.0** still requires fast-glob ^3.3.3. Latest selector-parser is **7.1.6**, outside the retained CSS parents' supported ranges. Replacing the parser alone would also leave Braces.

The smallest supported CSS migration is Tailwind **4** plus its separate PostCSS adapter (or Vite integration), converting the three legacy CSS imports, JavaScript theme/plugin setup and legacy `@apply` usage, then verifying DaisyUI and CSS output across existing routes and themes. npm suggests Tailwind 4.3.3. That is an explicit CSS pipeline migration with visual acceptance work, not a safe transitive patch. This follow-up does not force it through an override.

For Vue lint config, npm suggests **14.0.1**, but inspection of its published declaration shows only a default `createConfig` export, whereas this repository uses named `defineConfigWithVueTs` and `vueTsConfigs`. A blind downgrade would break configuration and roll back supported Vue/TS behavior. The smallest migration is replacing that wrapper with the upstream Vue parser and TypeScript ESLint flat configs, preserving mixed Vue/TS handling, discovery and all existing rules, or an upstream fast-glob replacement. It requires dedicated lint configuration compatibility cases. No unsupported fast-glob/Braces replacement or ignored advisory is claimed as a fix here.

## Verification and limits

Full app/tool typecheck, unchanged lint, **23 unit/component tests in six files**, production build, and **six cloud Chromium cases** (320/768/1440 × light/dark) pass. Browser cases include imported/shared player IDs, ranking/selection, bounded errors, oversized imports, prior-frame retention and no duplicate-key warnings. Two local MCP protocol round-trips pass. Frozen installation succeeds. Full audit exits **1** with the eight explicitly enumerated findings; runtime audit exits **0**. Raw reports retain all advisories. Existing quality gates remain enabled, with the new MCP smoke check added.

No application data/schema/math/design changes were needed. Browser screenshots were regenerated in cloud; existing tracked visual evidence remains valid because this is dependency-only work. No human-only blocker prevents these repairs. Upstream tooling dependencies block a fully clean graph without the explicit migrations above. Original Paper PNGs and human design approval remain unavailable; neither is claimed. Exact session model ID and reasoning setting are unavailable (the exposed description is Codex based on GPT-6).
