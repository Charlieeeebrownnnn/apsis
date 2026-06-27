'use client';

/* eslint-disable @next/next/no-img-element */

import { useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type BurstImage = {
  src: string;
  alt: string;
  className: string;
  x: string;
  y: string;
  z: string;
  rotation: string;
  scale: number;
  delay: string;
};

type EditorialBurstProps = {
  scrollContainerRef: RefObject<HTMLElement | null>;
};

const heroBurstImage: BurstImage = {
  src: '/images/editorials/editorial-01.jpg',
  alt: 'APSIS editorial hero transitioning to layout',
  className: 'w-[46vw] max-w-[610px] min-w-[230px]',
  x: '-32vw',
  y: '-17vh',
  z: '120px',
  rotation: '-8deg',
  scale: 1.02,
  delay: '0.02s',
};

const heroLayoutImage = {
  height: '86vh',
  width: '152.89vh',
};

const burstImages: BurstImage[] = [
  {
    src: '/images/editorials/editorial-02.jpg',
    alt: 'APSIS editorial image two',
    className: 'w-[30vw] max-w-[390px] min-w-[170px]',
    x: '25vw',
    y: '-24vh',
    z: '80px',
    rotation: '6deg',
    scale: 0.94,
    delay: '0.06s',
  },
  {
    src: '/images/editorials/editorial-03.jpg',
    alt: 'APSIS editorial image three',
    className: 'w-[36vw] max-w-[480px] min-w-[200px]',
    x: '-4vw',
    y: '-4vh',
    z: '160px',
    rotation: '2deg',
    scale: 1.08,
    delay: '0.1s',
  },
  {
    src: '/images/editorials/editorial-04.jpg',
    alt: 'APSIS editorial image four',
    className: 'w-[41vw] max-w-[540px] min-w-[215px]',
    x: '33vw',
    y: '8vh',
    z: '100px',
    rotation: '-5deg',
    scale: 0.98,
    delay: '0.14s',
  },
  {
    src: '/images/editorials/editorial-05.jpg',
    alt: 'APSIS editorial image five',
    className: 'w-[26vw] max-w-[340px] min-w-[155px]',
    x: '-36vw',
    y: '15vh',
    z: '70px',
    rotation: '7deg',
    scale: 0.9,
    delay: '0.18s',
  },
  {
    src: '/images/editorials/editorial-06.jpg',
    alt: 'APSIS editorial image six',
    className: 'w-[32vw] max-w-[430px] min-w-[180px]',
    x: '8vw',
    y: '25vh',
    z: '130px',
    rotation: '-7deg',
    scale: 0.96,
    delay: '0.22s',
  },
  {
    src: '/images/editorials/special1.png',
    alt: 'APSIS editorial fragment one',
    className: 'w-[22vw] max-w-[290px] min-w-[140px]',
    x: '-18vw',
    y: '31vh',
    z: '50px',
    rotation: '-4deg',
    scale: 0.86,
    delay: '0.26s',
  },
  {
    src: '/images/editorials/special2.png',
    alt: 'APSIS editorial fragment two',
    className: 'w-[19vw] max-w-[250px] min-w-[125px]',
    x: '3vw',
    y: '-32vh',
    z: '110px',
    rotation: '10deg',
    scale: 0.82,
    delay: '0.3s',
  },
  {
    src: '/images/editorials/special3.png',
    alt: 'APSIS editorial fragment three',
    className: 'w-[23vw] max-w-[300px] min-w-[140px]',
    x: '41vw',
    y: '-7vh',
    z: '90px',
    rotation: '8deg',
    scale: 0.9,
    delay: '0.34s',
  },
  {
    src: '/images/editorials/special5.png',
    alt: 'APSIS editorial fragment four',
    className: 'w-[18vw] max-w-[230px] min-w-[118px]',
    x: '-8vw',
    y: '36vh',
    z: '60px',
    rotation: '5deg',
    scale: 0.78,
    delay: '0.38s',
  },
  {
    src: '/images/editorials/special6.png',
    alt: 'APSIS editorial fragment five',
    className: 'w-[25vw] max-w-[330px] min-w-[150px]',
    x: '-43vw',
    y: '-4vh',
    z: '75px',
    rotation: '3deg',
    scale: 0.86,
    delay: '0.42s',
  },
  {
    src: '/images/editorials/special7.png',
    alt: 'APSIS editorial fragment six',
    className: 'w-[20vw] max-w-[260px] min-w-[130px]',
    x: '21vw',
    y: '34vh',
    z: '65px',
    rotation: '4deg',
    scale: 0.82,
    delay: '0.46s',
  },
  {
    src: '/images/editorials/special8.png',
    alt: 'APSIS editorial fragment seven',
    className: 'w-[30vw] max-w-[380px] min-w-[165px]',
    x: '42vw',
    y: '24vh',
    z: '100px',
    rotation: '-3deg',
    scale: 0.9,
    delay: '0.5s',
  },
];

function buildBurstKeyframes() {
  return [heroBurstImage, ...burstImages]
    .map((image, index) => `
      @keyframes apsis-media-burst-${index} {
        0% {
          opacity: 0;
          transform: translate(-50%, -50%) translate3d(0, 0, 0) rotate(0deg) scale(0.02);
          filter: blur(10px);
        }
        12% {
          opacity: 1;
        }
        74%, 100% {
          opacity: 1;
          transform: translate(-50%, -50%) translate3d(${image.x}, ${image.y}, ${image.z}) rotate(${image.rotation}) scale(${image.scale});
          filter: blur(0);
        }
      }
    `)
    .join('\n');
}

export default function EditorialBurst({
  scrollContainerRef,
}: EditorialBurstProps) {
  const bgRef = useRef<HTMLDivElement | null>(null);
  const centerLabelRef = useRef<HTMLDivElement | null>(null);
  const scatteredImagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const heroImageRef = useRef<HTMLImageElement | null>(null);
  const textLayoutRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const scrollContainer = scrollContainerRef.current;
    const bg = bgRef.current;
    const centerLabel = centerLabelRef.current;
    const heroImage = heroImageRef.current;
    const textLayout = textLayoutRef.current;
    const scatteredNodes = scatteredImagesRef.current.filter(Boolean) as HTMLImageElement[];

    if (!scrollContainer || !bg || !centerLabel || !heroImage || !textLayout) {
      return;
    }

    const ctx = gsap.context(() => {
      if (window.innerWidth < 768) {
        return;
      }

      // 初始狀態：維持目前 collage 畫面，左上主圖就是接下來要被整理到右側的圖片。
      gsap.set(bg, { backgroundColor: 'rgba(0, 0, 0, 0.78)' });
      gsap.set(centerLabel, { autoAlpha: 1 });
      gsap.set(heroImage, {
        autoAlpha: 0,
        filter: 'blur(10px)',
        height: '54vh',
        left: '50%',
        maxWidth: 'none',
        minWidth: '0px',
        right: 'auto',
        rotation: 0,
        scale: 0.02,
        top: '50%',
        width: '39vw',
        x: 0,
        xPercent: -50,
        y: 0,
        yPercent: -50,
        z: 0,
      });
      gsap.set(textLayout, {
        autoAlpha: 0,
        x: -54,
      });

      gsap.to(heroImage, {
        autoAlpha: 1,
        delay: 0.02,
        duration: 1.18,
        ease: 'expo.out',
        filter: 'blur(0px)',
        rotation: -8,
        scale: heroBurstImage.scale,
        x: heroBurstImage.x,
        y: heroBurstImage.y,
        z: Number.parseFloat(heroBurstImage.z),
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: scrollContainer,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        // 背景與目前畫面同步轉色：一滾動就開始從黑色 collage 轉成米白 editorial layout。
        .to(
          bg,
          {
            backgroundColor: '#efeee9',
            duration: 1,
            ease: 'none',
          },
          0,
        )
        // 其他散落圖片同步退場，不等待主圖移動。
        .to(
          scatteredNodes,
          {
            autoAlpha: 0,
            duration: 0.56,
            ease: 'none',
            scale: 0.82,
            stagger: 0.018,
            y: -50,
          },
          0,
        )
        // 中央 archive 文案在整理開始時退場，避免壓在最終排版上。
        .to(
          centerLabel,
          {
            autoAlpha: 0,
            duration: 0.22,
            ease: 'none',
            y: -18,
          },
          0,
        )
        // 核心：左上主圖從現在的 collage 位置立刻往右滑動並放大。
        .fromTo(
          heroImage,
          {
            filter: 'blur(0px)',
            height: '54vh',
            left: '50%',
            maxWidth: 'none',
            minWidth: '0px',
            rotation: -8,
            scale: heroBurstImage.scale,
            top: '50%',
            width: '39vw',
            x: heroBurstImage.x,
            xPercent: -50,
            y: heroBurstImage.y,
            yPercent: -50,
            z: Number.parseFloat(heroBurstImage.z),
          },
          {
            duration: 1,
            ease: 'power2.inOut',
            height: heroLayoutImage.height,
            immediateRender: false,
            left: '100vw',
            maxWidth: 'none',
            minWidth: '0px',
            rotation: 0,
            scale: 1,
            top: '7vh',
            width: heroLayoutImage.width,
            x: 0,
            xPercent: -100,
            y: 0,
            yPercent: 0,
            z: 0,
          },
          '<',
        )
        // 後半段文字浮現，形成左文右圖的最終排版。
        .to(
          textLayout,
          {
            autoAlpha: 1,
            duration: 0.48,
            ease: 'power2.out',
            x: 0,
          },
          0.42,
        );
    }, scrollContainer);

    return () => {
      ctx.revert();
    };
  }, [scrollContainerRef]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[999] overflow-hidden"
      style={{ perspective: '1000px' }}
      aria-hidden
      data-apsis-burst="active"
    >
      <style>
        {`
          @keyframes apsis-burst-field {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }

          @keyframes apsis-burst-flare {
            0% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.05);
              filter: blur(24px);
            }
            30% {
              opacity: 0.82;
              transform: translate(-50%, -50%) scale(1.05);
            }
            100% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(2.85);
              filter: blur(44px);
            }
          }

          @keyframes apsis-burst-label {
            0%, 24% {
              opacity: 0;
              transform: translate(-50%, calc(-50% + 18px));
              filter: blur(12px);
            }
            100% {
              opacity: 1;
              transform: translate(-50%, -50%);
              filter: blur(0);
            }
          }

          ${buildBurstKeyframes()}
        `}
      </style>

      <div
        ref={bgRef}
        className="absolute inset-0 bg-black"
        style={{ animation: 'apsis-burst-field 360ms ease-out both' }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-[34vmin] w-[34vmin] rounded-full bg-white/80"
        style={{ animation: 'apsis-burst-flare 900ms ease-out both' }}
      />

      <div
        ref={centerLabelRef}
        className="absolute left-1/2 top-1/2 z-0 text-center"
        style={{ animation: 'apsis-burst-label 900ms ease-out 180ms both' }}
      >
        <p className="text-[10px] font-light uppercase tracking-[0.42em] text-white/60">
          EDITORIAL ARCHIVE
        </p>
        <p className="mt-3 max-w-[360px] text-sm font-light leading-relaxed tracking-[0.18em] text-white/44">
          Images from a future movement.
        </p>
      </div>

      <div
        ref={textLayoutRef}
        className="absolute bottom-[12vh] left-6 z-[80] max-w-[42rem] pr-8 text-[#111111] sm:left-8 md:max-w-[36vw]"
      >
        <p className="mb-8 text-[10px] font-light text-[#111111]/34">1.</p>
        <p className="mb-3 text-[clamp(1.7rem,3vw,3.75rem)] font-light leading-[0.9] tracking-[-0.075em] text-[#111111]/30">
          APSIS observes —
        </p>
        <h2 className="text-[clamp(2.2rem,4.6vw,5.6rem)] font-light leading-[0.9] tracking-[-0.08em] text-[#111111]">
          Human motion arranged as a living field.
        </h2>
        <p className="mt-8 max-w-[390px] text-sm font-light leading-relaxed tracking-[0.01em] text-[#111111]/56">
          Fabric, distance, pressure, and speed are composed like orbital data:
          quiet, tactile, and slightly unstable.
        </p>
      </div>

      <img
        ref={heroImageRef}
        src={heroBurstImage.src}
        alt={heroBurstImage.alt}
        className={[
          'absolute left-1/2 top-1/2 z-[70] aspect-video rounded-none object-contain opacity-0',
          heroBurstImage.className,
        ].join(' ')}
      />

      {burstImages.map((image, index) => (
        <img
          key={`${image.src}-${index}`}
          ref={(node) => {
            scatteredImagesRef.current[index] = node;
          }}
          src={image.src}
          alt={image.alt}
          className={[
            'absolute left-1/2 top-1/2 aspect-video overflow-hidden rounded-[2px]',
            'bg-[#1a1a18] object-cover opacity-0 shadow-[0_18px_58px_rgba(0,0,0,0.38)]',
            image.className,
          ].join(' ')}
          style={{
            animation: `apsis-media-burst-${index + 1} 1.18s cubic-bezier(0.16, 1, 0.3, 1) ${image.delay} both`,
            zIndex: index + 1,
          }}
        />
      ))}
    </div>
  );
}
