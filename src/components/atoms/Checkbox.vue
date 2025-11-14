<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  label: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

// Base classes for the checkbox input
const checkboxClasses = computed(
  () => `
  w-5 h-5 rounded border-2 border-medium-dark-blue
  bg-dark-blue checked:bg-lighter-blue checked:border-lighter-blue
  transition-all duration-200 cursor-pointer
  disabled:opacity-50 disabled:cursor-not-allowed
`,
)
</script>

<template>
  <label class="flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
      :class="checkboxClasses"
      :disabled="disabled"
    />
    <span v-if="label" class="text-lightest-blue select-none">{{ label }}</span>
  </label>
</template>
