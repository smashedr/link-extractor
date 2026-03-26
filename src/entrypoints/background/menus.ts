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

export async function createContextMenus(options: Options) {
  console.log('createContextMenus:', options)
  if (!options.contextMenu) return console.log('Disabled: options.contextMenu')
  if (!chrome.contextMenus) return console.log('Unsupported: chrome.contextMenus')
  await chrome.contextMenus.removeAll()
  contexts.forEach((item) => {
    chrome.contextMenus.create(item)
  })
}
