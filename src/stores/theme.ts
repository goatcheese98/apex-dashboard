import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export type ThemeName = 'light' | 'dark' | 'apex'

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
  customProperties?: Record<string, string>
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
    },
    customProperties: {
      '--color-apex-orange': '#f59e0b',
      '--color-apex-blue': '#06b6d4',
      '--color-apex-red': '#ef4444',
      '--color-apex-purple': '#8b5cf6',
      '--color-apex-dark': '#1f2937',
      '--color-apex-light': '#ffffff',
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
    },
    customProperties: {
      '--color-apex-orange': '#FBBF24',
      '--color-apex-blue': '#22D3EE',
      '--color-apex-red': '#F87171',
      '--color-apex-purple': '#C084FC',
      '--color-apex-dark': '#111827',
      '--color-apex-light': '#F9FAFB',
    }
  },
  apex: {
    name: 'apex',
    displayName: '🎯 Apex Legends',
    colors: {
      primary: '#FF6D00',        // Vibrant gaming orange
      'primary-content': '#000000',
      secondary: '#00E5FF',      // Electric cyan blue
      'secondary-content': '#000000',
      accent: '#E040FB',         // Neon purple/magenta
      'accent-content': '#000000',
      neutral: '#0A0E13',        // Very dark gaming navy (like Battlefy)
      'neutral-content': '#E0E4E8',
      'base-100': '#0F1419',     // Deep gaming background
      'base-200': '#151B27',     // Battlefy-inspired dark navy
      'base-300': '#1F2937',     // Elevated gaming surface
      'base-content': '#F0F4F8',
      info: '#00E5FF',          // Electric cyan
      'info-content': '#000000',
      success: '#00FF41',       // Gaming green (Matrix-like)
      'success-content': '#000000',
      warning: '#FFAB00',       // Gaming amber
      'warning-content': '#000000',
      error: '#FF1744',         // Gaming red (danger)
      'error-content': '#ffffff',
    },
    customProperties: {
      '--color-apex-orange': '#FF6D00',
      '--color-apex-blue': '#00E5FF',
      '--color-apex-red': '#FF1744',
      '--color-apex-purple': '#E040FB',
      '--color-apex-green': '#00FF41',
      '--color-apex-dark': '#0F1419',
      '--color-apex-light': '#F0F4F8',
      '--color-gaming-navy': '#151B27',
      '--color-gaming-surface': '#1F2937',
      '--glow-primary': '0 0 20px #FF6D00',
      '--glow-secondary': '0 0 20px #00E5FF',
      '--glow-accent': '0 0 20px #E040FB',
      '--gaming-gradient': 'linear-gradient(135deg, #FF6D00 0%, #00E5FF 50%, #E040FB 100%)',
      '--gaming-dark-gradient': 'linear-gradient(180deg, #0F1419 0%, #151B27 100%)',
    }
  }
}

export const useThemeStore = defineStore('theme', () => {
  // State
  const currentTheme = ref<ThemeName>('apex')
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
    localStorage.setItem('apex-dashboard-theme', themeName)
    
    // Reset transition flag after animation
    setTimeout(() => {
      isTransitioning.value = false
    }, 300)
  }
  
  const applyTheme = (themeDefinition: ThemeDefinition) => {
    const root = document.documentElement
    
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
    
    // Apply custom properties
    if (themeDefinition.customProperties) {
      Object.entries(themeDefinition.customProperties).forEach(([key, value]) => {
        root.style.setProperty(key, value)
      })
    }
    
    // Set data-theme attribute for DaisyUI
    document.documentElement.setAttribute('data-theme', themeDefinition.name)
  }
  
  const initializeTheme = () => {
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('apex-dashboard-theme') as ThemeName
    
    // Check for URL parameter
    const urlParams = new URLSearchParams(window.location.search)
    const urlTheme = urlParams.get('theme') as ThemeName
    
    // Priority: URL param > localStorage > default (apex)
    const initialTheme = (urlTheme && themes[urlTheme]) ? urlTheme 
                      : (savedTheme && themes[savedTheme]) ? savedTheme 
                      : 'apex'
    
    currentTheme.value = initialTheme
    applyTheme(themes[initialTheme])
  }
  
  const cycleTheme = () => {
    const themeOrder: ThemeName[] = ['light', 'dark', 'apex']
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