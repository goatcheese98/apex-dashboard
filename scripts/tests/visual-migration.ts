import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'

const output = process.env.APEX_VISUAL_DIR ?? 'work/visual-after'
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, headless: true, args: ['--no-sandbox'] })
const records: unknown[] = []
const errors: string[] = []
try {
  for (const width of [320, 768, 1440]) for (const theme of ['light', 'dark']) {
    for (const [name, route] of Object.entries({ home: '/', tournament: '/tournament/ewc-2025', missing: '/not-a-route', library: '/library', lab: '/lab', dock: '/dock-iterations', utilities: '/tailwind-test', 'library-templates': '/library', 'library-presets': '/library', 'library-themes': '/library' })) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme as 'light' | 'dark', reducedMotion: 'reduce' })
      await context.addInitScript(({ theme }) => {
        localStorage.setItem('theme', theme)
        let seed = 123456
        Math.random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
      }, { theme })
      const page = await context.newPage()
      page.on('pageerror', error => errors.push(error.message))
      await page.clock.install({ time: new Date('2026-10-20T12:00:00Z') })
      await page.clock.pauseAt(new Date('2026-10-20T12:01:00Z'))
      await page.goto(`${process.env.APEX_TEST_URL ?? 'http://127.0.0.1:5177'}${route}`)
      await page.locator('#app > div > *').first().waitFor()
      const tabs: Record<string, string> = { 'library-templates': 'Dashboard Templates', 'library-presets': 'Button Presets', 'library-themes': 'Theme Showcase' }
      if (tabs[name]) await page.getByRole('button', { name: tabs[name], exact: true }).click()
      await page.evaluate(() => document.fonts.ready)
      await page.clock.runFor(1000)
      await page.addStyleTag({ content: '*,*::before,*::after { animation:none!important;transition:none!important;caret-color:transparent!important }' })
      const file = `${width}-${theme}-${name}.png`
      await page.screenshot({ path: `${output}/${file}`, fullPage: true, animations: 'disabled' })
      records.push({ file, route, width, theme, metrics: await page.evaluate(() => ({ width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight, headings: [...document.querySelectorAll('h1,h2')].map(e => ({ text: e.textContent, font: getComputedStyle(e).font, color: getComputedStyle(e).color, rect: e.getBoundingClientRect().toJSON() })) })) })
      if (name === 'dock') {
        // Force the CSS state so the defect cannot move the thumb out from under the pointer.
        const session = await context.newCDPSession(page)
        await session.send('DOM.enable'); await session.send('CSS.enable')
        const { root } = await session.send('DOM.getDocument')
        const { nodeId } = await session.send('DOM.querySelector', { nodeId: root.nodeId, selector: '.timeline-thumb' })
        const thumb = page.locator('.timeline-thumb').first()
        const measure = () => thumb.evaluate(e => { const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, width: r.width } })
        const before = await measure()
        await session.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: ['hover'] })
        const after = await measure()
        assert(Math.abs(after.x - before.x) < .01 && Math.abs(after.y - before.y) < .01, 'Hover must preserve the timeline thumb center')
        assert(Math.abs(after.width / before.width - 1.2) < .01, 'Hover must retain the existing 1.2 scale')
        await session.detach()
      }
      await context.close()
      console.log(`CAPTURE ${file}`)
    }
  }
} finally { await browser.close() }
await writeFile(`${output}/metrics.json`, JSON.stringify(records, null, 2))
assert.deepEqual(errors, [], 'Development routes must have no uncaught browser errors')
