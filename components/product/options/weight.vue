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
  availableOptionValues: {
    type: Set,
    required: true,
  },
  isOptionCombinationAvailable: {
    type: Function,
    required: true,
  },
});
// console.log("SelectedOption: ", props.selectedOptionValue);
const emit = defineEmits(["update:selectedOptionValueId"]);

const selectNewValueId = (value) => {
  // Only allow selection if this combination would be available
  if (props.isOptionCombinationAvailable(value)) {
    emit("update:selectedOptionValueId", value);
  }
};

const isValueAvailable = (value) => {
  return props.isOptionCombinationAvailable(value.id);
};
</script>
<template>
  <div class="border-b-surface-800 dark:border-b-surface-300 my-2 flex flex-wrap items-center gap-2 border-b py-2">
    <p>{{ option.name }}</p>
    <div class="flex gap-2">
      <div v-for="value in option.values" :key="value.id" @click="selectNewValueId(value.id)" :class="[
        'depth-selector flex w-8 min-w-fit items-center justify-center gap-2 rounded-lg px-2 py-1 text-sm',
        value.id === selectedOptionValue
          ? 'selected-option'
          : '',
        isValueAvailable(value)
          ? 'bg-surface-300 hover:bg-surface-700 hover:text-surface-100 dark:bg-surface-700 dark:hover:bg-surface-200 dark:hover:text-surface-800 cursor-pointer'
          : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
      ]" :aria-label="value.title" :title="isValueAvailable(value)
        ? value.title
        : `${value.title} - Not available with current selection`">
        {{ value.title }}
        <span v-if="!isValueAvailable(value)" class="ml-1 text-gray-500">✕</span>
      </div>
    </div>
  </div>
</template>
