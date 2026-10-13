(function (root) {
  const ignored = 'script,style,noscript,svg,math,canvas,iframe,input,textarea,select,option,code,pre,form,[contenteditable]:not([contenteditable="false"]),[data-abceed-reader]';
  const semantic = /^(P|H[1-6]|LI|TD|TH|DT|DD|BLOCKQUOTE|BUTTON|LABEL)$/;
  let roots=[];
  function excluded(element){for(let current=element;current;current=current.getRootNode()?.host)if(current.closest(ignored))return true;return false;}
  function candidate(node) {
    let element = node.parentElement||node.getRootNode()?.host;
    if (!element || excluded(element)) return null;
    while (element && element !== document.body && element !== document.documentElement) {
      if (semantic.test(element.tagName)) return element;
      const style = getComputedStyle(element);
      if (!['inline','contents'].includes(style.display)) return element;
      const parent = element.parentElement;
      if (parent && /flex|grid/.test(getComputedStyle(parent).display) && !semantic.test(parent.tagName)) return element;
      element = parent;
    }
    return null;
  }
  function collect(options = 'all') {
    const {scope='all',sourceLanguage='auto',targetLanguage='zh-CN'}=typeof options==='string'?{scope:options}:options;
    const records = new Map();
    if (!document.body) return records;
    roots=[];const pendingRoots=[document.body];let count=0;
    while(pendingRoots.length&&count<100000){
    const root=pendingRoots.shift(),walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);
    let node;
    while ((node = walker.nextNode()) && count++ < 100000) {
      if(node.nodeType===1){if(node.shadowRoot&&!excluded(node)){roots.push(node.shadowRoot);pendingRoots.push(node.shadowRoot);}continue;}
      const element = candidate(node);
      if (!element) continue;
      if (!records.has(element)) records.set(element, {element, nodes:[], text:''});
      const record = records.get(element);
      record.nodes.push(node);
      for(let sibling=node;sibling&&sibling!==element;sibling=sibling.parentNode){if(sibling.previousSibling){if(sibling.previousSibling.nodeName==='BR')record.text+='\n';break;}}
      const whiteSpace=getComputedStyle(node.parentElement||element).whiteSpace;
      record.text += /^(pre|break-spaces)/.test(whiteSpace)?node.nodeValue:node.nodeValue.replace(/\s+/gu,' ');
    }
    }
    for (const [element,record] of records) {
      record.text = root.AbceedCommon.normalize(record.text);
      const rect = element.getBoundingClientRect();
      const hint=sourceLanguage==='auto'?(element.closest('[lang]')?.getAttribute('lang')||element.getRootNode()?.host?.closest('[lang]')?.getAttribute('lang')||document.documentElement.lang):sourceLanguage;
      if (!root.AbceedCommon.eligible(record.text,scope,hint,targetLanguage) || !rect.width || !rect.height || getComputedStyle(element).visibility !== 'visible') records.delete(element);
    }
    return records;
  }
  function visible(element) {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.bottom > -100 && rect.top < innerHeight + 150 && rect.right > 0 && rect.left < innerWidth;
  }
  function inlineSafe(element) {
    // Bilingual mode includes links, buttons and text inside fixed cards.
    // Never replace existing children or insert into form controls / media.
    return element.isConnected && !excluded(element);
  }
  root.AbceedEngine = {collect,visible,inlineSafe,shadowRoots:()=>roots};
})(globalThis);
