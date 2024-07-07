<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import bannerComponent from "@/components/bannerComponent.vue";
</script>

<template>
  <bannerComponent class="block md:hidden"/>
  <ion-app>
    <ion-router-outlet/>
  </ion-app>
</template>

