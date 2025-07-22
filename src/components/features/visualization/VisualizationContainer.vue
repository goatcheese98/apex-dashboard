<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useDockStore } from '@/stores/dock'
import { useTournamentStore } from '@/stores/tournament'
import RaceChart from './RaceChart.vue'
import DamageAnalysis from './DamageAnalysis.vue'
import ScatterPlot from './ScatterPlot.vue'

interface Props {
  tournamentId: string
}

const props = defineProps<Props>()

defineOptions({
  name: 'VisualizationContainer'
})

const dockStore = useDockStore()
const tournamentStore = useTournamentStore()

const containerClasses = computed(() => [
  'card-stack-container',
  'relative w-full h-full min-h-screen',
  'bg-gradient-to-br from-apex-dark via-apex-dark/95 to-apex-dark/90'
])

// Load tournament data when component mounts
onMounted(async () => {
  await tournamentStore.loadTournament(props.tournamentId)
  dockStore.showDock()
})

// Watch for tournament changes
watch(() => props.tournamentId, async (newId) => {
  if (newId) {
    await tournamentStore.loadTournament(newId)
  }
})
</script>

<template>
  <div :class="containerClasses">
    <!-- Loading state -->
    <div 
      v-if="tournamentStore.isLoading"
      class="absolute inset-0 flex items-center justify-center bg-apex-dark/80"
    >
      <div class="text-center space-y-4">
        <div class="w-16 h-16 border-4 border-apex-orange border-t-transparent rounded-full animate-spin mx-auto" />
        <p class="text-apex-light/80">Loading tournament data...</p>
      </div>
    </div>
    
    <!-- Error state -->
    <div 
      v-else-if="tournamentStore.error"
      class="absolute inset-0 flex items-center justify-center bg-apex-dark/80"
    >
      <div class="text-center space-y-4 max-w-md">
        <div class="text-6xl">⚠️</div>
        <h2 class="text-2xl font-bold text-apex-red">Error Loading Tournament</h2>
        <p class="text-apex-light/80">{{ tournamentStore.error }}</p>
        <button
          @click="tournamentStore.loadTournament(props.tournamentId)"
          class="px-6 py-3 bg-apex-orange text-white font-medium rounded-lg hover:bg-apex-orange/80 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
    
    <!-- Visualization cards -->
    <div 
      v-else-if="tournamentStore.currentTournament"
      class="relative w-full h-full"
    >
      <!-- Race Chart -->
      <Transition 
        name="card"
        mode="out-in"
      >
        <RaceChart
          v-if="dockStore.currentVisualization === 'race-chart'"
          key="race-chart"
          class="absolute inset-0 gpu-accelerated"
          :class="{
            'animate-card-unveil': !dockStore.isAnimating,
            'animate-card-lift': dockStore.isAnimating && dockStore.currentVisualization !== 'race-chart'
          }"
        />
      </Transition>
      
      <!-- Damage Analysis -->
      <Transition 
        name="card"
        mode="out-in"
      >
        <DamageAnalysis
          v-if="dockStore.currentVisualization === 'damage-analysis'"
          key="damage-analysis" 
          class="absolute inset-0 gpu-accelerated"
          :class="{
            'animate-card-unveil': !dockStore.isAnimating,
            'animate-card-lift': dockStore.isAnimating && dockStore.currentVisualization !== 'damage-analysis'
          }"
        />
      </Transition>
      
      <!-- Scatter Plot -->
      <Transition 
        name="card"
        mode="out-in"
      >
        <ScatterPlot
          v-if="dockStore.currentVisualization === 'scatter-plot'"
          key="scatter-plot"
          class="absolute inset-0 gpu-accelerated"
          :class="{
            'animate-card-unveil': !dockStore.isAnimating,
            'animate-card-lift': dockStore.isAnimating && dockStore.currentVisualization !== 'scatter-plot'
          }"
        />
      </Transition>
    </div>
    
    <!-- Empty state -->
    <div 
      v-else
      class="absolute inset-0 flex items-center justify-center"
    >
      <div class="text-center space-y-4">
        <div class="text-6xl">📊</div>
        <h2 class="text-2xl font-bold text-apex-light">No Tournament Selected</h2>
        <p class="text-apex-light/60">Select a tournament to begin visualization</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-enter-active,
.card-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.card-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(1.05);
}

.card-enter-to,
.card-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>