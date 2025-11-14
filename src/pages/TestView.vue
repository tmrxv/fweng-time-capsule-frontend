<script setup>
import { ref } from 'vue'

import Button from '@/components/atoms/Button.vue'
import InputField from '@/components/atoms/InputField.vue'
import Dropdown from '@/components/atoms/Dropdown.vue'
import Checkbox from '@/components/atoms/Checkbox.vue'
import RadioButton from '@/components/atoms/RadioButton.vue'

const username = ref('')
const email = ref('')
const password = ref('')
const selected = ref('')
const anonymous = ref(false)
const public_or_private = ref('')
</script>

<template>
  <div class="min-h-screen bg-dark text-lightest-blue flex items-center justify-center p-8">
    <!-- Form Container -->
    <div class="w-full max-w-md space-y-6 p-6 bg-dark-blue rounded-2xl shadow-lg">
      <!-- Username & Password -->
      <div class="space-y-4">
        <InputField placeholder="Enter your email" type="email" v-model="username" />
        <InputField placeholder="Enter your username" v-model="email" />
        <InputField placeholder="Enter your password" type="password" v-model="password" />
      </div>

      <!-- Dropdown (Gender) -->
      <div>
        <Dropdown
          v-model="selected"
          :options="['Male', 'Female', 'Other']"
          placeholder="Choose Gender"
        />
        <p class="mt-1 text-lighter-blue text-sm">Selected: {{ selected }}</p>
      </div>

      <!-- Anonymous Checkbox -->
      <div>
        <Checkbox v-model="anonymous" label="Anonymous?" />
      </div>

      <!-- Public/Private Radio Buttons -->
      <div class="space-x-4 mt-2">
        <RadioButton v-model="public_or_private" value="Public" label="Public" />
        <RadioButton v-model="public_or_private" value="Private" label="Private" />
      </div>

      <!-- Submit Button -->
      <div>
        <Button type="primary" class="w-full">Submit</Button>
      </div>
    </div>
  </div>
</template>
