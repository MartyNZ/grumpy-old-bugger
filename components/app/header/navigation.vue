<script setup>
const data = useSiteNavigationStore();
const navigation = data.mainNavigation;
// console.log("Main Nav: ", JSON.stringify(navigation, null, 2));
</script>
<template>
  <nav id="desktop-nav" class="hidden md:flex md:items-center">
    <ul class="flex items-center gap-4">
      <li v-for="link in navigation.navigationLinks" :key="link._key">
        <template v-if="link.linkType === 'int'">
          <app-link-internal :slug="link.internalLink.slug" :title="link.internalLink.title" />
        </template>
        <template v-if="link.linkType === 'ext'">
          <app-link-external :url="link.externalLink.url" :name="link.name" />
        </template>
        <template v-if="link.linkType === 'anc'">
          <app-link-anchor :slug="link.anchorLink.page.slug" :name="link.name" :anchor="link.anchorLink.anchor" />
        </template>
      </li>
    </ul>
  </nav>
</template>
