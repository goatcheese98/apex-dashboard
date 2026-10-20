<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTournamentStore } from '@/stores/tournament'
const route = useRoute(), router = useRouter(), tournament = useTournamentStore()
const DevelopmentNavigation = import.meta.env.DEV ? defineAsyncComponent(() => import('./DevelopmentNavigation.vue')) : undefined
function choose(event: Event) {
  const id = (event.target as HTMLSelectElement).value
  if (id === 'ewc-2025' && tournament.dataSource === 'Imported JSON') void tournament.loadTournament(id)
  if (id) router.push(`/tournament/${encodeURIComponent(id)}`)
}
</script>
<template>
  <div class="lum-workspace">
    <a class="skip-link" href="#workspace">Skip to analysis</a>
    <aside class="lum-sidebar">
      <RouterLink class="brand" to="/">Apex / Analysis</RouterLink>
      <label class="tournament-choice">Tournaments
        <select aria-label="Choose tournament" :value="tournament.dataSource === 'Imported JSON' ? tournament.currentTournament?.id : route.params.tournamentId ?? ''" @change="choose">
          <option value="" disabled>Choose tournament</option>
          <option value="ewc-2025">EWC 2025 · Sample</option>
          <option v-if="tournament.dataSource === 'Imported JSON'" :value="tournament.currentTournament?.id">{{ tournament.currentTournament?.name }} · Imported</option>
        </select>
      </label>
      <RouterLink v-if="route.path === '/'" to="/tournament/ewc-2025">Open sample tournament →</RouterLink>
      <DevelopmentNavigation v-if="DevelopmentNavigation" />
      <p class="source-note">{{ tournament.dataSource }}<br />{{ tournament.availableTeams.length || 20 }} teams · No live connection</p>
    </aside>
    <main id="workspace" tabindex="-1"><slot /></main>
  </div>
</template>
