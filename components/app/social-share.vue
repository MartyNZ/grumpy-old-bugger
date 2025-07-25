<template>
  <div class="ml-auto flex flex-row items-center justify-center gap-1">
    <span class="mr-1 text-sm text-primary-900 dark:text-primary-400">Share on:</span>
    <SocialShare v-for="network in ['facebook', 'linkedin', 'pinterest', 'email']" :key="network" :network="network"
      :label="false"
      class="@sm:text-sm @md:px-2 @md:text-base rounded-lg px-1 text-xs hover:text-[color:--color-brand]" />
  </div>
</template>
