<script setup>
const articleCollectionNavigation = useArticleCollectionNavigationStore();
const articleNavigation = articleCollectionNavigation.articleCollectionNavigation;

const data = useSiteNavigationStore();
const mainNavigation = data.mainNavigation;
const footerNavigation = data.footerNavigation;

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
    class="bg-surface-200 dark:bg-primary-950 border-surface-950 text-surface-800 dark:text-surface-100 fixed bottom-0 left-0 right-0 z-[9999] flex w-full justify-around gap-8 border-t p-1 md:hidden">
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
          <div class="mx-auto w-full text-center">
            <!-- <NuxtLink @click="toggleNav()" class="cursor-pointer" to:='/products'>
              <span class="font-semibold font-brand uppercase">Grand opening Specials</span>
            </NuxtLink> -->
          </div>
          <div aria-controls="mobileNavigation" @click="toggleNav()"
            class="open-close-icon dark:text-surface-700 text-surface-200 align-center flex grow-0 cursor-pointer justify-center px-4 py-2"
            :class="{ 'toggle-icon': isToggled }">
            <icons-fa-duotone-angles-up />
          </div>
        </div>
        <div class="overflow-y-auto">
          <ul class="list-none px-4 w-full">
            <li v-if="articleNavigation">
              <NuxtLink :to="`/${articleNavigation.slug}`" @click="toggleNav()"
                class="text-surface-700 dark:after:bg-primary-500 hover:text-surface-900 dark:text-surface-300 hover:dark:text-surface-100 flex cursor-pointer items-center justify-between px-4 py-2">
                <span
                  class="after:bg-primary-700 dark:after:bg-primary-500 relative after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-[0%] after:rounded-xl after:duration-300 after:content-[''] hover:after:w-[100%] font-medium uppercase">{{
                    articleNavigation.title }}</span>
              </NuxtLink>
            </li>
          </ul>
          <template v-for="link in mainNavigation.links" :key="link._id">
            <ul class="list-none px-4 w-full">
              <li v-if="link._type == 'printify.collectionNavigation'">
                <div v-styleclass="{
                  selector: '@next',
                  enterClass: 'hidden',
                  enterActiveClass: 'fadein',
                  leaveToClass: 'hidden',
                  leaveActiveClass: 'fadeout',
                }"
                  class="text-surface-600 dark:text-surface-300 dark:hover:text-surface-100 flex cursor-pointer items-center justify-between px-4 py-2">
                  <span class="basis-1/2 font-medium uppercase">
                    {{ link.title }}
                  </span>
                  <icons-fa-duotone-angle-down />
                </div>
                <ul class="ml-4 hidden list-none overflow-hidden p-0">
                  <li class="mb-4 py-2">
                    <NuxtLink to="/products" @click="toggleNav()"
                      class="text-surface-700 hover:text-surface-900 dark:text-surface-300 hover:dark:text-surface-100 relative block w-fit text-sm font-semibold cursor-pointer flex items-center gap-2 ml-8">
                      <div
                        class="border-surface-700 h-8 w-8 rounded-full overflow-hiddem border-[1px] bg-cover bg-center bg-no-repeat">
                        <img class="rounded-full object-cover" :src="link.printifyCollectionNavGroup[1].parentCollection
                          .imageUrl
                          " />
                      </div>
                      <span
                        class="after:bg-primary-700 dark:after:bg-primary-500 relative after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-[0%] after:rounded-xl after:duration-300 after:content-[''] hover:after:w-[100%] font-medium">All
                        {{ link.title }}</span>
                    </NuxtLink>
                  </li>
                  <li v-for="collection in link.printifyCollectionNavGroup" :key="collection._id">
                    <template v-if="collection.childCollections">
                      <div v-styleclass="{
                        selector: '@next',
                        enterClass: 'hidden',
                        enterActiveClass: 'fadein',
                        leaveToClass: 'hidden',
                        leaveActiveClass: 'fadeout',
                      }"
                        class="text-surface-600 dark:text-surface-300 dark:hover:text-surface-100 flex cursor-pointer items-center justify-between px-4 py-2">
                        <div class="flex basis-1/2 gap-2 text-nowrap">
                          <div
                            class="border-surface-700 h-8 w-8 rounded-full border-[1px] bg-cover bg-center bg-no-repeat"
                            :style="`background-image:url(${collection.parentCollection
                              .imageUrl})`">
                            <!--
                            <img
                              class="rounded-full object-cover"
                              :src="collection.parentCollection.imageUrl"
                            /> -->
                          </div>
                          <span class="relative  uppercase font-medium">
                            {{ collection.title }}
                          </span>
                        </div>
                        <icons-fa-duotone-angle-down />
                      </div>
                      <ul class="mb-4 hidden list-none overflow-hidden p-0">
                        <li class="py-2">
                          <NuxtLink :to="`/products/collections/${collection.slug}`" @click="toggleNav()"
                            class="text-surface-700 hover:text-surface-900 dark:text-surface-300 hover:dark:text-surface-100 relative block w-fit text-sm font-semibold cursor-pointer flex items-center gap-2 ml-8">
                            <div class="flex w-full cursor-pointer items-center justify-between px-4 py-0">
                              <div class="flex gap-2 text-nowrap">
                                <div
                                  class="border-surface-700 h-6 w-6 rounded-full border-[1px] bg-cover bg-center bg-no-repeat"
                                  :style="`background-image:url(${collection.parentCollection.imageUrl})`">
                                  <!-- <img
                                    class="rounded-full object-cover"
                                    :src="collection.parentCollection.imageUrl"
                                  /> -->
                                </div>
                                <span
                                  class="after:bg-primary-700 dark:after:bg-primary-500 relative after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-[0%] after:rounded-xl after:duration-300 after:content-[''] hover:after:w-[100%] font-semibold">All
                                  {{ collection.title }}</span>
                              </div>
                            </div>
                          </NuxtLink>
                        </li>
                        <li v-for="child in collection.childCollections" :key="child._id" class="py-2">
                          <!-- <pre>{{ child }}</pre> -->
                          <NuxtLink :to="`/products/collections/${collection.slug}/${child.slug}`" @click="toggleNav()"
                            class="text-surface-700 hover:text-surface-900 dark:text-surface-300 dark:hover:text-surface-100 relative block w-fit text-sm font-semibold cursor-pointer flex items-center gap-2 ml-8">
                            <!-- <p>{{ collection.slug }}/{{ child.slug }}</p> -->
                            <div class="flex w-full cursor-pointer items-center justify-between px-4 py-0">
                              <div class="flex basis-1/2 gap-2 text-nowrap">
                                <div v-if="child.imageUrl"
                                  class="border-surface-700 h-6 w-6 rounded-full border-[1px]  bg-cover bg-center bg-no-repeat"
                                  :style="`background-image:url(${child.imageUrl})`">
                                  <!-- <img
                                    v-if="child.imageUrl"
                                    class="rounded-full object-cover"
                                    :src="child.imageUrl"
                                  /> -->
                                </div>
                                <div v-else class="h-6 w-6 rounded-full"></div>
                                <span
                                  class="after:bg-primary-700 dark:after:bg-primary-500 relative after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-[0%] after:rounded-xl after:duration-300 after:content-[''] hover:after:w-[100%]">{{
                                    child.title
                                  }}</span>
                              </div>
                            </div>
                          </NuxtLink>
                        </li>
                      </ul>
                    </template>
                    <template v-else>
                      <NuxtLink :to="`/products/collections/${collection.slug}`" @click="toggleNav()"
                        class="rounded-var text-surface-700 hover:surface-200  flex cursor-pointer items-center gap-2 p-4 transition-colors duration-150">
                        <div class="border-surface-700 h-8 w-8 rounded-full border-[1px]">
                          <img class="rounded-full object-cover" :src="collection.parentCollection.imageUrl" />
                        </div>
                        <span class="font-medium">{{ collection.title }}</span>
                      </NuxtLink>
                    </template>
                  </li>
                </ul>
              </li>
              <li v-else>
                <NuxtLink :to="`/${link.slug}`" @click="toggleNav()"
                  class="text-surface-700 dark:after:bg-primary-500 hover:text-surface-900 dark:text-surface-300 hover:dark:text-surface-100 flex cursor-pointer items-center justify-between px-4 py-2">
                  <span
                    class="after:bg-primary-700 dark:after:bg-primary-500 relative after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-[0%] after:rounded-xl after:duration-300 after:content-[''] hover:after:w-[100%] font-medium uppercase">{{
                      link.title }}</span>
                </NuxtLink>
              </li>
            </ul>
          </template>
          <template v-if="footerNavigation">
            <ul class="list-none px-4 w-full">
              <li>
                <div v-styleclass="{
                  selector: '@next',
                  enterClass: 'hidden',
                  enterActiveClass: 'fadein',
                  leaveToClass: 'hidden',
                  leaveActiveClass: 'fadeout',
                }"
                  class="text-surface-600 dark:text-surface-300 dark:hover:text-surface-100 flex cursor-pointer items-center justify-between px-4 py-2">
                  <span class="basis-1/2 font-medium uppercase">
                    Useful Links
                  </span>
                  <icons-fa-duotone-angle-down />
                </div>
                <ul class="ml-4 hidden list-none overflow-hidden p-0">
                  <li v-for="link in footerNavigation.links" :key="link._id">
                    <NuxtLink :to="`/${link.slug}`" @click="toggleNav()"
                      class="rounded-var text-surface-700 dark:text-surface-400 hover:surface-200  flex cursor-pointer items-center gap-2 px-4 py-1 transition-colors duration-150">
                      <span
                        class="after:bg-primary-700 dark:after:bg-primary-500 relative after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-[0%] after:rounded-xl after:duration-300 after:content-[''] hover:after:w-[100%] font-medium">{{
                          link.title }}</span>
                    </NuxtLink>
                  </li>
                </ul>
              </li>
            </ul>
          </template>
        </div>
        <div
          class="mt-auto flex place-content-center border-t-[1px] px-4 py-2 bg-surface-800 dark:bg-surface-300 text-surface-200 dark:text-surface-700">
          <!-- <NuxtLink to="/products" class="cursor-pointer" @click="toggleNav()"><span class="font-brand font-xl">25% off all products in Store</span></NuxtLink> -->
        </div>
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
