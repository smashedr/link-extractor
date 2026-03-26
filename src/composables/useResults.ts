import { ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import { LinkData } from '@/utils/links.ts'

console.debug('%cLOADED: composables/useResults.ts', 'color: Orange')

const STORE_KEY = 'results'

export async function setResults(links: LinkData[]) {
  console.debug('composables/useResults.ts: setResults')
  await chrome.storage.local.set({ [STORE_KEY]: links })
}

export async function getResults(): Promise<LinkData[]> {
  console.debug('composables/useResults.ts: getResults')
  const { results } = await chrome.storage.local.get(STORE_KEY)
  console.debug('results:', results)
  const links = (results || []) as LinkData[]
  console.debug('links:', links)
  return links
}

export function useResults(): Ref<LinkData[]> {
  const items = ref<LinkData[]>([] as LinkData[])

  function onChanged(changes: object) {
    console.debug('composables/useResults.ts - onChanged:', changes)
    for (const [key, { newValue }] of Object.entries(changes)) {
      if (key === STORE_KEY) {
        console.debug('%c newValue:', 'color: SpringGreen', newValue)
        items.value = newValue as LinkData[]
      }
    }
  }

  if (!chrome.storage.local.onChanged.hasListener(onChanged)) {
    chrome.storage.local.onChanged.addListener(onChanged)
  }

  onMounted(() => {
    getResults()
      .then((results) => (items.value = results))
      .catch(console.warn)
  })
  onUnmounted(() => {
    chrome.storage.local.onChanged.removeListener(onChanged)
  })

  return items
}
