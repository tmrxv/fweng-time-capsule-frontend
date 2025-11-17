<script setup lang="ts">
import AppButton from '@/components/atoms/Button.vue'
const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function closeModal() {
  emit('close')
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    v-if="open"
    @click.self="closeModal"
  >
    <div
      class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
      @keydown.esc="closeModal"
      tabindex="0"
    >
      <slot></slot>
      <AppButton type="primary" size="md" class="mt-4 w-full" @click="closeModal">
        Close
      </AppButton>
    </div>
  </div>
</template>
