<script setup lang="ts">
import EditIcon from '@/icons/EditIcon.vue'
import DeleteIcon from '@/icons/DeleteIcon.vue'
import { useDateFormat } from '@/composables/UseDateFormat'

const { formatDateTime } = useDateFormat()

interface Props {
  id?: number
  title: string
  previewText?: string
  visibility?: 'PUBLIC' | 'PRIVATE'
  sendAt?: string
  createdAt?: string
  hasAttachment?: boolean
  isOwner?: boolean
  isAdmin?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  select: [id: number]
  edit: [id: number]
  delete: [id: number]
}>()

function handleSelect() {
  if (props.id) {
    emit('select', props.id)
  }
}

function handleEdit(event: Event) {
  event.stopPropagation()
  if (!props.isOwner && !props.isAdmin) {
    return // Don't allow edit if not owner or admin
  }
  if (props.id) {
    emit('edit', props.id)
  }
}

function handleDelete(event: Event) {
  event.stopPropagation()
  if (!props.isOwner && !props.isAdmin) {
    return // Don't allow delete if not owner or admin
  }
  if (props.id) {
    emit('delete', props.id)
  }
}
</script>

<template>
  <article
    class="w-full rounded-xl bg-medium-dark-blue p-4 shadow-md hover:shadow-lg transition-shadow duration-200 border border-dark cursor-pointer"
    @click="handleSelect"
  >
    <header class="flex justify-between items-start gap-2">
      <h2 class="text-base font-semibold text-lightest-blue">
        {{ props.title }}
      </h2>

      <div class="flex items-center gap-2">
        <span
          class="text-xs px-2 py-0.5 rounded-full"
          :class="
            props.visibility === 'PUBLIC'
              ? 'bg-green-500/20 text-green-300 border border-green-500/40'
              : 'bg-yellow-500/10 text-yellow-200 border border-yellow-500/30'
          "
        >
          {{ props.visibility === 'PUBLIC' ? 'Public' : 'Private' }}
        </span>

        <!-- Action icons for owner or admin -->
        <div v-if="props.isOwner || props.isAdmin" class="flex gap-1">
          <button
            @click="handleEdit"
            class="p-1.5 rounded text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors"
            title="Edit"
          >
            <EditIcon :size="18" />
          </button>
          <button
            @click="handleDelete"
            class="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            title="Delete"
          >
            <DeleteIcon :size="18" />
          </button>
        </div>
      </div>
    </header>

    <p class="mt-2 text-sm text-lightest-blue/80 line-clamp-2">
      {{ props.previewText || 'No preview available.' }}
    </p>

    <div class="mt-3 flex flex-wrap gap-3 text-xs text-lightest-blue/60">
      <span v-if="props.sendAt">
        📅 Deliver at: <span class="font-mono">{{ formatDateTime(props.sendAt) }}</span>
      </span>
      <span v-if="props.createdAt">
        🕒 Created: <span class="font-mono">{{ formatDateTime(props.createdAt) }}</span>
      </span>
      <span v-if="props.hasAttachment"> 📎 Attachment included </span>
    </div>
  </article>
</template>

<style scoped>
input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 1px #6366f1;
}
</style>
