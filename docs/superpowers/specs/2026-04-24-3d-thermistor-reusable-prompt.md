# Reusable Prompt — SEN TECH Hero NTC Thermistor 3D Model

Hand this prompt to a 3D modeling AI (e.g. Meshy, Spline AI, or a human artist working in Blender 4.2 LTS) to produce the v1.0.0 hero asset.

> The prompt below is also reproduced inside `docs/superpowers/specs/2026-04-24-3d-thermistor-model-design.md` §13.E — keep them in sync if either is edited.

---

```text
ROLE
You are a senior 3D product modeler producing a marketing/web-grade hero asset
for SEN TECH (a Taiwan NTC thermistor manufacturer).

OBJECTIVE
Model one (1) high-precision axial-lead epoxy NTC thermistor in the HAT/HT
family silhouette, optimized for React Three Fiber on a dark industrial
website, with first-class support for a particle-flow animation that travels
through the leads and across the bead.

REFERENCE FAMILY
- SEN TECH HAT / HT series, datasheets at https://www.sen-tech.com/ntc_03.html
  and /ntc_04.html (already on file in /public/pdfs/)
- Real-world dimensions: bead Ø 3.5 mm × 2.7 mm thick, leads Ø 0.45 mm × 14 mm
  each side, total length 31.5 mm

GEOMETRY
- 3 named meshes inside one object: Bead, Lead_A, Lead_B
- All-quad bead, lentil profile (Z-scale 0.78), with a 0.25 mm fillet at the
  lead-bead junction and a slight (-0.1 mm Y) underside droop
- Lead caps are flat (90°), no rounding
- Origin at bead center, +X = lead axis, units in millimeters
- LOD0 ≤ 4,800 tris; LOD1 ≤ 1,800 tris

MATERIALS (PBR metal/roughness, glTF-native)
1. Epoxy_Bead: base #06121F, roughness 0.32, IOR 1.55, subsurface 0.06
   tinted #00A6C0, emissive map (white in bead island, black elsewhere) driven
   by uniform uTherm 0..1, clearcoat 0.15.
2. Tinned_Lead: base #C9CDD2, metallic 1.0, roughness 0.28 anisotropic 0.6
   length-aligned, no emissive.

DECALS
- 0.4 mm "S" wordmark in #E4E7EB and Ø 0.5 mm cyan dot #00A6C0,
  baked onto the bead's +Y face 0.6 mm from the bead-lead junction.

VARIANTS (KHR_materials_variants)
default-navy ✱, inspection-light, automotive-red, medical-white.

ANIMATION HOOKS
- 1 morph target "bead_pulse" (±1.5 % radial)
- 2 empty nodes "socket_in" at (-15.75, 0, 0) and "socket_out" at
  (+15.75, 0, 0), both exported as glTF nodes for runtime particle binding.

UV / TEXTURES
- Single 1024² atlas, 3 islands (bead 60 %, lead_A, lead_B mirrored)
- Maps: baseColor 1024² WebP, metallicRoughness 1024² WebP, normal 1024² WebP,
  emissive 512² WebP

EXPORT
- thermistor-hero.glb: Draco compressed, WebP textures, all variants, all
  morph targets, both empties. Target ≤ 300 KB total.
- thermistor-lite.glb: LOD1 + 512² atlas, no morph, ≤ 80 KB.
- Both must pass gltf-validator with 0 errors, 0 warnings.

VERIFICATION (must demonstrate before claiming done)
- Side-on render reads as a thermistor in <1 s for an OEM-engineer reviewer.
- A/B vs the existing 2D product photo: ≥ 80 % prefer the 3D render.
- Loads in Three.js sandbox under 500 ms over 4G; ≥ 45 fps with 200 particles
  on Pixel 6a; lighthouse Perf delta on the host page ≤ −4 pts.
- All 4 KHR_materials_variants switch correctly at runtime.

DELIVERABLES
- thermistor.blend master
- thermistor-hero.glb + thermistor-lite.glb
- 4 marketing renders (3840×2160, 3840×2160 @2x, 2400×1800 top, 2400×2400 macro)
- studio-dark-1024.hdr environment map matching the cinematic lighting rig
- art-direction.md, integration.md, changelog.md

Respond with a confirmation that you understand the brief, then produce the
work in the phased pipeline:
Phase 1 Blockout → Phase 2 Detail → Phase 3 UV+Bake → Phase 4 Materials/Variants
→ Phase 5 Export+Validate → Phase 6 Renders → Phase 7 Web verify.

Each phase ends with a screenshot or numeric measurement that proves the
phase passed before moving on. No claim of "done" without evidence.
```
