'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

export type ChairProduct = {
  _id?: string;
  id: string;
  name: string;
  src: string;
  material: string;
  note: string;
  price: string;
  spinFramePath?: string;
  spinFrameCount?: number;
};

type ChairSalesShowcaseProps = {
  products: ChairProduct[];
};

type SanityImageOptions = {
  auto?: string;
  fit?: string;
  h?: number;
  q?: number;
  w?: number;
};

const normalizeIndex = (index: number, productCount: number) => (
  (index + productCount) % productCount
);

function getOptimizedSanityImageUrl(src: string, options: SanityImageOptions) {
  if (!src) {
    return src;
  }

  try {
    const url = new URL(src);

    if (url.hostname !== 'cdn.sanity.io') {
      return src;
    }

    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });

    return url.toString();
  } catch {
    return src;
  }
}

function getChairKey(chair: ChairProduct, fallback: string | number) {
  return chair._id ?? `${chair.id}-${fallback}`;
}

export default function ChairSalesShowcase({ products }: ChairSalesShowcaseProps) {
  if (products.length === 0) {
    return (
      <main className="fixed inset-0 flex h-[100dvh] items-center justify-center bg-[#efeee9] px-6 text-[#111111]">
        <p className="text-[11px] uppercase tracking-[0.34em] text-[#111111]/54">
          No chair products found.
        </p>
      </main>
    );
  }

  return <ChairSalesShowcaseCarousel products={products} />;
}

