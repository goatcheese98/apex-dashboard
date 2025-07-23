<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="mb-8 text-center">
        <h1 class="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          🚀 Dock Effects Laboratory
        </h1>
        <p class="text-gray-300 text-xl">
          Ultimate playground for experimenting with floating dock visual effects
        </p>
      </div>

      <!-- Control Panel -->
      <div class="mb-8 bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 overflow-hidden">
        <!-- Tab Navigation -->
        <div class="flex border-b border-gray-700/50">
          <button 
            v-for="tab in controlTabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-6 py-4 text-sm font-medium transition-all duration-300 border-b-2 flex items-center gap-2',
              activeTab === tab.id 
                ? 'text-white border-purple-500 bg-purple-900/30' 
                : 'text-gray-400 border-transparent hover:text-white hover:bg-gray-700/30'
            ]"
          >
            <span>{{ tab.icon }}</span>
            <span>{{ tab.name }}</span>
          </button>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Basic Settings Tab -->
          <div v-show="activeTab === 'basic'" class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <!-- Effect & Mode Column -->
              <div class="space-y-6">
                <div>
                  <label class="block text-lg font-semibold mb-4 text-purple-300">🎭 Style & Mode</label>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium mb-2">Effect Style</label>
                      <select 
                        v-model="currentEffect" 
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="glassmorphic">🔮 Glassmorphic</option>
                        <option value="holographic">✨ Holographic</option>
                        <option value="morphing">🌊 Morphing</option>
                        <option value="neon">⚡ Neon Glow</option>
                        <option value="particle">🎆 Particle Field</option>
                        <option value="cyberpunk">🤖 Cyberpunk</option>
                        <option value="quantum">⚛️ Quantum</option>
                        <option value="liquid">💧 Liquid Metal</option>
                        <option value="plasma">🔥 Plasma</option>
                        <option value="matrix">💊 Matrix</option>
                        <option value="cosmic">🌌 Cosmic</option>
                        <option value="neural">🧠 Neural Network</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium mb-2">Visualization Mode</label>
                      <select 
                        v-model="currentVisualization" 
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="race-chart">🏁 Race Chart</option>
                        <option value="damage-analysis">⚔️ Damage Analysis</option>
                        <option value="scatter-plot">📊 Scatter Plot</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Size & Animation Column -->
              <div class="space-y-6">
                <div>
                  <label class="block text-lg font-semibold mb-4 text-cyan-300">📐 Size & Motion</label>
                  <div class="space-y-6">
                    <div>
                      <label class="block text-sm font-medium mb-3">Dock Dimensions</label>
                      <div class="space-y-4">
                        <div>
                          <div class="flex justify-between items-center mb-2">
                            <span class="text-xs text-gray-400">Width</span>
                            <span class="text-xs font-mono text-white">{{ dockWidth }}px</span>
                          </div>
                          <input v-model="dockWidth" type="range" min="200" max="800" class="w-full">
                        </div>
                        <div>
                          <div class="flex justify-between items-center mb-2">
                            <span class="text-xs text-gray-400">Height</span>
                            <span class="text-xs font-mono text-white">{{ dockHeight }}px</span>
                          </div>
                          <input v-model="dockHeight" type="range" min="40" max="120" class="w-full">
                        </div>
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium mb-3">Animation Settings</label>
                      <div class="space-y-3">
                        <label class="flex items-center p-3 bg-gray-700/30 rounded-lg">
                          <input v-model="animationEnabled" type="checkbox" class="mr-3">
                          <span class="text-sm font-medium">Enable Animations</span>
                        </label>
                        <div>
                          <div class="flex justify-between items-center mb-2">
                            <span class="text-xs text-gray-400">Speed</span>
                            <span class="text-xs font-mono text-white">{{ animationSpeed }}x</span>
                          </div>
                          <input v-model="animationSpeed" type="range" min="0.5" max="3" step="0.1" class="w-full" :disabled="!animationEnabled">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Colors Column -->
              <div class="space-y-6">
                <div>
                  <label class="block text-lg font-semibold mb-4 text-pink-300">🎨 Color Palette</label>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium mb-3">Primary Color</label>
                      <div class="flex items-center gap-3">
                        <input v-model="primaryColor" type="color" class="w-16 h-16 rounded-lg border border-gray-600">
                        <div class="flex-1">
                          <div class="text-xs font-mono text-gray-400 mb-1">{{ primaryColor }}</div>
                          <div class="h-8 rounded-md" :style="{ backgroundColor: primaryColor }"></div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium mb-3">Secondary Color</label>
                      <div class="flex items-center gap-3">
                        <input v-model="secondaryColor" type="color" class="w-16 h-16 rounded-lg border border-gray-600">
                        <div class="flex-1">
                          <div class="text-xs font-mono text-gray-400 mb-1">{{ secondaryColor }}</div>
                          <div class="h-8 rounded-md" :style="{ backgroundColor: secondaryColor }"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Effects Tab -->
          <div v-show="activeTab === 'effects'" class="space-y-6">
            <div class="text-center mb-6">
              <h3 class="text-lg font-semibold text-purple-300">🎨 Visual Effect Controls</h3>
              <p class="text-gray-400 text-sm mt-2">Fine-tune the visual appearance and styling of your dock</p>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Blur & Transparency -->
              <div class="space-y-4">
                <label class="block text-sm font-semibold mb-3 text-blue-300">🌀 Blur & Transparency</label>
                <div class="space-y-3">
                  <div>
                    <label class="block text-xs font-medium mb-2">Blur Intensity</label>
                    <input v-model="blurIntensity" type="range" min="0" max="50" class="w-full">
                    <div class="text-xs text-gray-400 mt-1">{{ blurIntensity }}px</div>
                  </div>
                  <div>
                    <label class="block text-xs font-medium mb-2">Opacity</label>
                    <input v-model="opacity" type="range" min="0" max="100" class="w-full">
                    <div class="text-xs text-gray-400 mt-1">{{ opacity }}%</div>
                  </div>
                </div>
              </div>
              
              <!-- Shape & Lighting -->
              <div class="space-y-4">
                <label class="block text-sm font-semibold mb-3 text-green-300">✨ Shape & Lighting</label>
                <div class="space-y-3">
                  <div>
                    <label class="block text-xs font-medium mb-2">Border Radius</label>
                    <input v-model="borderRadius" type="range" min="0" max="50" class="w-full">
                    <div class="text-xs text-gray-400 mt-1">{{ borderRadius }}px</div>
                  </div>
                  <div>
                    <label class="block text-xs font-medium mb-2">Glow Strength</label>
                    <input v-model="glowStrength" type="range" min="0" max="100" class="w-full">
                    <div class="text-xs text-gray-400 mt-1">{{ glowStrength }}%</div>
                  </div>
                </div>
              </div>
              
              <!-- 3D Effects -->
              <div class="space-y-4">
                <label class="block text-sm font-semibold mb-3 text-orange-300">🎭 3D Effects</label>
                <div class="space-y-3">
                  <div>
                    <label class="block text-xs font-medium mb-2">3D Depth</label>
                    <input v-model="depthStrength" type="range" min="0" max="50" class="w-full">
                    <div class="text-xs text-gray-400 mt-1">{{ depthStrength }}px</div>
                  </div>
                  <div class="flex items-end h-12">
                    <button 
                      @click="randomizeEffect"
                      class="w-full px-3 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg transition-all duration-300 text-sm"
                    >
                      🎲 Randomize Effects
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Components Tab -->
          <div v-show="activeTab === 'components'" class="space-y-6">
            <div class="text-center mb-6">
              <h3 class="text-lg font-semibold text-cyan-300">🔧 Component Customization</h3>
              <p class="text-gray-400 text-sm mt-2">Customize individual components, buttons, sliders, and layout elements</p>
            </div>

            <!-- Component Style Selector -->
            <div class="mb-6">
              <label class="block text-sm font-semibold mb-3 text-cyan-300">Component Style Theme</label>
              <div class="grid grid-cols-4 gap-3">
                <button 
                  v-for="style in ['modern', 'minimal', 'rounded', 'sharp']" 
                  :key="style"
                  @click="componentStyle = style"
                  :class="[
                    'px-4 py-3 rounded-lg font-medium transition-all duration-300 border-2',
                    componentStyle === style 
                      ? 'bg-cyan-600 text-white border-cyan-400' 
                      : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 hover:border-gray-500'
                  ]"
                >
                  {{ style.charAt(0).toUpperCase() + style.slice(1) }}
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Button Controls -->
              <div class="space-y-4">
                <label class="block text-sm font-semibold mb-3 text-purple-300">🔘 Button Controls</label>
                <div class="space-y-3">
                  <div>
                    <label class="block text-xs font-medium mb-2">Button Size</label>
                    <input v-model="buttonSize" type="range" min="24" max="64" class="w-full">
                    <div class="text-xs text-gray-400 mt-1">{{ buttonSize }}px</div>
                  </div>
                  <div>
                    <label class="block text-xs font-medium mb-2">Button Radius</label>
                    <input v-model="buttonRadius" type="range" min="0" max="32" class="w-full">
                    <div class="text-xs text-gray-400 mt-1">{{ buttonRadius }}px</div>
                  </div>
                  <div>
                    <label class="block text-xs font-medium mb-2">Button Spacing</label>
                    <input v-model="buttonSpacing" type="range" min="8" max="32" class="w-full">
                    <div class="text-xs text-gray-400 mt-1">{{ buttonSpacing }}px</div>
                  </div>
                </div>
              </div>

              <!-- Layout Controls -->
              <div class="space-y-4">
                <label class="block text-sm font-semibold mb-3 text-green-300">📐 Layout Controls</label>
                <div class="space-y-3">
                  <div>
                    <label class="block text-xs font-medium mb-2">Layout Compactness</label>
                    <input v-model="layoutCompactness" type="range" min="0" max="100" class="w-full">
                    <div class="text-xs text-gray-400 mt-1">{{ layoutCompactness }}%</div>
                  </div>
                  <div>
                    <label class="block text-xs font-medium mb-2">Label Font Size</label>
                    <input v-model="labelFontSize" type="range" min="8" max="16" class="w-full">
                    <div class="text-xs text-gray-400 mt-1">{{ labelFontSize }}px</div>
                  </div>
                  <div>
                    <label class="block text-xs font-medium mb-2">Label Opacity</label>
                    <input v-model="labelOpacity" type="range" min="0" max="100" class="w-full">
                    <div class="text-xs text-gray-400 mt-1">{{ labelOpacity }}%</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Slider Style Selector -->
            <div class="mt-6">
              <label class="block text-sm font-semibold mb-3 text-indigo-300">🎚️ Slider/Timeline Style</label>
              <div class="grid grid-cols-5 gap-2 mb-4">
                <button 
                  v-for="style in ['default', 'groove', 'pill', 'neon', 'glass']" 
                  :key="style"
                  @click="sliderStyle = style"
                  :class="[
                    'px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 border',
                    sliderStyle === style 
                      ? 'bg-green-600 text-white border-green-400' 
                      : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                  ]"
                >
                  {{ style.charAt(0).toUpperCase() + style.slice(1) }}
                </button>
              </div>
              
              <!-- Timeline Fine-tuning -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium mb-2">Timeline Height</label>
                  <input v-model="timelineHeight" type="range" min="6" max="24" class="w-full">
                  <div class="text-xs text-gray-400 mt-1">{{ timelineHeight }}px</div>
                </div>
                <div>
                  <label class="block text-xs font-medium mb-2">Timeline Radius</label>
                  <input v-model="timelineRadius" type="range" min="0" max="20" class="w-full">
                  <div class="text-xs text-gray-400 mt-1">{{ timelineRadius }}px</div>
                </div>
              </div>
            </div>

            <!-- Reset Button -->
            <div class="pt-4 border-t border-gray-700/50 flex justify-center">
              <button 
                @click="resetComponentStyles"
                class="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 rounded-lg transition-all duration-300 text-sm font-medium"
              >
                🔄 Reset All Components
              </button>
            </div>
          </div>

          <!-- Presets Tab -->
          <div v-show="activeTab === 'presets'" class="space-y-6">
            <div class="text-center mb-6">
              <h3 class="text-lg font-semibold text-pink-300">✨ Quick Presets & Actions</h3>
              <p class="text-gray-400 text-sm mt-2">Apply ready-made configurations or perform global actions</p>
            </div>

            <div class="grid grid-cols-1 gap-8">
              <!-- Preset Configurations -->
              <div>
                <label class="block text-sm font-semibold mb-4 text-purple-300">🎨 Style Presets</label>
                <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  <button 
                    v-for="preset in presets" 
                    :key="preset.name"
                    @click="applyPreset(preset)"
                    class="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium text-center"
                  >
                    {{ preset.name }}
                  </button>
                </div>
              </div>

              <!-- Global Actions -->
              <div>
                <label class="block text-sm font-semibold mb-4 text-cyan-300">⚡ Global Actions</label>
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <button 
                    @click="randomizeEffect"
                    class="px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
                  >
                    🎲 Randomize Everything
                  </button>
                  <button 
                    @click="resetToDefaults"
                    class="px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 rounded-lg transition-all duration-300 font-medium"
                  >
                    🔄 Reset to Defaults
                  </button>
                  <button 
                    @click="toggleFloatingMode"
                    :class="[
                      'px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium',
                      isFloatingMode 
                        ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800' 
                        : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                    ]"
                  >
                    {{ isFloatingMode ? '🔒 Exit Floating Mode' : '🚀 Enable Floating Mode' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Main Laboratory Area -->
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        
        <!-- Effect Preview -->
        <div class="lg:col-span-2 xl:col-span-2">
          <div class="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
            <h3 class="text-2xl font-bold mb-4 text-center">Live Preview</h3>
            
            <!-- Preview Viewport -->
            <div 
              class="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-xl overflow-hidden border border-gray-600"
              style="height: 400px;"
            >
              <!-- Background Pattern -->
              <div class="absolute inset-0 opacity-20">
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
                <div class="absolute inset-0 bg-[linear-gradient(45deg,transparent_49%,rgba(255,255,255,0.05)_49%,rgba(255,255,255,0.05)_51%,transparent_51%)] bg-[length:20px_20px]"></div>
              </div>

              <!-- Visualization Content Display (Preview Mode Only) -->
              <div v-if="!isFloatingMode" class="absolute inset-0 flex items-center justify-center p-8">
                <div class="text-center text-white max-w-lg">
                  <!-- Race Chart Content -->
                  <div v-if="currentVisualization === 'race-chart'" class="space-y-4">
                    <h3 class="text-2xl font-bold mb-4 text-cyan-300">🏁 Race Chart Visualization</h3>
                    <div class="grid grid-cols-4 gap-3 text-sm">
                      <div class="bg-black/30 rounded-lg p-3 backdrop-blur-sm">
                        <div class="text-purple-300 font-semibold">TSM</div>
                        <div class="text-xl font-bold">{{ timelineProgress > 20 ? '145' : '89' }} pts</div>
                        <div class="text-xs text-gray-400">Rank #1</div>
                      </div>
                      <div class="bg-black/30 rounded-lg p-3 backdrop-blur-sm">
                        <div class="text-blue-300 font-semibold">C9</div>
                        <div class="text-xl font-bold">{{ timelineProgress > 20 ? '132' : '76' }} pts</div>
                        <div class="text-xs text-gray-400">Rank #2</div>
                      </div>
                      <div class="bg-black/30 rounded-lg p-3 backdrop-blur-sm">
                        <div class="text-orange-300 font-semibold">FNC</div>
                        <div class="text-xl font-bold">{{ timelineProgress > 20 ? '128' : '71' }} pts</div>
                        <div class="text-xs text-gray-400">Rank #3</div>
                      </div>
                      <div class="bg-black/30 rounded-lg p-3 backdrop-blur-sm">
                        <div class="text-green-300 font-semibold">NRG</div>
                        <div class="text-xl font-bold">{{ timelineProgress > 20 ? '121' : '68' }} pts</div>
                        <div class="text-xs text-gray-400">Rank #4</div>
                      </div>
                    </div>
                    <p class="text-gray-300 text-sm mt-4">Dynamic race progression showing {{ cumulativeMode ? 'cumulative' : 'individual' }} team rankings</p>
                  </div>

                  <!-- Damage Analysis Content -->
                  <div v-else-if="currentVisualization === 'damage-analysis'" class="space-y-4">
                    <h3 class="text-2xl font-bold mb-4 text-red-300">⚔️ Damage Analysis</h3>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                      <div class="space-y-2">
                        <h4 class="text-lg font-semibold text-red-200">Damage Given</h4>
                        <div class="bg-black/30 rounded-lg p-3 backdrop-blur-sm">
                          <div class="flex justify-between items-center mb-1">
                            <span class="text-purple-300">TSM</span>
                            <span class="font-bold">{{ timelineProgress > 50 ? '24,350' : '15,200' }}</span>
                          </div>
                          <div class="w-full bg-gray-700 rounded-full h-2">
                            <div class="bg-red-500 h-2 rounded-full" :style="{ width: timelineProgress > 50 ? '85%' : '70%' }"></div>
                          </div>
                        </div>
                        <div class="bg-black/30 rounded-lg p-3 backdrop-blur-sm">
                          <div class="flex justify-between items-center mb-1">
                            <span class="text-blue-300">C9</span>
                            <span class="font-bold">{{ timelineProgress > 50 ? '22,180' : '14,800' }}</span>
                          </div>
                          <div class="w-full bg-gray-700 rounded-full h-2">
                            <div class="bg-red-500 h-2 rounded-full" :style="{ width: timelineProgress > 50 ? '78%' : '68%' }"></div>
                          </div>
                        </div>
                      </div>
                      <div class="space-y-2">
                        <h4 class="text-lg font-semibold text-blue-200">Damage Taken</h4>
                        <div class="bg-black/30 rounded-lg p-3 backdrop-blur-sm">
                          <div class="flex justify-between items-center mb-1">
                            <span class="text-purple-300">TSM</span>
                            <span class="font-bold">{{ timelineProgress > 50 ? '18,200' : '12,100' }}</span>
                          </div>
                          <div class="w-full bg-gray-700 rounded-full h-2">
                            <div class="bg-blue-500 h-2 rounded-full" :style="{ width: timelineProgress > 50 ? '65%' : '55%' }"></div>
                          </div>
                        </div>
                        <div class="bg-black/30 rounded-lg p-3 backdrop-blur-sm">
                          <div class="flex justify-between items-center mb-1">
                            <span class="text-blue-300">C9</span>
                            <span class="font-bold">{{ timelineProgress > 50 ? '19,500' : '13,200' }}</span>
                          </div>
                          <div class="w-full bg-gray-700 rounded-full h-2">
                            <div class="bg-blue-500 h-2 rounded-full" :style="{ width: timelineProgress > 50 ? '70%' : '60%' }"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p class="text-gray-300 text-sm mt-4">Team damage statistics {{ cumulativeMode ? 'across all games' : 'for current game' }}</p>
                  </div>

                  <!-- Scatter Plot Content -->
                  <div v-else-if="currentVisualization === 'scatter-plot'" class="space-y-4">
                    <h3 class="text-2xl font-bold mb-4 text-green-300">📊 Kills vs Damage Scatter</h3>
                    <div class="relative bg-black/30 rounded-lg p-4 backdrop-blur-sm h-48">
                      <!-- Scatter Plot Simulation -->
                      <div class="relative w-full h-full">
                        <!-- Axes Labels -->
                        <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">Kills →</div>
                        <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs text-gray-400">Damage ↑</div>
                        
                        <!-- Data Points -->
                        <div class="absolute w-3 h-3 bg-purple-400 rounded-full shadow-lg" 
                             :style="{ left: timelineProgress > 30 ? '75%' : '65%', bottom: timelineProgress > 30 ? '80%' : '70%' }"
                             :class="{ 'ring-4 ring-purple-300/50': triangulationMode }"
                        ></div>
                        <div class="absolute w-3 h-3 bg-blue-400 rounded-full shadow-lg"
                             :style="{ left: timelineProgress > 30 ? '70%' : '60%', bottom: timelineProgress > 30 ? '75%' : '65%' }"
                             :class="{ 'ring-4 ring-blue-300/50': triangulationMode }"
                        ></div>
                        <div class="absolute w-3 h-3 bg-orange-400 rounded-full shadow-lg"
                             :style="{ left: timelineProgress > 30 ? '65%' : '55%', bottom: timelineProgress > 30 ? '70%' : '60%' }"
                             :class="{ 'ring-4 ring-orange-300/50': triangulationMode }"
                        ></div>
                        <div class="absolute w-3 h-3 bg-green-400 rounded-full shadow-lg"
                             :style="{ left: timelineProgress > 30 ? '60%' : '50%', bottom: timelineProgress > 30 ? '65%' : '55%' }"
                             :class="{ 'ring-4 ring-green-300/50': triangulationMode }"
                        ></div>

                        <!-- Triangulation Lines (when enabled) -->
                        <div v-if="triangulationMode" class="absolute inset-0">
                          <svg class="w-full h-full">
                            <line x1="75%" y1="20%" x2="70%" y2="25%" stroke="rgba(139, 92, 246, 0.5)" stroke-width="1"/>
                            <line x1="70%" y1="25%" x2="65%" y2="30%" stroke="rgba(139, 92, 246, 0.5)" stroke-width="1"/>
                            <line x1="65%" y1="30%" x2="75%" y2="20%" stroke="rgba(139, 92, 246, 0.5)" stroke-width="1"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <p class="text-gray-300 text-sm mt-4">Performance correlation showing {{ cumulativeMode ? 'total' : 'game-specific' }} metrics</p>
                  </div>
                </div>
              </div>
              
              <!-- The Experimental Dock (Preview Mode Only) -->
              <div 
                v-if="!isFloatingMode"
                :class="[
                  'experimental-dock',
                  `dock-${currentEffect}`,
                  `component-${componentStyle}`,
                  `slider-${sliderStyle}`,
                  animationEnabled ? 'dock-animated' : ''
                ]"
                :style="{ ...dockStyles, ...componentStyles }"
              >
                <!-- Universal Controls -->
                <div class="dock-controls">
                  <!-- Play Button -->
                  <button class="dock-play-btn" @click="togglePlay">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path v-if="!isPlaying" d="M8 5v10l8-5-8-5z"/>
                      <path v-else d="M6 4h4v12H6V4zm8 0h-4v12h4V4z"/>
                    </svg>
                  </button>

                  <!-- Timeline Scrubber -->
                  <div class="dock-timeline" :style="timelineStyles">
                    <div class="timeline-track">
                      <div 
                        class="timeline-progress" 
                        :style="{ width: `${timelineProgress}%` }"
                      ></div>
                      <div 
                        class="timeline-thumb" 
                        :style="{ left: `${timelineProgress}%` }"
                        @mousedown="startDragging"
                      ></div>
                    </div>
                    <div class="timeline-labels">
                      <span>G1</span>
                      <span>G5</span>
                      <span>G10</span>
                    </div>
                  </div>

                  <!-- Context-Aware Toggle Buttons -->
                  <div class="dock-toggles">
                    <!-- Universal Cumulative/Individual Toggle -->
                    <button 
                      :class="['dock-toggle', cumulativeMode ? 'active' : '']"
                      @click="cumulativeMode = !cumulativeMode"
                      title="Cumulative vs Individual data mode"
                    >
                      {{ cumulativeMode ? 'CUM' : 'IND' }}
                    </button>
                    
                    
                    <!-- Damage Analysis Specific: Player Breakdown Toggle -->
                    <button 
                      v-if="currentVisualization === 'damage-analysis'"
                      :class="['dock-toggle', playerBreakdownMode ? 'active' : '']"
                      @click="playerBreakdownMode = !playerBreakdownMode"
                      title="Toggle player-wise breakdown"
                    >
                      {{ playerBreakdownMode ? 'PLY' : 'TM' }}
                    </button>
                    
                    <!-- Scatter Plot Specific: Triangulation Toggle -->
                    <button 
                      v-if="currentVisualization === 'scatter-plot'"
                      :class="['dock-toggle', triangulationMode ? 'active' : '']"
                      @click="triangulationMode = !triangulationMode"
                      title="Toggle triangulation mode"
                    >
                      ◢
                    </button>
                  </div>

                  <!-- Menu Button -->
                  <button class="dock-menu-btn">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                    </svg>
                  </button>
                </div>

                <!-- Dynamic Background Effects -->
                <div class="dock-bg-effects">
                  <div v-if="currentEffect === 'particle'" class="particle-system">
                    <div v-for="i in 20" :key="i" class="particle" :style="getParticleStyle(i)"></div>
                  </div>
                  <div v-if="currentEffect === 'holographic'" class="holographic-grid"></div>
                  <div v-if="currentEffect === 'quantum'" class="quantum-field">
                    <div v-for="i in 8" :key="i" class="quantum-orb" :style="getQuantumOrbStyle(i)"></div>
                  </div>
                  <div v-if="currentEffect === 'neural'" class="neural-network">
                    <svg class="neural-svg" viewBox="0 0 200 80">
                      <g v-for="i in 12" :key="i" class="neural-node" :transform="`translate(${(i % 4) * 50 + 25}, ${Math.floor(i / 4) * 25 + 15})`">
                        <circle cx="0" cy="0" r="3" class="neural-dot"/>
                        <line v-if="i < 8" :x1="0" :y1="0" :x2="50" :y2="0" class="neural-line"/>
                        <line v-if="i % 4 !== 3 && i < 8" :x1="0" :y1="0" :x2="50" :y2="25" class="neural-line"/>
                        <line v-if="i % 4 !== 0 && i < 8" :x1="0" :y1="0" :x2="50" :y2="-25" class="neural-line"/>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Floating Mode Placeholder -->
              <div v-else class="flex items-center justify-center h-full">
                <div class="text-center text-white/70">
                  <div class="text-6xl mb-4">🚀</div>
                  <h3 class="text-xl font-bold mb-2">Floating Dock Active</h3>
                  <p class="text-sm">The dock is now floating at the bottom of your screen</p>
                  <p class="text-xs mt-2 text-gray-400">Scroll up and down to see how it stays in position</p>
                </div>
              </div>

              <!-- Effect Information -->
              <div class="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
                <h4 class="text-sm font-bold mb-1">{{ getEffectName(currentEffect) }}</h4>
                <div class="text-xs text-gray-300 space-y-1">
                  <div>Mode: {{ getVisualizationName(currentVisualization) }}</div>
                  <div>Size: {{ dockWidth }}×{{ dockHeight }}</div>
                  <div>Animation: {{ animationEnabled ? 'ON' : 'OFF' }}</div>
                  <div>Data: {{ cumulativeMode ? 'Cumulative' : 'Individual' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Effect Gallery -->
        <div>
          <div class="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
            <h3 class="text-xl font-bold mb-4">Effect Gallery</h3>
            <div class="grid grid-cols-2 gap-3">
              <div 
                v-for="effect in availableEffects" 
                :key="effect.id"
                :class="[
                  'gallery-item',
                  currentEffect === effect.id ? 'active' : ''
                ]"
                @click="currentEffect = effect.id"
              >
                <div class="gallery-preview" :class="`preview-${effect.id}`">
                  <div class="mini-dock">
                    <div class="mini-play"></div>
                    <div class="mini-timeline"></div>
                  </div>
                </div>
                <span class="gallery-label">{{ effect.name }}</span>
              </div>
            </div>
          </div>

          <!-- Component Styles Gallery -->
          <div class="mt-6 bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
            <h3 class="text-xl font-bold mb-4">Component Styles</h3>
            <div class="grid grid-cols-2 gap-3">
              <div 
                v-for="style in ['modern', 'minimal', 'rounded', 'sharp']" 
                :key="style"
                :class="[
                  'gallery-item',
                  componentStyle === style ? 'active' : ''
                ]"
                @click="componentStyle = style"
              >
                <div class="component-preview" :class="`component-${style}`">
                  <div class="mini-dock">
                    <div class="mini-play" :class="`style-${style}`"></div>
                    <div class="mini-timeline" :class="`style-${style}`"></div>
                    <div class="mini-toggle" :class="`style-${style}`"></div>
                  </div>
                </div>
                <span class="gallery-label">{{ style.charAt(0).toUpperCase() + style.slice(1) }}</span>
              </div>
            </div>
          </div>

          <!-- Slider Styles Gallery -->
          <div class="mt-6 bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
            <h3 class="text-xl font-bold mb-4">Slider Styles</h3>
            <div class="grid grid-cols-1 gap-3">
              <div 
                v-for="style in ['default', 'groove', 'pill', 'neon', 'glass']" 
                :key="style"
                :class="[
                  'gallery-item',
                  sliderStyle === style ? 'active' : ''
                ]"
                @click="sliderStyle = style"
              >
                <div class="slider-preview" :class="`slider-${style}`">
                  <div class="mini-slider-track">
                    <div class="mini-slider-progress"></div>
                    <div class="mini-slider-thumb"></div>
                  </div>
                </div>
                <span class="gallery-label">{{ style.charAt(0).toUpperCase() + style.slice(1) }}</span>
              </div>
            </div>
          </div>

          <!-- Performance Monitor -->
          <div class="mt-6 bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
            <h3 class="text-lg font-bold mb-3">Performance Monitor</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm">GPU Usage</span>
                <div class="w-24 h-2 bg-gray-700 rounded-full">
                  <div class="h-full bg-green-500 rounded-full" :style="{ width: `${gpuUsage}%` }"></div>
                </div>
                <span class="text-xs">{{ gpuUsage }}%</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm">FPS</span>
                <span class="text-lg font-mono">{{ fps }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm">Memory</span>
                <span class="text-xs">{{ memoryUsage }}MB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Code Export -->
      <div class="mt-8 bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
        <h3 class="text-xl font-bold mb-4">Generated CSS</h3>
        <pre class="bg-gray-900 rounded-lg p-4 text-sm overflow-x-auto"><code>{{ generatedCSS }}</code></pre>
        <button 
          @click="copyCSS"
          class="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
        >
          📋 Copy CSS
        </button>
      </div>
      
      <!-- Navigation Back -->
      <div class="mt-12 text-center">
        <router-link 
          to="/" 
          class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
        >
          ← Back to Dashboard
        </router-link>
      </div>
    </div>

    <!-- Floating Dock Overlay (when enabled) -->
    <div 
      v-if="isFloatingMode"
      :class="[
        'floating-dock-overlay',
        `dock-${currentEffect}`,
        `component-${componentStyle}`,
        `slider-${sliderStyle}`,
        animationEnabled ? 'dock-animated' : ''
      ]"
      :style="{ ...floatingDockStyles, ...componentStyles }"
    >
      <!-- Universal Controls -->
      <div class="dock-controls">
        <!-- Play Button -->
        <button class="dock-play-btn" @click="togglePlay">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path v-if="!isPlaying" d="M8 5v10l8-5-8-5z"/>
            <path v-else d="M6 4h4v12H6V4zm8 0h-4v12h4V4z"/>
          </svg>
        </button>

        <!-- Timeline Scrubber -->
        <div class="dock-timeline" :style="timelineStyles">
          <div class="timeline-track">
            <div 
              class="timeline-progress" 
              :style="{ width: `${timelineProgress}%` }"
            ></div>
            <div 
              class="timeline-thumb" 
              :style="{ left: `${timelineProgress}%` }"
              @mousedown="startDragging"
            ></div>
          </div>
          <div class="timeline-labels">
            <span>G1</span>
            <span>G5</span>
            <span>G10</span>
          </div>
        </div>

        <!-- Context-Aware Toggle Buttons -->
        <div class="dock-toggles">
          <!-- Universal Cumulative/Individual Toggle -->
          <button 
            :class="['dock-toggle', cumulativeMode ? 'active' : '']"
            @click="cumulativeMode = !cumulativeMode"
            title="Cumulative vs Individual data mode"
          >
            {{ cumulativeMode ? 'CUM' : 'IND' }}
          </button>
          
          
          <!-- Damage Analysis Specific: Player Breakdown Toggle -->
          <button 
            v-if="currentVisualization === 'damage-analysis'"
            :class="['dock-toggle', playerBreakdownMode ? 'active' : '']"
            @click="playerBreakdownMode = !playerBreakdownMode"
            title="Toggle player-wise breakdown"
          >
            {{ playerBreakdownMode ? 'PLY' : 'TM' }}
          </button>
          
          <!-- Scatter Plot Specific: Triangulation Toggle -->
          <button 
            v-if="currentVisualization === 'scatter-plot'"
            :class="['dock-toggle', triangulationMode ? 'active' : '']"
            @click="triangulationMode = !triangulationMode"
            title="Toggle triangulation mode"
          >
            ◢
          </button>
        </div>

        <!-- Menu Button -->
        <button class="dock-menu-btn">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
          </svg>
        </button>
      </div>

      <!-- Dynamic Background Effects -->
      <div class="dock-bg-effects">
        <div v-if="currentEffect === 'particle'" class="particle-system">
          <div v-for="i in 20" :key="i" class="particle" :style="getParticleStyle(i)"></div>
        </div>
        <div v-if="currentEffect === 'holographic'" class="holographic-grid"></div>
        <div v-if="currentEffect === 'quantum'" class="quantum-field">
          <div v-for="i in 8" :key="i" class="quantum-orb" :style="getQuantumOrbStyle(i)"></div>
        </div>
        <div v-if="currentEffect === 'neural'" class="neural-network">
          <svg class="neural-svg" viewBox="0 0 200 80">
            <g v-for="i in 12" :key="i" class="neural-node" :transform="`translate(${(i % 4) * 50 + 25}, ${Math.floor(i / 4) * 25 + 15})`">
              <circle cx="0" cy="0" r="3" class="neural-dot"/>
              <line v-if="i < 8" :x1="0" :y1="0" :x2="50" :y2="0" class="neural-line"/>
              <line v-if="i % 4 !== 3 && i < 8" :x1="0" :y1="0" :x2="50" :y2="25" class="neural-line"/>
              <line v-if="i % 4 !== 0 && i < 8" :x1="0" :y1="0" :x2="50" :y2="-25" class="neural-line"/>
            </g>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

