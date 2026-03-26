<script setup lang="ts">
import { processLinkOptions, processLinkFilters } from '@/utils/links.ts'
import { useResults } from '@/composables/useResults.ts'
import FilterSelect from '@/components/FilterSelect.vue'

console.debug('%cLOADED: components/LinksTable.vue', 'color: Orange')

const results = useResults()

const links = ref()

// TODO: watch options and update on options changes...

watch(
  results,
  async (data) => {
    console.log('%c RESULTS WATCH:', 'color: Yellow', data)
    // TODO: Consider setting processed as a ref to use in onChanged
    const processed = await processLinkOptions(data)
    console.debug('processed:', processed)
    links.value = processed
  },
  { deep: true },
)

// TODO: This needs to be a ref and applied in the watcher above
async function onChange(filter: Filter) {
  console.debug('LinksTable.vue - onChange:', filter)
  console.log('links.value:', links.value)

  const processed = await processLinkOptions(results.value)
  console.debug('processed:', processed)

  if (filter) {
    links.value = await processLinkFilters(filter, processed)
    console.log('links.value:', links.value)
  } else {
    links.value = processed
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
