<script setup>
import { computed } from 'vue'
import RadioButton from '@/components/atoms/RadioButton.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'PRIVATE', // 'PUBLIC' or 'PRIVATE'
  },
  label: {
    type: String,
    default: 'Visibility',
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
  <div class="flex flex-col gap-2">
    <span class="text-sm font-medium text-lightest-blue">
      {{ label }}
    </span>

    <div class="flex flex-wrap gap-4">
      <RadioButton
        v-model="innerValue"
        value="PUBLIC"
        label="Public"
        :disabled="disabled"
      />
      <RadioButton
        v-model="innerValue"
        value="PRIVATE"
        label="Private"
        :disabled="disabled"
      />
    </div>

    <p class="text-xs text-lightest-blue/60">
      <span v-if="innerValue === 'PUBLIC'">
        Public: Other users can see your time capsule.
      </span>
      <span v-else>
        Private: Only you (and the email recipient) can see this time capsule.
      </span>
    </p>
  </div>
</template>
