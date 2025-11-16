<script setup>
const props = defineProps({
  message: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <p
    class="flex items-center gap-2 text-xs text-red-300 bg-red-500/10 border border-red-500/40 rounded-md px-2 py-1"
  >
    <span>⚠</span>
    <span>{{ message }}</span>
  </p>
</template>
