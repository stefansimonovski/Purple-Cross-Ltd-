<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

function goHome() {
  if (route.path !== '/') {
    router.push('/')
  }
}
</script>

<template>
  <header class="app-nav">
    <div class="app-nav__inner">
      <button type="button" class="app-nav__brand" @click="goHome">
        <span class="app-nav__mark" aria-hidden="true">+</span>
        <span class="app-nav__text">
          <span class="app-nav__name">Purple Cross Ltd</span>
          <span class="app-nav__module">Employee Management</span>
        </span>
      </button>

      <div class="app-nav__user" title="Signed in">
        <span class="app-nav__avatar" aria-hidden="true">AS</span>
        <span class="app-nav__user-meta">
          <span class="app-nav__user-name">Alex Sterling</span>
          <span class="app-nav__user-role">HR Administrator</span>
        </span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-nav {
  position: sticky;
  top: 0;
  z-index: 30;
  background: #1a2332;
  color: #f8fafc;
  box-shadow: 0 1px 0 rgb(0 0 0 / 12%);
}

.app-nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.75rem 1.25rem;
}

.app-nav__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-align: left;
}

.app-nav__mark {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  background: #7a3e5c;
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1;
}

.app-nav__text {
  display: flex;
  flex-direction: column;
  gap: 0.05rem;
}

.app-nav__name {
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.app-nav__module {
  font-size: 0.75rem;
  color: #94a3b8;
}

.app-nav__user {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-width: 0;
}

.app-nav__avatar {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  background: #334155;
  color: #e2e8f0;
  font-size: 0.75rem;
  font-weight: 700;
}

.app-nav__user-meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.app-nav__user-name {
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-nav__user-role {
  font-size: 0.7rem;
  color: #94a3b8;
}

@media (max-width: 480px) {
  .app-nav__module,
  .app-nav__user-meta {
    display: none;
  }
}
</style>
