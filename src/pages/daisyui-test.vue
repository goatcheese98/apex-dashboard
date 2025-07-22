<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import ThemeSelector from '@/components/ui/ThemeSelector.vue'

defineOptions({
  name: 'DaisyUITestPage'
})

const themeStore = useThemeStore()


// Button Testing Controls State
const buttonTestState = ref({
  // Visual Effects
  glow: {
    enabled: false,
    intensity: 50,
    color: '#ff6600',
    animated: false
  },
  transform: {
    scale: 100,
    rotate: 0,
    skewX: 0,
    skewY: 0,
    perspective: false
  },
  // Animations
  transition: {
    duration: 300,
    timing: 'ease',
    enabled: true
  },
  hoverEffect: 'none', // 'bounce', 'shake', 'wobble', 'pulse', etc.
  // Styling
  background: {
    type: 'solid', // 'solid', 'gradient'
    color: '#ff6600',
    gradientStart: '#ff6600',
    gradientEnd: '#00d4ff',
    gradientDirection: 'to-r'
  },
  typography: {
    weight: 500,
    size: '1rem',
    spacing: 0,
    transform: 'none'
  },
  // Layout
  size: {
    width: 'auto',
    height: 'auto',
    padding: 16
  },
  border: {
    radius: 8,
    width: 1,
    style: 'solid',
    color: 'transparent'
  },
  // Advanced Effects
  backdrop: {
    blur: 0,
    brightness: 100,
    contrast: 100
  },
  shadow: {
    enabled: false,
    x: 0,
    y: 4,
    blur: 15,
    spread: 0,
    color: 'rgba(0,0,0,0.2)'
  }
})

const activeTab = ref('effects')

// Computed styles for test button
const testButtonStyles = computed(() => {
  const styles: Record<string, any> = {
    transition: buttonTestState.value.transition.enabled 
      ? `all ${buttonTestState.value.transition.duration}ms ${buttonTestState.value.transition.timing}` 
      : 'none',
    transform: `
      scale(${buttonTestState.value.transform.scale / 100}) 
      rotate(${buttonTestState.value.transform.rotate}deg)
      skewX(${buttonTestState.value.transform.skewX}deg)
      skewY(${buttonTestState.value.transform.skewY}deg)
    `.replace(/\s+/g, ' ').trim(),
    fontWeight: buttonTestState.value.typography.weight.toString(),
    fontSize: buttonTestState.value.typography.size,
    letterSpacing: `${buttonTestState.value.typography.spacing}px`,
    textTransform: buttonTestState.value.typography.transform,
    borderRadius: `${buttonTestState.value.border.radius}px`,
    borderWidth: `${buttonTestState.value.border.width}px`,
    borderStyle: buttonTestState.value.border.style,
    borderColor: buttonTestState.value.border.color,
    padding: `${buttonTestState.value.size.padding}px`
  }

  // Background
  if (buttonTestState.value.background.type === 'gradient') {
    styles.background = `linear-gradient(${buttonTestState.value.background.gradientDirection}, ${buttonTestState.value.background.gradientStart}, ${buttonTestState.value.background.gradientEnd})`
  } else if (buttonTestState.value.background.type === 'solid') {
    styles.backgroundColor = buttonTestState.value.background.color
  }

  // Glow effect
  if (buttonTestState.value.glow.enabled) {
    const intensity = buttonTestState.value.glow.intensity / 100
    styles.boxShadow = `0 4px ${15 * intensity}px ${buttonTestState.value.glow.color}${Math.round(0.3 * intensity * 255).toString(16).padStart(2, '0')}`
    
    if (buttonTestState.value.glow.animated) {
      styles.animation = 'glow-pulse 2s ease-in-out infinite alternate'
    }
  }

  // Custom shadow
  if (buttonTestState.value.shadow.enabled) {
    styles.boxShadow = `${buttonTestState.value.shadow.x}px ${buttonTestState.value.shadow.y}px ${buttonTestState.value.shadow.blur}px ${buttonTestState.value.shadow.spread}px ${buttonTestState.value.shadow.color}`
  }

  // Backdrop effects
  if (buttonTestState.value.backdrop.blur > 0 || buttonTestState.value.backdrop.brightness !== 100 || buttonTestState.value.backdrop.contrast !== 100) {
    styles.backdropFilter = `blur(${buttonTestState.value.backdrop.blur}px) brightness(${buttonTestState.value.backdrop.brightness}%) contrast(${buttonTestState.value.backdrop.contrast}%)`
  }

  return styles
})

// Generate Tailwind classes
const generateTailwindCode = () => {
  const classes = ['btn', 'btn-primary']
  
  if (buttonTestState.value.transition.enabled) {
    classes.push(`transition-all duration-${buttonTestState.value.transition.duration}`)
  }
  
  if (buttonTestState.value.transform.scale !== 100) {
    classes.push(`hover:scale-${buttonTestState.value.transform.scale}`)
  }
  
  if (buttonTestState.value.transform.rotate !== 0) {
    classes.push(`hover:rotate-${buttonTestState.value.transform.rotate}`)
  }
  
  return classes.join(' ')
}

