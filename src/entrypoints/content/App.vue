<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { LinkData } from '@/utils/links.ts'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DRAG_THRESHOLD = 30
const SCROLL_ZONE = 60
const SCROLL_MAX_SPEED = 20

// ---------------------------------------------------------------------------
// Drag state (plain object — no reactivity needed)
// ---------------------------------------------------------------------------

interface DragState {
  startX: number
  startY: number
  selectionBox: HTMLDivElement | null
  isDragging: boolean
  hasDragged: boolean
  frameCovers: HTMLDivElement[]
  scrollRAF: number | null
}

const state: DragState = {
  startX: 0,
  startY: 0,
  selectionBox: null,
  isDragging: false,
  hasDragged: false,
  frameCovers: [],
  scrollRAF: null,
}

// ---------------------------------------------------------------------------
// Menu state (reactive — drives the template)
// ---------------------------------------------------------------------------

const menuVisible = ref(false)
const menuLinks = ref<LinkData[]>([])
const menuX = ref(0)
const menuY = ref(0)

function showLinkMenu(links: LinkData[], anchorX: number, anchorY: number): void {
  menuLinks.value = links

  // Position the menu — nudge away from viewport edges
  const PAD = 8
  const vw = window.innerWidth
  const vh = window.innerHeight
  const mw = 220
  const mh = 140

  menuX.value = anchorX + mw + PAD > vw ? vw - mw - PAD : anchorX
  menuY.value = anchorY + mh + PAD > vh ? vh - mh - PAD : anchorY

  menuVisible.value = true
  console.log(`Link menu shown with ${links.length} link(s)`)
}

function dismissLinkMenu(): void {
  if (menuVisible.value) {
    menuVisible.value = false
    menuLinks.value = []
    console.log('Link menu dismissed')
  }
}

// ---------------------------------------------------------------------------
// Menu actions
// ---------------------------------------------------------------------------

function actionOpenLinks(): void {
  menuLinks.value.forEach((l) => window.open(l.href, '_blank', 'noopener'))
  dismissLinkMenu()
}

function actionCopyLinks(): void {
  navigator.clipboard.writeText(menuLinks.value.map((l) => l.href).join('\n')).catch(console.error)
  dismissLinkMenu()
}

function actionExtractLinks(): void {
  const json = JSON.stringify(menuLinks.value, null, 2)
  navigator.clipboard.writeText(json).catch(console.error)
  console.log('Extracted links JSON:', menuLinks.value)
  dismissLinkMenu()
}

// ---------------------------------------------------------------------------
// Rect helpers
// ---------------------------------------------------------------------------

function rectsOverlap(a: DOMRect, b: DOMRect): boolean {
  return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom)
}

function toLinkData(el: HTMLAnchorElement | HTMLAreaElement): LinkData {
  return {
    href: decodeURI(el.href),
    text: el.textContent?.trim() ?? '',
    title: el.title,
    label: el.ariaLabel ?? '',
    rel: el.rel,
    target: el.target,
    origin: el.origin,
  }
}

function getLinksInRect(rect: DOMRect): LinkData[] {
  const allLinks = Array.from(document.querySelectorAll<HTMLAnchorElement | HTMLAreaElement>('a, area'))
  const matched = allLinks.filter((el) => rectsOverlap(el.getBoundingClientRect(), rect))
  const linkData = matched.map(toLinkData)
  console.log(`getLinksInRect found ${linkData.length} link(s) in rect`, {
    rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
    links: linkData,
  })
  return linkData
}

function highlightLinksInBox(x: number, y: number, w: number, h: number): void {
  const boxRect = new DOMRect(x, y, w, h)
  document.querySelectorAll<HTMLAnchorElement | HTMLAreaElement>('a, area').forEach((el) => {
    const intersects = rectsOverlap(el.getBoundingClientRect(), boxRect)
    el.style.outline = intersects ? '2px solid #4af' : ''
    el.style.outlineOffset = intersects ? '2px' : ''
  })
}

function clearLinkHighlights(): void {
  document.querySelectorAll<HTMLAnchorElement | HTMLAreaElement>('a, area').forEach((el) => {
    el.style.outline = ''
    el.style.outlineOffset = ''
  })
  console.log('Cleared all link highlights')
}

// ---------------------------------------------------------------------------
// Frame covers
// ---------------------------------------------------------------------------

