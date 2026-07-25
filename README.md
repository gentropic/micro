# GCU Micro

Open massive spatial-element files — point clouds, block models, drillholes,
grids, meshes, tens of millions of elements — and **orbit, filter, section,
pick, measure, derive, join, reconcile, and validate** against the source.
Streaming, no import step: first look in about a second at any size, densifying
while you look. **Networkless** — your data never leaves the page.

Live at **https://gentropic.org/micro** · or
[download `micro.html`](https://gentropic.org/micro/micro.html) — one
self-contained file to keep, share, or run offline. Manual at
[gentropic.org/micro/docs](https://gentropic.org/micro/docs/) (also as a PDF).

## What it reads

- **Point clouds** — LAS 1.2/1.4 (formats 0–3, 6–8), PLY (ascii + binary),
  XYZ/PTS/whitespace dumps. Color by elevation, intensity, classification, or
  RGB; eye-dome lighting so points read as a surface.
- **Block models** — delimited exports (CSV/GSLIB-ish — centroids sniffed by
  convention, headerless files work), **Datamine `.dm`** directly, and
  **Parquet**. Regular grids render as exact boxes (real geometry, per-face
  shading); **sub-blocked** (octree) models render each block at its true size,
  straight from the file. Color by any numeric column or category.
- **Drillholes** — collar + survey + interval tables, desurveyed on load
  (minimum curvature and friends); a set can carry several interval tables
  (assays, lithology, geotech) sharing one geometry.
- **Grids** — GeoTIFF (incl. big COGs), Surfer `.grd`, ESRI ASCII `.asc` —
  as coloured cells, draped surfaces, or relief.
- **Meshes** — `.msh` (Leapfrog), OBJ, PLY-with-faces, LFM, Datamine
  wireframe pairs (`pt`/`tr`).
- **Tables** — CSV or Excel worksheets without geometry: filter, calc, stats,
  export — everything that is about data, nothing that pretends to be spatial.

## What it does

- **Filter** with SQL-`WHERE` syntax over every column in the file
  (`FE > 55 and LITO = "HEMATITE"`, autocomplete included) — matching elements
  isolate, and a widget drawer projects the expression as live sliders and
  chips. On Parquet, footer statistics skip whole row-groups.
- **Section**: plan / N–S / E–W slabs, or draw a **knife** line anywhere;
  scrub the slab through the deposit; view along the cut; orthographic or
  perspective. Vertical exaggeration when the geology is flat.
- **Pick** any point, block, or interval — the full source record docks on the
  right. **Measure** between two picked elements: 3D · plan · Δz, computed from
  the source coordinates, not the screen.
- **Derive columns** — ƒ expressions (with an `if()`-ladder case table and
  constant sliders), materialized columns, painted domains (brush, or flag /
  assign-domains **by a solid or surface** — winding-number or depth-peel),
  key and spatial **joins**, collar→interval broadcasts. Every derived column
  filters, colors, and exports like a source column.
- **Check**: **join & reconcile** model versions (Δ map on a common lattice,
  volume-weighted for sub-blocked models), **grade–tonnage**, **swath / drift**
  along any direction, **validate against drillholes** (declustered), linked
  brushing between the 3D scene and every analysis window.
- **Project folder**: save to a real folder of plain files — CSVs kept as they
  were, derived columns as one Parquet file per column, readable JSON manifests
  recording every operation. **Lineage** is kept per layer and column, exports
  as an HTML report, and travels inside Parquet exports.
- **Automate**: analysis setups save as commented YAML **recipes**; routines
  chain them over parameter tables with a pre-flight guard and a live tracker.
- **Export**: report-ready PNG figures (scale bar, north arrow, legend, title),
  rows as CSV or Parquet (opening a `.dm` and exporting *is* the converter),
  meshes and grids back out.

However large the file, the browser keeps only a windowed slice of it in
memory; the GPU owns the rest. A 50-million-element model stays interactive.

## Scope

micro is a **viewer and QA bench**. It shows your data and checks it — read
anything, see the truth, filter, section, pick and measure, join, reconcile,
validate against drillholes, and convert between formats. The job is to let you
look honestly.

It is **not an estimation or geological-modelling suite, and that is
deliberate.** micro does not interpolate grades, build implicit models, classify
resources, or generate reports — the last mile a resource statement is actually
built from. It stops at *see and check*.

The line is a promise, not a limitation: micro stays the honest lens anyone can
use freely, kept small enough to keep its promises.

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
- G. Barill, N. G. Dickson, R. Schmidt, D. I. W. Levin, A. Jacobson. *Fast
  Winding Numbers for Soups and Clouds.* ACM Trans. Graph. 37(4), 2018.
  [doi:10.1145/3197517.3201337](https://doi.org/10.1145/3197517.3201337) — the
  generalized winding number behind flag-by-solid.

## This repo

The release surface for micro. The app is built in the
[auditable](https://github.com/gentropic/auditable) monorepo
(`node build.js --target=micro` → `micro.html`, engine `ext/condenser`, page
`tools/micro`); this repo owns the PWA shell (manifest, service worker, icons)
and deploys to GitHub Pages. `publish.mjs` wraps the newest `micro.html`
(release asset, or the committed seed) into `index.html`.

MIT — © Arthur Endlein Correia / Geoscientific Chaos Union ·
[gentropic.org](https://gentropic.org)
