import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type ThemeName = 'system' | 'light' | 'dark'
export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<ThemeName>('system')
  const availableThemes = [{ name: 'system', displayName: 'System' }, { name: 'light', displayName: 'Light' }, { name: 'dark', displayName: 'Dark' }] as const
  const theme = computed(() => availableThemes.find(t => t.name === currentTheme.value)!)
  const isTransitioning = ref(false)
  let media: MediaQueryList | undefined
  function applyTheme() {
    document.documentElement.dataset.theme = currentTheme.value === 'system' ? (media?.matches ? 'dark' : 'light') : currentTheme.value
  }
  function setTheme(value: ThemeName) {
    currentTheme.value = value
    applyTheme()
    try { localStorage.setItem('theme', value) } catch { /* Storage may be disabled. */ }
  }
  function initializeTheme() {
    media = window.matchMedia('(prefers-color-scheme: dark)')
    let saved: string | null = null
    try { saved = localStorage.getItem('theme') } catch { /* Use system theme. */ }
    const requested = new URLSearchParams(window.location.search).get('theme') ?? saved
    if (requested === 'light' || requested === 'dark' || requested === 'system') currentTheme.value = requested
    media.addEventListener('change', applyTheme)
    applyTheme()
  }
  function cycleTheme() { setTheme(currentTheme.value === 'light' ? 'dark' : 'light') }
  return { currentTheme, availableThemes, theme, isTransitioning, setTheme, initializeTheme, cycleTheme }
})
