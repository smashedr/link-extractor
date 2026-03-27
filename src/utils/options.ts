export const defaultOptions = {
  linksDisplay: -1,
  flags: 'ig',
  tabsLimit: false,
  tabsRate: 250,
  tabsAfter: 10,
  lazyLoad: true,
  lazyFavicon: true,
  lazyTitle: '[{host}{pathname}]',
  radioFavicon: 'default',
  removeDuplicates: true,
  defaultFilter: true,
  saveState: true,
  linksTruncate: true,
  linksNoWrap: false,
  activateLinks: true,
  extractSide: false,
  contextMenu: true,
  showUpdate: false,
}

export type Options = typeof defaultOptions & { [key: string]: unknown }

export async function getOptions(): Promise<Options> {
  let { options } = await chrome.storage.sync.get(['options'])
  options = options || {}
  return options as Options
}

// NOTE: This is a WIP to replace the VanillaJS saveOptions
export async function saveKeyValue(key: string, value: any) /* NOSONAR */ {
  console.debug(`saveKeyValue: ${key}:`, value)
  if (!key || value === undefined) return
  const options = await getOptions()
  if (options[key] === value) return
  options[key] = value
  console.log(`Set %c${key}:`, 'color: Lime', value)
  await chrome.storage.sync.set({ options })
}
