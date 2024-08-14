import { qryArticleCollectionNavigation } from "~/queries/articles";
export const useArticleCollectionNavigationStore = defineStore(
  "article-collection-navigation",
  {
    state: () => {
      return {
        articleCollectionNavigation: {},
      };
    },
    actions: {
      async fetchArticleCollectionNavigation() {
        const { data } = await useSanityQuery(qryArticleCollectionNavigation);
        this.articleCollectionNavigation = data.value;
        // console.log(
        //   "Collection Navigation Store: ",
        //   JSON.stringify(data.value, null, 2),
        // );
      },
    },
  },
);

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useArticleCollectionNavigationStore, import.meta.hot),
  );
}
