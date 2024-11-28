<script setup>
const printifyCollectionNavigation = usePrintifyCollectionNavigationStore();
const collectionNavGroup = printifyCollectionNavigation.printifyCollectionNavigation;
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
              <div v-styleclass="{
                selector: '@next',
                enterClass: 'hidden',
                enterActiveClass: 'fadein',
                leaveToClass: 'hidden',
                leaveActiveClass: 'fadeout',
              }"
                class="text-surface-700 dark:after:bg-primary-500 hover:text-surface-900 dark:text-surface-300 hover:dark:text-surface-100 relative flex w-fit cursor-pointer items-center px-4 py-2 text-lg font-semibold">
                <icons-fa-duotone-angle-down />
                <div class="text-nowrap">
                  <span class="font-medium">{{ collection.title }}</span>
                </div>
              </div>
              <ul class="ml-4 hidden list-none overflow-hidden">
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
                      class="after:bg-primary-700 dark:after:bg-primary-500 relative after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-[0%] after:rounded-xl after:duration-300 after:content-[''] hover:after:w-[100%]">{{
                        child.title }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </template>
            <template v-else>
              <NuxtLink :to="`/products/collections/${collection.slug}`"
                class="text-surface-700 hover:text-surface-900 dark:text-surface-300 hover:dark:text-surface-100 relative block w-fit py-1 pl-8 font-semibold">
                <span
                  class="after:bg-primary-700 dark:after:bg-primary-500 relative after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-[0%] after:rounded-xl after:duration-300 after:content-[''] hover:after:w-[100%]">{{
                    collection.title }}</span>
              </NuxtLink>
            </template>
          </li>
        </ul>
      </li>
    </ul>
  </section>
</template>
<style scoped>
@keyframes fadein {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes fadeout {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

.fadein {
  animation: fadein 150ms ease-in-out;
}

.fadeout {
  animation: fadeout 150ms ease-in-out;
}
</style>
