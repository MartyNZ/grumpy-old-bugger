<script setup>
const data = useSiteNavigationStore();
const footerNavigation = data.footerNavigation;
</script>
<template>
  <div class="w-full px-4 text-right md:w-1/2">
    <span class="mb-2 block text-sm font-semibold uppercase">
      Useful Links
    </span>
    <ul class="list-unstyled">
      <li v-for="link in footerNavigation.links" :key="link._id">
        <NuxtLink
          class="text-surface-700 hover:text-surface-900 dark:text-surface-300 hover:dark:text-surface-100 relative block pb-2 text-sm font-semibold"
          :to="`/${link.slug}`"
          ><span
            class="after:bg-primary-700 dark:after:bg-primary-500 relative after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-[0%] after:rounded-xl after:duration-300 after:content-[''] hover:after:w-[100%]"
            >{{ link.title }}</span
          ></NuxtLink
        >
      </li>
    </ul>
  </div>
</template>
