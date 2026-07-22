<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useEmployeesStore } from '../stores/employees'
import EmployeeForm from '../components/EmployeeForm.vue'
import type { Employee } from '../types/employee'

const store = useEmployeesStore()
const router = useRouter()
const saveError = ref<string | null>(null)

const existingCodes = computed(() => store.employees.map((employee) => employee.code))

onMounted(async () => {
  await store.fetchEmployees()
})

function onSubmit(employee: Employee) {
  saveError.value = null
  try {
    store.create(employee)
    router.push('/')
  } catch (err) {
    saveError.value = err instanceof Error ? err.message : 'Failed to create employee'
  }
}

function onCancel() {
  router.push('/')
}
</script>

<template>
  <section class="create-page">
    <h1>Create Employee</h1>
    <p class="create-page__hint">Fill in the employee details and save to add them to the list.</p>

    <el-alert
      v-if="saveError"
      :title="saveError"
      type="error"
      show-icon
      :closable="false"
      class="create-page__error"
    />

    <EmployeeForm
      :existing-codes="existingCodes"
      submit-label="Save"
      @submit="onSubmit"
      @cancel="onCancel"
    />
  </section>
</template>

<style scoped>
.create-page h1 {
  margin: 0 0 0.35rem;
  font-size: clamp(1.25rem, 2.5vw, 1.5rem);
}

.create-page__hint {
  margin: 0 0 1.25rem;
  color: #6b7280;
}

.create-page__error {
  margin-bottom: 1rem;
  max-width: 520px;
}
</style>
