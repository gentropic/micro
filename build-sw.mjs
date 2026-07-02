// Regenerate sw.js from @gcu/sw (../auditable/ext/sw) — run after engine/config
// changes: `node build-sw.mjs`. The generated sw.js is COMMITTED (vendor-as-copy):
// publish.yml runs without an auditable checkout, so the worker must already be here.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeSw } from '../auditable/ext/sw/make.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));

// micro is a single self-contained page — precache the whole shell, serve it
// offline, SWR for byte-diff updates. No package catalog, no extra routes.
const sw = makeSw({
  app: 'micro',
  cache: 'micro-shell-v1',
  precache: ['./', './index.html', './manifest.webmanifest', './icon.svg'],
  routes: [],
  navFallback: './index.html',
});

fs.writeFileSync(path.join(here, 'sw.js'), sw);
console.log(`Generated sw.js (${(sw.length / 1024).toFixed(1)} KB) from @gcu/sw`);
