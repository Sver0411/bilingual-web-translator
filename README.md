# Bilingual Web Translator

| Version | Platform | License | Translation languages |
| :--- | :--- | :--- | :--- |
| 0.2.1 | Chrome 116+ · Manifest V3 | [MIT](LICENSE) | Automatic source detection · 16 target languages |

**English** · [简体中文 README](README.zh-CN.md)

A Chrome extension for reading web pages with translations alongside the original text. It appears as **Bilingual Reader** in the browser and supports ordinary HTTP and HTTPS websites, dynamic content, buttons, links, and open Shadow DOM. Original text and interactions are preserved.

## Features

| Feature | Behavior |
| :--- | :--- |
| Source language | Detect automatically, or select one of 16 common languages |
| Target language | Choose any of the 16 supported languages |
| Floating panel | View translations in a movable, collapsible panel while preserving the page layout |
| Below the original | Append translations beneath text, including supported buttons, links, and cards |
| Dynamic pages | Translate new visible text when you scroll, expand content, or navigate within a page |
| Per-site automation | Enable automatic translation for individual authorized websites |
| Interface language | System default, Simplified Chinese, English, or Japanese; available only in Settings |
| Translation service | Google web translation, or your own chat-completions-compatible API |

The available source and target languages are Simplified Chinese, Traditional Chinese, English, Japanese, Korean, French, German, Spanish, Portuguese, Italian, Russian, Arabic, Hindi, Thai, Vietnamese, and Indonesian. Automatic source detection is performed by the selected translation service and is not limited to the manual language list.

Interface language is independent of the source and target languages. Switching the interface language does not translate the page again. System default matches the browser-provided UI locale to Chinese, English, or Japanese, with English as the fallback.

## Install

1. Download and extract [bilingual-web-translator.zip](bilingual-web-translator.zip), or clone this repository and use its `extension` folder.
2. Open `chrome://extensions` in Chrome and enable **Developer mode**.
3. Click **Load unpacked** and select the folder that directly contains `manifest.json`.
4. Refresh the web page you want to translate, click the extension icon, and select **Translate this page**.

No build step or API key is required for the default Google service. Your network must be able to reach `translate.googleapis.com`.

## Use

- Use **Alt+A** to toggle translation on the current page.
- Choose the source language, target language, and display mode in the extension popup.
- Drag the floating panel's title bar to move it. Click a translation to locate its original text; hover over source text to view its translation.
- Enable **Automatically translate this site**, then allow Chrome's permission request for that website. Subsequent visits will translate automatically. Uncheck it to stop automatic activation.
- Open **Settings & translation service** to change the interface language, font size, or translation provider. Click **Save settings** to apply your choices.

Floating mode is the default and preserves the original page layout. Appending translations below the original can increase paragraph and control heights. Turning translation off removes added translations and restores styles adjusted by the extension.

## Translation services and privacy

When translation is enabled, visible text near the viewport is sent to the selected translation service. Turning it off stops new requests; requests already sent may still finish. The extension excludes login forms, passwords, input fields, and cookies. Up to 500 translations are cached in memory.

The default Google web endpoint does not guarantee availability or translation accuracy. If it is unreachable or rate limited, retry or configure your own service in Settings.

Custom services must support `/chat/completions` over HTTPS; local HTTP endpoints are also supported. API keys are stored only in local extension settings and are not synced. Saving a custom service requests permission for that service's domain.

Manual translation uses temporary `activeTab` access. Automatic translation registers content scripts only for websites you explicitly authorize. The existing abceed content-script scope is retained for compatibility with earlier settings. First-time permission dialogs can close the popup; the service worker retains the pending choice and completes setup after permission is granted.

## Supported content and limits

This extension translates page text. Images, canvas content, input fields, and login forms stay unchanged; there is no OCR or image-upload workflow.

Chrome internal pages, the extension store, and the built-in PDF viewer restrict script injection. Closed Shadow DOM, unauthorized cross-origin frames, video subtitles, and native applications are not guaranteed to work. Chrome's built-in whole-page translation can replace the original text, so use the original-language view when reading with this extension.

## Development

```sh
npm ci
npm run check
npm test
npm run serve
```

The local demo is available at `http://127.0.0.1:4173/`. It uses self-authored English and Japanese exercises and the same text engine and display code as the extension. It does not contain the real abceed question bank.

The 24 automated tests cover original text-node identity and click handlers, style restoration, dynamic content and stale responses, open Shadow DOM, source/target language requests, independent interface-language changes, and permission setup that survives popup destruction. See the [validation notes](docs/验证记录.md) for the tested scope.

| File | Purpose |
| :--- | :--- |
| `extension/common.js` | Settings and text filtering |
| `extension/i18n.js` | Interface localization |
| `extension/engine.js` | Text extraction |
| `extension/content.js` | Bilingual display and dynamic updates |
| `extension/sites.js`, `extension/auto-sites.js` | Website permissions and automatic injection |
| `extension/background.js`, `extension/providers.js` | Translation scheduling and provider adapters |
| `extension/popup.html`, `extension/options.html` | Popup and settings interfaces |

This is an independently implemented extension inspired by bilingual reading workflows. It does not include Immersive Translate's proprietary code, icons, or branding, and does not claim feature parity with that product.

## License

[MIT](LICENSE)
