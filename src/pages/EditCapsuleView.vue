<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTimeCapsuleStore } from '@/stores/TimeCapsules'
import TimeCapsuleForm from '@/components/molecules/TimeCapsuleForm.vue'
import type { TimeCapsulePostRequest, TimeCapsulePostResponse } from '@/types/TimeCapsule'

const router = useRouter()
const route = useRoute()
const capsuleStore = useTimeCapsuleStore()
const capsuleId = Number(route.params.id)
const initialData = ref<Partial<TimeCapsulePostRequest> | null>(null)
const existingAttachmentUrl = ref<string>('')
const existingAttachmentFileName = ref<string>('')
const isLoading = ref(true)

onMounted(async () => {
  try {
    const capsule = (await capsuleStore.fetchCapsuleById(
      capsuleId,
    )) as TimeCapsulePostResponse
    initialData.value = {
      title: capsule.title,
      message: capsule.message,
      sendAt: capsule.sendAt,
    }
    const url = capsule.attachmentUrl ?? capsule.fileUrl ?? ''
    existingAttachmentUrl.value = url
    // Prefer explicit filename if provided; else derive from URL
    const explicitName = capsule.attachmentFileName || ''
    if (explicitName) {
      existingAttachmentFileName.value = explicitName
    } else if (url) {
      try {
        const parsed = new URL(url)
        const lastSeg = parsed.pathname.split('/').filter(Boolean).pop() || ''
        const decoded = decodeURIComponent(lastSeg)
        // Strip UUID prefix (format: uuid-originalname.ext)
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-(.+)$/i
        const match = decoded.match(uuidPattern)
        const stripped = match?.[1] ?? decoded
        existingAttachmentFileName.value = stripped
      } catch {
        existingAttachmentFileName.value = 'View file'
      }
    } else {
      existingAttachmentFileName.value = ''
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
        :existing-attachment-url="existingAttachmentUrl"
        :existing-attachment-file-name="existingAttachmentFileName"
        :is-loading="capsuleStore.loading"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>
