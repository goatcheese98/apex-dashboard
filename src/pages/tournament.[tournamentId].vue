<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import VisualizationContainer from '@/components/features/visualization/VisualizationContainer.vue'
import FloatingDock from '@/components/features/controls/FloatingDock.vue'

defineOptions({
  name: 'TournamentPage'
})

const route = useRoute()
const tournamentId = computed(() => route.params.tournamentId as string)
</script>

<template>
  <DashboardLayout>
    <!-- Main visualization area -->
    <div class="relative min-h-screen">
      <VisualizationContainer :tournament-id="tournamentId" />
      
      <!-- Floating dock controls -->
      <FloatingDock :tournament-id="tournamentId" />
    </div>
  </DashboardLayout>
</template>