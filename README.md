# GCU Micro

Open massive spatial-element files — LiDAR point clouds and block models, tens
of millions of elements — and **orbit, filter, section, pick, and measure**
against the source. Streaming, no import step: first look in about a second at
any size, densifying while you look. **Networkless** — your data never leaves
the page.

Live at **https://gentropic.org/micro** · or
[download `micro.html`](https://gentropic.org/micro/micro.html) — one
self-contained file to keep, share, or run offline.

## What it does

- **Point clouds**: LAS 1.2/1.4 (formats 0–3, 6–8), PLY (ascii + binary),
  XYZ/whitespace dumps. Color by elevation, intensity, classification, or RGB;
  eye-dome lighting so points read as a surface.
- **Block models**: delimited exports (CSV/GSLIB-ish — centroids sniffed by
  convention, headerless files work) and **Datamine `.dm`** directly. Regular
  grids render as exact boxes (real geometry, per-face shading); sub-blocked /
  irregular models fall back to centroids. Color by any numeric column or
  category.
- **Filter** with SQL-`WHERE` syntax over every column in the file
  (`FE > 55 and LITO = "HEMATITE"`, autocomplete included) — matching elements
  isolate (or keep the rest as dimmed context).
- **Section**: plan / N–S / E–W slabs, or draw a **knife** line anywhere;
  scrub the slab through the deposit; view along the cut; orthographic or
  perspective.
- **Pick** any point or block — the full source record docks on the right.
  **Measure** between two picked elements: 3D · plan · Δz, computed from the
  source coordinates, not the screen.
- **Export** the viewport as PNG. Render budget is a knob — spend frames per
  second or points per frame, your call.

However large the file, the browser keeps only a windowed slice of it in
memory; the GPU owns the rest. A 50-million-element model stays interactive.

## Security posture

`micro.html` is **Sealed**: CSP `connect-src 'none'` — no network reach at
all, no telemetry, no runtime code generation, no WASM. It reads the files you
open and writes the PNGs you export, nothing else. Capability artifacts are
emitted and verified at build by [@gcu/seal](https://gentropic.org/security).

## References

micro contains no third-party code — the engine is GCU's own, implemented
from the published methods:

- M. Schütz, G. Mandlburger, J. Otepka, M. Wimmer.
  *Progressive Real-Time Rendering of One Billion Points Without Hierarchical
  Acceleration Structures.* Computer Graphics Forum 39(2), 51–64, 2020.
  [doi:10.1111/cgf.13911](https://doi.org/10.1111/cgf.13911) — the streaming,
  no-preprocess, progressive-accumulation rendering model at micro's core.
- M. Schütz, B. Kerbl, M. Wimmer. *Rendering Point Clouds with Compute Shaders
  and Vertex Order Optimization.* Computer Graphics Forum 40(4), 2021.
  [doi:10.1111/cgf.14345](https://doi.org/10.1111/cgf.14345) — the
  vertex-order/Morton line behind micro's batch chunking.
- M. Schütz, B. Kerbl, M. Wimmer. *Software Rasterization of 2 Billion Points
  in Real Time.* Proc. ACM Comput. Graph. Interact. Tech. 5(3), art. 24, 2022.
  [doi:10.1145/3543863](https://doi.org/10.1145/3543863)
- C. Boucheny. *Visualisation scientifique de grands volumes de données: pour
  une approche perceptive.* PhD thesis, Université Joseph Fourier, 2009; and
  A. Ribes, C. Boucheny. *Eye-Dome Lighting: a non-photorealistic shading
  technique.* Kitware Source 7, 2011 — the EDL shading that makes points read
  as a surface.
- C. Sigg, T. Weyrich, M. Botsch, M. Gross. *GPU-Based Ray-Casting of
  Quadratic Surfaces.* Eurographics Symposium on Point-Based Graphics, 59–65,
  2006 — the ray-cast impostor technique behind the exact block rendering.

## This repo

The release surface for micro. The app is built in the
[auditable](https://github.com/gentropic/auditable) monorepo
(`node build.js --target=micro` → `micro.html`, engine `ext/condenser`, page
`tools/micro`); this repo owns the PWA shell (manifest, service worker, icons)
and deploys to GitHub Pages. `publish.mjs` wraps the newest `micro.html`
(release asset, or the committed seed) into `index.html`.

MIT — © Arthur Endlein Correia / Geoscientific Chaos Union ·
[gentropic.org](https://gentropic.org)
