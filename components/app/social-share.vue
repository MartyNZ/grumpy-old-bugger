<script setup>
const { $config } = useNuxtApp()
const route = useRoute()
const fullUrl = computed(() => $config.public.publicUrl + route.fullPath)
</script>

<template>
  <div class="ml-auto flex flex-row items-center justify-center gap-1">
    <span class="mr-1 text-sm text-primary-900 dark:text-primary-400">Share on:</span>
    <template v-for="network in ['facebook', 'linkedin', 'pinterest', 'email']" :key="network">
      <NuxtLink v-if="network === 'facebook'"
        :to="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`" target="_blank"
        class="@sm:text-sm @md:px-2 @md:text-base rounded-lg px-1 text-xs hover:text-[color:--color-brand]">
        <Icon name="fa:facebook" />
      </NuxtLink>
      <SocialShare v-else :network="network" :label="false"
        class="@sm:text-sm @md:px-2 @md:text-base rounded-lg px-1 text-xs hover:text-[color:--color-brand]" />
    </template>
  </div>
</template>
