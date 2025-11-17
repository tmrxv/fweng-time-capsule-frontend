<script setup lang="ts">
import { ref } from 'vue'
import TimeCapsuleList from '@/components/organisms/TimeCapsuleList.vue'
import type { Capsule } from '@/components/organisms/TimeCapsuleList.vue'

const capsules = ref<Capsule[]>([
  {
    id: 1,
    title: 'Birthday Capsule',
    preview: 'A short preview for the birthday message.',
    message: 'Full message text.',
    deliveryDate: '2025-12-21T10:00:00Z',
    visibility: 'PUBLIC',
    createdAt: '2025-11-01T12:00:00Z',
    hasAttachment: true,
  },
  {
    id: 2,
    title: 'Travel Memories',
    preview: 'Highlights from the summer trip.',
    message: 'Detailed travel story.',
    deliveryDate: '2027-01-31T08:00:00Z',
    visibility: 'PRIVATE',
  },
  {
    id: 3,
    title: 'Career Vision',
    preview: 'Goals and ambitions for future career steps.',
    message: 'A longer message describing long-term plans.',
    deliveryDate: '2026-04-15T14:30:00Z',
    visibility: 'PUBLIC',
    createdAt: '2025-10-15T09:00:00Z',
  },
  {
    id: 4,
    title: 'Time Capsule for Friends',
    preview: 'A message for the closest friends.',
    message: 'Heartfelt message stored for future reading.',
    deliveryDate: '2028-09-01T12:00:00Z',
    visibility: 'PUBLIC',
    hasAttachment: true,
  },
  {
    id: 5,
    title: 'Study Reflections',
    preview: 'Experiences from university years.',
    message: 'Full text describing lessons learned and funny stories.',
    deliveryDate: '2029-02-20T09:00:00Z',
    visibility: 'PRIVATE',
  },
  {
    id: 6,
    title: 'New Year Wishes',
    preview: 'Thoughts and goals for the next year.',
    message: 'A message reflecting on the year and hopes for the next.',
    deliveryDate: '2025-12-31T23:59:00Z',
    visibility: 'PUBLIC',
  },
  {
    id: 7,
    title: 'Childhood Memories',
    preview: 'Short stories from early childhood.',
    message: 'A collection of nostalgic moments.',
    deliveryDate: '2030-06-10T10:00:00Z',
    visibility: 'PUBLIC',
  },
  {
    id: 8,
    title: 'Motivation Capsule',
    preview: 'Encouraging words for hard times.',
    message: 'A longer text with positive reminders.',
    deliveryDate: '2026-11-05T17:00:00Z',
    visibility: 'PRIVATE',
  },
])

function handleSelect(capsule: Capsule) {
  console.log('Selected capsule:', capsule)
}
</script>

<template>
  <div class="min-h-screen bg-surface text-gray-900 dark:text-gray-100 dark:bg-[#061025]">
    <main class="min-h-screen bg-surface text-gray-900 dark:text-gray-100 py-12 px-6">
      <div class="max-w-5xl mx-auto">
        <!-- Header -->
        <h1 class="text-3xl sm:text-4xl font-extrabold text-white-900 mb-6">
          Recent Time Capsules
        </h1>

        <!-- Capsule list container -->
          <TimeCapsuleList
            :capsules="capsules"
            @select="handleSelect"
          />
      </div>
    </main>
  </div>

</template>
