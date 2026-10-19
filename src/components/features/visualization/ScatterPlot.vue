<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStandings } from '@/composables/standings'
const { rows, dock } = useStandings()
const selected = ref<string | null>(null)
// Player IDs are team-scoped; tuple encoding also keeps delimiters inside IDs unambiguous.
const points = computed(() => rows.value.flatMap(t => t.players.map((p, index) => ({ ...p, key: JSON.stringify([t.id, p.id]), teamId: t.id, teamName: t.name, color: t.color, index }))))
const maxX = computed(() => Math.max(1, ...points.value.map(p => p.kills)))
const maxY = computed(() => Math.max(1, ...points.value.map(p => p.damage)))
function x(kills: number) { return 60 + kills / maxX.value * 670 }
function y(damage: number) { return 330 - damage / maxY.value * 290 }
const triangle = computed(() => points.value.filter(p => p.teamId === selected.value).map(p => `${x(p.kills)},${y(p.damage)}`).join(' '))
</script>
<template>
  <section aria-label="Kills and damage scatter plot">
    <p class="muted">Player kills (horizontal) × damage given (vertical). Select a player below to inspect teammates.</p>
    <svg viewBox="0 0 800 390" class="scatter" role="img" aria-label="Player kills versus damage; exact values in the player list below">
      <path d="M60 30V330H750" fill="none" stroke="var(--mut)" />
      <text x="40" y="350">0</text><text x="710" y="360">{{ maxX }} kills</text><text x="60" y="20">{{ maxY.toLocaleString() }} damage</text>
      <polygon v-if="dock.triangulation && triangle" :points="triangle" fill="var(--panel2)" stroke="var(--fg)" stroke-dasharray="6 4" />
      <g v-for="point in points" :key="point.key">
        <circle :cx="x(point.kills)" :cy="y(point.damage)" r="6" :fill="point.color" stroke="var(--fg)" @mouseenter="selected = point.teamId" @click="selected = point.teamId" />
        <text v-if="selected === point.teamId" :text-anchor="x(point.kills) > 500 ? 'end' : 'start'" :x="x(point.kills) + (x(point.kills) > 500 ? -9 : 9)" :y="y(point.damage) + (y(point.damage) < 70 ? 18 : -9)">{{ point.teamName }} / {{ point.index + 1 }}</text>
      </g>
    </svg>
    <ul class="player-list"><li v-for="point in points" :key="point.key"><button :aria-pressed="selected === point.teamId" @focus="selected = point.teamId" @mouseenter="selected = point.teamId" @click="selected = point.teamId">{{ point.teamName }} / {{ point.name }} · {{ point.kills }} kills · {{ point.damage.toLocaleString() }} damage</button></li></ul>
  </section>
</template>
