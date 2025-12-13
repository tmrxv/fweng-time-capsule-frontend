<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import Button from '@/components/atoms/Button.vue'

const authStore = useAuthStore()
const username = computed(() => authStore.username)
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>

<template>
  <header class="flex items-center py-3 px-4 border-b">
    <div class="flex items-center gap-4">
      <!-- Logo / Home link -->
      <router-link to="/" class="font-bold text-lg text-white"> Time Capsule </router-link>

      <!-- Navigation links -->
      <nav class="hidden md:flex gap-3 text-white">
        <router-link to="/" class="hover:underline">Home</router-link>
        <router-link to="/about" class="hover:underline">About</router-link>
        <router-link to="/capsules" class="hover:underline">Capsules</router-link>
        <router-link to="/help" class="hover:underline">Help</router-link>
        <router-link to="/imprint" class="hover:underline">Imprint</router-link>
      </nav>
    </div>

    <div class="flex items-center gap-4 ml-auto">
      <template v-if="isAuthenticated">
        <span class="text-white">Hello, {{ username }}</span>
        <Button type="secondary" size="sm" @click="authStore.logout()"> Logout </Button>
      </template>

      <template v-else>
        <RouterLink to="/sign-in">
          <Button type="primary" size="sm">Sign In</Button>
        </RouterLink>
        <RouterLink to="/sign-up">
          <Button type="secondary" size="sm">Sign Up</Button>
        </RouterLink>
      </template>
    </div>
  </header>
</template>
