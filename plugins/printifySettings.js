/* get global page data on start */
export default defineNuxtPlugin(async (nuxtApp) => {
  const printifyCollectionNavigation = usePrintifyCollectionNavigationStore();
  await printifyCollectionNavigation.fetchPrintifyCollectionNavigation();

  const printifyTagsLookup = usePrintifyTagsLookupStore();
  const tagsLookup = await printifyTagsLookup.fetchPrintifyTags();

  // console.log("tagsLookup:", tagsLookup);

  // Add all the stores to the Nuxt context
  nuxtApp.provide("printifyCollectionNavigation", printifyCollectionNavigation);
  nuxtApp.provide("printifyTagsLookup", tagsLookup);
  // console.log(
  //   "printifyTagsLookup store after adding to Nuxt context:",
  //   nuxtApp.$printifyTagsLookup,
  // );
});
