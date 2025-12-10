<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useErrorStore } from '@/stores/error'
import LabeledInput from '@/components/molecules/LabeledInput.vue'
import FormActions from '@/components/molecules/FormActions.vue'
import NotificationBanner from '@/components/molecules/NotificationBanner.vue'
import Dropdown from '@/components/atoms/Dropdown.vue'
import { object, string, ref as yupRef } from 'yup'
import axios from 'axios'
import CountryAutocomplete from '@/components/organisms/CountryAutocomplete.vue'

// Refs
const router = useRouter()
const errorStore = useErrorStore()
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const gender = ref('')
const genderOther = ref('')
const isLoading = ref(false)
const show_notification = ref(true)
const country = ref('')
const countryCode = ref('')

const handleCountrySelect = (item) => {
  country.value = item.name
  countryCode.value = item.code // <-- this is what API needs!
}

// Yup Schema
let signUpSchema = object({
  email: string().email().required(),
  username: string().min(3).max(20).required(),
  gender: string().oneOf(['male', 'female', 'other'], '').required(),
  genderOther: string().when('gender', {
    is: 'other',
    then: (s) => s.required('Please specify your gender').max(30, 'Max length is 30 characters'),
    otherwise: (s) => s.optional(),
  }),
  password: string()
    .required('Password is required')
    .min(12, 'Password must be at least 12 characters long')
    .matches(/[a-z]/, 'Must contain a lowercase letter')
    .matches(/[A-Z]/, 'Must contain an uppercase letter')
    .matches(/[0-9]/, 'Must contain a number')
    .matches(/[^A-Za-z0-9]/, 'Must contain a symbol'),
  confirmPassword: string().oneOf([yupRef('password')], 'Passwords must match'),
  country: string().required(),
})

const handleSignUp = async () => {
  const formdata = {
    username: username.value,
    email: email.value,
    gender: gender.value,
    genderOther: genderOther.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
    country: country.value,
  }
  try {
    await signUpSchema.validate(formdata, { abortEarly: false })

    isLoading.value = true

    const apiPayload = {
      email: email.value,
      username: username.value,
      password: password.value,
      country: countryCode.value,
      profileImageUrl: '',
    }

    const response = await axios.post('http://localhost:8080/api/auth/register', apiPayload, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response || response.status >= 400) {
      throw new Error('Registration failed')
    }
    router.push({ name: 'home' })
  } catch (err) {
    // Yup validation error
    if (err.inner) {
      const messages = err.inner.map((e) => e.message).join('\n')
      errorStore.triggerError(messages)
      return
    }

    // Axios error
    if (axios.isAxiosError(err)) {
      const msg = err.response?.data?.message || err.response?.data || 'Registration failed'
      errorStore.triggerError(msg)
      return
    }

    // Fallback error
    errorStore.triggerError(err.message || 'Sign up failed')
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
    class="min-h-screen text-gray-900 dark:text-gray-100 dark:bg-[#061025] flex items-center justify-center px-4"
  >
    <div class="w-full max-w-md">
      <div class="space-y-6">
        <div class="text-center">
          <h1 class="text-3xl font-bold">Create Account</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            Join us and start creating time capsules
          </p>
        </div>

        <NotificationBanner
          v-if="show_notification"
          type="info"
          message="Fill in your details to get started."
          @close="show_notification = false"
        />

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
            label="Password (incl. upper/lowercase, number & symbol)"
            type="password"
            v-model="password"
            placeholder="Enter your password at least 12 characters long"
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
            <label class="text-sm font-medium text-lightest-blue"> Gender </label>
            <div class="flex gap-3">
              <Dropdown
                v-model="gender"
                :options="['male', 'female', 'other']"
                placeholder="Select gender"
                size="md"
                class="flex-1"
                required
              />
              <LabeledInput
                v-if="gender === 'other'"
                label=""
                type="text"
                v-model="genderOther"
                placeholder="Specify gender"
                required
              />
            </div>
          </div>
          <CountryAutocomplete v-model="country" @select="handleCountrySelect" />

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