function coverFrames(state: DragState): void {
  const container = document.body ?? document.documentElement
  state.frameCovers = Array.from(document.querySelectorAll<HTMLIFrameElement>('iframe, frame')).map((frame) => {
    const rect = frame.getBoundingClientRect()
    const cover = document.createElement('div')
    cover.style.cssText = `
      position: fixed;
      left: ${rect.left}px;
      top: ${rect.top}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      z-index: 999998;
      pointer-events: all;
    `
    container.appendChild(cover)
    console.log('Covering frame', { rect })
    return cover
  })
}

function uncoverFrames(state: DragState): void {
  state.frameCovers.forEach((cover) => cover.remove())
  state.frameCovers = []
  console.log('Removed all frame covers')
}

// ---------------------------------------------------------------------------
// Auto-scroll
// ---------------------------------------------------------------------------

function stopAutoScroll(state: DragState): void {
  if (state.scrollRAF !== null) {
    cancelAnimationFrame(state.scrollRAF)
    state.scrollRAF = null
    console.log('Auto-scroll stopped')
  }
}

function startAutoScroll(state: DragState, speed: number): void {
  if (state.scrollRAF !== null) stopAutoScroll(state)

  const tick = () => {
    window.scrollBy(0, speed)
    state.scrollRAF = requestAnimationFrame(tick)
  }
  state.scrollRAF = requestAnimationFrame(tick)
  console.log('Auto-scroll started', { speed })
}

// ---------------------------------------------------------------------------
// Event handlers
// ---------------------------------------------------------------------------

function onMouseDown(e: MouseEvent): void {
  if (e.button !== 2) return

  state.isDragging = true
  state.hasDragged = false
  state.startX = e.clientX + window.scrollX
  state.startY = e.clientY + window.scrollY

  console.log('Drag started', { startX: state.startX, startY: state.startY })
}

function onMouseMove(e: MouseEvent): void {
  if (!state.isDragging) return

  const curX = e.clientX + window.scrollX
  const curY = e.clientY + window.scrollY
  const w = Math.abs(curX - state.startX)
  const h = Math.abs(curY - state.startY)

  if (!state.hasDragged) {
    if (w < DRAG_THRESHOLD && h < DRAG_THRESHOLD) return
    state.hasDragged = true

    coverFrames(state)
    state.selectionBox = document.createElement('div')
    state.selectionBox.style.cssText = `
      position: absolute;
      border: 2px dashed #4af;
      background: rgba(68, 170, 255, 0.15);
      pointer-events: none;
      z-index: 999999;
      left: ${state.startX}px;
      top: ${state.startY}px;
      width: 0px;
      height: 0px;
    `
    const container = document.body ?? document.documentElement
    container.appendChild(state.selectionBox)
    console.log('Selection box created and appended to DOM')
  }

  if (!state.selectionBox) return

  const x = Math.min(curX, state.startX)
  const y = Math.min(curY, state.startY)

  Object.assign(state.selectionBox.style, {
    left: `${x}px`,
    top: `${y}px`,
    width: `${w}px`,
    height: `${h}px`,
  })

  // Convert page coords → viewport coords for hit-testing against getBoundingClientRect()
  const vx = x - window.scrollX
  const vy = y - window.scrollY
  console.log('Drag moved', { x, y, w, h })
  highlightLinksInBox(vx, vy, w, h)

  // Auto-scroll when mouse is near top or bottom of viewport
  const vh = window.innerHeight

  if (e.clientY < SCROLL_ZONE) {
    startAutoScroll(state, -Math.ceil((1 - e.clientY / SCROLL_ZONE) * SCROLL_MAX_SPEED))
  } else if (e.clientY > vh - SCROLL_ZONE) {
    startAutoScroll(state, Math.ceil(((e.clientY - (vh - SCROLL_ZONE)) / SCROLL_ZONE) * SCROLL_MAX_SPEED))
  } else {
    stopAutoScroll(state)
  }
}

function onMouseUp(e: MouseEvent): void {
  if (e.button !== 2 || !state.isDragging) return

  state.isDragging = false
  stopAutoScroll(state)
  // Note: hasDragged is NOT reset here — contextmenu fires after mouseup
  // and still needs to read it to suppress the popup

  uncoverFrames(state)

  if (state.selectionBox) {
    const rect = state.selectionBox.getBoundingClientRect()
    console.log('Drag ended', {
      rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
    })

    const capturedLinks = getLinksInRect(rect)
    console.log(`Captured ${capturedLinks.length} link(s)`, capturedLinks)

    clearLinkHighlights()
    state.selectionBox.remove()
    state.selectionBox = null
    console.log('Selection box removed from DOM')

    if (capturedLinks.length > 0) {
      showLinkMenu(capturedLinks, e.clientX, e.clientY)
    }
  }
}

