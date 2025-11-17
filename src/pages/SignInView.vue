<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useErrorStore } from '@/stores/error'
import LabeledInput from '@/components/molecules/LabeledInput.vue'
import FormActions from '@/components/molecules/FormActions.vue'
import NotificationBanner from '@/components/molecules/NotificationBanner.vue'

const router = useRouter()
const errorStore = useErrorStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)

const handleSignIn = async () => {
  if (!email.value || !password.value) {
    errorStore.triggerError('Please fill in all fields')
    return
  }

  isLoading.value = true
  try {
    // TODO: Replace with actual API call
    console.log('Sign in attempt:', { email: email.value, password: password.value })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    router.push({ name: 'home' })
  } catch (err) {
    errorStore.triggerError('Sign in failed. Please try again.')
  } finally {
    isLoading.value = false
  }
}

const handleSignUp = () => {
  router.push({ name: 'sign-up' })
}
</script>

<template>
  <div
    class="min-h-screen bg-surface text-gray-900 dark:text-gray-100 dark:bg-[#061025] flex items-center justify-center px-4"
  >
    <div class="w-full max-w-md">
      <div class="space-y-6">
        <div class="text-center">
          <h1 class="text-3xl font-bold">Welcome Back</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Sign in to your account</p>
        </div>

        <NotificationBanner type="info" message="Enter your credentials to continue." />

        <form @submit.prevent="handleSignIn" class="space-y-4">
          <LabeledInput
            label="Email"
            type="email"
            v-model="email"
            placeholder="Enter your email"
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
