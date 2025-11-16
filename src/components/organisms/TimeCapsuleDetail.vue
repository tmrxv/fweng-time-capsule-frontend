<script setup lang="ts">
import TimeCapsuleCard from '@/components/molecules/TimeCapsuleCard.vue'

interface Attachment {
  name: string
  url: string
}

interface Capsule {
  title: string
  message: string
  deliveryDate: string
  visibility: 'PUBLIC' | 'PRIVATE'
  attachments?: Attachment[]
}

const props = defineProps<{
  capsule: Capsule
}>()
</script>

<template>
  <section class="space-y-4">
    <!-- Time Capsule Card -->
    <TimeCapsuleCard
      :title="props.capsule.title"
      :previewText="props.capsule.message"
      :sendAt="props.capsule.deliveryDate"
      :visibility="props.capsule.visibility"
      :hasAttachment="(props.capsule.attachments?.length ?? 0) > 0"
    />

    <!-- Attachments -->
    <div>
      <h4 class="font-semibold mb-2">Attachments</h4>
      <div v-if="props.capsule.attachments?.length">
        <ul class="list-disc list-inside">
          <li v-for="(attachment, idx) in props.capsule.attachments" :key="idx">
            <a
              :href="attachment.url"
              class="text-blue-500 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ attachment.name }}
            </a>
          </li>
        </ul>
      </div>
      <div v-else class="text-sm text-gray-400">No attachments</div>
    </div>
  </section>
</template>

<style scoped></style>
