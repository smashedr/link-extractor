export interface LinkData {
  href: string
  text: string | undefined
  title: string
  label: string
  rel: string
  target: string
  origin: string
}

export function pushElement(
  links: LinkData[],
  el: HTMLAnchorElement | HTMLAreaElement,
): void {
  if (!el.href) return
  try {
    links.push({
      href: decodeURI(el.href),
      text: el.textContent?.trim(),
      title: el.title,
      label: el.ariaLabel || '',
      rel: el.rel,
      target: el.target,
      origin: el.origin,
    })
  } catch (e) {
    console.log(e)
  }
}
