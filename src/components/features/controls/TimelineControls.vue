<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useDockStore } from '@/stores/dock'
import { useTournamentStore } from '@/stores/tournament'

defineOptions({
  name: 'TimelineControls'
})

const dockStore = useDockStore()
const tournamentStore = useTournamentStore()

const sliderRef = ref<HTMLElement>()
const isDragging = ref(false)

const totalGames = computed(() => tournamentStore.currentTournament?.totalGames || 10)
const currentGame = computed(() => Math.floor((dockStore.timelinePosition / 100) * totalGames.value) + 1)

const playIcon = computed(() => 
  dockStore.playbackState === 'playing' ? '⏸️' : '▶️'
)

// Auto-play functionality
let playbackInterval: number | null = null

const startAutoPlay = () => {
  if (playbackInterval) return
  
  playbackInterval = setInterval(() => {
    const increment = (1 / totalGames.value) * 100 * dockStore.playbackSpeed
    const newPosition = dockStore.timelinePosition + increment
    
    if (newPosition >= 100) {
      dockStore.updateTimelinePosition(100)
      dockStore.togglePlayback() // Pause at end
    } else {
      dockStore.updateTimelinePosition(newPosition)
    }
  }, 100) // 100ms intervals for smooth animation
}

const stopAutoPlay = () => {
  if (playbackInterval) {
    clearInterval(playbackInterval)
    playbackInterval = null
  }
}

// Watch playback state
watch(() => dockStore.playbackState, (state) => {
  if (state === 'playing') {
    startAutoPlay()
  } else {
    stopAutoPlay()
  }
}, { immediate: true })

// Timeline scrubbing
const handleSliderMouseDown = (event: MouseEvent) => {
  if (!sliderRef.value) return
  
  isDragging.value = true
  dockStore.startTimelineScrubbing()
  updateSliderPosition(event)
  
  document.addEventListener('mousemove', handleSliderMouseMove)
  document.addEventListener('mouseup', handleSliderMouseUp)
}

const handleSliderMouseMove = (event: MouseEvent) => {
  if (!isDragging.value) return
  updateSliderPosition(event)
}

const handleSliderMouseUp = () => {
  isDragging.value = false
  dockStore.stopTimelineScrubbing()
  
  document.removeEventListener('mousemove', handleSliderMouseMove)
  document.removeEventListener('mouseup', handleSliderMouseUp)
}

const updateSliderPosition = (event: MouseEvent) => {
  if (!sliderRef.value) return
  
  const rect = sliderRef.value.getBoundingClientRect()
  const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width))
  const percentage = (x / rect.width) * 100
  
  dockStore.updateTimelinePosition(percentage)
}

// Keyboard shortcuts
const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.code) {
    case 'Space':
      event.preventDefault()
      dockStore.togglePlayback()
      break
    case 'ArrowLeft':
      event.preventDefault()
      const prevPosition = Math.max(0, dockStore.timelinePosition - (100 / totalGames.value))
      dockStore.updateTimelinePosition(prevPosition)
      break
    case 'ArrowRight':
      event.preventDefault()
      const nextPosition = Math.min(100, dockStore.timelinePosition + (100 / totalGames.value))
      dockStore.updateTimelinePosition(nextPosition)
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  stopAutoPlay()
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('mousemove', handleSliderMouseMove)
  document.removeEventListener('mouseup', handleSliderMouseUp)
})
</script>

<template>
  <div class="flex items-center space-x-4">
    <!-- Play/Pause button -->
    <button
      @click="dockStore.togglePlayback()"
      class="flex items-center justify-center w-10 h-10 rounded-full bg-apex-orange hover:bg-apex-orange/80 transition-colors text-white font-bold"
      :class="{ 'animate-pulse': dockStore.playbackState === 'playing' }"
    >
      {{ playIcon }}
    </button>
    
    <!-- Timeline slider -->
    <div class="flex-1 px-2">
      <div class="relative">
        <!-- Slider track -->
        <div
          ref="sliderRef"
          class="h-2 bg-apex-dark/50 rounded-full cursor-pointer relative overflow-hidden"
          @mousedown="handleSliderMouseDown"
        >
          <!-- Progress fill -->
          <div
            class="absolute top-0 left-0 h-full bg-gradient-to-r from-apex-orange to-apex-blue rounded-full transition-all duration-100"
            :style="{ width: `${dockStore.timelinePosition}%` }"
          />
          
          <!-- Game markers -->
          <div class="absolute top-0 left-0 w-full h-full">
            <div
              v-for="game in totalGames"
              :key="game"
              class="absolute top-0 w-0.5 h-full bg-apex-light/20"
              :style="{ left: `${((game - 1) / (totalGames - 1)) * 100}%` }"
            />
          </div>
          
          <!-- Slider thumb -->
          <div
            class="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg cursor-grab active:cursor-grabbing transition-transform"
            :class="{ 'scale-125': isDragging }"
            :style="{ left: `calc(${dockStore.timelinePosition}% - 8px)` }"
          />
        </div>
        
        <!-- Game indicator -->
        <div class="flex justify-between items-center mt-2 text-xs text-apex-light/60">
          <span>Game {{ Math.max(1, currentGame) }}</span>
          <span>{{ totalGames }} Total</span>
        </div>
      </div>
    </div>
    
    <!-- Speed control -->
    <div class="flex items-center space-x-1 text-sm">
      <button
        v-for="speed in [0.5, 1, 2, 4]"
        :key="speed"
        @click="dockStore.setPlaybackSpeed(speed)"
        class="px-2 py-1 rounded text-xs transition-colors"
        :class="{
          'bg-apex-blue text-white': dockStore.playbackSpeed === speed,
          'text-apex-light/60 hover:text-apex-blue': dockStore.playbackSpeed !== speed
        }"
      >
        {{ speed }}×
      </button>
    </div>
  </div>
</template>