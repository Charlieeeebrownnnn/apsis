'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

type JackConfig = {
  target: [number, number, number];
  scale: number;
  rotation: [number, number, number];
  delay: number;
  drift: number;
  color: string;
  emissive?: string;
  repulse: number;
};

type RingProfile = {
  opacity: number;
  radius: number;
  rotation: [number, number, number];
  scale?: [number, number, number];
  tube: number;
};

type MoonProfile = {
  angle: number;
  distance: number;
  radius: number;
  y: number;
};

type BandProfile = {
  color: string;
  opacity: number;
  radius: number;
  tube: number;
  y: number;
};

type SurfaceMarkProfile = {
  color: string;
  opacity: number;
  phi: number;
  scale: number;
  theta: number;
};

type PlanetProfile = {
  atmosphere?: {
    color: string;
    opacity: number;
    scale: number;
  };
  bands?: BandProfile[];
  color: string;
  emissive?: string;
  metalness: number;
  moons: MoonProfile[];
  name: string;
  radius: number;
  ringColor?: string;
  rings: RingProfile[];
  roughness: number;
  scale: [number, number, number];
  surfaceMarks?: SurfaceMarkProfile[];
};

const FIELD_BLACK = '#050504';
const FIELD_WARM_LIGHT = '#f0e7d8';
const FIELD_BONE = '#cfc5b4';
const FIELD_BRONZE = '#8e765f';

