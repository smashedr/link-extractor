<script setup lang="ts">
import { i18n } from '#imports'
import { onMounted } from 'vue'
import { useOptions } from '@/composables/useOptions.ts'
import { saveKeyValue, saveOptions } from '@/utils/options.ts'
import { isMobile } from '@/utils/system.ts'
import { Tooltip } from 'bootstrap'
import FormSwitch from '@/components/FormSwitch.vue'

const props = withDefaults(
  defineProps<{
    compact?: boolean
    show?: string[]
    switches?: string[]
  }>(),
  {
    compact: false,
    show: () => ['inputs', 'switches'],
    switches: () => [],
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
  label: i18n.t(`option.toggle.${key}` as any),
  tooltip: i18n.t(`option.toggle.${key}Tip` as any),
}))
console.log('toggleOptions:', toggleOptions)

const visibleToggles = computed(() =>
  props.switches.length ? toggleOptions.filter((o) => props.switches.includes(o.key)) : toggleOptions,
)
console.log('visibleToggles:', visibleToggles)

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
      <template v-for="option in visibleToggles" :key="option.key">
        <FormSwitch
          :class="{ 'col-12': true, 'col-sm-6': !compact }"
          :value="(options[option.key] as boolean) || false"
          :name="option.key"
          :label="option.label"
          :tooltip="option.label"
          @save="saveKeyValue"
        />
      </template>
    </div>
  </form>
</template>

<!--<style scoped></style>-->
