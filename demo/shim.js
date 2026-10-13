// Browser-only test harness. Not included in the extension package.
(function(){
 let settings={mode:'panel',scope:'all',fontSize:14,provider:'google',autoStart:false};
 const listeners=[],changeListeners=[];
 window.AbceedTestChrome={runtime:{onMessage:{addListener:fn=>listeners.push(fn)},sendMessage:async message=>{
  const response=await fetch('/api/translate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:message.text,sourceLanguage:settings.sourceLanguage,targetLanguage:settings.targetLanguage})});return response.json();
 }},storage:{local:{get:async()=>({settings}),set:async value=>{const old=settings;settings=value.settings;for(const listener of changeListeners)listener({settings:{oldValue:old,newValue:settings}},'local');}},onChanged:{addListener:fn=>changeListeners.push(fn)}}};
 window.demoMessage=type=>{let result;for(const listener of listeners)listener({type},{},value=>result=value);return result;};
})();
