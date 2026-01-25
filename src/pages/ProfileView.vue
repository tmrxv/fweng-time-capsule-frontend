<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import NotificationBanner from '@/components/molecules/NotificationBanner.vue'
import LabeledInput from '@/components/molecules/LabeledInput.vue'
import Button from '@/components/atoms/Button.vue'
import FormActions from '@/components/molecules/FormActions.vue'
import CountryAutocomplete from '@/components/organisms/CountryAutocomplete.vue'
import FileUploadField from '@/components/molecules/FileUploadField.vue'
import Modal from '@/components/atoms/Modal.vue'
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
const showDeleteModal = ref(false)
const notification = ref<{ message: string; type: string; visible: boolean }>({ message: '', type: 'info', visible: false })
const country = ref('')
const countryCode = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const profileImage = ref<File | null>(null)

// Compute full image URL using backend base (serves /uploads/**)
const profileImageUrl = computed(() => {
  if (!user.value?.profileImageUrl) return '/images/default-avatar.png'
  if (user.value.profileImageUrl.startsWith('http')) return user.value.profileImageUrl

  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
  const imageUrl = `${base}${user.value.profileImageUrl}`
  console.log('Profile image URL:', imageUrl, 'from:', user.value.profileImageUrl)
  return imageUrl
})

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
    country.value = res.data.country || ''
    console.log('User profile loaded:', res.data)
  } catch (err) {
    console.error('Failed to fetch user:', err)
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
    // Validate password if provided (backend rule: at least 8 chars, upper/lower/digit)
    if (newPassword.value) {
      const valid = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(newPassword.value)
      if (!valid) {
        showNotification(
          'Password must be 8+ chars with uppercase, lowercase, and a digit.',
          'error',
          3500,
        )
        saving.value = false
        return
      }
      if (newPassword.value !== confirmPassword.value) {
        showNotification('Passwords do not match.', 'error', 3000)
        saving.value = false
        return
      }
    }

    // Update basic profile info
    const payload: Record<string, unknown> = {
      username: user.value.username,
      email: user.value.email,
      country: countryCode.value || user.value.country,
    }
    if (newPassword.value) {
      payload.password = newPassword.value
    }

    await api.put(`/api/users/${userId}`, payload)

    // Upload profile image if selected
    if (profileImage.value) {
      const formData = new FormData()
      formData.append('file', profileImage.value)
      try {
        const imgRes = await api.post(`/api/users/${userId}/upload`, formData)
        // Backend returns the updated user object
        if (imgRes.data) {
          user.value = imgRes.data
        }
      } catch (uploadError) {
        console.error('Image upload error:', uploadError)
        showNotification('Profile saved but image upload failed.', 'warning', 3200)
        saving.value = false
        return
      }
    } else {
      // Refresh user data if no image was uploaded
      await fetchUser()
    }

    isEditing.value = false

    // Clear password fields after save
    newPassword.value = ''
    confirmPassword.value = ''
    profileImage.value = null

    // Update auth store
    if (user.value?.username) {
      authStore.username = user.value.username
      localStorage.setItem('username', user.value.username)
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
  profileImage.value = null
  fetchUser()
}

const handleCountrySelect = (item: { name: string; code: string }) => {
  country.value = item.name
  countryCode.value = item.code
}

// --- Delete account ---
function openDeleteModal() {
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
}

async function confirmDeleteAccount() {
  deleting.value = true
  try {
    await api.delete(`/api/users/${userId}`)
    showDeleteModal.value = false
    showNotification('Account deleted successfully', 'success', 2000)
    setTimeout(() => {
      authStore.logout()
    }, 2100)
  } catch (err: unknown) {
    console.error('Delete account error:', err)
    const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to delete account'
    showNotification(errorMsg, 'error', 3500)
    showDeleteModal.value = false
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
                :src="profileImageUrl"
                alt="Profile"
                class="w-20 h-20 rounded-full border object-cover"
              />
              <div>
                <p class="font-medium text-white">{{ user.username }}</p>
                <p class="text-sm text-gray-300">{{ user.email }}</p>
              </div>
            </div>

            <!-- Fields -->
            <div class="space-y-4">
              <template v-if="isEditing">
                <LabeledInput
                  label="Username"
                  v-model="user.username"
                  placeholder="Choose a username"
                />
                <LabeledInput
                  label="Email"
                  v-model="user.email"
                  placeholder="Enter your email"
                  type="email"
                />
                <CountryAutocomplete
                  v-model="country"
                  @select="handleCountrySelect"
                />
                <FileUploadField
                  v-model="profileImage"
                  label="Profile Picture"
                  helper-text="Upload a new profile picture (optional)"
                  accept="image/*"
                  :has-existing-file="!!user.profileImageUrl"
                />
                <LabeledInput
                  label="New Password (optional)"
                  v-model="newPassword"
                  placeholder="Leave blank to keep current password"
                  type="password"
                />
                <LabeledInput
                  label="Confirm New Password"
                  v-model="confirmPassword"
                  placeholder="Repeat new password"
                  type="password"
                />
              </template>

              <template v-else>
                <div class="space-y-2">
                  <div>
                    <span class="text-sm font-medium text-lightest-blue">Username:</span>
                    <p class="text-sm text-gray-300">{{ user.username }}</p>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-lightest-blue">Email:</span>
                    <p class="text-sm text-gray-300">{{ user.email }}</p>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-lightest-blue">Country:</span>
                    <p class="text-sm text-gray-300">{{ user.country || '—' }}</p>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-lightest-blue">Role:</span>
                    <p class="text-sm text-gray-300">{{ user.role }}</p>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-lightest-blue">Member since:</span>
                    <p class="text-sm text-gray-300">{{ user.createdAt?.split('T')[0] || '—' }}</p>
                  </div>
                </div>
              </template>
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
                  @click="openDeleteModal"
                  :disabled="deleting"
                  type="button"
                  class="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Modal :open="showDeleteModal" title="Delete Account" @close="closeDeleteModal">
      <div class="space-y-4">
        <p class="text-lightest-blue">
          Are you sure you want to delete your account? This action is <strong>permanent</strong> and cannot be undone.
        </p>
        <p class="text-sm text-red-300">
          All your time capsules and data will be permanently deleted.
        </p>
        <div class="flex gap-4 justify-end pt-2">
          <Button type="secondary" size="md" @click="closeDeleteModal" :disabled="deleting">
            Cancel
          </Button>
          <Button
            type="primary"
            size="md"
            @click="confirmDeleteAccount"
            :disabled="deleting"
            class="bg-red-600 hover:bg-red-700"
          >
            {{ deleting ? 'Deleting…' : 'Yes, Delete My Account' }}
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
