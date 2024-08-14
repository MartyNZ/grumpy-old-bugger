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
// console.log("Selected Value ID: ", props.selectedOptionValue.id);
const emit = defineEmits(["update:selectedOptionValueId"]);

const selectNewValueId = (value) => {
  const newValueId = value;
  // console.log("update:selectedOptionValueId", newValueId);
  emit("update:selectedOptionValueId", newValueId);
};
</script>
<template>
  <div
    class="border-b-surface-800 dark:border-b-surface-300 my-2 flex items-center gap-2 border-b py-2"
  >
    <p>{{ option.name }}</p>
    <div class="flex flex-wrap gap-2">
      <div
        v-for="value in option.values"
        :key="value.id"
        @click="selectNewValueId(value.id)"
        :class="value.id === selectedOptionValue ? 'selected-option' : ''"
        class="size-selector w-content bg-surface-300 hover:bg-surface-700 hover:text-surface-100 dark:bg-surface-700 dark:hover:bg-surface-200 dark:hover:text-surface-800 flex cursor-pointer items-center justify-center gap-2 rounded-lg px-2 py-1 text-sm"
        :aria-label="value.title"
      >
        {{ value.title }}
      </div>
    </div>
  </div>
</template>
