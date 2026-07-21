<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'
import { useEmployeesStore } from '../stores/employees'
import EmployeeTable from '../components/EmployeeTable.vue'

const store = useEmployeesStore()
const router = useRouter()

onMounted(async () => {
  await store.fetchEmployees()
})

function onDelete(code: string) {
  store.remove(code)
}

function goToCreate() {
  router.push('/employees/new')
}
</script>

<template>
  <section class="index-page">
    <div class="index-page__header">
      <h1>Employees</h1>
      <p v-if="!store.loading && !store.error" class="index-page__count">
        {{ store.employees.length }} records
      </p>
    </div>

    <p v-if="store.loading">Loading employees…</p>
    <el-alert
      v-else-if="store.error"
      :title="store.error"
      type="error"
      show-icon
      :closable="false"
    />
    <EmployeeTable
      v-else
      :employees="store.employees"
      @delete="onDelete"
    />

    <el-button
      class="create-fab"
      type="primary"
      circle
      size="large"
      :icon="Plus"
      title="Create employee"
      aria-label="Create employee"
      @click="goToCreate"
    />
  </section>
</template>

<style scoped>
.index-page__header {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.index-page__header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.index-page__count {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.create-fab {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 20;
  width: 56px;
  height: 56px;
  box-shadow: 0 4px 14px rgb(0 0 0 / 20%);
}
</style>
