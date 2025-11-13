<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
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
</template>

<style scoped></style>
