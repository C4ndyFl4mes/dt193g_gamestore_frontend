<script setup>
import games from '@/axios/games';
import { onMounted, ref, watch } from 'vue';
import GameItem from '../base/GameItem.vue';
import asc_image from '@/assets/images/chevron_down.svg';
import desc_image from '@/assets/images/chevron_up.svg';
import GameOverlay from '../base/GameOverlay.vue';

const overlay = ref(false);
const current_game = ref(null);

const gamesList = ref([]);
const sortingOn = ref("title");
const sortingOrder = ref("_asc");

// Hanterar borttagning av ett spel.
function remove(deletedGameId) {
    gamesList.value = gamesList.value.filter(game => game.id !== deletedGameId);
}

// Hanterar uppdatering av ett spel.
function update(updatedGame) {
    const index = gamesList.value.findIndex(game => game.id === updatedGame.id);
    if (index !== -1) {
        gamesList.value[index] = updatedGame;
    }
}

// Hanterar ändring av sorteringsfält.
function on() {
    if (sortingOn.value === "title") {
        sortingOn.value = "stock";
    } else {
        sortingOn.value = "title";
    }
}

// Hanterar ändring av sorteringsordning.
function order() {
    if (sortingOrder.value === "_asc") {
        sortingOrder.value = "_desc";
    } else {
        sortingOrder.value = "_asc";
    }
}

// Hämtar sorterade spel från servern.
async function sort() {
    const data = await games().get(sortingOn.value + sortingOrder.value);
    if (data.success) {
        gamesList.value = data.games;
    }
}

// Övervakar ändringar i sorteringsfält och ordning för att uppdatera spel-listan.
watch(() => sortingOn.value, async () => {
    try {
        await sort();
    } catch (error) {
        console.error(error);
    }
});

// Övervakar ändringar i sorteringsordning för att uppdatera spel-listan.
watch(() => sortingOrder.value, async () => {
    try {
        await sort();
    } catch (error) {
        console.error(error);
    }
});

// Hämtar spel från servern vid montering av komponenten.
onMounted(async () => {
    try {
        const data = await games().get();

        if (data.success) {
            gamesList.value = data.games;
        }
    } catch (error) {
        console.error(error);
    }
});
</script>

<template>
    <div class="mx-auto w-200 max-w-full mb-3 md:mt-10 md:rounded-t-xl bg-sky-500 flex justify-center items-center gap-x-5 flex-wrap">
        <button @click="on" class="bg-sky-400 rounded-xl w-20 cursor-pointer">
            <span v-if="sortingOn === 'title'">Title</span>
            <span v-else>Stock</span>
        </button>
        <button @click="order" class="cursor-pointer">
            <img v-if="sortingOrder === '_asc'" :src="asc_image" alt="Order ascending" width="48" height="auto">
            <img v-else :src="desc_image" alt="Order descending" width="48" height="auto" />
        </button>
    </div>
    <div class="mx-auto w-200 max-w-[95%] mb-10 overflow-hidden">
        <GameItem v-for="item in gamesList" :key="item.id" :image="item.image_key" :title="item.title"
            :stock="item.stock" @click="overlay = true; current_game = item"  />
    </div>
    <GameOverlay v-if="overlay" :game="current_game" @close="overlay = false" @updatedGame="update" @deleteGame="remove" />
</template>

<style scoped></style>