<script setup lang="ts">
import { getMsg } from '@/utils/index.ts'
import { clickOpen } from '@/utils/extension.ts'

withDefaults(
  defineProps<{
    homePage?: boolean
    requestFeature?: boolean
    openIssue?: boolean
  }>(),
  {
    homePage: true,
    requestFeature: true,
    openIssue: true,
  },
)

const manifest = chrome.runtime.getManifest()
console.debug('manifest:', manifest)
</script>

<template>
  <div class="text-center">
    <a
      v-if="homePage"
      class="link-body-emphasis text-decoration-none d-inline-block"
      rel="noopener"
      :href="manifest.homepage_url"
      target="_blank"
      @click.prevent="clickOpen"
      >{{ getMsg('HomePage') }}</a
    >
    <span class="mx-1">&bull;</span>
    <a
      v-if="requestFeature"
      class="link-body-emphasis text-decoration-none d-inline-block"
      rel="noopener"
      :href="`${manifest.homepage_url}/issues/new?template=1-feature.yaml`"
      target="_blank"
      @click.prevent="clickOpen"
      >{{ getMsg('RequestFeature') }}</a
    >
    <span class="mx-1">&bull;</span>
    <a
      v-if="openIssue"
      class="link-body-emphasis text-decoration-none d-inline-block"
      rel="noopener"
      :href="`${manifest.homepage_url}/issues`"
      target="_blank"
      @click.prevent="clickOpen"
      >{{ getMsg('OpenIssue') }}</a
    >
  </div>
</template>

<!--<style scoped></style>-->
