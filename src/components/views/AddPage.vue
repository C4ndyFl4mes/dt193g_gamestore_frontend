<script setup>
import { ref } from 'vue';
import GameForm from '../base/GameForm.vue';
import GenreForm from '../base/GenreForm.vue';

const formStatus = ref(false);


</script>

<template>
    <h2 class="mx-auto mt-20 md:mt-2">Add</h2>
    <div class="mx-auto w-50 max-w-[95%] flex">
        <button @click="formStatus = false" class="bg-sky-200 flex-1 rounded-l-md" :class="{ selected: !formStatus}">Game</button>
        <button @click="formStatus = true" class="bg-sky-200 flex-1 rounded-r-md" :class="{ selected: formStatus}">Genre</button>
    </div>
    <GameForm on_page="add" v-if="!formStatus" />
    <GenreForm v-else />
</template>

<style scoped>
    @import "tailwindcss";

    .selected {
        background-color: rgb(154, 209, 255);
    }
</style>