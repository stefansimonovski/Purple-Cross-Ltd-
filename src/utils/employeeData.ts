import type { Employee } from '../types/employee'

const REQUIRED_FIELDS: (keyof Employee)[] = [
  'code',
  'fullName',
  'occupation',
  'department',
  'dateOfEmployment',
  'terminationDate',
]

export function isEmployee(value: unknown): value is Employee {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return REQUIRED_FIELDS.every((field) => field in record)
}

export function parseEmployeesJson(raw: unknown): Employee[] {
  if (!Array.isArray(raw)) {
    throw new Error('Import file must contain a JSON array of employees')
  }

  const employees: Employee[] = []
  const seenCodes = new Set<string>()

  raw.forEach((item, index) => {
    if (!isEmployee(item)) {
      throw new Error(`Invalid employee at index ${index}`)
    }

    const code = String(item.code).trim().toUpperCase()
    if (seenCodes.has(code)) {
      throw new Error(`Duplicate code "${code}" in import file`)
    }
    seenCodes.add(code)

    employees.push({
      code,
      fullName: String(item.fullName).trim(),
      occupation: String(item.occupation).trim(),
      department: String(item.department).trim(),
      dateOfEmployment: String(item.dateOfEmployment),
      terminationDate: item.terminationDate ? String(item.terminationDate) : null,
    })
  })

  return employees
}

export function downloadEmployeesJson(employees: Employee[], filename = 'employees.json'): void {
  const blob = new Blob([JSON.stringify(employees, null, 4)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
