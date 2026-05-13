<script setup lang="ts">
import { saveKeyValue } from '@/utils/options.ts'
import { useOptions } from '@/composables/useOptions.ts'
import { isMobile } from '@/utils/system.ts'
import FormSwitch from '@/components/FormSwitch.vue'

withDefaults(
  defineProps<{
    compact?: boolean
    show?: string[]
    switches?: string[]
  }>(),
  {
    compact: false,
    show: () => ['inputs', 'switches'],
    switches: () => [
      'removeDuplicates',
      'defaultFilter',
      'saveState',
      'linksTruncate',
      'linksNoWrap',
      'activateLinks',
      'extractSide',
      'contextMenu',
      'showUpdate',
    ],
  },
)

const options = useOptions()
</script>

<template>
  <form>
    <!-- text inputs -->
    <div v-if="show.includes('inputs')" class="row m-0 g-1 mb-2">
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
          @change="saveKeyValue('flags', options.flags)"
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
      <template v-for="id in switches" :key="id">
        <FormSwitch :id="id" v-model="options[id]" />
      </template>
    </div>
  </form>
</template>
