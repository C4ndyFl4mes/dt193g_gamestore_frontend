<script setup>
import { RouterView } from 'vue-router';
import Header from './components/layout/Header.vue';
import Footer from './components/layout/Footer.vue';
import Navigation from './components/layout/Navigation.vue';

</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <div class="flex-1 flex flex-col-reverse md:flex-col relative">
      <Navigation />
      <main class="container">
        <RouterView />
      </main>
    </div>
    <Footer />
  </div>
</template>

<style scoped></style>
