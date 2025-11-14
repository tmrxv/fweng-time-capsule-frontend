<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: String,
  placeholder: String,
  type: {
    type: String,
    default: 'text', // text, email, password, etc.
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

// Base styles
const base =
  'rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-lighter-blue disabled:opacity-50 disabled:cursor-not-allowed'

// Size variants
const sizeClasses = computed(
  () =>
    ({
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-3 text-lg',
    })[props.size],
)

// Color variants
const colorClasses = computed(
  () =>
    'bg-dark-blue text-lightest-blue border-medium-dark-blue placeholder-lighter-blue focus:bg-dark focus:text-lightest-blue',
)

const classes = computed(() => `${base} ${sizeClasses.value} ${colorClasses.value}`)
</script>

<template>
  <input
    :type="type"
    :placeholder="placeholder"
    :class="classes"
    :disabled="disabled"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
