<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTimeCapsuleStore } from '@/stores/TimeCapsules'
import TimeCapsuleForm from '@/components/molecules/TimeCapsuleForm.vue'
import type { TimeCapsulePostRequest } from '@/types/TimeCapsule'

const router = useRouter()
const timeCapsuleStore = useTimeCapsuleStore()

async function handleSubmit(data: TimeCapsulePostRequest) {
  try {
    await timeCapsuleStore.createCapsule(data)
    router.push({ name: 'capsules' })
  } catch (error) {
    console.error('Error creating time capsule:', error)
  }
}

function handleCancel() {
  router.back()
}
</script>

<template>
  <div
    class="min-h-screen bg-surface text-gray-900 dark:text-gray-100 dark:bg-[#061025] py-12 px-6"
  >
    <div class="max-w-2xl mx-auto">
      <h1 class="text-4xl font-extrabold mb-8">Create Time Capsule</h1>
      <TimeCapsuleForm
        :is-loading="timeCapsuleStore.loading"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>
