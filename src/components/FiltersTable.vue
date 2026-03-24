<script setup lang="ts">
import { getMsg } from '@/utils/index.ts'
import { addFilter, deleteFilter, Filter } from '@/utils/filters.ts'
import { useFilters } from '@/composables/useFilters.ts'
import { showToast } from '@/composables/useToast.ts'
import DeleteModal from '@/components/DeleteModal.vue'

console.debug('%cLOADED: components/FiltersTable.vue', 'color: Orange')

const filters = useFilters()

const deleteModal = ref<InstanceType<typeof DeleteModal> | null>(null)

const regexRef = ref()
const nameRef = ref()

function onSubmit(e: SubmitEvent) {
  console.log('onSubmit:', e)
  const regex = regexRef.value.value.trim()
  const name = nameRef.value.value.trim()
  console.log('regex:', regex)
  console.log('name:', name)

  if (!regex) {
    showToast('No Filter Value', 'warning')
    regexRef.value.value = regex
    return regexRef.value.focus()
  }

  addFilter({ regex, name })

  const target = e.target as HTMLFormElement
  target.reset()
  regexRef.value.focus()
}

function openDeleteModal(filter: Filter) {
  console.log('openDeleteModal:', filter)
  if (!deleteModal.value) return
  deleteModal.value.show(filter)
}

async function confirmDelete(filter: Filter) {
  console.log('confirmDelete:', filter)
  await deleteFilter(filter.id)
}
</script>

<template>
  <div>
    <form @submit.prevent="onSubmit" id="filters-form" class="mb-1">
      <label class="form-label" for="regex"><i class="fa-solid fa-filter me-2"></i> {{ getMsg('SavedFilters') }}</label>
      <div class="input-group">
        <input
          ref="regexRef"
          id="regex"
          type="text"
          class="form-control"
          aria-describedby="add-filter-btn"
          placeholder="Filter/Regex"
          aria-label="Filter/Regex"
          autocomplete="off"
          required
        />
        <input
          ref="nameRef"
          type="text"
          class="form-control"
          aria-describedby="add-filter-btn"
          placeholder="Optional Name"
          aria-label="Optional Name"
          autocomplete="off"
        />
        <button class="btn btn-success" type="submit" id="add-filter-btn">
          Add <i class="fa-solid fa-circle-plus ms-1"></i>
        </button>
      </div>
    </form>

    <div class="table-wrapper">
      <table id="filters-table" class="table table-sm table-hover small w-100" style="table-layout: fixed">
        <thead class="">
          <tr>
            <th class="bg-transparent">Filters - {{ filters.length }}</th>
            <th class="bg-transparent">Name</th>
            <th class="bg-transparent text-center" style="width: 28px"><i class="fa-solid fa-trash-can"></i></th>
          </tr>
        </thead>
        <tbody id="links-body">
          <tr v-if="filters?.length" v-for="filter of filters">
            <td class="bg-transparent text-truncate">{{ filter.regex }}</td>
            <td class="bg-transparent text-truncate" :class="{ 'text-muted': !filter.name }">
              {{ filter.name || 'not set' }}
            </td>
            <td class="bg-transparent">
              <a @click.prevent="openDeleteModal(filter)" title="Delete" class="link-danger" role="button" href="#"
                ><i class="fa-regular fa-trash-can"></i
              ></a>
            </td>
          </tr>
          <tr v-else>
            <td class="bg-transparent text-center text-muted fw-bold" colspan="3">{{ getMsg('NoSavedFilters') }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <DeleteModal ref="deleteModal" @confirm="confirmDelete" />
  </div>
</template>

<!--<style scoped></style>-->
