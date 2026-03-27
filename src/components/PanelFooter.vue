<script setup lang="ts">
import { i18n } from '#imports'
import OptionsModal from '@/components/OptionsModal.vue'

const closeWindow = () => window.close()
</script>

<template>
  <div class="p-1">
    <div class="d-flex flex-row justify-content-end gap-2">
      <OptionsModal class="btn-sm btn-outline-primary me-auto"
        ><i class="fa-solid fa-toggle-off me-2"></i> {{ i18n.t('ui.action.showOptions') }}</OptionsModal
      >
      <button
        :title="i18n.t('ui.action.close')"
        class="btn btn-sm btn-outline-warning hvr-grow-sm"
        @click="closeWindow()"
      >
        {{ i18n.t('ui.action.close') }} <i class="fa-regular fa-circle-xmark"></i>
      </button>
    </div>
  </div>
</template>

<!--<style scoped></style>-->
