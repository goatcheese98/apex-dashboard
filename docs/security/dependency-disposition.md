# Dependency audit disposition

Snapshot: 2026-10-19 America/Vancouver. Full audit is **not clean**. Counts below are npm affected-package entries, including advisory propagation through dependency chains; they are not counts of independently exploitable browser flaws.

| Audit | Critical | High | Moderate | Low | Total | Exit |
| --- | --- | --- | --- | --- | --- | --- |
| Before, full graph | 4 | 35 | 9 | 1 | 49 | 1 |
| After, full graph | 0 | 15 | 4 | 0 | 19 | 1 |
| After, declared runtime graph (`--omit=dev`) | 0 | 0 | 0 | 0 | 0 | 0 |

Raw [before](audit-before.json), [after](audit-after.json) and [runtime](audit-runtime.json) reports are committed for inspection. The full audit's nonzero exit and 19 development findings are retained, not suppressed or relabeled as a clean full audit. Moving build/test packages to devDependencies improves the runtime graph classification; the reduction in **full-graph** findings comes from actual updates, not that classification.

## Targeted changes

| Package | Before | After |
| --- | --- | --- |
| `vite` | 7.0.5 | 7.3.7 |
| `vue` | 3.5.17 | 3.5.44 |
| `playwright` | 1.54.1 | 1.55.1 |
| `vitest` | 3.2.4 | 4.1.11 |
| `@vitest/ui` | 3.2.4 | 4.1.11 |
| `postcss` | 8.5.6 | 8.5.31 |
| `@modelcontextprotocol/sdk` | 1.16.0 | 1.31.0 |
| `rollup` | 4.45.1 | 4.64.12 |
| `js-cookie` | 3.0.5 | 3.0.8 |
| `ws` | 8.18.3 | 8.22.0 |

The direct Vite, Vue, Playwright, PostCSS and MCP SDK fixes stay within their current major. Vitest and its matching UI move from 3.x to 4.1.11 specifically because the audited 3.x mock/worker chain has no complete patched release. This removes the vulnerable Tinypool dependency, rather than overriding it across a major API boundary. No Vite 8, Vue framework migration or Tailwind 4 migration was performed. Exact direct versions and frozen lockfile make this tested selection reproducible.

Compatible transitive resolutions were refreshed only for named audit findings: humanfs, brace expansion, AJV, Browserslist, diff, fflate, glob, cookie parsing, YAML, minimatch/picomatch, selector parsing, Rollup and ws. Editorconfig hard-pins vulnerable minimatch 9.0.1; a scoped `editorconfig -> minimatch 9.0.7` same-major override repairs that pin. A read-only editorconfig parse smoke check confirms its indentation result; typecheck, lint, unit and browser checks verify the actual tool/application journey. No blanket `audit fix --force`, global override or unrelated upgrade was used.

Build/test packages (including Vite, TypeScript, lint, Vitest, Playwright and CSS tooling) now live in devDependencies; the application runtime packages remain Vue, Vue Router, Pinia/Colada and GSAP. Build with `npm ci --include=dev --no-audit --no-fund`, then `npm run build`. CI installs that same graph and adds a runtime audit gate (`npm audit --omit=dev --audit-level=low`). Existing strict/lint/unit/build/browser gates remain enabled. The complete full-graph audit is still reported here.

The retained Node-only MCP prototype gets explicit Node types/imports because Vitest 4 no longer supplies accidental ambient Node types to the application typecheck. Its provider behavior is not claimed as tested. Vite configuration is included in strict tool typecheck and the default development listener is loopback instead of all interfaces.

## Remaining development findings

These are technical follow-up debts, not proof of safety and not hidden exceptions in a full-audit gate:

