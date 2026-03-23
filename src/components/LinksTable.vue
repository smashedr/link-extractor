<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { LinkData } from '@/utils/links.ts'

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

onMounted(async () => {
  chrome.storage.local.onChanged.addListener(onChanged)
  const { results } = await chrome.storage.local.get('results')
  console.debug('%cMOUNTED: components/LinksTable.vue:', 'color: Lime', results)
  links.value = results as LinkData[]
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
            <th>Links - {{ links.length }}</th>
            <!--<th>Text</th>-->
            <!--<th>Title</th>-->
            <!--<th>Label</th>-->
            <!--<th>Rel</th>-->
            <!--<th>Target</th>-->
          </tr>
        </thead>
        <tbody id="links-body">
          <tr v-if="links" v-for="link of links">
            <td>{{ link.href }}</td>
            <!--<td>Text</td>-->
            <!--<td>Title</td>-->
            <!--<td>Label</td>-->
            <!--<td>Rel</td>-->
            <!--<td>Target</td>-->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<!--<style scoped></style>-->
