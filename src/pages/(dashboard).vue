<script setup lang="ts">
import DashboardLayout from '@/components/layout/DashboardLayout.vue'

defineOptions({
  name: 'DashboardPage'
})
</script>

<template>
  <DashboardLayout>
    <div class="min-h-screen flex flex-col items-center justify-center px-4">
      <!-- Header Section -->
      <div class="text-center mb-12">
        <h1 class="text-6xl font-bold text-primary mb-6">
          Apex Legends
        </h1>
        <h2 class="text-3xl font-semibold text-secondary mb-4">
          Tournament Dashboard
        </h2>
        <p class="text-xl text-base-content/80 max-w-2xl mx-auto">
          Advanced analytics and insights for competitive Apex Legends tournaments
        </p>
      </div>

      <!-- Main Content -->
      <div class="max-w-4xl w-full space-y-8">
        
        <!-- Status Section -->
        <div class="text-center mb-8">
          <div class="badge badge-success badge-lg gap-2">
            <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            System Online
          </div>
        </div>

        <!-- Tournament Selection -->
        <div class="card bg-base-200/50 backdrop-blur-sm border border-base-content/20">
          <div class="card-body">
            <h2 class="card-title text-2xl font-bold text-center justify-center mb-6">🏆 Select Tournament</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <!-- EWC 2025 Tournament -->
            <div class="card bg-base-300 border border-primary/30 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/20 cursor-pointer transition-all duration-300 hover:-translate-y-2">
              <div class="card-body">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="card-title text-secondary hover:text-primary transition-colors">EWC 2025</h3>
                  <div class="badge badge-success badge-sm gap-1">
                    <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Live
                  </div>
                </div>
                
                <div class="space-y-3 mb-6">
                  <p class="text-base-content font-medium text-lg">Esports World Cup 2025</p>
                  <p class="text-base-content/70">Official tournament with prize pool analytics</p>
                  <div class="flex items-center space-x-4 text-sm text-base-content/60">
                    <span>📅 3 Days</span>
                    <span>👥 20 Teams</span>
                    <span>💰 $2M Prize Pool</span>
                  </div>
                </div>
                
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-base-content/70">Tournament Progress</span>
                    <span class="text-primary font-medium">75%</span>
                  </div>
                  <progress class="progress progress-primary" value="75" max="100"></progress>
                </div>
              </div>
            </div>
            
            <!-- ALGS Championship (Coming Soon) -->
            <div class="card bg-base-300 border border-accent/30 hover:border-accent/50 opacity-60 hover:opacity-80 cursor-pointer transition-all duration-300 hover:-translate-y-1">
              <div class="card-body">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="card-title text-accent">ALGS Championship</h3>
                  <div class="badge badge-neutral badge-sm">
                    Upcoming
                  </div>
                </div>
                
                <div class="space-y-3 mb-6">
                  <p class="text-base-content font-medium text-lg">Coming Soon</p>
                  <p class="text-base-content/50">Championship tournament analysis</p>
                  <div class="flex items-center space-x-4 text-sm text-base-content/40">
                    <span>📅 TBD</span>
                    <span>👥 TBD</span>
                    <span>💰 TBD</span>
                  </div>
                </div>
                
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-base-content/50">Preparation</span>
                    <span class="text-accent/70">25%</span>
                  </div>
                  <progress class="progress progress-accent" value="25" max="100"></progress>
                </div>
              </div>
            </div>
          </div>

            <!-- Quick Actions -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <router-link 
                to="/tailwind-test"
                class="btn btn-info btn-lg h-auto flex-col p-4 group"
              >
                <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">🧪</div>
                <div class="font-medium">Tailwind Test</div>
                <div class="text-xs opacity-60 mt-1">CSS Features</div>
              </router-link>

              <router-link 
                to="/daisyui-test"
                class="btn btn-secondary btn-lg h-auto flex-col p-4 group"
              >
                <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">🎯</div>
                <div class="font-medium">DaisyUI Test</div>
                <div class="text-xs opacity-60 mt-1">UI Components</div>
              </router-link>

              <router-link 
                to="/enhanced-components"
                class="btn btn-accent btn-lg h-auto flex-col p-4 group btn-apex-glow"
              >
                <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">✨</div>
                <div class="font-medium">Enhanced UI</div>
                <div class="text-xs opacity-60 mt-1">Custom Effects</div>
              </router-link>
              
              <button class="btn btn-primary btn-lg h-auto flex-col p-4 group">
                <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">📊</div>
                <div class="font-medium">Analytics</div>
                <div class="text-xs opacity-60 mt-1">View Statistics</div>
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </DashboardLayout>
</template>