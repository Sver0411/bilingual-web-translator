<h1 align="center">🌐 双语网页翻译器</h1>

<p align="center">
  <strong>保留原文的实时双语网页翻译</strong><br>
  在熟悉的网页里，按自己的语言习惯阅读。
</p>

<p align="center">
  <img src="docs/assets/reading-banner.svg" alt="英文原文与中文译文对照示意" width="100%">
</p>

<p align="center">
  <a href="extension/manifest.json"><img src="docs/assets/badge-version.svg" alt="版本 0.2.1"></a>
  <img src="docs/assets/badge-chrome.svg" alt="Chrome Manifest V3">
  <a href="#languages"><img src="docs/assets/badge-languages.svg" alt="16 种目标语言"></a>
  <a href="LICENSE"><img src="docs/assets/badge-license.svg" alt="MIT 许可证"></a>
</p>

<p align="center">
  📖 保留原文 &nbsp; · &nbsp; ⚡ 动态内容自动更新 &nbsp; · &nbsp; 🎛️ 翻译语言自由切换
</p>

<p align="center">
  <a href="https://github.com/Sver0411/bilingual-web-translator/raw/refs/heads/main/bilingual-web-translator.zip"><strong>📥 下载扩展</strong></a>
  &nbsp; · &nbsp;
  <a href="README.md"><strong>🌐 English README</strong></a>
</p>

---

<p align="center">
  <a href="#features">✨ 功能</a> &nbsp; · &nbsp;
  <a href="#install">🚀 安装</a> &nbsp; · &nbsp;
  <a href="#usage">🎛️ 使用</a> &nbsp; · &nbsp;
  <a href="#languages">🌍 语言</a> &nbsp; · &nbsp;
  <a href="#privacy">🔒 隐私</a> &nbsp; · &nbsp;
  <a href="#development">🛠️ 开发</a>
</p>

---

在普通 HTTP / HTTPS 网页中显示译文，同时保留原文与页面交互。扩展在 Chrome 中显示为 **「双语伴读」**，支持段落、按钮、链接、卡片、动态内容和开放的 Shadow DOM。

<a id="features"></a>
## ✨ 阅读时用得上的功能

| 📖 原文译文随时对照 | ⚡ 跟上页面内容变化 | 🌍 按自己的语言阅读 |
| :--- | :--- | :--- |
| 在悬浮面板或原文下方显示译文，原文始终保留。 | 滚动、展开内容或页面更新后，自动翻译新出现的可见文字。 | 自动检测源语言，自由选择 16 种目标语言。 |

| 功能 | 使用效果 |
| :--- | :--- |
| 🪟 **悬浮对照** | 译文在可移动、可收起的面板中显示，原页面布局保持原样 |
| 📝 **原文下方** | 在支持的段落、按钮、链接和卡片中追加译文 |
| 🔄 **动态更新** | 开启伴读时，自动翻译新出现的可见文字 |
| 📌 **按网站自动开启** | 为单独授权的网站开启自动翻译 |
| 🗣️ **翻译语言** | 自动检测或手动选择源语言，目标语言独立设置 |
| 🎨 **界面语言** | 在设置页选择跟随系统、简体中文、英文或日文 |
| 🔌 **翻译服务** | 默认 Google 网页翻译，或配置自己的兼容接口 |

<a id="install"></a>
## 🚀 三步开始使用