// Generate CSS code
const generateCSSCode = () => {
  return `.custom-button {
${Object.entries(testButtonStyles.value)
  .map(([key, value]) => `  ${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
  .join('\n')}
}`
}

// Copy to clipboard function
const copyToClipboard = async (text: string) => {
  try {
    if (navigator && navigator.clipboard) {
      await navigator.clipboard.writeText(text)
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

// Preset system
const presets = ref([
  {
    id: 'standard',
    name: '🎯 Standard DaisyUI',
    description: 'Clean, standard DaisyUI button styling',
    config: {
      glow: { enabled: false, intensity: 50, color: '#ff6600', animated: false },
      transform: { scale: 100, rotate: 0, skewX: 0, skewY: 0, perspective: false },
      transition: { duration: 300, timing: 'ease', enabled: true },
      hoverEffect: 'none',
      background: { type: 'solid', color: '#ff6600', gradientStart: '#ff6600', gradientEnd: '#00d4ff', gradientDirection: 'to-r' },
      typography: { weight: 500, size: '1rem', spacing: 0, transform: 'none' },
      size: { width: 'auto', height: 'auto', padding: 16 },
      border: { radius: 8, width: 1, style: 'solid', color: 'transparent' },
      backdrop: { blur: 0, brightness: 100, contrast: 100 },
      shadow: { enabled: false, x: 0, y: 4, blur: 15, spread: 0, color: 'rgba(0,0,0,0.2)' }
    }
  },
  {
    id: 'enhanced-tailwind',
    name: '✨ Enhanced Tailwind',
    description: 'Button with hover scale, rotation, and shadow effects',
    config: {
      glow: { enabled: false, intensity: 50, color: '#ff6600', animated: false },
      transform: { scale: 110, rotate: 1, skewX: 0, skewY: 0, perspective: false },
      transition: { duration: 300, timing: 'ease', enabled: true },
      hoverEffect: 'none',
      background: { type: 'solid', color: '#ff6600', gradientStart: '#ff6600', gradientEnd: '#00d4ff', gradientDirection: 'to-r' },
      typography: { weight: 500, size: '1rem', spacing: 0, transform: 'none' },
      size: { width: 'auto', height: 'auto', padding: 16 },
      border: { radius: 8, width: 1, style: 'solid', color: 'transparent' },
      backdrop: { blur: 0, brightness: 100, contrast: 100 },
      shadow: { enabled: true, x: 0, y: 4, blur: 25, spread: 0, color: 'rgba(0,0,0,0.3)' }
    }
  },
  {
    id: 'apex-glow',
    name: '🔥 Apex Glow',
    description: 'Custom glow effect with Apex orange theme',
    config: {
      glow: { enabled: true, intensity: 80, color: '#ff6600', animated: true },
      transform: { scale: 102, rotate: 0, skewX: 0, skewY: 0, perspective: false },
      transition: { duration: 300, timing: 'ease', enabled: true },
      hoverEffect: 'none',
      background: { type: 'solid', color: '#ff6600', gradientStart: '#ff6600', gradientEnd: '#00d4ff', gradientDirection: 'to-r' },
      typography: { weight: 500, size: '1rem', spacing: 0, transform: 'none' },
      size: { width: 'auto', height: 'auto', padding: 16 },
      border: { radius: 8, width: 1, style: 'solid', color: 'transparent' },
      backdrop: { blur: 0, brightness: 100, contrast: 100 },
      shadow: { enabled: true, x: 0, y: 8, blur: 25, spread: 0, color: 'rgba(255,102,0,0.5)' }
    }
  },
  {
    id: 'cyberpunk',
    name: '⚡ Cyberpunk',
    description: 'Futuristic button with neon gradient and effects',
    config: {
      glow: { enabled: true, intensity: 90, color: '#00d4ff', animated: true },
      transform: { scale: 105, rotate: 0, skewX: -2, skewY: 0, perspective: false },
      transition: { duration: 400, timing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', enabled: true },
      hoverEffect: 'none',
      background: { type: 'gradient', color: '#ff6600', gradientStart: '#9933ff', gradientEnd: '#00d4ff', gradientDirection: 'to-r' },
      typography: { weight: 700, size: '1rem', spacing: 1, transform: 'uppercase' },
      size: { width: 'auto', height: 'auto', padding: 20 },
      border: { radius: 0, width: 2, style: 'solid', color: '#00d4ff' },
      backdrop: { blur: 4, brightness: 110, contrast: 120 },
      shadow: { enabled: true, x: 0, y: 0, blur: 20, spread: 2, color: 'rgba(0,212,255,0.4)' }
    }
  },
  {
    id: 'glassmorphism',
    name: '🌟 Glassmorphism',
    description: 'Modern glass effect with backdrop blur',
    config: {
      glow: { enabled: false, intensity: 50, color: '#ff6600', animated: false },
      transform: { scale: 102, rotate: 0, skewX: 0, skewY: 0, perspective: false },
      transition: { duration: 250, timing: 'ease-out', enabled: true },
      hoverEffect: 'none',
      background: { type: 'solid', color: 'rgba(255,255,255,0.1)', gradientStart: '#ff6600', gradientEnd: '#00d4ff', gradientDirection: 'to-r' },
      typography: { weight: 500, size: '1rem', spacing: 0.5, transform: 'none' },
      size: { width: 'auto', height: 'auto', padding: 18 },
      border: { radius: 16, width: 1, style: 'solid', color: 'rgba(255,255,255,0.2)' },
      backdrop: { blur: 12, brightness: 105, contrast: 105 },
      shadow: { enabled: true, x: 0, y: 8, blur: 32, spread: 0, color: 'rgba(0,0,0,0.1)' }
    }
  }
])

const customPresets = ref<Array<{id: string, name: string, description: string, config: any}>>([])
const selectedPreset = ref<string | null>(null)
const newPresetName = ref('')
const showPresetSave = ref(false)

// Load preset
const loadPreset = (presetId: string) => {
  const preset = [...presets.value, ...customPresets.value].find(p => p.id === presetId)
  if (preset) {
    buttonTestState.value = JSON.parse(JSON.stringify(preset.config))
    selectedPreset.value = presetId
  }
}

// Save custom preset
const saveCustomPreset = () => {
  if (newPresetName.value.trim()) {
    const newPreset = {
      id: `custom-${Date.now()}`,
      name: `💎 ${newPresetName.value}`,
      description: 'Custom user-created preset',
      config: JSON.parse(JSON.stringify(buttonTestState.value))
    }
    customPresets.value.push(newPreset)
    newPresetName.value = ''
    showPresetSave.value = false
    selectedPreset.value = newPreset.id
    
    // Save to localStorage
    localStorage.setItem('button-presets', JSON.stringify(customPresets.value))
  }
}

// Delete custom preset
const deleteCustomPreset = (presetId: string) => {
  customPresets.value = customPresets.value.filter(p => p.id !== presetId)
  if (selectedPreset.value === presetId) {
    selectedPreset.value = null
  }
  localStorage.setItem('button-presets', JSON.stringify(customPresets.value))
}

// Load custom presets from localStorage
onMounted(() => {
  themeStore.initializeTheme()
  
  const saved = localStorage.getItem('button-presets')
  if (saved) {
    try {
      customPresets.value = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to load custom presets:', e)
    }
  }
})

// Reset all settings
const resetAll = () => {
  buttonTestState.value = {
    glow: { enabled: false, intensity: 50, color: '#ff6600', animated: false },
    transform: { scale: 100, rotate: 0, skewX: 0, skewY: 0, perspective: false },
    transition: { duration: 300, timing: 'ease', enabled: true },
    hoverEffect: 'none',
    background: { type: 'solid', color: '#ff6600', gradientStart: '#ff6600', gradientEnd: '#00d4ff', gradientDirection: 'to-r' },
    typography: { weight: 500, size: '1rem', spacing: 0, transform: 'none' },
    size: { width: 'auto', height: 'auto', padding: 16 },
    border: { radius: 8, width: 1, style: 'solid', color: 'transparent' },
    backdrop: { blur: 0, brightness: 100, contrast: 100 },
    shadow: { enabled: false, x: 0, y: 4, blur: 15, spread: 0, color: 'rgba(0,0,0,0.2)' }
  }
  selectedPreset.value = null
}
</script>

<style scoped>
/* Clean utility classes for component testing */
.test-effect-glow {
  box-shadow: 0 0 20px rgba(91, 115, 219, 0.4);
}

.test-effect-shadow {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
}

.test-effect-hover {
  transition: all 0.3s ease;
}

.test-effect-hover:hover {
  transform: translateY(-1px);
}

.test-effect-pulse {
  animation: test-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes test-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

/* Enhanced component styles for stats hover effects */
.stat:hover .stat-value {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

/* Button testing animations */
@keyframes glow-pulse {
  from { 
    filter: brightness(1) saturate(1); 
  }
  to { 
    filter: brightness(1.2) saturate(1.3); 
  }
}
</style>

<template>
  <div class="min-h-screen py-8 bg-base-100">
    <!-- Header Section -->
    <div class="max-w-4xl mx-auto text-center mb-12 px-4">
      <h1 class="text-5xl font-bold text-primary mb-6">
        Component Testing Environment
      </h1>
      
      <p class="text-lg text-base-content/70 max-w-2xl mx-auto mb-8">
        Interactive testing environment for DaisyUI components. Test different styles, effects, and configurations across light and dark themes.
      </p>
      
      <div class="flex items-center justify-center gap-4 mb-8">
        <ThemeSelector />
      </div>

      <!-- Navigation Back -->
      <div class="mb-8">
        <router-link to="/" class="btn btn-primary btn-lg">
          ← Back to Dashboard
        </router-link>
      </div>
    </div>
      
    <!-- Component Test Sections -->
    <div class="max-w-5xl mx-auto px-4 space-y-12">
        
      <!-- 1. Button Components Section -->
      <div class="card bg-base-200 border border-base-content/10">
        <div class="card-body">
          <h2 class="card-title text-2xl mb-4">🎯 Button Components</h2>
          <p class="text-base-content/70 mb-6">
            Test different button styles, colors, sizes, and interactive states.
          </p>
          
          <!-- Color Variations -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold mb-4">Color Variations</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button class="btn btn-primary">Primary</button>
              <button class="btn btn-secondary">Secondary</button>
              <button class="btn btn-accent">Accent</button>
              <button class="btn btn-neutral">Neutral</button>
              <button class="btn btn-success">Success</button>
              <button class="btn btn-warning">Warning</button>
              <button class="btn btn-error">Error</button>
              <button class="btn btn-info">Info</button>
            </div>
          </div>
          
          <!-- Size Variations -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold mb-4">Size Variations</h3>
            <div class="flex gap-4 items-center flex-wrap">
              <button class="btn btn-primary btn-xs">Extra Small</button>
              <button class="btn btn-primary btn-sm">Small</button>
              <button class="btn btn-primary">Normal</button>
              <button class="btn btn-primary btn-lg">Large</button>
            </div>
          </div>

          <!-- Style Variations -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold mb-4">Style Variations</h3>
            <div class="flex gap-4 items-center flex-wrap">
              <button class="btn btn-primary">Solid</button>
              <button class="btn btn-outline btn-primary">Outline</button>
              <button class="btn btn-ghost btn-primary">Ghost</button>
              <button class="btn btn-link btn-primary">Link</button>
            </div>
          </div>

        </div>
      </div>

      <!-- Button Testing Laboratory -->
      <div class="card bg-base-200 border border-base-content/10">
        <div class="card-body">
          <h2 class="card-title text-2xl mb-4">🧪 Button Testing Laboratory</h2>
          <p class="text-base-content/70 mb-6">
            Interactive testing environment to experiment with button effects, animations, and styling in real-time.
          </p>

          <!-- Presets Section -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">🎨 Presets</h3>
            
            <!-- Built-in Presets -->
            <div class="mb-4">
              <h4 class="text-md font-medium mb-2">Built-in Presets</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                <button
                  v-for="preset in presets"
                  :key="preset.id"
                  @click="loadPreset(preset.id)"
                  class="btn btn-outline btn-sm text-left flex-col h-auto py-2 px-3"
                  :class="{ 'btn-primary': selectedPreset === preset.id }"
                >
                  <div class="font-medium text-xs">{{ preset.name }}</div>
                  <div class="text-xs opacity-60 mt-1">{{ preset.description }}</div>
                </button>
              </div>
            </div>

            <!-- Custom Presets -->
            <div v-if="customPresets.length > 0" class="mb-4">
              <h4 class="text-md font-medium mb-2">Custom Presets</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <div
                  v-for="preset in customPresets"
                  :key="preset.id"
                  class="relative"
                >
                  <button
                    @click="loadPreset(preset.id)"
                    class="btn btn-outline btn-sm text-left flex-col h-auto py-2 px-3 w-full"
                    :class="{ 'btn-secondary': selectedPreset === preset.id }"
                  >
                    <div class="font-medium text-xs">{{ preset.name }}</div>
                    <div class="text-xs opacity-60 mt-1">{{ preset.description }}</div>
                  </button>
                  <button
                    @click="deleteCustomPreset(preset.id)"
                    class="btn btn-error btn-xs absolute -top-1 -right-1 w-4 h-4 min-h-4 p-0"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>

            <!-- Save New Preset -->
            <div class="flex gap-2 items-end">
              <div v-if="showPresetSave" class="form-control flex-1">
                <input
                  type="text"
                  v-model="newPresetName"
                  placeholder="Enter preset name..."
                  class="input input-bordered input-sm"
                  @keypress.enter="saveCustomPreset"
                />
              </div>
              <button
                v-if="!showPresetSave"
                @click="showPresetSave = true"
                class="btn btn-success btn-sm"
              >
                💾 Save Current as Preset
              </button>
              <template v-else>
                <button
                  @click="saveCustomPreset"
                  class="btn btn-success btn-sm"
                  :disabled="!newPresetName.trim()"
                >
                  ✅ Save
                </button>
                <button
                  @click="showPresetSave = false; newPresetName = ''"
                  class="btn btn-ghost btn-sm"
                >
                  ❌
                </button>
              </template>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <!-- Live Preview Column -->
            <div class="lg:col-span-1">
              <h3 class="text-lg font-semibold mb-4">Live Preview</h3>
              
              <!-- Test Button -->
              <div class="flex items-center justify-center p-8 bg-base-300/50 rounded-lg mb-4">
                <button 
                  class="btn btn-primary"
                  :style="testButtonStyles"
                >
                  Test Button
                </button>
              </div>
              
              <!-- Code Export -->
              <div class="space-y-2">
                <button 
                  @click="() => copyToClipboard(generateTailwindCode())"
                  class="btn btn-outline btn-sm w-full"
                >
                  📋 Copy Tailwind Classes
                </button>
                <button 
                  @click="() => copyToClipboard(generateCSSCode())"
                  class="btn btn-outline btn-sm w-full"
                >
                  📋 Copy CSS Code
                </button>
                <button 
                  @click="resetAll"
                  class="btn btn-ghost btn-sm w-full"
                >
                  🔄 Reset All
                </button>
              </div>
            </div>

            <!-- Controls Column -->
            <div class="lg:col-span-2">
              <h3 class="text-lg font-semibold mb-4">Controls</h3>
              
              <!-- Control Tabs -->
              <div class="tabs tabs-boxed mb-4">
                <button 
                  class="tab"
                  :class="{ 'tab-active': activeTab === 'effects' }"
                  @click="activeTab = 'effects'"
                >
                  ✨ Effects
                </button>
                <button 
                  class="tab"
                  :class="{ 'tab-active': activeTab === 'transform' }"
                  @click="activeTab = 'transform'"
                >
                  🔄 Transform
                </button>
                <button 
                  class="tab"
                  :class="{ 'tab-active': activeTab === 'style' }"
                  @click="activeTab = 'style'"
                >
                  🎨 Style
                </button>
                <button 
                  class="tab"
                  :class="{ 'tab-active': activeTab === 'layout' }"
                  @click="activeTab = 'layout'"
                >
                  📐 Layout
                </button>
              </div>

              <!-- Tab Content -->
              <div class="bg-base-100 p-4 rounded-lg min-h-[400px]">
                
                <!-- Effects Tab -->
                <div v-if="activeTab === 'effects'" class="space-y-6">
                  <!-- Glow Effects -->
                  <div>
                    <h4 class="font-medium mb-3">Glow Effects</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="form-control">
                        <label class="cursor-pointer label">
                          <span class="label-text">Enable Glow</span> 
                          <input 
                            type="checkbox" 
                            class="toggle toggle-primary" 
                            v-model="buttonTestState.glow.enabled" 
                          />
                        </label>
                      </div>
                      
                      <div class="form-control" v-if="buttonTestState.glow.enabled">
                        <label class="cursor-pointer label">
                          <span class="label-text">Animated Glow</span> 
                          <input 
                            type="checkbox" 
                            class="toggle toggle-secondary" 
                            v-model="buttonTestState.glow.animated" 
                          />
                        </label>
                      </div>
                      
                      <div class="form-control" v-if="buttonTestState.glow.enabled">
                        <label class="label">
                          <span class="label-text">Intensity: {{ buttonTestState.glow.intensity }}%</span>
                        </label>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          v-model="buttonTestState.glow.intensity" 
                          class="range range-primary" 
                        />
                      </div>
                      
                      <div class="form-control" v-if="buttonTestState.glow.enabled">
                        <label class="label">
                          <span class="label-text">Glow Color</span>
                        </label>
                        <input 
                          type="color" 
                          v-model="buttonTestState.glow.color" 
                          class="input input-bordered w-full h-10" 
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Shadow Effects -->
                  <div>
                    <h4 class="font-medium mb-3">Shadow Effects</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="form-control">
                        <label class="cursor-pointer label">
                          <span class="label-text">Enable Custom Shadow</span> 
                          <input 
                            type="checkbox" 
                            class="toggle toggle-accent" 
                            v-model="buttonTestState.shadow.enabled" 
                          />
                        </label>
                      </div>
                      
                      <template v-if="buttonTestState.shadow.enabled">
                        <div class="form-control">
                          <label class="label">
                            <span class="label-text">X Offset: {{ buttonTestState.shadow.x }}px</span>
                          </label>
                          <input 
                            type="range" 
                            min="-20" 
                            max="20" 
                            v-model="buttonTestState.shadow.x" 
                            class="range range-accent" 
                          />
                        </div>
                        
                        <div class="form-control">
                          <label class="label">
                            <span class="label-text">Y Offset: {{ buttonTestState.shadow.y }}px</span>
                          </label>
                          <input 
                            type="range" 
                            min="-20" 
                            max="20" 
                            v-model="buttonTestState.shadow.y" 
                            class="range range-accent" 
                          />
                        </div>
                        
                        <div class="form-control">
                          <label class="label">
                            <span class="label-text">Blur: {{ buttonTestState.shadow.blur }}px</span>
                          </label>
                          <input 
                            type="range" 
                            min="0" 
                            max="50" 
                            v-model="buttonTestState.shadow.blur" 
                            class="range range-accent" 
                          />
                        </div>
                      </template>
                    </div>
                  </div>

                  <!-- Backdrop Filters -->
                  <div>
                    <h4 class="font-medium mb-3">Backdrop Filters</h4>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text">Blur: {{ buttonTestState.backdrop.blur }}px</span>
                        </label>
                        <input 
                          type="range" 
                          min="0" 
                          max="20" 
                          v-model="buttonTestState.backdrop.blur" 
                          class="range range-info" 
                        />
                      </div>
                      
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text">Brightness: {{ buttonTestState.backdrop.brightness }}%</span>
                        </label>
                        <input 
                          type="range" 
                          min="50" 
                          max="150" 
                          v-model="buttonTestState.backdrop.brightness" 
                          class="range range-info" 
                        />
                      </div>
                      
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text">Contrast: {{ buttonTestState.backdrop.contrast }}%</span>
                        </label>
                        <input 
                          type="range" 
                          min="50" 
                          max="150" 
                          v-model="buttonTestState.backdrop.contrast" 
                          class="range range-info" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Transform Tab -->
                <div v-if="activeTab === 'transform'" class="space-y-6">
                  <div>
                    <h4 class="font-medium mb-3">Transform Effects</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text">Scale: {{ buttonTestState.transform.scale }}%</span>
                        </label>
                        <input 
                          type="range" 
                          min="50" 
                          max="200" 
                          v-model="buttonTestState.transform.scale" 
                          class="range range-secondary" 
                        />
                      </div>
                      
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text">Rotation: {{ buttonTestState.transform.rotate }}°</span>
                        </label>
                        <input 
                          type="range" 
                          min="-45" 
                          max="45" 
                          v-model="buttonTestState.transform.rotate" 
                          class="range range-secondary" 
                        />
                      </div>
                      
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text">Skew X: {{ buttonTestState.transform.skewX }}°</span>
                        </label>
                        <input 
                          type="range" 
                          min="-20" 
                          max="20" 
                          v-model="buttonTestState.transform.skewX" 
                          class="range range-secondary" 
                        />
                      </div>
                      
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text">Skew Y: {{ buttonTestState.transform.skewY }}°</span>
                        </label>
                        <input 
                          type="range" 
                          min="-20" 
                          max="20" 
                          v-model="buttonTestState.transform.skewY" 
                          class="range range-secondary" 
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 class="font-medium mb-3">Transition Settings</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="form-control">
                        <label class="cursor-pointer label">
                          <span class="label-text">Enable Transitions</span> 
                          <input 
                            type="checkbox" 
                            class="toggle toggle-primary" 
                            v-model="buttonTestState.transition.enabled" 
                          />
                        </label>
                      </div>
                      
                      <div class="form-control" v-if="buttonTestState.transition.enabled">
                        <label class="label">
                          <span class="label-text">Duration: {{ buttonTestState.transition.duration }}ms</span>
                        </label>
                        <input 
                          type="range" 
                          min="100" 
                          max="2000" 
                          step="100"
                          v-model="buttonTestState.transition.duration" 
                          class="range range-primary" 
                        />
                      </div>
                      
                      <div class="form-control" v-if="buttonTestState.transition.enabled">
                        <label class="label">
                          <span class="label-text">Timing Function</span>
                        </label>
                        <select v-model="buttonTestState.transition.timing" class="select select-bordered w-full">
                          <option value="ease">Ease</option>
                          <option value="linear">Linear</option>
                          <option value="ease-in">Ease In</option>
                          <option value="ease-out">Ease Out</option>
                          <option value="ease-in-out">Ease In Out</option>
                          <option value="cubic-bezier(0.68, -0.55, 0.265, 1.55)">Bounce</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Style Tab -->
                <div v-if="activeTab === 'style'" class="space-y-6">
                  <!-- Background -->
                  <div>
                    <h4 class="font-medium mb-3">Background</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text">Background Type</span>
                        </label>
                        <select v-model="buttonTestState.background.type" class="select select-bordered w-full">
                          <option value="solid">Solid Color</option>
                          <option value="gradient">Gradient</option>
                        </select>
                      </div>
                      
                      <div class="form-control" v-if="buttonTestState.background.type === 'solid'">
                        <label class="label">
                          <span class="label-text">Background Color</span>
                        </label>
                        <input 
                          type="color" 
                          v-model="buttonTestState.background.color" 
                          class="input input-bordered w-full h-10" 
                        />
                      </div>
                      
                      <template v-if="buttonTestState.background.type === 'gradient'">
                        <div class="form-control">
                          <label class="label">
                            <span class="label-text">Gradient Start</span>
                          </label>
                          <input 
                            type="color" 
                            v-model="buttonTestState.background.gradientStart" 
                            class="input input-bordered w-full h-10" 
                          />
                        </div>
                        
                        <div class="form-control">
                          <label class="label">
                            <span class="label-text">Gradient End</span>
                          </label>
                          <input 
                            type="color" 
                            v-model="buttonTestState.background.gradientEnd" 
                            class="input input-bordered w-full h-10" 
                          />
                        </div>
                        
                        <div class="form-control">
                          <label class="label">
                            <span class="label-text">Gradient Direction</span>
                          </label>
                          <select v-model="buttonTestState.background.gradientDirection" class="select select-bordered w-full">
                            <option value="to-r">To Right</option>
                            <option value="to-l">To Left</option>
                            <option value="to-t">To Top</option>
                            <option value="to-b">To Bottom</option>
                            <option value="to-tr">To Top Right</option>
                            <option value="to-tl">To Top Left</option>
                            <option value="to-br">To Bottom Right</option>
                            <option value="to-bl">To Bottom Left</option>
                          </select>
                        </div>
                      </template>
                    </div>
                  </div>

                  <!-- Typography -->
                  <div>
                    <h4 class="font-medium mb-3">Typography</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text">Font Weight: {{ buttonTestState.typography.weight }}</span>
                        </label>
                        <input 
                          type="range" 
                          min="100" 
                          max="900" 
                          step="100"
                          v-model="buttonTestState.typography.weight" 
                          class="range range-accent" 
                        />
                      </div>
                      
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text">Letter Spacing: {{ buttonTestState.typography.spacing }}px</span>
                        </label>
                        <input 
                          type="range" 
                          min="-2" 
                          max="5" 
                          step="0.5"
                          v-model="buttonTestState.typography.spacing" 
                          class="range range-accent" 
                        />
                      </div>
                      
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text">Text Transform</span>
                        </label>
                        <select v-model="buttonTestState.typography.transform" class="select select-bordered w-full">
                          <option value="none">None</option>
                          <option value="uppercase">UPPERCASE</option>
                          <option value="lowercase">lowercase</option>
                          <option value="capitalize">Capitalize</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Layout Tab -->
                <div v-if="activeTab === 'layout'" class="space-y-6">
                  <!-- Border & Shape -->
                  <div>
                    <h4 class="font-medium mb-3">Border & Shape</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text">Border Radius: {{ buttonTestState.border.radius }}px</span>
                        </label>
                        <input 
                          type="range" 
                          min="0" 
                          max="50" 
                          v-model="buttonTestState.border.radius" 
                          class="range range-warning" 
                        />
                      </div>
                      
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text">Border Width: {{ buttonTestState.border.width }}px</span>
                        </label>
                        <input 
                          type="range" 
                          min="0" 
                          max="10" 
                          v-model="buttonTestState.border.width" 
                          class="range range-warning" 
                        />
                      </div>
                      
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text">Border Style</span>
                        </label>
                        <select v-model="buttonTestState.border.style" class="select select-bordered w-full">
                          <option value="solid">Solid</option>
                          <option value="dashed">Dashed</option>
                          <option value="dotted">Dotted</option>
                          <option value="double">Double</option>
                        </select>
                      </div>
                      
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text">Border Color</span>
                        </label>
                        <input 
                          type="color" 
                          v-model="buttonTestState.border.color" 
                          class="input input-bordered w-full h-10" 
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Spacing -->
                  <div>
                    <h4 class="font-medium mb-3">Spacing</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text">Padding: {{ buttonTestState.size.padding }}px</span>
                        </label>
                        <input 
                          type="range" 
                          min="4" 
                          max="40" 
                          v-model="buttonTestState.size.padding" 
                          class="range range-success" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- Code Preview Section -->
          <div class="mt-8">
            <h3 class="text-lg font-semibold mb-4">Generated Code</h3>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div class="mockup-code text-xs">
                <pre data-prefix="HTML"><code>&lt;button class="{{ generateTailwindCode() }}"&gt;</code></pre>
                <pre data-prefix="$"><code>  Test Button</code></pre>
                <pre data-prefix="$"><code>&lt;/button&gt;</code></pre>
              </div>
              
              <div class="mockup-code text-xs">
                <pre data-prefix="CSS"><code>{{ generateCSSCode() }}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Card Layout Section -->
      <div class="card bg-base-200 border border-base-content/10">
        <div class="card-body">
          <h2 class="card-title text-2xl mb-4">📋 Card Layouts</h2>
          <p class="text-base-content/70 mb-6">
            Test different card styles, backgrounds, and content arrangements.
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <!-- Standard Card -->
            <div class="card bg-base-100 shadow">
              <div class="card-body">
                <h3 class="card-title">Standard Card</h3>
                <p class="text-base-content/70">Basic card with standard styling and content layout.</p>
                <div class="card-actions justify-end">
                  <button class="btn btn-primary btn-sm">Action</button>
                </div>
              </div>
            </div>
            
            <!-- Elevated Card -->
            <div class="card bg-base-100 shadow-lg">
              <div class="card-body">
                <h3 class="card-title">Elevated Card</h3>
                <p class="text-base-content/70">Card with enhanced shadow for elevated appearance.</p>
                <div class="card-actions justify-end">
                  <button class="btn btn-secondary btn-sm">Action</button>
                </div>
              </div>
            </div>
            
            <!-- Accent Card -->
            <div class="card bg-accent text-accent-content shadow">
              <div class="card-body">
                <h3 class="card-title">Accent Card</h3>
                <p class="opacity-80">Card with accent background and appropriate contrast colors.</p>
                <div class="card-actions justify-end">
                  <button class="btn btn-accent-content btn-sm">Action</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced Cards -->
          <div class="mt-8">
            <h3 class="text-lg font-semibold mb-4">📋 Enhanced Card Effects</h3>
            <p class="text-base-content/70 mb-4">
              Cards with custom styling, backdrop effects, and enhanced interactions.
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Enhanced Tournament Card -->
              <div class="card-tournament relative overflow-hidden">
                <div class="card-body">
                  <h3 class="card-title text-primary">Enhanced Tournament Card</h3>
                  <p class="text-base-content/70">Custom effects, backdrop blur, gradient overlay</p>
                  <div class="card-actions justify-end">
                    <button class="btn btn-primary btn-sm">Analyze</button>
                  </div>
                </div>
              </div>

              <!-- Complex Enhanced Component -->
              <div class="card-tournament relative overflow-hidden">
                <div class="card-body">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="card-title text-primary">Live Control Panel</h3>
                    <div class="badge badge-success badge-apex-pulse gap-2">
                      <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      Broadcasting
                    </div>
                  </div>
                  
                  <!-- Enhanced buttons -->
                  <div class="flex gap-2 flex-wrap">
                    <button class="btn btn-success btn-apex-glow btn-sm">
                      ▶️ Resume
                    </button>
                    <button class="btn btn-warning hover:scale-105 transition-transform btn-sm">
                      ⏸️ Pause
                    </button>
                    <button class="btn btn-error hover:rotate-6 transition-transform btn-sm">
                      ⏹️ Stop
                    </button>
                    <button class="btn btn-info hover:scale-110 hover:-rotate-1 transition-all btn-sm">
                      📊 Analytics
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Progress & Loading Section -->
      <div class="card bg-base-200 border border-base-content/10">
        <div class="card-body">
          <h2 class="card-title text-2xl mb-4">⚡ Progress & Loading</h2>
          <p class="text-base-content/70 mb-6">
            Test progress indicators, loading states, and completion animations.
          </p>
          
          <!-- Progress Bars -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold mb-4">Progress Bars</h3>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span>Overall Progress</span>
                  <span>75%</span>
                </div>
                <progress class="progress progress-primary w-full" value="75" max="100"></progress>
              </div>
              
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span>Secondary Task</span>
                  <span>60%</span>
                </div>
                <progress class="progress progress-secondary w-full" value="60" max="100"></progress>
              </div>
              
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span>Background Process</span>
                  <span>40%</span>
                </div>
                <progress class="progress progress-accent w-full" value="40" max="100"></progress>
              </div>
            </div>
          </div>

          <!-- Loading Indicators -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold mb-4">Loading Indicators</h3>
            <div class="flex gap-6 items-center">
              <div class="flex items-center gap-2">
                <span class="loading loading-spinner loading-sm"></span>
                <span class="text-sm">Small</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="loading loading-spinner loading-md"></span>
                <span class="text-sm">Medium</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="loading loading-spinner loading-lg"></span>
                <span class="text-sm">Large</span>
              </div>
            </div>
          </div>

          <!-- Enhanced Progress Effects -->
          <div class="mt-8">
            <h3 class="text-lg font-semibold mb-4">📊 Enhanced Progress Effects</h3>
            <p class="text-base-content/70 mb-4">
              Progress bars with gradients, animations, and custom styling.
            </p>
            
            <div class="space-y-6">
              <!-- Enhanced Gradient Progress -->
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span>Apex Gradient Progress</span>
                  <span class="text-primary">60%</span>
                </div>
                <progress class="progress-apex w-full" value="60" max="100"></progress>
              </div>
              
              <!-- Animated Progress -->
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span>Tournament Progress (Animated)</span>
                  <span class="text-secondary">85%</span>
                </div>
                <progress class="progress progress-secondary w-full animate-pulse" value="85" max="100"></progress>
              </div>
              
              <!-- Custom Styled Progress -->
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span>Team Performance</span>
                  <span class="text-accent">90%</span>
                </div>
                <div class="w-full bg-base-300 rounded-full h-3 overflow-hidden shadow-inner">
                  <div 
                    class="h-full bg-gradient-to-r from-accent via-secondary to-primary rounded-full shadow-lg transition-all duration-1000 ease-out"
                    style="width: 90%"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Badges & Stats Section -->
      <div class="card bg-base-200 border border-base-content/10">
        <div class="card-body">
          <h2 class="card-title text-2xl mb-4">🏷️ Badges & Statistics</h2>
          <p class="text-base-content/70 mb-6">
            Test status indicators, badges, and statistical displays.
          </p>
          
          <!-- Status Badges -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold mb-4">Status Badges</h3>
            <div class="flex gap-3 flex-wrap">
              <div class="badge badge-primary">Active</div>
              <div class="badge badge-secondary">Processing</div>
              <div class="badge badge-accent">Featured</div>
              <div class="badge badge-success">Completed</div>
              <div class="badge badge-warning">Pending</div>
              <div class="badge badge-error">Failed</div>
              <div class="badge badge-info">Information</div>
              <div class="badge badge-neutral">Default</div>
            </div>
          </div>

          <!-- Enhanced Badge Effects -->
          <div class="mt-8">
            <h3 class="text-lg font-semibold mb-4">🏷️ Enhanced Badge Effects</h3>
            <p class="text-base-content/70 mb-4">
              Badges with animations, interactions, and custom effects.
            </p>
            
            <div class="flex gap-4 flex-wrap items-center mb-4">
              <div class="badge badge-success badge-apex-pulse">Pulsing Badge</div>
              <div class="badge badge-secondary hover:scale-110 transition-transform cursor-pointer">Hover Scale</div>
              <div class="badge badge-accent animate-bounce">Bouncing Badge</div>
            </div>
            
            <div class="mt-4">
              <h4 class="text-md font-medium mb-2">Tournament Status Examples</h4>
              <div class="flex gap-2 flex-wrap">
                <div class="badge badge-success badge-apex-pulse gap-2">
                  <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Live Tournament
                </div>
                <div class="badge badge-warning hover:scale-105 transition-transform">
                  🔥 High Activity
                </div>
                <div class="badge badge-info hover:rotate-6 transition-transform cursor-pointer">
                  📊 Analytics Ready
                </div>
              </div>
            </div>
          </div>

          <!-- Statistics Display -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold mb-4">Statistics Display</h3>
            <div class="stats stats-vertical lg:stats-horizontal bg-base-100 shadow w-full">
              <div class="stat">
                <div class="stat-figure text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="stat-title">Total Users</div>
                <div class="stat-value">31K</div>
                <div class="stat-desc">Jan 1st - Feb 1st</div>
              </div>
              
              <div class="stat">
                <div class="stat-figure text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                  </svg>
                </div>
                <div class="stat-title">New Users</div>
                <div class="stat-value">4,200</div>
                <div class="stat-desc">↗︎ 400 (22%)</div>
              </div>
              
              <div class="stat">
                <div class="stat-figure text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                  </svg>
                </div>
                <div class="stat-title">New Registrations</div>
                <div class="stat-value">1,200</div>
                <div class="stat-desc">↘︎ 90 (14%)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Forms & Input Controls Section -->
      <div class="card bg-base-200 border border-base-content/10">
        <div class="card-body">
          <h2 class="card-title text-2xl mb-4">📝 Forms & Controls</h2>
          <p class="text-base-content/70 mb-6">
            Test form elements, input controls, and interactive components.
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <!-- Input Controls -->
            <div class="space-y-6">
              <h3 class="text-lg font-semibold">Input Controls</h3>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Text Input</span>
                </label>
                <input type="text" placeholder="Enter text here..." class="input input-bordered w-full" />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Select Dropdown</span>
                </label>
                <select class="select select-bordered w-full">
                  <option disabled selected>Choose an option</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
                  <option>Option 3</option>
                </select>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Textarea</span>
                </label>
                <textarea class="textarea textarea-bordered" placeholder="Enter detailed information..."></textarea>
              </div>
            </div>

            <!-- Interactive Controls -->
            <div class="space-y-6">
              <h3 class="text-lg font-semibold">Interactive Controls</h3>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Range Slider</span>
                </label>
                <input type="range" min="0" max="100" value="50" class="range range-primary" />
                <div class="w-full flex justify-between text-xs px-2 mt-1">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>

              <div class="form-control">
                <label class="cursor-pointer label">
                  <span class="label-text">Toggle Switch</span> 
                  <input type="checkbox" class="toggle toggle-primary" checked />
                </label>
              </div>

              <div class="form-control">
                <label class="cursor-pointer label">
                  <span class="label-text">Checkbox Option</span> 
                  <input type="checkbox" class="checkbox checkbox-primary" checked />
                </label>
              </div>

              <div class="form-control">
                <div class="label">
                  <span class="label-text">Radio Options</span>
                </div>
                <div class="space-y-2">
                  <label class="cursor-pointer flex items-center gap-2">
                    <input type="radio" name="radio-options" class="radio radio-primary" checked />
                    <span class="label-text">Option A</span>
                  </label>
                  <label class="cursor-pointer flex items-center gap-2">
                    <input type="radio" name="radio-options" class="radio radio-primary" />
                    <span class="label-text">Option B</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-8 flex gap-4 justify-end">
            <button class="btn btn-ghost">Cancel</button>
            <button class="btn btn-primary">Save Changes</button>
          </div>

          <!-- Enhanced Stats Section -->
          <div class="mt-8">
            <h3 class="text-lg font-semibold mb-4">📊 Enhanced Statistics</h3>
            <p class="text-base-content/70 mb-4">
              Statistics with enhanced interactions and hover effects.
            </p>
            
            <!-- Stats with enhanced styling -->
            <div class="stats stats-horizontal shadow-lg bg-base-300/50 backdrop-blur-sm">
              <div class="stat hover:bg-base-300/80 transition-colors cursor-pointer">
                <div class="stat-title">Active Teams</div>
                <div class="stat-value text-primary">18</div>
              </div>
              
              <div class="stat hover:bg-base-300/80 transition-colors cursor-pointer">
                <div class="stat-title">Viewers</div>
                <div class="stat-value text-secondary">25.4K</div>
              </div>
              
              <div class="stat hover:bg-base-300/80 transition-colors cursor-pointer">
                <div class="stat-title">Prize Pool</div>
                <div class="stat-value text-accent">$2M</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 6. CSS Override Examples Section -->
      <div class="card bg-base-200 border border-base-content/10">
        <div class="card-body">
          <h2 class="card-title text-2xl mb-4">🎨 CSS Override Examples</h2>
          <p class="text-base-content/70 mb-6">
            Different methods for enhancing DaisyUI components with custom styling.
          </p>
          
          <div class="space-y-4">
            <div class="mockup-code text-sm">
              <pre data-prefix="CSS"><code>/* Method 1: Tailwind Utility Stacking */</code></pre>
              <pre data-prefix="$"><code>class="btn btn-primary hover:scale-110 transition-all"</code></pre>
              <pre data-prefix=""><code></code></pre>
              <pre data-prefix="CSS"><code>/* Method 2: Custom CSS Classes with @apply */</code></pre>
              <pre data-prefix="$"><code>.btn-apex-glow {</code></pre>
              <pre data-prefix="$"><code>  @apply btn transition-all duration-300;</code></pre>
              <pre data-prefix="$"><code>  box-shadow: 0 4px 15px rgba(255, 102, 0, 0.2);</code></pre>
              <pre data-prefix="$"><code>}</code></pre>
              <pre data-prefix=""><code></code></pre>
              <pre data-prefix="CSS"><code>/* Method 3: Component Variants */</code></pre>
              <pre data-prefix="$"><code>.card-tournament {</code></pre>
              <pre data-prefix="$"><code>  @apply card bg-base-200/80 backdrop-blur-md;</code></pre>
              <pre data-prefix="$"><code>  /* Custom gradient overlay */</code></pre>
              <pre data-prefix="$"><code>}</code></pre>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>