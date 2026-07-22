<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Upload, Download } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useEmployeesStore } from '../stores/employees'
import EmployeeTable from '../components/EmployeeTable.vue'
import { downloadEmployeesJson, parseEmployeesJson } from '../utils/employeeData'

const store = useEmployeesStore()
const router = useRouter()
const fileInputRef = ref<HTMLInputElement | null>(null)
const dataMessage = ref<string | null>(null)

onMounted(async () => {
  await store.fetchEmployees()
})

function onDelete(code: string) {
  store.remove(code)
}

function goToCreate() {
  router.push('/employees/new')
}

function onExport() {
  downloadEmployeesJson(store.employees)
  ElMessage.success('Employee data exported')
}

function onImportClick() {
  fileInputRef.value?.click()
}

async function onImportFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return

  try {
    const text = await file.text()
    const parsed = parseEmployeesJson(JSON.parse(text))

    await ElMessageBox.confirm(
      `Replace the current list with ${parsed.length} employees from "${file.name}"?`,
      'Import employees',
      { type: 'warning', confirmButtonText: 'Import', cancelButtonText: 'Cancel' },
    )

    store.replaceAll(parsed)
    dataMessage.value = null
    ElMessage.success(`Imported ${parsed.length} employees`)
  } catch (err) {
    if (err === 'cancel' || (err as { message?: string })?.message === 'cancel') {
      return
    }
    const message = err instanceof Error ? err.message : 'Failed to import file'
    dataMessage.value = message
    ElMessage.error(message)
  }
}
</script>

<template>
  <section class="index-page">
    <div class="index-page__header">
      <div>
        <h1>Employees</h1>
        <p v-if="!store.loading && !store.error" class="index-page__count">
          {{ store.employees.length }} records
        </p>
      </div>

      <div v-if="!store.loading && !store.error" class="index-page__data-actions">
        <el-button :icon="Download" @click="onExport">Export JSON</el-button>
        <el-button :icon="Upload" @click="onImportClick">Import JSON</el-button>
        <input
          ref="fileInputRef"
          type="file"
          accept="application/json,.json"
          class="index-page__file-input"
          @change="onImportFile"
        />
      </div>
    </div>

    <p v-if="store.loading" class="index-page__status">Loading employees…</p>
    <el-alert
      v-else-if="store.error"
      :title="store.error"
      type="error"
      show-icon
      :closable="false"
    />
    <template v-else>
      <el-alert
        v-if="dataMessage"
        :title="dataMessage"
        type="error"
        show-icon
        :closable="true"
        class="index-page__import-error"
        @close="dataMessage = null"
      />
      <EmployeeTable :employees="store.employees" @delete="onDelete" />
    </template>

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
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.index-page__header h1 {
  margin: 0;
  font-size: clamp(1.25rem, 2.5vw, 1.5rem);
}

.index-page__count {
  margin: 0.2rem 0 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.index-page__data-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.index-page__file-input {
  display: none;
}

.index-page__import-error {
  margin-bottom: 1rem;
}

.index-page__status {
  color: #6b7280;
}

.create-fab {
  position: fixed;
  right: max(16px, env(safe-area-inset-right, 0px));
  bottom: max(16px, env(safe-area-inset-bottom, 0px));
  z-index: 20;
  width: 56px;
  height: 56px;
  box-shadow: 0 4px 14px rgb(0 0 0 / 20%);
}

@media (min-width: 768px) {
  .create-fab {
    right: 24px;
    bottom: 24px;
  }
}

@media (max-width: 767px) {
  .index-page__data-actions {
    width: 100%;
  }

  .index-page__data-actions :deep(.el-button) {
    flex: 1;
  }
}
</style>
