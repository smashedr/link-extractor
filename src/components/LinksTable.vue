<script setup lang="ts">
import { filterLinks, processLinks } from '@/utils/links.ts'
import { useResults } from '@/composables/useResults.ts'
import FilterSelect from '@/components/FilterSelect.vue'

console.debug('%cLOADED: components/LinksTable.vue', 'color: Orange')

const results = useResults()

/*
TODO: Consider making this a composable
  - Update on options change
 */
const links = ref()
watch(
  results,
  async (data) => {
    console.log('%c WATCH RESULTS CHANGE:', 'color: Yellow', data)
    // TODO: Consider setting processed as a ref to use in onChanged
    const processed = await processLinks(data)
    console.debug('processed:', processed)
    links.value = processed
  },
  { deep: true },
)

async function onChange(filter: Filter) {
  console.debug('LinksTable.vue - onChange:', filter)
  console.log('links.value:', links.value)
  if (filter) {
    links.value = await filterLinks(filter, results.value)
    console.log('links.value:', links.value)
  } else {
    links.value = results.value
    console.log('links.value:', links.value)
  }
}
</script>

<template>
  <div>
    <FilterSelect @change="onChange" />
    <div class="table-wrapper">
      <table id="links-table" class="table table-sm table-striped table-hover small w-100">
        <thead class="">
          <tr>
            <th>Links - {{ links?.length || 0 }}</th>
          </tr>
        </thead>
        <tbody id="links-body">
          <tr v-if="links?.length" v-for="link of links">
            <td>{{ link.href }}</td>
          </tr>
          <tr v-else>
            <td class="text-muted fw-bold">No Links Extracted</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<!--<style scoped></style>-->
