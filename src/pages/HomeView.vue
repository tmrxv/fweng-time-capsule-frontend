<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useTimeCapsuleStore } from '@/stores/TimeCapsules'
import TimeCapsuleCard from '@/components/molecules/TimeCapsuleCard.vue'
import Button from '@/components/atoms/Button.vue'
import api from '@/plugins/axios'


const router = useRouter()
const authStore = useAuthStore()
const capsuleStore = useTimeCapsuleStore()

const recentCapsules = ref<Array<{ id: number; title: string; message: string; sendAt: string; createdAt?: string; fileUrl?: string; attachmentUrl?: string }>>([])

const isAuthenticated = computed(() => authStore.isAuthenticated)

onMounted(async () => {
  // Fetch latest capsules for homepage
  try {
    const res = await api.get('/api/home')
    recentCapsules.value = Array.isArray(res.data) ? res.data : []
  } catch {
    recentCapsules.value = []
  }

  if (isAuthenticated.value) {
    await capsuleStore.fetchAllCapsules()
  }
})

function handleCreateCapsule() {
  router.push({ name: 'create-capsule' })
}

</script>

<template>
  <div class="min-h-screen bg-surface text-gray-900 dark:text-gray-100 dark:bg-[#061025]">
    <!-- Authenticated User View -->
    <main v-if="isAuthenticated" class="max-w-4xl mx-auto px-6 py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-extrabold mb-4">Welcome back, {{ authStore.username }}</h1>
        <p class="text-gray-600 dark:text-gray-400 mb-8">
          Manage your time capsules and view your statistics.
        </p>
        <Button
          @click="handleCreateCapsule"
          class="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
        >
          + Create Time Capsule
        </Button>
      </div>

      <div class="mt-12">
        <h2 class="text-2xl font-bold mb-6">Your Capsules</h2>
        <router-link to="/capsules" class="text-primary hover:underline font-medium">
          View all your time capsules →
        </router-link>
      </div>

      <div class="mt-12">
        <div
          class="bg-white dark:bg-[#071428] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-lg font-semibold">Recent Time Capsules</h3>
          </div>
          <div class="grid gap-4">
            <TimeCapsuleCard
              v-for="c in recentCapsules"
              :key="c.id"
              :title="c.title"
              :previewText="c.message"
              :sendAt="c.sendAt"
              :createdAt="c.createdAt"
              :hasAttachment="Boolean(c.attachmentUrl || c.fileUrl)"
            />
            <router-link to="/explore" class="text-sm text-primary hover:underline">
              View all
            </router-link>
          </div>
        </div>
      </div>
    </main>
    <!-- Guest View -->
    <main v-else class="max-w-6xl mx-auto px-6 py-12">
      <section class="grid gap-8 lg:grid-cols-2 items-center">
        <div>
          <h1 class="text-4xl sm:text-5xl font-extrabold leading-tight">
            Capture today. Open tomorrow.
          </h1>
          <p class="mt-4 text-lg text-gray-700 dark:text-gray-300">
            Create private time capsules for future you or your friends — letters, photos, and
            promises locked until the right moment.
          </p>

          <div class="mt-6 flex items-center gap-4">
            <router-link
              to="/capsules/create"
              class="inline-block bg-primary text-white px-5 py-3 rounded-lg shadow hover:opacity-95"
              >Create Capsule</router-link
            >
            <router-link
              to="/explore"
              class="inline-block border border-muted text-muted px-4 py-2 rounded-lg"
              >Explore Capsules</router-link
            >
          </div>

          <div v-if="!isAuthenticated" class="mt-8 flex items-center gap-3">
            <router-link to="/sign-in" class="inline-block text-primary hover:underline px-4 py-2"
              >Sign In</router-link
            >
            <span class="text-gray-400">or</span>
            <router-link
              to="/sign-up"
              class="inline-block bg-primary text-white px-5 py-2 rounded-lg hover:opacity-95 hover:underline"
              >Sign Up</router-link
            >
          </div>
        </div>

        <div>
          <div
            class="bg-white dark:bg-[#071428] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <div class="flex justify-between items-start">
              <h3 class="text-lg font-semibold">Recent Time Capsules</h3>
            </div>
            <div class="mt-4 grid gap-4">
              <TimeCapsuleCard
                v-for="c in recentCapsules"
                :key="c.id"
                :title="c.title"
                :previewText="c.message"
                :sendAt="c.sendAt"
                :createdAt="c.createdAt"
                :hasAttachment="Boolean(c.attachmentUrl || c.fileUrl)"
              />
              <router-link to="/explore" class="text-sm text-primary hover:underline">
                >View all</router-link
              >
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
