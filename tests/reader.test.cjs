const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {JSDOM}=require('jsdom');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function fixture({delayed=false,url='https://app.abceed.com/',echo=false}={}){
 const dom=new JSDOM(`<!doctype html><html><body><main id="exercise"><header><button>abceedコース</button></header><nav><a href="#">ライブラリ</a></nav><a id="cta" href="#" style="display:flex;align-items:center;justify-content:center;height:40px">おすすめの問題</a><p id="q">The <strong>meeting</strong> has been ____.</p><div class="answers"><button id="a"><span>(A) postponed</span></button><button id="b">(B) postpone</button></div><p id="ex">ここでは過去分詞を選びます。</p><div id="fixed" style="overflow:hidden"><p>固定表示の説明です。</p></div><form><input value="password"><p>Do not translate my login data.</p></form><div aria-hidden="true">目に見える日本語の解説です。</div><div hidden>Hidden question text.</div></main></body></html>`,{url,runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window;let listener,changeListener;let settings={mode:'panel'};const requests=[];const waiting=[];
 const rect={width:400,height:40,top:60,bottom:100,left:40,right:440};
 w.HTMLElement.prototype.getBoundingClientRect=function(){return this.closest('[hidden]')?{...rect,width:0,height:0}:rect;};
 w.HTMLElement.prototype.scrollIntoView=function(){};
 // jsdom does not implement the browser's default UA display / visibility values.
 const nativeStyle=w.getComputedStyle.bind(w);
 w.getComputedStyle=element=>{const base=nativeStyle(element);return new Proxy(base,{get(target,key){if(key==='visibility')return target[key]||'visible';if(key==='display')return target[key]||(/^(SPAN|STRONG|B|EM|I)$/.test(element.tagName)?'inline':'block');if(key==='maxHeight')return target[key]||'none';return target[key];}});};
 w.chrome={runtime:{onMessage:{addListener:fn=>listener=fn},sendMessage:async message=>{
  requests.push(message.text);
  if(delayed)await new Promise(resolve=>waiting.push(resolve));
  return {text:echo?message.text:`译文：${message.text}`};
 }},storage:{local:{get:async()=>({settings}),set:async value=>{const old=settings;settings=value.settings;changeListener({settings:{oldValue:old,newValue:settings}},'local');}},onChanged:{addListener:fn=>changeListener=fn}}};
 for(const file of ['common.js','i18n.js','engine.js','content.js'])w.eval(fs.readFileSync(`extension/${file}`,'utf8'));
 return {dom,w,requests,waiting,message(type){let result;listener({type},{},reply=>result=reply);return result;},change(patch){return w.chrome.storage.local.set({settings:{...settings,...patch}});}};
}
test('默认悬浮模式保持原 DOM、文字与选项事件，关闭可恢复',async()=>{
 const f=fixture();await sleep(0);const main=f.w.document.querySelector('#exercise'),before=main.innerHTML;let clicks=0;f.w.document.querySelector('#a').addEventListener('click',()=>clicks++);
 f.message('ABCEED_START');await sleep(1100);
 assert.equal(main.innerHTML,before);assert.equal(f.requests.includes('The meeting has been ____.'),true);
 assert.equal(f.requests.some(s=>s.includes('login')||s.includes('Hidden')),false);
 assert.ok(f.requests.includes('目に見える日本語の解説です。'));
 f.w.document.querySelector('#a').click();assert.equal(clicks,1);
 f.message('ABCEED_STOP');assert.equal(main.innerHTML,before);assert.equal(f.message('ABCEED_STATUS').enabled,false);f.dom.window.close();
});
test('追加模式显示按钮、链接和固定题框双语，保留节点与点击事件并恢复原样',async()=>{
 const f=fixture();await sleep(0);await f.change({mode:'inline'});const q=f.w.document.querySelector('#q'),node=q.firstChild,text=q.textContent,main=f.w.document.querySelector('#exercise'),before=main.innerHTML;
 let clicks=0;f.w.document.querySelector('#a').onclick=()=>clicks++;
 f.message('ABCEED_START');await sleep(1100);
 assert.equal(q.firstChild,node);assert.equal(q.textContent,text);assert.ok(q.querySelector('[data-abceed-reader="translation"]'));
 assert.ok(f.w.document.querySelector('button [data-abceed-reader]'));assert.ok(f.w.document.querySelector('#fixed [data-abceed-reader]'));
 const cta=f.w.document.querySelector('#cta');assert.ok(cta.querySelector('[data-abceed-reader]'));assert.equal(cta.style.flexDirection,'column');assert.equal(cta.style.height,'40px');
 assert.ok(f.w.document.querySelector('header [data-abceed-reader]'));assert.ok(f.w.document.querySelector('nav [data-abceed-reader]'));
 f.w.document.querySelector('#a').click();assert.equal(clicks,1);
 f.message('ABCEED_STOP');assert.equal(main.innerHTML,before);f.dom.window.close();
});
test('复用题目节点与延迟请求不会显示上一题译文',async()=>{
 const f=fixture({delayed:true});await sleep(0);f.message('ABCEED_START');await sleep(250);
 f.w.document.querySelector('#q').textContent='The next question is different.';await sleep(250);
 for(const resolve of f.waiting.splice(0))resolve();await sleep(300);
 for(const resolve of f.waiting.splice(0))resolve();await sleep(300);
 const host=f.w.document.querySelector('[data-abceed-reader="ui"]');const cards=Array.from(host.shadowRoot.querySelectorAll('.card')).map(e=>e.textContent).join('\n');
 assert.equal(cards.includes('The meeting has been ____.'),false);assert.match(cards,/The next question is different/);assert.ok(cards.indexOf('The next question is different')<cards.indexOf('(A) postponed'));f.dom.window.close();
});
test('非 abceed 网页的开放 Shadow DOM 与动态文字可翻译，原节点保持',async()=>{
 const f=fixture({url:'https://news.example.com/read'});const host=f.w.document.createElement('section');f.w.document.querySelector('main').append(host);const shadow=host.attachShadow({mode:'open'});const paragraph=f.w.document.createElement('p');paragraph.textContent='Bonjour tout le monde.';shadow.append(paragraph);const node=paragraph.firstChild;
 await sleep(0);await f.change({mode:'inline'});f.message('ABCEED_START');await sleep(900);
 assert.equal(paragraph.firstChild,node);assert.ok(paragraph.querySelector('[data-abceed-reader]'));assert.ok(f.requests.includes('Bonjour tout le monde.'));
 paragraph.firstChild.nodeValue='안녕하세요 새로운 내용입니다.';await sleep(700);
 assert.ok(f.requests.includes('안녕하세요 새로운 내용입니다.'));assert.equal(paragraph.querySelectorAll('[data-abceed-reader]').length,1);
 f.message('ABCEED_STOP');assert.equal(paragraph.textContent,'안녕하세요 새로운 내용입니다.');f.dom.window.close();
});
test('译文等于原文时不追加，也不反复发送请求',async()=>{
 const f=fixture({url:'https://example.com',echo:true});await sleep(0);await f.change({mode:'inline'});f.message('ABCEED_START');await sleep(1000);
 const count=f.requests.length;f.w.document.dispatchEvent(new f.w.Event('scroll'));await sleep(400);
 assert.equal(f.w.document.querySelectorAll('[data-abceed-reader="translation"]').length,0);assert.equal(f.requests.length,count);f.dom.window.close();
});
test('仅切换界面语言保留现有译文与请求，不重译页面',async()=>{
 const f=fixture();await sleep(0);await f.change({mode:'inline',targetLanguage:'zh-CN'});f.message('ABCEED_START');await sleep(1100);
 const count=f.requests.length,translation=f.w.document.querySelector('#q [data-abceed-reader]');
 await f.change({uiLanguage:'ja'});await sleep(400);
 assert.equal(f.requests.length,count);assert.equal(f.w.document.querySelector('#q [data-abceed-reader]'),translation);
 const panel=f.w.document.querySelector('[data-abceed-reader="ui"]').shadowRoot;assert.equal(panel.querySelector('.brand').textContent,'バイリンガルリーダー');assert.equal(panel.querySelector('#reader-target').value,'zh-CN');f.dom.window.close();
});
test('普通 HTML 源码换行按网页空白规则合并，显式换行保持',async()=>{
 const f=fixture({url:'https://article.example'}),paragraph=f.w.document.querySelector('#q');
 paragraph.replaceChildren(f.w.document.createTextNode('The\n  meeting is '),f.w.document.createElement('strong'),f.w.document.createTextNode('\n  tomorrow.'),f.w.document.createElement('br'),f.w.document.createTextNode('Please\n  arrive early.'));
 paragraph.querySelector('strong').textContent='important';await sleep(0);f.message('ABCEED_START');await sleep(1100);
 assert.ok(f.requests.includes('The meeting is important tomorrow.\nPlease arrive early.'));f.dom.window.close();
});