const planetProfiles: PlanetProfile[] = [
  {
    color: '#777064',
    metalness: 0.22,
    moons: [],
    name: 'Mercury',
    radius: 0.22,
    ringColor: '#a79c8b',
    rings: [{ opacity: 0.12, radius: 0.5, rotation: [1.42, 0.2, 0.08], tube: 0.004 }],
    roughness: 0.9,
    scale: [1, 0.94, 1],
    surfaceMarks: [
      { color: '#35312d', opacity: 0.5, phi: 1.1, scale: 0.028, theta: 0.8 },
      { color: '#4b453e', opacity: 0.4, phi: 2.1, scale: 0.02, theta: 2.8 },
      { color: '#2e2a26', opacity: 0.42, phi: 1.6, scale: 0.018, theta: 4.6 },
    ],
  },
  {
    atmosphere: { color: '#b59a79', opacity: 0.055, scale: 1.2 },
    color: '#967b61',
    emissive: '#0b0704',
    metalness: 0.16,
    moons: [],
    name: 'Venus',
    radius: 0.3,
    ringColor: '#bba98e',
    rings: [{ opacity: 0.09, radius: 0.68, rotation: [1.34, -0.26, 0.4], tube: 0.005 }],
    roughness: 0.78,
    scale: [1, 0.98, 1],
  },
  {
    atmosphere: { color: '#6f8181', opacity: 0.06, scale: 1.18 },
    color: '#465659',
    emissive: '#020706',
    metalness: 0.16,
    moons: [],
    name: 'Earth',
    radius: 0.34,
    rings: [
      { opacity: 0.1, radius: 0.78, rotation: [1.5, 0.14, -0.18], tube: 0.004 },
      { opacity: 0.055, radius: 0.98, rotation: [1.12, 0.78, 0.2], tube: 0.003 },
    ],
    ringColor: '#a8b0a6',
    roughness: 0.76,
    scale: [1, 0.98, 1],
    surfaceMarks: [
      { color: '#75705b', opacity: 0.32, phi: 1.2, scale: 0.036, theta: 0.6 },
      { color: '#252f28', opacity: 0.24, phi: 2.05, scale: 0.03, theta: 3.2 },
    ],
  },
  {
    color: '#a49b8c',
    metalness: 0.14,
    moons: [],
    name: 'Moon',
    radius: 0.2,
    ringColor: '#d7cdbd',
    rings: [{ opacity: 0.1, radius: 0.5, rotation: [1.18, -0.3, 0.38], tube: 0.003 }],
    roughness: 0.94,
    scale: [1, 0.96, 1],
    surfaceMarks: [
      { color: '#2c2925', opacity: 0.58, phi: 1.1, scale: 0.038, theta: 0.4 },
      { color: '#3c3832', opacity: 0.5, phi: 1.8, scale: 0.03, theta: 2.4 },
      { color: '#292622', opacity: 0.46, phi: 2.4, scale: 0.022, theta: 4.2 },
    ],
  },
  {
    color: '#7a5548',
    emissive: '#090403',
    metalness: 0.14,
    moons: [],
    name: 'Mars',
    radius: 0.26,
    ringColor: '#a3816d',
    rings: [{ opacity: 0.1, radius: 0.72, rotation: [1.44, -0.42, -0.24], tube: 0.004 }],
    roughness: 0.86,
    scale: [1, 0.95, 1],
    surfaceMarks: [
      { color: '#33221e', opacity: 0.4, phi: 1.3, scale: 0.026, theta: 1.2 },
      { color: '#9b7562', opacity: 0.24, phi: 2.0, scale: 0.02, theta: 3.9 },
    ],
  },
  {
    atmosphere: { color: '#9f876c', opacity: 0.045, scale: 1.08 },
    bands: [
      { color: '#3d332a', opacity: 0.22, radius: 0.44, tube: 0.012, y: -0.14 },
      { color: '#b08d6f', opacity: 0.15, radius: 0.47, tube: 0.01, y: 0.02 },
      { color: '#2f2821', opacity: 0.18, radius: 0.42, tube: 0.008, y: 0.16 },
    ],
    color: '#8b7057',
    emissive: '#0b0603',
    metalness: 0.12,
    moons: [],
    name: 'Jupiter',
    radius: 0.48,
    rings: [
      { opacity: 0.08, radius: 1.06, rotation: [1.5, 0.1, 0.08], tube: 0.004 },
      { opacity: 0.05, radius: 1.3, rotation: [1.22, -0.48, 0.1], tube: 0.003 },
    ],
    ringColor: '#b6a083',
    roughness: 0.76,
    scale: [1, 0.86, 1],
  },
  {
    atmosphere: { color: '#aa987d', opacity: 0.045, scale: 1.1 },
    color: '#8d7c62',
    metalness: 0.2,
    moons: [],
    name: 'Saturn',
    radius: 0.42,
    rings: [
      { opacity: 0.34, radius: 0.88, rotation: [1.36, 0.18, -0.46], scale: [1.58, 0.42, 1], tube: 0.018 },
      { opacity: 0.22, radius: 1.08, rotation: [1.36, 0.18, -0.46], scale: [1.6, 0.42, 1], tube: 0.009 },
      { opacity: 0.12, radius: 1.3, rotation: [1.36, 0.18, -0.46], scale: [1.62, 0.42, 1], tube: 0.004 },
    ],
    ringColor: '#d1c2a6',
    roughness: 0.8,
    scale: [1, 0.84, 1],
  },
  {
    atmosphere: { color: '#758780', opacity: 0.05, scale: 1.14 },
    color: '#61736f',
    emissive: '#030807',
    metalness: 0.18,
    moons: [],
    name: 'Uranus',
    radius: 0.34,
    rings: [
      { opacity: 0.15, radius: 0.82, rotation: [0.25, 1.42, 0.18], tube: 0.005 },
      { opacity: 0.085, radius: 1.02, rotation: [0.25, 1.42, 0.18], tube: 0.003 },
    ],
    ringColor: '#9aa49d',
    roughness: 0.74,
    scale: [1, 0.96, 1],
  },
  {
    atmosphere: { color: '#59606f', opacity: 0.05, scale: 1.14 },
    color: '#3d4351',
    emissive: '#030407',
    metalness: 0.2,
    moons: [],
    name: 'Neptune',
    radius: 0.35,
    ringColor: '#888d9a',
    rings: [{ opacity: 0.105, radius: 0.88, rotation: [1.48, -0.16, 0.42], tube: 0.004 }],
    roughness: 0.72,
    scale: [1, 0.98, 1],
  },
  {
    color: '#81766a',
    metalness: 0.14,
    moons: [],
    name: 'Pluto',
    radius: 0.18,
    rings: [
      { opacity: 0.12, radius: 0.58, rotation: [1.18, 0.54, -0.32], tube: 0.003 },
      { opacity: 0.055, radius: 0.78, rotation: [0.72, -0.9, 0.22], tube: 0.002 },
    ],
    ringColor: '#aaa091',
    roughness: 0.92,
    scale: [1, 0.92, 1],
    surfaceMarks: [
      { color: '#5a5147', opacity: 0.34, phi: 1.4, scale: 0.018, theta: 1.8 },
    ],
  },
];

