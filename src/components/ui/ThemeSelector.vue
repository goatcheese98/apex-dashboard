<template>
  <div class="theme-selector">
    <!-- Mobile/Compact Theme Toggle Button -->
    <div class="sm:hidden">
      <button 
        class="btn btn-circle btn-outline" 
        @click="themeStore.cycleTheme()"
        :class="{ 'loading': themeStore.isTransitioning }"
        :title="`Current: ${themeStore.theme.displayName}`"
      >
        <Icon :name="currentThemeIcon" class="w-5 h-5" />
      </button>
    </div>

    <!-- Desktop Theme Selector -->
    <div class="hidden sm:flex items-center gap-2">
      <span class="text-sm font-medium opacity-70">Theme:</span>
      <div class="flex bg-base-200 rounded-lg p-1 gap-1">
        <button
          v-for="theme in themeStore.availableThemes"
          :key="theme.name"
          @click="themeStore.setTheme(theme.name)"
          class="btn btn-sm"
          :class="{
            'btn-primary': themeStore.currentTheme === theme.name,
            'btn-ghost': themeStore.currentTheme !== theme.name,
            'loading': themeStore.isTransitioning && themeStore.currentTheme === theme.name
          }"
          :disabled="themeStore.isTransitioning"
        >
          {{ theme.displayName }}
        </button>
      </div>
    </div>

    <!-- Theme Preview Cards (Optional, for larger screens) -->
    <div v-if="showPreviews" class="hidden lg:flex gap-4 mt-4">
      <div
        v-for="theme in themeStore.availableThemes"
        :key="`preview-${theme.name}`"
        class="theme-preview-card"
        :class="{ 'active': themeStore.currentTheme === theme.name }"
        @click="themeStore.setTheme(theme.name)"
      >
        <div class="preview-colors" :style="getPreviewStyle(theme)">
          <div class="color-dot primary"></div>
          <div class="color-dot secondary"></div>
          <div class="color-dot accent"></div>
        </div>
        <span class="text-xs mt-2">{{ theme.displayName }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore, type ThemeDefinition } from '@/stores/theme'

interface Props {
  showPreviews?: boolean
}

defineProps<Props>()

const themeStore = useThemeStore()

const currentThemeIcon = computed(() => {
  switch (themeStore.currentTheme) {
    case 'light': return 'sun'
    case 'dark': return 'moon'
    case 'apex': return 'gaming'
    default: return 'palette'
  }
})

const getPreviewStyle = (theme: ThemeDefinition) => {
  return {
    '--preview-primary': theme.colors.primary,
    '--preview-secondary': theme.colors.secondary,
    '--preview-accent': theme.colors.accent,
    '--preview-base': theme.colors['base-100'],
  }
}
</script>

<style scoped>
.theme-selector {
  @apply flex items-center justify-center;
}

.theme-preview-card {
  @apply flex flex-col items-center justify-center p-3 rounded-lg border-2 border-transparent cursor-pointer transition-all duration-200;
  @apply hover:scale-105;
  background: var(--preview-base);
  border-color: transparent;
}

.theme-preview-card:hover {
  border-color: hsl(var(--primary) / 0.3);
}

.theme-preview-card.active {
  border-color: hsl(var(--primary));
  box-shadow: 0 0 0 2px hsl(var(--primary) / 0.2);
  transform: scale(1.05);
}

.preview-colors {
  @apply flex gap-1;
}

.color-dot {
  @apply w-3 h-3 rounded-full;
}

.color-dot.primary {
  background-color: var(--preview-primary);
}

.color-dot.secondary {
  background-color: var(--preview-secondary);
}

.color-dot.accent {
  background-color: var(--preview-accent);
}

/* Add smooth transitions for theme switching */
:global(*) {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
}

:global(.theme-selector *) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}
</style>