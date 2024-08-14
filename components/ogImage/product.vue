<script setup>
// inherited attrs can mess up the satori parser
defineOptions({
  inheritAttrs: false,
});

const props = defineProps({
  path: String,
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
  price: {
    type: String,
  },
});

const backgroundAttrs = computed(() => {
  // we want to make a
  // const isBackgroundTw = props.background?.startsWith("bg-");
  return {
    style: {
      display: "flex",
      position: "absolute",
      width: "100%",
      height: "100%",
      background: "linear-gradient(to left,#8D8895, #2D2B31 45%, #171618)",
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
      // backgroundImage: "radial-gradient(circle, #8D8895 0%, #2D2B31 30%, #171618 80%)",
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
      // backgroundImage: "radial-gradient(circle, #8D8895 0%, #2D2B31 30%, #171618 80%)",
    },
  };
});

const titleAttrs = computed(() => {
  const classes = ["text-primary-100"];
  const styles = {
    fontWeight: "bold",
    marginBottom: "50px",
    lineHeight: "70px",
    fontSize: props.titleFontSize,
    fontColor: props.color,
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
      <div class="text-white flex h-full flex-col justify-between">
        <div class="flex flex-row items-center justify-between">
          <div class="flex flex-col">
            <div style="font-size: 3.5rem">
              {{ title }}
            </div>
            <p v-if="description" style="font-size: 2.15rem">
              {{ description }}
            </p>
            <p v-if="price" style="font-size: 2.5rem">
              from: USD ${{ price }}
            </p>
          </div>
        </div>
        <div class="flex w-full flex-row">
          <img v-if="siteLogo" :src="siteLogo" height="50" class="mr-5 rounded" />
          <div style="font-size: 1.75rem" class="mt-2 font-bold">
            {{ siteName }}
          </div>
        </div>
      </div>
    </div>
    <div class=" relative w-1/2 items-end justify-center">
      <img v-if="image" :src="image" height="630" width="630" style="object-fit: cover" class="max-w-full rounded-xl" />
    </div>
  </div>
</template>
