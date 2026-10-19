import type { TournamentData } from '@/stores/tournament'

export interface PlayerSummary { id: string; name: string; kills: number; damage: number; damageTaken: number }
export interface TeamSummary {
  id: string; name: string; color: string; points: number; kills: number; damage: number; damageTaken: number; players: PlayerSummary[]
}
export type PlayerNamesByTeam = ReadonlyMap<string, ReadonlyMap<string, string>>
export type Metric = 'points' | 'kills' | 'damage'

// JSON import is the only external boundary in this slice. No provider is connected.
export function parseTournament(input: unknown): TournamentData {
  function object(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Expected a tournament object')
    return value as Record<string, unknown>
  }
  function text(value: unknown): string {
    if (typeof value !== 'string' || !value.trim() || value.length > 200) throw new Error('Invalid name or identifier')
    return value
  }
  function number(value: unknown, integer = false): number {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1_000_000_000 || (integer && !Number.isInteger(value))) throw new Error('Invalid tournament number')
    return value
  }
  function list(value: unknown): unknown[] {
    if (!Array.isArray(value) || value.length > 1000) throw new Error('Invalid tournament collection')
    return value
  }
  function unique(values: (string | number)[]) {
    if (new Set(values).size !== values.length) throw new Error('Duplicate tournament identifiers')
  }
  const root = object(input)
  const teams = list(root.teams).map(value => {
    const t = object(value), color = text(t.color)
    if (!/^(#[\da-f]{3,8}|hsl\([\d.,%\s]+\))$/i.test(color)) throw new Error('Invalid team color')
    const players = list(t.players).map(text)
    return { id: text(t.id), name: text(t.name), color, players }
  })
  unique(teams.map(t => t.id))
  const totalGames = number(root.totalGames, true)
  if (totalGames > 1000) throw new Error('Too many games')
  const games = list(root.games).map(value => {
    const g = object(value), gameNumber = number(g.gameNumber, true)
    if (gameNumber < 1 || gameNumber > totalGames) throw new Error('Game outside tournament range')
    const entries = list(g.teams).map(value => {
      const t = object(value), teamId = text(t.teamId)
      if (!teams.some(team => team.id === teamId)) throw new Error('Unknown team')
      const playerStats = list(t.playerStats).map(value => {
        const p = object(value)
        return { playerId: text(p.playerId), kills: number(p.kills, true), damage: number(p.damage), damageTaken: number(p.damageTaken) }
      })
      unique(playerStats.map(p => p.playerId))
      return { teamId, placement: number(t.placement, true), points: number(t.points), kills: number(t.kills, true), damage: number(t.damage), playerStats }
    })
    unique(entries.map(t => t.teamId))
    return { gameNumber, teams: entries }
  }).sort((a,b) => a.gameNumber-b.gameNumber)
  unique(games.map(g => g.gameNumber))
  return { id: text(root.id), name: text(root.name), totalGames, teams, games }
}

// Imported rosters do not link names to IDs. Only a trusted source may supply an explicit identity map.
export function summarize(tournament: TournamentData, game: number, cumulative: boolean, filters: number[], playerNames?: PlayerNamesByTeam): TeamSummary[] {
  const current = Math.max(0, Math.min(tournament.totalGames, Math.floor(game)))
  return tournament.teams.map(team => {
    const result: TeamSummary = { id: team.id, name: team.name, color: team.color, points: 0, kills: 0, damage: 0, damageTaken: 0, players: [] }
    for (const g of tournament.games) {
      if (g.gameNumber > current || (!cumulative && g.gameNumber !== current) || (filters.length && !filters.includes(g.gameNumber))) continue
      const entry = g.teams.find(t => t.teamId === team.id)
      if (!entry) continue
      result.points += entry.points; result.kills += entry.kills; result.damage += entry.damage
      entry.playerStats.forEach(p => {
        let player = result.players.find(player => player.id === p.playerId)
        if (!player) {
          player = { id: p.playerId, name: playerNames?.get(team.id)?.get(p.playerId) ?? p.playerId, kills: 0, damage: 0, damageTaken: 0 }
          result.players.push(player)
        }
        player.kills += p.kills; player.damage += p.damage; player.damageTaken += p.damageTaken
        result.damageTaken += p.damageTaken
      })
    }
    return result
  })
}
