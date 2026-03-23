import { LinkData, pushElement } from './index.ts'

function extractSelection(): LinkData[] {
  const links: LinkData[] = []
  const selection = window.getSelection()
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
        if (selection.containsNode(el, true)) pushElement(links, el)
      })
  }
  return links
}

extractSelection()
