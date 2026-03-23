export interface Filter {
  id: string
  regex: string
  name: string
}

export const STORE_KEY = 'filters'

export async function getFilters(): Promise<Filter[]> {
  let items = await chrome.storage.sync.get([STORE_KEY])
  console.log('getFilters:', items)
  items = items || {}
  console.log('items:', items)
  const data = items[STORE_KEY] || []
  console.log('data:', data)
  return data as Filter[]
}

export async function addFilter(item: Omit<Filter, 'id'>): Promise<void> {
  console.log('addFilter:', item)
  const data: Filter[] = await getFilters()
  console.log('data:', data)
  data.push({ ...item, id: crypto.randomUUID() })
  console.log('data:', data)
  await chrome.storage.sync.set({ [STORE_KEY]: data })
}

export async function deleteFilter(id?: string): Promise<void> {
  console.log('deleteFilter:', id)
  if (!id) return
  const data: Filter[] = await getFilters()
  const filtered = data.filter((s) => s.id !== id)
  await chrome.storage.sync.set({ [STORE_KEY]: filtered })
}
