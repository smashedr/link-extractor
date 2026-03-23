<script setup lang="ts">
import { getMsg } from '@/utils/index.ts'
import { openOptions } from '@/utils/extension.ts'

const closeWindow = () => window.close()
</script>

<template>
  <div class="p-1 pt-0">
    <div class="d-flex flex-row justify-content-end gap-2">
      <a
        :title="getMsg('Options')"
        class="btn btn-sm btn-outline-info hvr-grow-sm"
        href="/options.html"
        target="_blank"
        @click.prevent="openOptions()"
      >
        <i class="fa-solid fa-gears"></i> {{ getMsg('Options') }}
      </a>
      <button :title="getMsg('Close')" class="btn btn-sm btn-outline-warning hvr-grow-sm" @click="closeWindow()">
        <i class="fa-regular fa-circle-xmark"></i> {{ getMsg('Close') }}
      </button>
    </div>
  </div>
</template>

<!--<style scoped></style>-->
