import { createApp } from 'vue'
import App from './App.vue'

function mountApp(el: HTMLElement) {
  const app = createApp(App)
  app.mount(el)
}

export default defineContentScript({
  matches: ['*://*/*'],
  allFrames: true,

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'link-extractor-ui',
      position: 'inline',
      anchor: 'body',
      append: 'last',
      onMount: mountApp,
      css: ':host { display: block; height: 0 !important; width: 0 !important; overflow: hidden; }',
    })
    ui.mount()
  },
})
