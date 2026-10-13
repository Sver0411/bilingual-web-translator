const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const provider=require('../extension/providers.js'),common=require('../extension/common.js');
const execFile=require('node:util').promisify(require('node:child_process').execFile);
async function demoFetch(url){
 if(new URL(url).origin!=='https://translate.googleapis.com')throw new Error('Unsupported demo provider');
 const {stdout}=await execFile('curl',['--fail','--silent','--show-error','--max-time','20',url],{maxBuffer:1024*1024});
 return {ok:true,json:async()=>JSON.parse(stdout)};
}
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.json':'application/json; charset=utf-8','.wasm':'application/wasm'};
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1');
  if(url.pathname==='/api/translate'&&req.method==='POST'){
   let body='';for await(const chunk of req){body+=chunk;if(body.length>10000)throw new Error('Text too long');}
   const {text,sourceLanguage,targetLanguage}=JSON.parse(body);
   if(typeof text!=='string'||text.length>6000)throw new Error('Invalid text');
   const result=await provider.translate(text,common.settings({provider:'google',sourceLanguage,targetLanguage}),demoFetch);
   res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({text:result}));return;
  }
  const file=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/demo/index.html':url.pathname));
  if(!file.startsWith(root+path.sep)||!['demo','extension'].includes(path.relative(root,file).split(path.sep)[0])){res.writeHead(403);res.end('Forbidden');return;}
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).on('error',()=>res.end('Not found')).pipe(res);
 }catch(error){res.writeHead(500,{'Content-Type':'application/json'});res.end(JSON.stringify({error:error.message}));}
});
server.listen(4173,'127.0.0.1',()=>console.log('Demo: http://127.0.0.1:4173/'));
