import { ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import { STORE_KEY, Filter, getFilters } from '@/utils/filters.ts'

console.debug('%cLOADED: composables/useFilters.ts', 'color: Orange')

export function useFilters(): Ref<Filter[]> {
  const items = ref<Filter[]>([] as Filter[])

  function onChanged(changes: object) {
    console.debug('composables/useFilters.ts: onChanged:', changes)
    for (const [key, { newValue }] of Object.entries(changes)) {
      if (key === STORE_KEY) {
        console.debug('%c newValue:', 'color: SpringGreen', newValue)
        items.value = newValue as Filter[]
      }
    }
  }

  if (!chrome.storage.sync.onChanged.hasListener(onChanged)) {
    chrome.storage.sync.onChanged.addListener(onChanged)
  }

  onMounted(() => {
    getFilters()
      .then((results) => (items.value = results))
      .catch(console.warn)
  })
  onUnmounted(() => {
    chrome.storage.sync.onChanged.removeListener(onChanged)
  })

  return items
}
