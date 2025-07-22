<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useDockStore } from '@/stores/dock'
import { useTournamentStore } from '@/stores/tournament'
import TimelineControls from './TimelineControls.vue'
import VisualizationSwitcher from './VisualizationSwitcher.vue'
import FilterControls from './FilterControls.vue'

interface Props {
  tournamentId: string
}

defineProps<Props>()

defineOptions({
  name: 'FloatingDock'
})

const dockStore = useDockStore()
const tournamentStore = useTournamentStore()

const dockClasses = computed(() => [
  'floating-dock',
  'fixed z-50 transition-all duration-300 ease-out',
  'bg-apex-dark/40 backdrop-blur-xl',
  'border border-apex-orange/20 rounded-2xl',
  'shadow-2xl shadow-apex-orange/10',
  'gpu-accelerated',
  {
    'opacity-0 translate-y-4 pointer-events-none': !dockStore.isVisible,
    'opacity-100 translate-y-0': dockStore.isVisible,
    'animate-dock-expand': dockStore.isExpanded,
    'animate-dock-contract': !dockStore.isExpanded && dockStore.isVisible,
  }
])

const dockStyle = computed(() => ({
  ...dockStore.dockPosition,
  minWidth: dockStore.isExpanded ? '600px' : '400px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}))

// Show dock when tournament data is loaded
onMounted(() => {
  if (tournamentStore.currentTournament) {
    dockStore.showDock()
  }
})

// Cleanup
onUnmounted(() => {
  dockStore.hideDock()
})
</script>

<template>
  <div 
    :class="dockClasses" 
    :style="dockStyle"
  >
    <div class="p-4 space-y-4">
      <!-- Main controls row -->
      <div class="flex items-center justify-between">
        <!-- Visualization switcher -->
        <VisualizationSwitcher />
        
        <!-- Expansion toggle -->
        <button
          @click="dockStore.toggleExpansion()"
          class="p-2 rounded-lg bg-apex-orange/10 hover:bg-apex-orange/20 transition-colors"
          :class="{ 'rotate-180': dockStore.isExpanded }"
        >
          <svg class="w-4 h-4 text-apex-orange transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      <!-- Timeline controls -->
      <TimelineControls />
      
      <!-- Expanded controls -->
      <div 
        class="transition-all duration-300 ease-out overflow-hidden"
        :class="{
          'max-h-0 opacity-0': !dockStore.isExpanded,
          'max-h-96 opacity-100': dockStore.isExpanded
        }"
      >
        <FilterControls />
      </div>
    </div>
  </div>
</template>