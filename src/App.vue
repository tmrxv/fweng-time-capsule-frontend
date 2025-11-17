<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import ErrorModal from './components/organisms/ErrorModal.vue'
</script>

<template>
  <header>
    <nav>
      <div>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
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
