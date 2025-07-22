<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import ThemeSelector from '@/components/ui/ThemeSelector.vue'

defineOptions({
  name: 'DaisyUITestPage'
})

const themeStore = useThemeStore()

onMounted(() => {
  // Initialize theme system when component mounts
  themeStore.initializeTheme()
})
</script>

<template>
  <div class="min-h-screen py-8 bg-base-100">
    <!-- Header Section -->
    <div class="max-w-4xl mx-auto text-center mb-12 px-4">
      <h1 class="text-5xl font-bold text-primary mb-6">
        DaisyUI Components Test
      </h1>
      
      <p class="text-xl text-base-content opacity-80 mb-6">
        Testing DaisyUI components with dynamic theme switching
      </p>
      
      <!-- Theme Selector -->
      <div class="flex justify-center mb-8">
        <ThemeSelector :show-previews="true" />
      </div>
      
      <!-- Status Badge -->
      <div class="badge badge-success badge-lg gap-2 mb-6">
        <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
        {{ themeStore.theme.displayName }} Theme Active
      </div>

      <!-- Navigation Back -->
      <div class="mb-8">
        <router-link to="/" class="btn btn-primary btn-lg">
          ← Back to Dashboard
        </router-link>
      </div>
    </div>
      
    <!-- Component Tests -->
    <div class="max-w-5xl mx-auto px-4 space-y-12">
        
      <!-- 1. Buttons Test -->
      <div class="card bg-base-200 border border-base-content/20">
        <div class="card-body">
          <h2 class="card-title text-2xl mb-4">🎯 Button Components</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button class="btn btn-neutral">Primary</button>
            <button class="btn btn-neutral">Secondary</button>
            <button class="btn btn-neutral">Accent</button>
            <button class="btn btn-neutral">Neutral</button>
            <button class="btn btn-neutral">Success</button>
            <button class="btn btn-neutral">Warning</button>
            <button class="btn btn-neutral">Error</button>
            <button class="btn btn-neutral">Info</button>
          </div>
          
          <!-- Button Sizes -->
          <div class="mt-6 flex gap-2 items-center flex-wrap">
            <button class="btn btn-neutral btn-xs">XS</button>
            <button class="btn btn-neutral btn-sm">SM</button>
            <button class="btn btn-neutral">Normal</button>
            <button class="btn btn-neutral btn-lg">LG</button>
          </div>
        </div>
      </div>

      <!-- 2. Cards & Layout Test -->
      <div class="card bg-base-200 border border-base-content/20">
        <div class="card-body">
          <h2 class="card-title text-2xl mb-4">📋 Card Layouts</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div class="card bg-base-300">
              <div class="card-body">
                <h3 class="card-title">Tournament Stats</h3>
                <p class="text-base-content/70">Live tournament data</p>
                <div class="card-actions justify-end">
                  <button class="btn btn-neutral btn-sm">View</button>
                </div>
              </div>
            </div>
            
            <div class="card bg-base-300">
              <div class="card-body">
                <h3 class="card-title">Team Rankings</h3>
                <p class="text-base-content/70">Current leaderboard</p>
                <div class="card-actions justify-end">
                  <button class="btn btn-neutral btn-sm">Analyze</button>
                </div>
              </div>
            </div>
            
            <div class="card bg-base-300">
              <div class="card-body">
                <h3 class="card-title">Performance</h3>
                <p class="text-base-content/70">Player statistics</p>
                <div class="card-actions justify-end">
                  <button class="btn btn-neutral btn-sm">Details</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Progress & Loading Test -->
      <div class="card bg-base-200 border border-base-content/20">
        <div class="card-body">
          <h2 class="card-title text-2xl mb-4">📊 Progress & Loading</h2>
          
          <!-- Progress bars -->
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span>Tournament Progress</span>
                <span>75%</span>
              </div>
              <progress class="progress progress-neutral w-full" value="75" max="100"></progress>
            </div>
            
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span>Team Performance</span>
                <span>60%</span>
              </div>
              <progress class="progress progress-neutral w-full" value="60" max="100"></progress>
            </div>
            
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span>Analytics Loading</span>
                <span>40%</span>
              </div>
              <progress class="progress progress-neutral w-full" value="40" max="100"></progress>
            </div>
          </div>

          <!-- Loading spinners -->
          <div class="mt-6 flex gap-4 items-center">
            <span class="loading loading-spinner loading-xs"></span>
            <span class="loading loading-spinner loading-sm"></span>
            <span class="loading loading-spinner loading-md"></span>
            <span class="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>

      <!-- 4. Badges & Stats Test -->
      <div class="card bg-base-200 border border-base-content/20">
        <div class="card-body">
          <h2 class="card-title text-2xl mb-4">🏷️ Badges & Stats</h2>
          
          <!-- Badges -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3">Tournament Status Badges</h3>
            <div class="flex gap-2 flex-wrap">
              <div class="badge badge-neutral">Live Tournament</div>
              <div class="badge badge-neutral">20 Teams</div>
              <div class="badge badge-neutral">Final Round</div>
              <div class="badge badge-neutral gap-1">
                <div class="w-2 h-2 bg-base-content/50 rounded-full animate-pulse"></div>
                Online
              </div>
              <div class="badge badge-neutral">High Activity</div>
              <div class="badge badge-neutral">Connection Lost</div>
            </div>
          </div>

          <!-- Stats -->
          <div>
            <h3 class="text-lg font-semibold mb-3">Tournament Statistics</h3>
            <div class="stats stats-vertical lg:stats-horizontal bg-base-300">
              <div class="stat">
                <div class="stat-figure">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="stat-title">Total Teams</div>
                <div class="stat-value">20</div>
                <div class="stat-desc">Competing in EWC 2025</div>
              </div>
              
              <div class="stat">
                <div class="stat-figure">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                  </svg>
                </div>
                <div class="stat-title">Prize Pool</div>
                <div class="stat-value">$2M</div>
                <div class="stat-desc">Total tournament prize</div>
              </div>
              
              <div class="stat">
                <div class="stat-figure">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                  </svg>
                </div>
                <div class="stat-title">Games Played</div>
                <div class="stat-value">7/10</div>
                <div class="stat-desc">Tournament progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Forms & Controls Test -->
      <div class="card bg-base-200 border border-base-content/20">
        <div class="card-body">
          <h2 class="card-title text-2xl mb-4">🎮 Tournament Controls</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Tournament Filters -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold">Tournament Filters</h3>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Select Tournament</span>
                </label>
                <select class="select select-neutral w-full">
                  <option>EWC 2025</option>
                  <option>ALGS Championship</option>
                  <option>Winter Circuit</option>
                </select>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Team Filter</span>
                </label>
                <input type="text" placeholder="Search teams..." class="input input-neutral w-full" />
              </div>

              <div class="form-control">
                <label class="cursor-pointer label">
                  <span class="label-text">Show only top 10 teams</span> 
                  <input type="checkbox" class="toggle toggle-neutral" />
                </label>
              </div>
            </div>

            <!-- Playback Controls -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold">Playback Controls</h3>
              
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Game Timeline</span>
                </label>
                <input type="range" min="1" max="10" value="7" class="range range-neutral" />
                <div class="w-full flex justify-between text-xs px-2 mt-1">
                  <span>Game 1</span>
                  <span>Game 5</span>
                  <span>Game 10</span>
                </div>
              </div>

              <div class="flex gap-2 justify-center">
                <button class="btn btn-neutral btn-sm">⏮️ First</button>
                <button class="btn btn-neutral btn-sm">⏪ Prev</button>
                <button class="btn btn-neutral btn-sm">▶️ Play</button>
                <button class="btn btn-neutral btn-sm">⏩ Next</button>
                <button class="btn btn-neutral btn-sm">⏭️ Last</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Footer Navigation -->
    <div class="max-w-4xl mx-auto text-center mt-16 px-4">
      <router-link to="/" class="btn btn-secondary btn-lg">
        ← Back to Apex Dashboard
      </router-link>
    </div>

  </div>
</template>