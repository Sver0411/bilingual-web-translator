(function(root){
 // The service worker owns this intent so permission prompts can close the popup safely.
 function create(chrome,C,sync,onEnabled=async()=>{}){
  let work=Promise.resolve();
  const serial=fn=>(work=work.catch(()=>{}).then(fn));
  async function commit(origin,enabled){
   const saved=await chrome.storage.local.get('settings'),config=C.settings(saved.settings);
   const autoSites=config.autoSites.filter(value=>value!==origin);if(enabled)autoSites.push(origin);
   const next=C.settings({...config,autoSites,autoStart:enabled?true:config.autoStart});
   await chrome.storage.local.set({settings:next});await sync(next);
  }
  async function process(){
   const {autoSiteIntent:intent}=await chrome.storage.session.get('autoSiteIntent');
   if(!intent)return;
   if(intent.expires<Date.now()){await chrome.storage.session.remove('autoSiteIntent');return;}
   const url=new URL(intent.origin),pattern=`${url.protocol}//${url.hostname}/*`;
   if(!await chrome.permissions.contains({origins:[pattern]}))return;
   await commit(intent.origin,true);await chrome.storage.session.remove('autoSiteIntent');await onEnabled(intent.origin);
  }
  return {
   intent:(origin,enabled)=>serial(async()=>{
    if(!enabled){await chrome.storage.session.remove('autoSiteIntent');await commit(origin,false);return;}
    await chrome.storage.session.set({autoSiteIntent:{origin,expires:Date.now()+600000}});await process();
   }),
   drain:()=>serial(process),
   cancel:origin=>serial(async()=>{const {autoSiteIntent}=await chrome.storage.session.get('autoSiteIntent');if(autoSiteIntent?.origin===origin)await chrome.storage.session.remove('autoSiteIntent');})
  };
 }
 const api={create};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ReaderAutoSites=api;
})(globalThis);
