import { openPage, openSidePanel } from '@/utils/extension.ts'
import { Options } from '@/utils/options.ts'

export interface LinkData {
  href: string
  text: string
  title: string
  label: string
  rel: string
  target: string
  origin: string
}

export function extractAllLinks(): LinkData[] {
  function findLinks(root: Document | ShadowRoot): LinkData[] {
    const links: LinkData[] = []
    root
      .querySelectorAll<HTMLAnchorElement | HTMLAreaElement>('a, area')
      .forEach((el) => {
        // DUPLICATION
        links.push({
          href: decodeURI(el.href),
          text: el.textContent.trim(),
          title: el.title,
          label: el.ariaLabel ?? '',
          rel: el.rel,
          target: el.target,
          origin: el.origin,
        })
      })
    Array.from(root.querySelectorAll('*'))
      .filter((el) => el.shadowRoot)
      .forEach((el) => links.push(...findLinks(el.shadowRoot!)))
    return links
  }
  const results = findLinks(document)
  console.log('extractAllLinks:', results)
  return results
}

export function extractSelectionLinks(): LinkData[] {
  const selection = window.getSelection()
  console.log('extractSelectionLinks:', selection)
  const links: LinkData[] = []
  if (selection?.type !== 'Range') {
    console.log('No selection or wrong selection.type')
    return links
  }
  for (let i = 0; i < selection.rangeCount; i++) {
    const ancestor = selection.getRangeAt(i).commonAncestorContainer as HTMLElement
    if (ancestor.nodeName === '#text') continue
    ancestor
      ?.querySelectorAll<HTMLAnchorElement | HTMLAreaElement>('a, area')
      ?.forEach((el) => {
        if (selection.containsNode(el, true)) {
          // DUPLICATION
          links.push({
            href: decodeURI(el.href),
            text: el.textContent.trim(),
            title: el.title,
            label: el.ariaLabel ?? '',
            rel: el.rel,
            target: el.target,
            origin: el.origin,
          })
        }
      })
  }
  console.log('links:', links)
  return links
}

// NOTE: Allow passing queryInfo options...
export async function extractTabs(): Promise<LinkData[]> {
  const tabs = await chrome.tabs.query({
    currentWindow: true,
    highlighted: true,
  })
  console.log(`extractTabs: ${tabs.length}`, tabs)

  const results: LinkData[] = []
  for (const tab of tabs) {
    console.debug(`tab: ${tab.id}`, tab)

    if (!tab.id) continue

    const injectionResults = await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      func: extractAllLinks,
    })
    // console.log('injectionResults:', injectionResults)
    results.push(...injectionResults.flatMap(({ result }) => result ?? []))
  }
  console.log(`results ${results.length}`, results)
  return results
}

// NOTE: Consider accepting extractTabs queryInfo options once implemented...
export async function extractAndOpen(options: Options) {
  console.log('extractAndOpen:', options)
  // NOTE: Consider moving this logic to a function...
  if (options.extractSide) {
    openSidePanel()
  } else {
    openPage().catch(console.warn)
  }
  const results = await extractTabs()
  await chrome.storage.local.set({ results })
}
