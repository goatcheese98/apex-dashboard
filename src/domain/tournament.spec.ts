import { describe, expect, it } from 'vitest'
import { parseTournament, summarize } from './tournament'
import { useTournamentStore, type TournamentData } from '@/stores/tournament'
import { createPinia, setActivePinia } from 'pinia'
import { useStandings } from '@/composables/standings'

export const fixture: TournamentData = {
  id: 'fixed', name: 'Fixed tournament', totalGames: 2,
  teams: [{ id: 'a', name: 'Alpha', players: ['Ada'], color: '#123456' }, { id: 'b', name: 'Beta', players: ['Bea'], color: '#654321' }],
  games: [1, 2].map(n => ({ gameNumber: n, teams: [
    { teamId: 'a', placement: 2, points: n * 10, kills: n, damage: n * 100, playerStats: [{ playerId: 'ada', kills: n, damage: n * 100, damageTaken: n * 50 }] },
    { teamId: 'b', placement: 1, points: 15, kills: 3, damage: 300, playerStats: [{ playerId: 'bea', kills: 3, damage: 300, damageTaken: 90 }] },
  ] })),
}

describe('shared tournament calculation', () => {
  it('accumulates through the selected game and preserves player values', () => {
    const a = summarize(fixture, 2, true, []).find(t => t.id === 'a')!
    expect([a.points, a.kills, a.damage, a.damageTaken]).toEqual([30, 3, 300, 150])
    expect(a.players[0]).toMatchObject({ id: 'ada', name: 'ada', damage: 300 })
  })
  it('uses only the current game in individual mode', () => {
    expect(summarize(fixture, 2, false, []).find(t => t.id === 'a')?.points).toBe(20)
  })
  it('has a zero pregame baseline, clamps boundaries and respects game filters', () => {
    expect(summarize(fixture, 0, true, []).every(t => t.points === 0)).toBe(true)
    expect(summarize(fixture, 999, true, [1]).find(t => t.id === 'a')?.points).toBe(10)
    expect(summarize(fixture, -1, false, []).every(t => t.damage === 0)).toBe(true)
    expect(summarize(fixture, 1, true, [2]).every(t => t.points === 0)).toBe(true)
  })
  it('sorts by actual metric with stable ties', () => {
    expect(summarize(fixture, 1, true, []).sort((a,b) => b.points-a.points)[0].id).toBe('b')
  })
  it('validates external data without changing the existing schema', () => {
    expect(parseTournament(fixture)).toEqual(fixture)
    expect(parseTournament({ ...fixture, games: [] }).games).toEqual([])
    for (const bad of [null, {}, { ...fixture, totalGames: -1 }, { ...fixture, games: [{ gameNumber: 1, teams: [{ teamId: 'missing' }] }] }]) {
      expect(() => parseTournament(bad)).toThrow()
    }
    expect(() => parseTournament({ ...fixture, teams: [...fixture.teams, fixture.teams[0]] })).toThrow()
    expect(() => parseTournament({ ...fixture, games: [...fixture.games, fixture.games[0]] })).toThrow()
    expect(() => parseTournament({ ...fixture, teams: [{ ...fixture.teams[0], color: 'url(https://bad)' }] })).toThrow()
  })
})


describe('player identity across reordered and missing stats', () => {
  it('keeps imported stable IDs without assigning unrelated positional roster names', () => {
    const stats = (playerId: string, n: number) => ({ playerId, kills: n, damage: n * 100, damageTaken: n * 10 })
    const imported = parseTournament({
      id: 'ewc-2025', name: 'Imported identity fixture', totalGames: 3,
      teams: [{ id: 'team-1', name: 'Alpha', players: ['Ada', 'Bea'], color: '#123456' }],
      games: [
        [stats('player-2', 2), stats('player-1', 1)],
        [stats('player-1', 3)],
        [stats('player-1', 4), stats('player-2', 5)],
      ].map((playerStats, index) => ({ gameNumber: index + 1, teams: [{ teamId: 'team-1', placement: 1, points: 10, kills: 0, damage: 0, playerStats }] })),
    })
    const cumulative = summarize(imported, 3, true, [])[0].players
    expect(cumulative).toEqual([
      { id: 'player-2', name: 'player-2', kills: 7, damage: 700, damageTaken: 70 },
      { id: 'player-1', name: 'player-1', kills: 8, damage: 800, damageTaken: 80 },
    ])
    expect(summarize(imported, 1, false, [])[0].players.map(p => p.name)).toEqual(['player-2', 'player-1'])
    expect(summarize(imported, 2, false, [])[0].players).toEqual([{ id: 'player-1', name: 'player-1', kills: 3, damage: 300, damageTaken: 30 }])
    expect(summarize(imported, 3, true, [2, 3])[0].players).toEqual([
      { id: 'player-1', name: 'player-1', kills: 7, damage: 700, damageTaken: 70 },
      { id: 'player-2', name: 'player-2', kills: 5, damage: 500, damageTaken: 50 },
    ])
  })
  it('preserves generated sample names but never reuses that mapping for an import', async () => {
    setActivePinia(createPinia())
    const { tournament, dock, rows } = useStandings()
    await tournament.loadTournament('ewc-2025')
    dock.currentGameIndex = 2
    const team = tournament.currentTournament!.games[1].teams[0]
    team.playerStats.reverse()
    team.playerStats.splice(1, 1)
    dock.cumulative = false
    expect(rows.value.find(t => t.id === 'team-1')!.players.map(p => [p.id, p.name])).toEqual([['player-3', 'Player 3'], ['player-1', 'Player 1']])
    dock.cumulative = true
    expect(rows.value.find(t => t.id === 'team-1')!.players.map(p => [p.id, p.name])).toEqual([
      ['player-1', 'Player 1'], ['player-2', 'Player 2'], ['player-3', 'Player 3'],
    ])
    const sameData = structuredClone(JSON.parse(JSON.stringify(tournament.currentTournament)))
    tournament.importTournament(sameData)
    expect(useTournamentStore().dataSource).toBe('Imported JSON')
    expect(rows.value.find(t => t.id === 'team-1')!.players.every(p => p.name === p.id)).toBe(true)
  })
})
