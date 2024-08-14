import { qryPrintifyCollectionNavigation } from "~/queries/siteSettings";
export const usePrintifyCollectionNavigation = defineStore(
  "collection-navigation",
  {
    state: () => {
      return {
        printifyCollectionNavigation: {},
      };
    },
    actions: {
      async fetchPrintifyCollectionNavigation() {
        const { data } = await useSanityQuery(qryPrintifyCollectionNavigation);
        this.printifyCollectionNavigation = data.value;
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
    acceptHMRUpdate(usePrintifyCollectionNavigation, import.meta.hot),
  );
}