// Reactive state
const currentEffect = ref('glassmorphic')
const currentVisualization = ref('race-chart')
const dockWidth = ref(450)
const dockHeight = ref(80)
const animationEnabled = ref(true)
const animationSpeed = ref(1.5)
const primaryColor = ref('#8b5cf6')
const secondaryColor = ref('#06b6d4')
const blurIntensity = ref(20)
const opacity = ref(80)
const borderRadius = ref(12)
const glowStrength = ref(30)
const depthStrength = ref(10)

// Interactive state
const isPlaying = ref(false)
const timelineProgress = ref(35)
const cumulativeMode = ref(true)
const triangulationMode = ref(false)
const isDragging = ref(false)

// Visualization-specific state
const playerBreakdownMode = ref(false) // team vs player-wise breakdown

// Floating dock mode
const isFloatingMode = ref(false)

// Tab navigation
const activeTab = ref('basic')
const controlTabs = [
  { id: 'basic', name: 'Basic', icon: '⚙️' },
  { id: 'effects', name: 'Effects', icon: '🎨' },
  { id: 'components', name: 'Components', icon: '🔧' },
  { id: 'presets', name: 'Presets', icon: '✨' }
]

// Component customization state
const buttonSize = ref(40) // 40px default
const buttonRadius = ref(8) // 8px border radius
const buttonSpacing = ref(16) // 16px gap between buttons
const timelineHeight = ref(12) // 12px timeline height
const timelineRadius = ref(6) // 6px timeline border radius
const labelFontSize = ref(12) // 12px font size for labels
const labelOpacity = ref(70) // 70% opacity for labels
const layoutCompactness = ref(50) // 50% compactness (affects padding)
const componentStyle = ref('modern') // modern, minimal, rounded, sharp
const sliderStyle = ref('default') // default, groove, pill, neon, glass

