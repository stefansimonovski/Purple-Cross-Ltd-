<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
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

const PAGE_SIZE = 10
const PAGE_SIZES = [10, 20, 50]

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
const currentPage = ref(1)
const pageSize = ref(PAGE_SIZE)
const deleteDialogVisible = ref(false)
const employeePendingDelete = ref<Employee | null>(null)

const departmentOptions = computed(() =>
  [...new Set(props.employees.map((e) => e.department))].sort(),
)

const occupationOptions = computed(() =>
  [...new Set(props.employees.map((e) => e.occupation))].sort(),
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

/** Search, filters, and sort applied before pagination. */
const displayedEmployees = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  const list = props.employees.filter((employee) => {
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

  return [...list].sort((a, b) => {
    const result = compareEmployees(a, b, sortKey.value)
    return sortOrder.value === 'asc' ? result : -result
  })
})

const paginatedEmployees = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return displayedEmployees.value.slice(start, start + pageSize.value)
})

const showPagination = computed(
  () => props.employees.length > 0 && displayedEmployees.value.length > 0,
)

watch([searchQuery, selectedDepartments, selectedOccupations, sortKey, sortOrder], () => {
  currentPage.value = 1
})

watch(
  () => displayedEmployees.value.length,
  (total) => {
    const maxPage = Math.max(1, Math.ceil(total / pageSize.value))
    if (currentPage.value > maxPage) {
      currentPage.value = maxPage
    }
  },
)

function onPageSizeChange(size: number) {
  pageSize.value = size
  currentPage.value = 1
}

function onTableSortChange({
  prop,
  order,
}: {
  prop: string
  order: 'ascending' | 'descending' | null
}) {
  if (!order) {
    sortKey.value = 'fullName'
    sortOrder.value = 'asc'
    return
  }

  const allowed: SortKey[] = [
    'fullName',
    'occupation',
    'department',
    'dateOfEmployment',
    'terminationDate',
  ]
  if (allowed.includes(prop as SortKey)) {
    sortKey.value = prop as SortKey
    sortOrder.value = order === 'ascending' ? 'asc' : 'desc'
  }
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

function clearFilters() {
  selectedDepartments.value = []
  selectedOccupations.value = []
  sortKey.value = 'fullName'
  sortOrder.value = 'asc'
  searchQuery.value = ''
  currentPage.value = 1
}
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

      <div class="employee-table__filters">
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

        <template v-if="isMobile">
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
        </template>

        <el-button text type="primary" @click="clearFilters">Clear filters</el-button>
      </div>
    </div>

    <el-empty
      v-if="employees.length === 0"
      description="No employees in the directory yet"
    />

    <el-empty
      v-else-if="displayedEmployees.length === 0"
      description="No employees match your filters"
    />

    <!-- Mobile card layout -->
    <div v-else-if="isMobile" class="employee-cards">
      <article
        v-for="employee in paginatedEmployees"
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
        :data="paginatedEmployees"
        stripe
        border
        empty-text="No employees found"
        :default-sort="{ prop: sortKey, order: sortOrder === 'asc' ? 'ascending' : 'descending' }"
        style="width: 100%"
        @sort-change="onTableSortChange"
      >
        <el-table-column prop="fullName" label="Full Name" sortable="custom" min-width="180" />
        <el-table-column prop="occupation" label="Occupation" sortable="custom" min-width="160" />
        <el-table-column prop="department" label="Department" sortable="custom" min-width="150" />
        <el-table-column
          prop="dateOfEmployment"
          label="Date of Employment"
          sortable="custom"
          min-width="160"
        >
          <template #default="{ row }">
            {{ employmentStatus(row.dateOfEmployment) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="terminationDate"
          label="Termination Date"
          sortable="custom"
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

    <el-pagination
      v-if="showPagination"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      class="employee-table__pagination"
      :page-sizes="PAGE_SIZES"
      :total="displayedEmployees.length"
      :layout="isMobile ? 'total, prev, pager, next' : 'total, sizes, prev, pager, next'"
      background
      @size-change="onPageSizeChange"
    />

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

.employee-table__filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.employee-table__control {
  width: 180px;
}

.employee-table__scroll {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  background: #fff;
  border-radius: 8px;
}

.employee-table__pagination {
  margin-top: 1rem;
  justify-content: flex-end;
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
  .employee-table__search,
  .employee-table__control {
    width: 100%;
    max-width: none;
  }

  .employee-table__filters {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .employee-table__pagination {
    justify-content: center;
  }
}
</style>
