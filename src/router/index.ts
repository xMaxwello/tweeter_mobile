import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue';
import tweetView from "@/views/tweetView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'LoginView',
    component: () => import('@/views/loginView.vue')
  },
  {
    path: '/tweet/:id',
    name: 'TweetView',
    component: tweetView,
    props: true
  },
  {
    path: '/',
    component: TabsPage,
    children: [
      {
        path: 'home',
        name: 'HomeView',
        component: () => import('@/views/homeView.vue')
      },
      {
        path: 'profile',
        name: 'ProfileView',
        component: () => import('@/views/myProfileView.vue')
      },
      {
        path: 'settings',
        name: 'SettingsView',
        component: () => import('@/views/settingsView.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
