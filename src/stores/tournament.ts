import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { parseTournament, type PlayerNamesByTeam } from '@/domain/tournament'

export interface TeamData {
  id: string
  name: string
  players: string[]
  color: string
}

export interface GameData {
  gameNumber: number
  teams: Array<{
    teamId: string
    placement: number
    points: number
    kills: number
    damage: number
    playerStats: Array<{
      playerId: string
      kills: number
      damage: number
      damageTaken: number
    }>
  }>
}

export interface TournamentData {
  id: string
  name: string
  teams: TeamData[]
  games: GameData[]
  totalGames: number
}

export const useTournamentStore = defineStore('tournament', () => {
  // State
  const currentTournament = ref<TournamentData | null>(null)
  const selectedGames = ref<number[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const dataSource = ref('Sample data')
  const playerNames = ref<PlayerNamesByTeam>(new Map())
  let requestVersion = 0

  // Getters
  const availableTeams = computed(() => currentTournament.value?.teams || [])
  
  const filteredGames = computed(() => {
    if (!currentTournament.value) return []
    
    if (selectedGames.value.length === 0) {
      return currentTournament.value.games
    }
    
    return currentTournament.value.games.filter(game => 
      selectedGames.value.includes(game.gameNumber)
    )
  })

  const cumulativeData = computed(() => {
    const cumulative: Record<string, Array<{
      gameNumber: number
      totalPoints: number
      totalKills: number
      totalDamage: number
      placement: number
    }>> = Object.create(null)

    filteredGames.value.forEach(game => {
      game.teams.forEach(teamData => {
        if (!cumulative[teamData.teamId]) {
          cumulative[teamData.teamId] = []
        }

        const previousData = cumulative[teamData.teamId].slice(-1)[0]
        const totalPoints = (previousData?.totalPoints || 0) + teamData.points
        const totalKills = (previousData?.totalKills || 0) + teamData.kills
        const totalDamage = (previousData?.totalDamage || 0) + teamData.damage

        cumulative[teamData.teamId].push({
          gameNumber: game.gameNumber,
          totalPoints,
          totalKills,
          totalDamage,
          placement: teamData.placement,
        })
      })
    })

    return cumulative
  })

  // Actions
  const loadTournament = async (tournamentId: string) => {
    const version = ++requestVersion
    isLoading.value = true
    error.value = null
    await Promise.resolve()
    if (version !== requestVersion) return

    try {
      if (tournamentId !== 'ewc-2025') throw new Error('Unknown tournament. Choose the EWC sample or import JSON')
      // Preserve the existing generated dataset, explicitly labeled as sample data.
      const sampleNames = new Map<string, Map<string, string>>()
      const mockData: TournamentData = {
        id: tournamentId,
        name: 'EWC 2025',
        totalGames: 10,
        teams: Array.from({ length: 20 }, (_, i) => {
          const teamId = `team-${i + 1}`
          // This generator owns both IDs and names; external roster order supplies no such contract.
          const names = new Map(Array.from({ length: 3 }, (_, playerIndex) => {
            const number = i * 3 + playerIndex + 1
            return [`player-${number}`, `Player ${number}`] as const
          }))
          sampleNames.set(teamId, names)
          return { id: teamId, name: `Team ${i + 1}`, players: [...names.values()], color: `hsl(${(i * 18) % 360}, 70%, 60%)` }
        }),
        games: Array.from({ length: 10 }, (_, gameIndex) => ({
          gameNumber: gameIndex + 1,
          teams: Array.from({ length: 20 }, (_, teamIndex) => ({
            teamId: `team-${teamIndex + 1}`,
            placement: Math.floor(Math.random() * 20) + 1,
            points: Math.floor(Math.random() * 15) + 1,
            kills: Math.floor(Math.random() * 8),
            damage: Math.floor(Math.random() * 3000) + 500,
            playerStats: Array.from({ length: 3 }, (_, playerIndex) => ({
              playerId: `player-${teamIndex * 3 + playerIndex + 1}`,
              kills: Math.floor(Math.random() * 3),
              damage: Math.floor(Math.random() * 1200) + 200,
              damageTaken: Math.floor(Math.random() * 800) + 100,
            })),
          })),
        })),
      }

      currentTournament.value = parseTournament(mockData)
      playerNames.value = sampleNames
      dataSource.value = 'Sample data'
      selectedGames.value = [] // Show all games by default
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load tournament'
    } finally {
      isLoading.value = false
    }
  }

  function importTournament(input: unknown) {
    const parsed = parseTournament(input)
    ++requestVersion
    currentTournament.value = parsed
    dataSource.value = 'Imported JSON'
    playerNames.value = new Map()
    selectedGames.value = []
    error.value = null
    isLoading.value = false
  }

  const toggleGameFilter = (gameNumber: number) => {
    const index = selectedGames.value.indexOf(gameNumber)
    if (index > -1) {
      selectedGames.value.splice(index, 1)
    } else {
      selectedGames.value.push(gameNumber)
    }
  }

  const setGameFilters = (games: number[]) => {
    selectedGames.value = [...games]
  }

  const clearFilters = () => {
    selectedGames.value = []
  }

  return {
    // State
    currentTournament,
    dataSource,
    playerNames,
    importTournament,
    selectedGames,
    isLoading,
    error,
    // Getters
    availableTeams,
    filteredGames,
    cumulativeData,
    // Actions
    loadTournament,
    toggleGameFilter,
    setGameFilters,
    clearFilters,
  }
})