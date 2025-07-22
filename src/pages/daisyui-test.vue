<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import ThemeSelector from '@/components/ui/ThemeSelector.vue'

defineOptions({
  name: 'DaisyUITestPage'
})

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initializeTheme()
})
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
        </div>
      </div>

    </div>
  </div>
</template>