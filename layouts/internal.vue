<template>
  <div
    class="@container bg-surface-0 text-surface-900 shadow-surface-400 dark:bg-surface-950 dark:text-surface-50 relative z-20 mb-[525px] w-full shadow-sm md:mb-[297px] md:min-h-fit lg:mb-[297px]">
    <app-internal-nav />
    <div class="mx-auto grid max-w-[1280px] grid-cols-1 gap-3 lg:grid-cols-7">
      <main class="@container px-4 pt-6 lg:col-span-5">
        <slot name="main" />
      </main>
      <aside class="@container px-4 py-8 lg:col-span-2">
        <div class="sticky top-[95px] mx-3 grid grid-cols-1 @md:grid-cols-2 @md:gap-8 gap-10">
          <slot name="sidebar" />
        </div>
      </aside>
    </div>
  </div>
</template>
