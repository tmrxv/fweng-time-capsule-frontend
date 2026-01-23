<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import LabeledInput from './LabeledInput.vue'
import LabeledTextArea from './LabeledTextArea.vue'
import DateTimeSelector from './DateTimeSelector.vue'
import FileUploadField from './FileUploadField.vue'
import Button from '@/components/atoms/Button.vue'
import ErrorMessage from './ErrorMessage.vue'
import type { TimeCapsulePostRequest } from '@/types/TimeCapsule'

const props = defineProps({
  initialData: {
    type: Object as () => Partial<TimeCapsulePostRequest> | null,
    default: null,
  },
  // When editing, we can show existing attachment info
  existingAttachmentUrl: {
    type: String,
    default: '',
  },
  existingAttachmentFileName: {
    type: String,
    default: '',
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  submit: [data: TimeCapsulePostRequest]
  cancel: []
}>()

const authStore = useAuthStore()
const formErrors = ref<{ [key: string]: string }>({})

const formData = ref({
  title: props.initialData?.title || '',
  message: props.initialData?.message || '',
  sendAtDate: '',
  sendAtTime: '',
  attachment: null as File | null,
})

// Parse sendAt into date and time if initialData is provided
if (props.initialData?.sendAt) {
  const date = new Date(props.initialData.sendAt)
  formData.value.sendAtDate = date.toISOString().split('T')[0] ?? ''
  formData.value.sendAtTime = date.toTimeString().slice(0, 5)
}

const isFormValid = computed(() => {
  return (
    formData.value.title.trim().length > 0 &&
    formData.value.message.trim().length > 0 &&
    formData.value.sendAtDate &&
    formData.value.sendAtTime
  )
})

function handleSubmit() {
  formErrors.value = {}

  // Validation
  if (!formData.value.title.trim()) {
    formErrors.value.title = 'Title is required'
  }
  if (!formData.value.message.trim()) {
    formErrors.value.message = 'Message is required'
  }
  if (!formData.value.sendAtDate) {
    formErrors.value.sendAtDate = 'Delivery date is required'
  }
  if (!formData.value.sendAtTime) {
    formErrors.value.sendAtTime = 'Delivery time is required'
  }

  if (Object.keys(formErrors.value).length > 0) {
    return
  }

  // Combine date and time
  const sendAt = new Date(`${formData.value.sendAtDate}T${formData.value.sendAtTime}`).toISOString()

  const submitData: TimeCapsulePostRequest = {
    userId: parseInt(authStore.id || '0'),
    title: formData.value.title,
    message: formData.value.message,
    sendAt,
  }

  // Only add attachment if one was selected
  if (formData.value.attachment) {
    submitData.attachment = formData.value.attachment
  }

  emit('submit', submitData)
}

function handleCancel() {
  emit('cancel')
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
    <!-- Title -->
    <div>
      <LabeledInput
        id="title"
        v-model="formData.title"
        label="Title"
        placeholder="Enter capsule title"
        :disabled="isLoading"
      />
      <ErrorMessage v-if="formErrors.title" :message="formErrors.title" />
    </div>

    <!-- Message -->
    <div>
      <LabeledTextArea
        id="message"
        v-model="formData.message"
        label="Message"
        placeholder="Write your message here..."
        :rows="6"
        :disabled="isLoading"
      />
      <ErrorMessage v-if="formErrors.message" :message="formErrors.message" />
    </div>

    <!-- Delivery Date/Time -->
    <div>
      <DateTimeSelector
        :model-value="{ date: formData.sendAtDate, time: formData.sendAtTime }"
        @update:model-value="
          (val: { date: string; time: string }) => {
            formData.sendAtDate = val.date
            formData.sendAtTime = val.time
          }
        "
      />
      <ErrorMessage v-if="formErrors.sendAtDate" :message="formErrors.sendAtDate" />
    </div>

    <!-- File Attachment (Optional) -->
    <div>
      <div v-if="existingAttachmentUrl && !formData.attachment" class="mb-2 text-sm">
        <span class="text-lightest-blue">Current attachment:</span>
        <a
          :href="existingAttachmentUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="underline text-blue-500 hover:text-blue-400 ml-1"
        >
          {{ existingAttachmentFileName || 'View file' }}
        </a>
        <span class="text-lightest-blue/70 ml-2">(select a new file to replace)</span>
      </div>
      <FileUploadField
        v-model="formData.attachment"
        label="Attachment (Optional)"
        helper-text="Add an image, PDF, or other file to include with your time capsule."
        accept="image/*,application/pdf,.doc,.docx"
        :disabled="isLoading"
        :has-existing-file="!!existingAttachmentUrl"
      />
    </div>

    <!-- Form Actions -->
    <div class="flex gap-3 justify-end pt-4">
      <Button
        type="secondary"
        size="md"
        html-type="button"
        :disabled="isLoading"
        @click="handleCancel"
      >
        Cancel
      </Button>
      <Button type="primary" size="md" html-type="submit" :disabled="!isFormValid || isLoading">
        {{ isLoading ? 'Saving...' : 'Save Capsule' }}
      </Button>
    </div>
  </form>
</template>
