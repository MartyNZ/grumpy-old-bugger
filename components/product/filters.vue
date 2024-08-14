<script setup>
import MultiSelect from "primevue/multiselect";
import Button from "primevue/button";

const dialogRef = inject("dialogRef");
const colours = dialogRef.value.options.data.colours;
// console.log("Colours array: ", JSON.stringify(colours));

const themes = dialogRef.value.options.data.themes;
// console.log("Themes array: ", JSON.stringify(themes));


const selectedColours = ref([]);
const selectedThemes = ref([]);


function applyFilters() {
  // console.log("Colours: ", JSON.stringify(selectedColours.value))
  const colourSlugs = selectedColours.value.map((colour) => {
    return colour.slug;
  });

  // console.log("Theme: ", JSON.stringify(selectedThemes.value))
  const themeSlugs = selectedThemes.value.map((theme) => {
    return theme.slug;
  });

  // console.log("Filters to apply; ", themeSlugs, colourSlugs);
  const filters = {
    themes: themeSlugs,
    colours: colourSlugs,
  };
  return filters;
}

const closeDialog = () => {
  dialogRef.value.close(applyFilters());
};
</script>
<template>
  <section id="product-filters" class="mb-4 flex flex-col gap-4">
    <div id="colour-filter" class="flex w-full flex-wrap items-center justify-between gap-2">
      <h4 class="dark:text-surface-300 text-nowrap">Filter by Colour</h4>
      <MultiSelect id="colour-selector" v-model="selectedColours" :options="colours" aria-labelledby="colour-filter"
        placeholder="Filter products by colour" class="w-full md:w-[20em]" display="chip">
        <!-- @change="onColourChange" -->
        <template #chip="colour">
          <div class="flex items-center gap-1">
            <div class="border-surface-700 aspect-square w-4 rounded-full border-[1px]"
              :style="`background-color:${colour.value.colour}`"></div>
            <div>
              <span>{{ colour.value.label }}</span>
            </div>
          </div>
        </template>

        <template #option="colour">
          <div class="ml-4 flex items-center gap-2">
            <div class="border-surface-700 aspect-square w-4 rounded-full border-[1px]"
              :style="`background-color:${colour.option.colour}`"></div>
            <div>
              <span>{{ colour.option.label }}</span>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="px-3 py-2">
            <b>{{ selectedColours ? selectedColours.length : 0 }}</b> item{{
              (selectedColours ? selectedColours.length : 0) > 1 ? "s" : ""
            }}
            selected.
          </div>
        </template>
      </MultiSelect>
    </div>
    <div class="dark:text-surface-300">and / or</div>
    <div id="theme-filter" class="flex w-full flex-wrap items-center justify-between gap-2">
      <h4 class="dark:text-surface-300 text-nowrap">Filter by Theme</h4>
      <MultiSelect id="theme-selector" v-model="selectedThemes" :options="themes" aria-labelledby="theme-filter"
        placeholder="Filter products by theme" class="w-full md:w-[20em]" display="chip">
        <!-- @change="onThemeChange" -->
        <template #chip="theme">
          <span>{{ theme.value.title }}</span>
        </template>

        <template #option="theme">
          <div class="ml-4 flex items-center gap-2">
            <SanityImage :assetId="theme.option.image.assetId" auto="format" :alt="theme.option.title"
              class="aspect-square w-full max-w-[30px] rounded-full" />
            <div>
              <span>{{ theme.option.title }}</span>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="px-3 py-2">
            <b>{{ selectedThemes ? selectedThemes.length : 0 }}</b> item{{
              (selectedThemes ? selectedThemes.length : 0) > 1 ? "s" : ""
            }}
            selected.
          </div>
        </template>
      </MultiSelect>
    </div>
    <div class="dialogFooter w-full">
      <div class="flex justify-end px-4 pt-2">
        <Button @click="closeDialog" label="Apply Filters" />
      </div>
    </div>
  </section>
</template>
