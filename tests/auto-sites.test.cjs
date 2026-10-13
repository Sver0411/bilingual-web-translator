const test=require('node:test'),assert=require('node:assert/strict');
const A=require('../extension/auto-sites.js'),C=require('../extension/common.js');
function fixture(){let session={},settings=C.settings(),allowed=false,synced=[];const chrome={storage:{session:{get:async()=>({...session}),set:async value=>Object.assign(session,value),remove:async key=>{delete session[key];}},local:{get:async()=>({settings}),set:async value=>{settings=value.settings;}}},permissions:{contains:async()=>allowed}};return {chrome,permit(){allowed=true;},settings:()=>settings,session:()=>session,synced,controller:()=>A.create(chrome,C,async value=>synced.push(value))};}
test('首次权限弹窗关闭 popup 后，后台仍保存设置和注入规则',async()=>{
 const f=fixture();let worker=f.controller();await worker.intent('https://news.example',true);
 assert.equal(f.settings().autoSites.length,0);assert.ok(f.session().autoSiteIntent);
 // Worker restart and popup destruction do not discard the session intent.
 worker=f.controller();f.permit();await worker.drain();
 assert.equal(C.autoEnabled(f.settings(),'https://news.example'),true);assert.equal(f.synced.length,1);assert.equal(f.session().autoSiteIntent,undefined);
 await worker.intent('https://news.example',false);assert.equal(C.autoEnabled(f.settings(),'https://news.example'),false);
});
test('授权事件先到、取消授权或过期时正确处理',async()=>{
 const f=fixture(),worker=f.controller();f.permit();await worker.intent('https://early.example',true);assert.equal(C.autoEnabled(f.settings(),'https://early.example'),true);
 const denied=fixture(),other=denied.controller();await other.intent('https://denied.example',true);await other.cancel('https://denied.example');denied.permit();await other.drain();assert.equal(denied.settings().autoSites.length,0);
 await denied.chrome.storage.session.set({autoSiteIntent:{origin:'https://expired.example',expires:Date.now()-1}});await other.drain();assert.equal(denied.settings().autoSites.length,0);
});
