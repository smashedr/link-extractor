<script setup lang="ts">
import { getMsg } from '@/utils/index.ts'
import { computed, onMounted, ref } from 'vue'
import { isFirefox, isMobile } from '@/utils/system.ts'
import ToastAlerts from '@/components/ToastAlerts.vue'
import PanelHeader from '@/components/PanelHeader.vue'
import PermsCheck from '@/components/PermsCheck.vue'
import OptionsForm from '@/components/OptionsForm.vue'
import ExtractPanel from '@/components/ExtractPanel.vue'

const tabAccess = ref(true)

const isBrowser = isFirefox ? '360px' : null
const width = computed(() => (isMobile ? '100%' : isBrowser))
console.log('width:', width.value)

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
</script>

<template>
  <div id="popupContainer">
    <PanelHeader :close-window="true" :popup-button="false" />

    <div class="d-grid gap-2 p-2">
      <PermsCheck :close-window="true" />

      <!--Note: Consider moving tabAccess to ExtractPanel-->
      <ExtractPanel v-if="tabAccess" :close-window="true" />
      <div v-else class="text-center text-ellipsis border border-danger border-2 rounded p-1 mb-2">
        {{ getMsg('NoTabAccess') }}.
      </div>

      <OptionsForm :show="['switches']" :compact="true" />
    </div>

    <ToastAlerts />
  </div>
</template>

<style scoped>
#popupContainer {
  width: v-bind(width);
}
</style>
