<script setup lang="ts">
import TimeCapsuleCard from '@/components/molecules/TimeCapsuleCard.vue'
import NotificationBanner from '@/components/molecules/NotificationBanner.vue'

const props = defineProps({
  capsules: {
    type: Array as () => Array<Record<string, unknown>>,
    default: () => [],
  },
})

const emit = defineEmits(['select'])
</script>

<template>
  <section>
    <template v-if="capsules.length">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TimeCapsuleCard
          v-for="cap in capsules"
          :key="cap.id || cap.title"
          :title="cap.title"
          :previewText="cap.preview || cap.message"
          :deliveryDate="cap.deliveryDate"
          :visibility="cap.visibility"
          @click="() => emit('select', cap)"
        />
      </div>
    </template>
    <template v-else>
      <NotificationBanner type="info" message="No time capsules found." />
    </template>
  </section>
</template>
