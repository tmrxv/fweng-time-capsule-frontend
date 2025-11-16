<script setup>
import { computed } from 'vue'
import InputField from '@/components/atoms/InputField.vue'

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
  placeholder: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text', // text | email | password...
  },
  size: {
    type: String,
    default: 'md', // sm | md | lg
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const innerValue = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <!-- Label -->
    <label
      v-if="label"
      :for="id"
      class="text-sm font-medium text-lightest-blue"
    >
      {{ label }}
    </label>

    <!-- Input Atom -->
    <InputField
      v-model="innerValue"
      :placeholder="placeholder"
      :type="type"
      :size="size"
      :disabled="disabled"
      v-bind="{ id }"
    />
  </div>
</template>