// Performance monitoring
const fps = ref(60)
const gpuUsage = ref(42)
const memoryUsage = ref(128)

// Available effects
const availableEffects = [
  { id: 'glassmorphic', name: '🔮 Glass' },
  { id: 'holographic', name: '✨ Holo' },
  { id: 'morphing', name: '🌊 Morph' },
  { id: 'neon', name: '⚡ Neon' },
  { id: 'particle', name: '🎆 Particle' },
  { id: 'cyberpunk', name: '🤖 Cyber' },
  { id: 'quantum', name: '⚛️ Quantum' },
  { id: 'liquid', name: '💧 Liquid' },
  { id: 'plasma', name: '🔥 Plasma' },
  { id: 'matrix', name: '💊 Matrix' },
  { id: 'cosmic', name: '🌌 Cosmic' },
  { id: 'neural', name: '🧠 Neural' }
]

// Presets
const presets = [
  {
    name: '✨ Default Glass',
    values: { currentEffect: 'glassmorphic', blurIntensity: 20, opacity: 80, glowStrength: 30 }
  },
  {
    name: '🔥 Plasma Storm',
    values: { currentEffect: 'plasma', blurIntensity: 15, opacity: 90, glowStrength: 70, animationSpeed: 2.5 }
  },
  {
    name: '⚛️ Quantum Field',
    values: { currentEffect: 'quantum', blurIntensity: 25, opacity: 70, glowStrength: 50, animationSpeed: 1.2 }
  },
  {
    name: '🌊 Liquid Dream',
    values: { currentEffect: 'liquid', blurIntensity: 30, opacity: 85, glowStrength: 40, animationSpeed: 0.8 }
  },
  {
    name: '🤖 Cyber Punk',
    values: { currentEffect: 'cyberpunk', blurIntensity: 5, opacity: 95, glowStrength: 80, primaryColor: '#00ff41' }
  }
]

