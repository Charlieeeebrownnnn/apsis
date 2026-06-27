'use client';

/* eslint-disable @next/next/no-img-element */

import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ArchiveBlueCurveField from '@/components/ArchiveBlueCurveField';

type ArchiveItem = {
  src: string;
  alt: string;
  caption: string;
  meta: string;
  className: string;
  imageClassName?: string;
  speed: number;
};

type KineticLine = {
  className: string;
  depth: number;
  rotate: number;
  speed: number;
};

type KineticRail = {
  className: string;
  speed: number;
  ticks: number;
};

type KineticArc = {
  className: string;
  depth: number;
  rotate: number;
  speed: number;
};

const chairVideo = {
  caption: 'Rotational Object Study',
  meta: 'Keyframe / Chair / Motion',
  frameCount: 240,
  framePath: '/images/chair-spin/frame-',
  speed: -18,
};

const clothingLookIds = [1, 2, 3, 4, 5, 6, 8, 9, 10];

const kineticLines: KineticLine[] = [
  {
    className: 'left-[4vw] top-[13%] h-px w-[68vw]',
    depth: 80,
    rotate: -8,
    speed: -130,
  },
  {
    className: 'right-[7vw] top-[29%] h-px w-[52vw]',
    depth: 160,
    rotate: 16,
    speed: 190,
  },
  {
    className: 'left-[14vw] top-[48%] h-px w-[72vw]',
    depth: 240,
    rotate: -18,
    speed: -210,
  },
  {
    className: 'right-[12vw] top-[67%] h-px w-[58vw]',
    depth: 120,
    rotate: 10,
    speed: 150,
  },
  {
    className: 'left-[8vw] top-[83%] h-px w-[46vw]',
    depth: 280,
    rotate: -12,
    speed: -170,
  },
];

const kineticRails: KineticRail[] = [
  {
    className: 'left-[-8vw] top-[7%] w-[116vw]',
    speed: -220,
    ticks: 8,
  },
  {
    className: 'left-[-14vw] top-[38%] w-[128vw]',
    speed: 180,
    ticks: 7,
  },
  {
    className: 'left-[-10vw] top-[72%] w-[118vw]',
    speed: -160,
    ticks: 9,
  },
];

const kineticArcs: KineticArc[] = [
  {
    className: 'left-[-18vw] top-[9%] h-[46vw] w-[46vw]',
    depth: 170,
    rotate: -18,
    speed: -120,
  },
  {
    className: 'right-[-16vw] top-[34%] h-[38vw] w-[38vw]',
    depth: 260,
    rotate: 22,
    speed: 140,
  },
  {
    className: 'left-[18vw] top-[61%] h-[52vw] w-[52vw]',
    depth: 110,
    rotate: 8,
    speed: -180,
  },
];

function getChairFrameSrc(frameIndex: number) {
  return `${chairVideo.framePath}${String(frameIndex).padStart(3, '0')}.jpg`;
}

function getClothingHref(index: number) {
  const lookId = clothingLookIds[index % clothingLookIds.length];

  return `/garments?look=${lookId}`;
}

