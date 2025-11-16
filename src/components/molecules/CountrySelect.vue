<script setup>
import { computed } from 'vue'
import Dropdown from '@/components/atoms/Dropdown.vue'

const COUNTRY_OPTIONS = ['AT', 'DE', 'CH', 'IT', 'FR', 'US', 'UK']

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: 'Country',
  },
  placeholder: {
    type: String,
    default: 'Select country code',
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
    <label class="text-sm font-medium text-lightest-blue">
      {{ label }}
    </label>

    <Dropdown
      v-model="innerValue"
      :options="COUNTRY_OPTIONS"
      :placeholder="placeholder"
      size="md"
      :disabled="disabled"
    />
  </div>
</template>