// Computed styles
const dockStyles = computed(() => ({
  width: `${dockWidth.value}px`,
  height: `${dockHeight.value}px`,
  '--primary-color': primaryColor.value,
  '--secondary-color': secondaryColor.value,
  '--blur-intensity': `${blurIntensity.value}px`,
  '--opacity': `${opacity.value}%`,
  '--border-radius': `${borderRadius.value}px`,
  '--glow-strength': `${glowStrength.value}%`,
  '--depth-strength': `${depthStrength.value}px`,
  '--animation-speed': `${animationSpeed.value}s`,
  opacity: opacity.value / 100,
  filter: `blur(${blurIntensity.value * 0.1}px)`,
  borderRadius: `${borderRadius.value}px`
}))

const timelineStyles = computed(() => ({
  flex: '1',
  minWidth: `${Math.max(200, dockWidth.value * 0.4)}px`
}))

const floatingDockStyles = computed(() => ({
  ...dockStyles.value,
  position: 'fixed',
  bottom: '32px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 9999
}))

const componentStyles = computed(() => ({
  '--button-size': `${buttonSize.value}px`,
  '--button-radius': `${buttonRadius.value}px`,
  '--button-spacing': `${buttonSpacing.value}px`,
  '--timeline-height': `${timelineHeight.value}px`,
  '--timeline-radius': `${timelineRadius.value}px`,
  '--label-font-size': `${labelFontSize.value}px`,
  '--label-opacity': `${labelOpacity.value}%`,
  '--layout-padding': `${Math.max(12, layoutCompactness.value * 0.24)}px`,
  '--layout-gap': `${Math.max(8, layoutCompactness.value * 0.16)}px`
}))

