<script setup lang="ts">
import { i18n } from '#imports'
import { extractAndOpen } from '@/utils/links.ts'
import { useOptions } from '@/composables/useOptions.ts'
import { fmtFilterName, useFilters } from '@/composables/useFilters.ts'
import { openOptions } from '@/utils/extension.ts'

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

async function extractLinks() {
  await extractAndOpen(options.value)
  if (props.closeWindow) window.close()
}
</script>

<template>
  <div>
    <div class="btn-group btn-group-sm w-100 mb-1" role="group" aria-label="Button group with nested dropdown">
      <button @click.prevent="extractLinks" type="button" class="btn btn-success flex-grow-1">
        <i class="fa-solid fa-link me-1"></i> {{ i18n.t('ui.links.all') }}
      </button>
      <button type="button" class="btn btn-primary flex-grow-1">
        <i class="fa-solid fa-globe me-1"></i> {{ i18n.t('ui.links.domains') }}
      </button>
      <div class="btn-group btn-group-sm" role="group">
        <button
          type="button"
          class="btn btn-outline-success dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {{ i18n.t('ui.filters.filters') }}
        </button>
        <ul class="dropdown-menu overflow-y-auto overflow-x-hidden">
          <li v-if="filters?.length" v-for="filter of filters">
            <a class="dropdown-item text-truncate" href="#">{{ fmtFilterName(filter) }}</a>
          </li>
          <li v-else>
            <a class="dropdown-item" href="/options.html" @click.prevent="openOptions(props.closeWindow)">{{
              i18n.t('ui.filters.noSaved')
            }}</a>
          </li>
        </ul>
      </div>
    </div>

    <form @submit.prevent="onSubmit" id="filter-form">
      <label for="filter-input" class="visually-hidden">{{ i18n.t('ui.filters.quick') }}</label>
      <div class="input-group input-group-sm">
        <input
          id="filter-input"
          type="text"
          class="form-control form-control-sm"
          :placeholder="i18n.t('ui.filters.quick')"
          :aria-label="i18n.t('ui.filters.quick')"
          aria-describedby="submit-filter"
          autocomplete="off"
          autofocus
          required
        />
        <button class="btn btn-outline-success" type="submit" id="submit-filter">{{ i18n.t('ui.action.go') }}</button>
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
