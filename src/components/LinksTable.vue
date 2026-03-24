<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { LinkData, processLinks } from '@/utils/links.ts'

console.debug('%cLOADED: components/LinksTable.vue', 'color: Orange')

const links = ref<LinkData[]>([])

function onChanged(changes: object) {
  console.debug('components/LinksTable.vue: onChanged:', changes)
  for (const [key, { newValue }] of Object.entries(changes)) {
    if (key === 'results') {
      console.debug('%c newValue:', 'color: SpringGreen', newValue)
      links.value = newValue as LinkData[]
    }
  }
}

// NOTE: Make a useResults.ts composable or a reusable function...
onMounted(async () => {
  chrome.storage.local.onChanged.addListener(onChanged)
  const { results } = await chrome.storage.local.get('results')
  console.debug('%cMOUNTED: components/LinksTable.vue:', 'color: Lime')
  const linkData = (results || []) as LinkData[]
  console.debug('linkData:', linkData)
  const processed = await processLinks(linkData)
  console.debug('processed:', processed)
  links.value = processed
})
onUnmounted(() => {
  chrome.storage.local.onChanged.removeListener(onChanged)
})
</script>

<template>
  <div>
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