const generatedCSS = computed(() => {
  return `.dock-${currentEffect.value} {
  width: ${dockWidth.value}px;
  height: ${dockHeight.value}px;
  backdrop-filter: blur(${blurIntensity.value}px);
  opacity: ${opacity.value / 100};
  border-radius: ${borderRadius.value}px;
  background: ${getEffectBackground()};
  box-shadow: ${getEffectShadow()};
  ${animationEnabled.value ? `animation: dock-effect ${animationSpeed.value}s infinite;` : ''}
}`
})

// Methods
const getEffectName = (effect: string) => {
  return availableEffects.find(e => e.id === effect)?.name || effect
}

const getVisualizationName = (viz: string) => {
  const modes = {
    'race-chart': '🏁 Race Chart',
    'damage-analysis': '⚔️ Damage Analysis', 
    'scatter-plot': '📊 Scatter Plot'
  }
  return modes[viz as keyof typeof modes] || viz
}

const getEffectBackground = () => {
  const effects: Record<string, string> = {
    glassmorphic: `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))`,
    holographic: `linear-gradient(45deg, ${primaryColor.value}20, ${secondaryColor.value}20)`,
    neon: `linear-gradient(90deg, ${primaryColor.value}40, ${secondaryColor.value}40)`,
    plasma: `radial-gradient(circle, ${primaryColor.value}60, ${secondaryColor.value}60)`,
    quantum: `conic-gradient(from 180deg, ${primaryColor.value}30, ${secondaryColor.value}30, ${primaryColor.value}30)`,
    liquid: `linear-gradient(270deg, ${primaryColor.value}50, ${secondaryColor.value}50)`,
    matrix: `linear-gradient(135deg, #00330020, #00ff4120)`,
    cyberpunk: `linear-gradient(45deg, #ff003350, #00ffff50)`,
    cosmic: `radial-gradient(ellipse, #4c1d9560, #7c3aed60)`,
    neural: `linear-gradient(90deg, rgba(99,102,241,0.3), rgba(168,85,247,0.3))`,
    morphing: `linear-gradient(45deg, ${primaryColor.value}40, ${secondaryColor.value}40)`,
    particle: `rgba(0,0,0,0.3)`
  }
  return effects[currentEffect.value] || effects.glassmorphic
}

const getEffectShadow = () => {
  const strength = glowStrength.value
  const effects: Record<string, string> = {
    glassmorphic: `0 8px 32px rgba(31, 38, 135, 0.${strength})`,
    holographic: `0 0 ${strength}px ${primaryColor.value}80, inset 0 0 ${strength}px ${secondaryColor.value}40`,
    neon: `0 0 ${strength * 2}px ${primaryColor.value}, 0 0 ${strength * 4}px ${secondaryColor.value}80`,
    plasma: `0 0 ${strength}px ${primaryColor.value}60, 0 ${strength/2}px ${strength}px rgba(0,0,0,0.3)`,
    quantum: `0 0 ${strength}px rgba(147, 51, 234, 0.6), inset 0 0 ${strength/2}px rgba(59, 130, 246, 0.4)`,
    liquid: `0 4px ${strength}px rgba(0,0,0,0.3), 0 0 ${strength}px ${primaryColor.value}40`,
    matrix: `0 0 ${strength}px #00ff41, inset 0 0 ${strength/2}px #00330040`,
    cyberpunk: `0 0 ${strength}px #ff0033, 0 0 ${strength * 2}px #00ffff80`,
    cosmic: `0 0 ${strength}px #7c3aed80, 0 ${strength/3}px ${strength}px rgba(0,0,0,0.4)`,
    neural: `0 0 ${strength}px rgba(99,102,241,0.6), inset 0 0 ${strength/3}px rgba(168,85,247,0.3)`,
    morphing: `0 4px ${strength}px rgba(0,0,0,0.2), 0 0 ${strength}px ${primaryColor.value}50`,
    particle: `0 0 ${strength}px rgba(139, 92, 246, 0.6)`
  }
  return effects[currentEffect.value] || effects.glassmorphic
}

const getParticleStyle = (index: number) => ({
  left: `${(index * 23) % 100}%`,
  animationDelay: `${index * 0.2}s`,
  animationDuration: `${2 + (index % 3)}s`
})

const getQuantumOrbStyle = (index: number) => ({
  left: `${10 + (index * 35) % 80}%`,
  top: `${20 + (index * 20) % 40}%`,
  animationDelay: `${index * 0.3}s`,
  animationDuration: `${3 + (index % 2)}s`
})

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
}


const toggleFloatingMode = () => {
  isFloatingMode.value = !isFloatingMode.value
}

const resetComponentStyles = () => {
  buttonSize.value = 40
  buttonRadius.value = 8
  buttonSpacing.value = 16
  timelineHeight.value = 12
  timelineRadius.value = 6
  labelFontSize.value = 12
  labelOpacity.value = 70
  layoutCompactness.value = 50
  componentStyle.value = 'modern'
  sliderStyle.value = 'default'
}

const startDragging = (event: MouseEvent) => {
  isDragging.value = true
  const rect = (event.target as HTMLElement).closest('.timeline-track')?.getBoundingClientRect()
  if (rect) {
    const x = event.clientX - rect.left
    timelineProgress.value = Math.max(0, Math.min(100, (x / rect.width) * 100))
  }
}

