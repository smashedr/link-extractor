<script setup lang="ts">
import { i18n } from '#imports'
import OptionsForm from '@/components/OptionsForm.vue'
import ThemeSwitch from '@/components/ThemeSwitch.vue'

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#optionsModal" v-bind="$attrs">
    <slot />
  </button>

  <div class="modal fade" id="optionsModal" tabindex="-1" aria-labelledby="optionsModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <ThemeSwitch />
          <h5 class="ms-2" id="optionsModalLabel">{{ i18n.t('ui.options') }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <OptionsForm :compact="true" :show="['switches']" :switches="['removeDuplicates', 'defaultFilter']" />
        </div>

        <!--<div class="modal-footer">-->
        <!--  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">-->
        <!--    {{ i18n.t('ui.action.close') }}-->
        <!--  </button>-->
        <!--  <button type="button" class="btn btn-primary">Save changes</button>-->
        <!--</div>-->
      </div>
    </div>
  </div>
</template>

<!--<style scoped></style>-->
