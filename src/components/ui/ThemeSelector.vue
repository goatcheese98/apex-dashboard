<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
defineProps<{ showPreviews?: boolean }>()
const themeStore = useThemeStore()
</script>
<template>
  <label class="appearance">Appearance
    <select aria-label="Appearance" v-model="themeStore.currentTheme" @change="themeStore.setTheme(themeStore.currentTheme)">
      <option v-for="theme in themeStore.availableThemes" :key="theme.name" :value="theme.name">{{ theme.displayName }}</option>
    </select>
  </label>
</template>
