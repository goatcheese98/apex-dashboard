<script setup lang="ts">
import { computed } from 'vue'
import { useStandings } from '@/composables/standings'
const { rows, dock } = useStandings()
const max = computed(() => Math.max(1, ...rows.value.map(t => t[dock.metric])))
</script>
<template>
  <ol class="race-rows" aria-label="Tournament standings">
    <li v-for="(team, index) in rows" :key="team.id" class="race-row">
      <span class="rank">{{ index + 1 }}</span><span class="team-label"><i :style="{ background: team.color }" />{{ team.name }}</span>
      <div class="bar-track" aria-hidden="true"><div class="race-bar" :style="{ width: `${team[dock.metric] / max * 100}%` }" /></div>
      <span class="number">{{ team[dock.metric].toLocaleString() }}<span class="sr-only"> {{ dock.metric }}</span></span>
    </li>
  </ol>
</template>
