<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});
// const displayImage = computed(() => {
//   if (props.product.featureImage != null) {
//     return props.product.featureImage;
//   } else {
//     return props.product.defaultImageUrl;
//   }
// });
</script>
<template>
  <div
    class="zoom @md:max-w-[150px] shadow-surface-700 relative my-4 max-w-[125px] overflow-hidden rounded-lg bg-cover bg-[50%] bg-no-repeat shadow-lg"
  >
    <img
      :src="
        product.featureImageUrl
          ? product.featureImageUrl
          : product.defaultImageUrl
      "
      class="w-full object-cover align-middle transition duration-300 ease-linear"
      :alt="product.title"
      loading="lazy"
      placeholder
    />
    <NuxtLink :to="`/products/${product.slug}`">
      <div>
        <div
          class="mask absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,0%,99.2%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out"
        ></div>
      </div>
    </NuxtLink>
  </div>
</template>
