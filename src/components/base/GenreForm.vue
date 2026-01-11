<script setup>
import genres from '@/axios/genres';
import { onMounted, ref } from 'vue';

const genresList = ref(null);
const add_genre_field = ref(null);
const current_genre = ref(null);

const serverResponse = ref(null);

async function onSubmit() {
    try {
        const data = await genres().post({
            genre_name: add_genre_field.value
        });

        if (data.success) {
            serverResponse.value = {
                success: true,
                message: "Successfully added a genre."
            };
            genresList.value.push(data.genre);
            add_genre_field.value = null;
        }
    } catch (error) {
        console.error(error);
        if (error.code === "ERR_BAD_REQUEST") {
            if (error.response.data.message === "Validation error") {
                return serverResponse.value = {
                    success: error.response.data.success,
                    message: "Genre name " + error.response.data.errors[0].message
                };
            }
            return serverResponse.value = {
                success: false,
                message: error.response.data.message
            }
        }
    }
}

async function remove() {
    try {
        if (!current_genre.value || !current_genre.value.id) {
            throw new Error("You must select a genre to remove first.");
        }

        const data = await genres().remove(current_genre.value.id);

        if (data.success) {
            genresList.value = genresList.value.filter(genre => genre.id !== current_genre.value.id);
            current_genre.value = null;
            serverResponse.value = {
                success: data.success,
                message: data.message
            }
        }
    } catch (error) {
        console.error(error);
        if (error.code === "ERR_BAD_REQUEST") {
            if (error.response.data.message === "Validation error") {
                return serverResponse.value = {
                    success: error.response.data.success,
                    message: "Genre name " + error.response.data.errors[0].message
                };
            }
            return serverResponse.value = {
                success: false,
                message: error.response.data.message
            }
        }

        if (error.message) {
            return serverResponse.value = {
                success: false,
                message: error.message
            }
        }
    }
}

async function update() {
    try {
        if (!current_genre.value || !current_genre.value.id) {
            throw new Error("You must select a genre to update first.");
        }

        const data = await genres().put(current_genre.value.id, {
            genre_name: current_genre.value.genre_name
        });

        if (data.success) {
            const index = genresList.value.findIndex(genre => genre.id === current_genre.value.id);
            if (index > -1) {
                genresList.value[index].genre_name = data.genre.genre_name;
                current_genre.value = null;
            }
        }
    } catch (error) {
        console.error(error);
        if (error.code === "ERR_BAD_REQUEST") {
            if (error.response.data.message === "Validation error") {
                return serverResponse.value = {
                    success: error.response.data.success,
                    message: "Genre name " + error.response.data.errors[0].message
                };
            }
            return serverResponse.value = {
                success: false,
                message: error.response.data.message
            }
        }

        if (!error.response) {
            return serverResponse.value = {
                success: false,
                message: error.message
            }
        }
    }
}

onMounted(async () => {
    try {
        const data = await genres().get();

        if (data.success) {
            genresList.value = data.genres;
        }
    } catch (error) {
        console.error(error);
        if (error.code === "ERR_BAD_REQUEST") {
            if (error.message.includes('404')) {
                return serverResponse.value = {
                    success: false,
                    message: error.response.data.message + " New genres required."
                }
            }
            return serverResponse.value = {
                success: false,
                message: error.response.data.message
            }
        }
    }
})
</script>

<template>
    <form @submit.prevent="onSubmit" class="mx-auto mb-10 w-100 max-w-[95%]">
        <fieldset>
            <legend class="font-bold mb-4">Genre</legend>
            <div class="flex flex-col gap-y-3">
                <label>
                    <span>Name</span>
                    <input type="text" name="genre_name" v-model="add_genre_field" placeholder=". . ." />
                </label>
                <button type="submit" name="save"
                    class="mx-auto px-8 py-2 rounded-xl bg-green-300 hover:bg-green-400 cursor-pointer">Save</button>
            </div>
        </fieldset>
    </form>
    <form class="mx-auto mb-10 w-100 max-w-[95%]">
        <fieldset>
            <legend class="font-bold mb-4">Edit or Remove</legend>
            <div class="flex flex-col gap-y-3">
                <label>
                    <span>Select Genre</span>
                    <select v-model="current_genre" class="py-2 px-4">
                        <option :value="null">Select</option>
                        <option v-if="genresList" v-for="item in genresList" :key="item.id" :value="item">{{
                            item.genre_name }}</option>
                    </select>
                </label>
                <label v-if="current_genre">
                    <span>Edit field</span>
                    <input type="text" name="current_genre_name" maxlength="50" v-model="current_genre.genre_name" />
                </label>
                <div class="flex justify-center flex-wrap gap-4 mt-8 mb-10">
                    <button type="button" name="delete" @click="remove"
                        class="mx-auto px-8 py-2 rounded-xl bg-red-300 hover:bg-red-400 cursor-pointer">Remove</button>
                    <button type="button" name="update" @click="update"
                        class="mx-auto px-8 py-2 rounded-xl bg-green-300 hover:bg-green-400 cursor-pointer">Update</button>
                </div>
            </div>
        </fieldset>
    </form>
    <div v-if="serverResponse && serverResponse.success"
        class="w-100 max-w-[95%] mx-auto bg-green-300 text-center p-4 rounded-xl">
        <p>{{ serverResponse.message }}</p>
    </div>
    <div v-else-if="serverResponse" class="w-100 max-w-[95%] mx-auto bg-red-300 text-center p-4 rounded-xl">
        <p>{{ serverResponse.message }}</p>
    </div>
</template>

<style scoped>
@import "tailwindcss";

@layer base {
    label {
        @apply flex flex-col;
    }

    input {
        @apply border rounded-md p-2;
    }

    select {
        @apply max-w-fit;
    }
}
</style>