const jackConfigs: JackConfig[] = [
  {
    target: [-4.6, 1.55, -0.45],
    scale: 0.82,
    rotation: [0.35, -0.15, 0.5],
    delay: 0,
    drift: 0.24,
    color: '#131313',
    repulse: 1.1,
  },
  {
    target: [-3.2, -1.05, 0.18],
    scale: 0.96,
    rotation: [-0.28, 0.46, 0.24],
    delay: 0.08,
    drift: 0.28,
    color: '#101010',
    repulse: 1.18,
  },
  {
    target: [-1.75, 0.86, 0.35],
    scale: 1.02,
    rotation: [0.22, -0.34, 0.4],
    delay: 0.16,
    drift: 0.22,
    color: '#c8c4ba',
    repulse: 1.28,
  },
  {
    target: [-0.7, -1.85, -0.38],
    scale: 0.8,
    rotation: [-0.18, 0.58, -0.32],
    delay: 0.24,
    drift: 0.24,
    color: '#8c8273',
    repulse: 1.22,
  },
  {
    target: [0.55, 0.15, 0.12],
    scale: 1.0,
    rotation: [0.36, 0.66, -0.12],
    delay: 0.32,
    drift: 0.2,
    color: '#151515',
    repulse: 1.42,
  },
  {
    target: [1.95, -1.15, -0.45],
    scale: 1.24,
    rotation: [0.5, -0.18, 0.18],
    delay: 0.4,
    drift: 0.22,
    color: '#7a624b',
    repulse: 1.42,
  },
  {
    target: [2.75, 1.38, 0.18],
    scale: 1.14,
    rotation: [-0.42, 0.18, -0.52],
    delay: 0.48,
    drift: 0.2,
    color: '#d8d4c9',
    repulse: 1.36,
  },
  {
    target: [3.82, -0.38, -0.28],
    scale: 0.94,
    rotation: [0.12, 0.82, 0.22],
    delay: 0.56,
    drift: 0.22,
    color: '#345b5c',
    repulse: 1.24,
  },
  {
    target: [4.75, 1.65, -0.68],
    scale: 0.92,
    rotation: [-0.28, -0.56, 0.48],
    delay: 0.64,
    drift: 0.24,
    color: '#162456',
    repulse: 1.18,
  },
  {
    target: [-4.45, -2.08, 0.22],
    scale: 0.76,
    rotation: [0.18, -0.72, -0.24],
    delay: 0.72,
    drift: 0.18,
    color: '#8c8273',
    repulse: 1.08,
  },
];

const starField = Array.from({ length: 220 }, (_, index) => {
  const angle = index * 2.399963229728653;
  const radius = 1.8 + (index % 29) * 0.19;
  const depth = -1.2 - (index % 14) * 0.25;
  const isWarmDust = index % 5 === 0;
  const isBrightStar = index % 19 === 0;

  return {
    color: isWarmDust ? '#d6c09a' : '#9b9485',
    opacity: isBrightStar ? 0.72 : 0.24 + (index % 7) * 0.045,
    position: [
      Math.cos(angle) * radius,
      Math.sin(angle * 1.37) * 3.05,
      depth,
    ] as [number, number, number],
    scale: isBrightStar ? 0.026 : 0.008 + (index % 6) * 0.003,
  };
});

const INTERACTION_SECONDS = 3.6;
const COLLAPSE_SECONDS = 3.35;

type LusionFieldSceneProps = {
  isActive?: boolean;
  onCollapseComplete?: () => void;
};

