<template>
  <div class="min-h-screen bg-base-100">
    <!-- Header -->
    <div class="navbar bg-base-200">
      <div class="navbar-start">
        <router-link to="/" class="text-xl font-bold">🧪 Component Forge</router-link>
      </div>
      <div class="navbar-center">
        <h1 class="text-lg font-semibold">Testing Laboratory</h1>
      </div>
      <div class="navbar-end">
        <ThemeSelector />
      </div>
    </div>

    <!-- Lab Content -->
    <div class="container mx-auto px-4 py-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold mb-4">🧪 Testing Laboratory</h2>
        <p class="text-base-content/70 max-w-3xl mx-auto">
          Interactive component testing toolkit with real-time preview and code generation. 
          Test different component types with advanced customization options.
        </p>
      </div>
      
      <!-- Lab Navigation -->
      <div class="tabs tabs-bordered tabs-lg justify-center mb-8">
        <button 
          class="tab"
          :class="{ 'tab-active': activeLab === 'buttons' }"
          @click="activeLab = 'buttons'"
        >
          🔘 Buttons
        </button>
        <button 
          class="tab"
          :class="{ 'tab-active': activeLab === 'forms' }"
          @click="activeLab = 'forms'"
        >
          📝 Forms
        </button>
        <button 
          class="tab"
          :class="{ 'tab-active': activeLab === 'cards' }"
          @click="activeLab = 'cards'"
        >
          🃏 Cards
        </button>
        <button 
          class="tab"
          :class="{ 'tab-active': activeLab === 'navigation' }"
          @click="activeLab = 'navigation'"
        >
          🧭 Navigation
        </button>
        <button 
          class="tab"
          :class="{ 'tab-active': activeLab === 'data' }"
          @click="activeLab = 'data'"
        >
          📊 Data Display
        </button>
      </div>

      <!-- Lab Content -->
      <div class="transition-all duration-300">
        <!-- Button Testing Lab -->
        <div v-if="activeLab === 'buttons'">
          <ButtonTestingLab />
        </div>

        <!-- Form Input Testing Lab -->
        <div v-else-if="activeLab === 'forms'">
          <FormInputTestingLab />
        </div>

        <!-- Card Testing Lab -->
        <div v-else-if="activeLab === 'cards'">
          <CardTestingLab />
        </div>

        <!-- Navigation Testing Lab -->
        <div v-else-if="activeLab === 'navigation'">
          <div class="text-center py-12">
            <div class="text-6xl mb-4">🚧</div>
            <h3 class="text-2xl font-bold mb-4">Navigation Lab Coming Soon</h3>
            <p class="text-base-content/70 mb-8">
              Test and customize navigation components including navbars, breadcrumbs, and menus.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div class="card bg-base-200">
                <div class="card-body text-center p-4">
                  <h4 class="font-semibold">Navbar Lab</h4>
                  <p class="text-sm text-base-content/70">Responsive navigation bars</p>
                </div>
              </div>
              <div class="card bg-base-200">
                <div class="card-body text-center p-4">
                  <h4 class="font-semibold">Menu Lab</h4>
                  <p class="text-sm text-base-content/70">Dropdown and context menus</p>
                </div>
              </div>
              <div class="card bg-base-200">
                <div class="card-body text-center p-4">
                  <h4 class="font-semibold">Breadcrumb Lab</h4>
                  <p class="text-sm text-base-content/70">Navigation breadcrumbs</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Data Display Testing Lab -->
        <div v-else-if="activeLab === 'data'">
          <div class="text-center py-12">
            <div class="text-6xl mb-4">📊</div>
            <h3 class="text-2xl font-bold mb-4">Data Display Lab Coming Soon</h3>
            <p class="text-base-content/70 mb-8">
              Test and customize data display components including tables, stats, and badges.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div class="card bg-base-200">
                <div class="card-body text-center p-4">
                  <h4 class="font-semibold">Table Lab</h4>
                  <p class="text-sm text-base-content/70">Responsive data tables</p>
                </div>
              </div>
              <div class="card bg-base-200">
                <div class="card-body text-center p-4">
                  <h4 class="font-semibold">Stats Lab</h4>
                  <p class="text-sm text-base-content/70">Statistical display cards</p>
                </div>
              </div>
              <div class="card bg-base-200">
                <div class="card-body text-center p-4">
                  <h4 class="font-semibold">Badge Lab</h4>
                  <p class="text-sm text-base-content/70">Status and notification badges</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lab Features -->
      <div class="mt-16 pt-8 border-t border-base-content/10">
        <div class="text-center mb-8">
          <h3 class="text-2xl font-bold mb-4">Lab Features</h3>
          <p class="text-base-content/70">What makes our testing laboratory special</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="card bg-base-200">
            <div class="card-body text-center">
              <div class="text-3xl mb-2">⚡</div>
              <h4 class="font-semibold">Real-time Preview</h4>
              <p class="text-sm text-base-content/70">See changes instantly as you customize</p>
            </div>
          </div>
          <div class="card bg-base-200">
            <div class="card-body text-center">
              <div class="text-3xl mb-2">🎨</div>
              <h4 class="font-semibold">Advanced Styling</h4>
              <p class="text-sm text-base-content/70">Control every aspect of component appearance</p>
            </div>
          </div>
          <div class="card bg-base-200">
            <div class="card-body text-center">
              <div class="text-3xl mb-2">💾</div>
              <h4 class="font-semibold">Code Generation</h4>
              <p class="text-sm text-base-content/70">Export HTML, Vue, or CSS code</p>
            </div>
          </div>
          <div class="card bg-base-200">
            <div class="card-body text-center">
              <div class="text-3xl mb-2">🎯</div>
              <h4 class="font-semibold">Preset System</h4>
              <p class="text-sm text-base-content/70">Save and reuse your favorite configurations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { optionalForge } from '@/services/optionalForge'
const ThemeSelector = optionalForge('ThemeSelector')
const ButtonTestingLab = optionalForge('ButtonTestingLab')
const FormInputTestingLab = optionalForge('FormInputTestingLab')
const CardTestingLab = optionalForge('CardTestingLab')

const activeLab = ref<'buttons' | 'forms' | 'cards' | 'navigation' | 'data'>('buttons')
</script>