<script setup lang="ts">
import TimeCapsuleCard from '@/components/molecules/TimeCapsuleCard.vue'

export interface Capsule {
  id: number
  title: string
  preview?: string
  message?: string
  deliveryDate: string
  visibility: 'PUBLIC' | 'PRIVATE'
  createdAt?: string
  hasAttachment?: boolean
}

const props = defineProps<{
  capsules: Capsule[]
}>()

const emit = defineEmits<{
  (e: 'select', capsule: Capsule): void
}>()

function handleClick(capsule: Capsule) {
  emit('select', capsule)
}
</script>

<template>
  <section class="bg-black-100 p-6 rounded-xl shadow-inner">
    <template v-if="capsules.length">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TimeCapsuleCard
          v-for="cap in capsules"
          :key="cap.id"
          :title="cap.title"
          :previewText="cap.preview || cap.message"
          :deliveryDate="cap.deliveryDate"
          :visibility="cap.visibility"
          :createdAt="cap.createdAt"
          :hasAttachment="cap.hasAttachment"
          @click="handleClick(cap)"
        />
      </div>
    </template>
    <template v-else>
      <p class="text-gray-500 text-center py-10">
        No time capsules found.
      </p>
    </template>
  </section>
</template>
