import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'

const output = process.env.APEX_VISUAL_DIR ?? 'work/visual-after'
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, headless: true, args: ['--no-sandbox'] })
const records: unknown[] = []
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
      await context.close()
      console.log(`CAPTURE ${file}`)
    }
  }
} finally { await browser.close() }
await writeFile(`${output}/metrics.json`, JSON.stringify(records, null, 2))
