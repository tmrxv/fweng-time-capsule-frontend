<script setup lang="ts">
import { ref } from 'vue'
import DarkSwitcher from '@/components/atoms/DarkSwitcher.vue'
import UserProfileCard from '@/components/molecules/UserProfileCard.vue'

defineProps({
  username: { type: String, default: 'Guest' },
  email: { type: String, default: 'guest@example.com' },
})

const showMenu = ref(false)
</script>

<template>
  <header class="flex items-center justify-between py-3 px-4 border-b">
    <div class="flex items-center gap-4">
      <a href="/" class="font-bold text-lg">Time Capsule</a>
      <nav class="hidden md:flex gap-3">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/capsules">My Capsules</a>
      </nav>
    </div>

    <div class="flex items-center gap-3">
      <DarkSwitcher />
      <div class="relative">
        <button @click="showMenu = !showMenu" class="p-1 rounded-full border">
          <UserProfileCard :username="username" :email="email" />
        </button>
        <div v-if="showMenu" class="absolute right-0 mt-2 w-48 bg-white shadow-lg p-2 rounded">
          <a class="block py-1">Profile</a>
          <a class="block py-1">Settings</a>
          <a class="block py-1">Logout</a>
        </div>
      </div>
    </div>
  </header>
</template>