function onContextMenu(e: MouseEvent): void {
  if (state.hasDragged) {
    e.preventDefault()
    console.log('Context menu suppressed during drag')
  }
  state.hasDragged = false // Reset here, AFTER the check
}

function onDocMouseDown(e: MouseEvent): void {
  if (menuVisible.value && !(e.target as Element).closest?.('[data-link-extractor-menu]')) {
    dismissLinkMenu()
  }
}

function onKeyDown(e: KeyboardEvent): void {
  if (e.key === 'Escape') dismissLinkMenu()
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

onMounted(() => {
  console.log('%c link-extractor: App.vue mounted', 'color: Lime')
  window.addEventListener('mousedown', onMouseDown, true)
  window.addEventListener('mousemove', onMouseMove, true)
  window.addEventListener('mouseup', onMouseUp, true)
  window.addEventListener('contextmenu', onContextMenu, true)
  window.addEventListener('mousedown', onDocMouseDown, true)
  window.addEventListener('keydown', onKeyDown, true)
})

onUnmounted(() => {
  console.log('link-extractor: App.vue unmounted — cleaning up')
  window.removeEventListener('mousedown', onMouseDown, true)
  window.removeEventListener('mousemove', onMouseMove, true)
  window.removeEventListener('mouseup', onMouseUp, true)
  window.removeEventListener('contextmenu', onContextMenu, true)
  window.removeEventListener('mousedown', onDocMouseDown, true)
  window.removeEventListener('keydown', onKeyDown, true)

  if (state.selectionBox) {
    state.selectionBox.remove()
    state.selectionBox = null
  }

  stopAutoScroll(state)
  clearLinkHighlights()
  dismissLinkMenu()
})
</script>

<template>
  <!--
    Teleport ejects the menu out of the shadow root into document.body.
    This is necessary because position:fixed inside a shadow root is broken —
    the WXT host element creates a stacking context that prevents the menu
    from anchoring to the real viewport.
  -->
  <Teleport to="body">
    <Transition name="pop">
      <div
        v-if="menuVisible"
        data-link-extractor-menu
        class="link-extractor-menu"
        :style="{ left: `${menuX}px`, top: `${menuY}px` }"
      >
        <div class="le-heading">Found {{ menuLinks.length }} link{{ menuLinks.length === 1 ? '' : 's' }}</div>
        <button class="le-item" @click="actionOpenLinks"><span class="le-icon">↗</span> Open links</button>
        <button class="le-item" @click="actionCopyLinks"><span class="le-icon">⎘</span> Copy links</button>
        <button class="le-item" @click="actionExtractLinks"><span class="le-icon">{}</span> Extract links</button>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
/*
  Not scoped — the Teleported node lives in document.body, outside the shadow
  root, so scoped styles wouldn't reach it. Class names are prefixed "le-" to
  avoid collisions with whatever styles the host page has.
*/
.link-extractor-menu {
  position: fixed;
  background: #18181b;
  border: 1px solid #3f3f46;
  border-radius: 10px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.55),
    0 1px 0 rgba(255, 255, 255, 0.04) inset;
  padding: 6px;
  min-width: 200px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 13px;
  color: #e4e4e7;
  z-index: 2147483647;
}

.le-heading {
  padding: 6px 10px 8px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #71717a;
  border-bottom: 1px solid #27272a;
  margin-bottom: 4px;
  user-select: none;
}

.le-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  background: none;
  border: none;
  color: #e4e4e7;
  font: inherit;
  text-align: left;
  transition: background 0.1s;
}

.le-item:hover {
  background: #27272a;
  color: #fff;
}
.le-item:hover .le-icon {
  color: #4af;
}

.le-icon {
  width: 16px;
  text-align: center;
  color: #52525b;
  flex-shrink: 0;
  transition: color 0.1s;
}

/* Transition — prefixed to avoid clashing with page styles */
.pop-enter-active {
  animation: le-pop 0.12s cubic-bezier(0.2, 0, 0.2, 1.4) both;
}
.pop-leave-active {
  animation: le-pop 0.08s ease-in reverse both;
}

@keyframes le-pop {
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
