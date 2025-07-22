<template>
  <div class="min-h-screen bg-slate-50 text-gray-900 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold mb-2">Floating Dock System Iterations</h1>
        <p class="text-gray-600 text-lg">
          Exploring different concepts for the central control dock system
        </p>
      </div>

      <!-- Iterations Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Minimal Dock -->
        <div class="iteration-container">
          <h2 class="text-2xl font-semibold mb-4">Minimal Dock</h2>
          <p class="text-gray-600 mb-4">Essential controls only - clean and unobtrusive</p>
          <div class="demo-viewport">
            <!-- Mock visualization background -->
            <div class="mock-chart">
              <div class="chart-bars">
                <div class="bar" style="height: 60%"></div>
                <div class="bar" style="height: 80%"></div>
                <div class="bar" style="height: 45%"></div>
                <div class="bar" style="height: 90%"></div>
                <div class="bar" style="height: 70%"></div>
              </div>
            </div>
            
            <!-- Minimal Dock -->
            <div class="dock minimal-dock">
              <button class="play-btn">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 5v10l8-5-8-5z"/>
                </svg>
              </button>
              <div class="timeline-slider">
                <div class="slider-track">
                  <div class="slider-progress" style="width: 35%"></div>
                  <div class="slider-thumb" style="left: 35%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Expanded Dock -->
        <div class="iteration-container">
          <h2 class="text-2xl font-semibold mb-4">Expanded Dock</h2>
          <p class="text-gray-600 mb-4">Full-featured dock with all controls visible</p>
          <div class="demo-viewport">
            <!-- Mock visualization background -->
            <div class="mock-chart">
              <div class="chart-bars">
                <div class="bar" style="height: 60%"></div>
                <div class="bar" style="height: 80%"></div>
                <div class="bar" style="height: 45%"></div>
                <div class="bar" style="height: 90%"></div>
                <div class="bar" style="height: 70%"></div>
              </div>
            </div>
            
            <!-- Expanded Dock -->
            <div class="dock expanded-dock">
              <div class="dock-section">
                <span class="section-label">View</span>
                <div class="view-switcher">
                  <button class="view-btn active">Race</button>
                  <button class="view-btn">Damage</button>
                  <button class="view-btn">Scatter</button>
                </div>
              </div>
              
              <div class="dock-section">
                <span class="section-label">Control</span>
                <div class="playback-controls">
                  <button class="control-btn">⏮</button>
                  <button class="control-btn play-btn-large">▶</button>
                  <button class="control-btn">⏭</button>
                </div>
              </div>
              
              <div class="dock-section flex-1">
                <span class="section-label">Timeline</span>
                <div class="timeline-slider-large">
                  <div class="slider-track">
                    <div class="slider-progress" style="width: 45%"></div>
                    <div class="slider-thumb" style="left: 45%"></div>
                  </div>
                  <div class="timeline-markers">
                    <span class="marker">G1</span>
                    <span class="marker">G3</span>
                    <span class="marker active">G5</span>
                    <span class="marker">G7</span>
                    <span class="marker">G10</span>
                  </div>
                </div>
              </div>
              
              <div class="dock-section">
                <span class="section-label">Filter</span>
                <button class="filter-btn">Teams</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Adaptive Dock -->
        <div class="iteration-container">
          <h2 class="text-2xl font-semibold mb-4">Adaptive Dock</h2>
          <p class="text-gray-600 mb-4">Context-aware dock that adjusts to current view</p>
          <div class="demo-viewport">
            <!-- Mock visualization background -->
            <div class="mock-chart">
              <div class="chart-bars">
                <div class="bar" style="height: 60%"></div>
                <div class="bar" style="height: 80%"></div>
                <div class="bar" style="height: 45%"></div>
                <div class="bar" style="height: 90%"></div>
                <div class="bar" style="height: 70%"></div>
              </div>
            </div>
            
            <!-- Adaptive Dock -->
            <div class="dock adaptive-dock">
              <div class="core-controls">
                <button class="play-btn">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 5v10l8-5-8-5z"/>
                  </svg>
                </button>
                <div class="timeline-slider">
                  <div class="slider-track">
                    <div class="slider-progress" style="width: 25%"></div>
                    <div class="slider-thumb" style="left: 25%"></div>
                  </div>
                </div>
              </div>
              
              <div class="context-controls">
                <div class="context-pill">Race Chart Mode</div>
                <button class="expand-btn">⋯</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Dock -->
        <div class="iteration-container">
          <h2 class="text-2xl font-semibold mb-4">Mobile-Optimized Dock</h2>
          <p class="text-gray-600 mb-4">Touch-friendly design for mobile devices</p>
          <div class="demo-viewport mobile-viewport">
            <!-- Mock visualization background -->
            <div class="mock-chart mobile-chart">
              <div class="chart-bars">
                <div class="bar" style="height: 60%"></div>
                <div class="bar" style="height: 80%"></div>
                <div class="bar" style="height: 45%"></div>
                <div class="bar" style="height: 90%"></div>
              </div>
            </div>
            
            <!-- Mobile Dock -->
            <div class="dock mobile-dock">
              <div class="mobile-row">
                <button class="mobile-play-btn">
                  <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 5v10l8-5-8-5z"/>
                  </svg>
                </button>
                <div class="mobile-timeline">
                  <div class="slider-track">
                    <div class="slider-progress" style="width: 60%"></div>
                    <div class="slider-thumb" style="left: 60%"></div>
                  </div>
                </div>
                <button class="mobile-menu-btn">☰</button>
              </div>
              <div class="mobile-indicators">
                <div class="game-indicator">Game 6/10</div>
                <div class="view-indicator">Race Chart</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Translucent Variations -->
        <div class="iteration-container">
          <h2 class="text-2xl font-semibold mb-4">Translucent Variations</h2>
          <p class="text-gray-600 mb-4">Different opacity and blur effects</p>
          <div class="demo-viewport">
            <!-- Mock visualization background -->
            <div class="mock-chart">
              <div class="chart-bars">
                <div class="bar" style="height: 60%"></div>
                <div class="bar" style="height: 80%"></div>
                <div class="bar" style="height: 45%"></div>
                <div class="bar" style="height: 90%"></div>
                <div class="bar" style="height: 70%"></div>
              </div>
            </div>
            
            <!-- Multiple translucent docks -->
            <div class="translucent-stack">
              <div class="dock glass-dock">
                <span class="dock-label">Glass Effect</span>
                <button class="play-btn">▶</button>
                <div class="timeline-slider">
                  <div class="slider-track">
                    <div class="slider-progress" style="width: 30%"></div>
                    <div class="slider-thumb" style="left: 30%"></div>
                  </div>
                </div>
              </div>
              
              <div class="dock frosted-dock">
                <span class="dock-label">Frosted Glass</span>
                <button class="play-btn">▶</button>
                <div class="timeline-slider">
                  <div class="slider-track">
                    <div class="slider-progress" style="width: 50%"></div>
                    <div class="slider-thumb" style="left: 50%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Positioning Variants -->
        <div class="iteration-container">
          <h2 class="text-2xl font-semibold mb-4">Positioning Variants</h2>
          <p class="text-gray-600 mb-4">Different dock positions and orientations</p>
          <div class="demo-viewport">
            <!-- Mock visualization background -->
            <div class="mock-chart">
              <div class="chart-bars">
                <div class="bar" style="height: 60%"></div>
                <div class="bar" style="height: 80%"></div>
                <div class="bar" style="height: 45%"></div>
                <div class="bar" style="height: 90%"></div>
                <div class="bar" style="height: 70%"></div>
              </div>
            </div>
            
            <!-- Bottom dock (default) -->
            <div class="dock bottom-dock">
              <span class="position-label">Bottom</span>
              <button class="play-btn">▶</button>
              <div class="timeline-slider">
                <div class="slider-track">
                  <div class="slider-progress" style="width: 40%"></div>
                  <div class="slider-thumb" style="left: 40%"></div>
                </div>
              </div>
            </div>
            
            <!-- Side dock -->
            <div class="dock side-dock">
              <div class="vertical-controls">
                <span class="position-label">Side</span>
                <button class="play-btn">▶</button>
                <div class="vertical-timeline">
                  <div class="slider-track vertical">
                    <div class="slider-progress" style="height: 40%"></div>
                    <div class="slider-thumb" style="top: 40%"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Floating dock -->
            <div class="dock floating-dock">
              <span class="position-label">Floating</span>
              <button class="play-btn">▶</button>
              <div class="timeline-slider">
                <div class="slider-track">
                  <div class="slider-progress" style="width: 65%"></div>
                  <div class="slider-thumb" style="left: 65%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      
      <!-- Navigation Back -->
      <div class="mt-12 text-center">
        <router-link 
          to="/" 
          class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
        >
          ← Back to Dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Static showcase page - no reactive functionality needed for now
