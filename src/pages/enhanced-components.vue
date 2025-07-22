<script setup lang="ts">
defineOptions({
  name: 'EnhancedComponentsPage'
})
</script>

<template>
  <div class="min-h-screen py-8 bg-base-100">
    <!-- Header Section -->
    <div class="max-w-4xl mx-auto text-center mb-12 px-4">
      <h1 class="text-5xl font-bold text-primary mb-6">
        Enhanced DaisyUI Components
      </h1>
      
      <p class="text-xl text-base-content opacity-80 mb-6">
        Demonstrating custom effects on DaisyUI components
      </p>
      
      <!-- Navigation Back -->
      <div class="mb-8">
        <router-link to="/" class="btn btn-primary btn-lg">
          ← Back to Dashboard
        </router-link>
      </div>
    </div>
      
    <!-- Enhanced Components Demo -->
    <div class="max-w-5xl mx-auto px-4 space-y-12">
        
      <!-- 1. Enhanced Buttons -->
      <div class="card bg-base-200 border border-base-content/20">
        <div class="card-body">
          <h2 class="card-title text-2xl mb-4">🚀 Enhanced Buttons</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Standard DaisyUI -->
            <div class="text-center">
              <h3 class="text-lg font-semibold mb-3">Standard DaisyUI</h3>
              <button class="btn btn-primary mb-2">Standard Button</button>
            </div>
            
            <!-- Enhanced with Tailwind -->
            <div class="text-center">
              <h3 class="text-lg font-semibold mb-3">+ Tailwind Effects</h3>
              <button class="btn btn-primary hover:scale-110 hover:rotate-1 transition-all duration-300 shadow-lg hover:shadow-xl">
                Enhanced Button
              </button>
            </div>
            
            <!-- Custom CSS Class -->
            <div class="text-center">
              <h3 class="text-lg font-semibold mb-3">+ Custom CSS</h3>
              <button class="btn btn-primary btn-apex-glow">
                Apex Glow Button
              </button>
            </div>
          </div>

          <!-- Code examples -->
          <div class="mt-6 space-y-4">
            <div class="mockup-code text-sm">
              <pre data-prefix="1"><code>&lt;!-- Standard --&gt;</code></pre>
              <pre data-prefix="2"><code>&lt;button class="btn btn-primary"&gt;Standard&lt;/button&gt;</code></pre>
              <pre data-prefix="3"><code></code></pre>
              <pre data-prefix="4"><code>&lt;!-- Enhanced with Tailwind --&gt;</code></pre>
              <pre data-prefix="5"><code>&lt;button class="btn btn-primary hover:scale-110 hover:rotate-1 transition-all"&gt;</code></pre>
              <pre data-prefix="6"><code></code></pre>
              <pre data-prefix="7"><code>&lt;!-- Custom CSS Class --&gt;</code></pre>
              <pre data-prefix="8"><code>&lt;button class="btn btn-primary btn-apex-glow"&gt;Glow Button&lt;/button&gt;</code></pre>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Enhanced Cards -->
      <div class="card bg-base-200 border border-base-content/20">
        <div class="card-body">
          <h2 class="card-title text-2xl mb-4">📋 Enhanced Cards</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Standard Card -->
            <div class="card bg-base-300 shadow-lg">
              <div class="card-body">
                <h3 class="card-title">Standard Card</h3>
                <p class="text-base-content/70">Regular DaisyUI card component</p>
                <div class="card-actions justify-end">
                  <button class="btn btn-primary btn-sm">Action</button>
                </div>
              </div>
            </div>
            
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
          </div>
        </div>
      </div>

      <!-- 3. Enhanced Badges -->
      <div class="card bg-base-200 border border-base-content/20">
        <div class="card-body">
          <h2 class="card-title text-2xl mb-4">🏷️ Enhanced Badges</h2>
          
          <div class="flex gap-4 flex-wrap items-center">
            <div class="badge badge-primary">Standard Badge</div>
            <div class="badge badge-success badge-apex-pulse">Pulsing Badge</div>
            <div class="badge badge-secondary hover:scale-110 transition-transform cursor-pointer">Hover Scale</div>
            <div class="badge badge-accent animate-bounce">Bouncing Badge</div>
          </div>
          
          <div class="mt-4">
            <h3 class="text-lg font-semibold mb-2">Tournament Status Examples</h3>
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
      </div>

      <!-- 4. Enhanced Progress Bars -->
      <div class="card bg-base-200 border border-base-content/20">
        <div class="card-body">
          <h2 class="card-title text-2xl mb-4">📊 Enhanced Progress Bars</h2>
          
          <div class="space-y-6">
            <!-- Standard Progress -->
            <div>
              <div class="flex justify-between text-sm mb-2">
                <span>Standard Progress</span>
                <span class="text-primary">75%</span>
              </div>
              <progress class="progress progress-primary w-full" value="75" max="100"></progress>
            </div>
            
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

      <!-- 5. Complex Enhanced Component -->
      <div class="card bg-base-200 border border-base-content/20">
        <div class="card-body">
          <h2 class="card-title text-2xl mb-4">🎮 Tournament Control Panel</h2>
          
          <!-- This shows how you can combine multiple enhanced components -->
          <div class="card-tournament relative overflow-hidden">
            <div class="card-body">
              <div class="flex items-center justify-between mb-4">
                <h3 class="card-title text-primary">EWC 2025 - Live Control</h3>
                <div class="badge badge-success badge-apex-pulse gap-2">
                  <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Broadcasting
                </div>
              </div>
              
              <!-- Progress with custom styling -->
              <div class="mb-4">
                <div class="flex justify-between text-sm mb-2">
                  <span>Tournament Progress</span>
                  <span class="text-primary font-bold">Game 7/10</span>
                </div>
                <progress class="progress-apex w-full" value="70" max="100"></progress>
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
              
              <!-- Stats with enhanced styling -->
              <div class="stats stats-horizontal shadow-lg mt-4 bg-base-300/50 backdrop-blur-sm">
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
      </div>

      <!-- 6. CSS Override Examples -->
      <div class="card bg-base-200 border border-base-content/20">
        <div class="card-body">
          <h2 class="card-title text-2xl mb-4">🎨 CSS Override Examples</h2>
          
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

    <!-- Footer Navigation -->
    <div class="max-w-4xl mx-auto text-center mt-16 px-4">
      <router-link to="/" class="btn btn-secondary btn-lg btn-apex-glow">
        ← Back to Dashboard
      </router-link>
    </div>

  </div>
</template>

<style scoped>
/* Example of component-specific custom styles */
.stat:hover .stat-value {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}
</style>