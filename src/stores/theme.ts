import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export type ThemeName = 'light' | 'dark'

export interface ThemeColors {
  primary: string
  'primary-content': string
  secondary: string
  'secondary-content': string
  accent: string
  'accent-content': string
  neutral: string
  'neutral-content': string
  'base-100': string
  'base-200': string
  'base-300': string
  'base-content': string
  info: string
  'info-content': string
  success: string
  'success-content': string
  warning: string
  'warning-content': string
  error: string
  'error-content': string
}

export interface ThemeDefinition {
  name: ThemeName
  displayName: string
  colors: ThemeColors
}

const themes: Record<ThemeName, ThemeDefinition> = {
  light: {
    name: 'light',
    displayName: '☀️ Light',
    colors: {
      primary: '#5B73DB',
      'primary-content': '#ffffff',
      secondary: '#E879F9',
      'secondary-content': '#ffffff',
      accent: '#10B981',
      'accent-content': '#ffffff',
      neutral: '#374151',
      'neutral-content': '#ffffff',
      'base-100': '#ffffff',
      'base-200': '#f8fafc',
      'base-300': '#e2e8f0',
      'base-content': '#1f2937',
      info: '#06b6d4',
      'info-content': '#ffffff',
      success: '#10b981',
      'success-content': '#ffffff',
      warning: '#f59e0b',
      'warning-content': '#ffffff',
      error: '#ef4444',
      'error-content': '#ffffff',
    }
  },
  dark: {
    name: 'dark',
    displayName: '🌙 Dark',
    colors: {
      primary: '#7C3AED',
      'primary-content': '#ffffff',
      secondary: '#F472B6',
      'secondary-content': '#ffffff',
      accent: '#34D399',
      'accent-content': '#000000',
      neutral: '#1F2937',
      'neutral-content': '#D1D5DB',
      'base-100': '#111827',
      'base-200': '#1F2937',
      'base-300': '#374151',
      'base-content': '#F9FAFB',
      info: '#22D3EE',
      'info-content': '#000000',
      success: '#34d399',
      'success-content': '#000000',
      warning: '#FBBF24',
      'warning-content': '#000000',
      error: '#F87171',
      'error-content': '#000000',
    }
  }
}

export const useThemeStore = defineStore('theme', () => {
  // State
  const currentTheme = ref<ThemeName>('light')
  const isTransitioning = ref(false)
  
  // Getters
  const theme = computed(() => themes[currentTheme.value])
  const availableThemes = computed(() => Object.values(themes))
  
  // Actions
  const setTheme = (themeName: ThemeName) => {
    if (currentTheme.value === themeName) return
    
    isTransitioning.value = true
    currentTheme.value = themeName
    applyTheme(themes[themeName])
    
    // Store in localStorage
    localStorage.setItem('theme', themeName)
    
    // Reset transition flag after animation
    setTimeout(() => {
      isTransitioning.value = false
    }, 300)
  }
  
  const applyTheme = (themeDefinition: ThemeDefinition) => {
    const root = document.documentElement
    
    // Clear any existing theme classes
    root.classList.remove('light', 'dark')
    
    // Apply DaisyUI color variables (convert hex to rgb values)
    Object.entries(themeDefinition.colors).forEach(([key, value]) => {
      // Convert hex to rgb for DaisyUI format
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        if (result) {
          return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
        }
        return hex // Return original if not hex format
      }
      
      root.style.setProperty(`--${key}`, hexToRgb(value))
    })
    
    // Set data-theme attribute for DaisyUI
    document.documentElement.setAttribute('data-theme', themeDefinition.name)
    
    // Add theme class to root for additional CSS targeting
    root.classList.add(themeDefinition.name)
    
    // Force a repaint to ensure styles are applied
    root.offsetHeight
  }
  
  const initializeTheme = () => {
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme') as ThemeName
    
    // Check for URL parameter
    const urlParams = new URLSearchParams(window.location.search)
    const urlTheme = urlParams.get('theme') as ThemeName
    
    // Priority: URL param > localStorage > default (light)
    const initialTheme = (urlTheme && themes[urlTheme]) ? urlTheme 
                      : (savedTheme && themes[savedTheme]) ? savedTheme 
                      : 'light'
    
    currentTheme.value = initialTheme
    applyTheme(themes[initialTheme])
  }
  
  const cycleTheme = () => {
    const themeOrder: ThemeName[] = ['light', 'dark']
    const currentIndex = themeOrder.indexOf(currentTheme.value)
    const nextIndex = (currentIndex + 1) % themeOrder.length
    setTheme(themeOrder[nextIndex])
  }
  
  // Watch for theme changes and apply them
  watch(() => currentTheme.value, (newTheme) => {
    applyTheme(themes[newTheme])
  })
  
  return {
    // State
    currentTheme,
    isTransitioning,
    // Getters
    theme,
    availableThemes,
    // Actions
    setTheme,
    initializeTheme,
    cycleTheme,
  }
})