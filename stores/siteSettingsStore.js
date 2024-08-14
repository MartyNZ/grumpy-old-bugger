import { qrySiteSettings } from "~/queries/siteSettings";
export const useSiteSettingsStore = defineStore("site-settings", {
  state: () => {
    return {
      settings: {},
    };
  },
  actions: {
    async fetchStoreSettings() {
      const { data } = await useSanityQuery(qrySiteSettings);
      this.settings = data.value;
      return this.settings;
      // console.log("From State: ", JSON.stringify(this.settings));
    },
  },
});
