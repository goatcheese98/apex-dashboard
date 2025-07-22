<template>
  <span class="icon" :class="classes">
    <!-- Sun Icon -->
    <svg v-if="name === 'sun'" viewBox="0 0 24 24" fill="currentColor">
      <path
        d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0-2a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1zm0 16a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1zM5.05 6.464a1 1 0 0 1 1.414 0l.707.707a1 1 0 1 1-1.414 1.414l-.707-.707a1 1 0 0 1 0-1.414zm12.728 12.728a1 1 0 0 1-1.414 0l-.707-.707a1 1 0 0 1 1.414-1.414l.707.707a1 1 0 0 1 0 1.414zM3 12a1 1 0 0 1 1-1h1a1 1 0 0 1 0 2H4a1 1 0 0 1-1-1zm16 0a1 1 0 0 1 1-1h1a1 1 0 0 1 0 2h-1a1 1 0 0 1-1-1zM5.757 17.657a1 1 0 0 1 0-1.414l.707-.707a1 1 0 1 1 1.414 1.414l-.707.707a1 1 0 0 1-1.414 0zM18.9 5.05a1 1 0 0 1 0 1.414l-.707.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0z"
      />
    </svg>

    <!-- Moon Icon -->
    <svg v-else-if="name === 'moon'" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>

    <!-- Gaming/Apex Icon -->
    <svg v-else-if="name === 'gaming'" viewBox="0 0 24 24" fill="currentColor">
      <path
        d="M7 6a1 1 0 0 1 2 0v1h1a1 1 0 1 1 0 2H9v1a1 1 0 1 1-2 0V9H6a1 1 0 1 1 0-2h1V6zM17 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-2 3a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12zm10-8a8 8 0 1 0 0 16 8 8 0 0 0 0-16z"
      />
    </svg>

    <!-- Palette Icon (fallback) -->
    <svg v-else-if="name === 'palette'" viewBox="0 0 24 24" fill="currentColor">
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.54 0 3-.3 4.38-.84.12-.05.22-.13.28-.24.06-.11.09-.23.09-.36 0-.17-.06-.33-.17-.46-.1-.12-.25-.2-.4-.2h-.16c-.83 0-1.58-.34-2.12-.88-.54-.53-.88-1.29-.88-2.12 0-1.66 1.34-3 3-3h.16c.15 0 .3-.08.4-.2.11-.13.17-.29.17-.46 0-.13-.03-.25-.09-.36-.06-.11-.16-.19-.28-.24C15 2.3 13.54 2 12 2zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 8 6.5 8 8 8.67 8 9.5 7.33 11 6.5 11zm3-4C8.67 7 8 6.33 8 5.5S8.67 4 9.5 4s1.5.67 1.5 1.5S10.33 7 9.5 7zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4 14.5 4 16 4.67 16 5.5 15.33 7 14.5 7zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 8 17.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
      />
    </svg>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  name: "sun" | "moon" | "gaming" | "palette" | string;
  class?: string;
}

const props = defineProps<Props>();

const classes = computed(() => props.class || "w-4 h-4");
</script>

<style scoped>
.icon {
  @apply inline-flex items-center justify-center;
}

.icon svg {
  @apply w-full h-full;
}
</style>
