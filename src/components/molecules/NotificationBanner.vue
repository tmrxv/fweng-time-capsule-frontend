<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'info', // 'info' | 'success' | 'error' | 'warning'
  },
  title: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    required: true,
  },
  closable: {
    type: Boolean,
    default: true,
  },
})

const show = true

const emit = defineEmits(['close'])

const typeClasses = {
  info: 'bg-blue-500/10 text-blue-200 border-blue-500/40',
  success: 'bg-green-500/10 text-green-200 border-green-500/40',
  error: 'bg-red-500/10 text-red-200 border-red-500/40',
  warning: 'bg-yellow-500/10 text-yellow-200 border-yellow-500/40',
}
</script>

<template>
  <div
    class="w-full flex items-start gap-3 px-4 py-3 rounded-lg border text-sm"
    :class="typeClasses[type] || typeClasses.info"
  >
    <span class="mt-0.5">
      {{ type === 'success' ? '✔' : type === 'error' ? '✖' : type === 'warning' ? '⚠' : 'ℹ' }}
    </span>

    <div class="flex-1">
      <p v-if="title" class="font-semibold mb-0.5">
        {{ title }}
      </p>
      <p>
        {{ message }}
      </p>
    </div>

    <button
      v-if="closable"
      type="button"
      class="text-xs opacity-70 hover:opacity-100"
      @click="$emit('close')"
    >
      ✕
    </button>
  </div>
</template>
