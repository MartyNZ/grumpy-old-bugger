import { qryPrintifyCollectionNavigation } from "~/queries/printify";
export const usePrintifyCollectionNavigationStore = defineStore(
  "printify-collection-navigation",
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
        return this.printifyCollectionNavigation;
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
    acceptHMRUpdate(usePrintifyCollectionNavigationStore, import.meta.hot),
  );
}
