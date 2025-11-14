<script setup>
import { computed } from 'vue'

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
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  rows: {
    type: Number,
    default: 4,
  },
  disabled: {
    type: Boolean,
    default: false,
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

    <textarea
      :id="id"
      v-model="innerValue"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      class="rounded-lg border bg-dark-blue text-lightest-blue border-medium-dark-blue placeholder-lighter-blue focus:outline-none focus:ring-2 focus:ring-lighter-blue disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-sm resize-y"
    />
  </div>
</template>
