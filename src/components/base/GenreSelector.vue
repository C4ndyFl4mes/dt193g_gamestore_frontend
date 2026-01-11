<script setup>
import genres from '@/axios/genres';
import { ref, onMounted, computed } from 'vue';

const props = defineProps(['labelid']);

const selectedList = defineModel('selectedGenres', {
    type: Array,
    default: () => []
});

const genresList = ref([]);
const optionsList = computed(() =>
    genresList.value.filter((genre) =>
        !selectedList.value.some((selected) => selected.id === genre.id)
    )
);
const current_genre = ref(null);


function select() {
    if (current_genre.value && current_genre.value.id !== undefined) {
        selectedList.value.push({ ...current_genre.value });
        current_genre.value = null;
    }
}

function deSelect(index) {
    selectedList.value.splice(index, 1);
}

onMounted(async () => {
    try {
        const data = await genres().get();
        if (!data.success) {
            throw new Error(data.message);
        } else {
            genresList.value = data.genres;
        }
    } catch (error) {
        console.error(error);
    }
});
</script>

<template>
    <div class="border border-b-0 rounded-t-md p-2 w-full min-h-10 flex flex-row flex-wrap">
        <button type="button" v-for="(item, index) in selectedList" :key="`genre-${item.id}-${index}`"
            @click.stop.prevent="deSelect(index)" title="Remove"
            class="cursor-pointer px-2 m-1 bg-amber-300 hover:bg-amber-400 duration-150 rounded-md">{{
                item.genre_name }}</button>
    </div>
    <select v-model="current_genre" class="text-center p-1 w-full" @change="select" :id="props.labelid">
        <option :value="null">Select</option>
        <option v-for="item in optionsList" :key="item.id" :value="item">{{ item.genre_name }}</option>
    </select>
</template>

<style scoped></style>