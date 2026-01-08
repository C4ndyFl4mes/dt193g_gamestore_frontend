import AddPage from '@/components/pages/AddPage.vue';
import LoginPage from '@/components/pages/LoginPage.vue';
import StoragePage from '@/components/pages/StoragePage.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', component: LoginPage
    },
    {
      path: '/storage', component: StoragePage
    },
    {
      path: '/add', component: AddPage
    }
  ],
});

export default router;
