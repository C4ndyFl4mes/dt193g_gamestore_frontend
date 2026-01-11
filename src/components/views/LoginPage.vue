<script setup>
import { ref, watch } from 'vue';
import authentication from '@/axios/authentication.js';
import { useAuthenticatedStore } from '@/stores/authstore';


const user = ref({
    username: '',
    password: ''
});

const loggedIn = ref(false);

const authStore = useAuthenticatedStore();

async function onSubmit() {
    try {
        const res = await authentication().login(user.value);

        user.value = {
            username: '',
            password: ''
        }
        console.log(res);

        await authStore.setAuthenticationStatus();
    } catch (error) {
        console.error(error);
    }
};

async function logout() {
    try {
        const res = await authentication().logout();
        console.log(res);
        await authStore.setAuthenticationStatus();
        console.log("b");
    } catch (error) {
        console.error(error);
    }
}

watch(() => authStore.isAuthenticated, (newValue) => {
   loggedIn.value = newValue;
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