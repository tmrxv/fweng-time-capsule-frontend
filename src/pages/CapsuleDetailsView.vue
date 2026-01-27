<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTimeCapsuleStore } from '@/stores/TimeCapsules'
import Button from '@/components/atoms/Button.vue'
import type { TimeCapsulePostResponse } from '@/types/TimeCapsule'
import { useDateFormat } from '@/composables/UseDateFormat'

const { formatDateTime } = useDateFormat()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const capsuleStore = useTimeCapsuleStore()

const capsule = ref<TimeCapsulePostResponse | null>(null)
const loading = ref(true)
const error = ref('')

const capsuleId = computed(() => Number(route.params.id))

const canEdit = computed(() => {
  if (!capsule.value) return false
  const isOwner = Number(authStore.id) === capsule.value.userId
  const isAdmin = authStore.role === 'ADMIN'
  return isOwner || isAdmin
})

onMounted(async () => {
  try {
    const data = await capsuleStore.fetchCapsuleById(capsuleId.value)
    capsule.value = data
  } catch (e: unknown) {
    error.value =
      (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      'Failed to load capsule details'
  } finally {
    loading.value = false
  }
})

function goBack() {
  router.back()
}

function editCapsule() {
  if (canEdit.value) {
    router.push({ name: 'edit-capsule', params: { id: capsuleId.value } })
  }
}
</script>

<template>
  <div class="min-h-screen bg-surface text-gray-900 dark:text-gray-100 dark:bg-[#061025] py-12 px-6">
    <main class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-4xl sm:text-5xl font-extrabold mb-2">Capsule Details</h1>
          <p class="text-gray-600 dark:text-gray-400">View your time capsule</p>
        </div>
        <Button type="secondary" size="sm" @click="goBack">Back</Button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="text-6xl mb-4 animate-spin">⌛</div>
        <p class="text-gray-400">Loading capsule details...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 flex items-start gap-4"
      >
        <span class="text-3xl">!</span>
        <div>
          <h3 class="font-semibold text-red-300 mb-1">Error Loading Capsule</h3>
          <p class="text-red-200">{{ error }}</p>
        </div>
      </div>

      <!-- Content -->
      <div v-else-if="capsule" class="space-y-6">
        <!-- Main Card -->
        <div class="bg-black-100 border border-white/10 rounded-2xl p-8 shadow-xl">
          <!-- Title -->
          <div class="mb-8">
            <h2 class="text-3xl sm:text-4xl font-extrabold mb-3">{{ capsule.title }}</h2>
            <div class="flex flex-wrap gap-4 text-sm text-lightest-blue/70">
              <div class="flex items-center gap-2">
                <span>Sends:</span>
                <span class="font-mono font-semibold">{{ formatDateTime(capsule.sendAt) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span>Created:</span>
                <span class="font-mono font-semibold">{{ formatDateTime(capsule.createdAt) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span>Updated:</span>
                <span class="font-mono font-semibold">{{ formatDateTime(capsule.updatedAt) }}</span>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="border-t border-white/10 my-8"></div>

          <!-- Message -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold mb-4 text-lightest-blue">Message</h3>
            <p class="text-base leading-relaxed text-lightest-blue/90 whitespace-pre-wrap bg-white/5 rounded-lg p-6 border border-white/5">
              {{ capsule.message }}
            </p>
          </div>

          <!-- Attachment -->
          <div
            v-if="capsule.attachmentUrl || (capsule as any).fileUrl"
            class="mb-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-6"
          >
            <div class="flex items-center gap-3 mb-3">
              <h3 class="text-lg font-semibold text-blue-300">Attachment</h3>
            </div>
            <a
              :href="capsule.attachmentUrl || (capsule as any).fileUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <span>Open File</span>
            </a>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 justify-end pt-4 border-t border-white/10">
            <Button type="secondary" size="md" @click="goBack">Close</Button>
            <Button type="primary" size="md" :disabled="!canEdit" @click="editCapsule">
              {{ canEdit ? 'Edit' : 'Cannot Edit' }}
            </Button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
