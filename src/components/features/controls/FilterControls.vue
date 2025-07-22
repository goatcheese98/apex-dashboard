<script setup lang="ts">
import { computed } from 'vue'
import { useTournamentStore } from '@/stores/tournament'
import { useDockStore } from '@/stores/dock'

defineOptions({
  name: 'FilterControls'
})

const tournamentStore = useTournamentStore()
const dockStore = useDockStore()

const allGames = computed(() => 
  Array.from({ length: tournamentStore.currentTournament?.totalGames || 10 }, (_, i) => i + 1)
)

const teamDisplayOptions = [
  { value: null, label: 'All Teams' },
  { value: 15, label: 'Top 15' },
  { value: 5, label: 'Top 5' },
]
</script>

<template>
  <div class="space-y-4 pt-4 border-t border-apex-orange/10">
    <!-- Game selection filters -->
    <div>
      <h3 class="text-sm font-medium text-apex-light mb-3">Game Selection</h3>
      
      <div class="flex flex-wrap gap-2 mb-3">
        <button
          v-for="game in allGames"
          :key="game"
          @click="tournamentStore.toggleGameFilter(game)"
          class="px-3 py-1 rounded-full text-xs font-medium transition-colors"
          :class="{
            'bg-apex-blue text-white': tournamentStore.selectedGames.length === 0 || tournamentStore.selectedGames.includes(game),
            'bg-apex-dark/30 text-apex-light/60 hover:bg-apex-dark/50': tournamentStore.selectedGames.length > 0 && !tournamentStore.selectedGames.includes(game)
          }"
        >
          {{ game }}
        </button>
      </div>
      
      <div class="flex items-center space-x-2">
        <button
          @click="tournamentStore.clearFilters()"
          class="text-xs text-apex-orange hover:text-apex-orange/80 transition-colors"
        >
          Show All Games
        </button>
        
        <span class="text-apex-light/40">|</span>
        
        <button
          @click="tournamentStore.setGameFilters([3, 5, 7])"
          class="text-xs text-apex-light/60 hover:text-apex-light/80 transition-colors"
        >
          Quick: 3, 5, 7
        </button>
      </div>
    </div>
    
    <!-- Team display limit -->
    <div>
      <h3 class="text-sm font-medium text-apex-light mb-3">Team Display</h3>
      
      <div class="flex items-center space-x-3">
        <button
          v-for="option in teamDisplayOptions"
          :key="option.value"
          @click="dockStore.setTeamDisplayLimit(option.value)"
          class="px-3 py-1 rounded-lg text-xs font-medium transition-colors"
          :class="{
            'bg-apex-purple text-white': dockStore.teamDisplayLimit === option.value,
            'bg-apex-dark/30 text-apex-light/60 hover:bg-apex-dark/50': dockStore.teamDisplayLimit !== option.value
          }"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
    
    <!-- Selected games indicator -->
    <div v-if="tournamentStore.selectedGames.length > 0" class="text-xs text-apex-light/60">
      Showing {{ tournamentStore.selectedGames.length }} selected games:
      {{ tournamentStore.selectedGames.sort((a, b) => a - b).join(', ') }}
    </div>
  </div>
</template>