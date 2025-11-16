<script setup>
import { computed } from 'vue'
import Dropdown from '@/components/atoms/Dropdown.vue'

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
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
  error: {
    type: String,
    default: '',
  },
  helperText: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const innerValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <label
      v-if="label"
      :for="id"
      class="text-sm font-medium text-lightest-blue"
    >
      {{ label }}
    </label>

    <Dropdown
      v-model="innerValue"
      :options="options"
      :placeholder="placeholder"
      :size="size"
      :disabled="disabled"
    />

    <p v-if="error" class="text-xs text-red-400">
      {{ error }}
    </p>
    <p v-else-if="helperText" class="text-xs text-lightest-blue/60">
      {{ helperText }}
    </p>
  </div>
</template>