| 步骤 | 操作 |
| :--- | :--- |
| **1 · 📥 下载** | 解压 [bilingual-web-translator.zip](https://github.com/Sver0411/bilingual-web-translator/raw/refs/heads/main/bilingual-web-translator.zip)，或克隆仓库后使用 `extension` 文件夹。 |
| **2 · 🧩 加载** | 打开 `chrome://extensions`，开启**开发者模式**，点击**加载未打包的扩展程序**，选择直接包含 `manifest.json` 的文件夹。 |
| **3 · 📖 阅读** | 刷新网页，点击扩展图标，再点**翻译当前页**。 |

> 💡 **无需构建，也无需默认 API 密钥。** 需要 Chrome 116+，且网络能够访问 `translate.googleapis.com`。

<a id="usage"></a>
## 🎛️ 按阅读习惯调整

| 想要…… | 可以这样做 |
| :--- | :--- |
| ⌨️ 快速开关翻译 | 在当前页按 **Alt+A**。 |
| 🗣️ 切换翻译语言 | 在弹窗选择**源语言**和**目标语言**。 |
| 🪟 保持原页面布局 | 选择**悬浮对照**，拖动标题栏即可移动面板。 |
| 📝 在每段原文下方阅读译文 | 选择**原文下方**。 |
| 🔎 找到译文对应的原文 | 点击悬浮面板里的译文；悬停原文可查看译文。 |
| 📌 每次访问网站都自动翻译 | 勾选**在此网站自动翻译**并允许 Chrome 的网站访问请求；取消勾选可停用。 |
| 🎨 更换插件界面语言 | 打开**设置与翻译服务**，选择界面语言，再点**保存设置**。 |

**默认使用悬浮模式。** 原文下方追加译文会增加段落或控件高度；关闭时移除译文，并恢复扩展调整过的样式。

<a id="languages"></a>
## 🌍 三种语言设置，分别选择

| 设置项 | 可选范围 |
| :--- | :--- |
| **源语言** | 自动检测，或手动选择 16 种常用语言 |
| **目标语言** | 16 种常用语言任选 |
| **界面语言** | 跟随系统、简体中文、英文、日文 |

自动检测由所选翻译服务完成，不限于手动列表中的语言。界面语言默认匹配 Chrome 提供的界面语言，支持中文、英文和日文，其他语言回退为英文。切换界面语言不会改变翻译语言，也不会重新翻译网页。

<details>
<summary><strong>🗺️ 查看全部 16 种源语言与目标语言</strong></summary>

| 语言 | 语言 |
| :--- | :--- |
| 简体中文 | 繁体中文 |
| 英语 | 日语 |
| 韩语 | 法语 |
| 德语 | 西班牙语 |
| 葡萄牙语 | 意大利语 |
| 俄语 | 阿拉伯语 |
| 印地语 | 泰语 |
| 越南语 | 印度尼西亚语 |

</details>

<a id="privacy"></a>
## 🔒 翻译服务与隐私

- **文字发送给你选择的服务。** 开启时发送屏幕附近的可见文字；关闭后停止新请求，已发送的请求可能仍在完成。
- **输入内容不参与翻译。** 排除登录表单、密码、输入框和 Cookie；最多 500 条译文仅缓存在内存中。
- **自动翻译按网站授权。** 手动翻译使用 `activeTab` 临时权限；仅为明确授权的网站登记自动注入脚本。

默认 Google 网页接口不保证可用性或翻译准确度。网络不可达或限流时可重试，或在设置中配置自己的翻译服务。

<details>
<summary><strong>🔌 自定义服务与权限说明</strong></summary>

自定义服务需兼容 `/chat/completions`，使用 HTTPS；本机 HTTP 服务也可使用。API 密钥只保存在本机扩展设置，不同步。保存时仅申请该服务域名的访问权限。

保留原有 abceed 内容脚本范围，以兼容旧设置。首次授权弹窗可能关闭快捷界面，后台会保存待处理选择，在权限授予后完成自动翻译设置。

</details>

## 📋 支持内容与使用边界

| 支持内容 | 保持原样或受到限制的内容 |
| :--- | :--- |
| 普通 HTTP / HTTPS 网页文字、支持的控件、动态内容、开放的 Shadow DOM | 图片、Canvas、输入框和登录表单保持原样；没有图片识别或上传图片的流程。 |
| 悬浮对照、原文下方追加译文 | Chrome 内部页面、扩展商店和内置 PDF 阅读器限制脚本注入。 |

闭合 Shadow DOM、未授权跨域嵌入页面、视频字幕和原生应用不保证支持。

> 📖 **使用网页的原文视图。** Chrome 自带的整页翻译会替换原文，可能影响双语对照阅读。

<a id="development"></a>
## 🛠️ 开发与验证

```sh
npm ci
npm run check
npm test
npm run serve
```

本地演示页：**`http://127.0.0.1:4173/`**。使用自编英日练习题，以及扩展同一份文字引擎和显示代码，不包含真实 abceed 题库。

**🧪 24 项自动测试**覆盖原文节点及点击事件保留、样式恢复、动态内容和迟到响应、开放 Shadow DOM、源语言与目标语言传参、界面语言独立性，以及授权弹窗销毁后的设置持久化。详见[验证记录](docs/验证记录.md)。

<details>
<summary><strong>🗂️ 项目结构</strong></summary>

| 文件 | 用途 |
| :--- | :--- |
| `extension/common.js` | 设置与文字过滤 |
| `extension/i18n.js` | 界面本地化 |
| `extension/engine.js` | 文字提取 |
| `extension/content.js` | 双语显示与动态更新 |
| `extension/sites.js`、`extension/auto-sites.js` | 网站授权与自动注入 |
| `extension/background.js`、`extension/providers.js` | 翻译调度与服务适配 |
| `extension/popup.html`、`extension/options.html` | 弹窗与设置界面 |

</details>

这是独立实现的双语扩展，未复制沉浸式翻译的私有代码、图标或品牌资源，也不声称具备原产品全部功能。

---

<p align="center">
  📖 保留原文，轻松对照。<br>
  <a href="LICENSE">MIT 许可证</a> &nbsp; · &nbsp; <a href="README.md">English</a>
</p>
