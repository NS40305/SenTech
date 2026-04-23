# SEN TECH Hero NTC Thermistor — 3D Model Design Spec

**Date:** 2026-04-24
**Owner:** Web design + asset team
**Status:** Approved spec. Ready for `writing-plans` → execution.
**Worktree:** `assets/3d/thermistor-hero` (new branch `assets/thermistor`)

---

## 1. Goal (one sentence)

Produce a single web-ready glTF/GLB of a high-precision axial-lead epoxy NTC thermistor in the SEN TECH HAT/HT silhouette, optimized for React Three Fiber on a dark industrial website with first-class support for a particle-flow animation that travels through the leads and across the bead.

## 2. Concept

- Archetype: **HAT/HT-style high-precision epoxy NTC thermistor** (chosen over glass bead, disk, and plain axial resistor).
- Form: flattened-lentil dark navy epoxy bead, ~3.5 mm Ø × 2.7 mm thick, joined to two 14 mm tinned-copper leads.
- Identity: tiny cyan dot + "S" wordmark on the bead's top face (no SEN TECH logo on the part itself — realistic).
- Web role: hero product object in a 1/3-height interactive band below the homepage Hero. Particles enter at left lead → cross bead (visible thermal sensing) → exit right lead.

## 3. Geometry

| Property | Value |
|---|---|
| Bead | Ø 3.5 × 2.7 mm, lentil profile, 0.78 height/width |
| Leads | Ø 0.45 mm × 14 mm each side, straight, flat-cut tips |
| Total length | 31.5 mm |
| Lead-bead fillet | 0.25 mm |
| Asymmetry | −0.1 mm Y droop on bead underside (epoxy meniscus) |
| Origin | bead center, +X = lead axis |
| Unit scale | 1 BU = 1 mm |
| Mesh structure | 3 named meshes: `Bead`, `Lead_A`, `Lead_B` (no Boolean union) |
| Tris budget | LOD0 ≤ 4,800; LOD1 ≤ 1,800 |
| Topology | all-quad bead, 12-side lead cylinders, no n-gons, no flipped normals |

## 4. Materials (PBR metal/roughness)

### `Epoxy_Bead`
- baseColor `#06121F`, rim `#0E2A47`
- metallic 0.0, roughness 0.32, IOR 1.55
- subsurface 0.06 weight, color `#00A6C0`
- emissive map (white in bead island, black elsewhere) × `uTherm` 0..1
- clearcoat 0.15, clearcoat roughness 0.08

### `Tinned_Lead`
- baseColor `#C9CDD2`
- metallic 1.0, roughness 0.28
- anisotropy 0.6, length-aligned to local +X
- no emissive

### Decals (baked into Epoxy_Bead baseColor + roughness)
- 0.4 mm "S" wordmark `#E4E7EB`
- Ø 0.5 mm cyan dot `#00A6C0`
- Position: bead +Y face, 0.6 mm from bead-lead junction

## 5. Variants (KHR_materials_variants)

| Variant | Bead | Leads | Use |
|---|---|---|---|
| `default-navy` ✱ | `#06121F` matte | tinned silver | Hero, dark backgrounds |
| `inspection-light` | `#1B1F23` carbon matte | tinned silver | Spec page on white bg |
| `automotive-red` | `#7A1414` deep oxide | tinned silver | Future automotive vertical |
| `medical-white` | `#E4E7EB` ceramic | tin-bismuth cooler grey | Future TS body-temp variant |

## 6. Textures (single 1024² atlas)

| Map | Resolution | Format | Channels | sRGB |
|---|---|---|---|---|
| baseColor | 1024² | WebP q=85 | RGB | yes |
| metallicRoughness | 1024² | WebP q=85 | G=R, B=M | no |
| normal | 1024² | WebP q=90 | RGB normal | no |
| emissive | 512² | WebP q=85 | RGB | yes |

UV islands: bead 60 %, lead_A, lead_B (mirrored, shares lead_A region). 8 px atlas margin.

## 7. Animation hooks

- **Morph target** `bead_pulse`: ±1.5 % radial, drives idle breathing.
- **Empty nodes** `socket_in` at `(-15.75, 0, 0)` and `socket_out` at `(+15.75, 0, 0)` — exported as glTF nodes for runtime particle binding.
- **Shader uniforms** consumed by R3F: `uTherm` 0..1, `uTransition` 0..1.

