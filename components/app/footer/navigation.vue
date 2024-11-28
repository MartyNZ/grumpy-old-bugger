<script setup>
const data = useSiteNavigationStore();
const footerNavigation = data.footerNavigation;
// console.log("Footer Nav: ", JSON.stringify(footerNavigation, null, 2));
</script>
<template>
  <div class="w-full px-4 text-right md:w-1/2">
    <span class="mb-2 block text-sm font-semibold uppercase">
      Useful Links
    </span>
    <ul class="list-unstyled">
      <li v-for="link in footerNavigation.navigationLinks" :key="link._key">
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

  </div>
</template>
