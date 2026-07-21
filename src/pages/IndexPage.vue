<script setup lang="ts">
import { onMounted } from 'vue'
import { useEmployeesStore } from '../stores/employees'

const store = useEmployeesStore()

onMounted(() => {
  store.fetchEmployees()
})
</script>

<template>
  <section>
    <h1>Employees</h1>
    <p v-if="store.loading">Loading…</p>
    <p v-else-if="store.error">{{ store.error }}</p>
    <p v-else>Loaded {{ store.employees.length }} employees</p>
    <router-link to="/employees/new">Create employee</router-link>
  </section>
</template>
