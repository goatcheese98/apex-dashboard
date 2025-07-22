<script setup lang="ts">
import { useDockStore } from '@/stores/dock'

defineOptions({
  name: 'VisualizationSwitcher'
})

const dockStore = useDockStore()
</script>

<template>
  <div class="flex items-center space-x-2">
    <button
      v-for="viz in dockStore.availableVisualizations"
      :key="viz.id"
      @click="dockStore.switchVisualization(viz.id)"
      class="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
      :class="{
        'bg-apex-orange text-white shadow-lg shadow-apex-orange/20': dockStore.currentVisualization === viz.id,
        'bg-apex-dark/30 text-apex-light/80 hover:bg-apex-dark/50 hover:text-white': dockStore.currentVisualization !== viz.id
      }"
      :disabled="dockStore.isAnimating"
    >
      <span class="text-base">{{ viz.icon }}</span>
      <span>{{ viz.name }}</span>
    </button>
  </div>
</template>