<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="flex items-center justify-between text-xs text-lightest-blue/80">
    <div class="flex items-center gap-2">
      <span v-if="icon">{{ icon }}</span>
      <span>{{ label }}</span>
    </div>
    <span class="font-mono text-lightest-blue/90">
      {{ value }}
    </span>
  </div>
</template>
