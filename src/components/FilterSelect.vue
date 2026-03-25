<script setup lang="ts">
import { fmtFilterName, useFilters } from '@/composables/useFilters.ts'
import { Filter } from '@/utils/filters.ts'

const emit = defineEmits(['change'])

const filters = useFilters()

const selectedFilter = ref<Filter | null>(null)

function onChange(e: Event) {
  console.log('FilterSelect.vue - onChange:', e)
  // TODO: Confirm using :value="filter" is not a performance hit...
  console.log('selectedFilter:', selectedFilter)
  emit('change', selectedFilter.value)
}
</script>

<template>
  <select v-model="selectedFilter" @change="onChange" class="form-select">
    <option :value="null">Choose a Filter</option>
    <option v-for="filter in filters" :key="filter.id" :value="filter">
      {{ fmtFilterName(filter) }}
    </option>
  </select>
</template>

<!--<style scoped></style>-->
