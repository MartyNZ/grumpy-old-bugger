// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  debug: false,

  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },

  modules: [
    "@nuxtjs/color-mode",
    "@nuxtjs/sanity",
    "@pinia/nuxt",
    "@stefanobartoletti/nuxt-social-share",
    "@vite-pwa/nuxt",
    "nuxt-mail",
    "@nuxtjs/tailwindcss",
    "nuxt-primevue",
    "@vueuse/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxt/fonts",
    "nuxt3-meta-pixel",
    "nuxt-posthog",
    "@nuxtjs/seo",
    "vue3-carousel-nuxt",
    "@vee-validate/nuxt",
  ],

  veeValidate: {
    // disable or enable auto imports
    autoImports: true,
    componentNames: {
      Form: "vForm",
      Field: "vField",
      ErrorMessage: "vErrorMessage",
    },
  },
  carousel: {
    prefix: "v3cn",
  },

  posthog: {
    disabled: true,
  },
  // ogImage: {
  //   enabled: false,
  // },
  // sitemap: {
  //   enabled: false,
  // },
  // robots: {
  //   enabled: false,
  // },
  // seoExperiments: {
  //   enabled: false,
  // },
  // schemaOrg: {
  //   enabled: false,
  // },
  linkChecker: {
    excludeLinks: ["/"],
    report: {
      // generate both a html and markdown report
      html: true,
    },
  },

  routeRules: {
    "/promotions/": {
      redirect: "/",
    },
  },
  facebook: {
    track: "PageView",
    pixelId: process.env.FACEBOOK_PIXEL_ID,
    autoPageView: true,
    disabled: true,
    debug: false,
  },

  mail: {
    message: {
      to: process.env.EMAIL_TO,
    },
    smtp: {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    },
  },

  primevue: {
    options: {
      unstyled: true,
    },
    directives: {
      include: ["Tooltip", "StyleClass", "UseDialog"],
    },
    components: {
      include: [
        "Button",
        "InputText",
        "TextArea",
        "BreadCrumb",
        "TabPanel",
        "TabView",
        "Image",
        "Skeleton",
        "ScrollTop",
        "DynamicDialog",
        "Sidebar",
        "Carousel",
        "Divider",
      ],
    },
    importPT: { as: "webcnxnz", from: "~/presets/webcnxnz" },
    cssLayerOrder: "tailwind-base, primevue, tailwind-utilities",
  },

  colorMode: {
    classSuffix: "",
  },

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: process.env.NUXT_SITE_NAME,
      short_name: process.env.NUXT_SITE_NAME,
      description: process.env.NUXT_SITE_DESCRIPTION,
      display_override: ["standalone", "window-controls-overlay", "fullscreen"],
      theme_color: process.env.NUXT_SITE_THEME_COLOR,
      orientation: "portrait",
      id: process.env.NUXT_SITE_PUBLISHED_URL,
      start_url: process.env.NUXT_SITE_PUBLISHED_URL,
      icons: [
        {
          src: "/assets/imgs/logo_192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/assets/imgs/logo_512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/assets/imgs/logo_maskable.png",
          sizes: "196x196",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
    workbox: {
      navigateFallback: "/",
    },
    // devOptions: {
    //   enabled: false,
    //   type: "module",
    // },
  },

  site: {
    site: {
      identity: {
        type: process.env.NUXT_SITE_TYPE,
        brand: process.env.NUXT_SITE_NAME,
        logo: `"${process.env.NUXT_SITE_PUBLISHED_URL}/assets/imgs/logo_512.png"`,
        location: process.env.NUXT_SITE_LOCATION,
        url: process.env.NUXT_SITE_PUBLISHED_URL,
      },
    },
    url: process.env.NUXT_SITE_PUBLISHED_URL,
    name: process.env.NUXT_SITE_NAME,
    description: process.env.NUXT_SITE_DESCRIPTION,
    defaultLocale: process.env.NUXT_SITE_DEFAULT_LOCALE,
  },

  app: {
    head: {
      titleTemplate: "%s %separator %siteName",
      meta: [
        { name: "generator", content: "Nuxt 3" },
        { name: "theme-color", content: process.env.NUXT_SITE_THEME_COLOR },
      ],
      script: [
        {
          src: "https://kit.fontawesome.com/ec0be17e84.js",
          crossorigin: "anonymous",
        },
      ],
      link: [
        {
          rel: "icon",
          href: "/assets/imgs/favicon.ico",
        },
        {
          rel: "mask-icon",
          href: "/assets/imgs/logo_maskable.png",
          color: "#fffff",
        },
        {
          rel: "apple-touch-icon",
          href: "/assets/imgs/apple-touch-icon.png",
          sizes: "192x192",
        },
      ],
    },
  },

  css: ["~/assets/css/base.css"],

  sanity: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
    apiVersion: process.env.SANITY_STUDIO_API_VERSION,
  },

  runtimeConfig: {
    public: {
      sanity: {
        projectId: process.env.SANITY_STUDIO_PROJECT_ID,
        dataset: process.env.SANITY_STUDIO_DATASET,
      },
      titleSeparator: "|",
      siteName: process.env.NUXT_SITE_NAME,
      publicUrl: process.env.NUXT_SITE_PUBLISHED_URL,
      snipCartApiKey: process.env.SNIPCART_API_KEY,
    },
    sanity: {
      token: process.env.SANITY_STUDIO_ADMIN_AUTH_TOKEN,
    },
    printifyStoreId: process.env.PRINTIFY_STORE_ID,
    printifyBearerToken: process.env.PRINTIFY_BEARER_TOKEN,
  },

  imports: {
    dirs: ["stores"],
  },

  compatibilityDate: "2024-07-09",
});
