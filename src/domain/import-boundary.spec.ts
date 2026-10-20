import { describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { parseTournament, summarize } from './tournament'
import { useTournamentStore, type TournamentData } from '@/stores/tournament'

function expanded(players: number, games: number, distinct = true): TournamentData {
  return { id: 'bounded', name: 'Boundary fixture', totalGames: games,
    teams: [{ id: 't', name: 'Team', color: '#123456', players: [] }],
    games: Array.from({ length: games }, (_, game) => ({ gameNumber: game + 1, teams: [{
      teamId: 't', placement: 1, points: 1, kills: 0, damage: 0,
      playerStats: Array.from({ length: players }, (_, player) => ({ playerId: `p${distinct ? game * players + player : player}`, kills: 0, damage: 0, damageTaken: 0 })),
    }] })),
  }
}

describe('untrusted tournament budgets and diagnostics', () => {
  it('rejects cross-game player expansion well below the existing byte limit', () => {
    const input = expanded(700, 3)
    expect(new TextEncoder().encode(JSON.stringify(input)).length).toBeLessThan(2_000_000)
    expect(() => parseTournament(input)).toThrow(/games\[2\].*playerId:.*2,000.*split/i)
    expect(parseTournament(expanded(1000, 2)).games).toHaveLength(2)
  })
  it('bounds aggregate work even when each list and the distinct-player count are individually valid', () => {
    expect(() => parseTournament(expanded(200, 100, false))).toThrow(/20,000.*split/i)
    expect(parseTournament(expanded(200, 90, false)).games).toHaveLength(90)
  })
  it('identifies the invalid field without echoing untrusted content', () => {
    const data = expanded(1, 2)
    data.games[1].teams[0].playerStats[0].damage = -1
    expect(() => parseTournament(data)).toThrow(/^games\[1\]\.teams\[0\]\.playerStats\[0\]\.damage:/)
    data.name = 'private-data-'.repeat(100)
    try { parseTournament(data); expect.fail('should reject') } catch (error) {
      expect((error as Error).message.length).toBeLessThan(250)
      expect((error as Error).message).not.toContain('private-data-')
    }
  })
  it('does not repeatedly scan all game teams while summarizing a valid import', () => {
    const data = expanded(0, 1)
    data.teams = Array.from({ length: 100 }, (_, i) => ({ id: `t${i}`, name: `Team ${i}`, players: [], color: '#123456' }))
    data.games[0].teams = data.teams.map(t => ({ teamId: t.id, placement: 1, points: 1, kills: 0, damage: 0, playerStats: [] }))
    let reads = 0
    data.games[0].teams = new Proxy(data.games[0].teams, { get(target, key, receiver) {
      if (typeof key === 'string' && /^\d+$/.test(key)) reads++
      return Reflect.get(target, key, receiver)
    } })
    expect(summarize(data, 1, true, []).every(t => t.points === 1)).toBe(true)
    expect(reads).toBeLessThanOrEqual(200)
  })
})


describe('unrestricted imported team identifiers', () => {
  it('keeps prototype-looking IDs as ordinary own dictionary entries in the existing cumulative getter', () => {
    setActivePinia(createPinia())
    const store = useTournamentStore()
    const data = expanded(0, 1)
    data.teams = ['__proto__', 'constructor', 'toString'].map(id => ({ id, name: id, players: [], color: '#123456' }))
    data.games[0].teams = data.teams.map((team, i) => ({ teamId: team.id, placement: 1, points: i + 1, kills: i + 2, damage: i + 3, playerStats: [] }))
    store.importTournament(data)
    for (const [i, team] of data.teams.entries()) {
      expect(Object.prototype.hasOwnProperty.call(store.cumulativeData, team.id)).toBe(true)
      expect(store.cumulativeData[team.id][0]).toMatchObject({ totalPoints: i + 1, totalKills: i + 2, totalDamage: i + 3 })
    }
    expect(Object.keys(store.cumulativeData)).toHaveLength(3)
  })
})
