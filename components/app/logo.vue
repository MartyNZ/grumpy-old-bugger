<script setup>
const data = useSiteSettingsStore();
const metadata = data.metadata;
</script>
<template>
  <img :src="settings.logoUrl" />
</template>