const applyPreset = (preset: any) => {
  Object.entries(preset.values).forEach(([key, value]) => {
    const refKey = key as keyof typeof preset.values
    if (refKey === 'currentEffect') currentEffect.value = value as string
    else if (refKey === 'blurIntensity') blurIntensity.value = value as number
    else if (refKey === 'opacity') opacity.value = value as number
    else if (refKey === 'glowStrength') glowStrength.value = value as number
    else if (refKey === 'animationSpeed') animationSpeed.value = value as number
    else if (refKey === 'primaryColor') primaryColor.value = value as string
  })
}

const randomizeEffect = () => {
  currentEffect.value = availableEffects[Math.floor(Math.random() * availableEffects.length)].id
  dockWidth.value = 200 + Math.random() * 400
  dockHeight.value = 40 + Math.random() * 60
  blurIntensity.value = Math.random() * 40
  opacity.value = 50 + Math.random() * 50
  glowStrength.value = Math.random() * 80
  animationSpeed.value = 0.5 + Math.random() * 2.5
  
  // Random colors
  const colors = ['#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#10b981', '#f97316', '#ec4899']
  primaryColor.value = colors[Math.floor(Math.random() * colors.length)]
  secondaryColor.value = colors[Math.floor(Math.random() * colors.length)]
}

const resetToDefaults = () => {
  currentEffect.value = 'glassmorphic'
  dockWidth.value = 450
  dockHeight.value = 80
  animationEnabled.value = true
  animationSpeed.value = 1.5
  primaryColor.value = '#8b5cf6'
  secondaryColor.value = '#06b6d4'
  blurIntensity.value = 20
  opacity.value = 80
  borderRadius.value = 12
  glowStrength.value = 30
  depthStrength.value = 10
}

const copyCSS = () => {
  navigator.clipboard.writeText(generatedCSS.value)
}

// Performance monitoring simulation
let animationFrame: number
const updatePerformance = () => {
  fps.value = 60 - Math.floor(Math.random() * 5)
  gpuUsage.value = 30 + Math.floor(Math.random() * 40)
  memoryUsage.value = 100 + Math.floor(Math.random() * 100)
  animationFrame = requestAnimationFrame(updatePerformance)
}

onMounted(() => {
  updatePerformance()
  
  // Auto-play timeline
  const interval = setInterval(() => {
    if (isPlaying.value) {
      timelineProgress.value = (timelineProgress.value + 1) % 100
    }
  }, 100)

  onUnmounted(() => {
    clearInterval(interval)
    cancelAnimationFrame(animationFrame)
  })
})

// Handle mouse events for timeline dragging
const handleMouseMove = (event: MouseEvent) => {
  if (isDragging.value) {
    const rect = document.querySelector('.timeline-track')?.getBoundingClientRect()
    if (rect) {
      const x = event.clientX - rect.left
      timelineProgress.value = Math.max(0, Math.min(100, (x / rect.width) * 100))
    }
  }
}

const handleMouseUp = () => {
  isDragging.value = false
}

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})
</script>

<style scoped>
/* Base Experimental Dock */
.experimental-dock {
  @apply absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 px-6 py-4;
  backdrop-filter: blur(var(--blur-intensity, 20px));
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  z-index: 100;
}

/* Floating Dock Overlay */
.floating-dock-overlay {
  @apply flex items-center gap-4 px-6 py-4;
  backdrop-filter: blur(var(--blur-intensity, 20px));
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  pointer-events: auto;
}

.dock-controls {
  @apply flex items-center w-full;
  gap: var(--button-spacing, 16px);
  padding: var(--layout-padding, 16px);
}

/* Play Button */
.dock-play-btn {
  @apply flex items-center justify-center text-white transition-all duration-300 cursor-pointer;
  width: var(--button-size, 40px);
  height: var(--button-size, 40px);
  border-radius: var(--button-radius, 8px);
  background: linear-gradient(135deg, var(--primary-color, #8b5cf6), var(--secondary-color, #06b6d4));
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
}

.dock-play-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6);
}

/* Timeline */
.dock-timeline {
  @apply flex flex-col gap-2;
}

.timeline-track {
  @apply relative bg-gray-700/50 cursor-pointer;
  height: var(--timeline-height, 12px);
  border-radius: var(--timeline-radius, 6px);
}

