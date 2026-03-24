<script setup lang="ts">
import { getMsg } from '@/utils/index.ts'
import { clickOpen } from '@/utils/extension.ts'
import { useAppConfig } from '#imports'

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

// const manifest = chrome.runtime.getManifest()
// console.debug('manifest:', manifest)

const config = useAppConfig()
console.log('name:', config.name)
</script>

<template>
  <div class="text-center">
    <a
      v-if="homePage"
      class="link-body-emphasis text-decoration-none d-inline-block"
      rel="noopener"
      :href="config.homepage"
      target="_blank"
      @click.prevent="clickOpen"
      >{{ getMsg('HomePage') }}</a
    >
    <span class="mx-2">&bull;</span>
    <a
      v-if="requestFeature"
      class="link-body-emphasis text-decoration-none d-inline-block"
      rel="noopener"
      :href="`${config.github}/issues/new?template=1-feature.yaml`"
      target="_blank"
      @click.prevent="clickOpen"
      >{{ getMsg('RequestFeature') }}</a
    >
    <span class="mx-2">&bull;</span>
    <a
      v-if="openIssue"
      class="link-body-emphasis text-decoration-none d-inline-block"
      rel="noopener"
      :href="`${config.github}/issues`"
      target="_blank"
      @click.prevent="clickOpen"
      >{{ getMsg('OpenIssue') }}</a
    >
  </div>
</template>

<!--<style scoped></style>-->
