<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import VisualizationContainer from '@/components/features/visualization/VisualizationContainer.vue'
const route = useRoute()
const tournamentId = computed(() => String(route.params.tournamentId))
</script>
<template><DashboardLayout><VisualizationContainer :tournament-id="tournamentId" /></DashboardLayout></template>
