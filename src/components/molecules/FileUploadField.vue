<script setup>
import { ref, computed } from 'vue'
import Button from '@/components/atoms/Button.vue'

const props = defineProps({
  modelValue: {
    // we will store a single File object or null
    type: Object,
    default: null,
  },
  label: {
    type: String,
    default: 'Attachment',
  },
  helperText: {
    type: String,
    default: 'Optional file to include with your time capsule.',
  },
  accept: {
    type: String,
    default: 'image/*,application/pdf', // images + pdf as example
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const fileInputRef = ref(null)

const fileName = computed(() => {
  const file = props.modelValue
  if (!file) return 'No file selected'
  return file.name
})

function openFileDialog() {
  if (props.disabled) return
  fileInputRef.value?.click()
}

function onFileChange(event) {
  const file = event.target.files && event.target.files[0] ? event.target.files[0] : null
  emit('update:modelValue', file)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <span class="text-sm font-medium text-lightest-blue">
      {{ label }}
    </span>

    <div class="flex items-center gap-3">
      <input
        ref="fileInputRef"
        type="file"
        class="hidden"
        :accept="accept"
        :disabled="disabled"
        @change="onFileChange"
      />

      <Button
        type="secondary"
        size="sm"
        :disabled="disabled"
        @click="openFileDialog"
      >
        Choose file
      </Button>

      <span class="text-xs text-lightest-blue/80 truncate max-w-[180px]">
        {{ fileName }}
      </span>
    </div>

    <p class="text-xs text-lightest-blue/60">
      {{ helperText }}
    </p>
  </div>
</template>
