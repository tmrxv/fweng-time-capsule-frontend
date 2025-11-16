<script setup lang="ts">
import DashboardStats from '@/components/organisms/DashboardStats.vue'
import TimeCapsuleCard from '@/components/molecules/TimeCapsuleCard.vue'
import FormActions from '@/components/molecules/FormActions.vue'

type Capsule = {
  id?: string | number
  title: string
  preview?: string
  message?: string
  deliveryDate?: string
  visibility?: 'public' | 'private' | string
}

defineProps({
  stats: {
    type: Object as () => Record<string, number>,
    default: () => ({ total: 0, public: 0, private: 0, attachments: 0 }),
  },
  capsules: {
    type: Array as () => Array<Capsule>,
    default: () => [] as Capsule[],
  },
})

const emit = defineEmits(['create', 'view'])
</script>

<template>
  <section class="space-y-6">
    <DashboardStats :stats="stats" />

    <div>
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-semibold">Your Time Capsules</h3>
        <FormActions primaryLabel="Create" @primary="() => emit('create')" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <template v-if="capsules.length">
          <TimeCapsuleCard
            v-for="cap in capsules"
            :key="cap.id || cap.title"
            :title="cap.title"
            :previewText="cap.preview || cap.message"
            :deliveryDate="cap.deliveryDate"
            :visibility="cap.visibility"
            @click="emit('view', cap)"
          />
        </template>
        <template v-else>
          <p class="text-sm text-muted col-span-full">No time capsules yet.</p>
        </template>
      </div>
    </div>
  </section>
</template>
