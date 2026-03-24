<script setup lang="ts">
import { onMounted } from 'vue'
import { debounce } from '@/utils'
import { useTitle } from '@/composables/useTitle.ts'
import ToastAlerts from '@/components/ToastAlerts.vue'
import BackToTop from '@/components/BackToTop.vue'
import PanelHeader from '@/components/PanelHeader.vue'
import PanelFooter from '@/components/PanelFooter.vue'
import PermsCheck from '@/components/PermsCheck.vue'
import ExtractPanel from '@/components/ExtractPanel.vue'
import LinksTable from '@/components/LinksTable.vue'

async function windowResize() {
  const size = { panelWidth: window.outerWidth, panelHeight: window.outerHeight }
  console.debug('windowResize:', size)
  await chrome.storage.local.set(size).catch(console.warn)
}

onMounted(() => {
  window.addEventListener('resize', debounce(windowResize))

  chrome.windows.getCurrent().then((window) => {
    chrome.storage.local.set({ lastPanelID: window.id }).then(() => {
      console.debug(`%c Set lastPanelID: ${window.id}`, 'color: Aqua')
    })
  })
})

useTitle('Panel')
</script>

<template>
  <header class="flex-shrink-0">
    <PanelHeader :panel-button="false" :side-button="false" :popup-button="false" />
    <ExtractPanel class="p-1" />
  </header>

  <main class="flex-grow-1 overflow-auto p-1">
    <div class="d-grid gap-2">
      <PermsCheck />
      <LinksTable />
    </div>
  </main>

  <footer class="flex-shrink-0">
    <!--<OptionsForm :show="['inputs']" :compact="true" class="p-2" />-->
    <PanelFooter />
  </footer>

  <ToastAlerts />
  <BackToTop />
</template>

<!--<style scoped></style>-->
