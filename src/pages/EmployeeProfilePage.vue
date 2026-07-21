<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEmployeesStore } from '../stores/employees'

const route = useRoute()
const store = useEmployeesStore()

const code = computed(() => String(route.params.code))
const isEdit = computed(() => route.name === 'employee-edit')
const employee = computed(() => store.getByCode(code.value))

onMounted(() => {
  store.fetchEmployees()
})
</script>

<template>
  <section>
    <h1>{{ isEdit ? 'Edit Employee' : 'Employee Profile' }}</h1>
    <p v-if="store.loading">Loading…</p>
    <p v-else-if="!employee">Employee "{{ code }}" not found.</p>
    <div v-else>
      <p><strong>Code:</strong> {{ employee.code }}</p>
      <p><strong>Name:</strong> {{ employee.fullName }}</p>
      <p v-if="isEdit">Edit form</p>
      <p v-else>
        <router-link :to="`/employees/${employee.code}/edit`">Edit</router-link>
      </p>
    </div>
    <router-link to="/">Back to index</router-link>
  </section>
</template>
