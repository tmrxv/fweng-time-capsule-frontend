<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

defineProps<{
  username: string
  email: string
  password: string
}>()

const emit = defineEmits<{
  (e: 'update:username', value: string): void
  (e: 'update:email', value: string): void
  (e: 'update:password', value: string): void
}>()

function updateUsername(event: Event) {
  emit('update:username', (event.target as HTMLInputElement).value)
}

function updateEmail(event: Event) {
  emit('update:email', (event.target as HTMLInputElement).value)
}

function updatePassword(event: Event) {
  emit('update:password', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-1">Username</label>
      <input
        type="text"
        :value="username"
        @input="updateUsername"
        class="w-full border rounded px-3 py-2"
        placeholder="Enter username"
      />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">Email</label>
      <input
        type="email"
        :value="email"
        @input="updateEmail"
        class="w-full border rounded px-3 py-2"
        placeholder="Enter email"
      />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">Password</label>
      <input
        type="password"
        :value="password"
        @input="updatePassword"
        class="w-full border rounded px-3 py-2"
        placeholder="Enter password"
      />
    </div>
  </div>
</template>

<style scoped>
input:focus {
  outline: none;
  border-color: #6366f1; /* Tailwind indigo-500 */
  box-shadow: 0 0 0 1px #6366f1;
}
</style>
