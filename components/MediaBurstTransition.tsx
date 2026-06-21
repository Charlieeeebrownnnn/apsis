'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

type MediaBurstTransitionProps = {
  isActive: boolean;
  onComplete: () => void;
};

type BurstItem = {
  src: string;
  alt: string;
  className: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
};

const burstItems: BurstItem[] = [
  {
    src: '/images/editorials/editorial-01.jpg',
    alt: 'APSIS burst frame one',
    className: 'w-[34vw] max-w-[420px] min-w-[170px]',
    x: -250,
    y: -118,
    rotation: -3,
    scale: 0.98,
  },
  {
    src: '/images/editorials/editorial-02.jpg',
    alt: 'APSIS burst frame two',
    className: 'w-[24vw] max-w-[300px] min-w-[140px]',
    x: 175,
    y: -106,
    rotation: 2,
    scale: 0.92,
  },
  {
    src: '/images/editorials/editorial-03.jpg',
    alt: 'APSIS burst frame three',
    className: 'w-[30vw] max-w-[370px] min-w-[155px]',
    x: -44,
    y: -24,
    rotation: -1,
    scale: 1.04,
  },
  {
    src: '/images/editorials/editorial-04.jpg',
    alt: 'APSIS burst frame four',
    className: 'w-[38vw] max-w-[470px] min-w-[190px]',
    x: 256,
    y: 40,
    rotation: 3,
    scale: 1,
  },
  {
    src: '/images/editorials/editorial-05.jpg',
    alt: 'APSIS burst frame five',
    className: 'w-[22vw] max-w-[260px] min-w-[130px]',
    x: -320,
    y: 82,
    rotation: 4,
    scale: 0.96,
  },
  {
    src: '/images/editorials/editorial-06.jpg',
    alt: 'APSIS burst frame six',
    className: 'w-[32vw] max-w-[390px] min-w-[170px]',
    x: 80,
    y: 120,
    rotation: -4,
    scale: 1.02,
  },
  {
    src: '/images/editorials/special2.png',
    alt: 'APSIS burst fragment seven',
    className: 'w-[26vw] max-w-[310px] min-w-[145px]',
    x: -150,
    y: 152,
    rotation: 2,
    scale: 0.9,
  },
  {
    src: '/images/editorials/special3.png',
    alt: 'APSIS burst fragment eight',
    className: 'w-[20vw] max-w-[240px] min-w-[120px]',
    x: 334,
    y: -142,
    rotation: -5,
    scale: 0.88,
  },
  {
    src: '/images/editorials/special6.png',
    alt: 'APSIS burst fragment nine',
    className: 'w-[28vw] max-w-[335px] min-w-[150px]',
    x: -388,
    y: -28,
    rotation: -2,
    scale: 0.94,
  },
  {
    src: '/images/editorials/special8.png',
    alt: 'APSIS burst fragment ten',
    className: 'w-[30vw] max-w-[360px] min-w-[155px]',
    x: 392,
    y: 132,
    rotation: 5,
    scale: 0.96,
  },
];

