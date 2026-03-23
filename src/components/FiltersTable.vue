<script setup lang="ts">
import { getMsg } from '@/utils/index.ts'
import { addFilter, deleteFilter, Filter } from '@/utils/filters.ts'
import { useFilters } from '@/composables/useFilters.ts'
import DeleteModal from '@/components/DeleteModal.vue'

console.debug('%cLOADED: components/FiltersTable.vue', 'color: Orange')

const deleteModal = ref<InstanceType<typeof DeleteModal> | null>(null)

const filters = useFilters()

const regex = ref('')
const name = ref('')

function onSubmit(e: SubmitEvent) {
  console.log('onSubmit:', e)
  // const target = e.target as HTMLFormElement
  // console.log('target:', target)
  // const regexInput = target.elements[0] as HTMLInputElement
  // const nameInput = target.elements[1] as HTMLInputElement
  // const regex = regexInput.value.trim()
  // const name = nameInput.value.trim()
  console.log('regex:', regex.value.trim())
  console.log('name:', name.value.trim())

  if (!regex.value.trim()) return
  const filter = { regex: regex.value.trim(), name: name.value.trim() }
  addFilter(filter)

  const target = e.target as HTMLFormElement
  target.reset()
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
          v-model="regex"
          type="text"
          class="form-control"
          aria-describedby="add-filter-btn"
          placeholder="Filter/Regex"
          aria-label="Filter/Regex"
          id="regex"
          name="regex"
          required
        />
        <input
          v-model="name"
          type="text"
          class="form-control"
          aria-describedby="add-filter-btn"
          placeholder="Optional: Name"
          aria-label="Optional: Name"
          name="name"
        />
        <button class="btn btn-success" type="submit" id="add-filter-btn">
          Add <i class="fa-solid fa-circle-plus ms-1"></i>
        </button>
      </div>
    </form>

    <div class="table-wrapper">
      <table id="filters-table" class="table table-sm table-hover small w-100">
        <thead class="">
          <tr>
            <th class="bg-transparent">Filters - {{ filters.length }}</th>
            <th class="bg-transparent">Name</th>
            <th class="bg-transparent text-center" style="width: 28px"><i class="fa-solid fa-trash-can"></i></th>
          </tr>
        </thead>
        <tbody id="links-body">
          <tr v-if="filters" v-for="filter of filters">
            <td class="bg-transparent">{{ filter.regex }}</td>
            <td class="bg-transparent">{{ filter.name }}</td>
            <td class="bg-transparent">
              <a @click.prevent="openDeleteModal(filter)" title="Delete" class="link-danger" role="button" href="#"
                ><i class="fa-regular fa-trash-can"></i
              ></a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <DeleteModal ref="deleteModal" @confirm="confirmDelete" />
  </div>
</template>

<!--<style scoped></style>-->
