'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import type { RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

type ArchiveBlueCurveFieldProps = {
  scrollContainerRef: RefObject<HTMLElement | null>;
};

const curveVertexShader = `
  uniform float uScroll;
  uniform float uTime;
  varying float vAlong;

  void main() {
    vec3 transformed = position;
    float wave = sin(position.x * 1.4 + uTime * 1.1 + uScroll * 5.2) * 0.065;
    float slowWave = sin(position.y * 2.1 - uTime * 0.7) * 0.035;

    transformed.y += wave + slowWave;
    transformed.z += sin(position.x * 0.85 + uScroll * 7.0) * 0.16;
    vAlong = smoothstep(-6.0, 6.0, position.x);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const curveFragmentShader = `
  uniform float uOpacity;
  uniform float uScroll;
  varying float vAlong;

  void main() {
    float edgeFade = smoothstep(0.0, 0.18, vAlong) * (1.0 - smoothstep(0.82, 1.0, vAlong));
    float pulse = 0.65 + sin(vAlong * 10.0 + uScroll * 8.0) * 0.18;
    vec3 blue = mix(vec3(0.06, 0.16, 0.95), vec3(0.42, 0.55, 1.0), vAlong);

    gl_FragColor = vec4(blue, uOpacity * edgeFade * pulse);
  }
`;

export default function ArchiveBlueCurveField({
  scrollContainerRef,
}: ArchiveBlueCurveFieldProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] hidden overflow-hidden md:block">
      <Canvas
        className="h-full w-full"
        camera={{ position: [0, 0, 9], fov: 42 }}
        dpr={[1, 1.6]}
        gl={{ alpha: true, antialias: true }}
      >
        <BlueCurve scrollContainerRef={scrollContainerRef} />
      </Canvas>
    </div>
  );
}

function BlueCurve({
  scrollContainerRef,
}: ArchiveBlueCurveFieldProps) {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);

  const geometry = useMemo(() => {
    const bezier = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-7.4, 2.45, 0),
      new THREE.Vector3(-3.8, 0.2, -0.9),
      new THREE.Vector3(2.6, 3.15, 0.8),
      new THREE.Vector3(7.6, -1.4, -0.25),
    );

    return new THREE.TubeGeometry(bezier, 180, 0.075, 18, false);
  }, []);

  const material = useMemo(() => {
    const shaderMaterial = new THREE.ShaderMaterial({
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fragmentShader: curveFragmentShader,
      transparent: true,
      uniforms: {
        uOpacity: { value: 0.28 },
        uScroll: { value: 0 },
        uTime: { value: 0 },
      },
      vertexShader: curveVertexShader,
    });

    return shaderMaterial;
  }, []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = scrollContainerRef.current;

    if (!section) {
      return;
    }

    const trigger = ScrollTrigger.create({
      end: 'bottom top',
      onUpdate: (self) => {
        targetProgressRef.current = self.progress;
      },
      scrub: 1,
      start: 'top bottom',
      trigger: section,
    });

    return () => {
      trigger.kill();
    };
  }, [scrollContainerRef]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const shader = mesh?.material;

    currentProgressRef.current +=
      (targetProgressRef.current - currentProgressRef.current) *
      (1 - Math.exp(-delta * 5.6));

    const progress = currentProgressRef.current;

    if (shader instanceof THREE.ShaderMaterial) {
      shader.uniforms.uTime.value = state.clock.elapsedTime;
      shader.uniforms.uScroll.value = progress;
      shader.uniforms.uOpacity.value = THREE.MathUtils.lerp(0.18, 0.42, progress);
    }

    if (mesh) {
      mesh.position.x = THREE.MathUtils.lerp(-1.55, 1.05, progress);
      mesh.position.y = THREE.MathUtils.lerp(1.2, -2.35, progress);
      mesh.position.z = THREE.MathUtils.lerp(-1.4, 1.25, progress);
      mesh.rotation.x = THREE.MathUtils.lerp(0.24, -0.18, progress);
      mesh.rotation.y = THREE.MathUtils.lerp(-0.34, 0.28, progress);
      mesh.rotation.z = THREE.MathUtils.lerp(-0.28, 0.18, progress);
      mesh.scale.setScalar(THREE.MathUtils.lerp(1.0, 1.22, progress));
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} material={material} renderOrder={-1} />
  );
}
