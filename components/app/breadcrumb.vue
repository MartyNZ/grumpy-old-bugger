<script setup>
import Breadcrumb from "primevue/breadcrumb";
const route = useRoute();
const collection = route.params.collection;
const sub = route.params.sub;
const printifyCollectionNavigationStore =
  usePrintifyCollectionNavigationStore();
const collectionNav =
  printifyCollectionNavigationStore.printifyCollectionNavigation.printifyCollectionNavGroup.find(
    (col) => col.slug == collection,
  );

const pathSegments = ref([]);

watch(
  () => route.fullPath,
  () => {
    const partPath = route.fullPath.split("?")[0];
    const fullPath = partPath.split("#")[0];
    pathSegments.value = [];
    const segments = fullPath.substring(1).split("/");
    // console.log("Full Path: ", JSON.stringify(route.fullPath));
    // console.log("Segments: ", JSON.stringify(segments));

    if (route.fullPath !== "/") {
      for (let i = 0; i < segments.length; i++) {
        let segment = segments[i];
        if (i === 0) {
          // Convert the first segment to title case
          segment = segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
        } else if (i < segments.length - 1) {
          segment = segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
        } else {
          // Convert the last segment to title case and replace '-' with ' '
          segment = segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
        }
        pathSegments.value.push({
          title: segment,
          slug:
            i < segments.length - 1
              ? `/${segments.slice(0, i + 1).join("/")}`
              : undefined,
        });
      }
    }
  },
  { immediate: true },
);

// console.log("Path Segments: ", JSON.stringify(pathSegments.value));
const home = computed(() => ({
  icon: "pi pi-home",
  route: "/",
}));
// console.log("Breadcrumb home:", JSON.stringify(home.value));

const items = computed(() => {
  return pathSegments.value.map((segment, index) => ({
    label: segment.title,
    route:
      index < pathSegments.value.length - 1 ? `${segment.slug}` : undefined,
  }));
});
// console.log("Breadcrumb items:", JSON.stringify(items.value));
</script>
<template>
  <Breadcrumb :home="home" :model="items" :key="items">
    <template #item="{ item, props }">
      <NuxtLink v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
        <NuxtLink :to="href" v-bind="props.action" @click="navigate">
          <span :class="[item.icon]" />
          <span class="font-semibold uppercase text-sm whitespace-nowrap">{{ item.label }}</span>
        </NuxtLink>
      </NuxtLink>
      <NuxtLink v-else :to="item.url" :target="item.target" v-bind="props.action">
        <span class="font-semibold uppercase text-sm whitespace-nowrap">{{ item.label }}</span>
      </NuxtLink>
    </template>
  </Breadcrumb>
</template>
