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
  userId?: number
}

defineProps<{
  capsules: Capsule[]
  currentUserId?: number
}>()

const emit = defineEmits<{
  select: [capsule: Capsule]
  edit: [id: number]
  delete: [id: number]
}>()

function handleClick(capsule: Capsule) {
  emit('select', capsule)
}

function handleEdit(id: number) {
  emit('edit', id)
}

function handleDelete(id: number) {
  emit('delete', id)
}
</script>

<template>
  <section class="bg-black-100 p-6 rounded-xl shadow-inner">
    <template v-if="capsules.length">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TimeCapsuleCard
          v-for="cap in capsules"
          :key="cap.id"
          :id="cap.id"
          :title="cap.title"
          :previewText="cap.preview || cap.message"
          :deliveryDate="cap.deliveryDate"
          :visibility="cap.visibility"
          :createdAt="cap.createdAt"
          :hasAttachment="cap.hasAttachment"
          :isOwner="cap.userId === currentUserId"
          @click="handleClick(cap)"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </template>
    <template v-else>
      <p class="text-gray-500 text-center py-10">No time capsules found.</p>
    </template>
  </section>
</template>
