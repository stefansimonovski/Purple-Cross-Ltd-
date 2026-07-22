<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { TableColumnCtx } from 'element-plus'
import type { Employee } from '../types/employee'
import { employmentStatus, terminationStatus } from '../utils/dateLabels'
import { useMediaQuery } from '../composables/useMediaQuery'
import DeleteConfirmDialog from './DeleteConfirmDialog.vue'

type SortKey =
  | 'fullName'
  | 'occupation'
  | 'department'
  | 'dateOfEmployment'
  | 'terminationDate'

const props = defineProps<{
  employees: Employee[]
}>()

const emit = defineEmits<{
  delete: [code: string]
}>()

const router = useRouter()
const isMobile = useMediaQuery('(max-width: 767px)')
const searchQuery = ref('')
const selectedDepartments = ref<string[]>([])
const selectedOccupations = ref<string[]>([])
const sortKey = ref<SortKey>('fullName')
const sortOrder = ref<'asc' | 'desc'>('asc')
const deleteDialogVisible = ref(false)
const employeePendingDelete = ref<Employee | null>(null)

const departmentOptions = computed(() =>
  [...new Set(props.employees.map((e) => e.department))].sort(),
)

const occupationOptions = computed(() =>
  [...new Set(props.employees.map((e) => e.occupation))].sort(),
)

const departmentFilters = computed(() =>
  departmentOptions.value.map((value) => ({ text: value, value })),
)

const occupationFilters = computed(() =>
  occupationOptions.value.map((value) => ({ text: value, value })),
)

const sortOptions: { label: string; value: SortKey }[] = [
  { label: 'Full Name', value: 'fullName' },
  { label: 'Occupation', value: 'occupation' },
  { label: 'Department', value: 'department' },
  { label: 'Date of Employment', value: 'dateOfEmployment' },
  { label: 'Termination Date', value: 'terminationDate' },
]

function compareEmployees(a: Employee, b: Employee, key: SortKey): number {
  if (key === 'dateOfEmployment') {
    return a.dateOfEmployment.localeCompare(b.dateOfEmployment)
  }
  if (key === 'terminationDate') {
    return (a.terminationDate ?? '').localeCompare(b.terminationDate ?? '')
  }
  return a[key].localeCompare(b[key])
}

/** Search + mobile filters + mobile sort (cards). */
const displayedEmployees = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  let list = props.employees.filter((employee) => {
    if (
      query &&
      !employee.fullName.toLowerCase().includes(query) &&
      !employee.code.toLowerCase().includes(query)
    ) {
      return false
    }

    if (
      selectedDepartments.value.length > 0 &&
      !selectedDepartments.value.includes(employee.department)
    ) {
      return false
    }

    if (
      selectedOccupations.value.length > 0 &&
      !selectedOccupations.value.includes(employee.occupation)
    ) {
      return false
    }

    return true
  })

  if (isMobile.value) {
    list = [...list].sort((a, b) => {
      const result = compareEmployees(a, b, sortKey.value)
      return sortOrder.value === 'asc' ? result : -result
    })
  }

  return list
})

/** Desktop table: search only; column filters/sort handled by el-table. */
const tableEmployees = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return props.employees

  return props.employees.filter(
    (employee) =>
      employee.fullName.toLowerCase().includes(query) ||
      employee.code.toLowerCase().includes(query),
  )
})

function filterByDepartment(value: string, row: Employee): boolean {
  return row.department === value
}

function filterByOccupation(value: string, row: Employee): boolean {
  return row.occupation === value
}

function sortByEmploymentDate(a: Employee, b: Employee): number {
  return a.dateOfEmployment.localeCompare(b.dateOfEmployment)
}

