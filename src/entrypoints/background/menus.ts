import { Options } from '@/utils/options.ts'

const config: chrome.contextMenus.CreateProperties[] = [
  { contexts: ['link'], id: 'ctxCopyText' },
  { contexts: ['all'], id: 'ctxCopyLinks' },
  { contexts: ['selection'], id: 'ctxCopySelection' },
  { contexts: ['selection'], id: 'ctxExtSelection' },
  { contexts: ['all'], id: 'separator' },
  { contexts: ['all'], id: 'ctxExtLinks' },
  { contexts: ['all'], id: 'ctxExtFilter' },
  { contexts: ['all'], id: 'ctxExtDomains' },
  { contexts: ['all'], id: 'separator' },
  { contexts: ['all'], id: 'ctxOpenOptions' },
]

const contexts: chrome.contextMenus.CreateProperties[] = config.map((entry) => ({
  ...entry,
  ...(entry.id === 'separator'
    ? { type: 'separator', id: crypto.randomUUID() }
    : { title: chrome.i18n.getMessage(entry.id!) }),
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
