<script setup lang="ts">
import StatsRow from '@/components/molecules/StatsRow.vue'

defineProps({
  stats: {
    type: Object,
    default: () => ({
      total: 0,
      public: 0,
      private: 0,
      attachments: 0,
    }),
  },
})
</script>

<template>
  <section class="flex flex-col gap-2">
    <StatsRow icon="📦" label="Total Capsules" :value="stats.total.toString()" />
    <StatsRow icon="🔓" label="Public Capsules" :value="stats.public.toString()" />
    <StatsRow icon="🔒" label="Private Capsules" :value="stats.private.toString()" />
    <StatsRow icon="📎" label="With Attachments" :value="stats.attachments.toString()" />
  </section>
</template>
