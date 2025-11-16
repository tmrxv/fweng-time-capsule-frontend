<script setup>
import Button from '@/components/atoms/Button.vue'

const props = defineProps({
  primaryLabel: {
    type: String,
    default: 'Save',
  },
  secondaryLabel: {
    type: String,
    default: 'Cancel',
  },
  primaryDisabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['primary', 'secondary'])
</script>

<template>
  <div class="flex justify-end gap-3 mt-4">
    <Button
      type="outline"
      size="md"
      @click="emit('secondary')"
    >
      {{ secondaryLabel }}
    </Button>

    <Button
      type="primary"
      size="md"
      :disabled="primaryDisabled"
      @click="emit('primary')"
    >
      {{ primaryLabel }}
    </Button>
  </div>
</template>
