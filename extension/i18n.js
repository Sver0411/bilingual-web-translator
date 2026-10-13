(function(root){
 const messages={
 "双语伴读": {
  "en": "Bilingual Reader",
  "ja": "バイリンガルリーダー"
 },
 "双语伴读 · 网页翻译": {
  "en": "Bilingual Reader · Web translation",
  "ja": "バイリンガルリーダー · ウェブ翻訳"
 },
 "保留原文，随时对照": {
  "en": "Keep the original, read side by side",
  "ja": "原文を残して、訳文と見比べる"
 },
 "普通网页实时双语翻译，动态内容自动更新。": {
  "en": "Live bilingual translation for web pages. New content updates automatically.",
  "ja": "ウェブページをリアルタイムで対訳表示。新しい内容も自動で翻訳します。"
 },
 "正在连接当前网页…": {
  "en": "Connecting to this page…",
  "ja": "ページに接続中…"
 },
 "翻译当前页": {
  "en": "Translate this page",
  "ja": "このページを翻訳"
 },
 "关闭本页翻译": {
  "en": "Turn off translation",
  "ja": "翻訳を終了"
 },
 "源语言": {
  "en": "Source language",
  "ja": "原文の言語"
 },
 "目标语言": {
  "en": "Target language",
  "ja": "翻訳先の言語"
 },
 "界面语言": {
  "en": "Interface language",
  "ja": "表示言語"
 },
 "跟随系统": {
  "en": "System default",
  "ja": "システムに合わせる"
 },
 "自动检测 · 所有语言": {
  "en": "Detect automatically · All languages",
  "ja": "自動検出 · すべての言語"
 },
 "译文显示方式": {
  "en": "Translation display",
  "ja": "訳文の表示方法"
 },
 "悬浮对照 · 保留原页面布局": {
  "en": "Floating panel · Keep page layout",
  "ja": "フローティングパネル · レイアウトを維持"
 },
 "悬浮对照 · 保留页面布局": {
  "en": "Floating panel · Keep page layout",
  "ja": "フローティングパネル · レイアウトを維持"
 },
 "悬浮对照 · 保留布局": {
  "en": "Floating panel",
  "ja": "フローティングパネル"
 },
 "原文下方 · 追加译文": {
  "en": "Below the original · Add translations",
  "ja": "原文の下に訳文を追加"
 },
 "原文下方 · 双语段落": {
  "en": "Below the original",
  "ja": "原文の下に訳文を表示"
 },
 "译文在可移动面板中显示，原页面布局保持原样。": {
  "en": "Translations appear in a movable panel, preserving the page layout.",
  "ja": "移動できるパネルに訳文を表示し、ページのレイアウトを維持します。"
 },
 "原文下方追加译文；关闭后恢复扩展调整的样式。": {
  "en": "Add translations below the original. Turning off restores adjusted styles.",
  "ja": "原文の下に訳文を追加。終了すると変更したスタイルを元に戻します。"
 },
 "在此网站自动翻译": {
  "en": "Automatically translate this site",
  "ja": "このサイトを自動翻訳"
 },
 "开启后，文字发送给所选翻译服务。图片、输入框和登录表单保持原样。": {
  "en": "When enabled, text is sent to your translation service. Images, inputs and login forms stay unchanged.",
  "ja": "有効にすると文章を選択した翻訳サービスに送信します。画像・入力欄・ログインフォームは変更しません。"
 },
 "Alt+A 快速开关": {
  "en": "Alt+A to toggle",
  "ja": "Alt+A で切り替え"
 },
 "设置与翻译服务 →": {
  "en": "Settings & translation service →",
  "ja": "設定・翻訳サービス →"
 },
 "设置已更新，当前页译文会重新生成。": {
  "en": "Settings updated. Page translations will refresh.",
  "ja": "設定を更新しました。訳文を更新します。"
 },
 "界面语言已保存。": {
  "en": "Interface language saved.",
  "ja": "表示言語を保存しました。"
 },
 "已开启，滚动、展开内容和页面更新时会自动翻译。": {
  "en": "Enabled. Scrolling, expanding and new content are translated automatically.",
  "ja": "有効にしました。スクロール・展開・更新時に自動で翻訳します。"
 },
 "已关闭，追加译文已移除。": {
  "en": "Disabled. Added translations have been removed.",
  "ja": "終了し、追加した訳文を削除しました。"
 },
 "页面连接已失效，请刷新后重试。": {
  "en": "Page connection lost. Refresh the page and try again.",
  "ja": "接続が切れました。ページを再読み込みしてください。"
 },
 "未授权此网站；仍可手动翻译当前页。": {
  "en": "Site permission denied. You can still translate this page manually.",
  "ja": "権限が許可されませんでした。このページは手動で翻訳できます。"
 },
 "此网站以后会自动翻译。": {
  "en": "This site will be translated automatically.",
  "ja": "今後このサイトを自動で翻訳します。"
 },
 "此网站以后不再自动开启翻译。": {
  "en": "Automatic translation is off for this site.",
  "ja": "このサイトの自動翻訳を解除しました。"
 },
 "此页面受浏览器限制": {
  "en": "This page is restricted by the browser",
  "ja": "ブラウザにより制限されたページです"
 },
 "请在普通 HTTP 或 HTTPS 网页中使用。": {
  "en": "Use this extension on an HTTP or HTTPS web page.",
  "ja": "通常の HTTP または HTTPS ページで使用してください。"
 },
 "当前网页": {
  "en": "Current page",
  "ja": "現在のページ"
 },
 "双语伴读 · 设置": {
  "en": "Bilingual Reader · Settings",
  "ja": "バイリンガルリーダー · 設定"
 },
 "按你的阅读习惯设置": {
  "en": "Set up your reading experience",
  "ja": "読み方に合わせて設定"
 },
 "通用网页双语翻译，保留原文与交互，语言和显示方式可自由切换。": {
  "en": "Bilingual web translation that preserves original text and interactions. Choose your languages and display style.",
  "ja": "原文と操作を維持するウェブ対訳表示。言語と表示方法を自由に選べます。"
 },
 "阅读方式": {
  "en": "Reading preferences",
  "ja": "読み方"
 },
 "追加译文会增加段落高度。按钮、链接和卡片也会显示双语；关闭时恢复扩展调整过的样式。": {
  "en": "Added translations increase paragraph height. Buttons, links and cards can also show both languages. Turning off restores adjusted styles.",
  "ja": "訳文を追加すると段落が高くなります。ボタン・リンク・カードにも対訳を表示し、終了時にスタイルを元に戻します。"
 },
 "自动检测源语言，或手动选择常用语言。目标语言提供 16 种常用语言。": {
  "en": "Detect the source automatically or choose a common language. Choose from 16 target languages.",
  "ja": "原文の言語を自動検出、または手動で選択。翻訳先は16言語から選べます。"
 },
 "译文字号": {
  "en": "Translation font size",
  "ja": "訳文の文字サイズ"
 },
 "自动翻译已授权的网站": {
  "en": "Automatically translate authorized sites",
  "ja": "許可済みサイトを自動翻訳"
 },
 "翻译服务": {
  "en": "Translation service",
  "ja": "翻訳サービス"
 },
 "服务": {
  "en": "Service",
  "ja": "サービス"
 },
 "Google 翻译 · 无需填写密钥": {
  "en": "Google Translate · No API key required",
  "ja": "Google 翻訳 · APIキー不要"
 },
 "自定义兼容接口": {
  "en": "Custom compatible API",
  "ja": "カスタム互換API"
 },
 "使用 Google 网页翻译接口，需要能访问 translate.googleapis.com。此接口没有稳定性保证，遇到限流或网络问题可换用自己的服务。": {
  "en": "Uses the Google web translation endpoint at translate.googleapis.com. Availability is not guaranteed; you can switch to your own service.",
  "ja": "translate.googleapis.com のウェブ翻訳APIを使用します。安定性は保証されません。独自サービスにも切り替えられます。"
 },
 "API 地址": {
  "en": "API endpoint",
  "ja": "APIアドレス"
 },
 "https://你的服务地址/v1": {
  "en": "https://your-service.example/v1",
  "ja": "https://your-service.example/v1"
 },
 "兼容 /chat/completions。支持 HTTPS 或本机 HTTP 服务；保存时只申请此服务域名的访问权限。": {
  "en": "Compatible with /chat/completions. Supports HTTPS or local HTTP; saving requests access only to this service domain.",
  "ja": "/chat/completions 互換。HTTPS またはローカル HTTP に対応。保存時にこのサービスのドメインのみアクセスを申請します。"
 },
 "模型名称": {
  "en": "Model name",
  "ja": "モデル名"
 },
 "填写你的服务提供的模型名称": {
  "en": "Enter your service’s model name",
  "ja": "サービスのモデル名を入力"
 },
 "API 密钥": {
  "en": "API key",
  "ja": "APIキー"
 },
 "本机无密钥服务可留空": {
  "en": "Optional for local services without keys",
  "ja": "キー不要のローカルサービスは空欄可"
 },
 "密钥仅保存在本机扩展设置，不会同步。网页内容仅作翻译，不执行其中的指令。": {
  "en": "Your key is stored locally and is not synced. Page content is translated as text; instructions within it are not executed.",
  "ja": "キーはローカル設定にのみ保存し、同期しません。ページ内容は文章として翻訳し、含まれる指示は実行しません。"
 },
 "开启伴读后，会把屏幕附近的可见文字发送给你选择的翻译服务。关闭后停止新增请求。扩展不读取登录表单、密码、输入框或 Cookie；译文只在内存缓存，最多 500 条。": {
  "en": "When enabled, visible text near the viewport is sent to your translation service. Turning off stops new requests. Login forms, passwords, input fields and cookies are not read. Up to 500 translations are cached in memory.",
  "ja": "有効時は画面付近の表示文章を翻訳サービスに送信し、終了後は新規リクエストを停止します。ログインフォーム・パスワード・入力欄・Cookieは読みません。訳文はメモリに最大500件保存します。"
 },
 "保存设置": {
  "en": "Save settings",
  "ja": "設定を保存"
 },
 "测试已保存的服务": {
  "en": "Test saved service",
  "ja": "保存済みサービスをテスト"
 },
 "使用方法": {
  "en": "How to use",
  "ja": "使い方"
 },
 "在普通网页点击扩展图标，再点「翻译当前页」。勾选「在此网站自动翻译」后，访问该网站时自动开启。": {
  "en": "On a web page, click the extension icon and “Translate this page”. Enable “Automatically translate this site” to translate on future visits.",
  "ja": "ウェブページで拡張アイコンを押し「このページを翻訳」を選択。「このサイトを自動翻訳」を有効にすると、次回から自動で翻訳します。"
 },
 "悬浮面板标题栏可拖动，点击译文定位原文。Alt+A 开关伴读，关闭后移除追加的译文。滚动、展开内容或页面更新时自动翻译新文字。": {
  "en": "Drag the panel title bar to move it, or click a translation to locate its original. Alt+A toggles translation. New text updates as you scroll or expand the page.",
  "ja": "パネルのタイトルバーをドラッグして移動、訳文を押すと原文に移動します。Alt+Aで切り替え。スクロール・展開・更新時に新しい文章を翻訳します。"
 },
 "仅翻译页面上的真实文字；图片和 Canvas 保持原样。": {
  "en": "Translates page text only. Images and canvas content stay unchanged.",
  "ja": "ページ上の文章のみ翻訳します。画像やCanvasは変更しません。"
 },
 "请填写模型名称。": {
  "en": "Enter a model name.",
  "ja": "モデル名を入力してください。"
 },
 "尚未授权此翻译服务域名。": {
  "en": "Permission for this translation service was denied.",
  "ja": "翻訳サービスへのアクセスが許可されていません。"
 },
 "设置已保存，正在使用的伴读会自动更新。": {
  "en": "Settings saved. Active readers update automatically.",
  "ja": "設定を保存しました。使用中の表示も自動更新します。"
 },
 "正在测试已保存的翻译服务…": {
  "en": "Testing the saved translation service…",
  "ja": "保存済み翻訳サービスをテスト中…"
 },
 "连接成功：{result}": {
  "en": "Connected: {result}",
  "ja": "接続成功：{result}"
 },
 "测试失败：{error}": {
  "en": "Test failed: {error}",
  "ja": "テスト失敗：{error}"
 },
 "收起 / 展开": {
  "en": "Collapse / Expand",
  "ja": "折りたたみ / 展開"
 },
 "收起或展开双语伴读": {
  "en": "Collapse or expand the reader",
  "ja": "リーダーを折りたたみ・展開"
 },
 "关闭伴读（Alt+A 再开启）": {
  "en": "Close reader (Alt+A to reopen)",
  "ja": "リーダーを閉じる（Alt+Aで再開）"
 },
 "关闭双语伴读": {
  "en": "Close reader",
  "ja": "リーダーを閉じる"
 },
 "重试": {
  "en": "Retry",
  "ja": "再試行"
 },
 "移动标题栏调整位置 · 点击译文定位原文\n悬停原文查看译文 · Alt+A 显示 / 隐藏": {
  "en": "Drag the title bar to move · Click a translation to locate its original\nHover over text to see its translation · Alt+A to toggle",
  "ja": "タイトルバーをドラッグして移動 · 訳文を押して原文へ\n原文にカーソルを合わせて訳文表示 · Alt+Aで切り替え"
 },
 "翻译服务未返回结果。": {
  "en": "The translation service returned no result.",
  "ja": "翻訳結果が返されませんでした。"
 },
 "翻译失败，请重试。": {
  "en": "Translation failed. Please retry.",
  "ja": "翻訳に失敗しました。再試行してください。"
 },
 "当前区域 {done} / {total} 段{placement}": {
  "en": "Visible area: {done} / {total} segments {placement}",
  "ja": "表示範囲：{done} / {total} 件{placement}"
 },
 "已显示于原文下方": {
  "en": "shown below originals",
  "ja": "原文の下に表示済み"
 },
 "已翻译": {
  "en": "translated",
  "ja": "翻訳済み"
 },
 " · 翻译中…": {
  "en": " · Translating…",
  "ja": " · 翻訳中…"
 },
 " · {failed} 段失败，点击重试": {
  "en": " · {failed} failed, click Retry",
  "ja": " · {failed}件失敗、再試行してください"
 },
 "当前区域没有需要翻译的文字。滚动页面或展开内容后会自动更新。": {
  "en": "No text to translate here. Scroll or expand content to update automatically.",
  "ja": "この範囲に翻訳する文章はありません。スクロールや展開で自動更新します。"
 },
 "定位对应原文": {
  "en": "Locate original text",
  "ja": "対応する原文へ"
 },
 "正在翻译…": {
  "en": "Translating…",
  "ja": "翻訳中…"
 }
};
 const locales=['system','zh-CN','en','ja'];
 function resolve(value='system',system){
  if(locales.includes(value)&&value!=='system')return value;
  const hint=system||root.chrome?.i18n?.getUILanguage?.()||root.navigator?.languages?.[0]||root.navigator?.language||'en';
  return /^zh/i.test(hint)?'zh-CN':/^ja/i.test(hint)?'ja':'en';
 }
 function t(key,locale,values={}){const http=key.match(/^翻译服务返回 HTTP (\d+)。$/);if(http){key='翻译服务返回 HTTP {status}。';values={...values,status:http[1]};}return (messages[key]?.[resolve(locale)]||key).replace(/\{(\w+)\}/g,(_,name)=>String(values[name]??`{${name}}`));}
 Object.assign(messages,{"此页面受浏览器限制，无法翻译。": {"en": "This page is restricted by the browser.", "ja": "ブラウザにより制限されたページです。"}, "此页面无法翻译。": {"en": "This page cannot be translated.", "ja": "このページは翻訳できません。"}, "没有可翻译的文本。": {"en": "No text to translate.", "ja": "翻訳する文章がありません。"}, "待翻译段落过多，请稍后重试。": {"en": "Too many pending segments. Try again shortly.", "ja": "翻訳待ちの文章が多すぎます。しばらくしてから再試行してください。"}, "翻译配置已更新，请重试。": {"en": "Translation settings changed. Please retry.", "ja": "翻訳設定が変更されました。再試行してください。"}, "翻译请求超时，请检查网络后重试。": {"en": "Translation timed out. Check your network and retry.", "ja": "翻訳がタイムアウトしました。ネットワークを確認してください。"}, "无法连接页面，请刷新后重试。": {"en": "Cannot connect to this page. Refresh and retry.", "ja": "ページに接続できません。再読み込みしてください。"}, "接口地址不能包含账号、查询参数或片段。": {"en": "The endpoint cannot contain credentials, query parameters or fragments.", "ja": "APIアドレスに認証情報・クエリ・フラグメントは使用できません。"}, "接口需使用 HTTPS；本机服务可使用 HTTP。": {"en": "Use HTTPS for the endpoint. Local services may use HTTP.", "ja": "APIはHTTPSを使用してください。ローカルサービスはHTTPも使用できます。"}, "翻译服务请求过于频繁，请稍后重试。": {"en": "The translation service is rate limited. Try again later.", "ja": "翻訳サービスのリクエスト制限に達しました。しばらくしてから再試行してください。"}, "翻译服务未保留题目中的空格或术语，请换用自定义服务。": {"en": "The service did not preserve placeholders or terms. Try a custom service.", "ja": "空欄や用語が保持されませんでした。カスタムサービスを試してください。"}, "翻译服务未返回有效译文。": {"en": "The service returned no valid translation.", "ja": "有効な訳文が返されませんでした。"}, "请先在设置中填写模型名称。": {"en": "Enter a model name in Settings first.", "ja": "先に設定でモデル名を入力してください。"}, "接口未返回译文，请检查模型和接口格式。": {"en": "No translation returned. Check the model and API format.", "ja": "訳文が返されませんでした。モデルとAPI形式を確認してください。"}, "翻译服务返回 HTTP {status}。": {"en": "The translation service returned HTTP {status}.", "ja": "翻訳サービスがHTTP {status}を返しました。"}});
 const originals=new WeakMap();
 function apply(container,locale){
  const document=container.ownerDocument||container;
  const walker=document.createTreeWalker(container,4);
  while(walker.nextNode()){
   const node=walker.currentNode;if(node.parentElement?.closest('script,style,.source,.translation,#list'))continue;
   const key=originals.get(node)||node.textContent.trim();if(!messages[key])continue;
   originals.set(node,key);node.textContent=t(key,locale);
  }
  for(const element of container.querySelectorAll('[placeholder],[title],[aria-label]')){
   let saved=originals.get(element);if(!saved){saved={};originals.set(element,saved);}
   for(const attr of ['placeholder','title','aria-label']){const key=saved[attr]||element.getAttribute(attr);if(messages[key]){saved[attr]=key;element.setAttribute(attr,t(key,locale));}}
  }
 }
 function languageName(code,locale){try{return new Intl.DisplayNames([resolve(locale)],{type:'language'}).of(code==='zh-CN'?'zh-Hans':code==='zh-TW'?'zh-Hant':code);}catch{return code;}}
 function populate(select,locale,auto=false){const value=select.value;select.replaceChildren();if(auto)select.add(new Option(t('自动检测 · 所有语言',locale),'auto'));for(const [code]of root.AbceedCommon.languages)select.add(new Option(languageName(code,locale),code));if(value)select.value=value;}
 function uiOptions(select,locale){const value=select.value||'system';select.replaceChildren();for(const [code,label]of [['system',t('跟随系统',locale)],['zh-CN','简体中文'],['en','English'],['ja','日本語']])select.add(new Option(label,code));select.value=value;}
 const api={locales,resolve,t,apply,languageName,populate,uiOptions};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ReaderI18n=api;
})(globalThis);
