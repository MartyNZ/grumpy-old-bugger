<script setup>
const props = defineProps({
  collectionNav: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <section id="article-collection-list" v-if="collectionNav">
    <NuxtLink to="/the-rant-files/collections">
      <h3>Article Collections</h3>
    </NuxtLink>
    <ul class="mb-3">
      <li
        v-for="collection in collectionNav.articleCollectionNavGroup"
        :key="collection._id"
        class="bg-surface-600 text-surface-100 hover:bg-surface-100 hover:text-primary-600 mr-3 mt-3 rounded-sm px-4 py-2 text-xs transition duration-500 ease-in-out"
      >
        <NuxtLink
          :to="`/the-rant-files/collections/${collection.parentCollection.slug}`"
          >{{ collection.parentCollection.name }}</NuxtLink
        >
        <ul class="ml-3 pb-1" v-if="collection.childCollections">
          <li
            v-for="child in collection.childCollections"
            :key="child._id"
            class="bg-primary-600 text-surface-100 hover:bg-surface-100 hover:text-primary-600 mr-3 mt-3 rounded-sm px-4 py-2 text-xs transition duration-500 ease-in-out"
          >
            <NuxtLink
              :to="`/the-rant-files/collections/${collection.parentCollection.slug}`"
            >
              {{ child.name }}
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </section>
</template>
