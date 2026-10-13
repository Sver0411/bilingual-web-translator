const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const I=require('../extension/i18n.js'),C=require('../extension/common.js');
const {JSDOM}=require('jsdom');
test('界面语言默认跟随系统，手动语言与翻译语言相互独立',()=>{
 assert.equal(C.settings().uiLanguage,'system');assert.equal(I.resolve('system','ja-JP'),'ja');assert.equal(I.resolve('system','zh-TW'),'zh-CN');assert.equal(I.resolve('system','fr-FR'),'en');
 const config=C.settings({uiLanguage:'ja',sourceLanguage:'en',targetLanguage:'zh-CN'});assert.equal(config.sourceLanguage,'en');assert.equal(config.targetLanguage,'zh-CN');assert.equal(I.t('翻译当前页',config.uiLanguage),'このページを翻訳');
 assert.equal(C.settings({uiLanguage:'bad'}).uiLanguage,'system');
});
test('多次切换可还原界面文字，不更改原文或译文区域',()=>{
 const dom=new JSDOM('<h1>保留原文，随时对照</h1><button aria-label="关闭双语伴读">关闭本页翻译</button><div class="source">翻译当前页</div><div class="translation">源语言</div>');
 const document=dom.window.document;
 for(const locale of ['en','ja','zh-CN'])I.apply(document,locale);
 assert.equal(document.querySelector('h1').textContent,'保留原文，随时对照');assert.equal(document.querySelector('button').getAttribute('aria-label'),'关闭双语伴读');assert.equal(document.querySelector('.source').textContent,'翻译当前页');assert.equal(document.querySelector('.translation').textContent,'源语言');dom.window.close();
});
test('界面语言入口仅在设置页，不在快捷弹窗',()=>{
 assert.equal(fs.readFileSync('extension/popup.html','utf8').includes('id="uiLanguage"'),false);assert.equal(fs.readFileSync('extension/options.html','utf8').includes('id="uiLanguage"'),true);
});
