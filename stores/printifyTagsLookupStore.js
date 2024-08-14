import { qryProductTags } from "~/queries/printify";
import createTagsLookup from "~/utilities/createTagsLookup";

export const usePrintifyTagsLookupStore = defineStore("printify-tags-lookup", {
  state: () => {
    return {
      tagsLookup: {},
    };
  },
  actions: {
    async fetchPrintifyTags() {
      // Fetch the product tags from the qryProductTags query
      const { data: productTags } = await useSanityQuery(qryProductTags);
      const tagsLookup = createTagsLookup(productTags.value);
      this.tagsLookup = tagsLookup;
      return tagsLookup;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(usePrintifyTagsLookupStore, import.meta.hot),
  );
}