function sortByTerminationDate(a: Employee, b: Employee): number {
  return (a.terminationDate ?? '').localeCompare(b.terminationDate ?? '')
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

function clearMobileFilters() {
  selectedDepartments.value = []
  selectedOccupations.value = []
  sortKey.value = 'fullName'
  sortOrder.value = 'asc'
  searchQuery.value = ''
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

      <div v-if="isMobile" class="employee-table__mobile-controls">
        <el-select
          v-model="selectedDepartments"
          multiple
          collapse-tags
          collapse-tags-tooltip
          clearable
          placeholder="Department"
          class="employee-table__control"
        >
          <el-option
            v-for="option in departmentOptions"
            :key="option"
            :label="option"
            :value="option"
          />
        </el-select>

        <el-select
          v-model="selectedOccupations"
          multiple
          collapse-tags
          collapse-tags-tooltip
          clearable
          placeholder="Occupation"
          class="employee-table__control"
        >
          <el-option
            v-for="option in occupationOptions"
            :key="option"
            :label="option"
            :value="option"
          />
        </el-select>

        <el-select
          v-model="sortKey"
          placeholder="Sort by"
          class="employee-table__control"
        >
          <el-option
            v-for="option in sortOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>

        <el-select
          v-model="sortOrder"
          placeholder="Order"
          class="employee-table__control"
        >
          <el-option label="Ascending" value="asc" />
          <el-option label="Descending" value="desc" />
        </el-select>

        <el-button
          class="employee-table__clear"
          text
          type="primary"
          @click="clearMobileFilters"
        >
          Clear filters
        </el-button>
      </div>
    </div>

    <el-empty
      v-if="employees.length === 0"
      description="No employees in the directory yet"
    />

    <el-empty
      v-else-if="isMobile && displayedEmployees.length === 0"
      description="No employees match your filters"
    />

    <el-empty
      v-else-if="!isMobile && tableEmployees.length === 0"
      description="No employees match your search"
    />

    <!-- Mobile card layout -->
    <div v-else-if="isMobile" class="employee-cards">
      <article
        v-for="employee in displayedEmployees"
        :key="employee.code"
        class="employee-card"
      >
        <header class="employee-card__header">
          <div>
            <h2 class="employee-card__name">{{ employee.fullName }}</h2>
            <p class="employee-card__code">{{ employee.code }}</p>
          </div>
        </header>
        <dl class="employee-card__meta">
          <div>
            <dt>Occupation</dt>
            <dd>{{ employee.occupation }}</dd>
          </div>
          <div>
            <dt>Department</dt>
            <dd>{{ employee.department }}</dd>
          </div>
          <div>
            <dt>Employment</dt>
            <dd>{{ employmentStatus(employee.dateOfEmployment) }}</dd>
          </div>
          <div>
            <dt>Termination</dt>
            <dd>{{ terminationStatus(employee.terminationDate) }}</dd>
          </div>
        </dl>
        <div class="employee-card__actions">
          <el-button size="small" @click="viewEmployee(employee.code)">View</el-button>
          <el-button size="small" type="primary" @click="editEmployee(employee.code)">
            Edit
          </el-button>
          <el-button size="small" type="danger" @click="openDeleteDialog(employee)">
            Delete
          </el-button>
        </div>
      </article>
    </div>

    <!-- Desktop / tablet table -->
    <div v-else class="employee-table__scroll">
      <el-table
        :data="tableEmployees"
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
        <el-table-column label="Actions" fixed="right" min-width="220">
          <template #default="{ row }">
            <div class="employee-table__actions">
              <el-button size="small" @click="viewEmployee(row.code)">View</el-button>
              <el-button size="small" type="primary" @click="editEmployee(row.code)">
                Edit
              </el-button>
              <el-button size="small" type="danger" @click="openDeleteDialog(row)">
                Delete
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

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
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.employee-table__search {
  max-width: 320px;
  width: 100%;
}

.employee-table__mobile-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.employee-table__control {
  width: 100%;
}

.employee-table__clear {
  grid-column: 1 / -1;
  justify-self: start;
}

.employee-table__scroll {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  background: #fff;
  border-radius: 8px;
}

.employee-table__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.employee-cards {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.employee-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1rem;
}

.employee-card__header {
  margin-bottom: 0.75rem;
}

.employee-card__name {
  margin: 0;
  font-size: 1.05rem;
}

.employee-card__code {
  margin: 0.15rem 0 0;
  color: #6b7280;
  font-size: 0.8rem;
}

.employee-card__meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.65rem 0.75rem;
  margin: 0 0 0.9rem;
}

.employee-card__meta dt {
  margin: 0;
  color: #9ca3af;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.employee-card__meta dd {
  margin: 0.1rem 0 0;
  font-size: 0.9rem;
}

.employee-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

@media (max-width: 767px) {
  .employee-table__search {
    max-width: none;
  }
}
</style>