export default function LusionFieldScene({
  isActive = true,
  onCollapseComplete,
}: LusionFieldSceneProps) {
  const lightRef = useRef<THREE.PointLight | null>(null);
  const fieldRef = useRef<THREE.Group | null>(null);
  const hasCompletedRef = useRef(false);
  const elapsedRef = useRef(0);
  const onCollapseCompleteRef = useRef(onCollapseComplete);
  const { mouse, viewport } = useThree();

  useEffect(() => {
    onCollapseCompleteRef.current = onCollapseComplete;
  }, [onCollapseComplete]);

  useFrame((state, delta) => {
    if (isActive) {
      elapsedRef.current += delta;
    }

    const elapsed = elapsedRef.current;
    const collapseProgress = smoothStep(
      THREE.MathUtils.clamp(
        (elapsed - INTERACTION_SECONDS) / COLLAPSE_SECONDS,
        0,
        1,
      ),
    );
    const cameraPull = smoothStep(
      THREE.MathUtils.clamp(
        (elapsed - INTERACTION_SECONDS + 0.28) / (COLLAPSE_SECONDS * 0.86),
        0,
        1,
      ),
    );
    const isCollapseComplete =
      elapsed >= INTERACTION_SECONDS + COLLAPSE_SECONDS + 0.16;

    if (isCollapseComplete && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      onCollapseCompleteRef.current?.();
    }

    if (lightRef.current) {
      lightRef.current.position.x = mouse.x * viewport.width * 0.55;
      lightRef.current.position.y = mouse.y * viewport.height * 0.55;
      lightRef.current.position.z = 3.2;
    }

    if (fieldRef.current) {
      fieldRef.current.rotation.y =
        Math.sin(elapsed * 0.15) * 0.08 + collapseProgress * 0.18;
      fieldRef.current.rotation.x =
        Math.cos(elapsed * 0.12) * 0.035 - collapseProgress * 0.08;
    }

    const frameCamera = state.camera;

    if (frameCamera instanceof THREE.PerspectiveCamera) {
      const settle = 1 - Math.exp(-delta * 3.2);
      const targetZ = THREE.MathUtils.lerp(7.8, 4.85, cameraPull);
      const targetFov = THREE.MathUtils.lerp(45, 36.5, cameraPull);

      frameCamera.position.x = THREE.MathUtils.lerp(
        frameCamera.position.x,
        mouse.x * 0.18 * (1 - cameraPull),
        settle,
      );
      frameCamera.position.y = THREE.MathUtils.lerp(
        frameCamera.position.y,
        mouse.y * 0.12 * (1 - cameraPull),
        settle,
      );
      frameCamera.position.z = THREE.MathUtils.lerp(
        frameCamera.position.z,
        targetZ,
        settle,
      );
      frameCamera.fov = THREE.MathUtils.lerp(frameCamera.fov, targetFov, settle);
      frameCamera.lookAt(0, 0, 0);
      frameCamera.updateProjectionMatrix();
    }
  });

  return (
    <>
      <color attach="background" args={[FIELD_BLACK]} />
      <fog attach="fog" args={[FIELD_BLACK, 6.2, 12.8]} />
      <ambientLight color="#d6cbb9" intensity={0.28} />
      <hemisphereLight
        color="#f0e4cf"
        groundColor="#080706"
        intensity={0.32}
      />
      <pointLight
        ref={lightRef}
        color={FIELD_WARM_LIGHT}
        intensity={74}
        distance={11}
        decay={1.82}
        position={[0, 0, 3.2]}
      />
      <pointLight
        color="#7d6955"
        intensity={16}
        distance={8.5}
        decay={2.1}
        position={[-3.8, 2.6, 3.1]}
      />
      <pointLight
        color="#6a6f75"
        intensity={10}
        distance={8}
        decay={2.15}
        position={[3.4, -1.8, 2.4]}
      />
      <directionalLight color="#f2e7d5" intensity={0.78} position={[1.5, 3, 4]} />
      <StarField />
      <NebulaVeil isActive={isActive} />
      <OrbitalInstrument isActive={isActive} />
      <GravityWell isActive={isActive} />

      <group ref={fieldRef} position={[0, -0.06, 0]} scale={1.1}>
        {jackConfigs.map((config, index) => (
          <LusionJack
            key={index}
            config={config}
            index={index}
            isActive={isActive}
          />
        ))}
      </group>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.45}
        dampingFactor={0.08}
        enableDamping
      />
    </>
  );
}

