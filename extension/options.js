const $=id=>document.getElementById(id);
let storedSettings={};
const I=ReaderI18n;let locale='system';const t=(key,values)=>I.t(key,locale,values);
function interfaceUI(){locale=$('uiLanguage').value||'system';I.apply(document,locale);document.documentElement.lang=I.resolve(locale);I.uiOptions($('uiLanguage'),locale);for(const id of ['sourceLanguage','targetLanguage'])I.populate($(id),locale,id==='sourceLanguage');}
interfaceUI();$('uiLanguage').onchange=interfaceUI;
const keys=['uiLanguage','mode','sourceLanguage','targetLanguage','provider','endpoint','apiKey','model','fontSize','autoStart'];
function notice(text,error=false){$('status').textContent=t(text);$('status').classList.toggle('error',error);}
function update(){const custom=$('provider').value==='compatible';$('custom').classList.toggle('hidden',!custom);$('google-note').classList.toggle('hidden',custom);}
$('provider').onchange=update;
chrome.storage.local.get('settings').then(({settings})=>{storedSettings=settings||{};const config=AbceedCommon.settings(settings);for(const key of keys){if(['autoStart'].includes(key))$(key).checked=config[key];else $(key).value=config[key];}interfaceUI();update();});
$('settings-form').onsubmit=async event=>{
  event.preventDefault();
  try{
    const values=Object.fromEntries(keys.map(key=>[key,['autoStart'].includes(key)?$(key).checked:$(key).value]));const config=AbceedCommon.settings({...storedSettings,...values,scope:'all'});
    if(config.provider==='compatible'){
      const url=AbceedCommon.endpointURL(config.endpoint);
      if(!config.model.trim())throw new Error('请填写模型名称。');
      const permission=`${url.protocol}//${url.hostname}/*`;
      const allowed=await chrome.permissions.request({origins:[permission]});
      if(!allowed)throw new Error('尚未授权此翻译服务域名。');
    }
    await chrome.storage.local.set({settings:config});storedSettings=config;notice('设置已保存，正在使用的伴读会自动更新。');
  }catch(error){notice(error.message,true);}
};
$('test').onclick=async()=>{
  $('test').disabled=true;notice('正在测试已保存的翻译服务…');
  try{const {settings}=await chrome.storage.local.get('settings');const config=AbceedCommon.settings(settings);const result=await AbceedProviders.translate('The meeting has been postponed. 正しい選択肢を選んでください。',config);notice(t('连接成功：{result}',{result}));}
  catch(error){notice(t('测试失败：{error}',{error:error.message}),true);}
  finally{$('test').disabled=false;}
};

chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local'&&changes.settings)storedSettings=changes.settings.newValue||{};});
