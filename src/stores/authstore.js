import { defineStore } from 'pinia'
import { ref } from 'vue'
import authentication from '@/axios/authentication.js';

export const useAuthenticatedStore = defineStore('authenticated', () => {
  const isAuthenticated = ref(false);

  async function setAuthenticationStatus() {
    try {
      const res = await authentication().is_user_logged_in();
      isAuthenticated.value = res.data.success;
    } catch(error) {
      console.error(error);
      isAuthenticated.value = false;
    }
  }
  return { isAuthenticated, setAuthenticationStatus }
})