</script>

<style scoped>
/* Container Styles */
.iteration-container {
  @apply bg-white border border-gray-200 rounded-xl p-6 shadow-lg;
}

.demo-viewport {
  @apply relative bg-gray-900 rounded-lg overflow-hidden border border-gray-300;
  height: 300px;
}

.mobile-viewport {
  height: 400px;
  max-width: 300px;
  margin: 0 auto;
}

/* Mock Chart Styles */
.mock-chart {
  @apply absolute inset-0 p-4 flex items-end justify-center;
}

.mobile-chart {
  @apply p-2;
}

.chart-bars {
  @apply flex items-end gap-2 h-full;
}

.bar {
  @apply w-8 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t;
  min-height: 20px;
}

/* Base Dock Styles */
.dock {
  @apply absolute flex items-center gap-4 px-4 py-2 rounded-lg;
  backdrop-filter: blur(10px);
}

/* Minimal Dock */
.minimal-dock {
  @apply bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/70;
}

.play-btn {
  @apply w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-colors;
}

.timeline-slider {
  @apply w-32;
}

.slider-track {
  @apply relative w-full h-2 bg-gray-600 rounded-full;
}

.slider-progress {
  @apply absolute left-0 top-0 h-full bg-blue-500 rounded-full;
}

.slider-thumb {
  @apply absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg;
}

