import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-vue', '@wxt-dev/i18n/module', '@wxt-dev/auto-icons'],

  // https://wxt.dev/guide/essentials/config/auto-imports.html#disabling-auto-imports
  // imports: false,

  autoIcons: {
    enabled: true,
    baseIconPath: 'assets/icon.svg',
    developmentIndicator: false,
    // developmentIndicator: 'overlay',
    sizes: [96, 24], // Dfault: 128, 48, 32, 16
  },

  // https://wxt.dev/guide/essentials/config/manifest.html
  manifest: ({ browser, mode }) => {
    const isFirefox = browser === 'firefox'
    const isDev = mode === 'development'
    console.log(`isDev: ${isDev} - isFirefox: ${isFirefox}`)

    return {
      default_locale: 'en',
      name: '__MSG_name__',
      short_name: '__MSG_short_name__',
      description: '__MSG_description__',
      homepage_url: 'https://link-extractor.cssnr.com/',

      permissions: ['activeTab', 'contextMenus', 'scripting', 'storage'],
      optional_host_permissions: ['*://*/*'],

      commands: {
        _execute_action: {
          description: '__MSG_cmd_executeAction__',
          suggested_key: { default: 'Alt+Shift+A' },
        },
        cmdExtractAll: {
          description: '__MSG_cmd_extractAll__',
          suggested_key: { default: 'Alt+Shift+X' },
        },
        cmdExtractSelection: {
          description: '__MSG_cmd_extractSelection__',
        },
        cmdCopyAll: {
          description: '__MSG_cmd_copyAll__',
          suggested_key: { default: 'Alt+Shift+C' },
        },
        cmdCopySelection: {
          description: '__MSG_cmd_copySelection__',
        },
      },

      ...(isFirefox
        ? {
            browser_specific_settings: {
              gecko: {
                id: 'link-extractor-beta@cssnr.com', // TODO: UPDATE MERGE
                strict_min_version: '112.0', // manifest - background.type
                data_collection_permissions: { required: ['none'] },
              },
              gecko_android: { strict_min_version: '120.0' }, // permissions.request
            },
          }
        : { minimum_chrome_version: '127' }), // chrome.action.openPopup
    }
  },

  // https://wxt.dev/guide/essentials/config/hooks
  hooks: {
    'build:manifestGenerated': (wxt, manifest) => {
      // console.log('build:manifestGenerated:', wxt.config.browser)
      if (manifest.action) manifest.action.default_icon = manifest.icons
      if (manifest.sidebar_action) manifest.sidebar_action.default_icon = manifest.icons
    },
  },

  // // https://wxt.dev/guide/essentials/config/browser-startup.html
  // // NOTE: Configured in web-ext.config.ts
  // webExt: { disabled: true },

  // https://wxt.dev/guide/essentials/config/vite.html
  vite: () => ({
    // NOTE: This silences bootstrap deprecation warnings
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          silenceDeprecations: [
            'import',
            'color-functions',
            'global-builtin',
            'if-function',
          ],
        },
      },
    },
  }),
})
