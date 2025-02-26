<script setup>
const router = useRouter();
const data = useSiteSettingsStore();
const settings = data.settings;


useHead({
  meta: [
    { name: "theme-color", content: settings.theme }
  ]
})

// Scroll to top after each navigation
router.afterEach(() => {
  window.scrollTo(0, 0);
});
</script>

<template>
  <NuxtLoadingIndicator color="repeating-linear-gradient(to right,#0c0c0e 0%,#6b7280 50%,#e0e2e5 100%)" height:8 />
  <VitePwaManifest />
  <div
    class="bg-surface-0 text-surface-900 dark:bg-surface-950 dark:text-surface-50 shadow-surface-400 relative min-h-full">
    <AppHeader />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <AppFooter />
    <AppMobileToolbar />
    <ConfirmDialog />
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
