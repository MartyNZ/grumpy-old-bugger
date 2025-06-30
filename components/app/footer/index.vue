<script setup>
const data = useSiteSettingsStore();
const settings = data.settings;
const year = new Date().getFullYear();
</script>

<template>
  <!-- Footer container -->
  <footer
    class="fixed bottom-0 z-10 mx-auto mb-[56px] w-full bg-surface-400 text-center text-surface-900 dark:bg-surface-950 dark:text-surface-200 sm:pt-[100%] md:mb-0 lg:text-left">
    <div class="mx-auto min-h-fit max-w-[1280px]">
      <div
        class="border-grey-800 items-center border-b-2 p-6 dark:border-surface-200 flex flex-col md:justify-between md:flex-row gap-2 justify-center">
        <div class="mr-12">
          <span>Get connected with us on social networks:</span>
        </div>
        <!-- Social network icons container -->
        <div class="flex justify-center">
          <template v-for="connection in settings.primaryLocation.socialConnections">
            <a :href="connection.userUrl"
              class="mr-6 text-surface-700 hover:text-surface-950 dark:text-surface-300 hover:dark:text-surface-100"
              target="_blank">
              <icons-brands-facebook v-if="connection._type === 'facebook'" class="h-8 w-8" />
              <icons-brands-instagram v-if="connection._type === 'instagram'" class="h-8 w-8" />
              <icons-brands-threads v-if="connection._type === 'threads'" class="h-8 w-8" />
            </a>
          </template>
        </div>
      </div>
      <div class="mx-6 pt-2 text-center md:text-left">
        <div class="grid-1 grid justify-between lg:grid-cols-2">
          <div class="mb-4 justify-start">
            <h6 class="mb-1 flex items-center justify-center font-semibold uppercase md:justify-start">
              {{ settings.title }}
            </h6>
            <p>{{ settings.description }}</p>
          </div>
          <div class="flex justify-end">
            <app-footer-navigation />
            <!-- <app-footer-contact :settings="settings" /> -->
          </div>
        </div>
      </div>
    </div>
    <app-copyright-notice :settings="settings" :year="year" />
  </footer>
</template>
