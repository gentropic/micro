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

const PWA_INJECT =
  '<link rel="manifest" href="manifest.webmanifest">\n'
  + '<meta name="theme-color" content="#121212">\n'
  + '<script>if("serviceWorker" in navigator)addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));</script>\n';

const injectPwa = (html) => (/rel="manifest"/.test(html) ? html : html.replace(/<\/head>/i, PWA_INJECT + '</head>'));

const mic = findMicro();
if (!mic) {
  console.error('publish: no micro.html found.\n  build it: (in ../auditable) node build.js --target=micro, then copy it here — or let CI download the release asset.');
  process.exit(1);
}
fs.writeFileSync(path.join(here, 'index.html'), injectPwa(fs.readFileSync(mic, 'utf8')));
console.log(`published index.html from ${path.relative(here, mic) || 'micro.html'} (${(fs.statSync(mic).size / 1024).toFixed(0)} KB)`);
