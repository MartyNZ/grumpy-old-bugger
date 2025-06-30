<script setup></script>
<template>
  <div
    class="relative z-20 mb-[600px] w-full bg-surface-50 text-surface-900 shadow-sm shadow-surface-400 @container dark:bg-surface-900 dark:text-surface-100 dark:shadow-surface-600 md:mb-[425px] md:min-h-fit lg:mb-[297px]">
    <app-internal-nav />
    <div class="mx-auto grid max-w-[1280px] grid-cols-1 gap-3 lg:grid-cols-12">
      <main class="px-4 pb-8 pt-6 @container lg:col-span-9">
        <slot name="main" />
      </main>
      <aside class="px-4 py-8 @container lg:col-span-3">
        <slot name="sidebar" />
      </aside>
    </div>
  </div>
</template>
