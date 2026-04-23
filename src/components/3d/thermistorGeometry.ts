import * as THREE from 'three';

/**
 * Builds a lentil-shaped epoxy bead matching the design spec:
 *   diameter 3.5 mm, thickness 2.7 mm, height/width 0.78,
 *   slight -0.1 mm Y droop on the underside (epoxy meniscus),
 *   small ~0.25 mm fillet where the leads enter via a soft taper at the equator.
 *
 * Exposed in millimeters — the consuming scene scales everything to a
 * comfortable hero size (1 unit ≈ 1 mm × scale factor in <Showcase>).
 */
export function createBeadGeometry(): THREE.BufferGeometry {
  const radius = 1.75; // mm — half of Ø 3.5
  const heightScale = 0.78; // lentil flatten
  const droop = 0.1; // mm Y droop on underside

  // Custom revolved profile — 13 profile points, 32 radial segments
  const profilePoints: THREE.Vector2[] = [];
  const profileSamples = 13;
  for (let i = 0; i <= profileSamples; i++) {
    const t = i / profileSamples; // 0 at top, 1 at bottom
    const theta = t * Math.PI; // 0..PI
    // Base sphere profile
    const r = Math.sin(theta) * radius;
    let y = Math.cos(theta) * radius * heightScale;
    // Apply asymmetric droop on underside (y < 0)
    if (y < 0) y -= droop * Math.pow(-y / (radius * heightScale), 1.5);
    profilePoints.push(new THREE.Vector2(Math.max(r, 0.0001), y));
  }

  const geom = new THREE.LatheGeometry(profilePoints, 32);
  geom.computeVertexNormals();
  geom.computeBoundingBox();
  return geom;
}

/**
 * Builds a single lead cylinder: Ø 0.45 mm × 14 mm,
 * positioned along +X (so the unit cylinder along Y must be rotated).
 * Returns a geometry pre-rotated so that local +X is the lead axis.
 */
export function createLeadGeometry(): THREE.BufferGeometry {
  const radius = 0.225; // mm — half of Ø 0.45
  const length = 14; // mm
  const radialSegments = 12;

  const geom = new THREE.CylinderGeometry(
    radius,
    radius,
    length,
    radialSegments,
    1,
    false
  );
  // Rotate so cylinder lies along +X
  geom.rotateZ(Math.PI / 2);
  geom.computeVertexNormals();
  return geom;
}

/**
 * Curve along which particles travel: lead_in → bead surface → lead_out.
 * Returns a CatmullRomCurve3 in millimeters, oriented along +X.
 */
export function createParticleCurve(): THREE.CatmullRomCurve3 {
  const beadRadius = 1.75;
  const leadHalfLength = 7; // half-length of one lead
  const leadOffset = beadRadius + leadHalfLength; // tip of each lead from origin

  const points = [
    new THREE.Vector3(-leadOffset, 0, 0), // lead_in tip
    new THREE.Vector3(-beadRadius, 0, 0), // entering bead
    new THREE.Vector3(0, 0.6, 0), // arc over the bead's top
    new THREE.Vector3(beadRadius, 0, 0), // exiting bead
    new THREE.Vector3(leadOffset, 0, 0), // lead_out tip
  ];

  const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.4);
  return curve;
}

/**
 * World positions of the two particle anchor sockets (matches glTF empties
 * named socket_in / socket_out from the design spec).
 */
export const SOCKET_IN: [number, number, number] = [-15.75, 0, 0];
export const SOCKET_OUT: [number, number, number] = [15.75, 0, 0];

export const HERO_PALETTE = {
  beadBase: '#06121F',
  beadEmissive: '#00A6C0',
  beadClearcoat: 0.15,
  beadClearcoatRoughness: 0.08,
  leadBase: '#C9CDD2',
  ambient: '#0E2A47',
  particleCold: new THREE.Color('#3B82F6'),
  particleMid: new THREE.Color('#00A6C0'),
  particleHot: new THREE.Color('#F59E0B'),
} as const;
