const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.join(__dirname,'../extension');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json')));
const files=[manifest.background.service_worker,manifest.action.default_popup,manifest.options_page,...manifest.content_scripts.flatMap(s=>s.js),...Object.values(manifest.icons)];
for(const file of files){if(!fs.existsSync(path.join(root,file)))throw new Error(`缺少 ${file}`);}
for(const file of fs.readdirSync(root).filter(f=>f.endsWith('.js')))cp.execFileSync(process.execPath,['--check',path.join(root,file)]);
for(const file of fs.readdirSync(root).filter(f=>f.endsWith('.html'))){const html=fs.readFileSync(path.join(root,file),'utf8');for(const match of html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g))if(!fs.existsSync(path.join(root,match[1])))throw new Error(`缺少 ${match[1]}`);}
console.log('扩展清单、文件引用和所有 JS 语法检查通过。');
