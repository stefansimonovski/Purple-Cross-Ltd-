<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
  employeeName?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

function onCancel() {
  visible.value = false
}

function onConfirm() {
  emit('confirm')
  visible.value = false
}
</script>

<template>
  <el-dialog
    v-model="visible"
    title="Delete employee"
    width="420px"
    :close-on-click-modal="false"
  >
    <p>
      Are you sure you want to delete
      <strong>{{ employeeName ?? 'this employee' }}</strong>?
      This action cannot be undone.
    </p>
    <template #footer>
      <el-button @click="onCancel">Cancel</el-button>
      <el-button type="danger" @click="onConfirm">Delete</el-button>
    </template>
  </el-dialog>
</template>
