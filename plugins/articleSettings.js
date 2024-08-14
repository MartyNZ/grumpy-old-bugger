/* get global page data on start */
export default defineNuxtPlugin(async (nuxtApp) => {
  const articleCollectionNavigation = useArticleCollectionNavigationStore();
  await articleCollectionNavigation.fetchArticleCollectionNavigation();
  nuxtApp.provide("articleCollectionNavigation", articleCollectionNavigation);
});
