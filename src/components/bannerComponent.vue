<script setup lang="ts">
import { defineEmits } from 'vue';

const emit = defineEmits(['toggle-sidebar']);

function toggleSidebar() {
  emit('toggle-sidebar');
}
</script>

<template>
  <nav>
    <div class="grid w-full h-20 bg-passwordCard z-10 fixed shadow">
      <div class="col-span-1 flex justify-center items-center">
        <img src="../assets/Logoreanmo.svg" alt="Company Logo">
      </div>
    </div>
  </nav>

</template>
