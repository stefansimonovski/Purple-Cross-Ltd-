<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { FormInstance } from 'element-plus'
import type { Employee } from '../types/employee'
import {
  DEPARTMENT_OPTIONS,
  OCCUPATION_OPTIONS,
  createEmployeeSchema,
  emptyEmployeeForm,
  toEmployee,
  type EmployeeFormValues,
} from '../utils/validation'

const props = withDefaults(
  defineProps<{
    initialValues?: Partial<Employee>
    existingCodes?: string[]
    excludeCode?: string
    submitLabel?: string
  }>(),
  {
    existingCodes: () => [],
    submitLabel: 'Save',
  },
)

const emit = defineEmits<{
  submit: [employee: Employee]
  cancel: []
}>()

const formRef = ref<FormInstance>()
const form = reactive<EmployeeFormValues>(emptyEmployeeForm())
const submitError = ref<string | null>(null)

function applyInitialValues() {
  const defaults = emptyEmployeeForm()
  Object.assign(form, defaults, {
    code: props.initialValues?.code ?? defaults.code,
    fullName: props.initialValues?.fullName ?? defaults.fullName,
    occupation: props.initialValues?.occupation ?? defaults.occupation,
    department: props.initialValues?.department ?? defaults.department,
    dateOfEmployment: props.initialValues?.dateOfEmployment ?? defaults.dateOfEmployment,
    terminationDate: props.initialValues?.terminationDate ?? defaults.terminationDate,
  })
}

applyInitialValues()

watch(
  () => props.initialValues,
  () => applyInitialValues(),
  { deep: true },
)

const schema = computed(() =>
  createEmployeeSchema(props.existingCodes, props.excludeCode),
)

async function validateField(
  _rule: unknown,
  value: unknown,
  callback: (error?: Error) => void,
  field: keyof EmployeeFormValues,
) {
  try {
    await schema.value.validateAt(field, { ...form, [field]: value })
    callback()
  } catch (err) {
    callback(err instanceof Error ? err : new Error('Invalid value'))
  }
}

const rules = computed(() => ({
  code: [
    {
      required: true,
      validator: (
        rule: unknown,
        value: unknown,
        callback: (error?: Error) => void,
      ) => validateField(rule, value, callback, 'code'),
      trigger: 'blur',
    },
  ],
  fullName: [
    {
      required: true,
      validator: (
        rule: unknown,
        value: unknown,
        callback: (error?: Error) => void,
      ) => validateField(rule, value, callback, 'fullName'),
      trigger: 'blur',
    },
  ],
  occupation: [
    {
      required: true,
      validator: (
        rule: unknown,
        value: unknown,
        callback: (error?: Error) => void,
      ) => validateField(rule, value, callback, 'occupation'),
      trigger: 'change',
    },
  ],
  department: [
    {
      required: true,
      validator: (
        rule: unknown,
        value: unknown,
        callback: (error?: Error) => void,
      ) => validateField(rule, value, callback, 'department'),
      trigger: 'change',
    },
  ],
  dateOfEmployment: [
    {
      required: true,
      validator: (
        rule: unknown,
        value: unknown,
        callback: (error?: Error) => void,
      ) => validateField(rule, value, callback, 'dateOfEmployment'),
      trigger: 'change',
    },
  ],
  terminationDate: [
    {
      validator: (
        rule: unknown,
        value: unknown,
        callback: (error?: Error) => void,
      ) => validateField(rule, value ?? null, callback, 'terminationDate'),
      trigger: 'change',
    },
  ],
}))

async function onSubmit() {
  submitError.value = null
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch {
    return
  }

  try {
    const values = await schema.value.validate(form, { abortEarly: false })
    emit('submit', toEmployee(values))
  } catch (err) {
    submitError.value = err instanceof Error ? err.message : 'Please fix the form errors'
  }
}

function onCancel() {
  emit('cancel')
}
</script>

<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-position="top"
    class="employee-form"
    @submit.prevent="onSubmit"
  >
    <el-form-item label="Code" prop="code" required>
      <el-input v-model="form.code" placeholder="e.g. EMP051" />
    </el-form-item>

    <el-form-item label="Full Name" prop="fullName" required>
      <el-input v-model="form.fullName" placeholder="Employee full name" />
    </el-form-item>

    <el-form-item label="Occupation" prop="occupation" required>
      <el-select
        v-model="form.occupation"
        filterable
        allow-create
        default-first-option
        placeholder="Select or type occupation"
        style="width: 100%"
      >
        <el-option
          v-for="option in OCCUPATION_OPTIONS"
          :key="option"
          :label="option"
          :value="option"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="Department" prop="department" required>
      <el-select
        v-model="form.department"
        filterable
        allow-create
        default-first-option
        placeholder="Select or type department"
        style="width: 100%"
      >
        <el-option
          v-for="option in DEPARTMENT_OPTIONS"
          :key="option"
          :label="option"
          :value="option"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="Date of Employment" prop="dateOfEmployment" required>
      <el-date-picker
        v-model="form.dateOfEmployment"
        type="date"
        value-format="YYYY-MM-DD"
        placeholder="Select date"
        style="width: 100%"
      />
    </el-form-item>

    <el-form-item label="Termination Date" prop="terminationDate">
      <el-date-picker
        v-model="form.terminationDate"
        type="date"
        value-format="YYYY-MM-DD"
        placeholder="Optional"
        clearable
        style="width: 100%"
      />
    </el-form-item>

    <el-alert
      v-if="submitError"
      :title="submitError"
      type="error"
      show-icon
      :closable="false"
      class="employee-form__error"
    />

    <div class="employee-form__actions">
      <el-button @click="onCancel">Cancel</el-button>
      <el-button type="primary" native-type="submit">{{ submitLabel }}</el-button>
    </div>
  </el-form>
</template>

<style scoped>
.employee-form {
  max-width: 520px;
  width: 100%;
}

.employee-form__error {
  margin-bottom: 1rem;
}

.employee-form__actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

@media (max-width: 480px) {
  .employee-form__actions {
    flex-direction: column-reverse;
  }

  .employee-form__actions :deep(.el-button) {
    width: 100%;
    margin: 0;
  }
}
</style>
