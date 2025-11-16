<script setup lang="ts">
import UserProfileCard from '@/components/molecules/UserProfileCard.vue'
import LabeledInput from '@/components/molecules/LabeledInput.vue'
import LabeledSelect from '@/components/molecules/LabeledSelect.vue'
import LabeledCheckBox from '@/components/molecules/LabeledCheckBox.vue'
import FormActions from '@/components/molecules/FormActions.vue'
import { reactive } from 'vue'

const props = defineProps({
  user: {
    type: Object as () => Record<string, any>,
    default: () => ({ username: 'Anonymous', email: 'anonymous@example.com' }),
  },
})

const emit = defineEmits(['save','cancel'])

const form = reactive({
  username: props.user.username,
  email: props.user.email,
  country: props.user.country || '',
  newsletter: false,
})
</script>

<template>
  <section class="space-y-4 max-w-xl">
    <UserProfileCard :username="form.username" :email="form.email" :country="form.country" />

    <div class="space-y-3">
      <LabeledInput label="Username" v-model="form.username" />
      <LabeledInput label="Email" v-model="form.email" />
      <LabeledSelect label="Country" v-model="form.country" :options="[]" />
      <LabeledCheckBox label="Subscribe to newsletter" v-model="form.newsletter" />
    </div>

    <FormActions
      primaryLabel="Save"
      secondaryLabel="Cancel"
      @primary="() => emit('save', form)"
      @secondary="() => emit('cancel')"
    />
  </section>
</template>
