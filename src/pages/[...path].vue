<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineOptions({
  name: 'NotFoundPage'
})
</script>

<template>
  <div class="min-h-screen bg-apex-dark flex flex-col items-center justify-center">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-apex-red mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-apex-light mb-6">Page Not Found</h2>
      <p class="text-apex-light/60 mb-8">The tournament or page you're looking for doesn't exist.</p>
      
      <RouterLink 
        to="/" 
        class="inline-flex items-center px-6 py-3 bg-apex-orange text-white font-medium rounded-lg hover:bg-apex-orange/80 transition-colors"
      >
        Back to Dashboard
      </RouterLink>
    </div>
  </div>
</template>