// publish.mjs — wrap auditable's built micro.html into the deployed PWA.
// This repo is the release surface: the PWA shell (manifest.webmanifest, sw.js,
// icon.svg) is owned here; the app itself is built in the auditable monorepo
// (`node build.js --target=micro`) and lands here as micro.html.
//
// Source of micro.html, in order of preference:
//   1. a dir passed as argv[2] (CI: ./dl, where publish.yml downloads the latest
//      auditable RELEASE asset) — keeps the deploy in sync with releases;
//   2. the committed micro.html in this repo (the seed / dev-refreshed copy) —
//      so a plain push deploys without waiting on an auditable release.
//
// Produces index.html (micro.html + PWA injection), served at gentropic.org/micro/.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const src = process.argv[2] ? path.resolve(process.argv[2]) : null;

function findMicro() {
  for (const dir of [src, here]) {
    if (!dir) continue;
    const p = path.join(dir, 'micro.html');
    if (fs.existsSync(p)) return p;
  }
  return null;
}

// PWA shell (deploy layer — OUTSIDE the sealed micro.html): registers the service
// worker, and wires the @gcu/sw update protocol into a small "new version" toast +
// a window.__microCheckUpdate() the app's Help→Check-for-updates calls. All of this
// talks to the SW via postMessage — the PAGE never fetches, so connect-src 'none'
// (the seal) still holds; it's inert on the offline file:// download (no SW).
const PWA_INJECT = `<link rel="manifest" href="manifest.webmanifest">
<meta name="theme-color" content="#121212">
<script>(function(){
if(!("serviceWorker" in navigator))return;
var sw=navigator.serviceWorker,shown=false;
addEventListener("load",function(){sw.register("sw.js").catch(function(){});});
function apply(){try{sw.controller&&sw.controller.postMessage({type:"gcu-sw:apply-update"});}catch(e){}}
function toast(){
if(shown||!document.body)return;shown=true;
var t=document.createElement("div");t.setAttribute("role","status");
t.style.cssText="position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:2147483647;display:flex;gap:12px;align-items:center;background:#1c1c1c;color:#e8e8e8;border:1px solid #3a3a3a;border-radius:8px;padding:10px 14px;font:13px/1.4 ui-monospace,Menlo,Consolas,monospace;box-shadow:0 4px 20px rgba(0,0,0,.5)";
var s=document.createElement("span");s.textContent="A new version of micro is available.";
var b=document.createElement("button");b.textContent="Reload";b.style.cssText="background:#c8781e;color:#fff;border:0;border-radius:5px;padding:5px 12px;font:inherit;cursor:pointer";b.onclick=apply;
var x=document.createElement("button");x.textContent="×";x.style.cssText="background:transparent;color:#999;border:0;font:inherit;cursor:pointer;font-size:16px;line-height:1";x.onclick=function(){t.remove();shown=false;};
t.appendChild(s);t.appendChild(b);t.appendChild(x);document.body.appendChild(t);
}
sw.addEventListener("message",function(e){var d=e.data||{};if(d.type==="gcu-sw:reload"){location.reload();}else if(d.type==="gcu-sw:update-available"){toast();}});
window.__microCheckUpdate=function(){return new Promise(function(res){
if(!sw.controller){res({changed:false,noSw:true});return;}
var ch=new MessageChannel(),done=false;
var to=setTimeout(function(){if(!done){done=true;res({changed:false,timeout:true});}},30000);
ch.port1.onmessage=function(e){if(done)return;done=true;clearTimeout(to);res(e.data||{changed:false});};
try{sw.controller.postMessage({type:"gcu-sw:check-now"},[ch.port2]);}catch(e){clearTimeout(to);res({changed:false});}
});};
})();</script>
`;

const injectPwa = (html) => (/rel="manifest"/.test(html) ? html : html.replace(/<\/head>/i, PWA_INJECT + '</head>'));

const mic = findMicro();
if (!mic) {
  console.error('publish: no micro.html found.\n  build it: (in ../auditable) node build.js --target=micro, then copy it here — or let CI download the release asset.');
  process.exit(1);
}
fs.writeFileSync(path.join(here, 'index.html'), injectPwa(fs.readFileSync(mic, 'utf8')));
console.log(`published index.html from ${path.relative(here, mic) || 'micro.html'} (${(fs.statSync(mic).size / 1024).toFixed(0)} KB)`);
