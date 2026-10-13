importScripts('common.js','sites.js','auto-sites.js','providers.js');
const cache = new Map();
const pending = new Map();
const queue = [];
let active = 0;
let revision = 0;
let registration=Promise.resolve();
function syncSites(config){registration=registration.catch(()=>{}).then(()=>AbceedSites.sync(chrome,config));return registration;}
const autoSites=ReaderAutoSites.create(chrome,AbceedCommon,syncSites,async origin=>{
 const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
 if(tab?.id&&AbceedSites.supported(tab.url)&&new URL(tab.url).origin===origin)try{await ensureReader(tab.id);await chrome.tabs.sendMessage(tab.id,{type:'ABCEED_START'},{frameId:0});}catch{}
});
chrome.permissions.onAdded.addListener(()=>autoSites.drain().catch(()=>{}));
chrome.permissions.onRemoved.addListener(()=>chrome.storage.local.get('settings').then(saved=>syncSites(AbceedCommon.settings(saved.settings))).catch(()=>{}));
autoSites.drain().catch(()=>{});
// Revoke the optional image origin granted by the retired OCR version.
chrome.permissions.remove({origins:['https://private.abceed.com/*']}).catch(()=>{});
chrome.runtime.onInstalled.addListener(async () => {
  const saved = await chrome.storage.local.get('settings');
  const config=AbceedCommon.settings({...saved.settings,scope:'all'});
  await chrome.storage.local.set({settings:config});await syncSites(config);
});
chrome.storage.local.get('settings').then(saved=>syncSites(AbceedCommon.settings(saved.settings))).catch(()=>{});
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.settings) {
    const previous=AbceedCommon.settings(changes.settings.oldValue),next=AbceedCommon.settings(changes.settings.newValue);
    if(['provider','endpoint','apiKey','model','sourceLanguage','targetLanguage'].some(key=>previous[key]!==next[key])){revision++;cache.clear();pending.clear();}
    syncSites(next).catch(()=>{});
  }
});
async function pump() {
  if (active >= 3 || !queue.length) return;
  active++;
  const job = queue.shift();
  try { job.resolve(await job.run()); } catch (error) { job.reject(error); }
  finally { active--; pump(); }
}
function schedule(run) { return new Promise((resolve,reject) => { queue.push({run,resolve,reject}); pump(); }); }
async function translation(text) {
  const saved = await chrome.storage.local.get('settings');
  const config = AbceedCommon.settings(saved.settings);
  const key = `${revision}:${config.provider}:${config.sourceLanguage}:${config.targetLanguage}:${text}`;
  if (cache.has(key)) return cache.get(key);
  if (pending.has(key)) return pending.get(key);
  const currentRevision = revision;
  const promise = schedule(async () => {
    if (currentRevision !== revision) throw new Error('翻译配置已更新，请重试。');
    const result = await AbceedProviders.translate(text, config);
    if (currentRevision === revision) {
      if (cache.size >= 500) cache.delete(cache.keys().next().value);
      cache.set(key,result);
    }
    return result;
  });
  pending.set(key,promise);
  try { return await promise; } finally { pending.delete(key); }
}
chrome.runtime.onMessage.addListener((message, sender, reply) => {
  if (message?.type !== 'ABCEED_TRANSLATE') return;
  if (!sender.tab || !AbceedSites.supported(sender.url)) { reply({error:'此页面无法翻译。'}); return; }
  const text = AbceedCommon.normalize(message.text);
  if (!AbceedCommon.eligible(text,'all','','en')) { reply({error:'没有可翻译的文本。'}); return; }
  if (queue.length > 200) { reply({error:'待翻译段落过多，请稍后重试。'}); return; }
  translation(text).then(value => reply({text:value}), error => reply({error:error.name === 'TimeoutError' ? '翻译请求超时，请检查网络后重试。' : error.message || '翻译失败，请重试。'}));
  return true;
});
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'toggle-reader') return;
  const [tab] = await chrome.tabs.query({active:true,currentWindow:true});
  if (tab?.id&&AbceedSites.supported(tab.url))try{await ensureReader(tab.id);await chrome.tabs.sendMessage(tab.id,{type:'ABCEED_TOGGLE'},{frameId:0});}catch{}
});
async function ensureReader(tabId){
  try{return await chrome.tabs.sendMessage(tabId,{type:'ABCEED_READY'},{frameId:0});}catch{}
  await chrome.scripting.executeScript({target:{tabId},files:AbceedSites.files});
  return chrome.tabs.sendMessage(tabId,{type:'ABCEED_READY'},{frameId:0});
}
chrome.runtime.onMessage.addListener((message,sender,reply)=>{
  if(!['ABCEED_CONNECT','ABCEED_SYNC_SITES'].includes(message?.type)||sender.url!==chrome.runtime.getURL('popup.html'))return;
  if(message.type==='ABCEED_SYNC_SITES'){
    chrome.storage.local.get('settings').then(saved=>syncSites(AbceedCommon.settings(saved.settings))).then(()=>reply({ok:true}),error=>reply({error:error.message}));return true;
  }
  chrome.tabs.query({active:true,currentWindow:true}).then(async([tab])=>{
    if(tab?.id!==message.tabId||!AbceedSites.supported(tab.url))throw new Error('此页面受浏览器限制，无法翻译。');
    return ensureReader(tab.id);
  }).then(reply,error=>reply({error:error.message||'无法连接页面，请刷新后重试。'}));return true;
});

chrome.runtime.onMessage.addListener((message,sender,reply)=>{
 if(!['READER_AUTO_SITE','READER_CANCEL_AUTO_SITE'].includes(message?.type)||sender.url!==chrome.runtime.getURL('popup.html'))return;
 chrome.tabs.query({active:true,currentWindow:true}).then(async([tab])=>{
  if(tab?.id!==message.tabId||!AbceedSites.supported(tab.url))throw new Error('此页面受浏览器限制，无法翻译。');
  const origin=new URL(tab.url).origin;
  if(message.type==='READER_CANCEL_AUTO_SITE')await autoSites.cancel(origin);
  else await autoSites.intent(origin,message.enabled===true);
  return {ok:true};
 }).then(reply,error=>reply({error:error.message}));return true;
});
