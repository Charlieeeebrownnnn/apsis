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

type ChairProduct = {
  id: string;
  name: string;
  src: string;
  material: string;
  note: string;
  price: string;
};

const chairs: ChairProduct[] = [
  {
    id: 'orbit-01',
    name: 'Orbit Chair 01',
    src: '/images/products/chair1.png',
    material: 'Smoked polymer shell / brushed alloy base',
    note: 'A low gravity seat study for domestic motion.',
    price: 'NT$ 42,000',
  },
  {
    id: 'orbit-02',
    name: 'Orbit Chair 02',
    src: '/images/products/chair2.webp',
    material: 'Graphite textile / satin black frame',
    note: 'Compressed posture, soft reflection, quiet rotation.',
    price: 'NT$ 39,000',
  },
  {
    id: 'orbit-03',
    name: 'Orbit Chair 03',
    src: '/images/products/chair3.webp',
    material: 'Warm shell / powder coated steel',
    note: 'Built as a calm object inside fast rooms.',
    price: 'NT$ 41,000',
  },
  {
    id: 'orbit-04',
    name: 'Orbit Chair 04',
    src: '/images/products/chair4.webp',
    material: 'Deep fabric / orbital metal joint',
    note: 'A chair that holds light without shouting.',
    price: 'NT$ 45,000',
  },
  {
    id: 'orbit-05',
    name: 'Orbit Chair 05',
    src: '/images/products/chair5.png',
    material: 'Ivory composite / shadow lacquer',
    note: 'Soft geometry with a sharper silhouette.',
    price: 'NT$ 44,000',
  },
  {
    id: 'orbit-06',
    name: 'Orbit Chair 06',
    src: '/images/products/chair6.png',
    material: 'Ash surface / blackened aluminum',
    note: 'An object for pause, repeat, and return.',
    price: 'NT$ 43,000',
  },
  {
    id: 'orbit-07',
    name: 'Orbit Chair 07',
    src: '/images/products/chair7.png',
    material: 'Matte dark shell / polished foot ring',
    note: 'Circular balance with a heavier visual center.',
    price: 'NT$ 47,000',
  },
  {
    id: 'orbit-08',
    name: 'Orbit Chair 08',
    src: '/images/products/chair8.png',
    material: 'Stone textile / smoked steel',
    note: 'Designed for rooms that feel slightly lunar.',
    price: 'NT$ 46,000',
  },
];

const normalizeIndex = (index: number) => (index + chairs.length) % chairs.length;

export default function ChairSalesShowcase() {
  const [[activeIndex, direction], setActiveChair] = useState<[number, number]>([0, 1]);
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const dragDeltaXRef = useRef(0);
  const dragDeltaYRef = useRef(0);
  const wheelLockedRef = useRef(false);

  const activeChair = chairs[activeIndex];

  const stepChair = useCallback((step: number) => {
    setActiveChair(([current]) => [normalizeIndex(current + step), step > 0 ? 1 : -1]);
  }, []);

  const goToChair = useCallback(
    (index: number) => {
      if (index === activeIndex) {
        return;
      }

      const forwardDistance = (index - activeIndex + chairs.length) % chairs.length;
      const backwardDistance = (activeIndex - index + chairs.length) % chairs.length;

      setActiveChair([index, forwardDistance <= backwardDistance ? 1 : -1]);
    },
    [activeIndex],
  );

  const orbitItems = useMemo(() => {
    return chairs.map((chair, index) => {
      const rawOffset = (index - activeIndex + chairs.length) % chairs.length;
      const offset = rawOffset > chairs.length / 2 ? rawOffset - chairs.length : rawOffset;
      const angle = 90 + offset * (360 / chairs.length);
      const isActive = index === activeIndex;
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
  }, [activeIndex]);

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
              key={activeChair.id}
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
          Index {String(activeIndex + 1).padStart(2, '0')}
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
                key={activeChair.id}
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
                  src={activeChair.src}
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
                key={chair.id}
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
                    src={chair.src}
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
