<script setup lang="ts">
import { getMsg } from '@/utils/index.ts'
import { extractTabs } from '@/utils/links.ts'
import { openPage, openSidePanel } from '@/utils/extension.ts'
import { useOptions } from '@/composables/useOptions.ts'
import { useFilters } from '@/composables/useFilters.ts'

const props = withDefaults(
  defineProps<{
    closeWindow?: boolean
  }>(),
  {
    closeWindow: false,
  },
)

const options = useOptions()
const filters = useFilters()

function onSubmit(e: SubmitEvent) {
  console.log('onSubmit:', e)
  const target = e.target as HTMLFormElement
  console.log('target:', target)
  const input = target.elements[0] as HTMLInputElement
  console.log('input:', input)
  const value = input.value.trim()
  console.log('value:', value)
}

// NOTE: Make into a reusable function
async function processExtract() {
  // NOTE: Consider moving this logic to a function...
  if (options.value.extractSide) {
    openSidePanel()
  } else {
    openPage().catch(console.warn)
  }

  // extractTabs().then((results) => chrome.storage.local.set({ results }))
  const results = await extractTabs()
  await chrome.storage.local.set({ results })
  if (props.closeWindow) window.close()
}
</script>

<template>
  <div class="btn-group btn-group-sm" role="group" aria-label="Button group with nested dropdown">
    <button @click.prevent="processExtract" type="button" class="btn btn-success">
      <i class="fa-solid fa-link me-1"></i> {{ getMsg('AllLinks') }}
    </button>
    <button type="button" class="btn btn-primary">
      <i class="fa-solid fa-globe me-1"></i> {{ getMsg('Domains') }}
    </button>
    <div class="btn-group btn-group-sm" role="group">
      <button
        type="button"
        class="btn btn-outline-success dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {{ getMsg('Filters') }}
      </button>
      <ul class="dropdown-menu">
        <li v-if="filters" v-for="filter of filters">
          <a class="dropdown-item" href="#">{{ filter.name }} - {{ filter.regex }}</a>
        </li>
      </ul>
    </div>
  </div>

  <form @submit.prevent="onSubmit" id="filter-form">
    <label for="filter-input" class="visually-hidden">{{ getMsg('QuickFilter') }}</label>
    <div class="input-group input-group-sm">
      <input
        id="filter-input"
        type="text"
        class="form-control form-control-sm"
        :placeholder="getMsg('QuickFilter')"
        :aria-label="getMsg('QuickFilter')"
        aria-describedby="submit-filter"
        autofocus
        required
      />
      <button class="btn btn-outline-success" type="submit" id="submit-filter">{{ getMsg('Go') }}</button>
    </div>
  </form>
</template>

<!--<style scoped></style>-->
