<template>
  <client-only>
    <div class="relative mx-1 flex items-center">
      <!-- Cart Icon -->
      <a class="snipcart-checkout ml-1" href="#">
        <icons-fa-duotone-shopping-cart />
        <span
          class="snipcart-items-count bg-primary-700 text-surface-100 absolute -mt-8 ml-[6px] rounded-full px-[0.6em] py-[0.5em] text-[0.5rem] font-bold leading-none md:-mt-9 md:ml-2 md:px-[0.85em] md:py-[0.6em] md:text-[0.6rem]"
          >0</span
        >
      </a>
    </div>
  </client-only>
</template>
<style>
.fa-secondary {
  opacity: 0.4;
}
</style>
