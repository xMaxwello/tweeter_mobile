<script setup lang="ts">
import { defineProps } from 'vue';
import {UserAccount} from '@/types/userAccount';
import {followUser} from "@/api/apiUser";
import generatePFP from "./generatePFP.vue";

const props = defineProps<{
  users: UserAccount[];
}>();

const handleFollow = async (userId: number) => {
  try {
    const success = await followUser(userId);
    if (success) {
      const userIndex = props.users.findIndex(user => user.id === userId);
      if (userIndex !== -1) {
        props.users[userIndex].is_following = !props.users[userIndex].is_following;
        props.users = [...props.users];
      }
    }
  } catch (error) {
    console.error('Failed to follow/unfollow:', error);
  }
};

</script>

<template>
  <div class="flex flex-col space-y-4">
    <div v-if="props.users.length === 0" class="flex flex-row items-center justify-center text-white pt-4">
      <span>Es konnte kein User gefunden werden</span>
    </div>
    <div v-for="user in users" :key="user.id" class="flex flex-row items-center justify-between pt-4">
      <div class="flex flex-row items-center">
        <img class="w-[40px] h-[40px] object-cover rounded-full mr-4" v-if="user.avatar_url" :src="user.avatar_url" alt="Profile Picture">
        <div v-if="!user.avatar_url">
          <generatePFP :full-name="user.full_name"/>
        </div>        <h1 class="pl-4 text-white">{{ user.full_name }}</h1>
      </div>
      <button @click="() => handleFollow(user.id)" :class="{'bg-homeCard': user.is_following, 'border-homeCard , border-2 , text-white': !user.is_following}" class="w-[120px] h-10 rounded-md text-black font-semibold">
        {{ user.is_following ? 'Gefolgt' : 'Folgen' }}
      </button>
    </div>
  </div>
</template>
