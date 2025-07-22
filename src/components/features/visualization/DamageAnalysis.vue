<script setup lang="ts">
import { computed } from 'vue'
import { useTournamentStore } from '@/stores/tournament'
import { useDockStore } from '@/stores/dock'

defineOptions({
  name: 'DamageAnalysis'
})

const tournamentStore = useTournamentStore()
const dockStore = useDockStore()

const currentGameProgress = computed(() => {
  const totalGames = tournamentStore.currentTournament?.totalGames || 10
  return Math.floor((dockStore.timelinePosition / 100) * totalGames)
})
</script>

<template>
  <div class="w-full h-full p-8 flex flex-col">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-apex-red mb-2">Damage Analysis Dashboard</h1>
      <p class="text-apex-light/60">
        {{ tournamentStore.currentTournament?.name }} - 
        Cumulative damage tracking through Game {{ Math.max(1, currentGameProgress) }}
      </p>
    </div>
    
    <!-- Chart area -->
    <div class="flex-1 bg-apex-dark/30 rounded-2xl border border-apex-red/10 p-6">
      <div class="h-full flex items-center justify-center">
        <!-- Placeholder visualization -->
        <div class="text-center space-y-6 max-w-2xl">
          <div class="text-8xl opacity-20">⚔️</div>
          
          <div class="space-y-4">
            <h3 class="text-2xl font-semibold text-apex-red">Team & Player Damage Analysis</h3>
            <p class="text-apex-light/70">
              This visualization will show cumulative damage given and taken by each team,
              with expandable breakdowns for individual player contributions within teams.
            </p>
          </div>
          
          <!-- Mock features preview -->
          <div class="bg-apex-dark/50 rounded-lg p-4 space-y-4">
            <h4 class="text-sm font-medium text-apex-light/80 mb-3">Features</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div class="space-y-2">
                <div class="flex items-center space-x-2 text-apex-red/80">
                  <span>📈</span>
                  <span>Team damage totals</span>
                </div>
                <div class="flex items-center space-x-2 text-apex-blue/80">
                  <span>👥</span>
                  <span>Player breakdowns</span>
                </div>
              </div>
              
              <div class="space-y-2">
                <div class="flex items-center space-x-2 text-apex-purple/80">
                  <span>🎯</span>
                  <span>Damage given vs taken</span>
                </div>
                <div class="flex items-center space-x-2 text-apex-orange/80">
                  <span>📊</span>
                  <span>Cumulative progression</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Timeline sync indicator -->
          <div class="text-sm text-apex-light/60 bg-apex-dark/30 rounded-lg p-3">
            🔄 Synchronized with timeline controls and game filters
          </div>
        </div>
      </div>
    </div>
  </div>
</template>