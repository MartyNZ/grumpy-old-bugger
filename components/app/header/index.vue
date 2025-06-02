<template>
  <header
    class="bg-surface-200 shadow-surface-400 dark:bg-surface-800 dark:shadow-surface-700 sticky top-0 z-30 shadow-sm">
    <div class="bg-surface-200 dark:bg-surface-800 dark:text-surface-100 w-full">
      <div class="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between px-2 py-2 md:px-4">
        <AppBrand />
        <div class="flex items-center gap-1 md:gap-3 justify-self-end ml-auto">
          <div class="flex">
            <app-header-navigation />
            <product-cart-summary />
            <!-- <app-settings /> -->
            <app-colour-mode />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
