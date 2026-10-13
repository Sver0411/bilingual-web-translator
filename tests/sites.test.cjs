const test=require('node:test'),assert=require('node:assert/strict');
const S=require('../extension/sites.js'),C=require('../extension/common.js');
test('普通 HTTP/HTTPS 网页可连接，内部页面和扩展商店拒绝',()=>{
 for(const url of ['https://example.com/read','http://localhost:4173/','https://news.example.fr/'])assert.equal(S.supported(url),true);
 for(const url of ['chrome://extensions','file:///tmp/page.html','https://chromewebstore.google.com/detail/test','https://chrome.google.com/webstore/detail/test','javascript:alert(1)'])assert.equal(S.supported(url),false);
 assert.equal(S.pattern('http://localhost:4173'),'http://localhost/*');
 assert.equal(S.pattern('https://example.com'),'https://example.com/*');
});
test('自动注入只登记已授权的网站，关闭自动后移除自身规则',async()=>{
 let entries=[{id:S.id('https://old.example'),matches:['https://old.example/*']},{id:'other-rule'}];let registrations=0;
 const chrome={permissions:{contains:async({origins})=>!origins[0].includes('denied')},scripting:{getRegisteredContentScripts:async()=>entries,unregisterContentScripts:async({ids})=>{entries=entries.filter(item=>!ids.includes(item.id));},registerContentScripts:async values=>{registrations++;entries.push(...values);}}};
 const config={autoStart:true,autoSites:['https://news.example','https://denied.example','https://app.abceed.com','http://localhost:4173']};
 await S.sync(chrome,config);assert.equal(entries.length,3);assert.equal(entries.some(item=>item.matches?.[0]==='https://denied.example/*'),false);
 assert.deepEqual(entries.find(item=>item.id===S.id('https://news.example')).js,['common.js','i18n.js','engine.js','content.js']);
 await S.sync(chrome,config);assert.equal(registrations,1);
 await S.sync(chrome,{...config,autoStart:false});assert.deepEqual(entries,[{id:'other-rule'}]);
});
test('迁移原自动设置时仅保留 abceed，不自动授权全网',()=>{
 const old=C.settings({autoStart:true});assert.deepEqual(old.autoSites,['https://app.abceed.com']);
 assert.equal(C.autoEnabled(old,'https://example.com'),false);
 const all=C.settings({autoStart:true,autoSites:['https://example.com','chrome://extensions','bad']});assert.deepEqual(all.autoSites,['https://example.com']);
 assert.equal(C.autoEnabled(all,'https://example.com'),true);
});
