const $=id=>document.getElementById(id),I=ReaderI18n;
let tabId,state,origin,config=AbceedCommon.settings();
const t=(key,values)=>I.t(key,config.uiLanguage,values);
function notice(text,error=false){$('status').textContent=t(text);$('status').classList.toggle('error',error);}
function interfaceUI(){I.apply(document,config.uiLanguage);document.documentElement.lang=I.resolve(config.uiLanguage);I.populate($('sourceLanguage'),config.uiLanguage,true);I.populate($('targetLanguage'),config.uiLanguage);for(const key of ['mode','sourceLanguage','targetLanguage'])$(key).value=config[key];hint();button();if(origin)$('site').textContent=`${new URL(origin).hostname} · ${t('当前网页')}`;}
function hint(){$('mode-tip').textContent=t($('mode').value==='panel'?'译文在可移动面板中显示，原页面布局保持原样。':'原文下方追加译文；关闭后恢复扩展调整的样式。');}
async function save(){const {settings}=await chrome.storage.local.get('settings');config=AbceedCommon.settings({...settings,scope:'all',mode:$('mode').value,sourceLanguage:$('sourceLanguage').value,targetLanguage:$('targetLanguage').value});await chrome.storage.local.set({settings:config});interfaceUI();notice('设置已更新，当前页译文会重新生成。');}
for(const id of ['mode','sourceLanguage','targetLanguage'])$(id).addEventListener('change',()=>save().catch(error=>notice(error.message,true)));
$('options').onclick=event=>{event.preventDefault();chrome.runtime.openOptionsPage();};
$('toggle').onclick=async()=>{
 $('toggle').disabled=true;
 try{state=await chrome.tabs.sendMessage(tabId,{type:'ABCEED_TOGGLE'},{frameId:0});button();notice(state.enabled?'已开启，滚动、展开内容和页面更新时会自动翻译。':'已关闭，追加译文已移除。');}
 catch{notice('页面连接已失效，请刷新后重试。',true);}
 finally{$('toggle').disabled=false;}
};
function button(){$('toggle').textContent=t(state?.enabled?'关闭本页翻译':'翻译当前页');}
$('autoSite').onchange=async()=>{
 const enabled=$('autoSite').checked;$('autoSite').disabled=true;
 // Record intent in the worker before Chrome opens a permission dialog, which can destroy this popup.
 const intent=chrome.runtime.sendMessage({type:'READER_AUTO_SITE',tabId,enabled});intent.catch(()=>{});
 const permission=enabled?chrome.permissions.request({origins:[AbceedSites.pattern(origin)]}):Promise.resolve(true);
 try{
  if(!await permission){await chrome.runtime.sendMessage({type:'READER_CANCEL_AUTO_SITE',tabId});throw new Error('未授权此网站；仍可手动翻译当前页。');}
  const result=await intent;if(result?.error)throw new Error(result.error);
  const committed=await chrome.runtime.sendMessage({type:'READER_AUTO_SITE',tabId,enabled});if(committed?.error)throw new Error(committed.error);
  const {settings}=await chrome.storage.local.get('settings');config=AbceedCommon.settings(settings);
  if(enabled){state=await chrome.tabs.sendMessage(tabId,{type:'ABCEED_START'},{frameId:0});button();}
  notice(enabled?'此网站以后会自动翻译。':'此网站以后不再自动开启翻译。');
 }catch(error){$('autoSite').checked=AbceedCommon.autoEnabled(config,origin);notice(error.message,true);}
 finally{$('autoSite').disabled=false;}
};
(async()=>{
 const {settings}=await chrome.storage.local.get('settings');config=AbceedCommon.settings(settings);interfaceUI();
 const [tab]=await chrome.tabs.query({active:true,currentWindow:true});tabId=tab?.id;
 if(!AbceedSites.supported(tab?.url)){$('site').textContent=t('此页面受浏览器限制');notice('请在普通 HTTP 或 HTTPS 网页中使用。');return;}
 origin=new URL(tab.url).origin;interfaceUI();
 state=await chrome.runtime.sendMessage({type:'ABCEED_CONNECT',tabId});if(state?.error)throw new Error(state.error);
 $('autoSite').checked=AbceedCommon.autoEnabled(config,origin);$('autoSite').disabled=false;$('toggle').disabled=false;button();
})().catch(error=>notice(error.message,true));
