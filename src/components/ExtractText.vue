<script setup lang="ts">
import { ref } from 'vue'
import { LinkData, extractURLs } from '@/utils/links.ts'

const urls = ref<LinkData[]>([])
const text = ref<string[]>([])

function updateLinks(e: Event) {
  console.log('updateLinks:', e)
  const target = e.target as HTMLInputElement
  console.log('target:', target)

  urls.value = extractURLs(target.value)
  console.debug('urls.value:', urls.value)

  text.value = target.value.split(/\s+/).filter((s) => s !== '')
  console.debug('text.value:', text.value)
}

function onSubmit(e: Event) {
  console.log('updateLinks:', e)
  const target = e.target as HTMLInputElement
  console.log('target:', target)
}
</script>

<template>
  <form id="links-form" class="my-0" @submit.prevent="onSubmit">
    <label for="links-text" class="form-label visually-hidden">Text Links</label>
    <textarea
      id="links-text"
      class="form-control form-control-sm"
      rows="2"
      placeholder="Paste Links to Parse or Open"
      @input="updateLinks"
    ></textarea>
  </form>

  <div class="btn-group btn-group-sm w-100" role="group" aria-label="Parse/Open Links">
    <button
      id="parse-links"
      type="submit"
      form="links-form"
      class="btn btn-outline-warning parse-links"
      :class="{ disabled: !urls.length }"
      data-bs-toggle="tooltip"
      data-bs-placement="bottom"
      data-bs-title="Parse Links"
      data-text="Parse"
    >
      Links - {{ urls.length }}
    </button>
    <button
      id="open-parsed"
      type="submit"
      form="links-form"
      class="btn btn-outline-warning parse-links"
      :class="{ disabled: !text.length }"
      data-bs-toggle="tooltip"
      data-bs-placement="bottom"
      data-bs-title="Open Parsed Links"
      data-text="Open"
    >
      Text - {{ text.length }}
    </button>
  </div>
  <!-- btn-group -->
</template>

<!--<style scoped></style>-->
