<script setup>
import { ref } from 'vue';
import GenreSelector from './GenreSelector.vue';
import games from '@/axios/games';

const emit = defineEmits(['close', 'updatedGame', 'deleteGame']);

// Tar emot props från föräldrakomponenten.
const props = defineProps({
    on_page: {
        type: String,
        default: undefined
    },
    id: {
        type: Number,
        default: undefined
    },
    image: {
        type: File,
        default: undefined
    },
    title: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 0
    },
    age_ratingID: {
        type: Number,
        default: 0
    },
    genres: {
        type: Array,
        default: () => []
    }
});

// Hanterar serverresponsen.
const serverResponse = ref(null);

// Fyller i formulärfält med props-värden.
const fields = ref({
    id: props.id,
    image: props.image,
    title: props.title,
    description: props.description,
    price: props.price,
    stock: props.stock,
    age_ratingID: props.age_ratingID,
    genres: props.genres
});

// Tar bort ett spel.
async function remove() {
    try {
        const data = await games().remove(Number(fields.value.id));
        if (data.success) {
            serverResponse.value = {
                success: data.success,
                message: data.message
            }
            emit('deleteGame', fields.value.id);
            setTimeout(() => {
                emit('close', false);
            }, 500);
        }
    } catch (error) {
        console.error(error);
    }
}

// Hanterar filändring för bilduppladdning.
function onFileChange(e) {
    const file = e.target?.files?.[0];
    if (!file) return;
    fields.value.image = file;
}

// Hanterar formulärinlämning. Olika beteenden beroende på "on_page" prop.
async function onSubmit() {
    switch (props.on_page) {
        case "add":
            try {
                const data = await games().post(fields.value);

                serverResponse.value = {
                    success: data.success,
                    message: "Successfully added a game to storage."
                }
                fields.value = {
                    id: undefined,
                    image: undefined,
                    title: undefined,
                    description: undefined,
                    price: undefined,
                    stock: undefined,
                    age_ratingID: undefined,
                    genres: []
                };
            } catch (error) {
                console.error(error);
                serverResponse.value = {
                    success: false,
                    message: error.response.data.message
                }
            }

            break;
        case "storage":
            try {
                const genre_ids = fields.value.genres.map(genre => genre.id);
                console.log('Genre IDs:', genre_ids); // Add this debug line
                console.log('Fields genres:', fields.value.genres); // Add this debug line
                const data = await games().put(Number(fields.value.id), {
                    image: fields.value.image,
                    title: fields.value.title,
                    description: fields.value.description,
                    price: fields.value.price,
                    stock: fields.value.stock,
                    age_ratingID: fields.value.age_ratingID,
                    genres: genre_ids
                });

                if (data.success) {
                    serverResponse.value = {
                        success: true,
                        message: "Successfully updated the game."
                    }
                    emit('updatedGame', data.game);
                    setTimeout(() => {
                        window.location.reload();
                    }, 700);
                }
            } catch (error) {
                console.error(error);
                if (error.code === "ERR_BAD_REQUEST") {
                    if (error.response.data.message === "Validation error") {
                        return serverResponse.value = {
                            success: error.response.data.success,
                            message: "Game " + error.response.data.errors[0].message
                        };
                    } else {
                        return serverResponse.value = {
                            success: false,
                            message: error.response.data.message
                        }
                    }
                }
            }
            break;
        default:
            console.log("Error");
            break;
    }
}

// Hanterar avbrytning/ stängning av formuläret.
function onCancel() {
    fields.value = {
        id: props.id,
        image: props.image,
        title: props.title,
        description: props.description,
        price: props.price,
        stock: props.stock,
        age_ratingID: props.age_ratingID,
        genres: props.genres
    };

    if (props.on_page === "storage") {
        emit('close', false);
    }
}
</script>

<template>
    <form @submit.prevent="onSubmit" class="mx-auto mb-10 w-100 max-w-[95%]">
        <fieldset class="max-w-[inherit]">
            <legend class="font-bold mb-4">Game</legend>
            <div class="flex flex-col gap-y-3">
                <label>
                    <span>Image (JPG only)</span>
                    <input type="file" name="image" accept="image/jpeg" @change="onFileChange" />
                </label>
                <label>
                    <span>Title</span>
                    <input type="text" name="title" maxlength="50" v-model="fields.title" placeholder=". . ." />
                </label>
                <label>
                    <span>Description</span>
                    <textarea name="description" v-model="fields.description" placeholder=". . ."></textarea>
                </label>
                <label>
                    <span>Price</span>
                    <input type="text" name="price" min="0" v-model="fields.price" placeholder=". . ." />
                </label>
                <label>
                    <span>Stock</span>
                    <input type="number" name="stock" min="0" v-model="fields.stock" placeholder=". . ." />
                </label>
                <label>
                    <span>Age Rating</span>
                    <select v-model.number="fields.age_ratingID">
                        <option value="1">E</option>
                        <option value="2">E10+</option>
                        <option value="3">T</option>
                        <option value="4">M</option>
                        <option value="5">AO</option>
                    </select>
                </label>
                <div class="max-w-[95%]">
                    <label for="genre-label">Genres</label>
                    <GenreSelector v-model:selectedGenres="fields.genres" labelid="genre-label" />
                </div>
                <div class="max-w-[95%] flex justify-center gap-y-4 flex-wrap mt-5 mb-10">
                    <button type="button" name="cancel" @click="onCancel"
                        class="mx-auto px-8 py-2 rounded-xl bg-red-300 hover:bg-red-400 cursor-pointer">
                        <span v-if="on_page === 'add'">Cancel</span>
                        <span v-else>Close</span>
                    </button>
                    <button type="submit" name="save"
                        class="mx-auto px-8 py-2 rounded-xl bg-green-300 hover:bg-green-400 cursor-pointer">Save</button>
                    <div v-if="on_page === 'storage'" class="flex-1">
                        <button type="button" name="delete"
                            class="mx-auto px-8 py-2 rounded-xl flex justify-center bg-red-300 hover:bg-red-400 cursor-pointer"
                            @click="remove">Delete
                        </button>
                    </div>
                </div>
                <div v-if="serverResponse && serverResponse.success"
                    class="max-w-[95%] bg-green-300 text-center p-4 rounded-xl">
                    <p>{{ serverResponse.message }}</p>
                </div>
                <div v-else-if="serverResponse" class="max-w-[95%] bg-red-300 text-center p-4 rounded-xl">
                    <p>{{ serverResponse.message }}</p>
                </div>
            </div>
        </fieldset>
    </form>
</template>

<style scoped>
@import "tailwindcss";

@layer base {
    label {
        @apply flex flex-col max-w-[95%];
    }

    input,
    textarea,
    select {
        @apply border rounded-md;
    }

    input {
        @apply p-1;
    }

    textarea {
        @apply p-2;
    }

    input[type="file"] {
        @apply border p-1 w-full max-w-full;
    }
}
</style>