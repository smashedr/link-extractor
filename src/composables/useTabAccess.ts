// useTabAccess.ts
import { ref, onMounted } from 'vue'

// TODO: Overhaul - Old Composable

export function useTabAccess() {
  const tabAccess = ref(true)

  async function checkTab(): Promise<boolean> {
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true })
    console.log('tab:', tab)
    if (!tab.id) return false
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        injectImmediately: true,
        func: () => true,
      })
      console.log('results:', results)
      return results[0]?.result === true
    } catch (e) {
      if (e instanceof Error) console.log(e.message)
      return false
    }
  }

  onMounted(async () => {
    console.log('window.location.href:', window.location.href)
    const result = await checkTab()
    console.log(`%c checkTab: ${result}`, `color: ${result ? 'Lime' : 'Red'}`)
    tabAccess.value = result
  })

  // return { tabAccess, checkTab }
  return tabAccess
}
