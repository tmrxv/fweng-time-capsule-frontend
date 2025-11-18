<script setup lang="ts">
import NotificationBanner from '@/components/molecules/NotificationBanner.vue'

defineProps({
  notifications: {
    type: Array as () => Array<Record<string, unknown>>,
    default: () => [],
  },
})

const emit = defineEmits(['dismiss'])
</script>

<template>
  <section class="space-y-2">
    <template v-if="notifications.length">
      <NotificationBanner
        v-for="(n, i) in notifications"
        :key="n.id || i"
        :type="n.type || 'info'"
        :message="n.message"
        @close="() => emit('dismiss', n)"
      />
    </template>
    <template v-else>
      <p class="text-sm text-muted">No notifications</p>
    </template>
  </section>
</template>
