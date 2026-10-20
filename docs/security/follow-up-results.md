# Import and dependency hardening checkpoint

This follow-up starts from reviewed draft HEAD `b019ee7013468959d31fe6ea857905c6b9e71fa6` on `codex/lum-dashboard-workspace`. Remote/local heads matched; the checkout was clean. Current repo instructions and prior evidence were inspected. Fresh baseline strict typecheck and all 14 existing tests passed before changes. Only Apex was modified; the existing draft PR remains the review destination.

## Before / after debt inventory

| Debt | Before | Implemented result |
| --- | --- | --- |
| Oversized file guard | Already enforced 2 MB | Retained and shared with an actual decoded UTF-8 byte guard; no claim this was previously absent |
| Malformed import guidance | Generic errors / native JSON syntax snippets | Bounded field/index paths and actionable syntax/size/split instructions; no offending content echoed |
| Resource expansion | Per-array caps alone accepted 2,100 distinct cross-game players below 2 MB | 20,000 aggregate schema entries and 2,000 distinct team/player pairs; reject, never truncate |
| Repeated scans | 5,050 game-team reads for 100 teams | Indexed single-pass accumulation with a deterministic ≤200-read regression bound; arithmetic/order preserved |
| Unrestricted team IDs | Legacy cumulative getter crashed on `__proto__`, `constructor`, `toString` | Prototype-free dictionary; accepted identifiers are not blacklisted |
| Failed replacement read | Prior data retained but chart/timeline unmounted and frame reset to zero | Existing workspace stays mounted; inspected frame, exact values and selection survive rejected reads; cold-load skeletons remain |
| Dependency advisories | Full audit: 49 package entries, 4 critical | Targeted updates: full audit 19 (0 critical), runtime audit 0; all remaining development findings explicitly listed |
| Dependency/tool boundary | Build/test tooling in runtime dependencies; accidental ambient Node types; all-interface dev listener | Dev dependencies classified, explicit Node-only typing, strict Vite config checking, loopback default, added runtime audit gate |

The schema fields, team/player identity rules, native Vue framework, LUM tokens/fonts/layout and cumulative/individual mathematics are preserved. No remaining handwritten JavaScript existed in the production JSON-import path; the new decoder and validator are strict TypeScript, not a typed wrapper advertised as a full migration. No original Paper PNG or human design approval was invented.

## Commands and results

| Command | Exit | Result |
| --- | --- | --- |
| `npm ci --include=dev --no-audit --no-fund` in the isolated cloud runtime | 0 | Frozen final lockfile installed; restored setup copies preserved |
| `npm run typecheck` | 0 | Strict application, browser tests, ESLint and Vite configuration |
| `npm run lint` | 0 | Read-only; existing exclusions unchanged |
| `npm run test -- --run --maxWorkers=2` | 0 | 23 tests / 6 files; original five Icon tests and both identity corrections retained |
| `npm run build` | 0 | Static production output, Node MCP prototype excluded |
| `APEX_TEST_URL=http://127.0.0.1:5176 CHROMIUM_PATH=/usr/bin/chromium npm run test:browser` | 0 | 320/768/1440, light/dark; existing charts/selection/timeline plus syntax, field, byte and expansion rejection with retained stale frame/values/selection |
| `npm audit --json` | 1 | Intentionally reported: 19 development entries, 15 high / 4 moderate / zero critical |
| `npm audit --omit=dev --json` and runtime gate `npm audit --omit=dev --audit-level=low` | 0 | Zero runtime findings; not a claim the full graph is clean |
| Editorconfig parse smoke check | 0 | Scoped minimatch 9.0.7 override preserves expected indentation result |
| `git diff --check` | 0 | Clean patch whitespace |

The source-hardening checkpoint was also materialized into an ignored plain copy with its original dependencies and independently passed typecheck, lint, 23 tests and build. This separates source behavior from the dependency update. Earlier failing regressions and the browser reset failure are recorded in the [import boundary note](import-boundary.md). Exact version changes, raw audit snapshots and every residual package are in [dependency disposition](dependency-disposition.md).

## Visual evidence and remaining limits

[320px rejection state](../design/screens/320-light-import-budget-error.png) · [Desktop dark rejection state](../design/screens/1440-dark-import-budget-error.png). These are actual cloud Chromium captures, supplementing behavior assertions rather than substituting for them. Existing candidate/source screenshots remain historical evidence of the unchanged LUM layout.

Remaining technical work is the documented Tailwind/glob/selector-parser development chain and the pinned legacy MCP server SDKs. They need separately verified upstream/toolchain migrations; no blanket incompatible override or disabled quality check is used here. Provider behavior, deployed hosting and paid infrastructure were not exercised. The inherited empty GSAP chunk and upstream glob deprecation warning remain nonfatal and disclosed.

No human-only blocker prevented this follow-up. Original Paper PNG and human design approval remain unavailable. Exact model ID and reasoning setting are unavailable in this session; the exposed description is Codex based on GPT-6. No model/setting is guessed.

No merge, deployment, package publishing, credential provisioning, paid infrastructure, domain change, parallel owner or history rewrite was performed. Cloud-only execution and browser verification were used throughout.
