<script setup>
import { RouterLink } from 'vue-router';
import login_image from '@/assets/images/login.svg';
import storage_image from '@/assets/images/storage.svg';
import add_image from '@/assets/images/add.svg';
import { useAuthenticatedStore } from '@/stores/authstore';
import { onMounted, ref, watch } from 'vue';

const authStore = useAuthenticatedStore();
const loggedIn = ref(false);

// Övervakar autentiseringsstatusen och uppdaterar loggedIn-variabeln.
watch(() => authStore.isAuthenticated, (newValue) => {
    loggedIn.value = newValue;
});

// Initialiserar loggedIn-variabeln vid montering av komponenten.
onMounted(async () => {
    try {
        loggedIn.value = await authStore.isAuthenticated;
    } catch(error) {
        console.error(error);
    }
});
</script>

<template>
    <nav class="w-full flex justify-center fixed bottom-0 md:relative z-10">
        <ul class="list-none flex flex-row-reverse justify-evenly md:justify-between w-200 max-w-screen md:max-w-[95%] bg-sky-400 p-2 md:py-0 md:px-10 md:rounded-bl-xl md:rounded-br-xl">
            <li>
                <RouterLink to="/">
                    <img :src="login_image" alt="Login"  />
                    <span v-if="loggedIn">Log out</span>
                    <span v-else>Log in</span>
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/storage">
                    <img :src="storage_image" alt="Storage" />
                    <span>Storage</span>
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/add">
                    <img :src="add_image" alt="Add" />
                    <span>Add</span>
                </RouterLink>
            </li>
        </ul>
    </nav>
</template>

<style scoped>
@import "tailwindcss";

 span {
    font-weight: bold;
 }
@layer base {
    span {
        @apply font-bold hidden md:block;
    }

    a {
        @apply flex flex-col items-center;
    }
    
    img {
        @apply w-12 mt-auto;
    }
}
</style>