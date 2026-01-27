<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTimeCapsuleStore } from '@/stores/TimeCapsules'
import Button from '@/components/atoms/Button.vue'
import type { TimeCapsulePostResponse } from '@/types/TimeCapsule'
import { useDateFormat } from '@/composables/UseDateFormat'

const { formatDate, formatDateTime } = useDateFormat()
const route = useRoute()
const router = useRouter()
const capsuleStore = useTimeCapsuleStore()

const capsule = ref<TimeCapsulePostResponse | null>(null)
const loading = ref(true)
const error = ref('')

const capsuleId = computed(() => Number(route.params.id))

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
  router.push({ name: 'edit-capsule', params: { id: capsuleId.value } })
}
</script>

<template>
  <div class="min-h-screen bg-surface text-gray-900 dark:text-gray-100 dark:bg-[#061025]">
    <main class="max-w-3xl mx-auto px-6 py-10">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-extrabold">Capsule Details</h1>
          <p class="text-sm text-lightest-blue/80">View and edit this time capsule</p>
        </div>
        <Button type="secondary" size="sm" @click="goBack">Back</Button>
      </div>

      <div v-if="loading" class="text-gray-400">Loading…</div>
      <div v-else-if="error" class="text-red-400">{{ error }}</div>
      <div v-else-if="capsule" class="space-y-4 bg-black-100 rounded-xl p-6 border border-white/10">
        <div>
          <h2 class="text-2xl font-bold mb-1">{{ capsule.title }}</h2>
          <p class="text-sm text-lightest-blue/70">Send at: {{ formatDateTime(capsule.sendAt) }}</p>
          <p class="text-sm text-lightest-blue/70">
            Created: {{ formatDateTime(capsule.createdAt) }}
          </p>
          <p class="text-sm text-lightest-blue/70">
            Updated: {{ formatDateTime(capsule.updatedAt) }}
          </p>
        </div>

        <div class="text-base leading-relaxed text-lightest-blue">{{ capsule.message }}</div>

        <div
          v-if="capsule.attachmentUrl || (capsule as any).fileUrl"
          class="text-sm text-lightest-blue/80"
        >
          <span class="font-semibold">Attachment:</span>
          <a
            :href="capsule.attachmentUrl || (capsule as any).fileUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="underline text-primary"
          >
            Open file
          </a>
        </div>

        <div class="flex gap-3 justify-end pt-4">
          <Button type="secondary" size="sm" @click="goBack">Close</Button>
          <Button type="primary" size="sm" @click="editCapsule">Edit</Button>
        </div>
      </div>
    </main>
  </div>
</template>
