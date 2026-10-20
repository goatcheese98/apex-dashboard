import { chromium, type Page } from 'playwright'
import { strict as assert } from 'node:assert'
import { mkdirSync, writeFileSync } from 'node:fs'

const output = process.env.APEX_SCREENSHOT_DIR ?? 'work/browser'
mkdirSync(output, { recursive: true })
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, headless: true, args: ['--no-sandbox'] })
const errors: string[] = []
const fixture = {
  id: 'fixed', name: 'Fixed tournament', totalGames: 2,
  teams: [{ id: 'a', name: 'Alpha', players: ['Ada'], color: '#123456' }, { id: 'b', name: 'Beta', players: ['Bea'], color: '#654321' }],
  games: [1, 2].map(n => ({ gameNumber: n, teams: [
    { teamId: 'a', placement: 2, points: n * 10, kills: n, damage: n * 100, playerStats: [{ playerId: 'ada', kills: n, damage: n * 100, damageTaken: n * 50 }] },
    { teamId: 'b', placement: 1, points: 15, kills: 3, damage: 300, playerStats: [{ playerId: 'bea', kills: 3, damage: 300, damageTaken: 90 }] },
  ] })),
}
const identityFixture = {
  id: 'ewc-2025', name: 'Identity import', totalGames: 2,
  teams: [{ id: 'team-1', name: 'Alpha', players: ['Ada', 'Bea'], color: '#123456' }],
  games: [[{ playerId: 'player-2', n: 2 }, { playerId: 'player-1', n: 1 }], [{ playerId: 'player-1', n: 3 }]].map((stats, index) => ({
    gameNumber: index + 1, teams: [{ teamId: 'team-1', placement: 1, points: 10, kills: 0, damage: 0,
      playerStats: stats.map(p => ({ playerId: p.playerId, kills: p.n, damage: p.n * 100, damageTaken: p.n * 10 })) }],
  })),
}
const sharedTeams = [
  { id: 'a', name: 'Alpha', players: ['Unlinked A', 'Unlinked B'], color: '#123456' },
  { id: 'b', name: 'Beta', players: ['Unlinked C'], color: '#654321' },
  { id: 'a:b', name: 'Gamma', players: ['Unlinked D'], color: '#456789' },
]
const sharedPlayerFixture = {
  id: 'shared-ids', name: 'Shared player IDs', teams: sharedTeams, totalGames: 2,
  games: [0, 1].map(index => ({ gameNumber: index + 1, teams: sharedTeams.map((team, teamIndex) => {
    const values = index ? [[8, 1], [1], [0]][teamIndex] : [[1, 4], [2], [3]][teamIndex]
    const playerStats = values.map((n, i) => ({ playerId: [['p1', 'b:c'], ['p1'], ['c']][teamIndex][i], kills: n, damage: n * 100, damageTaken: n * 10 }))
    const kills = values.reduce((sum, n) => sum + n, 0)
    return { teamId: team.id, placement: teamIndex + 1, points: (index ? [0, 20, 50] : [30, 20, 10])[teamIndex], kills, damage: kills * 100, playerStats }
  }) })),
}
const expansionFixture = {
  id: 'expansion', name: 'Expansion fixture', totalGames: 3,
  teams: [{ id: 't', name: 'Team', color: '#123456', players: [] }],
  games: Array.from({ length: 3 }, (_, game) => ({ gameNumber: game + 1, teams: [{
    teamId: 't', placement: 1, points: 1, kills: 0, damage: 0,
    playerStats: Array.from({ length: 700 }, (_, player) => ({ playerId: `p${game * 700 + player}`, kills: 0, damage: 0, damageTaken: 0 })),
  }] })),
}
async function upload(page: Page, data: unknown) {
  await page.getByLabel('Import tournament JSON', { exact: true }).setInputFiles({ name: 'tournament.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(data)) })
}
async function expectText(page: Page, text: string) { await page.getByText(text, { exact: true }).first().waitFor() }
try {
  for (const width of [320, 768, 1440]) {
    for (const theme of ['light', 'dark']) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme as 'light' | 'dark' })
      const page = await context.newPage()
      page.on('pageerror', error => errors.push(error.message))
      page.on('console', message => { if (/duplicate.*key/i.test(message.text())) errors.push(message.text()) })
      await page.goto(`${process.env.APEX_TEST_URL ?? 'http://127.0.0.1:5174'}/`)
      assert.equal(await page.getByText(/System Online|^Live$/).count(), 0)
      await page.getByRole('link', { name: 'Explore EWC 2025 sample' }).click()
      await page.getByRole('slider', { name: 'Current game' }).waitFor()
      assert.equal(await page.locator('.race-row').count(), 20)
      await page.getByLabel('Appearance').selectOption(theme)
      await page.getByRole('slider').focus()
      await page.keyboard.press('End')
      assert.equal(await page.getByRole('slider').inputValue(), '10')
      await page.keyboard.press('Home')
      assert.equal(await page.getByRole('slider').inputValue(), '0')
      await page.keyboard.press('ArrowRight')
      assert.equal(await page.getByRole('slider').inputValue(), '1')
      assert.equal(await page.getByRole('slider').evaluate(e => getComputedStyle(e).outlineStyle), 'solid')
      await page.getByRole('slider').fill('4')
      await page.getByLabel('Teams', { exact: true }).selectOption('5')
      assert.equal(await page.locator('.race-row').count(), 5)
      await page.getByRole('button', { name: 'Play', exact: true }).click()
      await expectText(page, 'Game 5 / 10')
      await page.getByRole('slider').fill('3')
      await expectText(page, 'Play')
      await page.waitForTimeout(1300)
      assert.equal(await page.getByRole('slider').inputValue(), '3')
      await page.getByRole('button', { name: 'Kills & damage', exact: true }).click()
      await page.getByLabel('Triangulate teammates').check()
      assert.match(await page.locator('.player-list button').first().innerText(), /Team \d+ \/ Player \d+/)
      await page.locator('.player-list button').first().focus()
      assert.equal(await page.locator('polygon').count(), 1)
      assert.equal(await page.locator('.chart-region').evaluate(e => e.scrollTop), 0, 'Keyboard player selection must keep the plot visible')
      await page.getByRole('button', { name: 'Damage analysis', exact: true }).click()
      await page.getByLabel('Player damage breakdown').check()
      assert.equal(await page.getByRole('list', { name: 'Player damage breakdown' }).count(), 5)
      await page.getByRole('button', { name: 'Standings', exact: true }).click()
      await page.getByRole('slider').fill('4')
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(300)
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${width} ${theme} page overflow`)
      assert.equal(await page.locator('.timeline-dock').evaluate(e => getComputedStyle(e).position), 'static')
      assert.equal(await page.locator('.play-button').evaluate(e => getComputedStyle(e).backgroundColor), theme === 'dark' ? 'rgb(214, 168, 40)' : 'rgb(24, 24, 27)')
      assert.equal(await page.locator('h1').evaluate(e => getComputedStyle(e).color), theme === 'dark' ? 'rgb(236, 236, 238)' : 'rgb(24, 24, 27)')
      await page.screenshot({ path: `${output}/${width}-${theme}-standings.png`, fullPage: true })
      await upload(page, fixture)
      await expectText(page, 'Tournaments / Fixed tournament')
      await page.getByRole('slider').fill('2')
      await page.getByText('Full standings values', { exact: true }).click()
      assert.equal(await page.locator('tbody tr').filter({ hasText: 'Alpha' }).innerText(), 'Alpha\t30\t3\t300\t150')
      await page.getByLabel('Calculation').selectOption('false')
      assert.equal(await page.locator('tbody tr').filter({ hasText: 'Alpha' }).innerText(), 'Alpha\t20\t2\t200\t100')
      await page.getByRole('button', { name: 'Damage analysis', exact: true }).click()
      await expectText(page, '200')
      await page.getByRole('button', { name: 'Kills & damage', exact: true }).click()
      await expectText(page, 'Alpha / ada · 2 kills · 200 damage')
      await page.getByText('Filter games & teams', { exact: true }).click()
      await page.getByLabel('Game 1', { exact: true }).check()
      await expectText(page, 'No matching games or teams at this position.')
      await page.getByRole('button', { name: 'Reset filters', exact: true }).first().click()
      await upload(page, { invalid: true })
      await page.getByRole('alert').waitFor()
      assert.match(await page.getByRole('alert').innerText(), /Showing stale imported json: Fixed tournament/)
      await page.getByRole('button', { name: 'Retry', exact: true }).click()
      await page.getByRole('alert').waitFor()
      await page.getByRole('combobox', { name: 'Choose tournament' }).selectOption('ewc-2025')
      await expectText(page, 'Tournaments / EWC 2025')
      await upload(page, identityFixture)
      await expectText(page, 'Tournaments / Identity import')
      await page.getByRole('slider').fill('2')
      await page.getByLabel('Calculation').selectOption('true')
      await expectText(page, 'Alpha / player-1 · 4 kills · 400 damage')
      await expectText(page, 'Alpha / player-2 · 2 kills · 200 damage')
      await page.getByRole('button', { name: 'Damage analysis', exact: true }).click()
      const breakdown = page.getByRole('list', { name: 'Player damage breakdown' })
      assert.match(await breakdown.innerText(), /player-1\s+Given 400 \/ Taken 40/)
      assert.match(await breakdown.innerText(), /player-2\s+Given 200 \/ Taken 20/)
      assert.doesNotMatch(await breakdown.innerText(), /Ada|Bea/)
      await page.getByLabel('Calculation').selectOption('false')
      assert.match(await breakdown.innerText(), /player-1\s+Given 300 \/ Taken 30/)
      assert.doesNotMatch(await breakdown.innerText(), /player-2/)
      await page.getByRole('button', { name: 'Kills & damage', exact: true }).click()
      await expectText(page, 'Alpha / player-1 · 3 kills · 300 damage')
      assert.equal(await page.locator('.player-list button').count(), 1)
      if (width === 1440 && theme === 'dark') await page.screenshot({ path: `${output}/1440-dark-imported-identity.png`, fullPage: true })
      await upload(page, sharedPlayerFixture)
      await expectText(page, 'Tournaments / Shared player IDs')
      await page.getByRole('slider').fill('1')
      await page.getByLabel('Calculation').selectOption('true')
      const beta = page.getByRole('button', { name: /^Beta \/ p1 ·/ })
      const alpha = page.getByRole('button', { name: /^Alpha \/ p1 ·/ })
      const betaNode = await beta.elementHandle(), alphaNode = await alpha.elementHandle()
      await beta.click()
      await page.mouse.move(0, 0)
      for (const [game, metric, individual] of [[2, 'points', false], [2, 'damage', false], [1, 'kills', false], [2, 'points', true]] as const) {
        await page.getByRole('slider').fill(String(game))
        await page.getByLabel('Metric', { exact: true }).selectOption(metric)
        await page.getByLabel('Calculation').selectOption(String(!individual))
        const buttons = page.locator('.player-list button')
        assert.equal(await buttons.count(), 4)
        const expected: Record<string, number> = {
          'Alpha / p1': individual ? 8 : game === 2 ? 9 : 1,
          'Alpha / b:c': individual ? 1 : game === 2 ? 5 : 4,
          'Beta / p1': individual ? 1 : game === 2 ? 3 : 2,
          'Gamma / c': individual ? 0 : 3,
        }
        const labels = await buttons.allTextContents()
        for (const label of labels) {
          const identity = label.split(' · ')[0], kills = expected[identity]
          assert.equal(label, `${identity} · ${kills} kills · ${(kills * 100).toLocaleString('en-US')} damage`)
        }
        assert.equal(await beta.evaluate((node, original) => node === original, betaNode), true)
        assert.equal(await alpha.evaluate((node, original) => node === original, alphaNode), true)
        assert.equal(await beta.getAttribute('aria-pressed'), 'true')
        assert.equal(await page.locator('.player-list button[aria-pressed="true"]').count(), 1)
        const circle = page.locator('svg g').nth(labels.findIndex(label => label.startsWith('Beta / p1'))).locator('circle')
        assert.equal(await page.locator('polygon').getAttribute('points'), `${await circle.getAttribute('cx')},${await circle.getAttribute('cy')}`)
      }
      await betaNode?.dispose(); await alphaNode?.dispose()
      if (width === 1440 && theme === 'dark') await page.screenshot({ path: `${output}/1440-dark-shared-player-ids.png`, fullPage: true })
      await page.getByLabel('Import tournament JSON', { exact: true }).setInputFiles({ name: 'invalid.json', mimeType: 'application/json', buffer: Buffer.from('{"private-data":') })
      await page.getByRole('alert').waitFor()
      assert.match(await page.getByRole('alert').innerText(), /File: Invalid JSON; fix the syntax/)
      assert.doesNotMatch(await page.getByRole('alert').innerText(), /private-data/)
      const invalidField = structuredClone(identityFixture)
      invalidField.games[1].teams[0].playerStats[0].damage = -1
      await upload(page, invalidField)
      assert.match(await page.getByRole('alert').innerText(), /games\[1\]\.teams\[0\]\.playerStats\[0\]\.damage: expected a finite number/)
      await page.getByLabel('Import tournament JSON', { exact: true }).setInputFiles({ name: 'oversized.json', mimeType: 'application/json', buffer: Buffer.alloc(2_000_001, ' ') })
      assert.match(await page.getByRole('alert').innerText(), /File: JSON must be at most 2 MB; split/)
      await upload(page, expansionFixture)
      assert.match(await page.getByRole('alert').innerText(), /at most 2,000 distinct team\/player pairs.*split/)
      assert.match(await page.getByRole('alert').innerText(), /Showing stale imported json: Shared player IDs/)
      assert.equal(await page.locator('.player-list button').count(), 4)
      await expectText(page, 'Beta / p1 · 1 kills · 100 damage')
      assert.equal(await beta.getAttribute('aria-pressed'), 'true', 'Rejected imports must retain the inspected team selection')
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
      if ((width === 320 && theme === 'light') || (width === 1440 && theme === 'dark')) await page.screenshot({ path: `${output}/${width}-${theme}-import-budget-error.png`, fullPage: true })
      await upload(page, { ...fixture, games: [] })
      await expectText(page, 'No games available')
      await context.close()
      console.log(`PASS ${width}px ${theme}: navigation, keyboard, playback/scrub, charts, math, filters, invalid/retry/empty, overflow`)
    }
  }
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 320, height: 900 } })
  const page = await context.newPage()
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage denied') } }) })
  await page.goto(`${process.env.APEX_TEST_URL ?? 'http://127.0.0.1:5174'}/tournament/ewc-2025`)
  await page.getByRole('slider').waitFor()
  assert.equal(await page.getByRole('button', { name: 'Play', exact: true }).isDisabled(), true)
  assert.equal(await page.locator('.race-bar').first().evaluate(e => getComputedStyle(e).transitionDuration), '0s')
  await page.getByLabel('Appearance').selectOption('dark')
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.getByLabel('Appearance').selectOption('system')
  await page.emulateMedia({ colorScheme: 'light' })
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'light')
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark')
  await context.close()
  assert.deepEqual(errors, [])
  writeFileSync(`${output}/results.json`, JSON.stringify({ widths: [320,768,1440], themes: ['light','dark'], errors, reducedMotion: true, storageFallback: true, status: 'passed' }, null, 2))
  console.log('PASS reduced motion, system theme and unavailable storage; no page errors')
} finally { await browser.close() }
