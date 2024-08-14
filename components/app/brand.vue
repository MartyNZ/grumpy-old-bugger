<script setup>
const data = useSiteSettingsStore();
const settings = data.settings;
// console.log(settings);
</script>

<template>
  <div id="header-brand" class="flex items-center gap-2">
    <NuxtLink to="/">
      <div class="w-7 md:w-10">
        <img class="logo" src="/assets/imgs/logo_192.png" />
      </div>
    </NuxtLink>
    <NuxtLink to="/">
      <h1 class="text-surface-0 font-brand text-xl font-semibold uppercase sm:ml-4 sm:text-3xl">
        {{ settings.title }}
      </h1>
    </NuxtLink>
  </div>
</template>
<style>
body {
  --logo: url("/assets/imgs/logo_192.png") no-repeat;
}
/* .dark body {
  --logo: url("/assets/imgs/logo-white.png") no-repeat;
} */
.logo {
  display: block;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  background: var(--logo);
  background-size: 35px;
  height: 35px;
  padding-left: 35px;
}
@media (min-width: 768px) {
  .logo {
    background-size: 50px;
    height: 50px;
    padding-left: 50px;
  }
}
</style>
