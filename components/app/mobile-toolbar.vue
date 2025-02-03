<script setup>
const data = useSiteNavigationStore();
const mobileNavigation = data.mobileNavigation;
const articleCollectionNavigation = useArticleCollectionNavigationStore();
const articleNavigation = articleCollectionNavigation.articleCollectionNavigation;
const printifyCollectionNavigation = usePrintifyCollectionNavigationStore();
const productNavigation = printifyCollectionNavigation.printifyCollectionNavigation;

const isToggled = ref(false);
watch(isToggled, (newValue) => {
  if (newValue) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "scroll";
  }
});

const toggleNav = () => {
  isToggled.value = !isToggled.value;
};

// const visible = ref(false);
</script>
<template>
  <div id="mobile-toolbar"
    class="bg-surface-200 dark:bg-primary-950 border-surface-950 dark:border-surface-400 text-surface-800 dark:text-surface-100 fixed bottom-0 left-0 right-0 z-[9999] flex w-full justify-around gap-8 border-t p-1 md:hidden">
    <NuxtLink to="/" aria-controls="homeNavigation"
      class="text-surface-700 dark:text-surface-200 align-center cursor-pointer justify-center px-4 py-2 flex flex-col"
      @click="!isToggled ? !isToggled : toggleNav()">
      <icons-fa-duotone-house />
      <span class="text-xs">Home</span>
    </NuxtLink>
    <div class="flex flex-col align-center justify-center">
      <div aria-controls="mobileNavigation" @click="toggleNav()"
        class="open-close-icon text-surface-700 dark:text-surface-200 align-center cursor-pointer justify-center"
        :class="{ 'toggle-icon': isToggled }">
        <icons-fa-duotone-angles-up />
      </div>
      <span class="text-xs justify-center">Menu</span>
    </div>
  </div>

  <Sidebar v-model:visible="isToggled" position="bottom">
    <template #container>
      <div class="flex h-full flex-col pb-[56px] gap-8">
        <div
          class="flex flex-shrink-0 items-center justify-between border-b-[1px] px-6 py-4  bg-surface-800 dark:bg-surface-300 text-surface-200 dark:text-surface-700">
          <div class="mx-auto max-w-[75%] text-center">
            <promotion-menu-slide @closeMenu="toggleNav()" />
          </div>
          <div aria-controls="mobileNavigation" @click="toggleNav()"
            class="open-close-icon dark:text-surface-700 text-surface-200 align-center flex grow-0 cursor-pointer justify-center px-4 py-2"
            :class="{ 'toggle-icon': isToggled }">
            <icons-fa-duotone-angles-up />
          </div>
        </div>
        <div class="overflow-y-auto mx-10">
          <template v-for="item in mobileNavigation.navigationLinks" :key="item._id">
            <div id="article-collection-list"
              v-if="item.linkType === 'int' && item.internalLink.id === 'articleCollectionNavigation'">
              <ul class="mx-0 my-5 list-none">
                <li>
                  <ul class="m-0 list-none overflow-hidden p-0">
                    <li class="mb-4">
                      <NuxtLink to="/the-rant-files" @click="toggleNav()"
                        class="text-surface-700 dark:after:bg-primary-500 hover:text-surface-900 dark:text-surface-300 hover:dark:text-surface-100 relative block w-fit text-sm font-semibold">
                        <h3
                          class="after:bg-primary-700 dark:after:bg-primary-500 relative after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-[0%] after:rounded-xl after:duration-300 after:content-[''] hover:after:w-[100%]">
                          {{ articleNavigation.title }}
                        </h3>
                      </NuxtLink>
                    </li>
                    <li v-for="collection in articleNavigation.articleCollectionNavGroup" :key="collection._id">
                      <template v-if="collection.childCollections">
                        <div v-styleclass="{
                          selector: '@next',
                          enterClass: 'hidden',
                          enterActiveClass: 'fadein',
                          leaveToClass: 'hidden',
                          leaveActiveClass: 'fadeout',
                        }"
                          class="text-surface-700 dark:after:bg-primary-500 hover:text-surface-900 dark:text-surface-300 hover:dark:text-surface-100 relative relative block flex w-fit cursor-pointer items-center px-3 py-4 text-lg font-semibold">
                          <icons-fa-duotone-angle-down />
                          <div class="text-nowrap">
                            <span class="font-medium">{{ collection.title }}</span>
                          </div>
                        </div>
                        <ul class="ml-4 hidden list-none overflow-hidden">
                          <li>
                            <NuxtLink :to="`/the-rant-files/collections/${collection.slug}`" @click="toggleNav()"
                              class="text-surface-700 hover:text-surface-900 dark:text-surface-300 hover:dark:text-surface-100 relative block w-fit py-1 pl-8 font-semibold">
                              <span
                                class="after:bg-primary-700 dark:after:bg-primary-500 relative after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-[0%] after:rounded-xl after:duration-300 after:content-[''] hover:after:w-[100%]">
                                {{ collection.title }}
                              </span>
                            </NuxtLink>
                          </li>
                          <li v-for="child in collection.childCollections" :key="child._id">
                            <NuxtLink :to="`/the-rant-files/collections/${collection.slug}/${child.slug}`"
                              @click="toggleNav()"
                              class="text-surface-700 hover:text-surface-900 dark:text-surface-300 hover:dark:text-surface-100 relative block w-fit py-1 pl-8 font-semibold">
                              <span
                                class="after:bg-primary-700 dark:after:bg-primary-500 relative after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-[0%] after:rounded-xl after:duration-300 after:content-[''] hover:after:w-[100%]">{{
                                  child.title }}</span>
                            </NuxtLink>
                          </li>
                        </ul>
                      </template>
                      <template v-else>
                        <NuxtLink :to="`/the-rant-files/collections/${collection.slug}`" @click="toggleNav()"
                          class="text-surface-700 hover:text-surface-900 dark:text-surface-300 hover:dark:text-surface-100 relative block w-fit py-2 pl-5 font-semibold">
                          <span
                            class="after:bg-primary-700 dark:after:bg-primary-500 relative after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-[0%] after:rounded-xl after:duration-300 after:content-[''] hover:after:w-[100%]">{{
                              collection.title }}</span>
                        </NuxtLink>
                      </template>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <div id="printify-collection-list"
              v-else-if="item.linkType === 'int' && item.internalLink.id === 'printifyCollectionNavigation'">
              <ul class="m-0 list-none">
                <li>
                  <ul class="mx-0 my-5 list-none overflow-hidden p-0">
                    <li class="mb-4">
                      <NuxtLink to="/products" @click="toggleNav()"
                        class="text-surface-700 dark:after:bg-primary-500 hover:text-surface-900 dark:text-surface-300 hover:dark:text-surface-100 relative block w-fit text-sm font-semibold">
                        <h3
                          class="after:bg-primary-700 dark:after:bg-primary-500 relative after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-[0%] after:rounded-xl after:duration-300 after:content-[''] hover:after:w-[100%]">
                          {{ productNavigation.title }}
                        </h3>
                      </NuxtLink>
                    </li>
                    <li v-for="collection in productNavigation.printifyCollectionNavGroup" :key="collection._id">
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
                            <NuxtLink :to="`/products/collections/${collection.slug}`" @click="toggleNav()"
                              class="text-surface-700 hover:text-surface-900 dark:text-surface-300 hover:dark:text-surface-100 relative block w-fit py-1 pl-8 font-semibold">
                              <span
                                class="after:bg-primary-700 dark:after:bg-primary-500 relative after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-[0%] after:rounded-xl after:duration-300 after:content-[''] hover:after:w-[100%]">
                                All {{ collection.title }}
                              </span>
                            </NuxtLink>
                          </li>
                          <li v-for="child in collection.childCollections" :key="child._id">
                            <NuxtLink :to="`/products/collections/${collection.slug}/${child.slug}`"
                              @click="toggleNav()"
                              class="text-surface-700 hover:text-surface-900 dark:text-surface-300 hover:dark:text-surface-100 relative block w-fit py-1 pl-8 font-semibold">
                              <span
                                class="after:bg-primary-700 dark:after:bg-primary-500 relative after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-[0%] after:rounded-xl after:duration-300 after:content-[''] hover:after:w-[100%]">{{
                                  child.title }}</span>
                            </NuxtLink>
                          </li>
                        </ul>
                      </template>
                      <template v-else>
                        <NuxtLink :to="`/products/collections/${collection.slug}`" @click="toggleNav()"
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
            </div>
            <div v-else-if="item.linkType === 'int'">
              <NuxtLink
                class="text-surface-700 hover:text-surface-900 dark:text-surface-300 hover:dark:text-surface-100 relative block w-fit py-1 font-semibold"
                @click="toggleNav()" :to="`/${item.internalLink.slug}`"><span
                  class="after:bg-primary-700 dark:after:bg-primary-500 relative after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-[0%] after:rounded-xl after:duration-300 after:content-[''] hover:after:w-[100%]">{{
                    item.internalLink.title }}</span>
              </NuxtLink>
            </div>
          </template>
        </div>
        <!-- <div
          class="mt-auto flex place-content-center border-t-[1px] px-4 py-2 bg-surface-800 dark:bg-surface-300 text-surface-200 dark:text-surface-700">
          <NuxtLink to="/products" class="cursor-pointer" @click="toggleNav()">
            <span class="font-brand font-xl">25% off all products in Store</span>
          </NuxtLink>
        </div> -->
      </div>
    </template>
  </Sidebar>
</template>
<style scoped>
.toggle-icon {
  transform: rotateX(180deg);
}

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
