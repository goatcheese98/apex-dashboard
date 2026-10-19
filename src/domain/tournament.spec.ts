import { describe, expect, it } from 'vitest'
import { parseTournament, summarize } from './tournament'
import type { TournamentData } from '@/stores/tournament'

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
    expect(a.players[0]).toMatchObject({ id: 'ada', name: 'Ada', damage: 300 })
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
