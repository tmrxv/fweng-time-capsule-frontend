<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth'
import LabeledInput from '@/components/molecules/LabeledInput.vue'
import FormActions from '@/components/molecules/FormActions.vue'
import NotificationBanner from '@/components/molecules/NotificationBanner.vue'
import * as yup from 'yup'

const router = useRouter()
const errorStore = useErrorStore()
const authStore = useAuthStore()

const identifier = ref('')
const password = ref('')
const isLoading = ref(false)

const validationSchema = yup.object({
  identifier: yup
    .string()
    .required('Username or email is required')
    .test('is-username-or-email', 'Enter a valid email or username', (value) => {
      if (!value) return false
      // Accept any non-empty string as username; if looks like email, ensure valid format
      const looksLikeEmail = value.includes('@')
      return looksLikeEmail ? yup.string().email().isValidSync(value) : value.trim().length > 0
    }),
  password: yup.string().required('Password is required'),
})

const handleSignIn = async () => {
  isLoading.value = true
  try {
    await validationSchema.validate({ identifier: identifier.value, password: password.value })
    await authStore.login({ identifier: identifier.value, password: password.value })
    router.push({ name: 'home' })
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      errorStore.triggerError(err.message)
      return
    }
    errorStore.triggerError('Failed to sign in. Please check your credentials and try again.')
  } finally {
    isLoading.value = false
  }
}

const handleSignUp = () => {
  router.push({ name: 'sign-up' })
}
const show_notification = ref(true)
</script>

<template>
  <div
    class="min-h-screen text-gray-900 dark:text-gray-100 dark:bg-[#061025] flex items-center justify-center"
  >
    <div class="w-full max-w-md">
      <div class="space-y-6">
        <div class="text-center">
          <h1 class="text-3xl font-bold">Welcome Back</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Sign in to your account</p>
        </div>

        <NotificationBanner
          v-if="show_notification"
          @close="show_notification = false"
          type="info"
          message="Enter your credentials to continue."
        />

        <form @submit.prevent="handleSignIn" class="space-y-4">
          <LabeledInput
            label="Username or Email"
            type="text"
            v-model="identifier"
            placeholder="Enter your username or email"
            required
          />

          <LabeledInput
            label="Password"
            type="password"
            v-model="password"
            placeholder="Enter your password"
            required
          />

          <div class="flex justify-end">
            <router-link to="#" class="text-sm text-primary hover:underline">
              Forgot password?
            </router-link>
          </div>

          <FormActions
            primaryLabel="Sign In"
            secondaryLabel="Create Account"
            :primaryDisabled="isLoading"
            @primary="handleSignIn"
            @secondary="handleSignUp"
          />
        </form>

        <div class="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?
          <router-link to="/sign-up" class="text-primary hover:underline">
            Sign up here
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
