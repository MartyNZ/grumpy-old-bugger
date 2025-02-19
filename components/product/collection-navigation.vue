<script setup>
const printifyCollectionNavigation = usePrintifyCollectionNavigationStore();
const collectionNavGroup = printifyCollectionNavigation.printifyCollectionNavigation;
const menuStates = ref({});

const toggleMenu = (collectionId) => {
  menuStates.value[collectionId] = !menuStates.value[collectionId];
};
</script>

<template>
  <section id="printify-collection-list" class="mb-4">
    <ul class="m-0 list-none">
      <li>
        <ul class="mx-0 my-5 list-none overflow-hidden p-0">
          <li class="mb-4">
            <NuxtLink to="/products"
              class="text-surface-700 dark:after:bg-primary-500 hover:text-surface-900 dark:text-surface-300 hover:dark:text-surface-100 relative block w-fit text-sm font-semibold">
              <h3
                class="after:bg-primary-700 dark:after:bg-primary-500 relative after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-[0%] after:rounded-xl after:duration-300 after:content-[''] hover:after:w-[100%]">
                All {{ collectionNavGroup.title }}
              </h3>
            </NuxtLink>
          </li>
          <li v-for="collection in collectionNavGroup.printifyCollectionNavGroup" :key="collection._id">
            <template v-if="collection.childCollections">
              <div @click="toggleMenu(collection._id)"
                class="text-surface-700 dark:after:bg-primary-500 hover:text-surface-900 dark:text-surface-300 hover:dark:text-surface-100 relative flex w-fit cursor-pointer items-center px-4 py-2 text-lg font-semibold">
                <icons-fa-duotone-angle-down :class="{ 'rotate-180': menuStates[collection._id] }" />
                <div class="text-nowrap">
                  <span class="font-medium">{{ collection.title }}</span>
                </div>
              </div>
              <Transition name="fade">
                <ul v-show="menuStates[collection._id]" class="ml-4 list-none overflow-hidden">
                  <li>
                    <NuxtLink :to="`/products/collections/${collection.slug}`"
                      class="text-surface-700 hover:text-surface-900 dark:text-surface-300 hover:dark:text-surface-100 relative block w-fit py-1 pl-8 font-semibold">
                      <span
                        class="after:bg-primary-700 dark:after:bg-primary-500 relative after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-[0%] after:rounded-xl after:duration-300 after:content-[''] hover:after:w-[100%]">
                        All {{ collection.title }}
                      </span>
                    </NuxtLink>
                  </li>
                  <li v-for="child in collection.childCollections" :key="child._id">
                    <NuxtLink :to="`/products/collections/${collection.slug}/${child.slug}`"
                      class="text-surface-700 hover:text-surface-900 dark:text-surface-300 hover:dark:text-surface-100 relative block w-fit py-1 pl-8 font-semibold">
                      <span
                        class="after:bg-primary-700 dark:after:bg-primary-500 relative after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-[0%] after:rounded-xl after:duration-300 after:content-[''] hover:after:w-[100%]">
                        {{ child.title }}
                      </span>
                    </NuxtLink>
                  </li>
                </ul>
              </Transition>
            </template>
            <template v-else>
              <NuxtLink :to="`/products/collections/${collection.slug}`"
                class="text-surface-700 hover:text-surface-900 dark:text-surface-300 hover:dark:text-surface-100 relative block w-fit py-1 pl-8 font-semibold">
                <span
                  class="after:bg-primary-700 dark:after:bg-primary-500 relative after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-[0%] after:rounded-xl after:duration-300 after:content-[''] hover:after:w-[100%]">
                  {{ collection.title }}
                </span>
              </NuxtLink>
            </template>
          </li>
        </ul>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
