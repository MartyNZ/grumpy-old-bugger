import { qrySiteNavigation } from "~/queries/siteSettings";
export const useSiteNavigationStore = defineStore("navigation", {
  state: () => {
    return {
      mainNavigation: {},
      footerNavigation: {},
    };
  },
  actions: {
    async fetchStoreNavigation() {
      const { data } = await useSanityQuery(qrySiteNavigation);
      this.mainNavigation = data.value.mainNav;
      this.footerNavigation = data.value.footerNav;
      return this;
      // console.log(JSON.stringify(data.value.mainNav));
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useSiteNavigationStore, import.meta.hot)
  );
}
