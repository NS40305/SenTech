# SEN TECH Hero NTC Thermistor — 3D Model Pipeline Plan

> For agentic workers: REQUIRED SUB-SKILL — use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `thermistor-hero.glb` (≤ 300 KB) + `thermistor-lite.glb` (≤ 80 KB) + 4 marketing renders + the `<ThermistorShowcase>` Astro/R3F integration on the SEN TECH website, meeting all acceptance criteria in `docs/superpowers/specs/2026-04-24-3d-thermistor-model-design.md`.

**Architecture:** Asset master is a Blender 4.2 LTS file in a separate git worktree (`assets/3d/thermistor-hero`, branch `assets/thermistor`) so multi-MB `.blend` files never inflate the website repo. Final GLBs + WebP renders ship into `sentech-redesign/public/models/` and `/renders/`. Web integration is a `client:visible` Astro island wrapping a React Three Fiber scene.

**Tech stack:** Blender 4.2 LTS, glTF 2.0 + Draco, WebP textures, KHR_materials_variants, React Three Fiber, drei, three.js, Astro 6.

---

## Phase 0 — Worktree + folder scaffolding

**Files / state to set up:**
- Branch `assets/thermistor` checked out in `assets/3d/thermistor-hero/`
- Folder tree per spec §13.D

- [ ] **Step 0.1** `git worktree add -b assets/thermistor ../assets/3d/thermistor-hero main`
- [ ] **Step 0.2** Create folder skeleton (source/, exports/, textures/, renders/, envmap/, docs/)
- [ ] **Step 0.3** Pin Blender version in `source/README.md` (4.2 LTS)
- [ ] **Step 0.4** Commit empty scaffold

**Done when:** worktree exists, folders present, Blender 4.2 opens cleanly.

---

## Phase 1 — Blockout (1–2 h)

**Files:**
- Create: `source/thermistor.blend`

- [ ] **Step 1.1** Add cylinder, scale to 0.45 mm Ø × 14 mm. Name `Lead_A`.
- [ ] **Step 1.2** Mirror across X. Name copy `Lead_B`.
- [ ] **Step 1.3** Add UV sphere, 24 segments × 12 rings, scale Z 0.78. Name `Bead`.
- [ ] **Step 1.4** Verify silhouette from camera `(0, 0.6, 4.5)` reads as a thermistor.

**Done when:** non-engineer reviewer identifies it as "an electronic component / thermistor" within 0.5 s. Screenshot saved to `docs/phase1-blockout.png`.

**Phase gate (request art review):** Slack the screenshot. Proceed only on ✅.

---

## Phase 2 — Detail modeling (2–3 h)

- [ ] **Step 2.1** Add Shrinkwrap + Bevel modifiers for 0.25 mm lead-bead fillet
- [ ] **Step 2.2** Apply −0.1 mm Y droop to bead profile (epoxy meniscus)
- [ ] **Step 2.3** Cut lead caps flat (no rounding)
- [ ] **Step 2.4** Apply modifier stack; rename meshes per spec §3
- [ ] **Step 2.5** Verify topology: ≤ 4,800 tris, no n-gons, normals outside

**Done when:** `Mesh Statistics` shows tris ≤ 4,800; `Mesh Analysis → Distortion` shows zero distortion; `Recalculate Normals → Outside` is a no-op.

---

## Phase 3 — UV unwrap + texture bake (1–2 h)

**Files:**
- Create: `textures/_src/baseColor_4096.png`, `metallicRoughness_4096.png`, `normal_4096.png`, `emissive_2048.png`
- Create: `textures/thermistor_baseColor.webp`, `…_metallicRoughness.webp`, `…_normal.webp`, `…_emissive.webp`

- [ ] **Step 3.1** Mark UV seams (lead axis + bead equator)
- [ ] **Step 3.2** Smart UV unwrap → manual cleanup to match spec §6 atlas
- [ ] **Step 3.3** Bake normal map at 4096², downscale to 1024²
- [ ] **Step 3.4** Paint baseColor with brand hexes (`#06121F`, `#0E2A47`, `#C9CDD2`)
- [ ] **Step 3.5** Add S wordmark + cyan dot decals to baseColor + roughness
- [ ] **Step 3.6** Convert all maps to WebP (q=85, q=90 for normal)

**Done when:** all 4 maps render correctly in Blender preview, no UV bleeding visible at 1× zoom, no decal smudging.

---

## Phase 4 — Materials + variants + animation hooks (1 h)

- [ ] **Step 4.1** Build `Epoxy_Bead` shader graph per spec §4
- [ ] **Step 4.2** Build `Tinned_Lead` shader graph (anisotropy aligned to local +X) per spec §4
- [ ] **Step 4.3** Add 4 KHR_materials_variants per spec §5
- [ ] **Step 4.4** Add morph target `bead_pulse` (±1.5 % radial)
- [ ] **Step 4.5** Add empties `socket_in` at `(-15.75, 0, 0)`, `socket_out` at `(+15.75, 0, 0)`

**Done when:** F12 render visually matches the art-direction reference image (side-by-side compare).

---

## Phase 5 — Export + web validation (1 h)

