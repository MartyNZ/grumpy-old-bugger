<script setup>
import Image from "primevue/image";
const props = defineProps({
  variantImages: {
    type: Array,
    required: true,
  },
  currentImage: {
    type: Object,
    required: true,
  },
  featureImage: {
    type: Object,
  },
});

// console.log(props.featureImage.url);

const emit = defineEmits(["update:currentImage"]);

const selectImage = (image) => {
  emit("update:currentImage", image);
};

// New reactive variable for start index
const startIndex = ref(0);

// Function to handle clicking the scroll arrows
const scrollImages = (direction) => {
  if (direction === "up" && startIndex.value > 0) {
    startIndex.value--;
  } else if (
    direction === "down" &&
    startIndex.value < props.variantImages.length - 4
  ) {
    startIndex.value++;
  }
};
// console.log("Image Count: ", props.variantImages.length);
</script>

<template>
  <div id="product-gallery" class="flex w-full">
    <div
      v-if="variantImages[0] !== ''"
      class="mt-2 flex flex-col items-center justify-center gap-2"
    >
      <!-- Scroll arrow -->
      <div class="h-[32px]">
        <button
          v-if="variantImages.length > 4 && startIndex > 0"
          @click="scrollImages('up')"
        >
          <i class="fa-duotone fa-angles-up fa-xl" />
        </button>
      </div>
      <!-- Updated v-for loop -->
      <div v-for="image in variantImages.slice(startIndex, startIndex + 4)">
        <img
          @click="selectImage(image)"
          :class="currentImage.src == image.src ? 'selected-option' : ''"
          class="object-fit mx-1 w-[55px] cursor-pointer rounded-md sm:w-[65px] md:w-[75px]"
          :src="image.src"
          loading="lazy"
          placeholder
        />
      </div>

      <!-- Scroll arrow -->
      <div class="h-[32px]">
        <button
          v-if="
            variantImages.length > 4 && variantImages.length - startIndex > 4
          "
          @click="scrollImages('down')"
        >
          <i class="fa-duotone fa-angles-down fa-xl" />
        </button>
      </div>
    </div>
    <div class="m-2 w-full p-2">
      <Image preview>
        <template #image>
          <img :src="currentImage?.src" class="rounded-md" loading="eager"/>
        </template>
        <template #preview="slotProps">
          <img :src="currentImage?.src" :style="slotProps.style" loading="lazy" />
        </template>
      </Image>
    </div>
  </div>
</template>
