import AddPage from '@/components/views/AddPage.vue';
import LoginPage from '@/components/views/LoginPage.vue';
import StoragePage from '@/components/views/StoragePage.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthenticatedStore } from '@/stores/authstore.js';

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

// Navigeringsvakt för att skydda rutter.
router.beforeEach((to, from, next) => {
  const authenticatedStore = useAuthenticatedStore();
  authenticatedStore.setAuthenticationStatus().then(() => {
    if (to.path !== '/' && !authenticatedStore.isAuthenticated) {
      next('/');
    } else {
      next();
    }
  });
});

export default router;
