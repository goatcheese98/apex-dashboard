<script setup lang="ts">
import { computed } from 'vue'
import { useStandings } from '@/composables/standings'
const { rows, dock } = useStandings()
function playerTotal(team: { players: { damage: number }[] }) { return team.players.reduce((sum,p) => sum+p.damage, 0) }
const max = computed(() => Math.max(1, ...rows.value.flatMap(t => [t.damage, t.damageTaken, t.players.reduce((sum,p) => sum+p.damage, 0)])))
</script>
<template>
  <section aria-label="Damage analysis" class="damage-rows">
    <p class="muted">Solid: damage given · Outlined: damage taken. Both scales start at zero.</p>
    <article v-for="team in rows" :key="team.id" class="damage-team">
      <h2>{{ team.name }}</h2>
      <div class="damage-line"><span>Given</span><div class="bar-track" aria-hidden="true"><div class="race-bar" :style="{ width: `${team.damage / max * 100}%` }" /></div><span class="number">{{ team.damage.toLocaleString() }}</span></div>
      <div class="damage-line"><span>Taken</span><div class="bar-track" aria-hidden="true"><div class="taken-bar" :style="{ width: `${team.damageTaken / max * 100}%` }" /></div><span class="number">{{ team.damageTaken.toLocaleString() }}</span></div>
      <div v-if="dock.playerBreakdown" class="damage-line"><span>Players</span><div class="bar-track player-stack" aria-hidden="true" :style="{ width: `${playerTotal(team) / max * 100}%` }"><span v-for="(player, index) in team.players" :key="player.id" :style="{ flex: player.damage, background: index % 2 ? 'var(--mut)' : 'var(--fg)' }" /></div><span class="number">{{ playerTotal(team).toLocaleString() }}</span></div>
      <p v-if="dock.playerBreakdown && playerTotal(team) !== team.damage" class="muted">Player sum differs from the supplied team total.</p>
      <ul v-if="dock.playerBreakdown" class="player-list" aria-label="Player damage breakdown">
        <li v-for="player in team.players" :key="player.id">{{ player.name }} <span class="number">Given {{ player.damage.toLocaleString() }} / Taken {{ player.damageTaken.toLocaleString() }}</span></li>
      </ul>
    </article>
  </section>
</template>
