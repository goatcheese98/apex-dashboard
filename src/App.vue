<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
const route = useRoute()
</script>
<template><div :class="{ 'legacy-experiments': route.meta.isDev }"><RouterView /></div></template>
