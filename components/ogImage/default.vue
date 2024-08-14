<script setup>
// inherited attrs can mess up the satori parser
defineOptions({
  inheritAttrs: false,
});

const props = defineProps({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  background: {
    type: String,
  },
  color: {
    type: String,
    default: "white",
  },
  padding: {
    type: String,
    default: "0 50px",
  },
  titleFontSize: {
    type: String,
    default: "50px",
  },
  descriptionFontSize: {
    type: String,
    default: "35px",
  },
  icon: {
    type: [String, Boolean],
    default: "/assets/imgs/favicon.png",
  },
  image: {
    type: String,
    required: false,
  },
  siteName: {
    type: String,
    required: true,
  },
  siteLogo: {
    type: String,
    required: true,
  },
  cta: {
    type: String,
  },
});

const backgroundAttrs = computed(() => {
  // we want to make a
  // const isBackgroundTw = props.background?.startsWith('bg-')
  return {
    style: {
      display: "flex",
      position: "absolute",
      width: "100%",
      height: "100%",
      background:
        "radial-gradient(circle, #8D8895 0%, #2D2B31 30%, #171618 80%)",
    },
  };
});

const backgroundFlareAttrs = computed(() => {
  // we want to make a
  // const isBackgroundTw = props.background?.startsWith('bg-')
  return {
    style: {
      display: "flex",
      position: "absolute",
      right: "-50%",
      top: "0%",
      width: "200%",
      height: "200%",
      backgroundImage:
        "radial-gradient(circle, #8D8895 0%, #2D2B31 30%, #171618 80%)",
    },
  };
});

const backgroundFlareTwoAttrs = computed(() => {
  // we want to make a
  // const isBackgroundTw = props.background?.startsWith('bg-')
  return {
    style: {
      display: "flex",
      position: "absolute",
      left: "-5%",
      width: "150%",
      height: "150%",
      backgroundImage:
        "radial-gradient(circle, #8D8895 0%, #2D2B31 30%, #171618 80%)",
    },
  };
});

const titleAttrs = computed(() => {
  const classes = ["text-surface-100"];
  const styles = {
    fontWeight: "bold",
    marginBottom: "50px",
    lineHeight: "70px",
    fontSize: props.titleFontSize,
  };
  return { class: classes, style: styles };
});

const siteConfig = useSiteConfig();
const siteName = computed(() => {
  return props.siteName || siteConfig.name;
});
const siteLogo = computed(() => {
  return (
    props.siteLogo ||
    siteConfig.logo
  );
});
</script>

<template>
  <div v-bind="backgroundAttrs" />
  <div v-bind="backgroundFlareAttrs" />
  <div v-bind="backgroundFlareTwoAttrs" />
  <div class="flex w-full flex-row">
    <div class="w-1/2" style="padding: 50px">
      <div class="flex h-full flex-col justify-between">
        <div class="flex flex-row items-center justify-between">
          <div class="flex flex-col">
            <div v-bind="titleAttrs" style="color:#fff;">
              {{ title || "Null Title" }}
            </div>
            <p class="text-surface-200" style="font-weight: 700; color: #e0e2e5; font-size: 2rem;">
              {{ description }}
            </p>
            <p v-if="cta" style="font-weight: 700; color: #ca1028; font-size: 3rem; padding-top: 2rem">
              {{ cta }}
            </p>
          </div>
        </div>
        <div class="text-surface-50 flex w-full flex-row">
          <img v-if="siteLogo" :src="siteLogo" height="50" class="mr-5 rounded" />
          <div style="color: #e0e2e5; font-size: 1.5rem" class="mt-2 font-bold">
            {{ siteName }}
          </div>
        </div>
      </div>
    </div>
    <div class="w-1/2 items-end justify-center">
      <img v-if="image" :src="image" height="630" width="630" style="object-fit: cover" class="max-w-full rounded-xl" />
    </div>
  </div>
</template>
