// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-02-10",
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
    "pinia-plugin-persistedstate/nuxt",
    "@stefanobartoletti/nuxt-social-share",
    "@vite-pwa/nuxt",
    "nuxt-mail",
    "@nuxtjs/tailwindcss",
    "@primevue/nuxt-module",
    "@vueuse/nuxt",
    "@nuxt/fonts",
    "nuxt3-meta-pixel",
    "nuxt-posthog",
    "@nuxtjs/seo",
    "vue3-carousel-nuxt",
    "@vee-validate/nuxt",
    "@nuxt/icon",
    "nuxt-security",
  ],
  security: {
    headers: {
      contentSecurityPolicy: {
        "img-src": ["'self'", "'unsafe-inline'", "data:", "blob:", "https:"],
        "script-src": [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https:",
          "http:",
          "https://b5phpis0cqns.share.zrok.io",
          "'strict-dynamic'",
        ],
      },
    },
  },
  vite: {
    server: {
      allowedHosts: [
        "b5phpis0cqns.share.zrok.io",
        "https://grumpyoldbugger.store",
      ],
    },
  },
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
    disabled: false,
  },
  ogImage: {
    enabled: false,
  },
  sitemap: {
    enabled: true,
    sources: ["/api/__sitemap__/urls"],
  },
  robots: {
    // enabled: false,
    disallow: ["/secret", "/admin"],
    allow: "/admin/login",
  },
  seo: {
    // seo utils
    //   enabled: false,
  },
  schemaOrg: {
    // enabled: false,
    identity: {
      type: process.env.NUXT_SITE_TYPE,
      name: process.env.NUXT_PUBLIC_SITE_NAME,
      logo: "/assets/imgs/logo_maskable.png", // will resolve to canonical URL + /logo.png
      sameAs: [
        process.env.NUXT_SITE_PUBLISHED_URL,
        process.env.NUXT_SITE_FACEBOOK,
        process.env.NUXT_SITE_INSTAGRAM,
      ],
    },
  },
  linkChecker: {
    // enabled: false,
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
    disabled: false,
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
      include: ["Tooltip", "StyleClass", "UseDialog", "Ripple", "useConfirm"],
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
        "Dropdown",
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
      categories: ["entertainment", "lifestyle", "shopping"],
      display_override: ["standalone", "window-controls-overlay", "fullscreen"],
      theme_color: process.env.NUXT_SITE_THEME_COLOR,
      orientation: "portrait",
      id: process.env.NUXT_SITE_PUBLISHED_URL,
      start_url: process.env.NUXT_SITE_PUBLISHED_URL,
      launch_handler: {
        client_mode: ["focus-existing", "auto"],
      },
      shortcuts: [
        {
          name: "Rant Files",
          url: "/rant-files",
          description:
            "The ultimate refuge for the grumpiest old buggers around!",
        },
        {
          name: "Products",
          url: "/products",
          description: "View our growing collection.",
        },
      ],
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
      screenshots: [
        {
          src: "/assets/imgs/screenshot-narrow_01.webp",
          sizes: "720x1200",
          type: "image/webp",
          form_factor: "narrow",
          label: "Homescreen of Grumpy Old Bugger Store",
        },
        {
          src: "/assets/imgs/screenshot-narrow_02.webp",
          sizes: "720x1200",
          type: "image/webp",
          form_factor: "narrow",
          label: "Grumpy Old Bugger Rant Files",
        },
        {
          src: "/assets/imgs/screenshot-narrow_03.webp",
          sizes: "720x1200",
          type: "image/webp",
          form_factor: "narrow",
          label: "Grumpy Old Bugger Store Products Page",
        },
        {
          src: "/assets/imgs/screenshot-narrow_04.webp",
          sizes: "720x1200",
          type: "image/webp",
          form_factor: "narrow",
          label: "Grumpy Old Bugger Store Product Page",
        },
        {
          src: "/assets/imgs/screenshot-wide_01.webp",
          sizes: "1280x720",
          type: "image/webp",
          form_factor: "wide",
          label: "Homescreen of Grumpy Old Bugger Store",
        },
        {
          src: "/assets/imgs/screenshot-wide_02.webp",
          sizes: "1280x720",
          type: "image/webp",
          form_factor: "wide",
          label: "Grumpy Old Bugger Rant Files",
        },
        {
          src: "/assets/imgs/screenshot-wide_03.webp",
          sizes: "1280x720",
          type: "image/webp",
          form_factor: "wide",
          label: "Grumpy Old Bugger Store Products Page",
        },
        {
          src: "/assets/imgs/screenshot-wide_04.webp",
          sizes: "1280x720",
          type: "image/webp",
          form_factor: "wide",
          label: "Grumpy Old Bugger Store Product Page",
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
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      ],
      script: [],
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
  css: ["~/assets/css/base.css", "primeicons/primeicons.css"],
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
    googleOAuth: {
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URI,
    },
  },
  imports: {
    dirs: ["stores"],
  },
  nitro: {
    routeRules: {
      "/api/**": {
        cors: true,
        headers: {
          "access-control-allow-origin": "*",
        },
      },
    },
    storage: {
      rates: {
        driver: "fsLite",
        base: "/tmp/rates",
      },
    },
  },
});
