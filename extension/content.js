(function () {
  const chrome = globalThis.AbceedTestChrome || globalThis.chrome;
  if (globalThis.__abceedReaderLoaded) return;
  globalThis.__abceedReaderLoaded = true;
  const C = AbceedCommon, E = AbceedEngine, I=ReaderI18n;
  const t=(key,values)=>I.t(key,config.uiLanguage,values);
  const topFrame = window === window.top;
  let config = C.settings(), enabled = false, generation = 0, running = 0;
  let scanTimer, hoverTimer, panel, shadow, list, status, rootHost, hoverBox, highlight;
  let collapsed = false, pointerEntry = null;
  const records = new Map();
  const translated = new Map();
  const layoutPatches = new Map();
  const owned = '[data-abceed-reader]';
  const css = `
    :host{all:initial!important;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC",sans-serif!important;color:#243044!important;direction:ltr!important;color-scheme:light!important}
    *{box-sizing:border-box}button,select{font:inherit}button{cursor:pointer}button:focus-visible,select:focus-visible{outline:2px solid #498670;outline-offset:2px}
    #panel{position:fixed;right:16px;top:78px;width:344px;max-width:calc(100vw - 24px);background:#fff;border:1px solid #dce5df;border-radius:16px;box-shadow:0 12px 48px #102e2629;overflow:hidden;font-size:14px;z-index:2147483646}
    .head{display:flex;align-items:center;gap:8px;padding:13px 14px;background:#f5f9f6;touch-action:none;cursor:move;user-select:none;border-bottom:1px solid #e8eee9}.brand{font-weight:700;flex:1;color:#285743}.head button{border:0;background:transparent;color:#64746b;font-size:17px;padding:3px 7px;border-radius:6px}
    .tools{display:flex;gap:8px;padding:10px 12px}.tools select{min-width:0;flex:1;padding:6px 4px;border:1px solid #dfe5e1;border-radius:7px;background:white;font-size:12px;color:#355146}.tools button{border:0;background:#edf4ef;padding:5px 9px;color:#35634e;border-radius:7px;font-size:12px}
    #status{padding:0 14px 10px;font-size:12px;color:#6c7b72;line-height:1.5}#list{max-height:min(60vh,600px);overflow:auto;overscroll-behavior:contain;padding:0 12px 12px}.card{border:1px solid #e4eae6;border-radius:10px;padding:12px;margin:0 0 9px;background:#fff;cursor:pointer;outline:none}.card:hover,.card:focus-visible{border-color:#73a188;background:#fafffc}.source{font-size:12px;line-height:1.55;color:#7b837f;white-space:pre-wrap;overflow-wrap:anywhere;max-height:90px;overflow:auto}.translation{margin-top:8px;line-height:1.7;white-space:pre-wrap;overflow-wrap:anywhere;color:#254c3b;font-size:var(--reader-font,14px);direction:var(--reader-dir,ltr);text-align:start;unicode-bidi:plaintext}.error{color:#a54032}.empty{padding:20px 6px;color:#75867b;font-size:13px;line-height:1.8}.foot{padding:9px 14px;background:#f8faf9;font-size:11px;color:#7e8e84;border-top:1px solid #edf0ee;line-height:1.5}
    #panel.collapsed .body{display:none}#panel.collapsed{width:210px}.pop{position:fixed;display:none;width:340px;max-width:calc(100vw - 20px);padding:12px 14px;background:#fff;border:1px solid #92b09e;border-radius:12px;box-shadow:0 8px 32px #102e2626;z-index:2147483647;font-size:var(--reader-font,14px);line-height:1.7;white-space:pre-wrap;overflow-wrap:anywhere;pointer-events:none;max-height:40vh;overflow:auto}.outline{position:fixed;display:none;border:2px solid #6da088;border-radius:5px;background:#6da0880a;pointer-events:none;z-index:2147483645}
  `;
  function make(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }
  function createUI() {
    if (rootHost) return;
    rootHost = document.createElement('span');
    rootHost.dataset.abceedReader = 'ui';
    rootHost.style.setProperty('display','contents','important');
    shadow = rootHost.attachShadow({mode:'open'});
    const style = make('style',null,css); shadow.append(style);
    hoverBox = make('div','pop'); hoverBox.id = 'hover'; hoverBox.setAttribute('role','tooltip');
    highlight = make('div','outline');
    shadow.append(hoverBox,highlight);
    if (topFrame) {
      panel = make('section'); panel.id='panel'; panel.setAttribute('aria-label','双语伴读');
      const head = make('div','head');
      head.append(make('span','brand','双语伴读'));
      const minimize = make('button',null,'−'); minimize.id='reader-minimize'; minimize.title='收起 / 展开'; minimize.setAttribute('aria-label','收起或展开双语伴读');
      minimize.onclick=()=>{collapsed=!collapsed; panel.classList.toggle('collapsed',collapsed); minimize.textContent=collapsed?'＋':'−';};
      const close=make('button',null,'×'); close.title='关闭伴读（Alt+A 再开启）'; close.setAttribute('aria-label','关闭双语伴读'); close.onclick=()=>setEnabled(false);
      head.append(minimize,close);
      const body=make('div','body'), tools=make('div','tools');
      const mode=make('select'); mode.id='reader-mode';mode.setAttribute('aria-label','译文显示方式');
      [['panel','悬浮对照 · 保留布局'],['inline','原文下方 · 双语段落']].forEach(([value,text])=>{const option=make('option',null,text);option.value=value;mode.append(option);});
      mode.value=config.mode; mode.onchange=()=>save({mode:mode.value});
      const scope=make('select'); scope.id='reader-target';scope.setAttribute('aria-label','目标语言');
      C.languages.forEach(([value,text])=>{const option=make('option',null,text);option.value=value;scope.append(option);});
      scope.value=config.targetLanguage; scope.onchange=()=>save({targetLanguage:scope.value});
      const retry=make('button',null,'重试'); retry.onclick=()=>{for(const record of records.values()) if(record.error){record.error=null;record.result=null;}scheduleScan();};
      tools.append(mode,scope,retry);
      status=make('div');status.id='status';status.setAttribute('role','status');
      list=make('div');list.id='list';
      body.append(tools,status,list,make('div','foot','移动标题栏调整位置 · 点击译文定位原文\n悬停原文查看译文 · Alt+A 显示 / 隐藏'));
      panel.append(head,body); shadow.append(panel);
      if(config.mode==='inline'){collapsed=true;panel.classList.add('collapsed');minimize.textContent='＋';}
      let drag;
      head.addEventListener('pointerdown',event=>{
        if(event.target.closest('button')) return;
        const box=panel.getBoundingClientRect();drag={x:event.clientX-box.left,y:event.clientY-box.top};head.setPointerCapture(event.pointerId);
      });
      head.addEventListener('pointermove',event=>{
        if(!drag) return;
        panel.style.right='auto'; panel.style.left=`${Math.max(0,Math.min(innerWidth-panel.offsetWidth,event.clientX-drag.x))}px`;
        panel.style.top=`${Math.max(0,Math.min(innerHeight-48,event.clientY-drag.y))}px`;
      });
      head.addEventListener('pointerup',()=>drag=null);head.addEventListener('pointercancel',()=>drag=null);
    }
    document.documentElement.append(rootHost);
    applyFont();interfaceUI();
  }
  function interfaceUI(){
    if(!shadow)return;
    I.apply(shadow,config.uiLanguage);rootHost.lang=I.resolve(config.uiLanguage);
    const mode=shadow.querySelector('#reader-mode');if(mode)mode.value=config.mode;
    const target=shadow.querySelector('#reader-target');if(target){I.populate(target,config.uiLanguage);target.value=config.targetLanguage;}
    if(list)list.__signature=null;
  }
  function applyFont(){if(rootHost){rootHost.style.setProperty('--reader-font',`${config.fontSize}px`);rootHost.style.setProperty('--reader-dir',config.targetLanguage==='ar'?'rtl':'ltr');}}
  async function save(patch) {
    const saved=await chrome.storage.local.get('settings');
    await chrome.storage.local.set({settings:C.settings({...saved.settings,...patch})});
  }
  function patchLayout(record, element, property, value) {
    record.patches ||= [];
    let state=layoutPatches.get(element);
    if(!state){state={raw:element.getAttribute('style'),canonical:element.style.cssText,properties:new Map()};layoutPatches.set(element,state);}
    let patch=state.properties.get(property);
    if(!patch){patch={before:element.style.getPropertyValue(property),priority:element.style.getPropertyPriority(property),value,users:0};state.properties.set(property,patch);}
    if(!record.patches.some(item=>item.element===element&&item.property===property)){record.patches.push({element,property});patch.users++;}
    if(property==='min-height'&&parseFloat(patch.value)>parseFloat(value))value=patch.value;
    patch.value=value;element.style.setProperty(property,value,'important');
  }
  function clearInline(record){
    record.host?.remove();record.host=null;
    for(const {element,property}of record.patches||[]){
      const state=layoutPatches.get(element),patch=state?.properties.get(property);
      if(!patch||--patch.users>0)continue;
      // Preserve page changes made while the reader was active.
      if(element.style.getPropertyValue(property)===patch.value&&element.style.getPropertyPriority(property)==='important'){
        if(patch.before)element.style.setProperty(property,patch.before,patch.priority);else element.style.removeProperty(property);
      }
      state.properties.delete(property);
      if(!state.properties.size){
        if(element.style.cssText===state.canonical){if(state.raw===null)element.removeAttribute('style');else element.setAttribute('style',state.raw);}
        layoutPatches.delete(element);
      }
    }
    record.patches=[];
  }
  function showInline(record){
    if(config.mode!=='inline'||!record.result||!E.inlineSafe(record.element))return;
    if(record.host?.isConnected)return;
    const element=record.element, own=getComputedStyle(element);
    const interactive=!!element.closest('button,a,label,[role="button"],[role="radio"],[role="option"]');
    const compact=interactive||((parseFloat(own.fontSize)||14)<=16&&record.text.length<45);
    const font=compact?Math.max(10,Math.min(config.fontSize,(parseFloat(own.fontSize)||14)-2)):config.fontSize;
    const color=interactive?(own.color||'#2c634b'):'#2c634b';
    const host=make('span');host.dataset.abceedReader='translation';
    host.style.setProperty('display','block','important');host.style.setProperty('pointer-events','none','important');
    host.style.setProperty('min-width','0','important');host.style.setProperty('max-width','100%','important');
    const isolated=host.attachShadow({mode:'open'});
    isolated.append(make('style',null,`:host{all:initial;display:block!important;pointer-events:none!important;font:normal ${font}px/${compact?'1.2':'1.7'} -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif;color:${color};direction:ltr;min-width:0;max-width:100%}div{margin:${compact?'2px 0 0':'6px 0 3px'};${compact?'opacity:.88':'border-left:2px solid #8ab59a;padding-left:10px'};white-space:pre-wrap;overflow-wrap:anywhere;pointer-events:none;direction:${config.targetLanguage==='ar'?'rtl':'ltr'};text-align:start;unicode-bidi:plaintext}`),make('div',null,record.result));
    if(/flex/.test(own.display)){
      if(!own.flexDirection.startsWith('column')){
        const children=Array.from(element.children).filter(child=>!child.matches(owned));
        if(!children.length){patchLayout(record,element,'flex-direction','column');}
        else{patchLayout(record,element,'flex-wrap','wrap');host.style.setProperty('flex-basis','100%','important');patchLayout(record,element,'row-gap','0px');}
      }
      host.style.setProperty('flex-shrink','0','important');
      const originalLine=parseFloat(own.lineHeight)||(parseFloat(own.fontSize)||14)*1.6;
      // Fit two lines into 40px controls when possible; only grow smaller controls.
      if(interactive)patchLayout(record,element,'min-height',`${Math.ceil(originalLine+font*1.2+2+parseFloat(own.paddingTop||0)+parseFloat(own.paddingBottom||0))}px`);
    }
    if(/grid/.test(own.display))host.style.setProperty('grid-column','1 / -1','important');
    if(own.whiteSpace==='nowrap')patchLayout(record,element,'white-space','normal');
    if(own.webkitLineClamp&&own.webkitLineClamp!=='none')patchLayout(record,element,'-webkit-line-clamp','unset');
    // Append only our isolated text. Existing text nodes and answer listeners stay intact.
    const appendTo=element.shadowRoot&&record.nodes.every(node=>node.getRootNode()===element.shadowRoot)?element.shadowRoot:element;
    appendTo.append(host);record.host=host;
    revealInline(record,element);
  }
  function revealInline(record,element){
    for(let parent=element,depth=0;parent&&parent!==document.body&&depth<5;parent=parent.parentElement,depth++){
      const style=getComputedStyle(parent);
      if(['hidden','clip'].includes(style.overflowY||style.overflow)&&parent.clientHeight>0&&parent.scrollHeight>parent.clientHeight+1){
        // Expand vertically, keeping horizontal carousel clipping and control semantics.
        patchLayout(record,parent,'min-height',`${parent.scrollHeight+Math.ceil((parseFloat(style.borderTopWidth)||0)+(parseFloat(style.borderBottomWidth)||0))}px`);
      }
    }
  }
  function clearAll(){for(const record of records.values())clearInline(record);records.clear();pointerEntry=null;if(hoverBox)hoverBox.style.display='none';if(highlight)highlight.style.display='none';}
  function setEnabled(value){
    enabled=value;generation++;
    if(value){createUI();rootHost.style.display='contents';if(panel)panel.style.display='block';scheduleScan();}
    else{clearAll();if(panel)panel.style.display='none';}
  }
  async function request(record, epoch){
    record.pending=true;running++;
    try{
      const response=await chrome.runtime.sendMessage({type:'ABCEED_TRANSLATE',text:record.text});
      if(response?.error)throw new Error(response.error);
      if(typeof response?.text!=='string')throw new Error(t('翻译服务未返回结果。'));
      if(!enabled||epoch!==generation||records.get(record.element)!==record)return;
      record.skipped=C.normalize(response.text)===C.normalize(record.text);
      record.result=record.skipped?null:response.text;record.error=null;
      if(translated.size>=500)translated.delete(translated.keys().next().value);
      translated.set(record.text,response.text);showInline(record);
      if(pointerEntry===record)showHover(record);
    }catch(error){if(enabled&&epoch===generation&&records.get(record.element)===record)record.error=error.message||t('翻译失败，请重试。');}
    finally{record.pending=false;running--;if(enabled)scheduleScan();}
  }
  function scan(){
    scanTimer=null;if(!enabled)return;
    if(!rootHost?.isConnected){rootHost=null;createUI();}
    const collected=E.collect(config);
    for(const root of E.shadowRoots())if(!observedRoots.has(root)){observedRoots.add(root);observer.observe(root,observeOptions);}
    for(const [element,record]of records){
      if(!collected.has(element)||collected.get(element).text!==record.text){clearInline(record);records.delete(element);if(pointerEntry===record){pointerEntry=null;hoverBox.style.display='none';}}
    }
    for(const [element,value]of collected){
      if(!records.has(element)){const cached=translated.get(value.text);records.set(element,{...value,result:cached&&C.normalize(cached)!==value.text?cached:null,skipped:cached&&C.normalize(cached)===value.text,pending:false,error:null,host:null});}
    }
    const ordered=Array.from(collected.keys()).map(element=>records.get(element));
    records.clear();for(const record of ordered)records.set(record.element,record);
    const visible=Array.from(records.values()).filter(record=>E.visible(record.element));
    for(const record of visible){
      if(record.result)showInline(record);
      else if(!record.skipped&&!record.error&&!record.pending&&running<3)request(record,generation);
    }
    renderList(visible);
  }
  function scheduleScan(){if(!enabled||scanTimer)return;scanTimer=setTimeout(scan,180);}
  function renderList(visible){
    if(!list)return;
    visible=visible.filter(record=>!record.skipped);
    const done=visible.filter(record=>record.result).length;
    const failed=visible.filter(record=>record.error).length;
    const placed=visible.filter(record=>record.host?.isConnected).length;
    status.textContent=t('当前区域 {done} / {total} 段{placement}',{done:config.mode==='inline'?placed:done,total:visible.length,placement:t(config.mode==='inline'?'已显示于原文下方':'已翻译')})+(running?t(' · 翻译中…'):'')+(failed?t(' · {failed} 段失败，点击重试',{failed}):'');
    const signature=visible.map(record=>`${record.text}\u0000${record.result||record.error||''}`).join('\u0001');
    if(list.__signature===signature)return;list.__signature=signature;
    const scroll=list.scrollTop;list.replaceChildren();
    if(!visible.length){list.append(make('div','empty',t('当前区域没有需要翻译的文字。滚动页面或展开内容后会自动更新。')));return;}
    for(const record of visible){
      const card=make('article','card');card.tabIndex=0;card.setAttribute('aria-label',t('定位对应原文'));
      card.append(make('div','source',record.text),make('div',`translation${record.error?' error':''}`,record.result||t(record.error||'正在翻译…')));
      const locate=()=>{record.element.scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'});showOutline(record);};
      card.onclick=locate;card.onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();locate();}};
      card.onmouseenter=()=>showOutline(record);card.onmouseleave=()=>highlight.style.display='none';
      list.append(card);
    }
    list.scrollTop=scroll;
  }
  function showOutline(record){
    const rect=record.element.getBoundingClientRect();
    Object.assign(highlight.style,{display:'block',left:`${rect.left-2}px`,top:`${rect.top-2}px`,width:`${rect.width+4}px`,height:`${rect.height+4}px`});
  }
  function showHover(record){
    if(config.mode==='inline')return;
    if(!record.result)return;
    const rect=record.element.getBoundingClientRect();
    hoverBox.textContent=record.result;hoverBox.style.display='block';
    hoverBox.style.left=`${Math.min(Math.max(10,rect.left),Math.max(10,innerWidth-350))}px`;
    const height=hoverBox.getBoundingClientRect().height;
    hoverBox.style.top=`${Math.max(10,Math.min(rect.bottom+8,innerHeight-height-10))}px`;
  }
  document.addEventListener('pointerover',event=>{
    if(!enabled||event.target.closest?.(owned))return;
    const record=Array.from(records.values()).find(item=>item.element===event.target||item.element.contains(event.target));
    if(pointerEntry===record)return;
    pointerEntry=record||null;clearTimeout(hoverTimer);hoverBox.style.display='none';
    if(record)hoverTimer=setTimeout(()=>{if(pointerEntry===record)showHover(record);},650);
  },{passive:true});
  document.addEventListener('pointerout',event=>{
    if(!pointerEntry||pointerEntry.element.contains(event.relatedTarget))return;
    clearTimeout(hoverTimer);pointerEntry=null;if(hoverBox)hoverBox.style.display='none';
  },{passive:true});
  document.addEventListener('scroll',()=>{if(hoverBox)hoverBox.style.display='none';if(highlight)highlight.style.display='none';scheduleScan();},true);
  window.addEventListener('resize',()=>{
    if(panel&&panel.style.left)panel.style.left=`${Math.max(0,Math.min(parseFloat(panel.style.left),innerWidth-panel.offsetWidth))}px`;
    if(panel&&parseFloat(panel.style.top)>innerHeight-48)panel.style.top=`${Math.max(0,innerHeight-48)}px`;
    scheduleScan();
  });
  const observedRoots=new WeakSet(),observeOptions={subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','style','hidden','aria-hidden']};
  const observer=new MutationObserver(mutations=>{
    if(!enabled)return;
    const relevant=mutations.some(mutation=>{
      if(mutation.target.nodeType===1&&mutation.target.closest(owned))return false;
      if(mutation.type==='childList'&&[...mutation.addedNodes,...mutation.removedNodes].every(node=>node.nodeType===1&&node.matches(owned)))return false;
      return true;
    });if(relevant)scheduleScan();
  });observer.observe(document.documentElement,observeOptions);
  chrome.storage.onChanged.addListener((changes,area)=>{
    if(area!=='local'||!changes.settings)return;
    const previous=config;config=C.settings(changes.settings.newValue);
    const translationChanged=['mode','scope','provider','endpoint','apiKey','model','sourceLanguage','targetLanguage'].some(key=>previous[key]!==config[key]);
    if(translationChanged){translated.clear();generation++;clearAll();}
    else if(previous.fontSize!==config.fontSize)for(const record of records.values())clearInline(record);
    if(panel&&config.mode!==previous.mode){collapsed=config.mode==='inline';panel.classList.toggle('collapsed',collapsed);shadow.querySelector('#reader-minimize').textContent=collapsed?'＋':'−';}
    interfaceUI();applyFont();scheduleScan();
  });
  function currentStatus(){return{enabled,mode:config.mode,count:records.size,translated:Array.from(records.values()).filter(r=>r.result).length};}
  // All-frame delivery lets same-origin embedded exercises participate without creating duplicate panels.
  const frameToken='abceed-reader-control-v1';
  window.addEventListener('message',event=>{
    if(topFrame||event.source!==window.top||event.origin!==location.origin||event.data?.token!==frameToken||event.data.type!=='reader-state')return;
    setEnabled(event.data.enabled===true);
  });
  function broadcast(){if(topFrame)for(const frame of document.querySelectorAll('iframe'))frame.contentWindow?.postMessage({token:frameToken,type:'reader-state',enabled},location.origin);}
  chrome.runtime.onMessage.addListener((message,sender,reply)=>{
    if(message?.type==='ABCEED_READY'){ready.then(()=>reply(currentStatus()));return true;}
    if(message?.type==='ABCEED_STATUS'){reply(currentStatus());return;}
    if(['ABCEED_TOGGLE','ABCEED_START','ABCEED_STOP'].includes(message?.type)){
      setEnabled(message.type==='ABCEED_TOGGLE'?!enabled:message.type==='ABCEED_START');broadcast();reply(currentStatus());
    }
  });
  const ready=chrome.storage.local.get('settings').then(saved=>{config=C.settings(saved.settings);if(C.autoEnabled(config,location.origin)){setEnabled(true);broadcast();}});
})();
