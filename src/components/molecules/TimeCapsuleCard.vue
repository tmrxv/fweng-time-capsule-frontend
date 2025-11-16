<script setup lang="ts">
interface Props {
  title: string
  previewText?: string
  visibility?: 'PUBLIC' | 'PRIVATE'
  sendAt?: string
  createdAt?: string
  hasAttachment?: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <article
    class="w-full rounded-xl bg-medium-dark-blue p-4 shadow-md hover:shadow-lg transition-shadow duration-200 border border-dark"
  >
    <header class="flex justify-between items-start gap-2">
      <h2 class="text-base font-semibold text-lightest-blue">
        {{ props.title }}
      </h2>

      <span
        class="text-xs px-2 py-0.5 rounded-full"
        :class="props.visibility === 'PUBLIC'
          ? 'bg-green-500/20 text-green-300 border border-green-500/40'
          : 'bg-yellow-500/10 text-yellow-200 border border-yellow-500/30'"
      >
        {{ props.visibility === 'PUBLIC' ? 'Public' : 'Private' }}
      </span>
    </header>

    <p class="mt-2 text-sm text-lightest-blue/80 line-clamp-2">
      {{ props.previewText || 'No preview available.' }}
    </p>

    <div class="mt-3 flex flex-wrap gap-3 text-xs text-lightest-blue/60">
      <span v-if="props.sendAt">
        📅 Deliver at: <span class="font-mono">{{ props.sendAt }}</span>
      </span>
      <span v-if="props.createdAt">
        🕒 Created: <span class="font-mono">{{ props.createdAt }}</span>
      </span>
      <span v-if="props.hasAttachment">
        📎 Attachment included
      </span>
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
