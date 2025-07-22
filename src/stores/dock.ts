import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type VisualizationType = 'race-chart' | 'damage-analysis' | 'scatter-plot'

export const useDockStore = defineStore('dock', () => {
  // State
  const isVisible = ref(false)
  const isExpanded = ref(false)
  const currentVisualization = ref<VisualizationType>('race-chart')
  const isAnimating = ref(false)
  const playbackState = ref<'playing' | 'paused'>('paused')
  const currentGameIndex = ref(0)
  const playbackSpeed = ref(1)

  // Timeline state
  const timelinePosition = ref(0) // 0-100 percentage
  const isTimelineScrubbing = ref(false)

  // Team filtering
  const teamDisplayLimit = ref<number | null>(null) // null = show all, 5/15 = top N
  const selectedTeams = ref<string[]>([])

  // Getters
  const dockPosition = computed(() => {
    // Calculate optimal dock position based on current visualization
    return {
      bottom: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
    }
  })

  const availableVisualizations = computed(() => [
    { id: 'race-chart', name: 'Race Chart', icon: '📊' },
    { id: 'damage-analysis', name: 'Damage Analysis', icon: '⚔️' },
    { id: 'scatter-plot', name: 'Scatter Plot', icon: '📈' },
  ])

  // Actions
  const showDock = () => {
    isVisible.value = true
  }

  const hideDock = () => {
    isVisible.value = false
    isExpanded.value = false
  }

  const toggleExpansion = () => {
    isExpanded.value = !isExpanded.value
  }

  const switchVisualization = async (type: VisualizationType) => {
    if (isAnimating.value || type === currentVisualization.value) return

    isAnimating.value = true
    
    // Card lift animation will be handled by components
    await new Promise(resolve => setTimeout(resolve, 400))
    
    currentVisualization.value = type
    
    // Card unveil animation will be handled by components
    await new Promise(resolve => setTimeout(resolve, 500))
    
    isAnimating.value = false
  }

  const togglePlayback = () => {
    playbackState.value = playbackState.value === 'playing' ? 'paused' : 'playing'
  }

  const setPlaybackSpeed = (speed: number) => {
    playbackSpeed.value = Math.max(0.25, Math.min(4, speed))
  }

  const updateTimelinePosition = (position: number) => {
    timelinePosition.value = Math.max(0, Math.min(100, position))
  }

  const startTimelineScrubbing = () => {
    isTimelineScrubbing.value = true
    playbackState.value = 'paused'
  }

  const stopTimelineScrubbing = () => {
    isTimelineScrubbing.value = false
  }

  const setCurrentGameIndex = (index: number) => {
    currentGameIndex.value = Math.max(0, index)
  }

  const setTeamDisplayLimit = (limit: number | null) => {
    teamDisplayLimit.value = limit
  }

  const toggleTeamSelection = (teamId: string) => {
    const index = selectedTeams.value.indexOf(teamId)
    if (index > -1) {
      selectedTeams.value.splice(index, 1)
    } else {
      selectedTeams.value.push(teamId)
    }
  }

  const clearTeamSelection = () => {
    selectedTeams.value = []
  }

  return {
    // State
    isVisible,
    isExpanded,
    currentVisualization,
    isAnimating,
    playbackState,
    currentGameIndex,
    playbackSpeed,
    timelinePosition,
    isTimelineScrubbing,
    teamDisplayLimit,
    selectedTeams,
    // Getters
    dockPosition,
    availableVisualizations,
    // Actions
    showDock,
    hideDock,
    toggleExpansion,
    switchVisualization,
    togglePlayback,
    setPlaybackSpeed,
    updateTimelinePosition,
    startTimelineScrubbing,
    stopTimelineScrubbing,
    setCurrentGameIndex,
    setTeamDisplayLimit,
    toggleTeamSelection,
    clearTeamSelection,
  }
})