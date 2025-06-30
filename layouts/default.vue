<script setup></script>
<template>
  <div>
    <div
      class="relative z-20 mb-[600px] w-full bg-surface-50 text-surface-900 shadow-sm shadow-surface-400 @container dark:bg-surface-900 dark:text-surface-100 dark:shadow-surface-600 md:mb-[425] md:min-h-fit lg:mb-[297px]">
      <main class="mx-auto max-w-7xl px-4 pb-12 pt-4 @container">
        <slot name="main" />
      </main>
    </div>
  </div>
</template>

<style>
.snipcart-modal__container {
  z-index: 1500;
}
</style>
