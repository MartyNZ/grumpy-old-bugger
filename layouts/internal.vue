<template>
  <div
    class="@container bg-surface-0 text-surface-900 shadow-surface-400 dark:bg-surface-950 dark:text-surface-50 relative z-20 mb-[440px] w-full shadow-sm sm:mb-[460px] md:mb-[297px] md:min-h-fit">
    <!-- <app-internal-nav /> -->
    <div class="mx-auto grid max-w-[1280px] grid-cols-1 gap-3 @3xl:grid-cols-7">
      <main class="@container px-4 pt-6 @3xl:col-span-4 @3xl:px-2 @5xl:col-span-5">
        <slot name="main" />
      </main>
      <aside class="@container px-4 py-8 @3xl:col-span-3 @3xl:px-2 @5xl:col-span-2">
        <slot name="sidebar" />
      </aside>
    </div>
  </div>
</template>
