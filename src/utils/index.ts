// utils

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  timeout = 250,
): (...args: Parameters<T>) => void {
  let timeoutID: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutID)
    timeoutID = setTimeout(() => fn(...args), timeout)
  }
}
