<script setup>
const router = useRouter();

// Scroll to top after each navigation
router.afterEach(() => {
  window.scrollTo(0, 0);
});
</script>

<template>
  <NuxtLoadingIndicator color="repeating-linear-gradient(to right,#240000 0%,#8A0000 50%,#FFD1D1 100%)" height:8 />
  <VitePwaManifest />
  <div
    class="bg-surface-0 text-surface-900 dark:bg-surface-950 dark:text-surface-50 shadow-surface-400 relative min-h-full">
    <AppHeader />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <AppFooter />
    <AppMobileToolbar />
    <ScrollTop />
    <DynamicDialog />
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}

.snipcart-modal__container {
  z-index: 1550;
}
</style>
