<script setup lang="ts">
import { ref } from 'vue'
import { processLinkOptions, processLinkFilters } from '@/utils/links.ts'
import { useResults } from '@/composables/useResults.ts'
import FilterSelect from '@/components/FilterSelect.vue'
// import { useOptions } from '@/composables/useOptions.ts'

console.debug('%cLOADED: components/LinksTable.vue', 'color: Orange')

const results = useResults()
// const options = useOptions()

const linksRef = ref()
const filterRef = ref()

// // TODO: INOP: watch options and update on options changes...
// watch(
//   options,
//   async (data) => {
//     console.log('%c WATCH: options:', 'color: Yellow', data)
//   },
//   { deep: true },
// )

watch(
  results,
  async (data) => {
    console.log('%c WATCH: results:', 'color: Yellow', data)
    await processData()
  },
  { deep: true },
)

async function processData() {
  console.debug('processData: filterRef.value:', filterRef.value)

  // Process Options
  const processed = await processLinkOptions(results.value)
  console.debug('processed:', processed)

  // Process Set Filter
  if (filterRef.value) {
    linksRef.value = await processLinkFilters(filterRef.value, processed)
    console.log('linksRef.value:', linksRef.value)
  } else {
    linksRef.value = processed
    console.log('linksRef.value:', linksRef.value)
  }
}

async function onChange(filter: Filter) {
  console.debug('LinksTable.vue - onChange:', filter)
  filterRef.value = filter
  console.debug('filterRef.value:', filterRef.value)
  await processData()
}
</script>

<template>
  <div>
    <FilterSelect @change="onChange" />
    <div class="table-wrapper">
      <table id="links-table" class="table table-sm table-striped table-hover small w-100">
        <thead class="">
          <tr>
            <th>Links - {{ linksRef?.length || 0 }}</th>
          </tr>
        </thead>
        <tbody id="links-body">
          <tr v-if="linksRef?.length" v-for="link of linksRef">
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
