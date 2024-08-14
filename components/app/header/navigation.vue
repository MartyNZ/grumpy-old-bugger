<template>
  <nav id="desktop-nav" class="hidden md:flex md:items-center">
    <ul class="flex items-center gap-4">
      <li>
        <NuxtLink
          class="after:bg-primary-600 dark:after:bg-primary-300 relative after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-[0%] after:rounded-xl after:duration-300 after:content-[''] hover:after:w-[100%]"
          to="/the-rant-files">The Rant Files</NuxtLink>
      </li>
      <li>
        <NuxtLink
          class="after:bg-primary-600 dark:after:bg-primary-300 relative after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-[0%] after:rounded-xl after:duration-300 after:content-[''] hover:after:w-[100%]"
          to="/products">Products</NuxtLink>
      </li>
      <li>
        <NuxtLink
          class="after:bg-primary-600 dark:after:bg-primary-300 relative after:absolute after:-bottom-[5px] after:left-0 after:h-[3px] after:w-[0%] after:rounded-xl after:duration-300 after:content-[''] hover:after:w-[100%]"
          to="/contact">Contact Us</NuxtLink>
      </li>
    </ul>
  </nav>
</template>
