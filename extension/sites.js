(function(root){
  const files=['common.js','i18n.js','engine.js','content.js'];
  function supported(value){try{const url=new URL(value);return ['http:','https:'].includes(url.protocol)&&url.hostname!=='chromewebstore.google.com'&&!(url.hostname==='chrome.google.com'&&url.pathname.startsWith('/webstore'));}catch{return false;}}
  function pattern(origin){const url=new URL(origin);if(!supported(origin))throw new Error('此页面受浏览器限制，无法翻译。');return `${url.protocol}//${url.hostname}/*`;}
  function id(origin){let hash=2166136261;for(const letter of origin)hash=Math.imul(hash^letter.charCodeAt(0),16777619);return `reader-site-${(hash>>>0).toString(16)}`;}
  async function sync(chrome,config){
    const registered=await chrome.scripting.getRegisteredContentScripts();const desired=[];
    if(config.autoStart)for(const origin of config.autoSites){
      if(origin==='https://app.abceed.com'||!supported(origin))continue;
      if(await chrome.permissions.contains({origins:[pattern(origin)]}))desired.push({id:id(origin),matches:[pattern(origin)],js:files,runAt:'document_idle',allFrames:true,persistAcrossSessions:true});
    }
    const remove=registered.filter(script=>script.id.startsWith('reader-site-')&&!desired.some(value=>value.id===script.id)).map(script=>script.id);
    if(remove.length)await chrome.scripting.unregisterContentScripts({ids:remove});
    const update=desired.filter(script=>registered.some(value=>value.id===script.id&&JSON.stringify(value.js)!==JSON.stringify(script.js)));if(update.length)await chrome.scripting.updateContentScripts(update);
    const add=desired.filter(script=>!registered.some(value=>value.id===script.id));if(add.length)await chrome.scripting.registerContentScripts(add);
  }
  const api={files,supported,pattern,id,sync};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.AbceedSites=api;
})(globalThis);
