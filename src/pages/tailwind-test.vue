<script setup lang="ts">
defineOptions({
  name: 'TailwindTestPage'
})
</script>

<template>
  <div class="min-h-screen py-8 bg-apex-dark">
    <!-- Header Section - Centered -->
    <div class="max-w-4xl mx-auto text-center mb-12 px-4">
      <h1 class="text-5xl font-bold text-apex-gradient mb-6">
        TailwindCSS v4 Feature Testing
      </h1>
      
      <p class="text-xl text-apex-light opacity-80 mb-6">
        Comprehensive testing suite for TailwindCSS v4 features and functionality
      </p>
      
      <!-- Status Badge -->
      <div class="inline-flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-full px-6 py-3 text-base mb-6">
        <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        <span class="text-green-400 font-medium">TailwindCSS v4 Active</span>
      </div>

      <!-- Navigation Back -->
      <div class="mb-8">
        <router-link 
          to="/" 
          class="inline-flex items-center space-x-2 bg-apex-orange hover:bg-orange-400 px-6 py-3 rounded-xl text-white font-semibold transform hover:scale-105 transition-all duration-200"
        >
          <span>←</span>
          <span>Back to Dashboard</span>
        </router-link>
      </div>
    </div>
      
    <!-- Feature Tests - All Centered with Consistent Max Width -->
    <div class="max-w-5xl mx-auto px-4 space-y-12">
        
      <!-- 1. Responsive Design Test -->
      <div class="bg-apex-dark/50 backdrop-blur-sm border border-apex-blue/30 rounded-2xl p-6">
        <h2 class="text-2xl font-bold text-apex-blue mb-4">📱 Responsive Design Test</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-apex-orange/20 p-4 rounded-lg text-center">
            <div class="text-2xl mb-2">📱</div>
            <p class="text-sm text-apex-light">Mobile: 1 col</p>
          </div>
          <div class="bg-apex-blue/20 p-4 rounded-lg text-center">
            <div class="text-2xl mb-2">📟</div>
            <p class="text-sm text-apex-light">SM: 2 cols</p>
          </div>
          <div class="bg-apex-purple/20 p-4 rounded-lg text-center hidden lg:block">
            <div class="text-2xl mb-2">💻</div>
            <p class="text-sm text-apex-light">LG: 4 cols</p>
          </div>
          <div class="bg-apex-red/20 p-4 rounded-lg text-center hidden lg:block">
            <div class="text-2xl mb-2">🖥️</div>
            <p class="text-sm text-apex-light">LG: 4 cols</p>
          </div>
        </div>
      </div>

      <!-- 2. Hover/Focus States & Transitions Test -->
      <div class="bg-apex-dark/50 backdrop-blur-sm border border-apex-purple/30 rounded-2xl p-8">
        <h2 class="text-3xl font-bold text-apex-purple mb-6 text-center">✨ Interactive States Test</h2>
        <p class="text-center text-apex-light/70 mb-8">Hover over these elements to test interactions</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Button with Multiple States -->
          <button class="bg-apex-orange hover:bg-orange-400 active:scale-95 transform transition-all duration-200 px-6 py-4 rounded-xl text-white font-semibold focus:ring-4 focus:ring-orange-300/50 focus:outline-none hover:shadow-xl hover:shadow-orange-500/25">
            Click & Focus Test
          </button>
          
          <!-- Gradient Transition -->
          <div class="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 transition-all duration-700 p-4 rounded-xl text-center text-white font-semibold cursor-pointer transform hover:scale-105 hover:shadow-xl">
            Gradient Shift
          </div>
          
          <!-- Scale & Glow Effect -->
          <div class="bg-red-900/30 hover:bg-red-800/50 border-2 border-red-500/50 hover:border-red-400 transition-all duration-300 p-4 rounded-xl text-center text-red-400 font-semibold cursor-pointer transform hover:scale-110 hover:shadow-2xl hover:shadow-red-500/30">
            Scale & Glow
          </div>
        </div>
        
        <!-- Advanced Interactive Elements -->
        <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Rotating Card -->
          <div class="group perspective-1000 h-32">
            <div class="relative w-full h-full transition-transform duration-700 transform-style preserve-3d group-hover:rotate-y-180">
              <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold backface-hidden">
                Hover to Flip
              </div>
              <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold backface-hidden rotate-y-180">
                Flipped!
              </div>
            </div>
          </div>
          
          <!-- Morphing Button -->
          <div class="bg-gradient-to-r from-green-600 to-blue-600 hover:from-yellow-500 hover:to-red-500 transition-all duration-500 rounded-xl p-4 cursor-pointer transform hover:rotate-3 hover:scale-105 hover:shadow-2xl">
            <div class="text-white font-bold text-center">
              <div class="transition-all duration-500 group-hover:scale-110">
                Morphing Colors
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Animations & Transforms Test -->
      <div class="bg-apex-dark/50 backdrop-blur-sm border border-apex-orange/30 rounded-2xl p-8">
        <h2 class="text-3xl font-bold text-apex-orange mb-6 text-center">🎭 Animations & Transforms</h2>
        
        <!-- Built-in TailwindCSS Animations -->
        <div class="mb-8">
          <h3 class="text-xl text-apex-light mb-4 text-center">Built-in Animations</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-blue-500/20 p-6 rounded-xl text-center animate-pulse">
              <div class="text-3xl mb-2">💓</div>
              <p class="text-sm text-white font-medium">Pulse</p>
            </div>
            <div class="bg-purple-500/20 p-6 rounded-xl text-center animate-bounce">
              <div class="text-3xl mb-2">⚡</div>
              <p class="text-sm text-white font-medium">Bounce</p>
            </div>
            <div class="bg-orange-500/20 p-6 rounded-xl text-center animate-spin">
              <div class="text-3xl mb-2">⭕</div>
              <p class="text-sm text-white font-medium">Spin</p>
            </div>
            <div class="bg-red-500/20 p-6 rounded-xl text-center hover:rotate-12 hover:scale-110 transform transition-transform duration-300 cursor-pointer">
              <div class="text-3xl mb-2">🎯</div>
              <p class="text-sm text-white font-medium">Hover Transform</p>
            </div>
          </div>
        </div>

        <!-- Custom Animations -->
        <div>
          <h3 class="text-xl text-apex-light mb-4 text-center">Custom Animations (Working!)</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-cyan-500/20 p-8 rounded-xl text-center animate-float">
              <div class="text-4xl mb-3">🪶</div>
              <p class="text-white font-semibold">Float Animation</p>
              <p class="text-xs text-gray-300 mt-1">Smooth up/down movement</p>
            </div>
            <div class="bg-blue-500/20 p-8 rounded-xl text-center animate-glow">
              <div class="text-4xl mb-3">✨</div>
              <p class="text-white font-semibold">Glow Animation</p>
              <p class="text-xs text-gray-300 mt-1">Pulsing blue glow effect</p>
            </div>
            <div class="bg-purple-500/20 p-8 rounded-xl text-center animate-matrix perspective-1000">
              <div class="text-4xl mb-3">🎰</div>
              <p class="text-white font-semibold">3D Matrix</p>
              <p class="text-xs text-gray-300 mt-1">3D rotation with movement</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Flexbox & Grid Layouts Test -->
      <div class="bg-apex-dark/50 backdrop-blur-sm border border-apex-red/30 rounded-2xl p-6">
        <h2 class="text-2xl font-bold text-apex-red mb-4">📐 Flexbox & Grid Test</h2>
        
        <!-- Flexbox Test -->
        <div class="mb-6">
          <h3 class="text-lg text-apex-light mb-3">Flexbox: justify-between, items-center</h3>
          <div class="flex justify-between items-center bg-apex-red/10 p-4 rounded-lg">
            <div class="bg-apex-blue px-4 py-2 rounded">Left</div>
            <div class="bg-apex-orange px-4 py-2 rounded">Center</div>
            <div class="bg-apex-purple px-4 py-2 rounded">Right</div>
          </div>
        </div>
        
        <!-- Grid Test -->
        <div>
          <h3 class="text-lg text-apex-light mb-3">CSS Grid: auto-fit with minmax</h3>
          <div class="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4 bg-apex-red/10 p-4 rounded-lg">
            <div class="bg-apex-blue/50 p-3 rounded text-center">Auto</div>
            <div class="bg-apex-orange/50 p-3 rounded text-center">Fit</div>
            <div class="bg-apex-purple/50 p-3 rounded text-center">Grid</div>
            <div class="bg-apex-red/50 p-3 rounded text-center">Layout</div>
          </div>
        </div>
      </div>

      <!-- 5. Modern CSS Features Test -->
      <div class="bg-apex-dark/50 backdrop-blur-sm border border-apex-blue/30 rounded-2xl p-6">
        <h2 class="text-2xl font-bold text-apex-blue mb-4">🔮 Modern CSS Features</h2>
        <div class="space-y-4">
          
          <!-- Backdrop Blur -->
          <div class="relative h-32 bg-gradient-to-r from-apex-orange via-apex-blue to-apex-purple rounded-lg overflow-hidden">
            <div class="absolute inset-0 bg-apex-dark/30 backdrop-blur-md flex items-center justify-center">
              <p class="text-white font-bold text-lg">Backdrop Blur Effect</p>
            </div>
          </div>
          
          <!-- Advanced Shadows & Gradients -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gradient-to-br from-apex-orange/20 via-apex-red/10 to-apex-purple/20 p-6 rounded-xl shadow-2xl shadow-apex-orange/20">
              <p class="text-apex-light font-medium">Complex Gradient with Shadow</p>
            </div>
            <div class="bg-apex-dark border border-apex-blue/50 p-6 rounded-xl shadow-inner shadow-apex-blue/10">
              <p class="text-apex-light font-medium">Inner Shadow Effect</p>
            </div>
          </div>
          
          <!-- Aspect Ratio & Object Fit -->
          <div class="grid grid-cols-3 gap-4">
            <div class="aspect-square bg-gradient-to-br from-apex-blue to-apex-purple rounded-lg flex items-center justify-center">
              <p class="text-white text-sm font-bold">1:1 Square</p>
            </div>
            <div class="aspect-video bg-gradient-to-br from-apex-orange to-apex-red rounded-lg flex items-center justify-center">
              <p class="text-white text-sm font-bold">16:9 Video</p>
            </div>
            <div class="aspect-[4/3] bg-gradient-to-br from-apex-purple to-apex-blue rounded-lg flex items-center justify-center">
              <p class="text-white text-sm font-bold">4:3 Custom</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 6. Advanced Custom Features Test -->
      <div class="bg-apex-dark/50 backdrop-blur-sm border border-apex-orange/30 rounded-2xl p-8">
        <h2 class="text-3xl font-bold text-apex-gradient mb-6 text-center">✨ Advanced Custom Features</h2>
        <div class="space-y-10">

          <!-- Custom Gradients & Text Effects -->
          <div>
            <h3 class="text-xl text-apex-light mb-6 text-center">Custom Gradients & Text Effects</h3>
            <div class="space-y-6">
              <!-- Apex Gradient Background -->
              <div class="bg-apex-gradient p-8 rounded-xl text-center transform hover:scale-105 transition-transform duration-300">
                <p class="text-white font-bold text-2xl">Apex Gradient Background</p>
                <p class="text-white/80 mt-2">Orange to Blue custom gradient</p>
              </div>
              
              <!-- Rainbow Bar -->
              <div class="bg-apex-rainbow h-6 rounded-full shadow-lg"></div>
              
              <!-- Gradient Text -->
              <div class="text-center">
                <h4 class="text-apex-gradient text-5xl font-bold mb-2">Gradient Text</h4>
                <p class="text-apex-light/70">Custom gradient clipped to text</p>
              </div>
            </div>
          </div>

          <!-- Advanced Shadow Effects -->
          <div>
            <h3 class="text-xl text-apex-light mb-6 text-center">Shadow & Glow Effects</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-gray-900/80 shadow-apex-glow p-6 rounded-xl text-center hover:shadow-2xl transition-shadow duration-300">
                <div class="text-3xl mb-2">🔵</div>
                <p class="text-blue-400 font-semibold">Blue Glow Shadow</p>
              </div>
              <div class="bg-gray-900/80 shadow-apex-orange-glow p-6 rounded-xl text-center hover:shadow-2xl transition-shadow duration-300">
                <div class="text-3xl mb-2">🟠</div>
                <p class="text-orange-400 font-semibold">Orange Glow Shadow</p>
              </div>
              <div class="bg-gray-200/10 shadow-apex-inset p-6 rounded-xl text-center">
                <div class="text-3xl mb-2">⬇️</div>
                <p class="text-gray-300 font-semibold">Inset Shadow</p>
              </div>
            </div>
          </div>

          <!-- Container Queries & Advanced Layout -->
          <div>
            <h3 class="text-lg text-apex-light mb-3">Advanced Layout Features</h3>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <!-- Masonry-like layout -->
              <div class="space-y-4">
                <div class="bg-apex-blue/20 p-4 rounded-lg h-24">
                  <p class="text-apex-light text-sm">Variable Height Cards</p>
                </div>
                <div class="bg-apex-orange/20 p-4 rounded-lg h-32">
                  <p class="text-apex-light text-sm">Different Heights Work Well</p>
                </div>
                <div class="bg-apex-purple/20 p-4 rounded-lg h-20">
                  <p class="text-apex-light text-sm">Flexible Layout</p>
                </div>
              </div>
              
              <!-- Complex nested flexbox -->
              <div class="bg-apex-red/10 p-4 rounded-lg">
                <div class="flex flex-col h-full">
                  <div class="flex-1 flex items-center justify-center mb-4">
                    <div class="bg-apex-red/30 px-4 py-2 rounded">
                      <p class="text-apex-light text-sm">Centered Content</p>
                    </div>
                  </div>
                  <div class="flex justify-between items-end">
                    <div class="text-xs text-apex-light/60">Bottom Left</div>
                    <div class="text-xs text-apex-light/60">Bottom Right</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>

    <!-- Footer Navigation -->
    <div class="max-w-4xl mx-auto text-center mt-16 px-4">
      <router-link 
        to="/" 
        class="inline-flex items-center space-x-2 bg-apex-blue hover:bg-cyan-400 px-8 py-4 rounded-xl text-white font-semibold transform hover:scale-105 transition-all duration-200"
      >
        <span>←</span>
        <span>Back to Apex Dashboard</span>
      </router-link>
    </div>

  </div>
</template>