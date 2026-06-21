'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useMemo, useRef } from 'react';
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

type GlyphProfile = {
  height: number;
  radius: number;
  rungCount: number;
  rungRadius: number;
  scale: [number, number, number];
  strandTube: number;
  turns: number;
  twist: number;
};

const glyphProfiles: GlyphProfile[] = [
  {
    height: 1.95,
    radius: 0.32,
    rungCount: 9,
    rungRadius: 0.018,
    scale: [0.82, 1.1, 0.82],
    strandTube: 0.044,
    turns: 2.45,
    twist: 0,
  },
  {
    height: 1.62,
    radius: 0.42,
    rungCount: 8,
    rungRadius: 0.016,
    scale: [1.08, 0.86, 0.82],
    strandTube: 0.052,
    turns: 2.1,
    twist: 0.7,
  },
  {
    height: 2.2,
    radius: 0.26,
    rungCount: 10,
    rungRadius: 0.014,
    scale: [0.68, 1.2, 0.68],
    strandTube: 0.038,
    turns: 2.9,
    twist: 1.25,
  },
  {
    height: 1.78,
    radius: 0.36,
    rungCount: 7,
    rungRadius: 0.017,
    scale: [0.92, 0.95, 1.12],
    strandTube: 0.048,
    turns: 1.85,
    twist: 1.9,
  },
];

const jackConfigs: JackConfig[] = [
  {
    target: [-4.85, 1.85, -0.2],
    scale: 0.78,
    rotation: [0.35, -0.15, 0.5],
    delay: 0,
    drift: 0.36,
    color: '#131313',
    emissive: '#030303',
    repulse: 1.15,
  },
  {
    target: [-3.55, 1.15, 0.25],
    scale: 1.28,
    rotation: [0.6, 0.2, -0.4],
    delay: 0.04,
    drift: 0.35,
    color: '#d8d4c9',
    repulse: 1.45,
  },
  {
    target: [-2.35, -1.85, -0.3],
    scale: 0.88,
    rotation: [-0.35, 0.55, 0.3],
    delay: 0.08,
    drift: 0.48,
    color: '#101010',
    emissive: '#030303',
    repulse: 1.18,
  },
  {
    target: [-2.08, 0.18, 0.55],
    scale: 0.82,
    rotation: [0.4, 0.8, -0.22],
    delay: 0.12,
    drift: 0.5,
    color: '#203cff',
    emissive: '#06115f',
    repulse: 1.22,
  },
  {
    target: [-0.72, 1.55, -0.2],
    scale: 0.94,
    rotation: [-0.25, -0.2, 0.48],
    delay: 0.16,
    drift: 0.34,
    color: '#c8c4ba',
    repulse: 1.3,
  },
  {
    target: [0.05, -0.02, 0.2],
    scale: 1.5,
    rotation: [0.2, -0.45, 0.5],
    delay: 0.2,
    drift: 0.26,
    color: '#203cff',
    emissive: '#06115f',
    repulse: 1.6,
  },
  {
    target: [1.28, 1.22, -0.55],
    scale: 1.14,
    rotation: [-0.55, -0.2, -0.25],
    delay: 0.24,
    drift: 0.4,
    color: '#d8d4c9',
    repulse: 1.3,
  },
  {
    target: [2.75, -1.22, 0.2],
    scale: 1.22,
    rotation: [0.45, 0.7, -0.15],
    delay: 0.28,
    drift: 0.32,
    color: '#151515',
    emissive: '#020202',
    repulse: 1.38,
  },
  {
    target: [4.15, 0.82, -0.4],
    scale: 0.88,
    rotation: [-0.15, -0.58, 0.34],
    delay: 0.32,
    drift: 0.46,
    color: '#d8d4c9',
    repulse: 1.3,
  },
  {
    target: [-4.15, -0.62, -0.85],
    scale: 0.88,
    rotation: [0.1, -0.8, 0.38],
    delay: 0.36,
    drift: 0.55,
    color: '#203cff',
    emissive: '#06115f',
    repulse: 1.24,
  },
  {
    target: [-0.68, -1.72, 0.65],
    scale: 0.94,
    rotation: [-0.3, 0.25, -0.7],
    delay: 0.4,
    drift: 0.5,
    color: '#c8c4ba',
    repulse: 1.52,
  },
  {
    target: [1.1, -2.28, -0.62],
    scale: 0.72,
    rotation: [0.2, 0.9, -0.15],
    delay: 0.44,
    drift: 0.38,
    color: '#111111',
    emissive: '#020202',
    repulse: 1.25,
  },
  {
    target: [3.9, 0.02, -0.55],
    scale: 0.78,
    rotation: [0.75, -0.3, 0.2],
    delay: 0.48,
    drift: 0.6,
    color: '#0f0f0f',
    emissive: '#030303',
    repulse: 1.36,
  },
  {
    target: [5.05, -1.65, 0.35],
    scale: 0.68,
    rotation: [-0.5, 0.35, 0.72],
    delay: 0.52,
    drift: 0.44,
    color: '#203cff',
    emissive: '#06115f',
    repulse: 1.42,
  },
  {
    target: [-5.45, -2.18, 0.18],
    scale: 0.62,
    rotation: [0.28, -0.72, -0.35],
    delay: 0.56,
    drift: 0.42,
    color: '#d8d4c9',
    repulse: 1.22,
  },
  {
    target: [5.58, 1.8, -0.72],
    scale: 0.56,
    rotation: [0.65, 0.1, -0.28],
    delay: 0.6,
    drift: 0.52,
    color: '#101010',
    emissive: '#030303',
    repulse: 1.2,
  },
  {
    target: [-0.15, 2.42, -0.85],
    scale: 0.58,
    rotation: [-0.28, 0.45, 0.6],
    delay: 0.64,
    drift: 0.3,
    color: '#151515',
    emissive: '#030303',
    repulse: 1.18,
  },
  {
    target: [2.2, 2.25, 0.15],
    scale: 0.66,
    rotation: [0.42, -0.62, 0.18],
    delay: 0.68,
    drift: 0.34,
    color: '#d8d4c9',
    repulse: 1.3,
  },
];

