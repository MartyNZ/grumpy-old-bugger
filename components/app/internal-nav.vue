<template>
  <div
    id="internal-nav"
    class="@container border-b-surface-500 mx-auto flex max-w-[1280px] flex-wrap justify-between gap-3 border-b border-b-[1px] px-3 py-2"
  >
    <client-only>
      <app-breadcrumb />
    </client-only>
    <app-social-share />
  </div>
</template>
