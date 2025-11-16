<script setup>
import Checkbox from '@/components/atoms/Checkbox.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: 'Accept terms & conditions',
  },
  helperText: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

function updateValue(val) {
  emit('update:modelValue', val)
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <Checkbox
      :label="label"
      :disabled="disabled"
      :model-value="modelValue"
      @update:model-value="updateValue"
    />
    <p v-if="helperText" class="text-xs text-lightest-blue/60">
      {{ helperText }}
    </p>
  </div>
</template>
