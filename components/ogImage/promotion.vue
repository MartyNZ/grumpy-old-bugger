<script setup>
// inherited attrs can mess up the satori parser
defineOptions({
  inheritAttrs: false,
});

const props = defineProps({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  cta: {
    type: String,
  },
  padding: {
    type: String,
    default: "0 50px",
  },
  titleFontSize: {
    type: String,
    default: "50px",
  },
  descriptionFontSize: {
    type: String,
    default: "35px",
  },
  icon: {
    type: [String, Boolean],
    default: "/assets/imgs/favicon.png",
  },
  image: {
    type: String,
    required: false,
  },
  siteName: {
    type: String,
    required: true,
  },
  siteLogo: {
    type: String,
    required: true,
  },
});

</script>

<template>
  <div class="relative overflow-hidden flex w-[1200px] h-[600px]">
    <img v-if="image" :src="image" height="auto" width="100%" class="w-full object-cover align-middle" />
    <div class="text-white text-5xl absolute top-0 left-0 font-bold italic px-5 py-6  rounded-br-xl"
      style="background-color: rgba(24, 14, 6, 0.85)">
      {{ title }}
    </div>
    <div
      class="absolute bottom-0 right-0 flex flex-row  px-5 py-6 gap-2 items-center justify-end text-white text-3xl font-semibold rounded-tl-xl"
      style="background-color: rgba(24, 14, 6, 0.85)">
      {{ description }}
    </div>
  </div>
</template>
