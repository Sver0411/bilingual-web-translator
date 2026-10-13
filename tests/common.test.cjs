const test=require('node:test'),assert=require('node:assert/strict');
const C=require('../extension/common.js');
test('英日混合文字和短选项可以翻译，编号不发送',()=>{
 for(const text of ['The meeting has been postponed.','ここでは過去分詞を選びます。','postponed','会議終了'])assert.equal(C.eligible(text),true,text);
 for(const text of ['A','(B)','123','____','https://app.abceed.com/','person@example.com'])assert.equal(C.eligible(text),false,text);
 assert.equal(C.eligible('Please choose the correct word.','ja'),false);
 assert.equal(C.eligible('ここでは正しい答えを選びます。','en'),false);
});
test('自定义服务拒绝不安全地址，正确拼接路径',()=>{
 for(const url of ['http://example.com/v1','https://user:pass@example.com','https://example.com/?key=abc','https://example.com/#key'])assert.throws(()=>C.endpointURL(url));
 assert.equal(C.endpointURL('https://example.com/v1/').href,'https://example.com/v1/chat/completions');
 assert.equal(C.endpointURL('http://localhost:11434/v1').href,'http://localhost:11434/v1/chat/completions');
 assert.equal(C.endpointURL('https://example.com/v1/chat/completions').href,'https://example.com/v1/chat/completions');
});
test('常见书写系统均可翻译，中文目标时跳过中文段落',()=>{
 for(const text of ['Bonjour le monde.','안녕하세요 세계.','Привет мир.','مرحبًا بالعالم','नमस्ते दुनिया','สวัสดีชาวโลก','Γειά σου κόσμε','שלום עולם','Xin chào thế giới.'])assert.equal(C.eligible(text),true,text);
 assert.equal(C.eligible('这段文字已经是中文。'),false);
 assert.equal(C.eligible('中文里提到 API 和 JavaScript。'),false);
 assert.equal(C.eligible('这段文字需要翻译成英文。','all','','en'),true);
 assert.equal(C.eligible('重要語句','all','ja'),true);
 assert.equal(C.settings({targetLanguage:'ja',sourceLanguage:'fr'}).targetLanguage,'ja');
 assert.equal(C.settings({targetLanguage:'invalid',sourceLanguage:'invalid'}).targetLanguage,'zh-CN');
 assert.equal(C.settings({targetLanguage:'invalid',sourceLanguage:'invalid'}).sourceLanguage,'auto');
});
