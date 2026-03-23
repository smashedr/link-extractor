const config: chrome.contextMenus.CreateProperties[] = [
  { contexts: ['link'], id: 'ctxCopyText' },
  { contexts: ['all'], id: 'ctxCopyLinks' },
  { contexts: ['selection'], id: 'ctxCopySelection' },
  { contexts: ['selection'], id: 'ctxExtSelection' },
  { contexts: ['all'], id: 'separator1' },
  { contexts: ['all'], id: 'ctxExtLinks' },
  { contexts: ['all'], id: 'ctxExtFilter' },
  { contexts: ['all'], id: 'ctxExtDomains' },
  { contexts: ['all'], id: 'separator2' },
  { contexts: ['all'], id: 'ctxOpenOptions' },
]

const contexts: chrome.contextMenus.CreateProperties[] = config.map((entry) => ({
  ...entry,
  ...(entry.id?.startsWith('separator')
    ? { type: 'separator' }
    : { title: chrome.i18n.getMessage(entry.id!) }),
}))

// NOTE: Below is ported from VanillaJS

export function createContextMenus() {
  console.debug('createContextMenus')
  if (!chrome.contextMenus) {
    return console.debug('Skipping: chrome.contextMenus')
  }
  chrome.contextMenus.removeAll().then(() => {
    contexts.forEach((item) => chrome.contextMenus.create(item))
  })
}
