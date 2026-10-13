(function(){
 const $=id=>document.getElementById(id);let clicks=0,index=0;
 function baseline(){return {html:$('exercise').innerHTML,text:$('exercise').textContent,nodes:[...$('exercise').querySelectorAll('*')],rects:[...$('exercise').querySelectorAll('*')].map(element=>{const r=element.getBoundingClientRect();return [r.x+scrollX,r.y+scrollY,r.width,r.height];})};}
 let original=baseline();
 document.querySelectorAll('.choices button').forEach(button=>button.onclick=()=>{clicks++;document.querySelectorAll('.choices button').forEach(b=>b.classList.remove('selected'));button.classList.add('selected');$('answer-status').textContent=`选项点击次数：${clicks} · 答题事件正常`;original=baseline();});
 $('start').onclick=()=>{window.demoMessage('ABCEED_TOGGLE');};
 $('next').onclick=()=>{
  index++;
  $('question').innerHTML=index%2?'Please submit your <strong>report</strong> before noon.':'The <strong>meeting</strong> has been ____ until Friday.';
  $('explanation').textContent=index%2?'「正午までにレポートを提出してください」という意味です。before noon は期限を表します。':'「会議は金曜日まで延期された」という意味です。has been の後には過去分詞を置き、受動態の現在完了形を作ります。';
  $('detail').textContent=index%2?'Please で始まる命令文は、相手に丁寧に依頼する表現です。':'until Friday は「金曜日まで」を表します。空欄の前後の文法に注意しましょう。';
  original=baseline();$('checks').textContent='题目已更新。开启伴读时，新译文将自动跟随。';
 };
 $('check').onclick=()=>{
  const now=baseline(),same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  const structure=now.html===original.html,nodes=now.nodes.length===original.nodes.length&&now.nodes.every((node,i)=>node===original.nodes[i]);
  $('checks').textContent=`原文：${now.text===original.text?'未改变 ✓':'已变化'}\nDOM 与原节点：${structure&&nodes?'未改变 ✓':'存在追加元素（段落模式）'}\n原页面位置与尺寸：${same(now.rects,original.rects)?'未改变 ✓':'段落高度发生变化'}\n选项点击事件：${clicks>0?'已验证 ✓':'请点击任意选项验证'}`;
 };
})();
