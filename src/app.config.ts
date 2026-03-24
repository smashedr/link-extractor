import { defineAppConfig } from '#imports'
import { getMsg } from '@/utils'

declare module 'wxt/utils/define-app-config' {
  // noinspection JSUnusedGlobalSymbols
  export interface WxtAppConfig {
    name: string
    short: string
    homepage: string
    github: string
  }
}

// noinspection JSUnusedGlobalSymbols
export default defineAppConfig({
  name: getMsg('extName'),
  short: getMsg('extShortName'),
  homepage: 'https://link-extractor.cssnr.com/',
  github: 'https://github.com/cssnr/link-extractor',
})
