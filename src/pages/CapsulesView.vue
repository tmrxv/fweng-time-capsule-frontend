<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTimeCapsuleStore } from '@/stores/TimeCapsules'
import TimeCapsuleList from '@/components/organisms/TimeCapsuleList.vue'
import Modal from '@/components/atoms/Modal.vue'
import Button from '@/components/atoms/Button.vue'
import type { Capsule } from '@/components/organisms/TimeCapsuleList.vue'

const router = useRouter()
const authStore = useAuthStore()
const capsuleStore = useTimeCapsuleStore()

const deleteModalOpen = ref(false)
const capsuleToDelete = ref<number | null>(null)

const capsules = computed(() =>
  capsuleStore.capsules.map((c) => {
    const attachmentUrl = (c as { attachmentUrl?: string }).attachmentUrl
    const fileUrl = (c as { fileUrl?: string }).fileUrl

    return {
      id: c.id,
      title: c.title,
      preview: c.message,
      message: c.message,
      deliveryDate: c.sendAt,
      visibility: 'PUBLIC' as const,
      createdAt: c.createdAt,
      hasAttachment: Boolean(attachmentUrl || fileUrl),
      userId: c.userId,
    } as Capsule
  }),
)

onMounted(async () => {
  if (authStore.id) {
    await capsuleStore.fetchUserCapsules(Number(authStore.id))
  }
})

function handleSelect(id: number) {
  router.push({ name: 'capsule-details', params: { id } })
}

function handleEdit(id: number) {
  router.push({ name: 'edit-capsule', params: { id } })
}

function handleDeleteClick(id: number) {
  capsuleToDelete.value = id
  deleteModalOpen.value = true
}

function handleCreate() {
  router.push({ name: 'create-capsule' })
}

async function confirmDelete() {
  if (capsuleToDelete.value) {
    try {
      await capsuleStore.deleteCapsule(capsuleToDelete.value)
      deleteModalOpen.value = false
      capsuleToDelete.value = null
    } catch (error) {
      console.error('Failed to delete capsule:', error)
    }
  }
}

function closeDeleteModal() {
  deleteModalOpen.value = false
  capsuleToDelete.value = null
}
</script>

<template>
  <div class="min-h-screen bg-surface text-gray-900 dark:text-gray-100 dark:bg-[#061025]">
    <main class="min-h-screen py-12 px-6">
      <div class="max-w-5xl mx-auto">
        <h1 class="text-3xl sm:text-4xl font-extrabold mb-6">Your Time Capsules</h1>
        <TimeCapsuleList
          v-if="capsules.length > 0"
          :capsules="capsules"
          :currentUserId="Number(authStore.id)"
          :isAdmin="authStore.role === 'ADMIN'"
          @select="handleSelect"
          @edit="handleEdit"
          @delete="handleDeleteClick"
        />

        <div v-else class="mt-10 text-center space-y-4">
          <p class="text-gray-500">No time capsules found.</p>
          <Button type="primary" size="md" @click="handleCreate">+ Create Time Capsule</Button>
        </div>
      </div>
    </main>

    <!-- Delete Confirmation Modal -->
    <Modal :open="deleteModalOpen" title="Delete Time Capsule" @close="closeDeleteModal">
      <p class="mb-6">
        Are you sure you want to delete this time capsule? This action cannot be undone.
      </p>
      <div class="flex gap-4 justify-end">
        <Button @click="closeDeleteModal" class="bg-gray-600 hover:bg-gray-700"> Cancel </Button>
        <Button @click="confirmDelete" class="bg-red-600 hover:bg-red-700"> Delete </Button>
      </div>
    </Modal>
  </div>
</template>
