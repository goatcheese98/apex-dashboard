import { computed } from 'vue'
import { useTournamentStore } from '@/stores/tournament'
import { useDockStore } from '@/stores/dock'
import { summarize } from '@/domain/tournament'

export function useStandings() {
  const tournament = useTournamentStore(), dock = useDockStore()
  const rows = computed(() => {
    const data = tournament.currentTournament
    if (!data) return []
    let teams = summarize(data, dock.currentGameIndex, dock.cumulative, tournament.selectedGames)
    teams.sort((a,b) => b[dock.metric]-a[dock.metric] || a.name.localeCompare(b.name))
    if (dock.selectedTeams.length) teams = teams.filter(t => dock.selectedTeams.includes(t.id))
    return dock.teamDisplayLimit ? teams.slice(0, dock.teamDisplayLimit) : teams
  })
  return { rows, dock, tournament }
}
