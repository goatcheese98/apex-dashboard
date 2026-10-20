# Reviewed import color and internal toolchain migration

2026-10-20. Continues draft PR #1 / `codex/lum-dashboard-workspace` from published `f052b3b22bb45e1722c5d6cf834bd0d82678a92e`. Only Apex is modified. No ComponentForge package, public peer contract, sibling repository, provider or production environment is changed.

## Before / after

| Debt | Before | Result |
| --- | --- | --- |
| Team color import grammar | Accepts invalid five/seven-digit hex and empty HSL channels | Literal hex lengths and numeric HSL grammar; accepted strings preserved |
| Vue lint wrapper | fast-glob → micromatch → unpatched Braces | Upstream Vue/TypeScript flat configs, same rules/discovery, no wrapper/glob chain |
| Tailwind 3 build/dev pipeline | Braces and selector-parser 6 chains, no compatible same-major fixes | Tailwind 4.3.3 official Vite integration; all affected chains removed |
| Full dependency audit | 8 entries: 6 high, 2 moderate | **0**, exit 0 |
| Runtime dependency audit | 0 | **0**, exit 0 |

[Full audit](audit-migration-full.json), [runtime audit](audit-migration-runtime.json). Historical [19 → 8 disposition](development-dependencies.md) is retained; its upstream migration options are now implemented. No outstanding npm advisory is ignored or relabeled as unavoidable. Glob 10.5.0 still produces an upstream lifecycle/deprecation warning in the retained ESLint/filesystem/test tooling; the complete audited graph reports zero findings. A clean snapshot is not a claim about future advisories.

## Color boundary

The prior parser's broad character-class regex accepted `#12345`, `#1234567` and `hsl(,,,,)`. Regression tests failed on that implementation; real cloud Chromium accepted the first bad import rather than displaying the required error, causing the browser regression to time out waiting for `teams[0].color`. The repaired grammar is documented in [import boundary](import-boundary.md): 3/4/6/8-digit hex and literal numeric comma/space HSL, including alpha and angle units. No browser-dependent validation, arbitrary CSS expressions, substituted fallback colors or echoed input values are introduced.

Twelve malformed/unsupported colors and eleven supported color forms are covered at the parser boundary. Real file imports reject each reviewed malformed example at a distinct team index, check constant field-specific guidance, retain exact player values and selected Beta, and verify native CSS support/applied swatches for accepted forms. [Rejected color screenshot](../design/screens/1440-dark-invalid-color.png). Resource budgets, prototype-looking IDs, stable team/player identity, sample name mappings and cumulative/individual mathematics stay covered.

## Lint migration

