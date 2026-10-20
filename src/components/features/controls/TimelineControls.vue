<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useTournamentStore } from '@/stores/tournament'
import { useDockStore } from '@/stores/dock'
const tournament = useTournamentStore(), dock = useDockStore()
const reduced = ref(false)
const max = computed(() => tournament.currentTournament?.totalGames ?? 0)
const disabled = computed(() => !tournament.currentTournament?.games.length || tournament.isLoading)
let timer: ReturnType<typeof setInterval> | undefined
let media: MediaQueryList | undefined
function pause() { dock.playbackState = 'paused'; clearInterval(timer); timer = undefined }
function scrub(event: Event) {
  pause()
  dock.setCurrentGameIndex(Math.min(max.value, Number((event.target as HTMLInputElement).value)))
  dock.updateTimelinePosition(max.value ? dock.currentGameIndex / max.value * 100 : 0)
}
function play() {
  if (dock.playbackState === 'playing') return pause()
  if (disabled.value || reduced.value) return
  if (dock.currentGameIndex >= max.value) dock.currentGameIndex = 0
  dock.playbackState = 'playing'
  timer = setInterval(() => {
    dock.setCurrentGameIndex(Math.min(max.value, dock.currentGameIndex + 1))
    dock.updateTimelinePosition(max.value ? dock.currentGameIndex / max.value * 100 : 0)
    if (dock.currentGameIndex >= max.value) pause()
  }, 1200)
}
function motion() { reduced.value = media?.matches ?? false; if (reduced.value) pause() }
watch(() => tournament.currentTournament, () => { pause(); dock.currentGameIndex = 0; dock.timelinePosition = 0 }, { immediate: true })
watch(() => tournament.isLoading, pause)
onMounted(() => { media = window.matchMedia('(prefers-reduced-motion: reduce)'); motion(); media.addEventListener('change', motion) })
onBeforeUnmount(() => { pause(); media?.removeEventListener('change', motion) })
</script>
<template>
  <section class="timeline-dock" aria-label="Tournament timeline">
    <button class="play-button" :disabled="disabled || reduced" @click="play">{{ dock.playbackState === 'playing' ? 'Pause' : 'Play' }}</button>
    <output class="game-label" aria-live="polite">Game {{ dock.currentGameIndex }} / {{ max }}</output>
    <input aria-label="Current game" type="range" min="0" :max="max" step="1" :value="dock.currentGameIndex" :disabled="disabled" :aria-valuetext="`Game ${dock.currentGameIndex} of ${max}`" @input="scrub" />
    <label>Calculation<select aria-label="Calculation" v-model="dock.cumulative" :disabled="disabled" @change="pause"><option :value="true">Cumulative</option><option :value="false">Individual</option></select></label>
    <p class="muted dock-note">{{ reduced ? 'Reduced motion: use the game slider. Playback is disabled.' : 'Playback stays under your control. Scrubbing pauses playback.' }}</p>
  </section>
</template>
