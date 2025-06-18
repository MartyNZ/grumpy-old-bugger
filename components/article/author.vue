<script setup>
const props = defineProps({
  author: {
    type: Object,
    required: true,
  }
})
</script>
<template>
  <div class="w-xs h-full">
    <div class="bg-white shadow-xl rounded-lg py-3 h-full flex flex-col">
      <div class="photo-wrapper p-2">
        <SanityImage :asset-id="author.image.asset._id" class="rounded-full mx-auto object-cover w-40 aspect-square" />
      </div>
      <div class="p-2 flex-0 flex flex-col justify-between">

        <div class="text-center my-3">
          <NuxtLink class="text-lg text-indigo-500 italic hover:underline hover:text-indigo-600 font-medium leading-tight flex gap-1 place-content-center" :to="`/authors/${author.slug}`">
            <span class="max-w-[12rem]">{{ author.firstName }} {{ author.lastName }}</span>
          </NuxtLink>
        </div>

      </div>
    </div>
  </div>
</template>