Follows the official [Vue flat-config/parser guidance](https://eslint.vuejs.org/user-guide/) and [TypeScript ESLint setup](https://typescript-eslint.io/getting-started/). Direct `typescript-eslint` 8.72.0 and `vue-eslint-parser` 10.2.0 preserve the already-tested versions. Vue SFCs retain the Vue parser delegating script parsing to TypeScript; the TS-compatible core-rule overrides also apply to `.vue` files, not just `.ts`. Essential Vue rules, recommended TS rules, block-language checks, user overrides and every existing exclusion remain unchanged. No filesystem discovery wrapper or dependency override is needed.

Before/after ESLint API snapshots discover the same **39 baseline files with zero rule differences**; [rule hashes and paths](lint-migration.json) are retained. `npm run test:lint-discovery` creates nested temporary TS/Vue fixtures under `src`, verifies directory discovery, template TS parsing, missing-key/unused-variable/explicit-any diagnostics, active-source inclusion and existing exclusions, then cleans up. It runs in CI. Whole-source `npm run lint` remains enabled.

## CSS migration and preservation

Consulted official [Tailwind upgrade guide](https://tailwindcss.com/docs/upgrade-guide), [source detection](https://tailwindcss.com/docs/detecting-classes-in-source-files), [Preflight modular imports](https://tailwindcss.com/docs/preflight), [DaisyUI upgrade](https://daisyui.com/docs/upgrade/), [configuration](https://daisyui.com/docs/config/) and [theme configuration](https://daisyui.com/docs/themes/). The official `@tailwindcss/vite` 4.3.3 plugin supports existing Vite 7.3.7. The frozen compatible DaisyUI 5.0.46 is retained; this migration does not change its component design.

- Replace the old PostCSS adapter and JavaScript Tailwind configuration with Vite integration, CSS `@source` for `index.html`/`src`, and DaisyUI CSS plugins. Remove unused Autoprefixer; Tailwind 4 handles prefixing.
- Retain the app's static reset under the official modular-import mechanism instead of silently adopting new browser/form defaults. It is owned CSS from the existing MIT preflight with its license, not a retained Tailwind 3 compiler/parser/runtime dependency.
- Preserve existing palette values, font utilities, fixed text line heights, small-radius/shadow/blur scales and sibling-margin spacing. Explicit `legacy-space-*` utilities preserve the previous selector behavior where the new trailing-margin selectors changed inline/progress layouts. LUM's font files, tokens and design stylesheet are unchanged.
- Use `@reference` for Vue style blocks and retain component `@apply` behavior. Preserve explicit full-width glow buttons across native cascade layers.
- Preserve sRGB interpolation for existing RGB gradients and default interpolation for DaisyUI's OKLCH gradients. Existing unpainted local template placeholders remain unpainted; explicit gray borders preserve prior defaults. Previously inert 3D-demo class names are removed where the new compiler would otherwise activate a different face. This retains the existing static demo rather than introducing an interaction/design change.

The resulting frozen lock has no Tailwind 3, Braces, micromatch, fast-glob, chokidar, postcss-nested or selector-parser 6 copies. No global parser override or `audit fix --force` is used. Modern Tailwind 4 browser support requirements apply; Chromium is exercised here, not Safari/Firefox certification.

## Cloud verification and visual evidence

| Command | Result |
| --- | --- |
| Frozen `npm ci --include=dev --no-audit --no-fund` | 0, isolated Apex cloud runtime |
| `npm run typecheck` | 0, app and strict tool config |
| `npm run lint` | 0, existing rules/exclusions preserved |
| `npm run test -- --run --maxWorkers=2` | 0, **46 tests / 6 files** |
| `npm run test:lint-discovery` | 0 |
| `npm run test:dependencies` | 0, two local MCP protocol round-trips |
| `npm run build` | 0 |
| `npm run test:browser` | 0, six production viewport/theme cases plus reduced motion/storage cases |
| `npm run test:visual` against baseline and migration | 0, **60 before/after pairs** |
| `node --experimental-strip-types scripts/tests/compare-visuals.ts` | 0, dimensions/headings/fonts identical for all 60 pairs |
| `npm audit --json` / `npm audit --omit=dev --json` | 0 / 0; zero findings in both |

All execution, installs, browsers and screenshots stay in cloud. Captures cover home, tournament, not-found, library, lab, dock and utility routes, plus library templates/presets/themes at **320/768/1440 × light/dark**. Baseline is the exact reviewed `f052b3b` source in an isolated ignored directory, installed frozen solely for localhost comparison; its historical findings are not excluded from or confused with the current graph's clean audit. No baseline code is shipped. Seeded sample data, fixed clocks, reduced motion and disabled CSS animation/transitions make comparisons repeatable.

[Overview](../design/screens/migration-overview.png), [all pixel counts and SHA-256 hashes](../design/migration-visual-comparison.json). All 60 page dimensions and heading/font metrics match; **42 pairs are pixel-identical**, including all **18 production-route screens**. The visible library residual is independently animated SVG mask loaders (which CSS animation disabling does not freeze); the largest difference over 8/255 is 0.01007% of pixels. A few large utility-demo gradient pixels differ from rounding. No difference is discarded to manufacture approval. Existing 320px development-only library/lab overflow is unchanged (439px/364px); production-route overflow checks pass.

CI now gates full and runtime audits, retains existing unit/build/browser gates and the new lint discovery check, and captures/compares all 60 pairs against the reviewed source. Full baseline/after screenshots, metrics and comparison JSON are retained in the `apex-browser-and-visual-evidence` workflow artifact for 14 days; the PR/run link identifies the exact published head. Screenshot comparisons are implementation verification, not human Paper approval. Original Paper PNGs and human approval remain unavailable. Exact session model ID and reasoning setting are unavailable; the exposed description is Codex based on GPT-6.