## 8. Export

- `thermistor-hero.glb` — Draco geometry + WebP textures, all variants, morph, both empties. Target ≤ 300 KB.
- `thermistor-lite.glb` — LOD1, 512² atlas, no morph. Target ≤ 80 KB.
- glTF extensions: `KHR_draco_mesh_compression`, `KHR_materials_emissive_strength`, `KHR_materials_variants`.
- Both must pass `gltf-validator` with 0 errors, 0 warnings.

## 9. Marketing renders (rasterized, accompany the GLB)

| File | Resolution | Use |
|---|---|---|
| `render_hero_3840x2160.webp` | 3840×2160 | Showcase static fallback, OG image |
| `render_hero_3840x2160@2x.webp` | 7680×4320 | Retina fallback |
| `render_top_2400x1800.webp` | 2400×1800 | Spec page top illustration |
| `render_macro_bead_2400x2400.webp` | 2400×2400 | Replaces existing scraped product hero shots |

## 10. Website integration

- Mount as `<ThermistorShowcase />` Astro island between Hero and NumbersStrip on the homepage.
- Height `min(560px, 70svh)`. Loads via `client:visible`.
- Camera: pos `(0, 0.6, 4.5)`, target `(0, 0, 0)`, FOV 28°, 6° elevation.
- Background: `var(--color-primary)` + faint navy circuit pattern + cyan radial glow at 30 % from right.
- Lighting: cyan key (#00A6C0 @ 1.4) at `(2, 1, 1)`; warm white fill at `(-2, 0.5, 1)`; cool back at `(0, -0.6, -2)`.
- Tone-mapping: ACESFilmic, exposure 1.05; envMapIntensity 0.7.
- Particles: 200-instance GPU `InstancedMesh`, route bound to `socket_in → bead → socket_out` curve; HSL hue lerp blue → cyan → amber across the route.

## 11. Scroll-driven energizing timeline

| Scroll | uTherm | Particles | Visual |
|---|---|---|---|
| 0.00–0.10 | 0.00 | 0/s | Dormant |
| 0.10–0.30 | 0–0.25 | 0–8/s | Particles begin |
| 0.30–0.55 | 0.25–0.65 | 8–32/s | Bead glows, hue shifts |
| 0.55–0.80 | 0.65–1.0 | 32–80/s | Peak luminance |
| 0.80–1.0 | 1.0–0.5 | 80–16/s | Cool-down + slow rotate, mark visible |

## 12. Acceptance criteria (verification-before-completion)

Recognition
- [ ] 5/5 OEM-engineer reviewers identify it as a thermistor in <1 s
- [ ] No reviewer comment "looks like a toy / generic / sci-fi"

Premium feel
- [ ] A/B vs current 2D product photo: ≥ 80 % prefer 3D render

Web rendering
- [ ] Total wire payload ≤ 320 KB
- [ ] First render ≤ 80 ms M1 Air, ≤ 220 ms Pixel 6a
- [ ] Home Lighthouse perf delta ≤ −4 pts
- [ ] CLS contribution ≤ 0.005 (mounted with `client:visible` + static fallback)

Particle integration
- [ ] `socket_in` / `socket_out` resolvable by name
- [ ] 200 particles ≥ 60 fps M1 Air, ≥ 45 fps Pixel 6a
- [ ] Hue lerp completes correctly across scroll 0–1

R3F readiness
- [ ] `gltf-validator` 0/0
- [ ] `useGLTF()` loads without Suspense hangs
- [ ] `selectMaterialVariant` switches all 4 variants
- [ ] Morph target animates via `morphTargetInfluences`

Cross-browser
- [ ] Chrome 126+, Firefox 128+, Safari 17+, Edge 126+
- [ ] iOS Safari 17 real device
- [ ] Android Chrome on Pixel 6a ≥ 45 fps with full particles

Each ✅ requires linked evidence (screenshots, Lighthouse JSON, A/B poll).

## 13. Out of scope (deferred)

- PCB-mounted variant with bent leads + solder fillet (v1.1)
- Glass bead variant (separate spec, different archetype)
- Disk variant
- Animated curve graph overlay (handled by R3F-side, not part of GLB)
- WebGPU-only enhancements like KHR_materials_dispersion
