<script setup lang="ts">
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import ThemeSelector from '@/components/ui/ThemeSelector.vue'
defineOptions({ name: 'DashboardPage' })
</script>
<template>
  <DashboardLayout>
    <header class="context-header"><div><p class="muted">Tournaments</p><h1>Tournament analysis</h1><p class="muted">Explore standings as each game unfolds.</p></div><ThemeSelector /></header>
    <section class="welcome"><h2>Choose a tournament</h2><p>The existing EWC workspace uses generated sample data. No tournament provider is connected.</p><RouterLink class="primary-link" to="/tournament/ewc-2025">Explore EWC 2025 sample →</RouterLink><p>To analyze your own data, open the workspace and import tournament JSON.</p></section>
  </DashboardLayout>
</template>
