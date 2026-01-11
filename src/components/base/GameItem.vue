<script setup>
import stocked_image from '@/assets/images/stocked.svg';
import low_image from '@/assets/images/low.svg';
import out_image from '@/assets/images/out.svg';
import { onMounted, ref } from 'vue';

const props = defineProps({
    image: {
        type: String,
        default: ""
    },
    title: {
        type: String,
        default: ""
    },
    stock: {
        type: Number,
        default: 0
    }
});

const states = [
    {
        image: stocked_image,
        text: "In"
    },
    {
        image: low_image,
        text: "Low"
    },
    {
        image: out_image,
        text: "Out"
    }
];

const current_state = ref(null);

onMounted(() => {
    if (props.stock >= 20) {
        current_state.value = states[0];
    } else if (props.stock === 0) {
        current_state.value = states[2];
    } else {
        current_state.value = states[1];
    }
});
</script>

<template>
    <article class="flex justify-between flex-wrap items-center relative border-b cursor-pointer hover:bg-gray-100 duration-200">
        <div class="flex items-center gap-x-5">
            <div v-if="props.image" class="max-w-15 md:max-w-none">
                <img :src="props.image" :alt="props.title + ' Cover'" width="100" height="auto" loading="lazy" />
            </div>
            <div v-else class="bg-gray-400 w-25 max-w-15 md:max-w-none min-h-12 md:min-h-18 h-auto flex justify-center items-center">
                <small>No Image</small>
            </div>
            <h2 class="text-sm md:text-xl">{{ props.title }}</h2>
        </div>
        <small v-if="current_state"
            class="bg-green-300 w-14 p-1 rounded-md text-center absolute top-1 right-1 flex justify-between items-center flex-wrap"
            :class="{ low: props.stock < 20, out: props.stock === 0 }">
            <img :src="current_state.image" alt="stock icon" />
            <span>{{ current_state.text }}</span>
        </small>

    </article>
</template>

<style scoped>
.low {
    background-color: rgb(253, 253, 116);
}

.out {
    background-color: rgb(241, 154, 154);
}
</style>