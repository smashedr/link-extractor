import { openPage, openSidePanel } from '@/utils/extension.ts'
import { getOptions, Options } from '@/utils/options.ts'
import { setResults } from '@/composables/useResults.ts'

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

// NOTE: Copied from VanillaJS
export function extractURLs(text: string): LinkData[] {
  // console.debug('extractURLs:', text)
  const urls: LinkData[] = []
  let urlmatch
  const regex =
    /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()[\]{};:'".,<>?«»“”‘’]))/gi // NOSONAR
  while ((urlmatch = regex.exec(text)) !== null) {
    try {
      let match = urlmatch[0]
      match = match.includes('://') ? match : `http://${match}`
      // console.debug('match:', match)
      const url = new URL(match)
      // DUPLICATION
      urls.push({
        href: url.href,
        text: '',
        title: '',
        label: '',
        rel: '',
        target: '',
        origin: url.origin,
      })
    } catch (e) {
      console.debug('Error Processing match:', urlmatch, e)
    }
  }
  return urls
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
  await setResults(results)
}

/**
 * VanillaJS Process Links
 * TODO: Rewrite and split up this function...
 */
export async function processLinkOptions(links: LinkData[]) {
  console.debug('%c processLinkOptions:', 'color: SpringGreen', links.length)
  // const urlFilter = urlParams.get('filter')
  // const onlyDomains = urlParams.has('domains')

  // TODO: Determine if options should be passed or gotten
  const options = await getOptions()
  // console.debug('options:', options)

  // // Set Table Options
  // if (options.linksTruncate) {
  //   console.debug('%c linksTruncate', 'color: Red')
  //   // dtOptions.columnDefs[0].className += ' truncate'
  //   // window.addEventListener('resize', windowResize)
  //   // document.querySelectorAll('table').forEach((table) => {
  //   //   table.style.tableLayout = 'fixed'
  //   // })
  // }

  // if (options.linksNoWrap) {
  //   console.debug('%c linksNoWrap', 'color: Red')
  //   // dtOptions.columnDefs[0].className += ' text-nowrap'
  // }

  // console.debug('table-responsive')
  // document.querySelectorAll('.table-wrapper').forEach((el) => {
  //     el.classList.add('table-responsive')
  // })

  // Filter links by ://
  if (options.defaultFilter) {
    links = links.filter((link) => link.href.lastIndexOf('://', 10) > 0)
    console.debug('%c defaultFilter', 'color: Yellow', links.length)
  }

  // Remove duplicate and sort links
  if (options.removeDuplicates) {
    const hrefs: string[] = []
    links = links.filter((value) => {
      if (hrefs.includes(value.href)) {
        return false
      } else {
        hrefs.push(value.href)
        return true
      }
    })
    console.debug('%c removeDuplicates', 'color: Yellow', links.length)
  }

  // // Enable stateSave in datatables
  // if (options.saveState) {
  //   dtOptions.stateSave = true
  // }

  // // Filter links based on pattern
  // if (urlFilter) {
  //   const re = new RegExp(urlFilter, options.flags)
  //   console.debug(`Filtering with regex: ${re} / ${options.flags}`)
  //   links = links.filter((item) => item.href.match(re))
  // }

  // // If no items, alert and return
  // if (!links.length) {
  //   alert('No Results')
  //   // return window.close()
  // }

  // // Update links if onlyDomains is not set
  // if (!onlyDomains) {
  //   document.getElementById('links-total').textContent = links.length.toString()
  //   const linksElements = document.querySelectorAll('.links')
  //   linksElements.forEach((el) => el.classList.remove('d-none'))
  //
  //   let opts = { ...dtOptions, ...linksOptions }
  //   linksTable = new DataTable('#links-table', opts)
  //   console.debug('links:', links)
  //   linksTable.on('draw.dt', debounce(dtDraw, 150))
  //   linksTable.on('column-visibility.dt', dtVisibility)
  //   linksTable.rows.add(links).draw()
  // }

  // // Extract domains from items, sort, and remove null
  // let domains = [...new Set(links.map((link) => link.origin))]
  // domains = domains.filter(function (el) {
  //   return el != null
  // })
  // console.debug('domains:', domains)
  // const mappedDomains = domains.map((domain) => [domain])
  // console.debug('mappedDomains:', mappedDomains)

  // document.getElementById('domains-total').textContent = domains.length.toString()
  // if (domains.length) {
  //   const domainsElements = document.querySelectorAll('.domains')
  //   domainsElements.forEach((el) => el.classList.remove('d-none'))
  //   domainsTable = new DataTable('#domains-table', dtOptions)
  //   console.debug('domains:', domains)
  //   domainsTable.on('draw.dt', debounce(dtDraw, 150))
  //   domainsTable.rows.add(domains).draw()
  // }

  // // Hide Loading message
  // document.getElementById('loading-message').classList.add('d-none')

  // // Modifications for Android
  // const platform = await chrome.runtime.getPlatformInfo()
  // if (platform.os === 'android') {
  //   // Consider always applying table-responsive to table-wrapper
  //   document.querySelectorAll('.table-wrapper').forEach((el) => {
  //     el.classList.add('table-responsive')
  //   })
  //   document.querySelectorAll('.keyboard').forEach((el) => {
  //     el.classList.add('d-none')
  //   })
  // }

  return links
}

export async function processLinkFilters(
  filter: Filter,
  links: LinkData[],
): Promise<LinkData[]> {
  console.debug('%c processLinkFilters:', 'color: SpringGreen', links.length, filter)

  // TODO: Determine if options should be passed or gotten
  const options = await getOptions()
  // console.debug('options:', options)

  const re = new RegExp(filter.regex, options.flags)
  console.debug(`Filtering with regex: %c${re}`, 'color: Yellow')
  // TODO: WIP: This is not yet finished and just copied...
  // links = links.filter((item) => re.exec(item.href) !== null)
  links = links.filter((item) => item.href.search(re) !== -1)
  console.debug('%c links.length', 'color: SpringGreen', links.length)
  return links
}
