<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NotificationBanner from '@/components/molecules/NotificationBanner.vue'
import LabeledInput from '@/components/molecules/LabeledInput.vue'
import Button from '@/components/atoms/Button.vue'
import FormActions from '@/components/molecules/FormActions.vue'
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
  <div class="min-h-screen text-gray-900 dark:text-gray-100 dark:bg-[#061025] flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="space-y-6">
        <div class="text-center">
          <h1 class="text-3xl font-bold">Profile</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Manage your account</p>
        </div>

        <NotificationBanner
          v-if="notification.visible"
          :type="notification.type"
          :message="notification.message"
          @close="notification.visible = false"
        />

        <div v-if="loading" class="text-gray-400">Loading profile…</div>
        <div v-else-if="error" class="text-red-400">{{ error }}</div>

        <div v-else-if="user">
          <div class="space-y-4">
            <!-- Avatar -->
            <div class="flex items-center gap-4">
              <img
                :src="user.profileImageUrl || '/images/default-avatar.png'"
                alt="Profile"
                class="w-20 h-20 rounded-full border object-cover"
              />
              <div>
                <p class="font-medium text-white">{{ user.username }}</p>
                <p class="text-sm text-gray-300">{{ user.email }}</p>
              </div>
            </div>

            <!-- Fields -->
            <div>
              <LabeledInput label="Username" v-if="isEditing" v-model="user.username" placeholder="Choose a username" />
              <LabeledInput label="Email" v-if="isEditing" v-model="user.email" placeholder="Enter your email" type="email" />

              <div v-if="!isEditing" class="mt-2">
                <p class="text-sm text-gray-300">To update your information, click "Edit Profile".</p>
              </div>
            </div>

            <!-- Actions -->
            <div>
              <template v-if="!isEditing">
                <div class="flex justify-center">
                  <Button type="outline" size="md" htmlType="button" @click="isEditing = true">
                    Edit Profile
                  </Button>
                </div>
              </template>

              <template v-else>
                <FormActions
                  primaryLabel="Save Changes"
                  secondaryLabel="Cancel"
                  :primaryDisabled="saving"
                  @primary="updateProfile"
                  @secondary="cancelEdit"
                />
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
      </div>
    </div>
  </div>
</template>
