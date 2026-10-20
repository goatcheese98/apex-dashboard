import type { TournamentData } from '@/stores/tournament'
import { isTeamColor } from './teamColor'
import { IMPORT_LIMITS, TournamentImportError } from './importJSON'

export interface PlayerSummary { id: string; name: string; kills: number; damage: number; damageTaken: number }
export interface TeamSummary {
  id: string; name: string; color: string; points: number; kills: number; damage: number; damageTaken: number; players: PlayerSummary[]
}
export type PlayerNamesByTeam = ReadonlyMap<string, ReadonlyMap<string, string>>
export type Metric = 'points' | 'kills' | 'damage'

// JSON import is the only external boundary in this slice. No provider is connected.
export function parseTournament(input: unknown): TournamentData {
  let remaining = IMPORT_LIMITS.entries as number
  let playerCount = 0
  const playerIds = new Map<string, Set<string>>()
  function fail(path: string, reason: string): never { throw new TournamentImportError(path, reason) }
  function object(value: unknown, path: string): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) fail(path, 'expected an object')
    return value as Record<string, unknown>
  }
  function text(value: unknown, path: string): string {
    if (typeof value !== 'string' || !value.trim() || value.length > 200) fail(path, 'expected nonempty text of at most 200 characters')
    return value
  }
  function number(value: unknown, path: string, integer = false): number {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1_000_000_000 || (integer && !Number.isInteger(value))) {
      fail(path, `expected a finite ${integer ? 'integer' : 'number'} from 0 to 1,000,000,000`)
    }
    return value
  }
  function list(value: unknown, path: string): unknown[] {
    if (!Array.isArray(value) || value.length > IMPORT_LIMITS.collection) fail(path, 'expected an array with at most 1,000 entries')
    remaining -= value.length
    if (remaining < 0) fail(path, 'total collection entries exceed 20,000; split the tournament into smaller files')
    return value
  }
  function unique(values: (string | number)[], path: string, field: string) {
    const seen = new Set<string | number>()
    values.forEach((value, index) => {
      if (seen.has(value)) fail(`${path}[${index}].${field}`, 'duplicate identifier; use a unique value within this collection')
      seen.add(value)
    })
  }
  const root = object(input, 'Tournament')
  const id = text(root.id, 'id'), name = text(root.name, 'name')
  const teams = list(root.teams, 'teams').map((value, i) => {
    const path = `teams[${i}]`, t = object(value, path), color = text(t.color, `${path}.color`)
    if (!isTeamColor(color)) fail(`${path}.color`, 'expected a 3, 4, 6 or 8-digit hex or numeric hsl team color')
    const players = list(t.players, `${path}.players`).map((p, j) => text(p, `${path}.players[${j}]`))
    return { id: text(t.id, `${path}.id`), name: text(t.name, `${path}.name`), color, players }
  })
  unique(teams.map(t => t.id), 'teams', 'id')
  const teamIds = new Set(teams.map(t => t.id))
  const totalGames = number(root.totalGames, 'totalGames', true)
  if (totalGames > 1000) fail('totalGames', 'at most 1,000 games are supported; split the tournament')
  const games = list(root.games, 'games').map((value, i) => {
    const path = `games[${i}]`, g = object(value, path), gameNumber = number(g.gameNumber, `${path}.gameNumber`, true)
    if (gameNumber < 1 || gameNumber > totalGames) fail(`${path}.gameNumber`, 'expected a game from 1 through totalGames')
    const entries = list(g.teams, `${path}.teams`).map((value, j) => {
      const teamPath = `${path}.teams[${j}]`, t = object(value, teamPath), teamId = text(t.teamId, `${teamPath}.teamId`)
      if (!teamIds.has(teamId)) fail(`${teamPath}.teamId`, 'unknown team; add its roster entry or correct the identifier')
      let seen = playerIds.get(teamId)
      if (!seen) { seen = new Set(); playerIds.set(teamId, seen) }
      const playerStats = list(t.playerStats, `${teamPath}.playerStats`).map((value, k) => {
        const playerPath = `${teamPath}.playerStats[${k}]`, p = object(value, playerPath)
        const playerId = text(p.playerId, `${playerPath}.playerId`)
        if (!seen.has(playerId)) {
          seen.add(playerId)
          if (++playerCount > IMPORT_LIMITS.players) fail(`${playerPath}.playerId`, 'at most 2,000 distinct team/player pairs are supported; split the tournament into smaller files')
        }
        return { playerId, kills: number(p.kills, `${playerPath}.kills`, true), damage: number(p.damage, `${playerPath}.damage`), damageTaken: number(p.damageTaken, `${playerPath}.damageTaken`) }
      })
      unique(playerStats.map(p => p.playerId), `${teamPath}.playerStats`, 'playerId')
      return { teamId, placement: number(t.placement, `${teamPath}.placement`, true), points: number(t.points, `${teamPath}.points`), kills: number(t.kills, `${teamPath}.kills`, true), damage: number(t.damage, `${teamPath}.damage`), playerStats }
    })
    unique(entries.map(t => t.teamId), `${path}.teams`, 'teamId')
    return { gameNumber, teams: entries }
  }).sort((a,b) => a.gameNumber-b.gameNumber)
  unique(games.map(g => g.gameNumber), 'games', 'gameNumber')
  return { id, name, totalGames, teams, games }
}

// Imported rosters do not link names to IDs. Only a trusted source may supply an explicit identity map.
export function summarize(tournament: TournamentData, game: number, cumulative: boolean, filters: number[], playerNames?: PlayerNamesByTeam): TeamSummary[] {
  const current = Math.max(0, Math.min(tournament.totalGames, Math.floor(game)))
  const results: TeamSummary[] = tournament.teams.map(team => ({ id: team.id, name: team.name, color: team.color, points: 0, kills: 0, damage: 0, damageTaken: 0, players: [] }))
  const teams = new Map(results.map(team => [team.id, team]))
  const players = new Map(results.map(team => [team.id, new Map<string, PlayerSummary>()]))
  const selected = new Set(filters)
  for (const g of tournament.games) {
    if (g.gameNumber > current || (!cumulative && g.gameNumber !== current) || (selected.size && !selected.has(g.gameNumber))) continue
    for (const entry of g.teams) {
      const result = teams.get(entry.teamId), members = players.get(entry.teamId)
      if (!result || !members) continue
      result.points += entry.points; result.kills += entry.kills; result.damage += entry.damage
      for (const p of entry.playerStats) {
        let player = members.get(p.playerId)
        if (!player) {
          player = { id: p.playerId, name: playerNames?.get(entry.teamId)?.get(p.playerId) ?? p.playerId, kills: 0, damage: 0, damageTaken: 0 }
          members.set(p.playerId, player)
          result.players.push(player)
        }
        player.kills += p.kills; player.damage += p.damage; player.damageTaken += p.damageTaken
        result.damageTaken += p.damageTaken
      }
    }
  }
  return results
}