function LusionJack({
  config,
  index,
  isActive,
}: {
  config: JackConfig;
  index: number;
  isActive: boolean;
}) {
  const groupRef = useRef<THREE.Group | null>(null);
  const { mouse, viewport } = useThree();
  const profile = planetProfiles[index % planetProfiles.length];
  const elapsedRef = useRef(0);
  const vectorsRef = useRef({
    start: new THREE.Vector3(0, 0, 0),
    target: new THREE.Vector3(...config.target),
    basePosition: new THREE.Vector3(),
    desiredPosition: new THREE.Vector3(),
    pointerPosition: new THREE.Vector3(),
    pushVector: new THREE.Vector3(),
    vortexPosition: new THREE.Vector3(),
  });

  useFrame((_state, delta) => {
    if (!groupRef.current) {
      return;
    }

    if (isActive) {
      elapsedRef.current += delta;
    }

    const {
      start,
      target,
      basePosition,
      desiredPosition,
      pointerPosition,
      pushVector,
      vortexPosition,
    } = vectorsRef.current;
    const elapsed = elapsedRef.current;
    const collapseProgress = smoothStep(
      THREE.MathUtils.clamp(
        (elapsed - INTERACTION_SECONDS) / COLLAPSE_SECONDS,
        0,
        1,
      ),
    );
    const orbitProgress = smoothStep(
      THREE.MathUtils.clamp(
        (elapsed - INTERACTION_SECONDS - (index % 4) * 0.055) / 0.98,
        0,
        1,
      ),
    );
    const progress = THREE.MathUtils.clamp(
      (elapsed - config.delay) / 1.25,
      0,
      1,
    );
    const eased = 1 - Math.pow(1 - progress, 4);
    const pulse = Math.sin(elapsed * (0.65 + index * 0.04) + index) * 0.08;

    basePosition.lerpVectors(start, target, eased);
    basePosition.x += Math.sin(elapsed * 0.42 + index) * config.drift;
    basePosition.y +=
      Math.cos(elapsed * 0.36 + index * 0.7) * config.drift * 0.45;
    basePosition.z += pulse;

    if (collapseProgress > 0) {
      const originAngle = Math.atan2(target.y, target.x);
      const direction = index % 2 === 0 ? 1 : -1;
      const irregularity = 0.74 + ((index * 37) % 9) * 0.045;
      const sourceRadius = Math.max(Math.hypot(target.x, target.y), 0.8);
      const spiralRadius = THREE.MathUtils.lerp(
        sourceRadius,
        0.035,
        Math.pow(collapseProgress, 0.86 + (index % 5) * 0.055),
      );
      const wobble =
        Math.sin(elapsed * (1.65 + index * 0.13) + index * 2.4) *
        (1 - collapseProgress) *
        0.28;
      const spin =
        originAngle +
        direction *
          (elapsed * (0.58 + index * 0.037) +
            Math.pow(collapseProgress, 1.45) * (3.2 + irregularity * 2.4)) +
        wobble;

      vortexPosition.set(
        Math.cos(spin) * spiralRadius,
        Math.sin(spin) * spiralRadius * (0.82 + (index % 3) * 0.08),
        THREE.MathUtils.lerp(
          basePosition.z,
          0.18 + Math.sin(index * 1.7) * 0.08,
          collapseProgress,
        ),
      );
      basePosition.lerp(vortexPosition, orbitProgress);
    }

    pointerPosition.set(
      mouse.x * viewport.width * 0.48,
      mouse.y * viewport.height * 0.48,
      basePosition.z,
    );

    pushVector.copy(basePosition).sub(pointerPosition);
    const distance = Math.max(pushVector.length(), 0.001);
    const rawInfluence = THREE.MathUtils.clamp((2.15 - distance) / 2.15, 0, 1);
    const influence = rawInfluence * rawInfluence * (1 - collapseProgress);

    desiredPosition.copy(basePosition);
    desiredPosition.addScaledVector(
      pushVector.normalize(),
      influence * config.repulse,
    );
    desiredPosition.z += influence * 0.72;

    const settle = 1 - Math.exp(-delta * 7.5);
    const collapseScale = Math.max(0.035, 1 - collapseProgress * 0.96);
    groupRef.current.position.lerp(desiredPosition, settle);
    groupRef.current.scale.setScalar(
      config.scale * eased * (1 + influence * 0.22) * collapseScale,
    );
    groupRef.current.rotation.x =
      config.rotation[0] +
      elapsed * (0.18 + index * 0.01 + collapseProgress * (0.9 + (index % 4) * 0.18)) +
      influence * 0.8;
    groupRef.current.rotation.y =
      config.rotation[1] +
      elapsed * (0.22 + index * 0.012 + collapseProgress * (1.05 + (index % 5) * 0.16)) -
      influence * 0.65;
    groupRef.current.rotation.z =
      config.rotation[2] +
      elapsed * (0.12 + index * 0.009 + collapseProgress * (1.2 + (index % 3) * 0.2)) +
      influence * 0.45;
  });

  return (
    <group ref={groupRef}>
      <PlanetSystem profile={profile} />
    </group>
  );
}