/* Expanded Dock */
.expanded-dock {
  @apply bottom-4 left-4 right-4 bg-gray-900/80 justify-between;
  padding: 12px 16px;
}

.dock-section {
  @apply flex flex-col items-center gap-2;
}

.section-label {
  @apply text-xs text-gray-400 uppercase tracking-wide;
}

.view-switcher {
  @apply flex bg-gray-700 rounded-md p-1;
}

.view-btn {
  @apply px-3 py-1 text-sm rounded transition-colors;
}

.view-btn.active {
  @apply bg-blue-600 text-white;
}

.playback-controls {
  @apply flex items-center gap-1;
}

.control-btn {
  @apply w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors;
}

.play-btn-large {
  @apply w-10 h-10 bg-blue-600 hover:bg-blue-700;
}

.timeline-slider-large {
  @apply w-48;
}

.timeline-markers {
  @apply flex justify-between mt-1 text-xs text-gray-400;
}

.marker.active {
  @apply text-blue-400;
}

.filter-btn {
  @apply px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors;
}

/* Adaptive Dock */
.adaptive-dock {
  @apply bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/75 justify-between;
  width: fit-content;
  min-width: 200px;
}

.core-controls {
  @apply flex items-center gap-3;
}

.context-controls {
  @apply flex items-center gap-2;
}

.context-pill {
  @apply px-3 py-1 bg-blue-600/30 text-blue-300 rounded-full text-sm;
}

.expand-btn {
  @apply w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded transition-colors;
}

/* Mobile Dock */
.mobile-dock {
  @apply bottom-4 left-2 right-2 bg-gray-900/80 flex-col gap-2;
  padding: 12px;
}

.mobile-row {
  @apply flex items-center gap-3 w-full;
}

.mobile-play-btn {
  @apply w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-colors;
}

.mobile-timeline {
  @apply flex-1;
}

.mobile-menu-btn {
  @apply w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded text-lg transition-colors;
}

.mobile-indicators {
  @apply flex justify-between text-sm text-gray-400;
}

/* Translucent Variations */
.translucent-stack {
  @apply absolute inset-x-4 bottom-4 space-y-2;
}

.glass-dock {
  @apply bg-white/10 border border-white/20;
  backdrop-filter: blur(20px);
}

.frosted-dock {
  @apply bg-gray-900/40 border border-gray-700/50;
  backdrop-filter: blur(15px) saturate(180%);
}

.dock-label {
  @apply text-xs text-gray-300;
}

/* Positioning Variants */
.bottom-dock {
  @apply bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/70;
}

.side-dock {
  @apply right-4 top-1/2 transform -translate-y-1/2 bg-gray-900/70;
  writing-mode: vertical-rl;
}

.vertical-controls {
  @apply flex flex-col items-center gap-3;
}

.vertical-timeline {
  @apply h-20;
}

.slider-track.vertical {
  @apply w-2 h-full;
}

.floating-dock {
  @apply top-4 right-4 bg-gray-900/70;
}

.position-label {
  @apply text-xs text-gray-400;
}
</style>