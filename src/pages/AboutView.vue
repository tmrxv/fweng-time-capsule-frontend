<script setup lang="ts">
import DashboardStats from '@/components/organisms/DashboardStats.vue'


const stats = {
  total: 128,
  public: 80,
  private: 48,
  attachments: 15,
}

function handleCreate() {
  console.log('Create new capsule')
}
</script>

<template>
  <div class="min-h-screen bg-surface text-gray-900 dark:text-gray-100 dark:bg-[#061025]">
    <main class="max-w-6xl mx-auto px-6 py-12">
      <!-- Page header -->
      <h1 class="text-4xl sm:text-5xl font-extrabold mb-8">
        About Time Capsule
      </h1>

      <!-- Info text -->
      <section class="mb-12 space-y-4">
        <p class="text-lg text-gray-700 dark:text-gray-300">
          Time Capsule is a secure platform to create, store, and share messages, letters, and memories
          for the future. Capture today, open tomorrow.
        </p>
        <p class="text-lg text-gray-700 dark:text-gray-300">
          Our mission is to help users preserve personal milestones, track goals, and share memories
          with friends safely and privately.
        </p>
      </section>

      <!-- Stats and recent capsules using dashboard organisms -->
      <section class="space-y-8">
        <DashboardStats :stats="stats" />

      </section>
    </main>
  </div>
</template>
