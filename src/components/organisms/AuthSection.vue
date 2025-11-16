<script setup lang="ts">
import { reactive } from 'vue'
import AuthInputGroup from '@/components/molecules/AuthInputGroup.vue'
import FormActions from '@/components/molecules/FormActions.vue'
import NotificationBanner from '@/components/molecules/NotificationBanner.vue'

const emit = defineEmits(['login','register'])

const form = reactive({ username: '', email: '', password: '' })
</script>

<template>
  <section class="max-w-md mx-auto space-y-4">
    <NotificationBanner type="info" message="Sign in or create an account." />
    <AuthInputGroup v-model:username="form.username" v-model:email="form.email" v-model:password="form.password" />
    <div class="flex gap-2 justify-end">
      <FormActions
        primaryLabel="Login"
        secondaryLabel="Register"
        @primary="() => emit('login', form)"
        @secondary="() => emit('register', form)"
      />
    </div>
  </section>
</template>