const archiveItems: ArchiveItem[] = [
  {
    src: '/images/editorials/editorial-04.jpg',
    alt: 'APSIS wide motion frame',
    caption: 'Velocity Study No. 04',
    meta: 'Motion / Snow Field',
    className: 'col-span-12 aspect-[16/9] md:col-span-9',
    speed: -36,
  },
  {
    src: '/images/editorials/special3.png',
    alt: 'APSIS atmospheric portrait frame',
    caption: 'Blue Atmosphere Portrait',
    meta: 'Face / Distance',
    className: 'col-span-7 col-start-6 -mt-[16vw] aspect-[4/3] md:col-span-5 md:col-start-8',
    speed: 28,
  },
  {
    src: '/images/editorials/editorial-02.jpg',
    alt: 'APSIS lone figure mountain frame',
    caption: 'Distant Body Identity',
    meta: 'Landscape / Position',
    className: 'col-span-8 aspect-[5/3] md:col-span-7 md:col-start-2',
    speed: -22,
  },
  {
    src: '/images/editorials/special6.png',
    alt: 'APSIS concrete runner frame',
    caption: 'Urban Race Frame',
    meta: 'Concrete / Speed',
    className: 'col-span-7 aspect-[4/3] md:col-span-6',
    speed: 34,
  },
  {
    src: '/images/editorials/special8.png',
    alt: 'APSIS high altitude runner frame',
    caption: 'High Altitude Exit',
    meta: 'Terrain / Wind',
    className: 'col-span-7 col-start-6 mt-[7vw] aspect-[4/3] md:col-span-6 md:col-start-7',
    speed: -28,
  },
  {
    src: '/images/editorials/editorial-05.jpg',
    alt: 'APSIS quiet object frame',
    caption: 'Object Under Gravity',
    meta: 'Stillness / Material',
    className: 'col-span-8 aspect-[5/4] md:col-span-7',
    imageClassName: 'object-[50%_58%]',
    speed: 20,
  },
  {
    src: '/images/editorials/special1.png',
    alt: 'APSIS night garment frame',
    caption: 'Night Garment Index',
    meta: 'Surface / Reflection',
    className: 'col-span-5 col-start-8 -mt-[10vw] aspect-[3/4] md:col-span-4 md:col-start-9',
    speed: -18,
  },
  {
    src: '/images/editorials/special2.png',
    alt: 'APSIS blue gesture frame',
    caption: 'Gesture Slip',
    meta: 'Blur / Body',
    className: 'col-span-6 aspect-[4/3] md:col-span-5 md:col-start-2',
    speed: 30,
  },
  {
    src: '/images/editorials/special5.png',
    alt: 'APSIS small graphic fragment',
    caption: 'Signal Fragment',
    meta: 'Graphic / Archive',
    className: 'col-span-5 col-start-7 mt-[4vw] aspect-square md:col-span-4 md:col-start-8',
    speed: -26,
  },
  {
    src: '/images/editorials/editorial-03.jpg',
    alt: 'APSIS transitional editorial frame',
    caption: 'Field Test Contact',
    meta: 'Body / Air',
    className: 'col-span-12 aspect-[21/9]',
    speed: 16,
  },
  {
    src: '/images/editorials/special7.png',
    alt: 'APSIS lower archive fragment',
    caption: 'Lower Orbit Proof',
    meta: 'Archive / Print',
    className: 'col-span-5 aspect-[4/3] md:col-span-4 md:col-start-2',
    speed: -20,
  },
  {
    src: '/images/editorials/editorial-06.jpg',
    alt: 'APSIS closing movement frame',
    caption: 'Manual for Future Movement',
    meta: 'System / Field',
    className: 'col-span-9 col-start-4 aspect-[16/9] md:col-span-8 md:col-start-4',
    speed: 24,
  },
];

