import { createApp } from 'vue'
import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue'
import router from './router';
const pinia = createPinia();


import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

import './index.css';

pinia.use(piniaPluginPersistedstate);

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(pinia)

router.isReady().then(() => {
  app.mount('#app');
});
