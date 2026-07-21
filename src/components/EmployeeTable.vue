<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { TableColumnCtx } from 'element-plus'
import type { Employee } from '../types/employee'
import { employmentStatus, terminationStatus } from '../utils/dateLabels'
import DeleteConfirmDialog from './DeleteConfirmDialog.vue'

const props = defineProps<{
  employees: Employee[]
}>()

const emit = defineEmits<{
  delete: [code: string]
}>()

const router = useRouter()
const searchQuery = ref('')
const deleteDialogVisible = ref(false)
const employeePendingDelete = ref<Employee | null>(null)

const filteredEmployees = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return props.employees

  return props.employees.filter(
    (employee) =>
      employee.fullName.toLowerCase().includes(query) ||
      employee.code.toLowerCase().includes(query),
  )
})

const departmentFilters = computed(() =>
  [...new Set(props.employees.map((e) => e.department))]
    .sort()
    .map((value) => ({ text: value, value })),
)

const occupationFilters = computed(() =>
  [...new Set(props.employees.map((e) => e.occupation))]
    .sort()
    .map((value) => ({ text: value, value })),
)

function filterByDepartment(
  value: string,
  row: Employee,
): boolean {
  return row.department === value
}

function filterByOccupation(
  value: string,
  row: Employee,
): boolean {
  return row.occupation === value
}

function sortByEmploymentDate(
  a: Employee,
  b: Employee,
): number {
  return a.dateOfEmployment.localeCompare(b.dateOfEmployment)
}

function sortByTerminationDate(
  a: Employee,
  b: Employee,
): number {
  const aDate = a.terminationDate ?? ''
  const bDate = b.terminationDate ?? ''
  return aDate.localeCompare(bDate)
}

function viewEmployee(code: string) {
  router.push(`/employees/${code}`)
}

function editEmployee(code: string) {
  router.push(`/employees/${code}/edit`)
}

function openDeleteDialog(employee: Employee) {
  employeePendingDelete.value = employee
  deleteDialogVisible.value = true
}

function confirmDelete() {
  if (!employeePendingDelete.value) return
  emit('delete', employeePendingDelete.value.code)
  employeePendingDelete.value = null
}

type FilterHandler = TableColumnCtx<Employee>['filterMethod']
const departmentFilterMethod = filterByDepartment as FilterHandler
const occupationFilterMethod = filterByOccupation as FilterHandler
</script>

<template>
  <div class="employee-table">
    <div class="employee-table__toolbar">
      <el-input
        v-model="searchQuery"
        clearable
        placeholder="Search by name or code"
        class="employee-table__search"
      />
    </div>

    <el-table
      :data="filteredEmployees"
      stripe
      border
      empty-text="No employees found"
      style="width: 100%"
    >
      <el-table-column
        prop="fullName"
        label="Full Name"
        sortable
        min-width="180"
      />
      <el-table-column
        prop="occupation"
        label="Occupation"
        sortable
        min-width="160"
        column-key="occupation"
        :filters="occupationFilters"
        :filter-method="occupationFilterMethod"
      />
      <el-table-column
        prop="department"
        label="Department"
        sortable
        min-width="150"
        column-key="department"
        :filters="departmentFilters"
        :filter-method="departmentFilterMethod"
      />
      <el-table-column
        label="Date of Employment"
        sortable
        :sort-method="sortByEmploymentDate"
        min-width="160"
      >
        <template #default="{ row }">
          {{ employmentStatus(row.dateOfEmployment) }}
        </template>
      </el-table-column>
      <el-table-column
        label="Termination Date"
        sortable
        :sort-method="sortByTerminationDate"
        min-width="150"
      >
        <template #default="{ row }">
          {{ terminationStatus(row.terminationDate) }}
        </template>
      </el-table-column>
      <el-table-column label="Actions" fixed="right" width="240">
        <template #default="{ row }">
          <el-button size="small" @click="viewEmployee(row.code)">View</el-button>
          <el-button size="small" type="primary" @click="editEmployee(row.code)">
            Edit
          </el-button>
          <el-button size="small" type="danger" @click="openDeleteDialog(row)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <DeleteConfirmDialog
      v-model="deleteDialogVisible"
      :employee-name="employeePendingDelete?.fullName"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
.employee-table__toolbar {
  margin-bottom: 1rem;
}

.employee-table__search {
  max-width: 320px;
}
</style>
