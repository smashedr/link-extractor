import { getAppConfig } from '#imports'
import { defineBackground } from 'wxt/utils/define-background'
import { isFirefox } from '@/utils/system.ts'
import { debug } from '@/utils/logger.ts'
import { type Options, defaultOptions, getOptions } from '@/utils/options.ts'
import { openExtPanel, openPopup, openSidePanel } from '@/utils/extension.ts'
import { extractSelectionLinks, extractAndOpen } from '@/utils/links.ts'
import { updateContextMenus } from './menus.ts'

// TODO: The index.ts was copied from another app that does not use top-level options

let options: Options

const config = getAppConfig()

export default defineBackground(() => {
  console.log(`Loaded: %c${chrome.runtime.id}`, 'Color: Cyan')

  getOptions().then((results) => (options = results))

  chrome.runtime.onInstalled.addListener(onInstalled)
  chrome.runtime.onStartup.addListener(onStartup)
  chrome.storage.sync.onChanged.addListener(onChanged)
  chrome.runtime.onMessage.addListener(onMessage)
  chrome.commands?.onCommand.addListener(onCommand)
  chrome.contextMenus?.onClicked.addListener(onClicked)
})

async function onInstalled(details: chrome.runtime.InstalledDetails) {
  debug('onInstalled:', details)

  options = await setDefaultOptions(defaultOptions)
  debug('options:', options)
  updateContextMenus(options.contextMenu).catch(console.warn)
  setUninstall().catch(console.warn)

  const manifest = chrome.runtime.getManifest()

  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    // NOTE: origins defined: background/icons.ts, components/PermsCheck.vue
    const hasPerms = await chrome.permissions.contains({
      origins: manifest.host_permissions,
    })
    debug('hasPerms:', hasPerms)
    if (hasPerms) {
      await chrome.runtime.openOptionsPage()
    } else {
      const url = chrome.runtime.getURL('permissions.html')
      await chrome.tabs.create({ active: true, url })
    }
  } else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
    if (options.showUpdate && manifest.version !== details.previousVersion) {
      // const config = getAppConfig()
      const url = `${config.githubUrl}/releases/tag/${manifest.version}`
      await chrome.tabs.create({ active: false, url })
    }
  }
}

async function onStartup() {
  debug('onStartup')

  const options = await getOptions()
  debug('options:', options)

  if (isFirefox) {
    debug('Firefox Startup Workarounds')
    updateContextMenus(options.contextMenu).catch(console.warn)
    setUninstall().catch(console.warn)
  }
}

function onChanged(changes: Record<string, chrome.storage.StorageChange>) {
  // debug('background/index.ts - onChanged:', changes)
  if (changes?.options) {
    const oldValue = changes.options?.oldValue as Options | undefined
    const newValue = changes.options?.newValue as Options | undefined
    if (!oldValue || !newValue) return debug('missing oldValue or newValue')
    if (oldValue?.contextMenu !== newValue.contextMenu) {
      updateContextMenus(newValue.contextMenu).catch(console.warn)
    }
  }
}

function onMessage(message: any, sender: chrome.runtime.MessageSender) {
  const tabId = message.tabId || sender.tab?.id
  debug(`background/index.ts - onMessage: tabId: ${tabId} - message:`, message)
  if (message === 'openPopup') {
    openPopup().catch(console.log)
  } else {
    console.warn(`Unknown Message: ${message}`)
  }
}

async function onCommand(command: string, tab?: chrome.tabs.Tab) {
  debug('onCommand:', command, tab)
  if (command === 'openOptions') {
    await chrome.runtime.openOptionsPage()
  } else if (command === 'openExtPanel') {
    await openExtPanel()
  } else if (command === 'openSidePanel') {
    openSidePanel()
  } else if (command === 'cmdExtractAll') {
    await extractAndOpen(options)
  } else {
    console.warn(`Unknown Command: ${command}`)
  }
}

async function onClicked(ctx: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) {
  debug('onClicked:', ctx, tab)
  if (ctx.menuItemId === 'openOptions') {
    await chrome.runtime.openOptionsPage()
  } else if (ctx.menuItemId === 'openPopup') {
    // NOTE: Not added to menus.ts
    await openPopup()
  } else if (ctx.menuItemId === 'openExtPanel') {
    // NOTE: Not added to menus.ts
    await openExtPanel()
  } else if (ctx.menuItemId === 'openSidePanel') {
    // NOTE: Not added to menus.ts
    openSidePanel()
  } else if (ctx.menuItemId === 'copyLinks') {
    console.log(`%c ${ctx.menuItemId}`, 'color: Yellow')
  } else if (ctx.menuItemId === 'extSelection') {
    console.log(`%c ${ctx.menuItemId}`, 'color: Lime')
    if (!tab?.id) return debug('No Tab ID for tab:', tab)
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractSelectionLinks,
    })
    console.log('result:', result)
  } else if (ctx.menuItemId === 'extLinks') {
    console.log(`%c ${ctx.menuItemId}`, 'color: Lime')
    await extractAndOpen(options)
  } else {
    console.log(`Unknown ctx.menuItemId: ${ctx.menuItemId}`)
  }
}

async function setDefaultOptions(defaultOptions: object) {
  debug('setDefaultOptions', defaultOptions)
  const options = await getOptions()
  let changed = false
  for (const [key, value] of Object.entries(defaultOptions)) {
    // debug(`${key}: default: ${value} current: ${options[key]}`)
    if (options[key] === undefined) {
      changed = true
      options[key] = value
      debug(`Set %c${key}:`, 'color: Khaki', value)
    }
  }
  if (changed) {
    await chrome.storage.sync.set({ options })
    debug('chrome.storage.sync.set:', options)
  }
  return options
}

async function setUninstall() {
  // NOTE: Calling this setUninstallURL and using getAppConfig breaks WXT
  // const config = getAppConfig()
  const url = new URL(config.uninstallUrl)
  url.searchParams.append('version', config.version)
  url.searchParams.append('id', chrome.runtime.id)
  debug('setUninstallURL:', url.href)
  await chrome.runtime.setUninstallURL(url.href)
}
