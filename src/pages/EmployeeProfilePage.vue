<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEmployeesStore } from '../stores/employees'
import EmployeeForm from '../components/EmployeeForm.vue'
import type { Employee } from '../types/employee'
import { employmentStatus, terminationStatus } from '../utils/dateLabels'

const route = useRoute()
const router = useRouter()
const store = useEmployeesStore()
const saveError = ref<string | null>(null)

const code = computed(() => String(route.params.code))
const isEdit = computed(() => route.name === 'employee-edit')
const employee = computed(() => store.getByCode(code.value))
const existingCodes = computed(() => store.employees.map((item) => item.code))
const isReady = computed(() => store.loaded && !store.loading)

onMounted(async () => {
  await store.fetchEmployees()
})

function goToEdit() {
  router.push(`/employees/${code.value}/edit`)
}

function goToView(targetCode = code.value) {
  router.push(`/employees/${targetCode}`)
}

function goHome() {
  router.push('/')
}

function onSubmit(updated: Employee) {
  saveError.value = null
  try {
    store.update(code.value, updated)
    goToView(updated.code)
  } catch (err) {
    saveError.value = err instanceof Error ? err.message : 'Failed to update employee'
  }
}

function onCancel() {
  goToView()
}
</script>

<template>
  <section class="profile-page">
    <div class="profile-page__header">
      <h1>{{ isEdit ? 'Edit Employee' : 'Employee Profile' }}</h1>
      <el-button text type="primary" @click="goHome">Back to employees</el-button>
    </div>

    <p v-if="!isReady">Loading employee…</p>

    <el-alert
      v-else-if="store.error"
      :title="store.error"
      type="error"
      show-icon
      :closable="false"
    />

    <div v-else-if="!employee" class="profile-page__not-found">
      <el-result
        icon="warning"
        title="Employee not found"
        :sub-title="`No employee exists with code “${code}”.`"
      >
        <template #extra>
          <el-button type="primary" @click="goHome">Return to employees</el-button>
        </template>
      </el-result>
    </div>

    <template v-else-if="isEdit">
      <el-alert
        v-if="saveError"
        :title="saveError"
        type="error"
        show-icon
        :closable="false"
        class="profile-page__error"
      />
      <EmployeeForm
        :initial-values="employee"
        :existing-codes="existingCodes"
        :exclude-code="employee.code"
        submit-label="Save"
        @submit="onSubmit"
        @cancel="onCancel"
      />
    </template>

    <div v-else class="profile-page__view">
      <dl class="profile-details">
        <div class="profile-details__row">
          <dt>Code</dt>
          <dd>{{ employee.code }}</dd>
        </div>
        <div class="profile-details__row">
          <dt>Full Name</dt>
          <dd>{{ employee.fullName }}</dd>
        </div>
        <div class="profile-details__row">
          <dt>Occupation</dt>
          <dd>{{ employee.occupation }}</dd>
        </div>
        <div class="profile-details__row">
          <dt>Department</dt>
          <dd>{{ employee.department }}</dd>
        </div>
        <div class="profile-details__row">
          <dt>Date of Employment</dt>
          <dd>
            <span>{{ employmentStatus(employee.dateOfEmployment) }}</span>
            <span class="profile-details__meta">{{ employee.dateOfEmployment }}</span>
          </dd>
        </div>
        <div class="profile-details__row">
          <dt>Termination Date</dt>
          <dd>
            <span>{{ terminationStatus(employee.terminationDate) }}</span>
            <span v-if="employee.terminationDate" class="profile-details__meta">
              {{ employee.terminationDate }}
            </span>
          </dd>
        </div>
      </dl>

      <div class="profile-page__actions">
        <el-button type="primary" @click="goToEdit">Edit</el-button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.profile-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.profile-page__header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.profile-page__error {
  margin-bottom: 1rem;
  max-width: 520px;
}

.profile-details {
  margin: 0;
  max-width: 560px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.25rem 1.25rem;
}

.profile-details__row {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 1rem;
  padding: 0.9rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.profile-details__row:last-child {
  border-bottom: none;
}

.profile-details__row dt {
  margin: 0;
  color: #6b7280;
  font-weight: 500;
}

.profile-details__row dd {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.profile-details__meta {
  color: #9ca3af;
  font-size: 0.85rem;
}

.profile-page__actions {
  margin-top: 1.25rem;
}

@media (max-width: 600px) {
  .profile-details__row {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }
}
</style>
