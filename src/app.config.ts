import { i18n, defineAppConfig } from '#imports'

declare module 'wxt/utils/define-app-config' {
  // noinspection JSUnusedGlobalSymbols
  export interface WxtAppConfig {
    // name: string
    short_name: string
    // homepage_url: string
    github_url: string
  }
}

// noinspection JSUnusedGlobalSymbols
export default defineAppConfig({
  // name: i18n.t('name'), // DUPLICATION from Manifest
  short_name: i18n.t('shortName'),
  // homepage_url: 'https://link-extractor.cssnr.com/', // DUPLICATION from Manifest
  github_url: 'https://github.com/cssnr/link-extractor',
})
