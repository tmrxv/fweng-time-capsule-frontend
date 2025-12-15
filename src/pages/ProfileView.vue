<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NotificationBanner from '@/components/molecules/NotificationBanner.vue'
import api from '@/plugins/axios'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/types/User'

// --- State ---
const user = ref<User | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const saving = ref(false)
const deleting = ref(false)
const isEditing = ref(false)
const notification = ref<{ message: string; type: string; visible: boolean }>({ message: '', type: 'info', visible: false })

function showNotification(message: string, type = 'info', duration = 2500) {
  notification.value = { message, type, visible: true }
  setTimeout(() => {
    notification.value.visible = false
  }, duration)
}

// --- Auth ---
const authStore = useAuthStore()
const userId = authStore.id

// --- Fetch user ---
async function fetchUser() {
  if (!userId) {
    router.push({ name: 'sign-in' })
    return
  }

  try {
    const res = await api.get<User>(`/api/users/${userId}`)
    user.value = res.data
  } catch {
    error.value = 'Failed to load profile information.'
  } finally {
    loading.value = false
  }
}

// --- Save profile ---
async function updateProfile() {
  if (!user.value) return
  saving.value = true
  try {
    await api.put(`/api/users/${userId}`, {
      username: user.value.username,
      email: user.value.email,
    })
    isEditing.value = false
    // Update auth store
    if (user.value?.username) {
      authStore.username = user.value.username
      sessionStorage.setItem('username', user.value.username)
    }
    showNotification('Profile updated successfully!', 'success', 2600)
  } catch {
    showNotification('Failed to update profile.', 'error', 3000)
  } finally {
    saving.value = false
  }
}

// --- Cancel editing ---
function cancelEdit() {
  isEditing.value = false
  fetchUser()
}

// --- Delete account ---
async function deleteAccount() {
  deleting.value = true
  try {
    await api.delete(`/api/users/${userId}`)
    authStore.logout()
  } catch {
    showNotification('Failed to delete account.', 'error', 3000)
  } finally {
    deleting.value = false
  }
}

// --- On mount ---
onMounted(fetchUser)
</script>

<template>
  <section class="py-12 bg-dark-blue min-h-screen text-lightest-blue flex items-start justify-start pl-6 sm:pl-8 lg:pl-16">
    <div class="relative bg-medium-dark-blue p-6 rounded-lg border border-dark w-full max-w-2xl space-y-6">
      <div class="absolute top-4 right-4 z-50 w-80 max-w-full">
        <NotificationBanner
          v-if="notification.visible"
          :type="notification.type"
          :message="notification.message"
          :closable="false"
        />
      </div>

      <h1 class="text-2xl font-bold">Profile</h1>

      <div v-if="loading" class="text-gray-400">Loading profile…</div>
      <div v-else-if="error" class="text-red-400">{{ error }}</div>

      <div v-else-if="user" class="space-y-4">
        <!-- Avatar -->
        <div class="flex items-center gap-4">
          <img
            :src="user.profileImageUrl || '/images/default-avatar.png'"
            alt="Profile"
            class="w-24 h-24 rounded-full border object-cover"
          />
          <div>
            <p class="font-medium text-white">{{ user.username }}</p>
            <p class="text-sm text-gray-300">{{ user.email }}</p>
          </div>
        </div>

        <!-- Editable fields -->
        <div v-if="isEditing" class="space-y-3">
          <label class="block">
            <span class="text-sm font-medium">Username</span>
            <input
              type="text"
              v-model="user.username"
              class="mt-1 block w-full p-2 rounded bg-dark-blue border border-dark text-white"
            />
          </label>
          <label class="block">
            <span class="text-sm font-medium">Email</span>
            <input
              type="email"
              v-model="user.email"
              class="mt-1 block w-full p-2 rounded bg-dark-blue border border-dark text-white"
            />
          </label>
        </div>

        <!-- Action buttons -->
        <div class="flex gap-3 mt-4">
          <button
            v-if="!isEditing"
            @click="isEditing = true"
            type="button"
            style="background-color: var(--color-dark-blue); color: white;"
            class="px-4 py-2 rounded hover:opacity-90"
          >
            Edit Profile
          </button>

          <template v-else>
            <button
              @click="updateProfile"
              :disabled="saving"
              type="button"
              style="background-color: var(--color-dark-blue); color: white;"
              class="px-4 py-2 rounded hover:opacity-90"
            >
              {{ saving ? 'Saving…' : 'Save Changes' }}
            </button>
            <button
              @click="cancelEdit"
              :disabled="saving"
              type="button"
              class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </template>
        </div>

        <!-- Danger zone -->
        <div class="mt-6 p-4 rounded border border-red-700 bg-red-900/10">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-semibold text-red-300">Danger Zone</p>
              <p class="text-xs text-red-200">Deleting your account is permanent and cannot be undone.</p>
            </div>
            <button
              @click="deleteAccount"
              :disabled="deleting"
              type="button"
              class="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              {{ deleting ? 'Deleting…' : 'Delete Account' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