function PlanetSystem({
  profile,
}: {
  profile: PlanetProfile;
}) {
  return (
    <group scale={profile.scale}>
      <mesh>
        <sphereGeometry args={[profile.radius, 48, 32]} />
        <PlanetMaterial profile={profile} />
      </mesh>

      {profile.atmosphere ? (
        <mesh scale={profile.atmosphere.scale}>
          <sphereGeometry args={[profile.radius, 48, 32]} />
          <meshBasicMaterial
            color={profile.atmosphere.color}
            depthWrite={false}
            opacity={profile.atmosphere.opacity}
            transparent
          />
        </mesh>
      ) : null}

      {profile.bands?.map((band, index) => (
        <mesh key={index} position={[0, band.y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[band.radius, band.tube, 8, 96]} />
          <meshBasicMaterial
            color={band.color}
            depthWrite={false}
            opacity={band.opacity}
            transparent
          />
        </mesh>
      ))}

      {profile.surfaceMarks?.map((mark, index) => (
        <mesh
          key={index}
          position={getSurfacePosition(profile.radius, mark.theta, mark.phi)}
          scale={mark.scale}
        >
          <sphereGeometry args={[1, 16, 10]} />
          <meshBasicMaterial
            color={mark.color}
            depthWrite={false}
            opacity={mark.opacity}
            transparent
          />
        </mesh>
      ))}

      {profile.rings.map((ring, index) => (
        <mesh key={index} rotation={ring.rotation} scale={ring.scale}>
          <torusGeometry args={[ring.radius, ring.tube, 16, 144]} />
          <meshStandardMaterial
            color={profile.ringColor ?? profile.color}
            depthWrite={false}
            emissive={profile.emissive ?? '#000000'}
            emissiveIntensity={profile.emissive ? 0.08 : 0}
            metalness={0.48}
            opacity={ring.opacity}
            roughness={0.28}
            transparent
          />
        </mesh>
      ))}

      {profile.moons.map((moon, index) => (
        <group key={index} rotation={[0, moon.angle, 0]}>
          <mesh position={[moon.distance, moon.y, 0]}>
            <sphereGeometry args={[moon.radius, 18, 12]} />
            <meshStandardMaterial
              color="#ece5d6"
              metalness={0.32}
              roughness={0.34}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function StarField() {
  return (
    <group>
      {starField.map((star, index) => (
        <mesh key={index} position={star.position} scale={star.scale}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshBasicMaterial
            color={star.color}
            opacity={star.opacity}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

function NebulaVeil({ isActive }: { isActive: boolean }) {
  const groupRef = useRef<THREE.Group | null>(null);
  const elapsedRef = useRef(0);

  useFrame((_state, delta) => {
    if (!groupRef.current) {
      return;
    }

    if (isActive) {
      elapsedRef.current += delta;
    }

    const elapsed = elapsedRef.current;
    groupRef.current.rotation.z = Math.sin(elapsed * 0.045) * 0.025;
    groupRef.current.position.x = Math.sin(elapsed * 0.035) * 0.08;
  });

  return (
    <group ref={groupRef} position={[0, 0, -3.2]}>
      <mesh position={[-2.8, 1.15, 0]} rotation={[0, 0, -0.22]} scale={[3.8, 1.34, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#8c765d"
          depthWrite={false}
          opacity={0.055}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
      <mesh position={[2.35, -0.8, -0.2]} rotation={[0, 0, 0.18]} scale={[4.5, 1.18, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#67706d"
          depthWrite={false}
          opacity={0.048}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
      <mesh position={[0.2, 0.2, -0.45]} rotation={[0, 0, 0.02]} scale={[5.8, 2.8, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#d4c7b4"
          depthWrite={false}
          opacity={0.03}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
    </group>
  );
}

function OrbitalInstrument({ isActive }: { isActive: boolean }) {
  const groupRef = useRef<THREE.Group | null>(null);
  const elapsedRef = useRef(0);

  useFrame((_state, delta) => {
    if (!groupRef.current) {
      return;
    }

    if (isActive) {
      elapsedRef.current += delta;
    }

    const elapsed = elapsedRef.current;
    groupRef.current.rotation.z = Math.sin(elapsed * 0.08) * 0.035;
    groupRef.current.rotation.y = Math.cos(elapsed * 0.06) * 0.05;
  });

  return (
    <group ref={groupRef} position={[0, 0, -1.1]}>
      <mesh rotation={[1.38, 0.04, -0.18]} scale={[5.7, 1.12, 1]}>
        <torusGeometry args={[1, 0.0016, 8, 260]} />
        <meshBasicMaterial
          color={FIELD_BONE}
          depthWrite={false}
          opacity={0.085}
          transparent
        />
      </mesh>
      <mesh rotation={[1.24, 0.58, 0.22]} scale={[4.8, 0.72, 1]}>
        <torusGeometry args={[1, 0.0014, 8, 260]} />
        <meshBasicMaterial
          color={FIELD_BRONZE}
          depthWrite={false}
          opacity={0.06}
          transparent
        />
      </mesh>
      <mesh rotation={[1.54, -0.76, 0.12]} scale={[3.9, 0.5, 1]}>
        <torusGeometry args={[1, 0.0012, 8, 220]} />
        <meshBasicMaterial
          color="#8b918b"
          depthWrite={false}
          opacity={0.045}
          transparent
        />
      </mesh>
    </group>
  );
}

function GravityWell({ isActive }: { isActive: boolean }) {
  const groupRef = useRef<THREE.Group | null>(null);
  const innerMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const middleMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const outerMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const elapsedRef = useRef(0);

  useFrame((_state, delta) => {
    if (isActive) {
      elapsedRef.current += delta;
    }

    const elapsed = elapsedRef.current;
    const collapseProgress = smoothStep(
      THREE.MathUtils.clamp(
        (elapsed - INTERACTION_SECONDS) / COLLAPSE_SECONDS,
        0,
        1,
      ),
    );

    if (groupRef.current) {
      groupRef.current.rotation.z = elapsed * (0.14 + collapseProgress * 2.15);
      groupRef.current.rotation.x = Math.sin(elapsed * 0.18) * 0.1;
      groupRef.current.scale.setScalar(0.52 + collapseProgress * 0.38);
    }

    if (innerMaterialRef.current) {
      innerMaterialRef.current.opacity = collapseProgress * 0.36;
    }

    if (middleMaterialRef.current) {
      middleMaterialRef.current.opacity = collapseProgress * 0.2;
    }

    if (outerMaterialRef.current) {
      outerMaterialRef.current.opacity = collapseProgress * 0.12;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0.2]}>
      <mesh rotation={[1.32, 0.12, -0.18]}>
        <torusGeometry args={[0.42, 0.006, 8, 120]} />
        <meshBasicMaterial
          ref={innerMaterialRef}
          color={FIELD_BONE}
          depthWrite={false}
          opacity={0}
          transparent
        />
      </mesh>
      <mesh rotation={[1.12, -0.36, 0.28]}>
        <torusGeometry args={[0.68, 0.004, 8, 120]} />
        <meshBasicMaterial
          ref={middleMaterialRef}
          color="#8b7b68"
          depthWrite={false}
          opacity={0}
          transparent
        />
      </mesh>
      <mesh rotation={[0.84, 0.42, -0.32]}>
        <torusGeometry args={[0.96, 0.003, 8, 120]} />
        <meshBasicMaterial
          ref={outerMaterialRef}
          color="#5f6461"
          depthWrite={false}
          opacity={0}
          transparent
        />
      </mesh>
    </group>
  );
}

function getSurfacePosition(radius: number, theta: number, phi: number) {
  const surfaceRadius = radius * 1.015;

  return new THREE.Vector3(
    surfaceRadius * Math.sin(phi) * Math.cos(theta),
    surfaceRadius * Math.cos(phi),
    surfaceRadius * Math.sin(phi) * Math.sin(theta),
  );
}

function smoothStep(value: number) {
  return value * value * (3 - 2 * value);
}

function PlanetMaterial({ profile }: { profile: PlanetProfile }) {
  const texture = useMemo(() => createPlanetTexture(profile), [profile]);

  return (
    <meshStandardMaterial
      bumpMap={texture.bumpMap}
      bumpScale={profile.name === 'Moon' || profile.name === 'Mercury' ? 0.055 : 0.032}
      color="#ffffff"
      emissive={profile.emissive ?? '#000000'}
      emissiveIntensity={profile.emissive ? 0.1 : 0}
      envMapIntensity={0.72}
      map={texture.colorMap}
      metalness={profile.metalness}
      roughness={profile.roughness}
      roughnessMap={texture.roughnessMap}
    />
  );
}

function createPlanetTexture(profile: PlanetProfile) {
  const size = 192;
  const colorData = new Uint8Array(size * size * 4);
  const bumpData = new Uint8Array(size * size * 4);
  const roughnessData = new Uint8Array(size * size * 4);
  const base = hexToRgb(profile.color);
  const seed = getNameSeed(profile.name);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const u = x / (size - 1);
      const v = y / (size - 1);
      const latitude = Math.abs(v - 0.5) * 2;
      const fine = valueNoise(x, y, seed);
      const broad = valueNoise(Math.floor(x / 4), Math.floor(y / 4), seed + 31);
      const grain = valueNoise(x * 3, y * 3, seed + 71);
      const band = getPlanetBand(profile.name, v, broad);
      const crater = getCraterValue(profile.name, u, v, seed);
      const shade = 0.8 + broad * 0.26 + fine * 0.12 - latitude * 0.08 + band - crater * 0.34;
      const warm = getPlanetWarmth(profile.name, v, fine);
      const index = (y * size + x) * 4;

      colorData[index] = clampChannel(base.r * shade + warm.r);
      colorData[index + 1] = clampChannel(base.g * shade + warm.g);
      colorData[index + 2] = clampChannel(base.b * shade + warm.b);
      colorData[index + 3] = 255;

      const bump = clampChannel(116 + broad * 72 + fine * 26 + grain * 16 - crater * 72);
      bumpData[index] = bump;
      bumpData[index + 1] = bump;
      bumpData[index + 2] = bump;
      bumpData[index + 3] = 255;

      const roughness = clampChannel(170 + profile.roughness * 50 + fine * 26 + crater * 42);
      roughnessData[index] = roughness;
      roughnessData[index + 1] = roughness;
      roughnessData[index + 2] = roughness;
      roughnessData[index + 3] = 255;
    }
  }

  return {
    bumpMap: createDataTexture(bumpData, size),
    colorMap: createDataTexture(colorData, size),
    roughnessMap: createDataTexture(roughnessData, size),
  };
}

function createDataTexture(data: Uint8Array, size: number) {
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  return texture;
}

function getPlanetBand(name: string, v: number, broad: number) {
  if (name === 'Jupiter') {
    return Math.sin(v * Math.PI * 24 + broad * 2.4) * 0.1;
  }

  if (name === 'Saturn') {
    return Math.sin(v * Math.PI * 18) * 0.045;
  }

  if (name === 'Venus') {
    return Math.sin(v * Math.PI * 14 + broad * 4) * 0.035;
  }

  if (name === 'Neptune' || name === 'Uranus') {
    return Math.sin(v * Math.PI * 10 + broad * 3) * 0.025;
  }

  return 0;
}

function getPlanetWarmth(name: string, v: number, fine: number) {
  if (name === 'Mars') {
    return { b: -5, g: fine * 4, r: 12 };
  }

  if (name === 'Earth') {
    return { b: 7, g: Math.sin(v * Math.PI * 5) * 9, r: 1 };
  }

  if (name === 'Jupiter' || name === 'Saturn') {
    return { b: -3, g: 4, r: 10 };
  }

  if (name === 'Neptune') {
    return { b: 10, g: 3, r: -4 };
  }

  if (name === 'Uranus') {
    return { b: 7, g: 8, r: -4 };
  }

  return { b: 0, g: 0, r: 0 };
}

function getCraterValue(name: string, u: number, v: number, seed: number) {
  if (name !== 'Moon' && name !== 'Mercury' && name !== 'Mars' && name !== 'Pluto') {
    return 0;
  }

  let crater = 0;

  for (let i = 0; i < 9; i += 1) {
    const cx = seededUnit(seed + i * 13);
    const cy = seededUnit(seed + i * 17);
    const dx = u - cx;
    const dy = v - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const radius = 0.035 + seededUnit(seed + i * 23) * 0.055;

    crater += Math.max(0, 1 - dist / radius);
  }

  return Math.min(1, crater);
}

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  const value = Number.parseInt(clean, 16);

  return {
    b: value & 255,
    g: (value >> 8) & 255,
    r: (value >> 16) & 255,
  };
}

function getNameSeed(name: string) {
  return name.split('').reduce((seed, character) => seed + character.charCodeAt(0), 17);
}

function valueNoise(x: number, y: number, seed: number) {
  return seededUnit(Math.floor(x) * 374761393 + Math.floor(y) * 668265263 + seed * 1442695041);
}

function seededUnit(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;

  return value - Math.floor(value);
}

function clampChannel(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}
