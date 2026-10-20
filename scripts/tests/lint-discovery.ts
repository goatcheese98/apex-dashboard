import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { ESLint } from 'eslint'

const eslint = new ESLint({ flags: ['unstable_native_nodejs_ts_config'] })
const scratch = await mkdtemp(resolve('src/.lint-discovery-'))
try {
  const nested = join(scratch, 'nested')
  await mkdir(nested)
  await writeFile(join(nested, 'bad.ts'), 'const unused: any = 1\n')
  await writeFile(join(nested, 'BadFixture.vue'), '<script setup lang="ts">\nconst unused: any = 1\n</script>\n<template><p v-for="n in [1, 2]">{{ n }}</p></template>\n')
  await writeFile(join(nested, 'GoodFixture.vue'), '<script setup lang="ts">\nconst count: number = 1\n</script>\n<template><p>{{ count as number }}</p></template>\n')
  const results = await eslint.lintFiles([scratch])
  assert.equal(results.length, 3, 'Directory discovery must find nested TS and Vue files')
  for (const name of ['bad.ts', 'BadFixture.vue']) {
    const result = results.find(r => r.filePath.endsWith(name))!
    for (const rule of ['@typescript-eslint/no-explicit-any', '@typescript-eslint/no-unused-vars']) {
      assert(result.messages.some(m => m.ruleId === rule), `${name}: missing ${rule}`)
    }
  }
  assert(results.find(r => r.filePath.endsWith('BadFixture.vue'))!.messages.some(m => m.ruleId === 'vue/require-v-for-key'))
  assert.deepEqual(results.find(r => r.filePath.endsWith('GoodFixture.vue'))!.messages, [])
  for (const path of ['src/views/Library.vue', 'src/pages/dock-iterations.vue', 'src/pages/tailwind-test.vue', 'src/components/ui/Icon.spec.vue', 'env.d.ts', 'work/ignored.ts', 'dist/ignored.js']) {
    assert(await eslint.isPathIgnored(path), `Existing exclusion changed: ${path}`)
  }
  for (const path of ['src/components/features/visualization/ScatterPlot.vue', 'src/domain/tournament.ts', 'scripts/tests/workspace.ts', 'vite.config.ts']) {
    assert(!(await eslint.isPathIgnored(path)), `Active source excluded: ${path}`)
  }
  console.log('PASS nested TS/Vue discovery, TS script/template parsing, Vue/TS rules and existing exclusions')
} finally { await rm(scratch, { recursive: true, force: true }) }
