<script setup lang="ts">
import { RouterLink } from 'vue-router'

</script>

<template>
  <header class="flex items-center justify-between py-3 px-4 border-b">
    <div class="flex items-center gap-4">
      <!-- Logo / Home link -->
      <router-link to="/" class="font-bold text-lg text-white">
        Time Capsule
      </router-link>

      <!-- Navigation links -->
      <nav class="hidden md:flex gap-3 text-white">
        <router-link to="/" class="hover:underline">Home</router-link>
        <router-link to="/about" class="hover:underline">About</router-link>
        <router-link to="/capsules" class="hover:underline">Capsules</router-link>
        <router-link to="/help" class="hover:underline">Help</router-link>
        <router-link to="/imprint" class="hover:underline">Imprint</router-link>
      </nav>
    </div>
  </header>
</template>
