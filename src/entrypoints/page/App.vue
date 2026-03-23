<script setup lang="ts">
import { useTitle } from '@/composables/useTitle.ts'
import ToastAlerts from '@/components/ToastAlerts.vue'
import BackToTop from '@/components/BackToTop.vue'
import PanelHeader from '@/components/PanelHeader.vue'
import PageFooter from '@/components/PageFooter.vue'
import OptionsOffscreen from '@/components/OptionsOffscreen.vue'
import LinksTable from '@/components/LinksTable.vue'

useTitle('Results Page')
</script>

<template>
  <header class="flex-shrink-0">
    <PanelHeader :page-button="false" />
  </header>

  <main class="flex-grow-1 overflow-auto">
    <div class="container-fluid h-100">
      <h1>Results Page</h1>
      <LinksTable />
    </div>
  </main>

  <footer class="flex-shrink-0">
    <hr class="my-0" />
    <PageFooter class="m-3" />
  </footer>

  <OptionsOffscreen />

  <ToastAlerts />
  <BackToTop />
</template>

<!--<style scoped></style>-->
