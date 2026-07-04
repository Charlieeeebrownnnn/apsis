'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

export type ClothingLook = {
  id: number;
  name: string;
  mainSrc: string;
  detailSrc: string;
  material: string;
  note: string;
  price: string;
};

type ClothesSalesShowcaseProps = {
  looks: ClothingLook[];
};

const normalizeIndex = (index: number, lookCount: number) => (
  (index + lookCount) % lookCount
);

function getIndexFromLookParam(value: string | null, looks: ClothingLook[]) {
  const parsedLook = Number(value);
  const nextIndex = looks.findIndex((look) => look.id === parsedLook);

  return nextIndex >= 0 ? nextIndex : 0;
}

export default function ClothesSalesShowcase({ looks }: ClothesSalesShowcaseProps) {
  if (looks.length === 0) {
    return (
      <main className="fixed inset-0 flex h-[100dvh] items-center justify-center bg-[#f4f1ea] px-6 text-[#111111]">
        <p className="text-[11px] uppercase tracking-[0.34em] text-[#111111]/54">
          No clothing looks found.
        </p>
      </main>
    );
  }

  return <ClothesSalesShowcaseCarousel looks={looks} />;
}

function ClothesSalesShowcaseCarousel({ looks }: ClothesSalesShowcaseProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [[activeIndex, direction], setActiveLook] = useState<[number, number]>([0, 1]);
  const lastSyncedLookParamRef = useRef<string | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const dragDeltaXRef = useRef(0);
  const dragDeltaYRef = useRef(0);
  const wheelLockedRef = useRef(false);

  const lookCount = looks.length;
  const safeActiveIndex = Math.min(activeIndex, lookCount - 1);
  const activeLook = looks[safeActiveIndex];
  const stackedCards = useMemo(
    () =>
      [3, 2, 1].map((offset) => ({
        look: looks[normalizeIndex(safeActiveIndex + offset, lookCount)],
        offset,
      })),
    [lookCount, looks, safeActiveIndex],
  );

  const stepLook = useCallback((step: number) => {
    setActiveLook(([current]) => [normalizeIndex(current + step, lookCount), step > 0 ? 1 : -1]);
  }, [lookCount]);

  const goToLook = useCallback(
    (index: number) => {
      if (index === safeActiveIndex) {
        return;
      }

      const forwardDistance = (index - safeActiveIndex + lookCount) % lookCount;
      const backwardDistance = (safeActiveIndex - index + lookCount) % lookCount;

      setActiveLook([index, forwardDistance <= backwardDistance ? 1 : -1]);
    },
    [lookCount, safeActiveIndex],
  );

  useEffect(() => {
    const nextLookParam = searchParams.get('look');
    const navigationEntry = window.performance.getEntriesByType(
      'navigation',
    )[0] as PerformanceNavigationTiming | undefined;
    const isPageReload = navigationEntry?.type === 'reload';

    if (isPageReload) {
      lastSyncedLookParamRef.current = null;

      if (nextLookParam) {
        router.replace('/garments', { scroll: false });
      }

      return;
    }

    if (lastSyncedLookParamRef.current === nextLookParam) {
      return;
    }

    lastSyncedLookParamRef.current = nextLookParam;
    setActiveLook([getIndexFromLookParam(nextLookParam, looks), 1]);
  }, [looks, router, searchParams]);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyOverscroll = document.body.style.overscrollBehavior;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousHtmlOverscroll = document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'none';

    const handleWindowWheel = (event: WheelEvent) => {
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;

      if (Math.abs(delta) < 18 || wheelLockedRef.current) {
        return;
      }

      event.preventDefault();
      wheelLockedRef.current = true;
      stepLook(delta > 0 ? 1 : -1);

      window.setTimeout(() => {
        wheelLockedRef.current = false;
      }, 860);
    };

    window.addEventListener('wheel', handleWindowWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWindowWheel);
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.overscrollBehavior = previousBodyOverscroll;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.documentElement.style.overscrollBehavior = previousHtmlOverscroll;
    };
  }, [stepLook]);

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.target instanceof Element && event.target.closest('a, button')) {
      return;
    }

    dragStartXRef.current = event.clientX;
    dragStartYRef.current = event.clientY;
    dragDeltaXRef.current = 0;
    dragDeltaYRef.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    dragDeltaXRef.current = event.clientX - dragStartXRef.current;
    dragDeltaYRef.current = event.clientY - dragStartYRef.current;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLElement>) => {
    const swipeDistance =
      Math.abs(dragDeltaYRef.current) > Math.abs(dragDeltaXRef.current)
        ? dragDeltaYRef.current
        : dragDeltaXRef.current;

    if (Math.abs(swipeDistance) > 42) {
      stepLook(swipeDistance < 0 ? 1 : -1);
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <main
      className="fixed inset-0 h-[100dvh] overflow-hidden overscroll-none bg-[#f4f1ea] text-[#111111]"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <section
        className="relative flex h-full items-center justify-center overflow-hidden px-5 py-20 md:px-8 md:py-24"
        aria-label="APSIS clothing sales carousel"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(17,17,17,0.08),transparent_36%),linear-gradient(90deg,rgba(255,255,255,0.32),transparent_42%,rgba(17,17,17,0.045))]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[68vmin] w-[68vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#111111]/[0.055]" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-[#111111]/10" />

        <div className="absolute left-5 top-20 z-30 max-w-[290px] md:left-8 md:top-24">
          <p className="text-[10px] uppercase tracking-[0.38em] text-[#111111]/42">
            APSIS Garment System
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLook.id}
              initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
              transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="mt-4 text-[clamp(36px,5.8vw,84px)] font-light leading-[0.88] tracking-[-0.085em]">
                {activeLook.name}
              </h1>
              <p className="mt-5 hidden max-w-[250px] text-sm leading-relaxed text-[#111111]/56 md:block">
                {activeLook.note}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div
          className="relative z-20 aspect-video w-[min(88vw,1180px)] touch-none outline-none"
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
              stepLook(1);
            }

            if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
              stepLook(-1);
            }
          }}
          role="region"
          tabIndex={0}
          aria-label="Scroll or swipe to browse clothing looks"
        >
          {stackedCards.map(({ look, offset }) => (
            <motion.div
              key={`${look.id}-${offset}`}
              animate={{
                opacity: 0.3 + (4 - offset) * 0.12,
                scale: 1 - offset * 0.045,
                x: offset * 44,
                y: offset * -30,
                rotate: offset * 1.05,
              }}
              transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 overflow-hidden border border-[#111111]/16 bg-[#d6d0c4] shadow-[0_42px_120px_rgba(36,31,21,0.18)]"
              style={{ zIndex: 10 + (4 - offset) }}
              aria-hidden="true"
            >
              <Image
                src={look.mainSrc}
                alt=""
                fill
                sizes="(min-width: 1024px) 1180px, 88vw"
                className="object-cover object-[center_38%] saturate-[0.82]"
              />
              <div className="absolute inset-0 bg-[#f4f1ea]/18" />
              <div className="absolute inset-3 border border-[#f4f1ea]/28" />
            </motion.div>
          ))}

          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={activeLook.mainSrc}
              custom={direction}
              initial={{
                opacity: 0,
                x: direction * 112,
                y: 18,
                scale: 0.992,
                rotate: direction * 0.55,
                filter: 'blur(6px)',
              }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, filter: 'blur(0px)' }}
              exit={{
                opacity: 0,
                x: direction * -112,
                y: -18,
                scale: 0.992,
                rotate: direction * -0.55,
                filter: 'blur(6px)',
              }}
              transition={{ duration: 1.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-30 overflow-hidden border border-[#111111]/14 bg-[#ded9ce] shadow-[0_54px_150px_rgba(36,31,21,0.22)]"
            >
              <Image
                src={activeLook.mainSrc}
                alt={`${activeLook.name} runway image`}
                fill
                priority
                sizes="(min-width: 1024px) 1180px, 88vw"
                className="object-cover object-[center_38%] saturate-[0.94]"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(244,241,234,0.04),transparent_40%,rgba(0,0,0,0.08))]" />
              <div className="pointer-events-none absolute inset-3 border border-[#f4f1ea]/32" />
            </motion.div>
          </AnimatePresence>
        </div>

        <aside className="absolute bottom-20 right-5 z-50 w-[min(58vw,240px)] border border-[#111111]/12 bg-[#f4f1ea]/78 p-2 shadow-[0_28px_80px_rgba(36,31,21,0.16)] backdrop-blur-md md:bottom-24 md:right-8 md:w-[280px]">
          <div className="relative aspect-[3/4] overflow-hidden bg-[#d7d1c6] md:aspect-[2/3]">
            <AnimatePresence custom={direction} initial={false}>
              <motion.div
                key={activeLook.detailSrc}
                custom={direction}
                initial={{ opacity: 0, y: direction * 34, scale: 1.012, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: direction * -34, scale: 1.012, filter: 'blur(6px)' }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={activeLook.detailSrc}
                  alt={`${activeLook.name} garment detail`}
                  fill
                  sizes="310px"
                  className="object-contain p-2 saturate-[0.96]"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeLook.id}
              initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
              transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
              className="px-1 pb-1 pt-3"
            >
              <p className="text-[9px] uppercase tracking-[0.34em] text-[#111111]/42">
                Look {String(safeActiveIndex + 1).padStart(2, '0')} / Detail
              </p>
              <p className="mt-3 text-[10px] uppercase leading-relaxed tracking-[0.24em] text-[#111111]/54">
                {activeLook.material}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-[#111111]/12 pt-3 text-[10px] uppercase tracking-[0.24em] text-[#111111]/68">
                <span>{activeLook.price}</span>
                <span>Made to order</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </aside>

        <div className="absolute bottom-7 left-5 z-50 flex items-center gap-4 md:left-8">
          <button
            type="button"
            onClick={() => stepLook(-1)}
            className="text-[10px] uppercase tracking-[0.32em] text-[#111111]/48 transition-colors duration-500 hover:text-[#111111]"
          >
            Previous
          </button>
          <div className="flex max-w-[230px] flex-wrap gap-2 md:max-w-none">
            {looks.map((look, index) => (
              <button
                key={look.id}
                type="button"
                onClick={() => goToLook(index)}
                className={[
                  'relative h-8 w-8 overflow-hidden rounded-full border transition-[border-color,opacity,transform] duration-500 ease-out',
                  index === activeIndex
                    ? 'border-[#111111]/70 opacity-100'
                    : 'border-[#111111]/16 opacity-42 hover:border-[#111111]/38 hover:opacity-80',
                ].join(' ')}
                aria-label={`View look ${look.id}`}
              >
                <Image
                  src={look.detailSrc}
                  alt=""
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => stepLook(1)}
            className="text-[10px] uppercase tracking-[0.32em] text-[#111111]/48 transition-colors duration-500 hover:text-[#111111]"
          >
            Next
          </button>
        </div>
      </section>
    </main>
  );
}
