'use client';

import { Canvas } from '@react-three/fiber';
import LusionFieldScene from '@/components/LusionFieldScene';

export default function EditorialGallery() {
  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[#f1f2f6] px-5 py-6 text-[#101115] sm:px-8"
      aria-label="APSIS editorial archive"
    >
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1600px] flex-col">
        <header
          className="grid gap-6 pb-5 pt-3 sm:grid-cols-[0.8fr_1.8fr_1fr] sm:items-start"
        >
          <p className="text-xl font-semibold tracking-tight">APSIS</p>
          <h2 className="max-w-[640px] text-2xl font-light leading-[1.04] tracking-normal text-[#101115] sm:text-4xl md:text-5xl">
            Images from a future movement, arranged as a living field.
          </h2>
          <div className="flex items-start justify-between gap-4 text-[10px] uppercase tracking-[0.24em] text-[#555b66] sm:justify-end">
            <span>EDITORIAL ARCHIVE</span>
            <span>INDEX 01</span>
          </div>
        </header>

        <div
          className="relative shrink-0 overflow-hidden rounded-[10px] bg-black"
          style={{ height: 'clamp(560px, 68vh, 760px)' }}
        >
          <Canvas
            className="absolute inset-0 h-full w-full"
            camera={{ position: [0, 0, 7.8], fov: 45 }}
            gl={{ antialias: true, alpha: false }}
            dpr={[1, 2]}
          >
            <LusionFieldScene />
          </Canvas>

          <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-[9px] uppercase tracking-[0.28em] text-white/70">
            <span>+</span>
            <span>Move cursor to scatter</span>
            <span>+</span>
          </div>
        </div>
      </div>
    </section>
  );
}