**Files:**
- Create: `exports/thermistor-hero.glb`, `exports/thermistor-hero.gltf`, `exports/thermistor-lite.glb`

- [ ] **Step 5.1** glTF export with Draco compression, WebP textures, all variants, both LODs
- [ ] **Step 5.2** Run `gltf-validator exports/thermistor-hero.glb` → must report 0 errors, 0 warnings
- [ ] **Step 5.3** CodeSandbox smoke test: load via `useGLTF`, assert
  - Loads under 500 ms over 4G simulation
  - Renders correctly in Chromium, Safari (iOS device), Firefox
  - All 4 variants switch via `selectMaterialVariant`
  - Empties resolvable via `getObjectByName('socket_in' | 'socket_out')`
  - Morph target controllable via `morphTargetInfluences[0]`
- [ ] **Step 5.4** Lighthouse on the sandbox ≥ 92 perf

**Done when:** all 4 sub-checks pass. Save lighthouse JSON to `docs/phase5-lighthouse.json`.

---

## Phase 6 — Marketing renders (1 h)

**Files:**
- Create: `renders/render_hero_3840x2160.webp`, `…@2x.webp`, `render_top_2400x1800.webp`, `render_macro_bead_2400x2400.webp`, `MANIFEST.json`

- [ ] **Step 6.1** Render the 4 frames with cinematic lighting rig (cyan key + warm fill + cool back)
- [ ] **Step 6.2** Convert to WebP q=85 (q=90 for @2x)
- [ ] **Step 6.3** Write `MANIFEST.json` with capture date + camera params

**Done when:** 4 renders saved + manifest committed.

---

## Phase 7 — Web integration (subagent-driven; 4 parallel tracks)

**Files (in sentech-redesign repo):**
- Create: `public/models/thermistor-hero.glb`, `public/models/thermistor-lite.glb`
- Create: `public/renders/thermistor-hero-3840.webp`, `thermistor-macro-bead-2400.webp`
- Create: `src/components/3d/ThermistorShowcase.tsx`
- Create: `src/components/3d/useThermistorScroll.ts`
- Create: `src/components/3d/particles.ts`
- Modify: `src/pages/index.astro`, `src/pages/zh-tw/index.astro` (insert showcase between Hero and NumbersStrip)
- Modify: `package.json` (add `@react-three/fiber`, `@react-three/drei`, `three`)

### Track A — Modeling (3D artist)
- [ ] Phase 1–6 above

### Track B — Materials (look-dev)
- [ ] All 4 variants ship in GLB
- [ ] Visual diff vs reference renders ≤ ΔE 5

### Track C — Optimization (tech artist)
- [ ] `thermistor-lite.glb` ≤ 80 KB
- [ ] Total wire size ≤ 320 KB (gzipped)
- [ ] Draco quant levels: pos 14, normal 10, texcoord 12

### Track D — Web integration (R3F engineer)
- [ ] `<ThermistorShowcase>` mounts via `client:visible`
- [ ] Static fallback `<img>` shown until WebGL ready (CLS ≤ 0.005)
- [ ] 200-particle GPU instanced system bound to `socket_in → socket_out`
- [ ] Scroll-driven `uTherm` 0..1 wired via `useScroll`
- [ ] Lighthouse home perf delta ≤ −4 pts vs current baseline

Each track ends with `requesting-code-review`. Final integration runs `verification-before-completion` to confirm all four streams converged before the merge PR.

**Done when:** all 4 tracks ✅, integration PR opens with screenshots + Lighthouse run + A/B poll thread linked.

---

## Phase 8 — Final polish + tag

- [ ] Run the spec §12 acceptance checklist in full; attach evidence to each item
- [ ] Tag `assets/v1.0.0-thermistor` in the asset worktree
- [ ] Open PR `assets-v1.0.0-thermistor → main` in the asset repo with all 4 marketing renders inline
- [ ] In sentech-redesign repo: open PR `feat: add 3D thermistor showcase island` with Lighthouse before/after
- [ ] On both PRs merging → delete the worktree per `superpowers:finishing-a-development-branch`

---

## Common debug notes (preloaded from `systematic-debugging`)

| Symptom | Likely cause | Fix |
|---|---|---|
| Bead looks washed out in R3F | `envMapIntensity` too high | Set to 0.7 |
| Cyan dot mark blurs at 2× DPR | Decal painted at 1024² but viewed at 2048 | Paint decal at 4096², downscale on export |
| Particles vanish behind leads | Z-fighting at lead surface | `material.depthWrite = true` on leads, `depthTest = true` on particles |
| Variants don't switch | KHR_materials_variants extension stripped | Re-export with "Include extensions" checked |
| GLB is 1.2 MB instead of 300 KB | Embedded uncompressed PNG | Re-export with Draco enabled + WebP texture mode |
| iOS Safari shows black bead | WebGL2 not enabled / KTX2 fallback failed | Ship WebP only, not KTX2 (deferred to v1.1) |

---

## Out of scope (v1.1+)

- PCB-mounted variant with bent leads + solder fillet
- Glass bead, disk-style, axial-resistor variants (each its own spec)
- KTX2 / Basis Universal textures
- WebGPU-only enhancements
- Full RFQ form integration on click of the model
