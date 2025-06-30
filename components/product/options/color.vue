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
    <p class="pr-2">{{ option.name }}</p>
    <div class="flex flex-wrap gap-2">
      <div v-for="value in option.values" :key="value._key" @click="selectNewValueId(value.id)" :class="[
        'border-1 color-selector h-6 w-6 rounded-full lg:h-8 lg:w-8',
        value.id === selectedOptionValue
          ? 'selected-option border-surface-800 dark:border-surface-200'
          : 'border-surface-800 dark:border-surface-200',
        isValueAvailable(value)
          ? 'cursor-pointer hover:ring-2 hover:ring-surface-400'
          : 'cursor-not-allowed opacity-50 grayscale'
      ]" :style="`background-color: ${value.colors}`" :aria-label="value.title" :title="isValueAvailable(value)
        ? value.title
        : `${value.title} - Not available with current selection`">
        <!-- Add unavailable indicator -->
        <div v-if="!isValueAvailable(value)"
          class="w-full h-full flex items-center justify-center text-white text-xs font-bold">
          ✕
        </div>
      </div>
    </div>
  </div>
</template>