- **Braces / glob toolchain:** `braces` 3.x has a stack-exhaustion advisory propagated through micromatch/fast-glob, Tailwind 3, ESLint/TypeScript tooling and chokidar. No patched compatible braces 3.x resolution is available in this snapshot. npm proposes major toolchain changes (including Tailwind 4); forcing an unverified replacement would exceed this focused import hardening and can change the LUM build. Keep build/test inputs trusted and plan a separately verified toolchain migration. [Advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).
- **Selector parsing:** retained selector-parser 6.x copies are below the patched 7.1.6 line and flow through typography, postcss-nested, Tailwind and eslint-plugin-vue. Scoped same-range refreshes cannot cross that API boundary. JSON imports cannot supply CSS or source-map URLs (team colors remain restricted); that does not make the developer tooling generally safe for hostile CSS. [Advisory](https://github.com/advisories/GHSA-rj75-hqrm-r3gf).
- **Legacy MCP server binaries:** server-memory pins SDK 1.0.1 and sequential-thinking pins SDK 0.5.0. The application's direct SDK is patched, but these nested versions retain the DNS-rebinding advisory. They are development-only retained capabilities, not started or included in the browser bundle. Replacing pinned server SDKs requires a separately tested upstream/server upgrade; no provider calls or credential setup were performed. [Advisory](https://github.com/advisories/GHSA-w48q-cv73-mx4w).

| Remaining package | Severity | Immediate affected dependency/advisory |
| --- | --- | --- |
| `@modelcontextprotocol/sdk` | high | [advisory](https://github.com/advisories/GHSA-w48q-cv73-mx4w) |
| `@modelcontextprotocol/server-memory` | high | `@modelcontextprotocol/sdk` |
| `@modelcontextprotocol/server-sequential-thinking` | high | `@modelcontextprotocol/sdk` |
| `@tailwindcss/typography` | moderate | `postcss-selector-parser` |
| `@typescript-eslint/eslint-plugin` | high | `@typescript-eslint/type-utils`, `@typescript-eslint/utils` |
| `@typescript-eslint/parser` | high | `@typescript-eslint/typescript-estree` |
| `@typescript-eslint/type-utils` | high | `@typescript-eslint/typescript-estree`, `@typescript-eslint/utils` |
| `@typescript-eslint/typescript-estree` | high | `fast-glob` |
| `@typescript-eslint/utils` | high | `@typescript-eslint/typescript-estree` |
| `@vue/eslint-config-typescript` | high | `fast-glob` |
| `braces` | high | [advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) |
| `chokidar` | high | `braces` |
| `eslint-plugin-vue` | moderate | `postcss-selector-parser` |
| `fast-glob` | high | `micromatch` |
| `micromatch` | high | `braces` |
| `postcss-nested` | moderate | `postcss-selector-parser` |
| `postcss-selector-parser` | moderate | [advisory](https://github.com/advisories/GHSA-rj75-hqrm-r3gf) |
| `tailwindcss` | high | `chokidar`, `fast-glob`, `micromatch`, `postcss-nested`, `postcss-selector-parser` |
| `typescript-eslint` | high | `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `@typescript-eslint/typescript-estree`, `@typescript-eslint/utils` |

The npm install deprecation warning for glob 10.5.0 remains an upstream lifecycle warning; its prior audited command-injection range was repaired. It is not presented as proof that all glob/tooling risks are resolved. Advisory databases change: these snapshots are evidence for this exact lockfile and date, not a permanent security guarantee.

## Execution and limits

All installs, audits and checks ran in the attached cloud workspace with the configured proxy and writable cache. A frozen isolated runtime under ignored `work/security-runtime` replaces only Apex's ignored dependency symlink; the restored onboarding copies and other repositories were not modified. The first audit was interrupted after stalling, then retried with explicit proxy, zero retries and a 30-second per-request timeout. Successful audits returned vulnerability counts rather than a network/authentication error.

No provider calls, secrets, deployments, paid infrastructure, domains, package publishing or history rewrites were used. No human-only blocker prevented this follow-up. Original Paper PNG and design approval remain unavailable, and this work claims neither. The session exposes Codex based on GPT-6; the exact model ID and reasoning setting are unavailable, not inferred.
