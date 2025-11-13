<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'primary', // 'primary' | 'secondary' | 'outline'
  },
  size: {
    type: String,
    default: 'md', // 'sm' | 'md' | 'lg'
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const base =
  'font-semibold rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg'

const sizeClasses = computed(
  () =>
    ({
      sm: 'px-3 py-1 text-sm',
      md: 'px-5 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    })[props.size],
)

const variantClasses = computed(
  () =>
    ({
      primary: 'bg-lighter-blue text-dark hover:bg-lightest-blue hover:text-dark-blue',
      secondary: 'bg-medium-dark-blue text-lightest-blue hover:bg-lighter-blue hover:text-dark',
      outline: 'border border-lighter-blue text-lighter-blue hover:bg-lighter-blue hover:text-dark',
    })[props.type],
)

const classes = computed(() => `${base} ${sizeClasses.value} ${variantClasses.value}`)
</script>

<template>
  <button :class="classes" :disabled="disabled">
    <slot />
  </button>
</template>
