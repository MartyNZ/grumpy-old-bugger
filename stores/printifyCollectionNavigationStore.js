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

        if (data.value && data.value.printifyCollectionNavGroup) {
          // Filter out collections with no products
          const filteredCollections = data.value.printifyCollectionNavGroup
            .map((collection) => {
              // Filter child collections that have products
              const filteredChildren = collection.childCollections
                ? collection.childCollections.filter(
                    (child) => child.productCount > 0
                  )
                : [];

              // Calculate total product count (parent + children)
              const totalProductCount =
                (collection.productCount || 0) +
                filteredChildren.reduce(
                  (sum, child) => sum + (child.productCount || 0),
                  0
                );

              return {
                ...collection,
                childCollections: filteredChildren,
                totalProductCount,
              };
            })
            // Only keep collections that have products (either in parent or children)
            .filter((collection) => collection.totalProductCount > 0);

          this.printifyCollectionNavigation = {
            ...data.value,
            printifyCollectionNavGroup: filteredCollections,
          };
        } else {
          this.printifyCollectionNavigation = data.value;
        }

        return this.printifyCollectionNavigation;
        // console.log(
        //   "Collection Navigation Store: ",
        //   JSON.stringify(data.value, null, 2),
        // );
      },
    },
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(usePrintifyCollectionNavigationStore, import.meta.hot)
  );
}
