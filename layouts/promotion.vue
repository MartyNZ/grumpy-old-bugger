<template>
  <div
    class="@container bg-surface-0 text-surface-900 shadow-surface-400 dark:bg-surface-950 dark:text-surface-50 relative z-20 mb-[525px] w-full shadow-sm md:mb-[297px] md:min-h-fit lg:mb-[297px]">
    <div class="mx-auto">
      <main class="@container w-full m-0 p-0">
        <slot name="main" />
      </main>
    </div>
  </div>
</template>
