<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ErrorModal from './components/organisms/ErrorModal.vue'
import HeaderNav from './components/organisms/HeaderNav.vue'

const auth = useAuthStore()

onMounted(() => {
  auth.init()
})
</script>


<template>
  <header>
    <nav>
      <div>
        <HeaderNav />
      </div>
    </nav>
  </header>
  <main>
    <RouterView />
  </main>
  <footer></footer>
  <ErrorModal />
</template>

<style scoped></style>
