<script setup>
import { ref, watchEffect } from 'vue'
import { Sun, Moon } from 'lucide-vue-next'

const isDark = ref(false)

function toggleDarkMode() {
  isDark.value = !isDark.value
}

// Apply/remove .dark class on html
watchEffect(() => {
  document.documentElement.classList.toggle('dark', isDark.value)
})
</script>

<template>
  <button
    @click="toggleDarkMode"
    class="relative flex items-center justify-center w-10 h-10 rounded-full bg-medium-dark-blue text-lighter-blue dark:bg-dark text-lightest-blue hover:scale-110 hover:shadow-glow transition-transform duration-200"
    aria-label="Toggle dark mode"
    title="Toggle dark mode"
  >
    <Transition name="fade" mode="out-in">
      <component :is="isDark ? Moon : Sun" :key="isDark ? 'moon' : 'sun'" class="w-6 h-6" />
    </Transition>
  </button>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* optional neon glow effect */
.shadow-glow {
  box-shadow: 0 0 8px 2px rgba(91, 192, 190, 0.6); /* lighter-blue glow */
}
</style>
