<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
<template>
  <nav class="dev-links" aria-label="Development experiments">
    <span>Development</span>
    <RouterLink to="/dock-iterations">Dock experiments</RouterLink>
    <RouterLink to="/library">Library</RouterLink>
    <RouterLink to="/lab">Lab</RouterLink>
  </nav>
</template>
