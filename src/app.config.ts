import { defineAppConfig } from '#imports'
import { getMsg } from '@/utils'

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
  // name: getMsg('extName'), // DUPLICATION from Manifest
  short_name: getMsg('extShortName'),
  // homepage_url: 'https://link-extractor.cssnr.com/', // DUPLICATION from Manifest
  github_url: 'https://github.com/cssnr/link-extractor',
})
