<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useTimeCapsuleStore } from '@/stores/TimeCapsules'
import TimeCapsuleCard from '@/components/molecules/TimeCapsuleCard.vue'
import Button from '@/components/atoms/Button.vue'
import type { TimeCapsulePostResponse } from '@/types/TimeCapsule'
import { useAuthStore } from '@/stores/auth'

const capsuleStore = useTimeCapsuleStore()
const auth = useAuthStore()

const publicCapsules = ref<TimeCapsulePostResponse[]>([])
const loading = ref(true)
const error = ref('')

const isLoggedIn = computed(() => auth.isAuthenticated)

onMounted(async () => {
  try {
    console.log('Fetching public capsules...')
    const data = await capsuleStore.fetchPublicCapsules()
    console.log('Received data:', data)
    publicCapsules.value = data || []
  } catch (e: unknown) {
    console.error('Error fetching public capsules:', e)
    const err = e as { response?: { data?: { message?: string }; status?: number }; message?: string }
    error.value = err?.response?.data?.message || err?.message || 'Failed to load public capsules'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-surface text-gray-900 dark:text-gray-100 dark:bg-[#061025]">
    <main class="max-w-5xl mx-auto px-6 py-10">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-extrabold">Explore Capsules</h1>
          <p class="text-sm text-lightest-blue/80">Public capsules shared by the community</p>
        </div>
        <div class="flex gap-3">
          <Button v-if="isLoggedIn" type="primary" size="sm" to="/capsules/create">Create Capsule</Button>
          <Button v-else type="secondary" size="sm" to="/signin">Sign in to create</Button>
        </div>
      </div>

      <div v-if="loading" class="text-gray-400">Loading…</div>
      <div v-else-if="error" class="text-red-400">{{ error }}</div>
      <div v-else>
        <div v-if="publicCapsules.length === 0" class="bg-black-100 border border-white/10 rounded-xl p-6 text-center">
          <p class="text-lightest-blue mb-3">No public capsules yet.</p>
          <Button v-if="isLoggedIn" type="primary" size="sm" to="/capsules/create">Be the first to share</Button>
          <Button v-else type="secondary" size="sm" to="/signup">Sign up to share one</Button>
        </div>
        <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <TimeCapsuleCard
            v-for="capsule in publicCapsules"
            :key="capsule.id"
            :id="capsule.id"
            :title="capsule.title"
            :previewText="capsule.message"
            :sendAt="capsule.sendAt"
            :visibility="'PUBLIC'"
            :createdAt="capsule.createdAt"
            :hasAttachment="Boolean(capsule.attachmentUrl)"
            :isOwner="false"
            @select="$router.push({ name: 'capsule-details', params: { id: capsule.id } })"
          />
        </div>
      </div>
    </main>
  </div>
</template>
