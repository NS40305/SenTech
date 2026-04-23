import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import {
  createBeadGeometry,
  createLeadGeometry,
  createParticleCurve,
  HERO_PALETTE,
} from './thermistorGeometry';

const SCALE = 0.06; // mm → R3F scene units (so the part is ~2 R3F units long)

// ---------- Bead + leads ----------

function ThermistorMesh({ uTherm }: { uTherm: { value: number } }) {
  const beadRef = useRef<THREE.Mesh>(null!);
  const beadMatRef = useRef<THREE.MeshPhysicalMaterial>(null!);

  // Geometries are stable refs (memoize via useState init)
  const [beadGeom] = useState(() => createBeadGeometry());
  const [leadGeom] = useState(() => createLeadGeometry());

  useFrame((_, dt) => {
    if (beadMatRef.current) {
      // Lerp emissive intensity toward target driven by scroll-bound uTherm
      const target = uTherm.value;
      const current = beadMatRef.current.emissiveIntensity;
      beadMatRef.current.emissiveIntensity = THREE.MathUtils.damp(
        current,
        target * 1.6,
        4,
        dt
      );
    }
    // Subtle idle breathing on the bead
    if (beadRef.current) {
      const t = performance.now() * 0.001;
      const pulse = 1 + Math.sin(t * 1.5) * 0.012 * (0.4 + 0.6 * uTherm.value);
      beadRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group scale={SCALE}>
      <mesh ref={beadRef} geometry={beadGeom} castShadow receiveShadow>
        <meshPhysicalMaterial
          ref={beadMatRef}
          color={HERO_PALETTE.beadBase}
          metalness={0}
          roughness={0.32}
          clearcoat={HERO_PALETTE.beadClearcoat}
          clearcoatRoughness={HERO_PALETTE.beadClearcoatRoughness}
          emissive={HERO_PALETTE.beadEmissive}
          emissiveIntensity={0}
          ior={1.55}
          envMapIntensity={0.7}
        />
      </mesh>
      {/* Lead A — left */}
      <mesh geometry={leadGeom} position={[-1.75 - 7, 0, 0]} castShadow>
        <meshPhysicalMaterial
          color={HERO_PALETTE.leadBase}
          metalness={1}
          roughness={0.28}
          envMapIntensity={0.9}
        />
      </mesh>
      {/* Lead B — right */}
      <mesh geometry={leadGeom} position={[1.75 + 7, 0, 0]} castShadow>
        <meshPhysicalMaterial
          color={HERO_PALETTE.leadBase}
          metalness={1}
          roughness={0.28}
          envMapIntensity={0.9}
        />
      </mesh>
    </group>
  );
}

// ---------- Particle stream ----------

const PARTICLE_COUNT = 140;

function Particles({ uTherm }: { uTherm: { value: number } }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useRef(new THREE.Object3D()).current;
  const color = useRef(new THREE.Color()).current;

  const [curve] = useState(() => createParticleCurve());

  // Each particle has its own progress along the curve (0..1) + speed offset
  const [particleData] = useState(() =>
    Array.from({ length: PARTICLE_COUNT }, () => ({
      t: Math.random(),
      speed: 0.18 + Math.random() * 0.18,
      lateral: (Math.random() - 0.5) * 0.6, // mm jitter perpendicular to curve
      vertical: (Math.random() - 0.5) * 0.4,
      size: 0.22 + Math.random() * 0.18,
    }))
  );

  useFrame((_, dt) => {
    if (!meshRef.current) return;
    const speedMul = 0.3 + uTherm.value * 1.4;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particleData[i];
      p.t = (p.t + p.speed * speedMul * dt) % 1;

      const point = curve.getPointAt(p.t);
      const tangent = curve.getTangentAt(p.t).normalize();
      // Build a perpendicular offset frame
      const up = new THREE.Vector3(0, 1, 0);
      const right = new THREE.Vector3().crossVectors(tangent, up).normalize();
      const upN = new THREE.Vector3().crossVectors(right, tangent).normalize();

      dummy.position
        .copy(point)
        .addScaledVector(right, p.lateral)
        .addScaledVector(upN, p.vertical)
        .multiplyScalar(SCALE);
      dummy.scale.setScalar(p.size * SCALE * (0.6 + uTherm.value * 0.6));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Color: cold → mid → hot as particle traverses left→right
      if (p.t < 0.45) color.copy(HERO_PALETTE.particleCold).lerp(HERO_PALETTE.particleMid, p.t / 0.45);
      else color.copy(HERO_PALETTE.particleMid).lerp(HERO_PALETTE.particleHot, (p.t - 0.45) / 0.55);
      meshRef.current.setColorAt(i, color);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]} frustumCulled={false}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial toneMapped={false} transparent opacity={0.85} />
    </instancedMesh>
  );
}

// ---------- Scene ----------

interface SceneProps {
  uTherm: { value: number };
  autoRotate: boolean;
}

function Scene({ uTherm, autoRotate }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame((_, dt) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += dt * 0.18 * (0.4 + uTherm.value * 0.6);
    }
  });

  return (
    <>
      {/* Lighting rig per spec §10 */}
      <ambientLight intensity={0.25} color={HERO_PALETTE.ambient} />
      <directionalLight
        color="#00A6C0"
        intensity={1.4}
        position={[2, 1.5, 1]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight color="#F7F6F0" intensity={0.4} position={[-2, 0.8, 1]} />
      <directionalLight color="#3A6BA5" intensity={0.4} position={[0, -0.8, -2]} />

      <Environment preset="warehouse" environmentIntensity={0.35} />

      <Float
        speed={1.2}
        rotationIntensity={autoRotate ? 0 : 0.15}
        floatIntensity={0.25}
        floatingRange={[-0.04, 0.04]}
      >
        <group ref={groupRef}>
          <ThermistorMesh uTherm={uTherm} />
          <Particles uTherm={uTherm} />
        </group>
      </Float>

      <ContactShadows
        opacity={0.45}
        scale={6}
        blur={2.4}
        far={2}
        resolution={512}
        position={[0, -0.4, 0]}
        color="#000814"
      />
    </>
  );
}

// ---------- Top-level component (Astro island target) ----------

export interface ThermistorShowcaseProps {
  fallbackImage?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

export default function ThermistorShowcase({
  eyebrow = 'Sense the signal',
  title = 'Precision at the chip level.',
  subtitle = 'NTC chip → element → finished sensor — visualised end-to-end. Scroll to energise.',
}: ThermistorShowcaseProps) {
  const uTherm = useRef({ value: 0.05 }).current;
  const sectionRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(false);

  // Scroll-progress → uTherm 0..1 binding (0 when section bottom enters view, 1 when its top hits viewport top)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let raf = 0;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      // 0 when section bottom = vh (just entering); 1 when section top = 0 (centered/past)
      const progress = THREE.MathUtils.clamp(
        1 - (rect.top + rect.height * 0.4) / vh,
        0,
        1
      );
      uTherm.value = progress;
      setAutoRotate(progress > 0.5);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [uTherm]);

  return (
    <section ref={sectionRef} className="thermistor-showcase">
      <div className="thermistor-showcase__intro">
        <span className="thermistor-showcase__eyebrow">{eyebrow}</span>
        <h2 className="thermistor-showcase__title">{title}</h2>
        <p className="thermistor-showcase__sub">{subtitle}</p>
      </div>
      <div className="thermistor-showcase__canvas">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 0.5, 4.2], fov: 28, near: 0.1, far: 50 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ background: 'transparent' }}
        >
          <Scene uTherm={uTherm} autoRotate={autoRotate} />
        </Canvas>
      </div>
    </section>
  );
}
