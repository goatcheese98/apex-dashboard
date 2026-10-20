import assert from 'node:assert/strict'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { chromium } from 'playwright'

const [before = 'work/visual-before', after = 'work/visual-after', report = 'work/visual-comparison.json'] = process.argv.slice(2)
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, headless: true, args: ['--no-sandbox'] })
const results = []
try {
  const page = await browser.newPage()
  for (const file of (await readdir(after)).filter(f => f.endsWith('.png')).sort()) {
    const old = await readFile(`${before}/${file}`), current = await readFile(`${after}/${file}`)
    const delta = await page.evaluate(async ([left, right]) => {
      async function decode(data: string) {
        const bytes = Uint8Array.from(atob(data), c => c.charCodeAt(0))
        return createImageBitmap(new Blob([bytes], { type: 'image/png' }))
      }
      const a = await decode(left), b = await decode(right)
      const width = Math.max(a.width, b.width), height = Math.max(a.height, b.height)
      function pixels(image: ImageBitmap) {
        const canvas = new OffscreenCanvas(width, height), context = canvas.getContext('2d')!
        context.fillStyle = 'white'; context.fillRect(0, 0, width, height); context.drawImage(image, 0, 0)
        return context.getImageData(0, 0, width, height).data
      }
      const x = pixels(a), y = pixels(b)
      let changedPixels = 0, changedOver8 = 0
      for (let i = 0; i < x.length; i += 4) {
        const difference = Math.max(Math.abs(x[i] - y[i]), Math.abs(x[i + 1] - y[i + 1]), Math.abs(x[i + 2] - y[i + 2]))
        if (difference > 0) changedPixels++
        if (difference > 8) changedOver8++
      }
      const result = { beforeSize: [a.width, a.height], afterSize: [b.width, b.height], changedPixels, changedOver8, percentOver8: Number((changedOver8 / (width * height) * 100).toFixed(5)) }
      a.close(); b.close()
      return result
    }, [old.toString('base64'), current.toString('base64')])
    assert.deepEqual(delta.beforeSize, delta.afterSize, `${file}: changed page dimensions`)
    results.push({ file, ...delta, beforeSHA256: createHash('sha256').update(old).digest('hex'), afterSHA256: createHash('sha256').update(current).digest('hex') })
  }
} finally { await browser.close() }
const oldMetrics = JSON.parse(await readFile(`${before}/metrics.json`, 'utf8')) as { file: string; metrics: unknown }[]
const newMetrics = JSON.parse(await readFile(`${after}/metrics.json`, 'utf8')) as { file: string; metrics: unknown }[]
assert.equal(results.length, 60)
for (const old of oldMetrics) assert.deepEqual(newMetrics.find(row => row.file === old.file)?.metrics, old.metrics, `${old.file}: changed dimensions, headings or fonts`)
await writeFile(report, JSON.stringify({ baseline: 'f052b3b22bb45e1722c5d6cf834bd0d82678a92e', comparisons: results }, null, 2) + '\n')
console.log(`PASS ${results.length} visual pairs: dimensions/headings/fonts match; ${results.filter(r => r.changedPixels === 0).length} pixel-identical; every difference retained in ${report}`)
