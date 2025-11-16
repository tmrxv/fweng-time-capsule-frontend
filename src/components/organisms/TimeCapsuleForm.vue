<script setup lang="ts">
import { reactive } from 'vue'
import LabeledInput from '@/components/molecules/LabeledInput.vue'
import LabeledTextArea from '@/components/molecules/LabeledTextArea.vue'
import DateTimeSelector from '@/components/molecules/DateTimeSelector.vue'
import VisibilitySelector from '@/components/molecules/VisibilitySelector.vue'
import FileUploadField from '@/components/molecules/FileUploadField.vue'
import FormActions from '@/components/molecules/FormActions.vue'

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  title: '',
  message: '',
  delivery: { date: '', time: '' },
  visibility: 'PRIVATE',
  attachment: null,
})
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="emit('submit', form)">
    <LabeledInput
      label="Title"
      v-model="form.title"
      placeholder="Enter a title"
      required
    />
    <LabeledTextArea
      label="Message"
      v-model="form.message"
      placeholder="Write your message..."
      :rows="6"
    />
    <DateTimeSelector v-model="form.delivery" />
    <VisibilitySelector v-model="form.visibility" />
    <FileUploadField v-model="form.attachment" />
    <FormActions
      primaryLabel="Send"
      secondaryLabel="Cancel"
      :primaryDisabled="!form.title || !form.message"
      @primary="emit('submit', form)"
      @secondary="emit('cancel')"
    />
  </form>
</template>
