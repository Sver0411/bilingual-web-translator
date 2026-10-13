const test=require('node:test'),assert=require('node:assert/strict');
const P=require('../extension/providers.js');
test('谷歌多段结果合并，自动检测语言并请求中文',async()=>{
 const result=await P.translate('Question',{provider:'google'},async(url,options)=>{
  const parsed=new URL(url);assert.equal(parsed.searchParams.get('sl'),'auto');assert.equal(parsed.searchParams.get('tl'),'zh-CN');assert.equal(options.credentials,'omit');
  return {ok:true,json:async()=>[[['第一句'],['第二句']]]};
 });assert.equal(result,'第一句第二句');
});
test('自定义接口只翻译，不要求模型回答题目',async()=>{
 const result=await P.translate('Choose the correct answer.',{provider:'compatible',endpoint:'https://example.com/v1',model:'test-model',apiKey:'secret'},async(url,options)=>{
  const body=JSON.parse(options.body);assert.match(body.messages[0].content,/Do not answer/);assert.equal(body.messages[1].content,'Choose the correct answer.');assert.equal(options.headers.Authorization,'Bearer secret');assert.equal(url,'https://example.com/v1/chat/completions');return {ok:true,json:async()=>({choices:[{message:{content:'选择正确的答案。'}}]})};
 });assert.equal(result,'选择正确的答案。');
});
test('限流与无效响应显示明确错误',async()=>{
 await assert.rejects(P.translate('x',{provider:'google'},async()=>({ok:false,status:429})),/过于频繁/);
 await assert.rejects(P.translate('x',{provider:'google'},async()=>({ok:true,json:async()=>[]})),/有效译文/);
});
test('保留选项字母、空格题占位符和日文解析中的英文术语',async()=>{
 const choice=await P.translate('(A) postponed',{provider:'google'},async(url)=>{assert.equal(new URL(url).searchParams.get('q'),'postponed');return {ok:true,json:async()=>[[['延期']]]};});assert.equal(choice,'(A) 延期');
 const prepared=P.protect('has been の後に ____ を入れます。');assert.match(prepared.text,/⟦0⟧/);assert.equal(prepared.restore('在⟦1⟧之后填写⟦0⟧。'),'在has been之后填写____。');assert.throws(()=>prepared.restore('填空。'),/未保留/);
});
test('日文说明与英文题目分行翻译，英文句子不被当作术语原样保留',async()=>{
 const queries=[];const result=await P.translate('英文を聞いてください。\nWill we have lunch outside?\n(A) The library is inside.',{provider:'google'},async url=>{
  const query=new URL(url).searchParams.get('q');queries.push(query);const output={'英文を聞いてください。':'请听英文。','Will we have lunch outside?':'我们在外面吃午饭吗？','The library is inside.':'图书馆在里面。'}[query];
  return {ok:true,json:async()=>[[[output]]]};
 });assert.equal(queries.length,3);assert.equal(queries[1],'Will we have lunch outside?');assert.equal(result,'请听英文。\n我们在外面吃午饭吗？\n(A) 图书馆在里面。');
});
test('源语言与目标语言传入服务，切换目标后不使用中文词汇覆盖',async()=>{
 const result=await P.translate('終了',{provider:'google',sourceLanguage:'ja',targetLanguage:'en'},async url=>{
  const parameters=new URL(url).searchParams;assert.equal(parameters.get('sl'),'ja');assert.equal(parameters.get('tl'),'en');return {ok:true,json:async()=>[[['Finish']]]};
 });assert.equal(result,'Finish');
 const ai=await P.translate('Bonjour',{provider:'compatible',sourceLanguage:'fr',targetLanguage:'ko',endpoint:'https://example.com/v1',model:'test',apiKey:''},async(url,options)=>{
  const system=JSON.parse(options.body).messages[0].content;assert.match(system,/from language code fr/);assert.match(system,/into language code ko/);return {ok:true,json:async()=>({choices:[{message:{content:'안녕하세요'}}]})};
 });assert.equal(ai,'안녕하세요');
});
