<script setup>
const props = defineProps({
  productSizes: {
    type: Array,
    required: true,
  },
});

const visible = ref(false);
</script>
<template>
  <div class="flex place-content-center">
    <Button label="Size Tables" icon="pi pi-table" @click="visible = true" />
    <Dialog v-model:visible="visible" modal header="Product Sizes" :style="{ width: '90vw' }">
      <div>
        <Tabs :value="productSizes[0]._key">
          <TabList>
            <Tab v-for="item in productSizes" :key="item._key" :value="item._key">
              {{ item.title }}
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel v-for="item in productSizes" :value="item._key" :key="item._key" class="overflow-auto">
              <table class="w-full">
                <thead>
                  <tr>
                    <th class="bg-surface-300 dark:text-surface-900" :class="{ 'bg-surface-0': index === 0 }"
                      v-for="(cell, index) in item.size.rows[0].cells" :key="index">
                      {{ cell }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, index) in item.size.rows" :key="index" class="border-surface-300 border-b-[1px]">
                    <template v-if="index !== 0">
                      <td v-for="(cell, index) in row.cells" :key="index" class="px-4 py-2" :class="{
                        'dark:text-surface-900 bg-surface-300': index === 0,
                      }">
                        {{ cell }}
                      </td>
                    </template>
                  </tr>
                </tbody>
              </table>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </Dialog>
  </div>
</template>
