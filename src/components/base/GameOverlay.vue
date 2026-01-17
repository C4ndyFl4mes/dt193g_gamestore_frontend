<script setup>
import games from '@/axios/games';
import { onMounted, ref, watch } from 'vue';
import GameForm from './GameForm.vue';

const emit = defineEmits(['close', 'updatedGame', 'deleteGame']);

// Tar emot props från föräldrakomponenten.
const props = defineProps({
    game: {
        type: Object,
        required: true
    }
});

// Håller reda på om redigeringsläget är aktivt.
const editing = ref(false);

// Hanterar serverresponsen.
const serverResponse = ref(null);

// Uppdaterar lagersaldo för spelet.
async function updateStock() {
    try {
        if (props.game.stock === null || isNaN(props.game.stock) || props.game.stock === '') {
            throw new Error("Stock must be a valid number.");
        }
        
        const data = await games().put(props.game.id, props.game)

        if (data.success) {
            serverResponse.value = {
                success: true,
                message: "Stock updated successfully."
            };
        }
    } catch (error) {
        console.error(error);
        if (error.message === "Stock must be a valid number.") {
            serverResponse.value = {
                success: false,
                message: error.message
            };
            return;
        } else if (error.code === "ERR_BAD_REQUEST") {
            return serverResponse.value = {
                success: false,
                message: error.response.data.message
            };
        }

        serverResponse.value = {
            success: false,
            message: "Failed to update stock."
        };
    }
}

</script>

<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-96 relative max-w-[95vw]">
            <button class="absolute top-2 right-2 text-gray-500 hover:text-gray-700" @click="$emit('close')">
                &times;
            </button>
            <div v-if="!editing">
                <h2 class="text-2xl font-bold mb-4">{{ game.title }}</h2>
                <img :src="game.image_key" alt="Game Image" class="w-full h-auto mb-4" />
                <form class="mb-4" @submit.prevent="updateStock">
                    <label class="block mb-2 font-semibold">
                        <span>Stock</span>
                        <input type="number" v-model.number="game.stock"
                            class="w-full border border-gray-300 rounded px-3 py-2" />
                    </label>
                    <button type="submit"
                        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">Update
                        Stock</button>
                </form>
                <div v-if="serverResponse && serverResponse.success"
                    class="w-100 max-w-[95%] mx-auto bg-green-300 text-center p-4 rounded-xl">
                    <p>{{ serverResponse.message }}</p>
                </div>
                <div v-else-if="serverResponse" class="w-100 max-w-[95%] mx-auto bg-red-300 text-center p-4 rounded-xl">
                    <p>{{ serverResponse.message }}</p>
                </div>
                <div class="flex justify-between gap-2 flex-wrap">
                    <button @click="$emit('close')"
                        class="mt-4 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 cursor-pointer">Close</button>
                    <button @click="editing = true"
                        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">Edit
                        Game</button>
                </div>
            </div>
            <div v-else>
                <GameForm on_page="storage" :id="game.id" :title="game.title" :description="game.description"
                    :price="Number(game.price)" :stock="game.stock" :age_ratingID="game.age_ratingID"
                    :genres="game.genres" @close="$emit('close')" @updatedGame="emit('updatedGame', $event)"
                    @deleteGame="emit('deleteGame', $event)" />
            </div>
        </div>
    </div>
</template>

<style scoped></style>