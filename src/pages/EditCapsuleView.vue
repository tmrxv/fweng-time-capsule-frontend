<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTimeCapsuleStore } from '@/stores/TimeCapsules'
import TimeCapsuleForm from '@/components/molecules/TimeCapsuleForm.vue'
import type { TimeCapsulePostRequest } from '@/types/TimeCapsule'

const router = useRouter()
const route = useRoute()
const capsuleStore = useTimeCapsuleStore()
const capsuleId = Number(route.params.id)
const initialData = ref<Partial<TimeCapsulePostRequest> | null>(null)
const isLoading = ref(true)

onMounted(async () => {
  try {
    const capsule = await capsuleStore.fetchCapsuleById(capsuleId)
    initialData.value = {
      title: capsule.title,
      message: capsule.message,
      sendAt: capsule.sendAt,
    }
  } catch (error) {
    console.error('Failed to load capsule:', error)
    router.push({ name: 'capsules' })
  } finally {
    isLoading.value = false
  }
})

async function handleSubmit(data: TimeCapsulePostRequest) {
  try {
    await capsuleStore.updateCapsule(capsuleId, data)
    router.push({ name: 'capsules' })
  } catch (error) {
    console.error('Failed to update capsule:', error)
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
      <h1 class="text-4xl font-extrabold mb-8">Edit Time Capsule</h1>
      <TimeCapsuleForm
        v-if="!isLoading && initialData"
        :initial-data="initialData"
        :is-loading="capsuleStore.loading"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>
