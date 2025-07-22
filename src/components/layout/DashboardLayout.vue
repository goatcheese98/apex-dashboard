<script setup lang="ts">
defineOptions({
  name: 'DashboardLayout'
})
</script>

<template>
  <div class="min-h-screen bg-apex-dark">
    <!-- Header -->
    <header class="border-b border-apex-orange/10 bg-apex-dark/80 backdrop-blur-sm sticky top-0 z-50">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <h1 class="text-xl font-bold text-apex-orange">Apex Dashboard</h1>
          </div>
          
          <nav class="hidden md:flex items-center space-x-6">
            <RouterLink 
              to="/" 
              class="text-apex-light/80 hover:text-apex-orange transition-colors"
            >
              Home
            </RouterLink>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>

<script lang="ts">
import { RouterLink } from 'vue-router'
export default {
  components: {
    RouterLink
  }
}
</script>