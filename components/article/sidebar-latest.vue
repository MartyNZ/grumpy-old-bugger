<script setup>

const props = defineProps({
  number: {
    type: String,
    default: 3,
    required: true
  }
})
const { data: articles } = await useSanityQuery(`  *[_type == "article" && draft != true && dateTime(now()) > dateTime(publishedDate + "T00:00:00Z")]{
    _id,
    title,
    'slug': slug.current,
    image{
    'url': asset->url,
    "assetId":asset->_id
    },
    'excerpt': array::join(string::split(pt::text(body), "")[0...175], "") + "...",
    publishedDate,
    'category':category->{
      title,
      'slug':slug.current
    }
  } | order(publishedDate desc)[0...${props.number}]`);
</script>
<template v-if="articles">
  <section id="latest-articles" class="mb-3">
    <h3>Latest Articles</h3>
    <div class="flex items-start pb-3" v-for="article in articles" :key="article._id">
      <div
        class="aspect-video zoom shadow-surface-700 relative max-w-[125px] overflow-hidden rounded bg-cover bg-[50%] bg-no-repeat shadow-md">
        <SanityImage :assetId="article.image.assetId"
          class="w-full object-cover align-middle transition duration-300 ease-linear" :alt="article.title" />
        <NuxtLink :to="`/the-rant-files/${article.slug}`">
          <div>
            <div
              class="mask absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,0%,99.2%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out">
            </div>
          </div>
        </NuxtLink>
      </div>
      <div class="ms-2 text-sm">
        <NuxtLink :to="`/the-rant-files/${article.slug}`"
          class="text-surface-900 dark:text-surface-200 hover:text-primary-600 font-medium leading-none">
          {{ article.title }}
        </NuxtLink>
        <p class="text-surface-600 dark:text-surface-300 text-xs">
          {{ article.publishedDate }}
        </p>
      </div>
    </div>

  </section>
</template>

<style>
.zoom:hover img {
  transform: scale(1.1);
}

.transition {
  transition: all 0.3s ease-in-out;
}

.bg-opacity-15 {
  background-color: rgba(255, 255, 255, 0.15) !important;
}

.object-fit-cover {
  object-fit: cover;
}
</style>
