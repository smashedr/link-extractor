<script setup lang="ts">
import { i18n, useAppConfig } from '#imports'
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
const config = useAppConfig()
console.log('config:', config)
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
      >{{ i18n.t('ui.homePage') }}</a
    >
    <span class="mx-2">&bull;</span>
    <a
      v-if="requestFeature"
      class="link-body-emphasis text-decoration-none d-inline-block"
      rel="noopener"
      :href="`${config.github_url}/issues/new?template=1-feature.yaml`"
      target="_blank"
      @click.prevent="clickOpen"
      >{{ i18n.t('ui.requestFeature') }}</a
    >
    <span class="mx-2">&bull;</span>
    <a
      v-if="openIssue"
      class="link-body-emphasis text-decoration-none d-inline-block"
      rel="noopener"
      :href="`${config.github_url}/issues`"
      target="_blank"
      @click.prevent="clickOpen"
      >{{ i18n.t('ui.openIssue') }}</a
    >
  </div>
</template>

<!--<style scoped></style>-->
