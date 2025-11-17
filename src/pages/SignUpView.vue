<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useErrorStore } from '@/stores/error'
import LabeledInput from '@/components/molecules/LabeledInput.vue'
import LabeledCheckBox from '@/components/molecules/LabeledCheckBox.vue'
import FormActions from '@/components/molecules/FormActions.vue'
import NotificationBanner from '@/components/molecules/NotificationBanner.vue'
import InputField from '@/components/atoms/InputField.vue'
import Dropdown from '@/components/atoms/Dropdown.vue'

const router = useRouter()
const errorStore = useErrorStore()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const gender = ref('')
const genderOther = ref('')
const agreeToTerms = ref(false)
const isLoading = ref(false)

const handleSignUp = async () => {
  if (
    !username.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value ||
    !gender.value
  ) {
    errorStore.triggerError('Please fill in all fields')
    return
  }

  if (gender.value === 'other' && !genderOther.value) {
    errorStore.triggerError('Please specify your gender')
    return
  }

  if (password.value !== confirmPassword.value) {
    errorStore.triggerError('Passwords do not match')
    return
  }

  if (password.value.length < 8) {
    errorStore.triggerError('Password must be at least 8 characters')
    return
  }

  if (!agreeToTerms.value) {
    errorStore.triggerError('You must agree to the terms and conditions')
    return
  }

  isLoading.value = true
  try {
    // TODO: Replace with actual API call
    const selectedGender = gender.value === 'other' ? genderOther.value : gender.value
    console.log('Sign up attempt:', {
      username: username.value,
      email: email.value,
      password: password.value,
      gender: selectedGender,
    })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    router.push({ name: 'home' })
  } catch (err) {
    errorStore.triggerError('Sign up failed. Please try again.')
  } finally {
    isLoading.value = false
  }
}

const handleSignIn = () => {
  router.push({ name: 'sign-in' })
}
</script>

<template>
  <div
    class="min-h-screen bg-surface text-gray-900 dark:text-gray-100 dark:bg-[#061025] flex items-center justify-center px-4"
  >
    <div class="w-full max-w-md">
      <div class="space-y-6">
        <div class="text-center">
          <h1 class="text-3xl font-bold">Create Account</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            Join us and start creating time capsules
          </p>
        </div>

        <NotificationBanner type="info" message="Fill in your details to get started." />

        <form @submit.prevent="handleSignUp" class="space-y-4">
          <LabeledInput
            label="Username"
            type="text"
            v-model="username"
            placeholder="Choose a username"
            required
          />

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
            placeholder="At least 8 characters"
            required
          />

          <LabeledInput
            label="Confirm Password"
            type="password"
            v-model="confirmPassword"
            placeholder="Confirm your password"
            required
          />

          <div>
            <label class="block text-sm font-medium mb-2">Gender</label>
            <div class="flex gap-3">
              <Dropdown
                v-model="gender"
                :options="['Male', 'Female', 'Other']"
                placeholder="Select gender"
                size="md"
                class="flex-1"
                required
              />
              <LabeledInput
                v-if="gender === 'Other'"
                label=""
                type="text"
                v-model="genderOther"
                placeholder="Enter your gender"
                required
              />
            </div>
          </div>

          <FormActions
            primaryLabel="Sign Up"
            secondaryLabel="Sign In"
            :primaryDisabled="isLoading"
            @primary="handleSignUp"
            @secondary="handleSignIn"
          />
        </form>

        <div class="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?
          <router-link to="/sign-in" class="text-primary hover:underline">
            Sign in here
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