export default function EditorialArchiveSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const lineFieldRef = useRef<HTMLDivElement | null>(null);
  const railRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const arcRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const videoArticleRef = useRef<HTMLElement | null>(null);
  const frameImageRef = useRef<HTMLImageElement | null>(null);
  const lastFrameRef = useRef(1);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    Array.from({ length: chairVideo.frameCount }, (_, index) => index + 1)
      .filter((frame) => frame <= 12 || frame % 8 === 0)
      .forEach((frame) => {
        const image = new window.Image();

        image.src = getChairFrameSrc(frame);
      });

    const section = sectionRef.current;
    const items = itemRefs.current.filter(Boolean) as HTMLElement[];
    const lineField = lineFieldRef.current;
    const rails = railRefs.current.filter(Boolean) as HTMLSpanElement[];
    const arcs = arcRefs.current.filter(Boolean) as HTMLSpanElement[];
    const lines = lineRefs.current.filter(Boolean) as HTMLSpanElement[];
    const nodes = nodeRefs.current.filter(Boolean) as HTMLSpanElement[];
    const videoArticle = videoArticleRef.current;
    const frameImage = frameImageRef.current;

    if (!section || items.length === 0) {
      return;
    }

    const ctx = gsap.context(() => {
      if (window.innerWidth < 768) {
        return;
      }

      items.forEach((item, index) => {
        const speed = archiveItems[index].speed;

        gsap.fromTo(
          item,
          {
            y: speed * -0.45,
          },
          {
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.1,
            },
            y: speed,
          },
        );
      });

      if (videoArticle) {
        gsap.fromTo(
          videoArticle,
          {
            y: chairVideo.speed * -0.45,
          },
          {
            ease: 'none',
            scrollTrigger: {
              trigger: videoArticle,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.1,
            },
            y: chairVideo.speed,
          },
        );
      }

      if (lineField) {
        gsap.fromTo(
          lineField,
          {
            rotateX: 14,
            rotateY: -9,
            y: -110,
          },
          {
            ease: 'none',
            rotateX: -9,
            rotateY: 10,
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.4,
            },
            y: 160,
          },
        );
      }

      if (rails.length > 0) {
        rails.forEach((rail, index) => {
          const railConfig = kineticRails[index];

          gsap.fromTo(
            rail,
            {
              opacity: 0.1,
              x: railConfig.speed * -0.2,
              z: -60,
            },
            {
              ease: 'none',
              opacity: 0.24,
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.15 + index * 0.12,
              },
              x: railConfig.speed,
              z: 120 + index * 44,
            },
          );
        });
      }

      if (arcs.length > 0) {
        arcs.forEach((arc, index) => {
          const arcConfig = kineticArcs[index];

          gsap.fromTo(
            arc,
            {
              opacity: 0.08,
              rotate: arcConfig.rotate - 18,
              scale: 0.86,
              x: arcConfig.speed * -0.24,
              y: arcConfig.speed * 0.12,
              z: arcConfig.depth * -0.45,
            },
            {
              ease: 'none',
              opacity: 0.2,
              rotate: arcConfig.rotate + 26,
              scale: 1.16,
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.35 + index * 0.16,
              },
              x: arcConfig.speed,
              y: arcConfig.speed * -0.18,
              z: arcConfig.depth,
            },
          );
        });
      }

      if (lines.length > 0) {
        lines.forEach((line, index) => {
          const lineConfig = kineticLines[index];

          gsap.fromTo(
            line,
            {
              opacity: 0.08,
              x: lineConfig.speed * -0.28,
              y: lineConfig.speed * 0.18,
              z: lineConfig.depth * -0.4,
            },
            {
              ease: 'none',
              opacity: 0.2,
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2 + index * 0.08,
              },
              x: lineConfig.speed,
              y: lineConfig.speed * -0.36,
              z: lineConfig.depth,
            },
          );
        });

        nodes.forEach((node, index) => {
          gsap.fromTo(
            node,
            {
              opacity: 0.16,
              scale: 0.72,
              x: index % 2 === 0 ? -36 : 42,
            },
            {
              ease: 'none',
              opacity: 0.42,
              scale: 1.18,
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.35,
              },
              x: index % 2 === 0 ? 58 : -46,
            },
          );
        });
      }
    }, section);

    let rafId = 0;
    let isAnimatingFrames = true;

    const readTargetProgressFromScroll = () => {
      if (!videoArticle || !frameImage) {
        return;
      }

      const rect = videoArticle.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const startTop = viewportHeight * 0.82;
      const endTop = viewportHeight * 0.18 - rect.height;
      targetProgressRef.current = gsap.utils.clamp(
        0,
        1,
        (startTop - rect.top) / (startTop - endTop),
      );
    };

    const renderChairFrame = () => {
      if (!frameImage) {
        return;
      }

      currentProgressRef.current +=
        (targetProgressRef.current - currentProgressRef.current) * 0.14;

      if (Math.abs(targetProgressRef.current - currentProgressRef.current) < 0.0008) {
        currentProgressRef.current = targetProgressRef.current;
      }

      const nextFrame = Math.min(
        chairVideo.frameCount,
        Math.max(
          1,
          Math.round(currentProgressRef.current * (chairVideo.frameCount - 1)) + 1,
        ),
      );

      if (nextFrame !== lastFrameRef.current) {
        lastFrameRef.current = nextFrame;
        frameImage.src = getChairFrameSrc(nextFrame);
        frameImage.dataset.frame = String(nextFrame);
      }

      if (isAnimatingFrames) {
        rafId = window.requestAnimationFrame(renderChairFrame);
      }
    };

    const requestFrameUpdate = () => {
      readTargetProgressFromScroll();
    };

    requestFrameUpdate();
    rafId = window.requestAnimationFrame(renderChairFrame);
    window.addEventListener('scroll', requestFrameUpdate, { passive: true });
    window.addEventListener('resize', requestFrameUpdate);

    return () => {
      isAnimatingFrames = false;

      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }

      window.removeEventListener('scroll', requestFrameUpdate);
      window.removeEventListener('resize', requestFrameUpdate);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#f7f5ef] px-3 pb-28 pt-4 text-[#111111] sm:px-5 sm:pb-36"
      aria-label="APSIS editorial archive layout"
    >
      <ArchiveBlueCurveField scrollContainerRef={sectionRef} />

      <div
        ref={lineFieldRef}
        className="pointer-events-none absolute inset-0 z-0 hidden [perspective:1200px] md:block"
        aria-hidden
      >
        {kineticRails.map((rail, index) => (
          <span
            key={`rail-${rail.speed}`}
            ref={(node) => {
              railRefs.current[index] = node;
            }}
            className={[
              'absolute block h-px origin-center will-change-transform',
              'bg-gradient-to-r from-transparent via-[#111111]/22 to-transparent',
              rail.className,
            ].join(' ')}
          >
            {Array.from({ length: rail.ticks }, (_, tickIndex) => (
              <span
                key={tickIndex}
                className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-[#111111]/26"
                style={{
                  left: `${(tickIndex + 1) * (100 / (rail.ticks + 1))}%`,
                }}
              />
            ))}
          </span>
        ))}

        {kineticArcs.map((arc, index) => (
          <span
            key={`arc-${arc.speed}`}
            ref={(node) => {
              arcRefs.current[index] = node;
            }}
            className={[
              'absolute block rounded-full border-[18px] border-[#111111]/[0.045]',
              'border-b-transparent border-r-transparent will-change-transform',
              arc.className,
            ].join(' ')}
            style={{
              transform: `rotate(${arc.rotate}deg) translateZ(${arc.depth}px)`,
            }}
          />
        ))}

        {kineticLines.map((line, index) => (
          <span
            key={`${line.rotate}-${line.speed}`}
            ref={(node) => {
              lineRefs.current[index] = node;
            }}
            className={[
              'absolute block origin-center will-change-transform',
              'bg-gradient-to-r from-transparent via-[#111111]/18 to-transparent',
              'after:absolute after:left-1/2 after:top-1/2 after:h-[5px] after:w-[5px]',
              'after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full',
              'after:border after:border-[#111111]/18 after:bg-[#f7f5ef]/60',
              line.className,
            ].join(' ')}
            style={{
              transform: `rotate(${line.rotate}deg) translateZ(${line.depth}px)`,
            }}
          />
        ))}

        {kineticLines.map((line, index) => (
          <span
            key={`node-${line.rotate}-${line.speed}`}
            ref={(node) => {
              nodeRefs.current[index] = node;
            }}
            className="absolute h-24 w-24 rounded-full border border-[#111111]/[0.055] opacity-20 will-change-transform"
            style={{
              left: index % 2 === 0 ? `${18 + index * 9}vw` : `${64 - index * 4}vw`,
              top: `${18 + index * 15}%`,
              transform: `translateZ(${line.depth * 0.6}px) rotateX(62deg)`,
            }}
          />
        ))}

        <div className="absolute left-1/2 top-[8%] h-[86%] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#111111]/[0.06] to-transparent" />
      </div>

      <header className="sticky top-0 z-40 flex items-start justify-between bg-[#f7f5ef]/88 py-3 text-[11px] leading-none backdrop-blur-md">
        <p className="font-medium tracking-[-0.055em]">APSIS Studio</p>
        <nav className="hidden gap-[16vw] text-[10px] uppercase tracking-[-0.02em] text-[#111111]/76 md:flex">
          <span>1. Editorial</span>
          <span>2. Motion</span>
          <span>3. Archive</span>
        </nav>
        <span className="text-[14px] leading-none">=</span>
      </header>

      <div className="relative z-10 mt-20 grid grid-cols-12 gap-x-3 gap-y-28 sm:mt-24 sm:gap-x-5 sm:gap-y-36">
        {archiveItems.slice(0, 2).map((item, index) => (
          <article
            key={item.src}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            className={[
              'group relative min-h-[180px] will-change-transform',
              item.className,
            ].join(' ')}
          >
            <Link
              href={getClothingHref(index)}
              className="block h-full outline-none focus-visible:ring-1 focus-visible:ring-[#111111]/45"
            >
              <div className="relative h-full w-full overflow-hidden bg-[#ddd9cf]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 72vw, 96vw"
                  className={[
                    'object-cover saturate-[0.88] transition-transform duration-[1400ms] ease-out group-hover:scale-[1.025]',
                    item.imageClassName ?? '',
                  ].join(' ')}
                />
                <div className="pointer-events-none absolute inset-0 bg-[#f7f5ef]/[0.025]" />
                <div className="pointer-events-none absolute bottom-4 right-4 rounded-full border border-[#111111]/18 bg-[#f7f5ef]/72 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#111111]/70 opacity-0 backdrop-blur-md transition-opacity duration-700 ease-out group-hover:opacity-100">
                  View garment system
                </div>
              </div>
              <div className="mt-2 text-[9px] leading-[1.08] tracking-[-0.035em]">
                <p className="font-semibold">{item.caption}</p>
                <p className="text-[#111111]/50">{item.meta} / Enter Look</p>
              </div>
            </Link>
            <p className="absolute right-[-16px] top-0 hidden origin-top-right rotate-90 text-[8px] uppercase tracking-[0.08em] text-[#111111]/30 md:block">
              ©2026 / APSIS Archive
            </p>
          </article>
        ))}

        <article
          ref={videoArticleRef}
          className="group relative col-span-12 aspect-[16/9] min-h-[320px] will-change-transform md:col-span-10 md:col-start-2"
        >
          <Link href="/chairs" className="block h-full outline-none focus-visible:ring-1 focus-visible:ring-[#111111]/45">
            <div className="relative h-full w-full overflow-hidden bg-[#dedad0]">
              <img
                ref={frameImageRef}
                src={getChairFrameSrc(1)}
                alt="APSIS chair rotation keyframe study"
                className="h-full w-full object-cover saturate-[0.9] transition-transform duration-[1400ms] ease-out group-hover:scale-[1.015]"
                data-frame="1"
              />
              <div className="pointer-events-none absolute inset-0 bg-[#f7f5ef]/[0.02]" />
              <div className="pointer-events-none absolute bottom-4 right-4 rounded-full border border-[#111111]/18 bg-[#f7f5ef]/72 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#111111]/70 opacity-0 backdrop-blur-md transition-opacity duration-700 ease-out group-hover:opacity-100">
                View chair orbit
              </div>
            </div>
            <div className="mt-2 text-[9px] leading-[1.08] tracking-[-0.035em]">
              <p className="font-semibold">{chairVideo.caption}</p>
              <p className="text-[#111111]/50">{chairVideo.meta} / Enter Sales Page</p>
            </div>
            <p className="absolute right-[-16px] top-0 hidden origin-top-right rotate-90 text-[8px] uppercase tracking-[0.08em] text-[#111111]/30 md:block">
              ©2026 / APSIS Motion
            </p>
          </Link>
        </article>

        {archiveItems.slice(2).map((item, index) => {
          const archiveIndex = index + 2;

          return (
            <article
              key={item.src}
              ref={(node) => {
                itemRefs.current[archiveIndex] = node;
              }}
              className={[
                'group relative min-h-[180px] will-change-transform',
                item.className,
              ].join(' ')}
            >
              <Link
                href={getClothingHref(archiveIndex)}
                className="block h-full outline-none focus-visible:ring-1 focus-visible:ring-[#111111]/45"
              >
                <div className="relative h-full w-full overflow-hidden bg-[#ddd9cf]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 72vw, 96vw"
                    className={[
                      'object-cover saturate-[0.88] transition-transform duration-[1400ms] ease-out group-hover:scale-[1.025]',
                      item.imageClassName ?? '',
                    ].join(' ')}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[#f7f5ef]/[0.025]" />
                  <div className="pointer-events-none absolute bottom-4 right-4 rounded-full border border-[#111111]/18 bg-[#f7f5ef]/72 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#111111]/70 opacity-0 backdrop-blur-md transition-opacity duration-700 ease-out group-hover:opacity-100">
                    View garment system
                  </div>
                </div>
                <div className="mt-2 text-[9px] leading-[1.08] tracking-[-0.035em]">
                  <p className="font-semibold">{item.caption}</p>
                  <p className="text-[#111111]/50">{item.meta} / Enter Look</p>
                </div>
              </Link>
              <p className="absolute right-[-16px] top-0 hidden origin-top-right rotate-90 text-[8px] uppercase tracking-[0.08em] text-[#111111]/30 md:block">
                ©2026 / APSIS Archive
              </p>
            </article>
          );
        })}
      </div>

      <footer className="mt-28 flex gap-8 text-[9px] font-semibold uppercase tracking-[-0.02em]">
        <a href="#top">Back to top</a>
        <a href="mailto:studio@apsis.local">Contact</a>
      </footer>
    </section>
  );
}
