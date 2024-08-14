<script setup>
const props = defineProps({
  option: {
    type: Object,
    required: true,
  },
  selectedOptionValue: {
    type: String,
    required: true,
  },
});
// console.log("SelectedOption: ", props.selectedOptionValue);
const emit = defineEmits(["update:selectedOptionValueId"]);

const selectNewValueId = (value) => {
  const newValueId = value;
  // console.log("update:selectedOptionValueId", newValueId);
  emit("update:selectedOptionValueId", newValueId);
};
</script>
<template>
  <div
    class="border-b-surface-800 dark:border-b-surface-300 my-2 flex flex-wrap items-center gap-2 border-b py-2"
  >
    <p class="pr-2">{{ option.name }}</p>
    <div class="flex flex-wrap gap-2">
      <div
        v-for="value in option.values"
        :v-tooltip="value.title"
        :key="value._key"
        @click="selectNewValueId(value.id)"
        :class="value.id === selectedOptionValue ? 'selected-option' : ''"
        class="border-1 color-selector border-surface-800 dark:border-surface-200 h-6 w-6 cursor-pointer rounded-full lg:h-8 lg:w-8"
        :style="`background-color: ${value.colors}`"
        :aria-label="value.title"
      ></div>
    </div>
  </div>
</template>
