import {
  qryMainNavigation,
  qryFooterNavigation,
  qryMobileNavigation,
  qryOtherNav,
} from "~/queries/siteNavigation";
export const useSiteNavigationStore = defineStore("navigation", {
  state: () => {
    return {
      mainNavigation: {},
      footerNavigation: {},
      mobileNavigation: {},
      otherNavigation: {},
    };
  },
  actions: {
    async fetchStoreNavigation() {
      const { data: mainNav } = await useSanityQuery(qryMainNavigation);
      this.mainNavigation = mainNav.value;
      const { data: footerNav } = await useSanityQuery(qryFooterNavigation);
      this.footerNavigation = footerNav.value;
      const { data: mobileNav } = await useSanityQuery(qryMobileNavigation);
      this.mobileNavigation = mobileNav.value;
      const { data: otherNav } = await useSanityQuery(qryOtherNav);
      this.otherNavigation = otherNav.value;
      return this;
      // console.log(JSON.stringify(mainNav.value));
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useSiteNavigationStore, import.meta.hot)
  );
}
