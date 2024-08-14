/* get global page data on start */
export default defineNuxtPlugin(async (nuxtApp) => {
  const siteSettingsStore = useSiteSettingsStore();
  await siteSettingsStore.fetchStoreSettings();

  const siteNavigation = useSiteNavigationStore();
  await siteNavigation.fetchStoreNavigation();

  // Add all the stores to the Nuxt context
  nuxtApp.provide("siteSettingsStore", siteSettingsStore);
  nuxtApp.provide("siteNavigation", siteNavigation);
});
