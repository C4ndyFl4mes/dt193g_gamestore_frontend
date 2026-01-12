<script setup>
import { RouterView } from 'vue-router';
import Header from './components/layout/Header.vue';
import Footer from './components/layout/Footer.vue';
import Navigation from './components/layout/Navigation.vue';
import { useAuthenticatedStore } from './stores/authstore';
import { onMounted } from 'vue';

const authStore = useAuthenticatedStore();

// Sätter autentiseringsstatus vid montering av applikationen.
onMounted(async () => {
  try {
    await authStore.setAuthenticationStatus();
  } catch(error) {
    console.error(error);
  }
});
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <div class="flex-1 flex flex-col relative">
      <Navigation />
      <main class="container mx-auto flex flex-col">
        <RouterView />
      </main>
    </div>
    <Footer />
  </div>
</template>

<style scoped></style>
