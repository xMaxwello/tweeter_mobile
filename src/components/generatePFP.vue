<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  fullName: String,
});

const backgroundColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-teal-400', 'bg-blue-400', 'bg-indigo-400', 'bg-purple-400'];

const getInitials = (name) => {
  return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
};

const getRandomBackgroundColorClass = () => {
  return backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
};

const initials = computed(() => getInitials(props.fullName));
const bgColorClass = computed(() => getRandomBackgroundColorClass());
</script>

<template>
  <div :class="bgColorClass" class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
    {{ initials }}
  </div>
</template>