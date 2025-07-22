<script setup lang="ts">
import DashboardLayout from '@/components/layout/DashboardLayout.vue'

defineOptions({
  name: 'DashboardPage'
})
</script>

<template>
  <DashboardLayout>
    <div class="flex flex-col items-center justify-center min-h-screen">
      <h1 class="text-4xl font-bold text-apex-orange mb-8">
        Apex Legends Tournament Dashboard
      </h1>
      
      <div class="text-center space-y-4">
        <p class="text-xl text-apex-light/80">
          Select a tournament to begin analysis
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div class="bg-apex-dark/50 border border-apex-orange/20 rounded-lg p-6 hover:border-apex-orange/40 transition-colors cursor-pointer">
            <h3 class="text-lg font-semibold text-apex-blue mb-2">EWC 2025</h3>
            <p class="text-apex-light/60">Esports World Cup 2025</p>
            <p class="text-sm text-apex-light/40 mt-2">3 Days • 20 Teams</p>
          </div>
          
          <div class="bg-apex-dark/50 border border-apex-purple/20 rounded-lg p-6 hover:border-apex-purple/40 transition-colors cursor-pointer opacity-50">
            <h3 class="text-lg font-semibold text-apex-purple mb-2">ALGS Championship</h3>
            <p class="text-apex-light/60">Coming Soon</p>
            <p class="text-sm text-apex-light/40 mt-2">TBD</p>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>