<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  previewText: {
    type: String,
    default: '',
  },
  visibility: {
    type: String,
    default: 'PRIVATE', // PUBLIC | PRIVATE
  },
  sendAt: {
    type: String,
    default: '',
  },
  createdAt: {
    type: String,
    default: '',
  },
  hasAttachment: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <article
    class="w-full rounded-xl bg-medium-dark-blue p-4 shadow-md hover:shadow-lg transition-shadow duration-200 border border-dark"
  >
    <header class="flex justify-between items-start gap-2">
      <h2 class="text-base font-semibold text-lightest-blue">
        {{ title }}
      </h2>

      <span
        class="text-xs px-2 py-0.5 rounded-full"
        :class="visibility === 'PUBLIC'
          ? 'bg-green-500/20 text-green-300 border border-green-500/40'
          : 'bg-yellow-500/10 text-yellow-200 border border-yellow-500/30'"
      >
        {{ visibility === 'PUBLIC' ? 'Public' : 'Private' }}
      </span>
    </header>

    <p class="mt-2 text-sm text-lightest-blue/80 line-clamp-2">
      {{ previewText || 'No preview available.' }}
    </p>

    <div class="mt-3 flex flex-wrap gap-3 text-xs text-lightest-blue/60">
      <span v-if="sendAt">
        📅 Deliver at: <span class="font-mono">{{ sendAt }}</span>
      </span>
      <span v-if="createdAt">
        🕒 Created: <span class="font-mono">{{ createdAt }}</span>
      </span>
      <span v-if="hasAttachment">
        📎 Attachment included
      </span>
    </div>
  </article>
</template>
