import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Employee } from '../types/employee'

export const useEmployeesStore = defineStore('employees', () => {
  const employees = ref<Employee[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const loaded = ref(false)

  async function fetchEmployees(): Promise<void> {
    if (loaded.value) return

    loading.value = true
    error.value = null

    try {
      const response = await fetch('/data/employees.json')
      if (!response.ok) {
        throw new Error(`Failed to load employees (${response.status})`)
      }

      const data = (await response.json()) as Employee[]
      employees.value = data
      loaded.value = true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error loading employees'
      throw err
    } finally {
      loading.value = false
    }
  }

  function getByCode(code: string): Employee | undefined {
    return employees.value.find((employee) => employee.code === code)
  }

  function create(employee: Employee): void {
    if (getByCode(employee.code)) {
      throw new Error(`Employee code "${employee.code}" already exists`)
    }
    employees.value.push({ ...employee })
  }

  function update(code: string, patch: Partial<Employee>): void {
    const index = employees.value.findIndex((employee) => employee.code === code)
    if (index === -1) {
      throw new Error(`Employee "${code}" not found`)
    }

    const newCode = patch.code ?? code
    if (newCode !== code && getByCode(newCode)) {
      throw new Error(`Employee code "${newCode}" already exists`)
    }

    employees.value[index] = {
      ...employees.value[index],
      ...patch,
    }
  }

  function remove(code: string): void {
    const index = employees.value.findIndex((employee) => employee.code === code)
    if (index === -1) {
      throw new Error(`Employee "${code}" not found`)
    }
    employees.value.splice(index, 1)
  }

  return {
    employees,
    loading,
    error,
    loaded,
    fetchEmployees,
    getByCode,
    create,
    update,
    remove,
  }
})
