<script setup lang="ts">
import { onMounted } from 'vue'
import { getMsg } from '@/utils/index.ts'
import { useOptions } from '@/composables/useOptions.ts'
import { saveKeyValue, saveOptions } from '@/utils/options.ts'
import { isMobile } from '@/utils/system.ts'
import { Tooltip } from 'bootstrap'
import FormSwitch from '@/components/FormSwitch.vue'

withDefaults(
  defineProps<{
    compact?: boolean
    show?: string[]
  }>(),
  {
    compact: false,
    show: () => ['inputs', 'switches'],
  },
)

const options = useOptions()

const toggleOptions = [
  'removeDuplicates',
  'defaultFilter',
  'saveState',
  'linksTruncate',
  'linksNoWrap',
  'activateLinks',
  'extractSide',
  'contextMenu',
  'showUpdate',
].map((key) => ({
  key,
  label: getMsg(key),
  tooltip: getMsg(key + 'Tip'),
}))
console.log('toggleOptions:', toggleOptions)

onMounted(() => {
  // NOTE: Find a better way to enable tooltips...
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => new Tooltip(el))
})
</script>

<template>
  <form>
    <!-- text inputs -->
    <div v-if="show.includes('inputs')" class="row m-0 g-1">
      <div class="col-12">
        <label for="flags" class="form-label"><i class="fa-solid fa-code me-1"></i> Regex Flags</label>
        <i
          v-if="!isMobile"
          class="fa-solid fa-circle-info ms-2"
          data-bs-toggle="tooltip"
          data-bs-title="Regex Flags."
        ></i>
        <input
          v-model="options.flags"
          @change="saveOptions"
          id="flags"
          aria-describedby="flagsHelp"
          type="text"
          class="form-control"
          autocomplete="off"
        />
        <div class="form-text" :class="{ 'visually-hidden': compact }" id="flagsHelp">Regex Flags for Filtering.</div>
      </div>
    </div>

    <!-- switches -->
    <div v-if="show.includes('switches')" class="row m-0">
      <template v-for="option in toggleOptions" :key="option.key">
        <FormSwitch
          :class="{ 'col-12': true, 'col-sm-6': !compact }"
          :value="(options[option.key] as boolean) || false"
          :name="option.key"
          :label="option.label"
          :tooltip="option.label"
          @save="saveKeyValue"
        />
      </template>

      <!--<div-->
      <!--  v-for="option in toggleOptions"-->
      <!--  :key="option.key"-->
      <!--  :class="{ 'col-sm-6': !compact }"-->
      <!--  class="form-check form-switch col-12"-->
      <!--&gt;-->
      <!--  <input-->
      <!--    v-model="options[option.key]"-->
      <!--    @change="saveOptions"-->
      <!--    :id="option.key"-->
      <!--    class="form-check-input"-->
      <!--    type="checkbox"-->
      <!--    role="switch"-->
      <!--  />-->
      <!--  <label class="form-check-label" :for="option.key">{{ option.label }}</label>-->
      <!--  <i-->
      <!--    v-if="!isMobile"-->
      <!--    class="fa-solid fa-circle-info ms-2"-->
      <!--    data-bs-toggle="tooltip"-->
      <!--    :data-bs-title="option.tooltip"-->
      <!--  ></i>-->
      <!--</div>-->
    </div>
  </form>
</template>

<!--<style scoped></style>-->
