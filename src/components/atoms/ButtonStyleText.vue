<script setup>
import { useButtonStyles } from '@/composables/useButtonStyles'

const props = defineProps({
  type: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: 'md',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const { classes } = useButtonStyles(props)
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>
