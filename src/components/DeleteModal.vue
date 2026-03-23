<script setup lang="ts">
import { ref } from 'vue'
import { Modal } from 'bootstrap'
import { Filter } from '@/utils/filters.ts'

const modalEl = ref(null)
const item = ref<Filter | null>(null)

const emit = defineEmits(['confirm'])

function show(filter: Filter) {
  if (!modalEl.value) return
  console.log('show:', filter)
  item.value = filter
  Modal.getOrCreateInstance(modalEl.value).show()
}

function hide() {
  if (!modalEl.value) return
  console.log('hide:')
  Modal.getInstance(modalEl.value)?.hide()
}

function handleConfirm() {
  emit('confirm', item.value)
  hide()
}

defineExpose({ show })
</script>

<template>
  <Teleport to="body">
    <div class="modal fade" ref="modalEl" tabindex="-1" aria-labelledby="delete-modal-label" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="delete-modal-label">
              Delete <span class="text-warning">{{ item?.name || 'Filter' }}</span>
            </h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" tabindex="-1"></button>
          </div>
          <div class="modal-body text-center p-2">
            <p class="mb-1">
              Filter: <kbd>{{ item?.regex }}</kbd>
            </p>
          </div>
          <div class="modal-footer p-2">
            <button type="button" class="btn btn-danger me-auto" @click="handleConfirm">
              Delete <i class="fa-regular fa-trash-can ms-2"></i>
            </button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
