import assert from 'node:assert/strict'
import { writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'

const base = 'http://127.0.0.1:8787'
const requiredHeaders = {
  'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Resource-Policy': 'same-origin',
}
const requiredCSP = ["default-src 'none'", "script-src 'self'", "script-src-attr 'none'", "style-src-elem 'self'", "style-src-attr 'unsafe-inline'", "font-src 'self'", "connect-src 'self'", "object-src 'none'", "base-uri 'none'", "frame-ancestors 'none'", "form-action 'none'"]
const output = 'work/cloudflare-evidence'
await mkdir(output, { recursive: true })
const results: unknown[] = []
// Keep observed HTTP evidence even when an assertion fails before browser startup.
process.on('exit', () => writeFileSync(`${output}/http-results.json`, JSON.stringify(results, null, 2) + '\n'))
async function request(path: string, method = 'GET', extra: Record<string, string> = {}) {
  const response = await fetch(base + path, { method, headers: { Accept: 'text/html', ...extra }, redirect: 'manual', signal: AbortSignal.timeout(5000) })
  for (const [key, value] of Object.entries(requiredHeaders)) assert.equal(response.headers.get(key), value, `${path}: ${key}`)
  const policy = response.headers.get('Content-Security-Policy')?.split(';').map(rule => rule.trim()) ?? []
  for (const directive of requiredCSP) assert(policy.includes(directive), `${path}: missing ${directive}`)
  const body = new Uint8Array(await response.arrayBuffer())
  results.push({ path, method, status: response.status, headers: Object.fromEntries(response.headers), bytes: body.length })
  return { response, body, text: new TextDecoder().decode(body) }
}
const index = await readFile('dist/index.html', 'utf8')
assert(!index.includes('/src/') && !index.includes('/vite.svg'))
for (const path of ['/', '/index.html', '/tournament/ewc-2025', '/tournament/ewc-2025?theme=dark', '/tournament/ewc-2025/']) {
  const r = await request(path)
  assert.equal(r.response.status, 200); assert.equal(r.text, index)
  assert.equal(r.response.headers.get('Cache-Control'), 'no-cache')
  assert.equal((await request(path, 'HEAD')).body.length, 0)
}
const files = await readdir('dist/assets')
assert(files.length > 0 && files.length < 200)
for (const file of files) {
  const r = await request(`/assets/${file}`)
  assert.equal(r.response.status, 200)
  assert.equal(createHash('sha256').update(r.body).digest('hex'), createHash('sha256').update(await readFile(`dist/assets/${file}`)).digest('hex'))
  const expected = file.endsWith('.js') ? /(?:javascript)/ : file.endsWith('.css') ? /text\/css/ : /font\/woff2/
  assert.match(r.response.headers.get('Content-Type') ?? '', expected)
  assert.equal(r.response.headers.get('Cache-Control'), 'public, max-age=31536000, immutable')
  const head = await request(`/assets/${file}`, 'HEAD')
  assert.equal(head.response.status, 200); assert.equal(head.body.length, 0)
  const etag = r.response.headers.get('ETag')
  assert(etag)
  assert.equal((await request(`/assets/${file}`, 'GET', { 'If-None-Match': etag })).response.status, 304)
  if (file.endsWith('.js')) assert.doesNotMatch(r.text, /Dock Effects Laboratory|DaisyUI Component Library|TailwindCSS v4 Feature Testing|Development experiments|\/dock-iterations|\/library|\/tailwind-test|apexlegendsstatus\.com|node:child_process/)
}
for (const path of ['/assets/missing-DEADBEEF.js', '/assets/missing-DEADBEEF.css', '/assets/missing-DEADBEEF.woff2', '/assets/missing', '/missing.js', '/missing.css', '/missing.woff2', '/favicon.ico', '/prefix/assets/missing-DEADBEEF.js']) {
  for (const method of ['GET', 'GET', 'HEAD']) {
    const r = await request(path, method)
    assert.equal(r.response.status, 404); assert.equal(r.response.headers.get('Cache-Control'), 'no-store')
    assert.match(r.response.headers.get('Content-Type') ?? '', /text\/plain/)
    assert(!r.text.includes('<!DOCTYPE') && !r.text.includes('immutable'))
  }
}
for (const path of ['/not-a-route', '/library', '/lab', '/dock-iterations', '/tailwind-test', '/prefix/tournament/ewc-2025']) {
  const r = await request(path)
  assert.equal(r.response.status, 404); assert.equal(r.text, index)
  assert.equal(r.response.headers.get('Cache-Control'), 'no-store')
}
assert.equal((await request('/not-a-route', 'GET', { Accept: 'application/json' })).text, 'Not found\n')
assert.equal((await request('/', 'POST')).response.status, 405)
console.log(`PASS workerd HTTP routing, all ${files.length} assets/MIME/ETag/HEAD, missing-asset failures, cache and security headers`)

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, headless: true, args: ['--no-sandbox'] })
const errors: string[] = []
try {
  for (const width of [320, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: 'dark' })
    await context.route('**/*', route => {
      if (new URL(route.request().url()).origin === base) return route.continue()
      errors.push(`Nonlocal request: ${route.request().url()}`); return route.abort()
    })
    context.setDefaultTimeout(10000)
    context.setDefaultNavigationTimeout(10000)
    const page = await context.newPage()
    page.on('pageerror', error => errors.push(error.message))
    await page.addInitScript(() => {
      const state = window as Window & { cspViolations?: string[] }
      state.cspViolations = []
      document.addEventListener('securitypolicyviolation', event => state.cspViolations!.push(event.effectiveDirective))
    })
    assert.equal((await page.goto(base + '/'))!.status(), 200)
    await page.getByRole('heading', { name: 'Tournament analysis', exact: true }).waitFor()
    assert.equal((await page.goto(base + '/tournament/ewc-2025'))!.status(), 200)
    await page.getByRole('slider').waitFor()
    assert.equal((await page.reload())!.status(), 200)
    await page.getByRole('slider').fill('2')
    await page.evaluate(() => document.fonts.ready)
    assert(await page.evaluate(() => document.fonts.check('14px Geist') && document.fonts.check('14px "Geist Mono"')))
    assert((await page.locator('.race-bar').first().boundingBox())!.width > 0)
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
    const fixture = { id: 'runtime', name: 'Workerd import', totalGames: 1,
      teams: [{ id: '__proto__', name: 'Alpha', color: '#1234', players: [] }, { id: 'b', name: 'Beta', color: 'hsl(120 50% 50% / .8)', players: [] }],
      games: [{ gameNumber: 1, teams: ['__proto__', 'b'].map((teamId, i) => ({ teamId, placement: i + 1, points: i + 10, kills: i + 1, damage: (i + 1) * 100, playerStats: [{ playerId: 'p1', kills: i + 1, damage: (i + 1) * 100, damageTaken: 0 }] })) }] }
    const input = page.getByLabel('Import tournament JSON', { exact: true })
    await input.setInputFiles({ name: 'runtime.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(fixture)) })
    await page.getByText('Tournaments / Workerd import', { exact: true }).waitFor()
    await page.getByRole('slider').fill('1')
    await page.getByRole('button', { name: 'Kills & damage', exact: true }).click()
    const beta = page.getByRole('button', { name: 'Beta / p1 · 2 kills · 200 damage', exact: true })
    await beta.click()
    fixture.teams[1].color = '#12345'
    await input.setInputFiles({ name: 'invalid.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(fixture)) })
    await page.getByRole('alert').filter({ hasText: 'teams[1].color:' }).waitFor()
    assert.equal(await beta.getAttribute('aria-pressed'), 'true')
    assert.equal(await page.getByRole('slider').inputValue(), '1')
    assert.deepEqual(await page.evaluate(() => (window as Window & { cspViolations?: string[] }).cspViolations ?? []), [], 'Application must work without CSP violations')
    await page.screenshot({ path: `${output}/${width}-workerd-import-retained.png`, fullPage: true })
    // Prove the stated tradeoff: dynamic style attributes work; inline scripts do not.
    await page.evaluate(() => {
      const element = document.createElement('div'); element.id = 'csp-style-probe'; element.style.width = '123px'; document.body.append(element)
      const script = document.createElement('script'); script.textContent = 'window.__inlineExecuted = true'; document.body.append(script)
    })
    assert.equal(await page.locator('#csp-style-probe').evaluate(e => getComputedStyle(e).width), '123px')
    assert.equal(await page.evaluate(() => (window as Window & { __inlineExecuted?: boolean }).__inlineExecuted), undefined)
    await page.waitForFunction(() => (window as Window & { cspViolations?: string[] }).cspViolations?.includes('script-src-elem'))
    assert.equal((await page.goto(base + '/not-a-route'))!.status(), 404)
    await page.getByRole('heading', { name: 'Page Not Found', exact: true }).waitFor()
    assert.equal((await page.reload())!.status(), 404)
    await page.getByRole('heading', { name: 'Page Not Found', exact: true }).waitFor()
    await page.getByRole('link', { name: 'Back to Dashboard', exact: true }).click()
    await page.getByRole('heading', { name: 'Tournament analysis', exact: true }).waitFor()
    await context.close()
    console.log(`PASS ${width}px workerd root/direct/reload, local fonts, imported/prototype/shared IDs, frame/selection, CSP and client not-found`)
  }
  assert.deepEqual(errors, [])
} finally {
  await browser.close()
  await writeFile(`${output}/http-results.json`, JSON.stringify(results, null, 2) + '\n')
}