function ChairSalesShowcaseCarousel({ products }: ChairSalesShowcaseProps) {
  const [[activeIndex, direction], setActiveChair] = useState<[number, number]>([0, 1]);
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const dragDeltaXRef = useRef(0);
  const dragDeltaYRef = useRef(0);
  const wheelLockedRef = useRef(false);

  const productCount = products.length;
  const safeActiveIndex = Math.min(activeIndex, productCount - 1);
  const activeChair = products[safeActiveIndex];
  const activeChairKey = getChairKey(activeChair, safeActiveIndex);

  const stepChair = useCallback((step: number) => {
    setActiveChair(([current]) => [
      normalizeIndex(current + step, productCount),
      step > 0 ? 1 : -1,
    ]);
  }, [productCount]);

  const goToChair = useCallback(
    (index: number) => {
      if (index === safeActiveIndex) {
        return;
      }

      const forwardDistance = (index - safeActiveIndex + productCount) % productCount;
      const backwardDistance = (safeActiveIndex - index + productCount) % productCount;

      setActiveChair([index, forwardDistance <= backwardDistance ? 1 : -1]);
    },
    [productCount, safeActiveIndex],
  );

  const orbitItems = useMemo(() => {
    return products.map((chair, index) => {
      const rawOffset = (index - safeActiveIndex + productCount) % productCount;
      const offset = rawOffset > productCount / 2 ? rawOffset - productCount : rawOffset;
      const angle = 90 + offset * (360 / productCount);
      const isActive = index === safeActiveIndex;
      const depth = Math.cos((angle * Math.PI) / 180);

      return {
        angle,
        chair,
        index,
        isActive,
        opacity: isActive ? 1 : 0.48 + Math.max(0, depth) * 0.22,
        scale: isActive ? 1.12 : 0.78 + Math.max(0, depth) * 0.12,
      };
    });
  }, [productCount, products, safeActiveIndex]);

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
      stepChair(delta > 0 ? 1 : -1);

      window.setTimeout(() => {
        wheelLockedRef.current = false;
      }, 720);
    };

    window.addEventListener('wheel', handleWindowWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWindowWheel);
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.overscrollBehavior = previousBodyOverscroll;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.documentElement.style.overscrollBehavior = previousHtmlOverscroll;
    };
  }, [stepChair]);

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
      stepChair(swipeDistance < 0 ? 1 : -1);
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <main
      className="fixed inset-0 h-[100dvh] overflow-hidden overscroll-none bg-[#efeee9] text-[#111111]"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <section
        className="relative flex h-full items-center justify-center overflow-hidden px-5 py-20 md:px-10 md:py-24"
        aria-label="APSIS chair sales carousel"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(17,17,17,0.075),transparent_34%),radial-gradient(circle_at_52%_55%,rgba(120,114,100,0.14),transparent_50%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-[#111111]/10" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[78vmin] w-[78vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#111111]/10" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[54vmin] w-[54vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#111111]/[0.055]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34vmin] w-[34vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#111111]/[0.04]" />

        <aside className="absolute left-5 top-24 z-30 max-w-[270px] md:left-8 md:top-[24vh]">
          <p className="mb-4 text-[10px] uppercase tracking-[0.42em] text-[#111111]/42">
            Sales Object
          </p>
          <h1 className="text-[clamp(42px,8vw,112px)] font-light leading-[0.86] tracking-[-0.08em]">
            Chair
            <br />
            Orbit.
          </h1>
        </aside>

        <aside className="absolute bottom-24 right-5 z-30 max-w-[310px] text-right md:bottom-[18vh] md:right-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeChairKey}-copy`}
              initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
              transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-[11px] uppercase tracking-[0.36em] text-[#111111]/46">
                {activeChair.material}
              </p>
              <h2 className="mt-5 text-2xl font-light tracking-[-0.06em] md:text-4xl">
                {activeChair.name}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#111111]/60">{activeChair.note}</p>
              <p className="mt-6 text-xs uppercase tracking-[0.32em] text-[#111111]/72">
                {activeChair.price}
              </p>
            </motion.div>
          </AnimatePresence>
        </aside>

        <p className="absolute right-5 top-20 z-30 text-[10px] uppercase tracking-[0.34em] text-[#111111]/42 md:right-8 md:top-24">
          Index {String(safeActiveIndex + 1).padStart(2, '0')}
        </p>

        <div
          className="relative z-20 flex h-full w-full max-w-[1180px] touch-none select-none items-center justify-center outline-none"
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') {
              stepChair(1);
            }

            if (event.key === 'ArrowLeft') {
              stepChair(-1);
            }
          }}
          role="region"
          tabIndex={0}
          aria-label="Swipe vertically, scroll, or use arrow keys to browse chair variations"
          style={{ '--orbit-radius': 'clamp(178px, 30vw, 430px)' } as CSSProperties}
        >
          <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#111111]/48" />

          <div className="absolute left-1/2 top-1/2 z-20 aspect-square h-[min(72vh,780px)] min-h-[390px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-[#111111]/10 bg-[#d8d2c5] shadow-[0_56px_150px_rgba(36,31,21,0.16)]">
            <div className="pointer-events-none absolute inset-0 z-10 rounded-full bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.34),transparent_38%),radial-gradient(circle_at_50%_76%,rgba(17,17,17,0.16),transparent_54%)]" />
            <div className="pointer-events-none absolute inset-[7%] z-10 rounded-full border border-[#111111]/[0.045]" />

            <AnimatePresence custom={direction} initial={false}>
              <motion.div
                key={activeChairKey}
                custom={direction}
                initial={{
                  opacity: 0,
                  x: direction * 118,
                  scale: 0.985,
                  rotate: direction * 0.9,
                }}
                animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
                exit={{
                  opacity: 0,
                  x: direction * -104,
                  scale: 0.985,
                  rotate: direction * -0.7,
                }}
                transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -inset-[5%]"
              >
                <Image
                  src={getOptimizedSanityImageUrl(activeChair.src, {
                    auto: 'format',
                    fit: 'max',
                    q: 78,
                    w: 1200,
                  })}
                  alt={activeChair.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 780px, 86vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute inset-0">
            {orbitItems.map(({ angle, chair, index, isActive, opacity, scale }) => (
              <button
                key={getChairKey(chair, index)}
                type="button"
                className={[
                  'absolute left-1/2 top-1/2 z-30 h-16 w-16 overflow-hidden rounded-full border bg-[#f8f6ef]/84 p-1 backdrop-blur-md transition-[border-color,opacity,transform] duration-[1100ms] ease-out md:h-[92px] md:w-[92px]',
                  isActive ? 'border-[#111111]/58' : 'border-[#111111]/14 hover:border-[#111111]/36',
                ].join(' ')}
                onClick={() => goToChair(index)}
                aria-label={`View ${chair.name}`}
                aria-current={isActive ? 'true' : undefined}
                style={{
                  opacity,
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(calc(var(--orbit-radius) * -1)) rotate(${-angle}deg) scale(${scale})`,
                }}
              >
                <span className="relative block h-full w-full overflow-hidden rounded-full bg-[#d8d2c5]">
                  <span className="pointer-events-none absolute inset-0 z-10 rounded-full bg-[radial-gradient(circle_at_50%_32%,rgba(255,255,255,0.32),transparent_44%),radial-gradient(circle_at_50%_80%,rgba(17,17,17,0.18),transparent_56%)]" />
                  <Image
                    src={getOptimizedSanityImageUrl(chair.src, {
                      auto: 'format',
                      fit: 'crop',
                      h: 184,
                      q: 72,
                      w: 184,
                    })}
                    alt=""
                    fill
                    sizes="92px"
                    className="scale-[1.12] object-cover"
                  />
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="absolute bottom-6 left-5 right-5 z-40 flex items-center justify-between text-[10px] uppercase tracking-[0.34em] text-[#111111]/44 md:left-8 md:right-8">
          <button
            type="button"
            onClick={() => stepChair(-1)}
            className="transition-colors duration-500 hover:text-[#111111]"
          >
            Previous
          </button>
          <p className="hidden md:block">Scroll Up / Down to Change Chair</p>
          <button
            type="button"
            onClick={() => stepChair(1)}
            className="transition-colors duration-500 hover:text-[#111111]"
          >
            Next
          </button>
        </div>
      </section>
    </main>
  );
}
