<script setup lang="ts">
import Modal from '@/components/atoms/Modal.vue'
import { useErrorStore } from '@/stores/error'

const errorStore = useErrorStore()
</script>

<template>
  <Modal :open="errorStore.show" @close="errorStore.clearError()">
    <h2 class="text-xl font-bold mb-4">Error</h2>
    <p class="text-base text-gray-700">{{ errorStore.message }}</p>
  </Modal>
</template>
