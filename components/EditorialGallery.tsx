'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import EditorialArchiveSection from '@/components/EditorialArchiveSection';
import EditorialBurst from '@/components/EditorialBurst';
import LusionFieldScene from '@/components/LusionFieldScene';

const COLLAPSE_READY_FALLBACK_DELAY_MS = 7200;
type GalleryPhase = 'orbit' | 'ready' | 'burst';

type EditorialGalleryProps = {
  isActive?: boolean;
};

export default function EditorialGallery({
  isActive = true,
}: EditorialGalleryProps) {
  const orbitalSectionRef = useRef<HTMLElement | null>(null);
  const [phase, setPhase] = useState<GalleryPhase>('orbit');
  const [burstTrigger, setBurstTrigger] = useState(0);
  const isReady = phase === 'ready';
  const isBurstActive = phase === 'burst';

  const revealArchiveButton = useCallback(() => {
    setPhase((currentPhase) => (
      currentPhase === 'orbit' ? 'ready' : currentPhase
    ));
  }, []);

  const activateBurst = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    setPhase('burst');
    setBurstTrigger((currentTrigger) => currentTrigger + 1);
  }, []);

  useEffect(() => {
    if (!isActive || phase !== 'orbit') {
      return;
    }

    const timeout = window.setTimeout(
      revealArchiveButton,
      COLLAPSE_READY_FALLBACK_DELAY_MS,
    );

    return () => {
      window.clearTimeout(timeout);
    };
  }, [isActive, phase, revealArchiveButton]);

  return (
    <>
      <section
        ref={orbitalSectionRef}
        className={[
          'relative bg-[#050504] text-[#efeee9]',
          isBurstActive ? 'h-[300vh]' : 'h-screen overflow-hidden',
        ].join(' ')}
        aria-label="APSIS orbital field"
      >
        <div
          className={[
            'h-screen overflow-hidden bg-[#050504]',
            isBurstActive ? 'sticky top-0' : 'relative',
          ].join(' ')}
        >
          <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_42%,rgba(239,238,233,0.18),transparent_27%),radial-gradient(circle_at_18%_72%,rgba(142,118,95,0.15),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(111,129,129,0.12),transparent_30%),linear-gradient(180deg,rgba(239,238,233,0.07),transparent_46%)]" />
          <div className="pointer-events-none absolute inset-0 z-10 opacity-[0.24] [background-image:linear-gradient(rgba(239,238,233,0.075)_1px,transparent_1px),linear-gradient(90deg,rgba(239,238,233,0.045)_1px,transparent_1px)] [background-size:84px_84px]" />
          <div className="pointer-events-none absolute inset-0 z-10 opacity-[0.26] [background-image:radial-gradient(circle_at_center,rgba(239,238,233,0.9)_0.7px,transparent_0.9px),radial-gradient(circle_at_center,rgba(214,192,154,0.72)_0.55px,transparent_0.75px)] [background-position:0_0,19px_27px] [background-size:4px_4px,9px_9px]" />

          <Canvas
            className="absolute inset-0 h-full w-full"
            camera={{ position: [0, 0, 7.8], fov: 45 }}
            gl={{ antialias: true, alpha: false }}
            dpr={[1, 2]}
          >
            <LusionFieldScene
              isActive={isActive}
              onCollapseComplete={revealArchiveButton}
            />
          </Canvas>

          {isBurstActive ? (
            <EditorialBurst
              key={burstTrigger}
              scrollContainerRef={orbitalSectionRef}
            />
          ) : null}

          <div
            className={[
              'pointer-events-none absolute inset-0 z-40 flex items-center justify-center px-6',
              'transition-[opacity,filter] duration-700 ease-out',
              isReady ? 'opacity-100 blur-0' : 'opacity-0 blur-sm',
            ].join(' ')}
          >
            <button
              type="button"
              className={[
                'pointer-events-auto group relative flex h-44 w-44 items-center justify-center rounded-full',
                'border border-[#efeee9]/10 bg-[#050504]/38 text-[#efeee9] backdrop-blur-xl',
                'shadow-[0_0_80px_rgba(239,238,233,0.08),inset_0_0_42px_rgba(239,238,233,0.045)]',
                'transition-[border-color,background-color,box-shadow,transform] duration-1000 ease-out',
                'hover:scale-[1.025] hover:border-[#efeee9]/32 hover:bg-[#efeee9]/[0.045]',
                'hover:shadow-[0_0_120px_rgba(239,238,233,0.15),inset_0_0_56px_rgba(239,238,233,0.08)]',
                'focus:outline-none focus-visible:border-[#efeee9]/70 focus-visible:ring-1 focus-visible:ring-[#efeee9]/60',
              ].join(' ')}
              onPointerDown={activateBurst}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  activateBurst();
                }
              }}
              disabled={!isReady}
              tabIndex={isReady ? 0 : -1}
              aria-label="Open editorial archive"
            >
              <span className="absolute inset-[-34px] rounded-full border border-[#efeee9]/[0.045] transition-transform duration-[1400ms] ease-out group-hover:scale-110" />
              <span className="absolute inset-[-22px] rounded-full border border-dashed border-[#efeee9]/12 transition-transform duration-[2200ms] ease-out group-hover:rotate-45 group-hover:scale-105" />
              <span className="absolute inset-[-9px] rounded-full border border-[#8e765f]/18 transition-transform duration-[1800ms] ease-out group-hover:-rotate-12" />
              <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_44%,rgba(239,238,233,0.13),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(142,118,95,0.11),transparent_52%)] opacity-80 transition-opacity duration-700 group-hover:opacity-100" />
              <span className="absolute inset-5 rounded-full border border-[#efeee9]/10 bg-[#050504]/26 shadow-[inset_0_1px_18px_rgba(239,238,233,0.045)] transition-transform duration-1000 ease-out group-hover:scale-[0.94]" />
              <span className="absolute left-1/2 top-[-28px] h-5 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#efeee9]/32 to-transparent" />
              <span className="absolute bottom-[-28px] left-1/2 h-5 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#efeee9]/24 to-transparent" />
              <span className="absolute left-[-28px] top-1/2 h-px w-5 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#efeee9]/24 to-transparent" />
              <span className="absolute right-[-28px] top-1/2 h-px w-5 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#efeee9]/32 to-transparent" />
              <span className="absolute h-2 w-2 rounded-full bg-[#efeee9]/72 opacity-0 shadow-[0_0_24px_rgba(239,238,233,0.7)] transition-[opacity,transform] duration-700 group-hover:scale-125 group-hover:opacity-100" />
              <span className="relative flex flex-col items-center gap-2 text-center">
                <span className="text-[8px] font-light uppercase tracking-[0.58em] text-[#efeee9]/42">
                  Aperture 01
                </span>
                <span className="text-[10px] font-light uppercase tracking-[0.42em] text-[#efeee9]/90">
                  Release
                </span>
                <span className="mt-1 h-px w-9 bg-[#efeee9]/20 transition-transform duration-700 group-hover:scale-x-150" />
                <span className="text-[8px] font-light uppercase tracking-[0.36em] text-[#efeee9]/46">
                  Archive
                </span>
              </span>
            </button>
          </div>

          <div className="pointer-events-none absolute left-6 right-6 top-5 z-20 flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-[#efeee9]/52 sm:left-8 sm:right-8">
            <span>APSIS ORBITAL FIELD</span>
            <span>{isReady ? 'CLICK CENTER' : 'MOVE CURSOR'}</span>
          </div>

          <div className="pointer-events-none absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between text-[9px] uppercase tracking-[0.28em] text-[#efeee9]/46 sm:left-8 sm:right-8">
            <span>+</span>
            <span>{isReady ? 'Archive compressed into a signal' : 'Observe the orbital garment field'}</span>
            <span>+</span>
          </div>
        </div>
      </section>

      {isBurstActive ? <EditorialArchiveSection /> : null}
    </>
  );
}
