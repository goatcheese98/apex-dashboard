import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import ScatterPlot from './ScatterPlot.vue'
import { useTournamentStore } from '@/stores/tournament'
import { useDockStore } from '@/stores/dock'

// Includes shared p1 IDs and (a, b:c)/(a:b, c), which collide under naive colon joining.
const teams = [
  { id: 'a', name: 'Alpha', players: ['Unlinked A', 'Unlinked B'], color: '#123456' },
  { id: 'b', name: 'Beta', players: ['Unlinked C'], color: '#654321' },
  { id: 'a:b', name: 'Gamma', players: ['Unlinked D'], color: '#456789' },
]
const fixture = {
  id: 'shared-ids', name: 'Shared player IDs', teams, totalGames: 2,
  games: [0, 1].map(index => ({ gameNumber: index + 1, teams: teams.map((team, teamIndex) => {
    const values = index ? [[8, 1], [1], [0]][teamIndex] : [[1, 4], [2], [3]][teamIndex]
    const playerStats = values.map((n, i) => ({ playerId: [['p1', 'b:c'], ['p1'], ['c']][teamIndex][i], kills: n, damage: n * 100, damageTaken: n * 10 }))
    const kills = values.reduce((sum, n) => sum + n, 0)
    return { teamId: team.id, placement: teamIndex + 1, points: (index ? [0, 20, 50] : [30, 20, 10])[teamIndex], kills, damage: kills * 100, playerStats }
  }) })),
}

describe('scatter team-scoped player identity', () => {
  it('preserves each SVG/list node and team selection across timeline and ranking changes without duplicate keys', async () => {
    const pinia = createPinia(); setActivePinia(pinia)
    const tournament = useTournamentStore(), dock = useDockStore()
    tournament.importTournament(fixture)
    dock.currentGameIndex = 1
    dock.triangulation = true
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(ScatterPlot, { global: { plugins: [pinia] } })
    try {
      const buttons = wrapper.findAll('.player-list button')
      const original = new Map(buttons.map((button, i) => [button.text().split(' · ')[0], { li: button.element.parentElement, svg: wrapper.findAll('svg g')[i].element }]))
      await buttons.find(b => b.text().startsWith('Beta / p1'))!.trigger('click')
      for (const [game, metric, individual] of [[2, 'points', false], [2, 'damage', false], [1, 'kills', false], [2, 'points', true]] as const) {
        dock.currentGameIndex = game; dock.metric = metric; dock.cumulative = !individual
        await nextTick()
        const current = wrapper.findAll('.player-list button')
        expect(current).toHaveLength(4)
        for (const [i, button] of current.entries()) {
          const label = button.text().split(' · ')[0]
          expect(button.element.parentElement).toBe(original.get(label)!.li)
          expect(wrapper.findAll('svg g')[i].element).toBe(original.get(label)!.svg)
          expect(button.attributes('aria-pressed')).toBe(String(label === 'Beta / p1'))
        }
        const expected: Record<string, number> = {
          'Alpha / p1': individual ? 8 : game === 2 ? 9 : 1,
          'Alpha / b:c': individual ? 1 : game === 2 ? 5 : 4,
          'Beta / p1': individual ? 1 : game === 2 ? 3 : 2,
          'Gamma / c': individual ? 0 : 3,
        }
        for (const button of current) {
          const label = button.text().split(' · ')[0], kills = expected[label]
          expect(button.text()).toBe(`${label} · ${kills} kills · ${(kills * 100).toLocaleString('en-US')} damage`)
        }
        const beta = current.find(b => b.text().startsWith('Beta / p1'))!
        const kills = individual ? 1 : game === 2 ? 3 : 2
        expect(beta.text()).toBe(`Beta / p1 · ${kills} kills · ${kills * 100} damage`)
        const circle = wrapper.findAll('svg g')[current.indexOf(beta)].get('circle')
        expect(wrapper.get('polygon').attributes('points')).toBe(`${circle.attributes('cx')},${circle.attributes('cy')}`)
        expect(warn.mock.calls.filter(args => args.some(arg => /duplicate.*key/i.test(String(arg))))).toEqual([])
      }
    } finally { wrapper.unmount(); warn.mockRestore() }
  })
})
