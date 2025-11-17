<script setup lang="ts">
import { ref } from 'vue'
import HeaderNav from '@/components/organisms/HeaderNav.vue'
import TimeCapsuleCard from '@/components/molecules/TimeCapsuleCard.vue'
import StatsRow from '@/components/molecules/StatsRow.vue'
import NotificationBanner from '@/components/molecules/NotificationBanner.vue'
import DarkSwitcher from '@/components/atoms/DarkSwitcher.vue'

const stats = ref([
  { label: 'Capsules', value: 128 },
  { label: 'Members', value: 3_542 },
  { label: 'Opened', value: 84 },
])

const recent = ref([
  {
    id: 1,
    title: 'Graduation Letter',
    date: '2026-06-15',
    excerpt: 'A letter to my future self about graduation day.',
  },
  { id: 2, title: 'Trip Notes', date: '2025-08-22', excerpt: 'Memories from the Iceland trip.' },
  {
    id: 3,
    title: 'Promise to Future Me',
    date: '2027-01-01',
    excerpt: 'New Year resolutions stored for later.',
  },
])
</script>

<template>
  <div class="min-h-screen bg-surface text-gray-900 dark:text-gray-100 dark:bg-[#061025]">
    <main class="max-w-6xl mx-auto px-6 py-12">
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
              to="/create"
              class="inline-block bg-primary text-white px-5 py-3 rounded-lg shadow hover:opacity-95"
              >Create Capsule</router-link
            >
            <router-link
              to="/explore"
              class="inline-block border border-muted text-muted px-4 py-2 rounded-lg"
              >Explore Capsules</router-link
            >
          </div>

          <div class="mt-8">
            <StatsRow :items="stats" />
          </div>

          <div class="mt-8 flex items-center gap-3">
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
                v-for="c in recent"
                :key="c.id"
                :title="c.title"
                :date="c.date"
                :excerpt="c.excerpt"
              />
              <router-link to="/capsules" class="text-sm text-primary hover:underline"
                >View all</router-link
              >
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
