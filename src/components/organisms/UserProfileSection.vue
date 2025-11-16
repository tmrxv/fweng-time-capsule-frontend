<script setup lang="ts">
import UserProfileCard from '@/components/molecules/UserProfileCard.vue'
import FormActions from '@/components/molecules/FormActions.vue'

defineProps({
  username: {
    type: String,
    default: 'Anonymous',
  },
  email: {
    type: String,
    default: 'anonymous@example.com',
  },
  country: {
    type: String,
    default: '',
  },
  profileImageUrl: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['edit-profile', 'logout'])
</script>

<template>
  <section class="flex flex-col gap-4">
    <UserProfileCard
      :username="username"
      :email="email"
      :country="country"
      :profileImageUrl="profileImageUrl"
    />
    <FormActions
      primaryLabel="Edit Profile"
      secondaryLabel="Logout"
      @primary="emit('edit-profile')"
      @secondary="emit('logout')"
    />
  </section>
</template>
