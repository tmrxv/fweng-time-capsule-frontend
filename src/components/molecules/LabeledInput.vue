<script setup>
import { computed } from 'vue'
import InputField from '@/components/atoms/InputField.vue'

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

const innerValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <label :for="id" class="text-sm font-medium text-lightest-blue">
      {{ label }}
    </label>

    <InputField
      :id="id"
      v-model="innerValue"
      :type="type"
      :placeholder="placeholder"
    />
  </div>
</template>