.timeline-progress {
  @apply absolute left-0 top-0 h-full;
  border-radius: var(--timeline-radius, 6px);
  background: linear-gradient(90deg, var(--primary-color, #8b5cf6), var(--secondary-color, #06b6d4));
  transition: width 0.1s ease;
}

.timeline-thumb {
  @apply absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full shadow-lg cursor-grab;
  transition: transform 0.1s ease;
}

.timeline-thumb:hover {
  transform: translate(-50%, -50%) scale(1.2);
}

.timeline-labels {
  @apply flex justify-between text-gray-400 px-1;
  font-size: var(--label-font-size, 12px);
  opacity: calc(var(--label-opacity, 70) / 100);
}

/* Toggle Buttons */
.dock-toggles {
  @apply flex;
  gap: calc(var(--button-spacing, 16px) / 2);
}

.dock-toggle {
  @apply bg-gray-700/50 text-white text-xs font-bold transition-all duration-300;
  width: var(--button-size, 40px);
  height: var(--button-size, 40px);
  border-radius: var(--button-radius, 8px);
  backdrop-filter: blur(10px);
}

.dock-toggle.active {
  @apply bg-gradient-to-r;
  background: linear-gradient(135deg, var(--primary-color, #8b5cf6), var(--secondary-color, #06b6d4));
}

.dock-toggle:hover {
  transform: scale(1.05);
}

/* Menu Button */
.dock-menu-btn {
  @apply bg-gray-700/50 text-white flex items-center justify-center transition-all duration-300;
  width: var(--button-size, 40px);
  height: var(--button-size, 40px);
  border-radius: var(--button-radius, 8px);
  backdrop-filter: blur(10px);
}

.dock-menu-btn:hover {
  transform: scale(1.05);
  background: rgba(139, 92, 246, 0.3);
}

/* Background Effects Container */
.dock-bg-effects {
  @apply absolute inset-0 pointer-events-none overflow-hidden;
  border-radius: inherit;
}

/* Effect Styles */

/* Glassmorphic */
.dock-glassmorphic {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(var(--blur-intensity, 20px)) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px rgba(31, 38, 135, 0.37),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Holographic */
.dock-holographic {
  background: linear-gradient(45deg, 
    rgba(139, 92, 246, 0.2) 0%, 
    rgba(6, 182, 212, 0.2) 25%,
    rgba(139, 92, 246, 0.2) 50%,
    rgba(6, 182, 212, 0.2) 75%,
    rgba(139, 92, 246, 0.2) 100%
  );
  background-size: 400% 400%;
  border: 1px solid rgba(139, 92, 246, 0.3);
  box-shadow: 
    0 0 30px rgba(139, 92, 246, 0.4),
    inset 0 0 30px rgba(6, 182, 212, 0.2);
}

.dock-holographic.dock-animated {
  animation: holographic-shift var(--animation-speed, 1.5s) ease-in-out infinite;
}

.holographic-grid {
  @apply absolute inset-0;
  background-image: 
    linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  animation: grid-drift var(--animation-speed, 1.5s) linear infinite;
}

/* Morphing */
.dock-morphing {
  background: linear-gradient(270deg, var(--primary-color, #8b5cf6)40, var(--secondary-color, #06b6d4)40);
  background-size: 200% 200%;
  border: 1px solid rgba(139, 92, 246, 0.4);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
}

.dock-morphing.dock-animated {
  animation: morphing-gradient var(--animation-speed, 1.5s) ease-in-out infinite;
}

/* Neon */
.dock-neon {
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid var(--primary-color, #8b5cf6);
  box-shadow: 
    0 0 20px var(--primary-color, #8b5cf6),
    0 0 40px var(--secondary-color, #06b6d4)80,
    inset 0 0 20px rgba(139, 92, 246, 0.1);
}

.dock-neon.dock-animated {
  animation: neon-pulse var(--animation-speed, 1.5s) ease-in-out infinite;
}

/* Particle */
.dock-particle {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(139, 92, 246, 0.3);
  box-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
}

.particle-system {
  @apply absolute inset-0;
}

.particle {
  @apply absolute w-1 h-1 bg-purple-400 rounded-full;
  animation: particle-float 3s linear infinite;
  opacity: 0.7;
}

/* Cyberpunk */
.dock-cyberpunk {
  background: linear-gradient(45deg, rgba(255, 0, 51, 0.3), rgba(0, 255, 255, 0.3));
  border: 2px solid #00ffff;
  box-shadow: 
    0 0 20px #ff0033,
    0 0 40px #00ffff80,
    inset 0 0 10px rgba(0, 255, 255, 0.2);
  clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 100%, 20px 100%);
}

.dock-cyberpunk.dock-animated {
  animation: cyberpunk-glitch var(--animation-speed, 1.5s) ease-in-out infinite;
}

/* Quantum */
.dock-quantum {
  background: conic-gradient(from 180deg, 
    rgba(147, 51, 234, 0.3) 0deg,
    rgba(59, 130, 246, 0.3) 90deg,
    rgba(147, 51, 234, 0.3) 180deg,
    rgba(59, 130, 246, 0.3) 270deg,
    rgba(147, 51, 234, 0.3) 360deg
  );
  border: 1px solid rgba(147, 51, 234, 0.4);
  box-shadow: 0 0 30px rgba(147, 51, 234, 0.6);
}

.dock-quantum.dock-animated {
  animation: quantum-spin var(--animation-speed, 1.5s) linear infinite;
}

.quantum-field {
  @apply absolute inset-0;
}

.quantum-orb {
  @apply absolute w-2 h-2 bg-purple-400 rounded-full;
  animation: quantum-orbit 4s linear infinite;
  opacity: 0.8;
}

/* Liquid */
.dock-liquid {
  background: linear-gradient(270deg, var(--primary-color, #8b5cf6)50, var(--secondary-color, #06b6d4)50);
  background-size: 400% 400%;
  border: 1px solid rgba(139, 92, 246, 0.3);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  border-radius: 50px;
}

.dock-liquid.dock-animated {
  animation: liquid-flow var(--animation-speed, 1.5s) ease-in-out infinite;
}

/* Plasma */
.dock-plasma {
  background: radial-gradient(circle at 50% 50%, 
    rgba(139, 92, 246, 0.6) 0%,
    rgba(6, 182, 212, 0.6) 30%,
    rgba(139, 92, 246, 0.6) 60%,
    rgba(6, 182, 212, 0.6) 100%
  );
  background-size: 200% 200%;
  border: 1px solid rgba(139, 92, 246, 0.5);
  box-shadow: 0 0 40px rgba(139, 92, 246, 0.7);
}

.dock-plasma.dock-animated {
  animation: plasma-swirl var(--animation-speed, 1.5s) linear infinite;
}

/* Matrix */
.dock-matrix {
  background: linear-gradient(135deg, rgba(0, 51, 0, 0.8), rgba(0, 255, 65, 0.2));
  border: 1px solid #00ff41;
  box-shadow: 
    0 0 20px #00ff41,
    inset 0 0 20px rgba(0, 51, 0, 0.4);
  font-family: 'Courier New', monospace;
}

.dock-matrix.dock-animated {
  animation: matrix-flicker var(--animation-speed, 1.5s) ease-in-out infinite;
}

/* Cosmic */
.dock-cosmic {
  background: radial-gradient(ellipse at center, 
    rgba(76, 29, 149, 0.6) 0%,
    rgba(124, 58, 237, 0.6) 50%,
    rgba(30, 58, 138, 0.6) 100%
  );
  border: 1px solid rgba(124, 58, 237, 0.4);
  box-shadow: 
    0 0 40px rgba(124, 58, 237, 0.8),
    0 20px 40px rgba(0, 0, 0, 0.4);
}

.dock-cosmic.dock-animated {
  animation: cosmic-pulse var(--animation-speed, 1.5s) ease-in-out infinite;
}

/* Neural */
.dock-neural {
  background: linear-gradient(90deg, 
    rgba(99, 102, 241, 0.3) 0%,
    rgba(168, 85, 247, 0.3) 100%
  );
  border: 1px solid rgba(99, 102, 241, 0.4);
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.6);
}

.neural-network {
  @apply absolute inset-0;
}

.neural-svg {
  @apply w-full h-full opacity-30;
}

.neural-dot {
  fill: #6366f1;
  animation: neural-pulse 2s ease-in-out infinite;
}

.neural-line {
  stroke: #6366f1;
  stroke-width: 0.5;
  opacity: 0.5;
  animation: neural-flow 3s linear infinite;
}

/* Gallery Styles */
.gallery-item {
  @apply p-3 rounded-lg cursor-pointer transition-all duration-300 border border-gray-700;
  background: rgba(55, 65, 81, 0.5);
}

.gallery-item:hover {
  @apply border-purple-500 bg-gray-700/70;
  transform: scale(1.02);
}

.gallery-item.active {
  @apply border-purple-400 bg-purple-900/30;
}

.gallery-preview {
  @apply w-full h-12 rounded mb-2 flex items-center justify-center relative overflow-hidden;
}

.mini-dock {
  @apply flex items-center gap-1 px-2 py-1 rounded;
  background: rgba(0, 0, 0, 0.5);
}

.mini-play {
  @apply w-2 h-2 bg-purple-400 rounded-full;
}

.mini-timeline {
  @apply w-8 h-1 bg-gray-600 rounded-full relative;
}

.mini-timeline::after {
  content: '';
  @apply absolute left-0 top-0 w-3 h-full bg-purple-400 rounded-full;
}

/* Preview-specific styles */
.preview-glassmorphic { 
  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
  backdrop-filter: blur(10px);
}

.preview-holographic { 
  background: linear-gradient(45deg, #8b5cf640, #06b6d440);
  animation: preview-holographic 2s ease-in-out infinite;
}

.preview-neon { 
  background: rgba(0,0,0,0.8);
  box-shadow: 0 0 10px #8b5cf6;
}

.preview-plasma { 
  background: radial-gradient(circle, #8b5cf660, #06b6d460);
  animation: preview-plasma 1.5s linear infinite;
}

.preview-quantum { 
  background: conic-gradient(from 0deg, #9333ea50, #3b82f650, #9333ea50);
  animation: preview-quantum 2s linear infinite;
}

.preview-liquid { 
  background: linear-gradient(270deg, #8b5cf650, #06b6d450);
  border-radius: 20px;
}

.preview-matrix { 
  background: linear-gradient(135deg, #00330080, #00ff4140);
  color: #00ff41;
}

.preview-cyberpunk { 
  background: linear-gradient(45deg, #ff003350, #00ffff50);
  clip-path: polygon(0 0, 90% 0, 100% 100%, 10% 100%);
}

.preview-cosmic { 
  background: radial-gradient(ellipse, #4c1d9560, #7c3aed60);
}

.preview-neural { 
  background: linear-gradient(90deg, rgba(99,102,241,0.3), rgba(168,85,247,0.3));
}

.preview-morphing { 
  background: linear-gradient(270deg, #8b5cf640, #06b6d440);
  animation: preview-morphing 2s ease-in-out infinite;
}

.preview-particle { 
  background: rgba(0,0,0,0.4);
  position: relative;
}

.preview-particle::after {
  content: '';
  @apply absolute inset-0;
  background-image: radial-gradient(1px 1px at 20% 30%, #8b5cf6, transparent),
                   radial-gradient(1px 1px at 40% 70%, #06b6d4, transparent),
                   radial-gradient(1px 1px at 60% 20%, #8b5cf6, transparent);
  background-size: 20px 20px;
  animation: preview-particle 3s linear infinite;
}

/* Animations */
@keyframes holographic-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes grid-drift {
  0% { transform: translate(0, 0); }
  100% { transform: translate(20px, 20px); }
}

@keyframes morphing-gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes neon-pulse {
  0%, 100% { box-shadow: 0 0 20px var(--primary-color, #8b5cf6), 0 0 40px var(--secondary-color, #06b6d4)80; }
  50% { box-shadow: 0 0 40px var(--primary-color, #8b5cf6), 0 0 80px var(--secondary-color, #06b6d4); }
}

@keyframes particle-float {
  0% { transform: translateY(100px) translateX(0px); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
}

@keyframes cyberpunk-glitch {
  0%, 90%, 100% { transform: translate(0); }
  5% { transform: translate(2px, 0); }
  10% { transform: translate(-2px, 0); }
}

@keyframes quantum-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes quantum-orbit {
  0% { transform: rotate(0deg) translateX(15px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(15px) rotate(-360deg); }
}

@keyframes liquid-flow {
  0% { background-position: 0% 50%; border-radius: 50px; }
  25% { border-radius: 20px 50px 20px 50px; }
  50% { background-position: 100% 50%; border-radius: 20px; }
  75% { border-radius: 50px 20px 50px 20px; }
  100% { background-position: 0% 50%; border-radius: 50px; }
}

@keyframes plasma-swirl {
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
}

@keyframes matrix-flicker {
  0%, 95%, 100% { opacity: 1; }
  96%, 98% { opacity: 0.8; }
}

@keyframes cosmic-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 40px rgba(124, 58, 237, 0.8); }
  50% { transform: scale(1.02); box-shadow: 0 0 60px rgba(124, 58, 237, 1); }
}

@keyframes neural-pulse {
  0%, 100% { opacity: 0.8; r: 3; }
  50% { opacity: 1; r: 4; }
}

@keyframes neural-flow {
  0% { stroke-dasharray: 0 10; }
  50% { stroke-dasharray: 5 5; }
  100% { stroke-dasharray: 10 0; }
}

/* Preview animations */
@keyframes preview-holographic {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes preview-plasma {
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
}

@keyframes preview-quantum {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes preview-morphing {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes preview-particle {
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
}

/* Component Style Variations */

/* Modern Style (Default) */
.component-modern .dock-play-btn {
  border-radius: calc(var(--button-radius, 8px) * 1.5);
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.component-modern .dock-toggle,
.component-modern .dock-menu-btn {
  border-radius: calc(var(--button-radius, 8px) * 1.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.component-modern .timeline-track {
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Minimal Style */
.component-minimal .dock-play-btn {
  box-shadow: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.component-minimal .dock-toggle,
.component-minimal .dock-menu-btn {
  box-shadow: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
}

.component-minimal .timeline-track {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: none;
}

/* Rounded Style */
.component-rounded .dock-play-btn,
.component-rounded .dock-toggle,
.component-rounded .dock-menu-btn {
  border-radius: 50%;
}

.component-rounded .timeline-track,
.component-rounded .timeline-progress {
  border-radius: calc(var(--timeline-height, 12px) / 2);
}

.component-rounded .dock-play-btn {
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
}

/* Sharp Style */
.component-sharp .dock-play-btn,
.component-sharp .dock-toggle,
.component-sharp .dock-menu-btn {
  border-radius: 2px;
  clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 100%, 6px 100%);
}

.component-sharp .timeline-track,
.component-sharp .timeline-progress {
  border-radius: 2px;
}

.component-sharp .dock-play-btn {
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.6), 0 0 0 1px rgba(139, 92, 246, 0.3);
}

/* Component Gallery Styles */
.component-preview {
  @apply w-full h-12 rounded mb-2 flex items-center justify-center relative overflow-hidden;
  background: rgba(0, 0, 0, 0.5);
}

.mini-toggle {
  @apply w-1.5 h-1.5 bg-gray-500 rounded-sm ml-1;
}

/* Component Style Previews */
.style-modern {
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.style-minimal {
  border-radius: 2px;
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  box-shadow: none;
}

.style-rounded {
  border-radius: 50%;
}

.style-sharp {
  border-radius: 1px;
  clip-path: polygon(0 0, 90% 0, 100% 100%, 10% 100%);
}

/* Slider Style Variations */

/* Default Slider Style */
.slider-default .timeline-track {
  background: rgba(107, 114, 128, 0.5);
  border: none;
}

.slider-default .timeline-progress {
  background: linear-gradient(90deg, var(--primary-color, #8b5cf6), var(--secondary-color, #06b6d4));
}

.slider-default .timeline-thumb {
  background: #ffffff;
  border: 2px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* Groove Slider Style */
.slider-groove .timeline-track {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%);
  border: 1px solid rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.4);
}

.slider-groove .timeline-progress {
  background: linear-gradient(180deg, var(--primary-color, #8b5cf6) 0%, var(--secondary-color, #06b6d4) 100%);
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.3);
}

.slider-groove .timeline-thumb {
  background: linear-gradient(180deg, #ffffff 0%, #e5e7eb 100%);
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

/* Pill Slider Style */
.slider-pill .timeline-track {
  background: rgba(31, 41, 55, 0.8);
  border-radius: 999px;
  border: 1px solid rgba(75, 85, 99, 0.6);
}

.slider-pill .timeline-progress {
  background: linear-gradient(90deg, var(--primary-color, #8b5cf6), var(--secondary-color, #06b6d4));
  border-radius: 999px;
  box-shadow: 0 0 8px rgba(139, 92, 246, 0.4);
}

.slider-pill .timeline-thumb {
  background: #ffffff;
  border-radius: 999px;
  border: 2px solid var(--primary-color, #8b5cf6);
  box-shadow: 0 0 12px rgba(139, 92, 246, 0.6);
}

/* Neon Slider Style */
.slider-neon .timeline-track {
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid var(--primary-color, #8b5cf6);
  box-shadow: 
    0 0 10px rgba(139, 92, 246, 0.3),
    inset 0 0 10px rgba(139, 92, 246, 0.1);
}

.slider-neon .timeline-progress {
  background: linear-gradient(90deg, var(--primary-color, #8b5cf6), var(--secondary-color, #06b6d4));
  box-shadow: 
    0 0 15px rgba(139, 92, 246, 0.8),
    0 0 30px rgba(6, 182, 212, 0.4);
  animation: neon-pulse 2s ease-in-out infinite alternate;
}

.slider-neon .timeline-thumb {
  background: #ffffff;
  border: 2px solid var(--primary-color, #8b5cf6);
  box-shadow: 
    0 0 15px rgba(139, 92, 246, 1),
    0 0 30px rgba(139, 92, 246, 0.6),
    inset 0 0 10px rgba(139, 92, 246, 0.2);
  animation: neon-thumb-glow 2s ease-in-out infinite alternate;
}

/* Glass Slider Style */
.slider-glass .timeline-track {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.slider-glass .timeline-progress {
  background: linear-gradient(90deg, 
    rgba(139, 92, 246, 0.8), 
    rgba(6, 182, 212, 0.8)
  );
  backdrop-filter: blur(5px);
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.slider-glass .timeline-thumb {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

/* Neon animations */
@keyframes neon-pulse {
  0% { box-shadow: 0 0 15px rgba(139, 92, 246, 0.8), 0 0 30px rgba(6, 182, 212, 0.4); }
  100% { box-shadow: 0 0 25px rgba(139, 92, 246, 1), 0 0 40px rgba(6, 182, 212, 0.6); }
}

@keyframes neon-thumb-glow {
  0% { 
    box-shadow: 
      0 0 15px rgba(139, 92, 246, 1),
      0 0 30px rgba(139, 92, 246, 0.6),
      inset 0 0 10px rgba(139, 92, 246, 0.2);
  }
  100% { 
    box-shadow: 
      0 0 25px rgba(139, 92, 246, 1),
      0 0 40px rgba(139, 92, 246, 0.8),
      inset 0 0 15px rgba(139, 92, 246, 0.4);
  }
}

/* Slider Gallery Styles */
.slider-preview {
  @apply w-full h-12 rounded mb-2 flex items-center justify-center relative overflow-hidden px-4;
  background: rgba(0, 0, 0, 0.5);
}

.mini-slider-track {
  @apply relative w-full bg-gray-600 rounded-full;
  height: 3px;
}

.mini-slider-progress {
  @apply absolute left-0 top-0 h-full rounded-full;
  width: 60%;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
}

.mini-slider-thumb {
  @apply absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full;
  left: 60%;
}

/* Slider preview style variations */
.slider-default .mini-slider-track {
  background: rgba(107, 114, 128, 0.5);
}

.slider-groove .mini-slider-track {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%);
  border: 0.5px solid rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.4);
}

.slider-groove .mini-slider-progress {
  background: linear-gradient(180deg, #8b5cf6 0%, #06b6d4 100%);
  box-shadow: inset 0 0.5px 1px rgba(255, 255, 255, 0.3);
}

.slider-groove .mini-slider-thumb {
  background: linear-gradient(180deg, #ffffff 0%, #e5e7eb 100%);
  border: 0.5px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 0.5px 1px rgba(0, 0, 0, 0.4);
}

.slider-pill .mini-slider-track {
  background: rgba(31, 41, 55, 0.8);
  border: 0.5px solid rgba(75, 85, 99, 0.6);
  border-radius: 999px;
}

.slider-pill .mini-slider-progress {
  border-radius: 999px;
  box-shadow: 0 0 4px rgba(139, 92, 246, 0.4);
}

.slider-pill .mini-slider-thumb {
  border-radius: 999px;
  border: 1px solid #8b5cf6;
  box-shadow: 0 0 6px rgba(139, 92, 246, 0.6);
}

.slider-neon .mini-slider-track {
  background: rgba(0, 0, 0, 0.8);
  border: 0.5px solid #8b5cf6;
  box-shadow: 0 0 5px rgba(139, 92, 246, 0.3);
}

.slider-neon .mini-slider-progress {
  box-shadow: 0 0 8px rgba(139, 92, 246, 0.8);
  animation: mini-neon-pulse 2s ease-in-out infinite alternate;
}

.slider-neon .mini-slider-thumb {
  border: 1px solid #8b5cf6;
  box-shadow: 0 0 8px rgba(139, 92, 246, 1);
  animation: mini-neon-thumb-glow 2s ease-in-out infinite alternate;
}

.slider-glass .mini-slider-track {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
}

.slider-glass .mini-slider-progress {
  background: linear-gradient(90deg, rgba(139, 92, 246, 0.8), rgba(6, 182, 212, 0.8));
  backdrop-filter: blur(2px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.slider-glass .mini-slider-thumb {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  border: 0.5px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

/* Mini neon animations */
@keyframes mini-neon-pulse {
  0% { box-shadow: 0 0 8px rgba(139, 92, 246, 0.8); }
  100% { box-shadow: 0 0 12px rgba(139, 92, 246, 1); }
}

@keyframes mini-neon-thumb-glow {
  0% { box-shadow: 0 0 8px rgba(139, 92, 246, 1); }
  100% { box-shadow: 0 0 12px rgba(139, 92, 246, 1); }
}
</style>