export default function MediaBurstTransition({
  isActive,
  onComplete,
}: MediaBurstTransitionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const container = containerRef.current;
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    const label = labelRef.current;
    const items = itemsRef.current.filter(Boolean) as HTMLDivElement[];

    if (!container || !backdrop || !panel || !label || items.length === 0) {
      return;
    }

    gsap.set(container, { autoAlpha: 0 });
    gsap.set(backdrop, { opacity: 0 });
    gsap.set(panel, { opacity: 0, scale: 0.96 });
    gsap.set(label, { opacity: 0, y: 8 });
    gsap.set(items, {
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0,
      opacity: 0,
      scale: 0,
      rotation: 0,
      transformOrigin: '50% 50%',
    });
  }, []);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const container = containerRef.current;
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    const label = labelRef.current;
    const items = itemsRef.current.filter(Boolean) as HTMLDivElement[];

    if (!container || !backdrop || !panel || !label || items.length === 0) {
      onCompleteRef.current();
      return;
    }

    const ctx = gsap.context(() => {
      const screenFactor = () => {
        if (window.innerWidth < 640) {
          return 0.42;
        }

        if (window.innerWidth < 1024) {
          return 0.72;
        }

        return 1;
      };

      gsap.set(container, { autoAlpha: 1 });
      gsap.set(backdrop, { opacity: 0 });
      gsap.set(panel, { opacity: 0, scale: 0.96, y: 0 });
      gsap.set(label, { opacity: 0, y: 8 });
      gsap.set(items, {
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 0,
        opacity: 0,
        scale: 0,
        rotation: 0,
        transformOrigin: '50% 50%',
      });

      const timeline = gsap.timeline({
        defaults: { overwrite: true },
        onComplete: () => {
          gsap.set(container, { autoAlpha: 0 });
          onCompleteRef.current();
        },
      });

      timeline
        .to(backdrop, {
          opacity: 1,
          duration: 0.22,
          ease: 'power2.out',
        })
        .to(
          panel,
          {
            opacity: 1,
            scale: 1,
            duration: 0.38,
            ease: 'power3.out',
          },
          0.04,
        )
        .to(
          label,
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
          },
          0.14,
        )
        .to(
          items,
          {
            opacity: 1,
            x: (index) => burstItems[index].x * screenFactor(),
            y: (index) => burstItems[index].y * screenFactor(),
            rotation: (index) => burstItems[index].rotation,
            scale: (index) => burstItems[index].scale,
            duration: 0.95,
            ease: 'expo.out',
            stagger: {
              each: 0.045,
              from: 'start',
            },
          },
          0.22,
        )
        .to(
          items,
          {
            x: (index) =>
              burstItems[index].x * screenFactor() +
              gsap.utils.random(-14, 14),
            y: (index) =>
              burstItems[index].y * screenFactor() +
              gsap.utils.random(-10, 10),
            scale: '+=0.018',
            duration: 0.58,
            ease: 'power1.out',
            stagger: 0.012,
          },
          0.9,
        )
        .to(
          [label, items],
          {
            opacity: 0,
            duration: 0.38,
            ease: 'power2.inOut',
            stagger: {
              each: 0.012,
              from: 'end',
            },
          },
          1.58,
        )
        .to(
          panel,
          {
            opacity: 0,
            scale: 1.015,
            duration: 0.46,
            ease: 'power2.inOut',
          },
          1.68,
        )
        .to(
          backdrop,
          {
            opacity: 0,
            duration: 0.42,
            ease: 'power2.inOut',
          },
          1.76,
        );
    }, container);

    return () => {
      ctx.revert();
    };
  }, [isActive]);

  return (
    <div
      ref={containerRef}
      className="invisible pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      aria-hidden
    >
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,#f8f8f5_0%,#efeee9_54%,#d9d7d1_100%)]"
      />

      <div
        ref={panelRef}
        className="relative h-[58vh] w-[76vw] max-w-[1180px] overflow-hidden bg-[#fbfbf8] shadow-[0_26px_90px_rgba(17,17,17,0.12)] sm:h-[60vh]"
      >
        <div
          ref={labelRef}
          className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 text-center"
        >
          <p className="text-[10px] font-light uppercase tracking-[0.34em] text-[#9c988f]">
            APSIS
          </p>
          <div className="mx-auto mt-2 h-px w-28 bg-[#d9d7d1]" />
        </div>

        {burstItems.map((item, index) => (
          <div
            key={item.src}
            ref={(node) => {
              itemsRef.current[index] = node;
            }}
            className={[
              'absolute left-1/2 top-1/2 aspect-video overflow-hidden rounded-[1px] bg-[#ddd8cf]',
              'opacity-0 shadow-[0_14px_42px_rgba(17,17,17,0.16)]',
              item.className,
            ].join(' ')}
            style={{ zIndex: index + 1 }}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(min-width: 1024px) 30vw, 58vw"
              className="object-cover"
              priority={index < 5}
            />
            <div className="pointer-events-none absolute inset-0 bg-black/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
