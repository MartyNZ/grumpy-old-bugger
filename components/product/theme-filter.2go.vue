<script setup>
import MultiSelect from "primevue/multiselect";
import { qryProductThemes } from "~/queries/printify";

// const { data: themes } = await useSanityQuery(qryProductThemes);

const dialogRef = inject("dialogRef");
console.log("dialogRef: ", JSON.stringify(dialogRef.value, null, 2));

const themes = ref([]);
onMounted(() => {
  dialogRef.value.data.themes = themes.value;
});

console.log("Themes: ", themes); // themes);

const selectedThemes = ref();

console.log("selectedThemes Array: ", JSON.stringify(selectedThemes.value));
</script>
<template>
  <section
    id="product-theme-list"
    class="mb-4 flex flex-wrap items-center justify-between gap-2"
  >
    <h4 class="text-nowrap">Filter by Theme</h4>
    <div class="theme-filter">
      <!-- <pre>{{ themes }}</pre> -->
      <MultiSelect
        v-model="selectedThemes"
        :options="themes"
        aria-labelledby="theme-filter"
        :maxSelectedLabels="2"
        placeholder="Filter products by theme"
        class="w-full md:w-[20em]"
        display="chip"
      >
        <template #option="theme">
          <div class="ml-4 flex content-center gap-2">
            <img
              :src="theme.option.imageUrl"
              :alt="theme.option.label"
              class="aspect-square w-full max-w-[35px] rounded-full"
            />
            <div>{{ theme.option.label }}</div>
          </div>
        </template>
      </MultiSelect>
    </div>
  </section>
</template>
