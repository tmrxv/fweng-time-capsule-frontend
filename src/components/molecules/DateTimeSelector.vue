<script setup>
import { computed } from 'vue'
import InputField from '@/components/atoms/InputField.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      date: '',
      time: '',
    }),
  },
  label: {
    type: String,
    default: 'Delivery time',
  },
  helperText: {
    type: String,
    default: 'Choose when your time capsule should be delivered.',
  },
})

const emit = defineEmits(['update:modelValue'])

const dateValue = computed({
  get: () => props.modelValue?.date ?? '',
  set: (val) =>
    emit('update:modelValue', {
      ...props.modelValue,
      date: val,
    }),
})

const timeValue = computed({
  get: () => props.modelValue?.time ?? '',
  set: (val) =>
    emit('update:modelValue', {
      ...props.modelValue,
      time: val,
    }),
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <span class="text-sm font-medium text-lightest-blue">
      {{ label }}
    </span>

    <div class="flex flex-col gap-2 md:flex-row">
      <div class="flex-1">
        <InputField
          type="date"
          v-model="dateValue"
          size="md"
        />
      </div>

      <div class="flex-1">
        <InputField
          type="time"
          v-model="timeValue"
          size="md"
        />
      </div>
    </div>

    <p class="text-xs text-lightest-blue/60">
      {{ helperText }}
    </p>
  </div>
</template>
