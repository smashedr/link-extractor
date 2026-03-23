import { defineConfig } from 'wxt'

// NOTE: Icons are also defined in <mata> tags for:
//    popup/index.html
//    sidepanel/index.html
const icons = {
  16: 'images/logo16.png',
  24: 'images/logo24.png',
  32: 'images/logo32.png',
  48: 'images/logo48.png',
  96: 'images/logo96.png',
  128: 'images/logo128.png',
}

// See https://wxt.dev/api/config.html
// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-vue'],

  manifest: ({ browser, mode }) => {
    const isFirefox = browser === 'firefox'
    const isDev = mode === 'development'
    console.log(`isDev: ${isDev} - isFirefox: ${isFirefox}`)

    return {
      icons,
      default_locale: 'en',
      name: '__MSG_extName__',
      description: '__MSG_extDescription__',
      homepage_url: 'https://link-extractor.cssnr.com/',

      permissions: ['activeTab', 'contextMenus', 'scripting', 'storage'],
      optional_host_permissions: ['*://*/*'],

      commands: {
        _execute_action: {
          description: '__MSG_cmdExecuteAction__',
          suggested_key: { default: 'Alt+Shift+A' },
        },
        cmdExtractAll: {
          description: '__MSG_cmdExtractAll__',
          suggested_key: { default: 'Alt+Shift+X' },
        },
        cmdExtractSelection: {
          description: '__MSG_cmdExtractSelection__',
        },
        cmdCopyAll: {
          description: '__MSG_cmdCopyAll__',
          suggested_key: { default: 'Alt+Shift+C' },
        },
        cmdCopySelection: {
          description: '__MSG_cmdCopySelection__',
        },
      },

      ...(isFirefox
        ? {
            browser_specific_settings: {
              gecko: {
                id: 'link-extractor-beta@cssnr.com',
                strict_min_version: '112.0',
                data_collection_permissions: {
                  required: ['none'],
                },
              },
              gecko_android: {
                strict_min_version: '120.0',
              },
            },
          }
        : {
            minimum_chrome_version: '88',
          }),
    }
  },

  // NOTE: Override with web-ext.config.ts
  webExt: {
    disabled: true,
  },

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
