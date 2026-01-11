<script setup>
import games from '@/axios/games';
import { onMounted, ref, watch } from 'vue';
import GameItem from '../base/GameItem.vue';
import asc_image from '@/assets/images/chevron_down.svg';
import desc_image from '@/assets/images/chevron_up.svg';

const gamesList = ref(null);
const sortingOn = ref("title");
const sortingOrder = ref("_asc");

function on() {
    if (sortingOn.value === "title") {
        sortingOn.value = "stock";
    } else {
        sortingOn.value = "title";
    }
}

function order() {
    if (sortingOrder.value === "_asc") {
        sortingOrder.value = "_desc";
    } else {
        sortingOrder.value = "_asc";
    }
}

async function sort() {
    const data = await games().get(sortingOn.value + sortingOrder.value);
    if (data.success) {
        gamesList.value = data.games;
    }
}

watch(() => sortingOn.value, async () => {
    try {
        await sort();
    } catch (error) {
        console.error(error);
    }
});

watch(() => sortingOrder.value, async () => {
    try {
        await sort();
    } catch (error) {
        console.error(error);
    }
});

onMounted(async () => {
    try {
        const data = await games().get();
        console.log(data);

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
            :stock="item.stock" />
    </div>
</template>

<style scoped></style>