<script setup lang="ts">
import { ref } from 'vue'
import { processLinkOptions, processLinkFilters } from '@/utils/links.ts'
import { useResults } from '@/composables/useResults.ts'
import { watchOptions, useOptions } from '@/composables/useOptions.ts'
import FilterSelect from '@/components/FilterSelect.vue'

console.debug('%cLOADED: components/LinksTable.vue', 'color: Orange')

const results = useResults()
const options = useOptions()

const linksRef = ref()
const filterRef = ref()

watchOptions(options, ['removeDuplicates', 'defaultFilter'], async (newOptions: Options) => {
  console.log('%c watchOptions:', 'color: Yellow', newOptions)
  await processData()
})

watch(
  results,
  async (data) => {
    console.log('%c watch: results:', 'color: Yellow', data)
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

// TODO: Add method to pass and set filterRef onMounted
</script>

<template>
  <div>
    <!-- TODO: Make FilterSelect work outside of LinksTable -->
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
