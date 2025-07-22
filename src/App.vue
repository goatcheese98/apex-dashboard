<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="app" data-theme="apex" class="min-h-screen bg-base-100 text-base-content">
    <RouterView />
    <!-- Debug: Test if DaisyUI and custom classes work -->
    <div class="fixed bottom-4 left-4 p-2 bg-primary text-primary-content text-sm rounded btn-sm">
      DaisyUI + Apex Theme Working!
    </div>
  </div>
</template>