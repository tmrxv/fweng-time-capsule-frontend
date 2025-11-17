<script setup lang="ts">
import ErrorModal from './components/organisms/ErrorModal.vue'
import HeaderNav from './components/organisms/HeaderNav.vue';
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
