<script setup>
import { onMounted, ref, watch } from 'vue';
import authentication from '@/axios/authentication.js';
import { useAuthenticatedStore } from '@/stores/authstore';

const user = ref({
    username: '',
    password: ''
});

const serverResponse = ref(null);

const loggedIn = ref(false);

const authStore = useAuthenticatedStore();

// Hanterar inloggningsformulärets inlämning.
async function onSubmit() {
    try {
        const res = await authentication().login(user.value);

        user.value = {
            username: '',
            password: ''
        }

        await authStore.setAuthenticationStatus();
    } catch (error) {
        console.error(error);
        if (error.code === "ERR_BAD_REQUEST") {
            if (error.response.data.message === "Validation error") {
                serverResponse.value = {
                    success: error.response.data.success,
                    message: error.response.data.errors[0].instancePath.replace("/", "") + " " + error.response.data.errors[0].message
                };
            } else {
                serverResponse.value = {
                    success: false,
                    message: error.response.data.message
                };
            }
        }
    }
};

// Hanterar utloggning.
async function logout() {
    try {
        const res = await authentication().logout();
        await authStore.setAuthenticationStatus();
    } catch (error) {
        console.error(error);
    }
}

// Övervakar autentiseringsstatusen och uppdaterar loggedIn-variabeln.
watch(() => authStore.isAuthenticated, (newValue) => {
   loggedIn.value = newValue;
});

// Sätter autentiseringsstatus vid montering av komponenten.
onMounted(async () => {
    try {
        await authStore.setAuthenticationStatus();
        loggedIn.value = authStore.isAuthenticated;
    } catch (error) {
        console.error(error);
    }
});
</script>

<template>
    <form v-if="!loggedIn" class="mx-auto w-100 max-w-[95%] my-10" @submit.prevent="onSubmit">
        <fieldset>
            <legend class="text-xl mx-auto">Authentication</legend>
            <div class="flex flex-col gap-y-5 pt-5">
                <label>
                    <span>Username</span>
                    <input type="text" name="username" v-model="user.username" autocomplete="username" placeholder=". . .">
                </label>
                <label>
                    <span>Password</span>
                    <input type="password" name="password" v-model="user.password" autocomplete="current-password" placeholder=". . .">
                </label>
                <button type="submit" class="bg-green-400 mx-auto px-4 py-2 rounded-md mt-2">Authenticate</button>
            </div>
            <div v-if="serverResponse" class="w-100 max-w-[95%] mx-auto text-center p-4 rounded-xl" :class="serverResponse.success ? 'bg-green-300 mt-4' : 'bg-red-300 mt-4'">
                <p>{{ serverResponse.message }}</p>
            </div>
        </fieldset>
    </form>
    <div v-else class="mx-auto mt-38 md:mt-20">
        <button class="bg-green-400 px-4 py-2 rounded-md mt-2" @click="logout">Log out</button>
    </div>
</template>

<style scoped>
@import "tailwindcss";

@layer base {
    label {
        @apply flex flex-col
    }

    input {
        @apply border p-2 rounded-md;
    }
}
</style>