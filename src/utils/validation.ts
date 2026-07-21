import * as yup from 'yup'
import dayjs from 'dayjs'
import type { Employee } from '../types/employee'

export type EmployeeFormValues = {
  code: string
  fullName: string
  occupation: string
  department: string
  dateOfEmployment: string
  terminationDate: string | null
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export function createEmployeeSchema(
  existingCodes: string[],
  excludeCode?: string,
): yup.ObjectSchema<EmployeeFormValues> {
  const taken = new Set(
    existingCodes.filter((code) => code !== excludeCode).map((code) => code.toUpperCase()),
  )

  return yup.object({
    code: yup
      .string()
      .trim()
      .required('Code is required')
      .matches(/^EMP\d{3,}$/i, 'Code must look like EMP001')
      .test('unique-code', 'Code must be unique', (value) => {
        if (!value) return false
        return !taken.has(value.toUpperCase())
      }),
    fullName: yup
      .string()
      .trim()
      .required('Full name is required')
      .min(2, 'Full name must be at least 2 characters'),
    occupation: yup.string().trim().required('Occupation is required'),
    department: yup.string().trim().required('Department is required'),
    dateOfEmployment: yup
      .string()
      .required('Date of employment is required')
      .matches(DATE_PATTERN, 'Enter a valid date'),
    terminationDate: yup
      .string()
      .nullable()
      .defined()
      .test('valid-or-empty', 'Enter a valid date', (value) => {
        if (value === null || value === '') return true
        return DATE_PATTERN.test(value)
      })
      .test(
        'after-employment',
        'Termination date must be after date of employment',
        function (value) {
          if (!value) return true
          const employment = this.parent.dateOfEmployment as string | undefined
          if (!employment || !DATE_PATTERN.test(employment)) return true
          return dayjs(value).isAfter(dayjs(employment), 'day')
        },
      ),
  })
}

export function emptyEmployeeForm(): EmployeeFormValues {
  return {
    code: '',
    fullName: '',
    occupation: '',
    department: '',
    dateOfEmployment: '',
    terminationDate: null,
  }
}

export function toEmployee(values: EmployeeFormValues): Employee {
  return {
    code: values.code.trim().toUpperCase(),
    fullName: values.fullName.trim(),
    occupation: values.occupation.trim(),
    department: values.department.trim(),
    dateOfEmployment: values.dateOfEmployment,
    terminationDate: values.terminationDate || null,
  }
}

export const DEPARTMENT_OPTIONS = [
  'Finance',
  'Human Resources',
  'IT',
  'Logistics',
  'Production',
  'Quality Assurance',
  'Research',
  'Sales',
] as const

export const OCCUPATION_OPTIONS = [
  'Accountant',
  'Chemist',
  'HR Specialist',
  'IT Support',
  'Lab Technician',
  'Pharmacist',
  'Production Supervisor',
  'Sales Executive',
] as const
