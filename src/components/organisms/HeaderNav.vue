<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import Button from '@/components/atoms/Button.vue'
import ButtonStyleText from '@/components/atoms/ButtonStyleText.vue'

const authStore = useAuthStore()
const username = computed(() => authStore.username)
const isAuthenticated = computed(() => authStore.isAuthenticated)
const role = computed(() => authStore.role)
</script>

<template>
  <header class="flex items-center py-3 px-4 border-b">
    <div class="flex items-center gap-4">
      <!-- Logo / Home link -->
      <router-link to="/" class="font-bold text-lg text-white"> Time Capsule </router-link>

      <!-- Navigation links -->
      <nav class="hidden md:flex gap-3 text-white">
        <router-link to="/" class="hover:underline focus:outline-none focus:ring-2 focus:ring-lighter-blue rounded px-1">Home</router-link>
        <router-link to="/about" class="hover:underline focus:outline-none focus:ring-2 focus:ring-lighter-blue rounded px-1">About</router-link>
        <router-link v-if="isAuthenticated" to="/capsules" class="hover:underline focus:outline-none focus:ring-2 focus:ring-lighter-blue rounded px-1"
          >My Capsules</router-link
        >
        <router-link v-else to="/explore" class="hover:underline focus:outline-none focus:ring-2 focus:ring-lighter-blue rounded px-1">Explore</router-link>
        <router-link to="/help" class="hover:underline focus:outline-none focus:ring-2 focus:ring-lighter-blue rounded px-1">Help</router-link>
        <router-link to="/imprint" class="hover:underline focus:outline-none focus:ring-2 focus:ring-lighter-blue rounded px-1">Imprint</router-link>
      </nav>
    </div>

    <div class="flex items-center gap-4 ml-auto">
      <template v-if="isAuthenticated">
        <span class="text-white">Hello, {{ username }}</span>

        <RouterLink to="/profile">
          <ButtonStyleText type="primary" size="sm">Profile</ButtonStyleText>
        </RouterLink>

        <RouterLink v-if="role === 'ADMIN'" to="/admin">
          <ButtonStyleText type="primary" size="sm" title="Visible only for admins">
            Admin
          </ButtonStyleText>
        </RouterLink>

        <Button type="secondary" size="sm" @click="authStore.logout()"> Logout </Button>
      </template>

      <template v-else>
        <RouterLink to="/sign-in">
          <ButtonStyleText type="primary" size="sm">Sign In</ButtonStyleText>
        </RouterLink>
        <RouterLink to="/sign-up">
          <ButtonStyleText type="secondary" size="sm">Sign Up</ButtonStyleText>
        </RouterLink>
      </template>
    </div>
  </header>
</template>
