<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTimeCapsuleStore } from '@/stores/TimeCapsules'
import TimeCapsuleForm from '@/components/molecules/TimeCapsuleForm.vue'
import type { TimeCapsulePostRequest, TimeCapsulePostResponse } from '@/types/TimeCapsule'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const capsuleStore = useTimeCapsuleStore()
const capsuleId = Number(route.params.id)
const initialData = ref<Partial<TimeCapsulePostRequest> | null>(null)
const existingAttachmentUrl = ref<string>('')
const existingAttachmentFileName = ref<string>('')
const isLoading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const capsule = (await capsuleStore.fetchCapsuleById(
      capsuleId,
    )) as TimeCapsulePostResponse

    // Check authorization: user must be owner or admin
    const isOwner = Number(authStore.id) === capsule.userId
    const isAdmin = authStore.role === 'ADMIN'

    if (!isOwner && !isAdmin) {
      error.value = 'You do not have permission to edit this capsule'
      router.push({ name: 'capsules' })
      return
    }

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
  } catch (err) {
    console.error('Failed to load capsule:', err)
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
      <!-- Header Section -->
      <div class="mb-8">
        <h1 class="text-4xl sm:text-5xl font-extrabold mb-2">Edit Time Capsule</h1>
        <p class="text-gray-600 dark:text-gray-400">Update your time capsule details</p>
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 flex items-start gap-3"
      >
        <span class="text-xl">⚠️</span>
        <span>{{ error }}</span>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
        <div class="animate-spin mb-4">⏳</div>
        <p class="text-gray-400">Loading capsule...</p>
      </div>

      <!-- Form Section -->
      <div
        v-if="!isLoading && initialData && !error"
        class="bg-black-100 border border-white/10 rounded-2xl p-8 shadow-xl"
      >
        <TimeCapsuleForm
          :initial-data="initialData"
          :existing-attachment-url="existingAttachmentUrl"
          :existing-attachment-file-name="existingAttachmentFileName"
          :is-loading="capsuleStore.loading"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </div>
    </div>
  </div>
</template>
