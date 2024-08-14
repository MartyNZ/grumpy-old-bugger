<script setup>
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";

const dialogRef = inject("dialogRef");
const productSizes = dialogRef.value.data.productSizes;
</script>
<template>
  <div>
    <TabView>
      <TabPanel
        v-for="item in productSizes"
        :key="item._key"
        :header="item.title"
      >
        <table class="w-full">
          <thead>
            <tr>
              <th
                class="bg-surface-300 dark:text-surface-900"
                :class="{ 'bg-surface-0': index === 0 }"
                v-for="(cell, index) in item.size.rows[0].cells"
                :key="index"
              >
                {{ cell }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in item.size.rows"
              :key="index"
              class="border-surface-300 border-b-[1px]"
            >
              <template v-if="index !== 0">
                <td
                  v-for="(cell, index) in row.cells"
                  :key="index"
                  class="px-4 py-2"
                  :class="{
                    'dark:text-surface-900 bg-surface-300': index === 0,
                  }"
                >
                  {{ cell }}
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </TabPanel>
    </TabView>
  </div>
</template>
