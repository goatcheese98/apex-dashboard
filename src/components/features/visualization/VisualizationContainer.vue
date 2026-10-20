<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'
import { decodeTournamentJSON, IMPORT_LIMITS } from '@/domain/importJSON'
import { useStandings } from '@/composables/standings'
import ThemeSelector from '@/components/ui/ThemeSelector.vue'
import TimelineControls from '@/components/features/controls/TimelineControls.vue'
import RaceChart from './RaceChart.vue'
import DamageAnalysis from './DamageAnalysis.vue'
import ScatterPlot from './ScatterPlot.vue'
const props = defineProps<{ tournamentId: string }>()
const { rows, dock, tournament } = useStandings()
const views = [{ id: 'race-chart', label: 'Standings' }, { id: 'scatter-plot', label: 'Kills & damage' }, { id: 'damage-analysis', label: 'Damage analysis' }] as const
const title = computed(() => tournament.currentTournament?.name ?? 'Tournament')
const noMatches = computed(() => !!tournament.selectedGames.length && !tournament.filteredGames.some(g => g.gameNumber <= dock.currentGameIndex && (dock.cumulative || g.gameNumber === dock.currentGameIndex)))
let reader: FileReader | undefined
let retryFile: File | undefined
watch(() => props.tournamentId, id => {
  reader?.abort()
  reader = undefined
  retryFile = undefined
  dock.playbackState = 'paused'
  dock.clearTeamSelection()
  if (tournament.currentTournament?.id === id && tournament.dataSource === 'Imported JSON') return
  void tournament.loadTournament(id)
}, { immediate: true })
function retry() { if (retryFile) readFile(retryFile); else void tournament.loadTournament(props.tournamentId) }
function readFile(file: File) {
  reader?.abort()
  reader = undefined
  tournament.isLoading = false
  retryFile = file
  if (file.size > IMPORT_LIMITS.bytes) { tournament.error = 'File: JSON must be at most 2 MB; split the tournament into smaller files'; return }
  tournament.isLoading = true
  tournament.error = null
  const currentReader = new FileReader()
  reader = currentReader
  currentReader.onload = () => {
    if (reader !== currentReader) return
    try { tournament.importTournament(decodeTournamentJSON(String(currentReader.result))); retryFile = undefined }
    catch (error) { tournament.error = error instanceof Error ? error.message : 'Invalid tournament response' }
    finally { tournament.isLoading = false }
  }
  currentReader.onerror = () => { if (reader !== currentReader) return; tournament.error = 'Could not read tournament JSON'; tournament.isLoading = false }
  currentReader.readAsText(file)
}
function importFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) readFile(file)
  input.value = ''
}
function reset() { tournament.clearFilters(); dock.clearTeamSelection(); dock.teamDisplayLimit = null }
onBeforeUnmount(() => { reader?.abort(); reader = undefined; tournament.isLoading = false })
</script>
<template>
  <header class="context-header">
    <div><p class="muted">Tournaments / {{ title }}</p><h1>Finals, at a glance.</h1><p class="muted">Explore standings as each game unfolds.</p></div><ThemeSelector />
  </header>
  <div class="source-controls"><span class="muted">{{ tournament.dataSource }} · {{ tournament.availableTeams.length }} teams</span><label class="file-label">Import tournament JSON<input type="file" accept=".json,application/json" aria-label="Import tournament JSON" @change="importFile" /></label></div>
  <nav class="visualization-tabs" aria-label="Visualization">
    <button v-for="view in views" :key="view.id" :aria-pressed="dock.currentVisualization === view.id" @click="dock.currentVisualization = view.id">{{ view.label }}</button>
  </nav>
  <div v-if="tournament.error" role="alert" class="error-state"><p>Could not load tournament: {{ tournament.error }}.</p><p v-if="tournament.currentTournament">Showing stale {{ tournament.dataSource.toLowerCase() }}: {{ title }}.</p><button @click="retry">Retry</button></div>
  <div v-if="tournament.isLoading" :class="{ 'loading-state': !tournament.currentTournament }" role="status"><p>Loading tournament</p><p v-if="tournament.currentTournament" class="muted">Showing previous data while loading.</p><template v-else><div v-for="n in 5" :key="n" class="skeleton-row" /></template></div>
  <template v-if="tournament.currentTournament?.games.length">
    <div class="metric-controls">
      <p class="muted">Game {{ dock.currentGameIndex }} of {{ tournament.currentTournament.totalGames }} / {{ dock.cumulative ? 'Cumulative' : 'Individual' }} {{ dock.metric }}</p>
      <div class="control-group">
        <label>Metric<select aria-label="Metric" v-model="dock.metric"><option value="points">Points</option><option value="kills">Kills</option><option value="damage">Damage</option></select></label>
        <label>Teams<select aria-label="Teams" v-model="dock.teamDisplayLimit"><option :value="null">All {{ tournament.availableTeams.length }} teams</option><option :value="15">Top 15</option><option :value="5">Top 5</option></select></label>
      </div>
    </div>
    <details class="filters"><summary>Filter games & teams</summary>
      <fieldset><legend>Games (none selected means all)</legend><label v-for="g in tournament.currentTournament.games" :key="g.gameNumber"><input v-model="tournament.selectedGames" type="checkbox" :value="g.gameNumber" />Game {{ g.gameNumber }}</label></fieldset>
      <fieldset><legend>Teams (none selected means all)</legend><label v-for="team in tournament.availableTeams" :key="team.id"><input v-model="dock.selectedTeams" type="checkbox" :value="team.id" />{{ team.name }}</label></fieldset><button @click="reset">Reset filters</button>
    </details>
    <label v-if="dock.currentVisualization === 'scatter-plot'" class="context-toggle"><input v-model="dock.triangulation" type="checkbox" />Triangulate teammates</label>
    <label v-if="dock.currentVisualization === 'damage-analysis'" class="context-toggle"><input v-model="dock.playerBreakdown" type="checkbox" />Player damage breakdown</label>
    <div v-if="!rows.length || noMatches" class="empty-state"><p>No matching games or teams at this position.</p><button @click="reset">Reset filters</button></div>
    <section v-else :key="dock.currentVisualization" class="chart-region" aria-label="Tournament visualization" tabindex="0">
      <RaceChart v-if="dock.currentVisualization === 'race-chart'" /><ScatterPlot v-else-if="dock.currentVisualization === 'scatter-plot'" /><DamageAnalysis v-else />
    </section>
    <TimelineControls />
    <details class="standings-table"><summary>Full standings values</summary><div class="table-scroll" role="region" aria-label="Full standings table, scroll horizontally" tabindex="0"><table><caption>{{ title }} · Game {{ dock.currentGameIndex }}</caption><thead><tr><th>Team</th><th>Points</th><th>Kills</th><th>Damage given</th><th>Damage taken</th></tr></thead><tbody><tr v-for="team in rows" :key="team.id"><th scope="row">{{ team.name }}</th><td>{{ team.points }}</td><td>{{ team.kills }}</td><td>{{ team.damage }}</td><td>{{ team.damageTaken }}</td></tr></tbody></table></div></details>
  </template>
  <div v-else-if="!tournament.isLoading && !tournament.error" class="empty-state"><h2>No games available</h2><RouterLink to="/">Choose tournament</RouterLink></div>
</template>
