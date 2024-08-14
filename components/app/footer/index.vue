<script setup>
const data = useSiteSettingsStore();
const settings = data.settings;
const year = new Date().getFullYear();
</script>

<template>
  <footer
    class="bg-surface-400 text-surface-900 dark:bg-surface-950 dark:text-surface-200 fixed bottom-0 z-10 mx-auto mb-[56px] w-full text-center sm:pt-[100%] md:mb-0 lg:text-left"
  >
    <div class="mx-auto min-h-fit max-w-[1280px]">
      <div class="flex flex-wrap pt-6 text-left lg:text-left">
        <div class="w-full px-4 md:w-1/2">
          <h4 class="font-brand text-3xl">
            {{ settings.title }}
          </h4>
          <h5 class="mb-2 mt-0 text-lg">
            {{ settings.description }}
          </h5>
          <div class="mb-6 mt-6 flex gap-6 lg:mb-0">
            <client-only>
              <div
                v-for="connection in settings.primaryLocation.socialConnections"
                :key="connection._key"
              >
                <NuxtLink
                  :to="connection.userUrl"
                  target="_blank"
                  class="text-5xl"
                >
                  <i :class="`fab fa-${connection._type}`" />
                </NuxtLink>
              </div>
            </client-only>
          </div>
        </div>
        <app-footer-navigation />
      </div>
      <hr class="border-surface-700 mt-6" />
    </div>
    <AppFooterCopyrightNotice :year="year" :siteOwner="settings.siteOwner" />
  </footer>
</template>
