<script setup>
const props = defineProps({
  theme: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
  }
})

// console.log("Collections: ", JSON.stringify(collections, null, 2))
</script>
<template>
  <section class="designs-list mt-10" :id="`designs-list-${theme.slug}`">
    <div class="flex w-full m-1 gap-2 mb-4">
      <div v-if="loading" class="w-full flex gap-2 mb-4">
        <Skeleton width="4rem" height="4rem" shape="circle" />
        <div class="flex flex-col items-center w-full">
          <Skeleton width="100%" height="1.5rem" class="mb-2" />
          <Skeleton width="100%" height="2rem" />
        </div>
      </div>
      <template v-else>
        <SanityImage :assetId="theme.image.assetId"
          class="align-center rounded-full aspect-square max-w-16 max-h-16 w-full" />

        <div class="h-full mb-2">
          <h2>{{ theme.title }}</h2>
          <div class="text-sm">{{ theme.description }}</div>
        </div>
      </template>
    </div>
    <div class="designs-grid" :id="`designs-grid-${theme.slug}`">
      <template v-if="theme.designs.length > 0">
        <div v-for="design in theme.designs" :key="design._id">
          <product-theme-design-list-item :design="design" :loading="loading" />
        </div>
      </template>
      <template v-else>
        <h5>No designs are available for this theme at present. But if it's here they must be coming!!!</h5>
      </template>
    </div>
  </section>
  <Divider />
</template>

<style scoped>
.designs-list {
  container-type: inline-size;
  margin-bottom: 2.5em;
}

.designs-grid {
  display: grid;
  gap: 1em;
  grid-template-columns: repeat(auto-fit, minmax(150px, 0.5fr));
  justify-items: center;
}

@container (width > 530px) {
  .designs-grid {
    grid-template-columns: repeat(auto-fit, minmax(175px, 0.2fr));
  }
}
</style>
