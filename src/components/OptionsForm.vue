<script setup lang="ts">
import { onMounted } from 'vue'
import { getMsg } from '@/utils/index.ts'
import { useOptions } from '@/composables/useOptions.ts'
import { saveOptions } from '@/utils/options.ts'
import { isMobile } from '@/utils/system.ts'
import { Tooltip } from 'bootstrap'

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
    <div v-if="show.includes('inputs')" class="row m-0 mb-2 g-1">
      <!--<div :class="compact ? 'col-12 col-sm-6' : 'col-12 col-sm-8'">-->
      <div class="col-12">
        <label for="testInput" class="form-label"><i class="fa-solid fa-code me-1"></i> Regex Flags</label>
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
      <!--<div :class="compact ? 'col-12 col-sm-6' : 'col-12 col-sm-4'">-->
      <!--  <label for="testNumber" class="form-label"><i class="fa-solid fa-hashtag me-1"></i> Number</label>-->
      <!--  <i-->
      <!--    v-if="!isMobile"-->
      <!--    class="fa-solid fa-circle-info ms-2"-->
      <!--    data-bs-toggle="tooltip"-->
      <!--    data-bs-title="Example Number Input."-->
      <!--  ></i>-->
      <!--  <input-->
      <!--    v-model="options.testNumber"-->
      <!--    @change="saveOptions"-->
      <!--    id="testNumber"-->
      <!--    aria-describedby="testNumberHelp"-->
      <!--    type="number"-->
      <!--    step="5"-->
      <!--    min="5"-->
      <!--    max="360"-->
      <!--    class="form-control"-->
      <!--    autocomplete="off"-->
      <!--    placeholder="Minutes"-->
      <!--  />-->
      <!--  <div class="form-text" :class="{ 'visually-hidden': compact }" id="testNumberHelp">A number 5-360.</div>-->
      <!--</div>-->
    </div>

    <!-- switches -->
    <div v-if="show.includes('switches')" class="mb-2">
      <div v-for="option in toggleOptions" :key="option.key" class="form-check form-switch">
        <input
          v-model="options[option.key]"
          @change="saveOptions"
          :id="option.key"
          class="form-check-input"
          type="checkbox"
          role="switch"
        />
        <label class="form-check-label" :for="option.key">{{ option.label }}</label>
        <i
          v-if="!isMobile"
          class="fa-solid fa-circle-info ms-2"
          data-bs-toggle="tooltip"
          :data-bs-title="option.tooltip"
        ></i>
      </div>
    </div>
  </form>
</template>

<!--<style scoped></style>-->
