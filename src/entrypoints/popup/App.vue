<script setup lang="ts">
import { i18n } from '#imports'
import { computed } from 'vue'
import { isFirefox, isMobile } from '@/utils/system.ts'
import { useTabAccess } from '@/composables/useTabAccess.ts'
import ToastAlerts from '@/components/ToastAlerts.vue'
import PanelHeader from '@/components/PanelHeader.vue'
import PermsCheck from '@/components/PermsCheck.vue'
import OptionsForm from '@/components/OptionsForm.vue'
import ExtractPanel from '@/components/ExtractPanel.vue'
import ExtractText from '@/components/ExtractText.vue'

const tabAccess = useTabAccess()

const isBrowser = isFirefox ? '360px' : null
const width = computed(() => (isMobile ? '100%' : isBrowser))
console.log('width:', width.value)
</script>

<template>
  <div id="popupContainer">
    <PanelHeader :close-window="true" :popup-button="false" />

    <div class="d-grid gap-2 p-2">
      <PermsCheck :close-window="true" />

      <!--Note: Consider moving tabAccess to ExtractPanel-->
      <ExtractPanel v-if="tabAccess" :close-window="true" />

      <div v-else class="text-center text-ellipsis border border-danger border-2 rounded p-1">
        {{ i18n.t('ui.noTabAccess') }}.
      </div>
      <!--<hr class="my-0" />-->
      <ExtractText />

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
