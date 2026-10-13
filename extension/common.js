(function (root) {
  const languages=Object.freeze([['zh-CN','简体中文'],['zh-TW','繁体中文'],['en','英语'],['ja','日语'],['ko','韩语'],['fr','法语'],['de','德语'],['es','西班牙语'],['pt','葡萄牙语'],['it','意大利语'],['ru','俄语'],['ar','阿拉伯语'],['hi','印地语'],['th','泰语'],['vi','越南语'],['id','印度尼西亚语']]);
  const defaults = Object.freeze({mode: 'panel', scope: 'all', provider: 'google', endpoint: '', apiKey: '', model: '', fontSize: 14, autoStart: false,autoSites:[],sourceLanguage:'auto',targetLanguage:'zh-CN',uiLanguage:'system'});
  function normalize(text) { return String(text || '').replace(/\r\n?/g,'\n').replace(/[^\S\n]+/g,' ').replace(/ *\n */g,'\n').replace(/\n{3,}/g,'\n\n').trim(); }
  function language(text,hint='') {
    if (/[\u3040-\u30ff\uff66-\uff9f]/u.test(text)) return 'ja';
    if (/終了|総復習|履歴|学習|出典|解説|会議/u.test(text))return 'ja';
    const han=(text.match(/[\u3400-\u9fff]/gu)||[]).length;
    if(han&&/^ja(?:-|$)/i.test(hint))return 'ja';
    if(han/(text.match(/\p{L}/gu)||[]).length>.2)return 'zh';
    if (/[A-Za-z]{2}/u.test(text)) return 'en';
    return /\p{L}/u.test(text)?'foreign':'auto';
  }
  function eligible(text, scope = 'all',hint='',targetLanguage='zh-CN') {
    text = normalize(text);
    if (!text || text.length > 6000 || /^(?:https?:\/\/|[^\s@]+@[^\s@]+\.[^\s@]+)/i.test(text)) return false;
    if (/^[\d\s\p{P}\p{S}]+$/u.test(text) || /^\(?[A-D]\)?[.)]?$/i.test(text)) return false;
    const lang = language(text,hint);
    if(/^zh/.test(targetLanguage)&&lang==='zh')return false;
    if (scope === 'ja') return lang === 'ja';
    if (scope === 'en') return lang === 'en';
    return lang !== 'auto';
  }
  function settings(value = {}) {
    const {imageTranslation,...clean}=value;value=clean;
    return {...defaults, ...value,
      uiLanguage: ['system','zh-CN','en','ja'].includes(value.uiLanguage)?value.uiLanguage:'system',
      mode: ['panel','inline'].includes(value.mode) ? value.mode : defaults.mode,
      scope: ['all','ja','en'].includes(value.scope) ? value.scope : defaults.scope,
      provider: ['google','compatible'].includes(value.provider) ? value.provider : defaults.provider,
      sourceLanguage: value.sourceLanguage==='auto'||languages.some(([code])=>code===value.sourceLanguage)?value.sourceLanguage:'auto',
      targetLanguage: languages.some(([code])=>code===value.targetLanguage)?value.targetLanguage:'zh-CN',
      autoSites:Array.isArray(value.autoSites)?value.autoSites.filter(origin=>{try{return /^https?:$/.test(new URL(origin).protocol)&&new URL(origin).origin===origin;}catch{return false;}}).slice(0,100):value.autoStart?['https://app.abceed.com']:[],
      fontSize: Math.max(12, Math.min(22, Number(value.fontSize) || defaults.fontSize)),
      autoStart: value.autoStart === true};
  }
  function autoEnabled(config,origin){return config.autoStart&&config.autoSites.includes(origin);}
  function endpointURL(value) {
    const url = new URL(value);
    if (url.username || url.password || url.search || url.hash) throw new Error('接口地址不能包含账号、查询参数或片段。');
    if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost','127.0.0.1'].includes(url.hostname))) throw new Error('接口需使用 HTTPS；本机服务可使用 HTTP。');
    url.pathname = url.pathname.replace(/\/+$/, '');
    if (!url.pathname.endsWith('/chat/completions')) url.pathname += '/chat/completions';
    return url;
  }
  const api = {defaults,languages, normalize, language, eligible, settings, endpointURL,autoEnabled};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.AbceedCommon = api;
})(globalThis);
