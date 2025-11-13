<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  options: {
    type: Array,
    required: true,
  },
  placeholder: {
    type: String,
    default: 'Select an option',
  },
  size: {
    type: String,
    default: 'md', // sm | md | lg
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

// Size classes
const sizeClasses = computed(
  () =>
    ({
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-3 text-lg',
    })[props.size],
)
</script>

<template>
  <select
    :class="`${sizeClasses} rounded-lg bg-dark-blue text-lightest-blue border border-medium-dark-blue focus:outline-none focus:ring-2 focus:ring-lighter-blue disabled:opacity-50 disabled:cursor-not-allowed`"
    :disabled="disabled"
    :value="modelValue"
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <option value="" disabled selected hidden>{{ placeholder }}</option>
    <option
      v-for="option in options"
      :key="option"
      :value="option"
      class="bg-dark-blue text-lightest-blue"
    >
      {{ option }}
    </option>
  </select>
</template>
