<script setup>
import { qryAllPrintifyCollections } from "~/queries/printify";

const { data: collectionList } = await useSanityQuery(
  qryAllPrintifyCollections,
);
</script>
<template>
  <div id="product-collection-list">
    <NuxtLink to="/products/collections">
      <h3>Product Collections</h3>
    </NuxtLink>
    <ul class="mb-3">
      <li
        v-for="collection in collectionList"
        :key="collection._id"
        class="bg-surface-600 text-surface-100 hover:bg-surface-100 hover:text-primary-600 mr-3 mt-3 rounded-sm px-4 py-2 text-xs transition duration-500 ease-in-out"
      >
        <NuxtLink :to="`/products/collections/${collection.slug}`">
          {{ collection.title }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
