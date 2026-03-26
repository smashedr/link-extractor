import { ref, watch, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import type { Options } from '@/utils/options.ts'

console.debug('%cLOADED: composables/useOptions.ts', 'color: Orange')

export function useOptions(): Ref<Options> {
  const options = ref<Options>({} as Options)

  const listener = async () => (options.value = await getOptions())

  if (!chrome.storage.onChanged.hasListener(listener)) {
    chrome.storage.onChanged.addListener(listener)
  }

  onMounted(() => getOptions().then((results) => (options.value = results)))
  onUnmounted(() => chrome.storage.onChanged.removeListener(listener))

  return options
}

export function watchOptions(
  options: Ref<Options>,
  keys: (keyof Options)[],
  callback: (options: Options) => void,
): () => void {
  const prev = new Map<keyof Options, unknown>()
  let initialized = false

  const stop = watch(
    options,
    (current) => {
      if (!initialized) {
        keys.forEach((key) => prev.set(key, current[key]))
        initialized = true
        return
      }

      const hasChanged = keys.some((key) => current[key] !== prev.get(key))

      if (hasChanged) {
        keys.forEach((key) => prev.set(key, current[key]))
        callback(current)
      }
    },
    { deep: true },
  )

  return stop
}
