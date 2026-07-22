<script setup lang="ts">
import AppNav from './components/AppNav.vue'
</script>

<template>
  <div class="app-shell">
    <AppNav />
    <main class="app-main">
      <div class="app-main__inner">
        <router-view />
      </div>
    </main>
  </div>
</template>
