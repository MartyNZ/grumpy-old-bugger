<template>
  <header
    class="bg-surface-200 shadow-surface-400 dark:bg-surface-800 dark:shadow-surface-700 sticky top-0 z-30 shadow-sm">
    <div class="bg-surface-700 w-full">
      <div class="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between px-2 py-2 md:px-4 text-surface-50">
        <AppBrand />
        <div class="flex items-center justify-end gap-1 md:gap-3">
          <app-header-navigation />
          <product-cart-summary />
          <AppColorMode />
        </div>
      </div>
    </div>
  </header>
</template>
