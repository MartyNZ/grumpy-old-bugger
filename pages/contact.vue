<script setup>
const data = useSiteSettingsStore();
const settings = data.settings;

useSeoMeta({
  title: () => settings.title,
  ogTitle: () => settings.title,
  description: () => settings.description,
  ogDescription: () => settings.description,
  ogImage: () => settings.image,
  twitterTitle: () => settings.title,
  twitterDescription: () => settings.description,
  twitterImage: () => settings.image,
  twitterCard: "summary_large_image",
});

defineOgImageComponent(
  'default',
  {
    title: settings.title,
    description: settings.description,
    image: settings.image,
    siteName: settings.title,
    siteLogo: settings.logoUrl,
  });

definePageMeta({
  layout: "false",
});
</script>
<template>
  <NuxtLayout name="internal">
    <template #main>
      <section class="mb-32">
        <div class="flex justify-center">
          <div class="text-center md:max-w-xl lg:max-w-3xl">
            <h2 class="mb-12 px-6 text-3xl font-bold">Contact us</h2>
          </div>
        </div>

        <div class="flex flex-wrap">
          <div class="mb-12 w-full shrink-0 grow-0 basis-auto md:px-3 lg:mb-0 lg:w-5/12 lg:px-6">
            <client-only>
              <forms-contact />
            </client-only>
          </div>
          <div id="contact-social"
            class="mb-12 ml-12 w-full shrink-0 grow-0 basis-auto md:px-3 lg:mb-0 lg:w-5/12 lg:px-6">
            <div class="mb-6 mt-6 lg:mb-0">
              <!-- {{ settings.primaryLocation.socialConnections }} -->
              <div v-for="connection in settings.primaryLocation.socialConnections" :key="connection._key">
                <NuxtLink :to="connection.userUrl" target="_blank" class="mb-3 flex items-center gap-5 text-2xl">
                  <i :class="`fab fa-${connection._type}`" />
                  <span>{{ connection.title }}</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>
    <template #sidebar>
      <div class="@md:grid-cols-2 sticky top-[95px] mx-3 grid grid-cols-1">
        <div class="@md:col-span-2"><product-featured /></div>
      </div>
    </template>
  </NuxtLayout>
</template>
