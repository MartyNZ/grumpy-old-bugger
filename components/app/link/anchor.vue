<script setup>
const props = defineProps({
  slug: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  anchor: {
    type: String,
    required: true
  }
})

</script>

<template>
  <NuxtLink
    class="text-surface-700 hover:text-surface-900 dark:text-surface-300 hover:dark:text-surface-100 relative block pb-2 text-sm font-semibold"
    :to="`/${slug}#${anchor}`">
    <span
      class="after:bg-primary-700 dark:after:bg-primary-500 relative after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-[0%] after:rounded-xl after:duration-300 after:content-[''] hover:after:w-[100%]">
      {{ name }}
    </span>
  </NuxtLink>
</template>
