<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import bannerComponent from "@/components/bannerComponent.vue";
import { useLoadingStore } from '@/stores/loadingStore';

const loadingStore = useLoadingStore();
</script>

<template>
  <div class="relative">
    <bannerComponent class="block md:hidden"/>
    <ion-progress-bar class="absolute top-20 z-20" v-if="loadingStore.isLoading" type="indeterminate"></ion-progress-bar>
  </div>
  <ion-app>
    <ion-router-outlet/>
  </ion-app>
</template>
