<script setup lang="ts">
import { computed } from 'vue'
import { useTournamentStore } from '@/stores/tournament'
import { useDockStore } from '@/stores/dock'

defineOptions({
  name: 'ScatterPlot'
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
      <h1 class="text-3xl font-bold text-apex-purple mb-2">Performance Scatter Plot</h1>
      <p class="text-apex-light/60">
        {{ tournamentStore.currentTournament?.name }} - 
        Kills vs Damage analysis through Game {{ Math.max(1, currentGameProgress) }}
      </p>
    </div>
    
    <!-- Chart area -->
    <div class="flex-1 bg-apex-dark/30 rounded-2xl border border-apex-purple/10 p-6">
      <div class="h-full flex items-center justify-center">
        <!-- Placeholder visualization -->
        <div class="text-center space-y-6 max-w-2xl">
          <div class="text-8xl opacity-20">📈</div>
          
          <div class="space-y-4">
            <h3 class="text-2xl font-semibold text-apex-purple">Kills vs Damage Scatter Plot</h3>
            <p class="text-apex-light/70">
              Interactive scatter plot showing the relationship between kills and damage for teams and players.
              Points will animate and grow as the tournament progresses, showing cumulative performance changes.
            </p>
          </div>
          
          <!-- Mock axes preview -->
          <div class="bg-apex-dark/50 rounded-lg p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <!-- Y-axis info -->
              <div class="space-y-2">
                <h4 class="font-medium text-apex-light/80 flex items-center space-x-2">
                  <span>📊</span>
                  <span>Y-Axis: Damage</span>
                </h4>
                <ul class="text-apex-light/60 space-y-1 text-xs">
                  <li>• Cumulative damage dealt</li>
                  <li>• Updates with timeline</li>
                  <li>• Team or player level</li>
                </ul>
              </div>
              
              <!-- X-axis info -->
              <div class="space-y-2">
                <h4 class="font-medium text-apex-light/80 flex items-center space-x-2">
                  <span>🎯</span>
                  <span>X-Axis: Kills</span>
                </h4>
                <ul class="text-apex-light/60 space-y-1 text-xs">
                  <li>• Cumulative kill count</li>
                  <li>• Synchronized progression</li>
                  <li>• Interactive data points</li>
                </ul>
              </div>
            </div>
            
            <!-- Mock scatter points preview -->
            <div class="mt-6 relative h-32 bg-apex-dark/30 rounded border border-apex-purple/20">
              <div class="absolute inset-4">
                <!-- Mock data points -->
                <div 
                  v-for="i in 12" 
                  :key="i"
                  class="absolute w-2 h-2 rounded-full opacity-60"
                  :style="{
                    backgroundColor: `hsl(${(i * 30) % 360}, 70%, 60%)`,
                    left: `${Math.random() * 80 + 10}%`,
                    top: `${Math.random() * 80 + 10}%`,
                  }"
                />
              </div>
            </div>
          </div>
          
          <!-- Interactive features -->
          <div class="text-sm text-apex-light/60 bg-apex-dark/30 rounded-lg p-3 space-y-2">
            <p>🖱️ <strong>Interactive Features:</strong></p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <span>• Click points for details</span>
              <span>• Hover for team/player info</span>
              <span>• Zoom and pan support</span>
              <span>• Performance trajectory trails</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>