<script setup>
import { ref } from 'vue'

const isLoading = ref(true)
</script>

<template>
  <div class="flex justify-center transition-opacity duration-300" :class="{'opacity-0': !isLoading, 'opacity-100': isLoading}">
    <div class="w-8 h-8 border-4 border-passwordCard border-t-homeCard rounded-full animate-spin"></div>
  </div>
</template>


<style scoped>
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>