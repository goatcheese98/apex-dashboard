<script setup lang="ts">
import { computed } from 'vue'
import { useTournamentStore } from '@/stores/tournament'
import { useDockStore } from '@/stores/dock'

defineOptions({
  name: 'RaceChart'
})

const tournamentStore = useTournamentStore()
const dockStore = useDockStore()

const displayedTeams = computed(() => {
  const teams = tournamentStore.availableTeams
  const limit = dockStore.teamDisplayLimit
  
  if (!limit) return teams
  
  // For now, just return the first N teams
  // In real implementation, this would be sorted by performance
  return teams.slice(0, limit)
})

const currentGameProgress = computed(() => {
  const totalGames = tournamentStore.currentTournament?.totalGames || 10
  return Math.floor((dockStore.timelinePosition / 100) * totalGames)
})
</script>

<template>
  <div class="w-full h-full p-8 flex flex-col">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-apex-orange mb-2">Tournament Race Chart</h1>
      <p class="text-apex-light/60">
        {{ tournamentStore.currentTournament?.name }} - 
        Progress: Game {{ Math.max(1, currentGameProgress) }} of {{ tournamentStore.currentTournament?.totalGames }}
      </p>
    </div>
    
    <!-- Chart area -->
    <div class="flex-1 bg-apex-dark/30 rounded-2xl border border-apex-orange/10 p-6">
      <div class="h-full flex items-center justify-center">
        <!-- Placeholder visualization -->
        <div class="text-center space-y-6 max-w-2xl">
          <div class="text-8xl opacity-20">🏁</div>
          
          <div class="space-y-4">
            <h3 class="text-2xl font-semibold text-apex-blue">Race Chart Visualization</h3>
            <p class="text-apex-light/70">
              This will show the dynamic progression of teams through tournament games,
              with animated bars racing up and down as teams gain and lose points.
            </p>
          </div>
          
          <!-- Mock data preview -->
          <div class="bg-apex-dark/50 rounded-lg p-4 space-y-2">
            <h4 class="text-sm font-medium text-apex-light/80 mb-3">
              Displaying {{ displayedTeams.length }} teams
              {{ dockStore.teamDisplayLimit ? `(Top ${dockStore.teamDisplayLimit})` : '(All teams)' }}
            </h4>
            
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div 
                v-for="team in displayedTeams.slice(0, 8)" 
                :key="team.id"
                class="flex items-center justify-between p-2 bg-apex-dark/30 rounded"
              >
                <span class="text-apex-light/70">{{ team.name }}</span>
                <div 
                  class="w-3 h-3 rounded-full" 
                  :style="{ backgroundColor: team.color }"
                />
              </div>
            </div>
            
            <div v-if="displayedTeams.length > 8" class="text-apex-light/50 text-xs">
              and {{ displayedTeams.length - 8 }} more teams...
            </div>
          </div>
          
          <!-- Filters indicator -->
          <div v-if="tournamentStore.selectedGames.length > 0" class="text-sm text-apex-blue">
            📊 Filtered to {{ tournamentStore.selectedGames.length }} selected games
          </div>
        </div>
      </div>
    </div>
  </div>
</template>