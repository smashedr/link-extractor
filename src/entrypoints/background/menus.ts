import { i18n } from '#imports'
import { Options } from '@/utils/options.ts'

const config: chrome.contextMenus.CreateProperties[] = [
  { contexts: ['link'], id: 'copyText' },
  { contexts: ['all'], id: 'copyLinks' },
  { contexts: ['selection'], id: 'copySelection' },
  { contexts: ['selection'], id: 'extSelection' },
  { contexts: ['all'], id: 'separator' },
  { contexts: ['all'], id: 'extLinks' },
  { contexts: ['all'], id: 'extFilter' },
  { contexts: ['all'], id: 'extDomains' },
  { contexts: ['all'], id: 'separator' },
  { contexts: ['all'], id: 'openOptions' },
]

const contexts: chrome.contextMenus.CreateProperties[] = config.map((entry) => ({
  ...entry,
  ...(entry.id === 'separator'
    ? { type: 'separator', id: crypto.randomUUID() }
    : { title: i18n.t(`ctx.${entry.id}` as any) }),
}))

// NOTE: Below is ported from VanillaJS

export function createContextMenus(options: Options) {
  console.log('createContextMenus:', options)
  if (!options.contextMenu) return console.log('Disabled: options.contextMenu')
  if (!chrome.contextMenus) return console.log('Unsupported: chrome.contextMenus')
  chrome.contextMenus.removeAll().then(() => {
    contexts.forEach((item) => {
      // console.log(item.id, options[item.id!])
      chrome.contextMenus.create(item)
    })
  })
}
