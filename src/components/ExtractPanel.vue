<script setup lang="ts">
import { getMsg } from '@/utils/index.ts'
import { extractAndOpen } from '@/utils/links.ts'
import { useOptions } from '@/composables/useOptions.ts'
import { useFilters } from '@/composables/useFilters.ts'
import { openOptions } from '@/utils/extension.ts'
import { Filter } from '@/utils/filters.ts'

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

function fmtName(filter: Filter) {
  if (filter.name) {
    return `${filter.name} - ${filter.regex}`
  } else {
    return filter.regex
  }
}

function onSubmit(e: SubmitEvent) {
  console.log('onSubmit:', e)
  const target = e.target as HTMLFormElement
  console.log('target:', target)
  const input = target.elements[0] as HTMLInputElement
  console.log('input:', input)
  const value = input.value.trim()
  console.log('value:', value)
}

async function extractLinks() {
  await extractAndOpen(options.value)
  if (props.closeWindow) window.close()
}
</script>

<template>
  <div>
    <div class="btn-group btn-group-sm w-100 mb-1" role="group" aria-label="Button group with nested dropdown">
      <button @click.prevent="extractLinks" type="button" class="btn btn-success flex-grow-1">
        <i class="fa-solid fa-link me-1"></i> {{ getMsg('AllLinks') }}
      </button>
      <button type="button" class="btn btn-primary flex-grow-1">
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
        <ul class="dropdown-menu overflow-y-auto overflow-x-hidden">
          <li v-if="filters?.length" v-for="filter of filters">
            <a class="dropdown-item text-truncate" href="#">{{ fmtName(filter) }}</a>
          </li>
          <li v-else>
            <a class="dropdown-item" href="/options.html" @click.prevent="openOptions(props.closeWindow)">{{
              getMsg('NoSavedFilters')
            }}</a>
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
          autocomplete="off"
          autofocus
          required
        />
        <button class="btn btn-outline-success" type="submit" id="submit-filter">{{ getMsg('Go') }}</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.dropdown-menu {
  max-height: 260px;
  max-width: 300px;
  scrollbar-gutter: stable;
}
</style>
