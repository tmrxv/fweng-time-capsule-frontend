<script setup lang="ts">
import Modal from '@/components/atoms/Modal.vue'
import { useErrorStore } from '@/stores/error'

const errorStore = useErrorStore()
</script>

<template>
  <Modal :open="errorStore.show" @close="errorStore.clearError()">
    <h2 class="text-xl font-bold mb-4">Error</h2>
    <p
      v-if="typeof errorStore.message === 'string'"
      class="text-base text-gray-700 whitespace-pre-line"
    >
      {{ errorStore.message }}
    </p>

    <ul v-else class="list-disc pl-5 space-y-1 text-base text-gray-700">
      <li v-for="(msg, i) in errorStore.message.filter((m) => m)" :key="i">
        {{ msg[0].toUpperCase() + msg.slice(1) }}
      </li>
    </ul>
  </Modal>
</template>
