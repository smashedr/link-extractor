import { openExtPanel, openPopup, openSidePanel } from '@/utils/extension.ts'
import { Options, defaultOptions, getOptions } from '@/utils/options.ts'
import { extractSelectionLinks, extractAndOpen } from '@/utils/links.ts'
import { createContextMenus } from './menus.ts'
import { isFirefox } from '@/utils/system.ts'

let options: Options

export default defineBackground(() => {
  console.log(`Loaded: %c${chrome.runtime.id}`, 'Color: Cyan')

  getOptions().then((results) => (options = results))

  chrome.runtime.onInstalled.addListener(onInstalled)
  chrome.runtime.onStartup.addListener(onStartup)
  chrome.runtime.onMessage.addListener(onMessage)
  chrome.storage.onChanged.addListener(onChanged)
  chrome.commands?.onCommand.addListener(onCommand)
  chrome.contextMenus?.onClicked.addListener(onClicked)
})

async function onInstalled(details: chrome.runtime.InstalledDetails) {
  console.log('onInstalled:', details)

  options = await setDefaultOptions(defaultOptions)
  console.debug('options:', options)

  createContextMenus(options)

  const manifest = chrome.runtime.getManifest()
  console.debug('manifest:', manifest)

  await chrome.runtime.setUninstallURL(`${manifest.homepage_url}/issues`)

  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    // await chrome.runtime.openOptionsPage()
    // const hasPerms = await checkPerms(manifest)
    const hasPerms = await chrome.permissions.contains({
      origins: manifest.host_permissions,
    })
    console.debug('hasPerms:', hasPerms)
    if (hasPerms) {
      await chrome.runtime.openOptionsPage()
    } else {
      const url = chrome.runtime.getURL('permissions.html')
      await chrome.tabs.create({ active: true, url })
    }
  } else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
    if (options.showUpdate) {
      if (manifest.version !== details.previousVersion) {
        const url = `${manifest.homepage_url}/releases/tag/${manifest.version}`
        await chrome.tabs.create({ active: false, url })
      }
    }
  }
}

async function onStartup() {
  console.log('onStartup')
  if (isFirefox) {
    console.log('Firefox Startup Workarounds')
    // NOTE: Confirm these checks are still necessary...
    options = await getOptions()
    console.debug('options:', options)
    createContextMenus(options)

    const manifest = chrome.runtime.getManifest()
    console.debug('manifest:', manifest)
    await chrome.runtime.setUninstallURL(`${manifest.homepage_url}/issues`)
  }
}

async function setDefaultOptions(defaultOptions: object) {
  console.log('setDefaultOptions', defaultOptions)
  options = await getOptions()
  let changed = false
  for (const [key, value] of Object.entries(defaultOptions)) {
    // console.log(`${key}: default: ${value} current: ${options[key]}`)
    if (options[key] === undefined) {
      changed = true
      options[key] = value
      console.log(`Set %c${key}:`, 'color: Khaki', value)
    }
  }
  if (changed) {
    await chrome.storage.sync.set({ options })
    console.log('changed options:', options)
  }
  return options
}

function onMessage(
  message: any,
  _sender: chrome.runtime.MessageSender,
  _sendResponse: Function,
) {
  console.log('background/index.ts: onMessage:', message)
  if (message === 'openPopup') {
    openPopup().catch(console.log)
  }
}

function onChanged(changes: object, namespace: string) {
  // console.debug('onChanged:', changes, namespace)
  for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (namespace === 'sync' && key === 'options' && oldValue && newValue) {
      options = newValue
      if (oldValue.contextMenu !== newValue.contextMenu) {
        if (newValue?.contextMenu) {
          console.log('%c Enabled contextMenu...', 'color: SpringGreen')
          createContextMenus(newValue)
        } else {
          console.log('%c Disabled contextMenu...', 'color: OrangeRed')
          chrome.contextMenus?.removeAll()
        }
      }
    }
  }
}

async function onCommand(command: string, tab?: chrome.tabs.Tab) {
  console.debug('onCommand:', command, tab)
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
  console.debug('onClicked:', ctx, tab)
  if (!tab?.id) return
  try {
    if (ctx.menuItemId === 'ctxOpenOptions') {
      await chrome.runtime.openOptionsPage()
    } else if (ctx.menuItemId === 'openPopup') {
      await openPopup()
    } else if (ctx.menuItemId === 'openExtPanel') {
      await openExtPanel()
    } else if (ctx.menuItemId === 'openSidePanel') {
      openSidePanel()
    } else if (ctx.menuItemId === 'ctxCopyLinks') {
      console.log(`%c ${ctx.menuItemId}`, 'color: Yellow')
    } else if (ctx.menuItemId === 'ctxExtSelection') {
      console.log(`%c ${ctx.menuItemId}`, 'color: Lime')
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: extractSelectionLinks,
      })
      console.log('result:', result)
    } else if (ctx.menuItemId === 'ctxExtLinks') {
      console.log(`%c ${ctx.menuItemId}`, 'color: Lime')
      await extractAndOpen(options)
    } else {
      console.log(`Unknown ctx.menuItemId: ${ctx.menuItemId}`)
    }
  } catch (e) {
    console.warn(e)
  }
}
