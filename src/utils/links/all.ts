import { LinkData, pushElement } from './index.ts'

function findLinks(root: Document | ShadowRoot): LinkData[] {
  const links: LinkData[] = []
  root
    .querySelectorAll<HTMLAnchorElement | HTMLAreaElement>('a, area')
    .forEach((el) => pushElement(links, el))
  Array.from(root.querySelectorAll('*'))
    .filter((el) => el.shadowRoot)
    .forEach((el) => links.push(...findLinks(el.shadowRoot!)))
  return links
}

findLinks(document)
