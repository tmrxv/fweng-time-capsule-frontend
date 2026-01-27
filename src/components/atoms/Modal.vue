<script setup lang="ts">
import AppButton from '@/components/atoms/Button.vue'
const props = defineProps<{
  open: boolean
  title?: string
  showCloseButton?: boolean
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
      class="bg-[#071428] dark:bg-[#061025] rounded-xl shadow-xl p-6 w-full max-w-md border border-gray-800"
      @keydown.esc="closeModal"
      tabindex="0"
      role="alertdialog"
      aria-modal="true"
      :aria-labelledby="title ? 'modal-title' : undefined"
    >
      <div v-if="title" class="mb-4">
        <h2 id="modal-title" class="text-xl font-semibold text-lightest-blue">
          {{ title }}
        </h2>
      </div>

      <div class="text-lightest-blue/80 mb-6">
        <slot></slot>
      </div>

      <div class="flex gap-3 justify-end">
        <AppButton v-if="showCloseButton" type="secondary" size="md" @click="closeModal">
          Close
        </AppButton>
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>
