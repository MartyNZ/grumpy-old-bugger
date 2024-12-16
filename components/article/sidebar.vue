<template>
  <div class="sticky top-[95px] mx-3 grid grid-cols-1 @2xl:grid-cols-2 @md:gap-3">
    <div class="hidden sm:pb-8 md:block">
      <article-collection-navigation />
    </div>
    <div class="pb-8 place-content-center">
      <promotion-gallery />
    </div>
    <div class="pb-8 place-content-center">
      <article-sidebar-latest number="4" />
    </div>
  </div>
</template>