export default function LusionFieldScene() {
  const lightRef = useRef<THREE.PointLight | null>(null);
  const fieldRef = useRef<THREE.Group | null>(null);
  const { mouse, viewport } = useThree();

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    if (lightRef.current) {
      lightRef.current.position.x = mouse.x * viewport.width * 0.55;
      lightRef.current.position.y = mouse.y * viewport.height * 0.55;
      lightRef.current.position.z = 3.2;
    }

    if (fieldRef.current) {
      fieldRef.current.rotation.y = Math.sin(elapsed * 0.15) * 0.08;
      fieldRef.current.rotation.x = Math.cos(elapsed * 0.12) * 0.035;
    }
  });

  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.58} />
      <pointLight
        ref={lightRef}
        color="#f6f2e8"
        intensity={125}
        distance={10}
        decay={1.65}
        position={[0, 0, 3.2]}
      />
      <pointLight
        color="#2437ff"
        intensity={42}
        distance={9}
        decay={1.85}
        position={[-3.8, 2.6, 3.1]}
      />
      <pointLight
        color="#ffffff"
        intensity={24}
        distance={8}
        decay={1.8}
        position={[3.4, -1.8, 2.4]}
      />
      <directionalLight color="#ffffff" intensity={1.1} position={[1.5, 3, 4]} />

      <group ref={fieldRef} position={[0, -0.06, 0]} scale={1.1}>
        {jackConfigs.map((config, index) => (
          <LusionJack key={index} config={config} index={index} />
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

function LusionJack({ config, index }: { config: JackConfig; index: number }) {
  const groupRef = useRef<THREE.Group | null>(null);
  const { mouse, viewport } = useThree();
  const profile = glyphProfiles[index % glyphProfiles.length];
  const vectorsRef = useRef({
    start: new THREE.Vector3(0, 0, 0),
    target: new THREE.Vector3(...config.target),
    basePosition: new THREE.Vector3(),
    desiredPosition: new THREE.Vector3(),
    pointerPosition: new THREE.Vector3(),
    pushVector: new THREE.Vector3(),
  });

  useFrame((state, delta) => {
    if (!groupRef.current) {
      return;
    }

    const {
      start,
      target,
      basePosition,
      desiredPosition,
      pointerPosition,
      pushVector,
    } = vectorsRef.current;
    const elapsed = state.clock.getElapsedTime();
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

    pointerPosition.set(
      mouse.x * viewport.width * 0.48,
      mouse.y * viewport.height * 0.48,
      basePosition.z,
    );

    pushVector.copy(basePosition).sub(pointerPosition);
    const distance = Math.max(pushVector.length(), 0.001);
    const rawInfluence = THREE.MathUtils.clamp((2.15 - distance) / 2.15, 0, 1);
    const influence = rawInfluence * rawInfluence;

    desiredPosition.copy(basePosition);
    desiredPosition.addScaledVector(
      pushVector.normalize(),
      influence * config.repulse,
    );
    desiredPosition.z += influence * 0.72;

    const settle = 1 - Math.exp(-delta * 7.5);
    groupRef.current.position.lerp(desiredPosition, settle);
    groupRef.current.scale.setScalar(config.scale * eased * (1 + influence * 0.22));
    groupRef.current.rotation.x =
      config.rotation[0] + elapsed * (0.2 + index * 0.012) + influence * 0.8;
    groupRef.current.rotation.y =
      config.rotation[1] + elapsed * (0.25 + index * 0.015) - influence * 0.65;
    groupRef.current.rotation.z =
      config.rotation[2] + elapsed * (0.14 + index * 0.01) + influence * 0.45;
  });

  return (
    <group ref={groupRef}>
      <DnaHelix color={config.color} emissive={config.emissive} profile={profile} />
    </group>
  );
}

function DnaHelix({
  color,
  emissive,
  profile,
}: {
  color: string;
  emissive?: string;
  profile: GlyphProfile;
}) {
  const { strandA, strandB, rungs } = useMemo(
    () => createDnaGeometry(profile),
    [profile],
  );

  return (
    <group scale={profile.scale}>
      <mesh>
        <tubeGeometry args={[strandA, 112, profile.strandTube, 12, false]} />
        <SculptureMaterial color={color} emissive={emissive} />
      </mesh>
      <mesh>
        <tubeGeometry args={[strandB, 112, profile.strandTube, 12, false]} />
        <SculptureMaterial color={color} emissive={emissive} opacity={0.86} />
      </mesh>
      {rungs.map((rung, index) => (
        <mesh key={index} position={rung.position} quaternion={rung.quaternion}>
          <cylinderGeometry args={[profile.rungRadius, profile.rungRadius, rung.length, 10]} />
          <SculptureMaterial color={color} emissive={emissive} opacity={0.62} />
        </mesh>
      ))}
      <mesh scale={profile.strandTube * 2.4}>
        <sphereGeometry args={[1, 24, 16]} />
        <SculptureMaterial color={color} emissive={emissive} />
      </mesh>
    </group>
  );
}

function createDnaGeometry(profile: GlyphProfile) {
  const strandA = createHelixCurve(profile, 0);
  const strandB = createHelixCurve(profile, Math.PI);
  const rungs = Array.from({ length: profile.rungCount }, (_, index) => {
    const progress =
      profile.rungCount === 1 ? 0.5 : index / (profile.rungCount - 1);
    const pointA = getHelixPoint(profile, progress, 0);
    const pointB = getHelixPoint(profile, progress, Math.PI);
    const direction = pointB.clone().sub(pointA);
    const length = direction.length();
    const position = pointA.clone().add(pointB).multiplyScalar(0.5);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize(),
    );

    return { length, position, quaternion };
  });

  return { rungs, strandA, strandB };
}

function createHelixCurve(profile: GlyphProfile, phase: number) {
  const points = Array.from({ length: 128 }, (_, index) =>
    getHelixPoint(profile, index / 127, phase),
  );

  return new THREE.CatmullRomCurve3(points);
}

function getHelixPoint(profile: GlyphProfile, progress: number, phase: number) {
  const angle = progress * profile.turns * Math.PI * 2 + phase + profile.twist;
  const y = (progress - 0.5) * profile.height;

  return new THREE.Vector3(
    Math.cos(angle) * profile.radius,
    y,
    Math.sin(angle) * profile.radius,
  );
}

function SculptureMaterial({
  color,
  emissive,
  opacity,
}: {
  color: string;
  emissive?: string;
  opacity?: number;
}) {
  return (
    <meshStandardMaterial
      color={color}
      emissive={emissive ?? '#000000'}
      emissiveIntensity={emissive ? 0.22 : 0}
      envMapIntensity={1.05}
      metalness={0.58}
      opacity={opacity ?? 1}
      roughness={0.18}
      transparent={opacity !== undefined}
    />
  );
}
