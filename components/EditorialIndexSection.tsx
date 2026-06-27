'use client';

import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type ScatteredImage = {
  src: string;
  alt: string;
  className: string;
};

const scatteredImages: ScatteredImage[] = [
  {
    src: '/images/editorials/editorial-02.jpg',
    alt: 'APSIS scattered editorial two',
    className: 'left-[5vw] top-[12vh] aspect-[3/4] w-[12vw] min-w-[108px]',
  },
  {
    src: '/images/editorials/editorial-03.jpg',
    alt: 'APSIS scattered editorial three',
    className: 'right-[12vw] top-[9vh] aspect-video w-[22vw] min-w-[210px]',
  },
  {
    src: '/images/editorials/editorial-04.jpg',
    alt: 'APSIS scattered editorial four',
    className: 'left-[13vw] bottom-[12vh] aspect-video w-[19vw] min-w-[180px]',
  },
  {
    src: '/images/editorials/editorial-05.jpg',
    alt: 'APSIS scattered editorial five',
    className: 'right-[6vw] bottom-[17vh] aspect-[4/5] w-[13vw] min-w-[118px]',
  },
  {
    src: '/images/editorials/special1.png',
    alt: 'APSIS scattered fragment one',
    className: 'left-[42vw] top-[18vh] aspect-video w-[13vw] min-w-[130px]',
  },
  {
    src: '/images/editorials/special6.png',
    alt: 'APSIS scattered fragment six',
    className: 'left-[48vw] bottom-[9vh] aspect-video w-[16vw] min-w-[150px]',
  },
];

export default function EditorialIndexSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const scatteredImagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const heroImageRef = useRef<HTMLDivElement | null>(null);
  const textLayoutRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const bg = bgRef.current;
    const heroImage = heroImageRef.current;
    const textLayout = textLayoutRef.current;
    const scatteredNodes = scatteredImagesRef.current.filter(Boolean) as HTMLDivElement[];

    if (!section || !bg || !heroImage || !textLayout) {
      return;
    }

    const ctx = gsap.context(() => {
      // 手機版保持自然直式排版，避免 ScrollTrigger pin 造成小螢幕體驗不穩。
      if (window.innerWidth < 768) {
        gsap.set([bg, heroImage, textLayout, scatteredNodes], {
          clearProps: 'all',
        });
        return;
      }

      // 初始狀態：背景延續黑洞氛圍，散落圖留在畫面各處，主圖也是散落物件之一。
      gsap.set(bg, {
        backgroundColor: '#050505',
      });
      gsap.set(scatteredNodes, {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        transformOrigin: '50% 50%',
      });
      gsap.set(heroImage, {
        borderRadius: '2px',
        height: '38vh',
        left: '31%',
        top: '34%',
        width: '31vw',
        xPercent: -50,
        yPercent: -50,
      });
      gsap.set(textLayout, {
        autoAlpha: 0,
        x: -50,
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        // 背景轉色：與所有動作同時開始，讓黑洞後的空間慢慢變成 editorial 米白底。
        .to(
          bg,
          {
            backgroundColor: '#efeee9',
            duration: 1,
            ease: 'none',
          },
          0,
        )
        // 散落圖片淡出：不等待主圖，從一滾動就同步退場。
        .to(
          scatteredNodes,
          {
            autoAlpha: 0,
            duration: 0.54,
            ease: 'none',
            scale: 0.82,
            stagger: 0.025,
            y: -50,
          },
          0,
        )
        // 主圖歸位：editorial-01 從原本散落位置立刻滑向右側版面主圖。
        .to(
          heroImage,
          {
            duration: 1,
            ease: 'power2.inOut',
            height: '80vh',
            left: '40%',
            top: '10%',
            width: '55vw',
            xPercent: 0,
            yPercent: 0,
          },
          '<',
        )
        // 文字進場：主圖移動到中後段時，左側排版滑入完成雙欄構圖。
        .to(
          textLayout,
          {
            autoAlpha: 1,
            duration: 0.5,
            ease: 'power2.out',
            x: 0,
          },
          0.42,
        );
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[300vh] bg-[#050505] text-[#111111]"
      aria-label="APSIS editorial index"
    >
      <div
        ref={bgRef}
        className="sticky top-0 h-screen overflow-hidden bg-[#050505]"
      >
        <div className="absolute left-5 right-5 top-4 z-40 grid grid-cols-2 text-[10px] font-light uppercase tracking-[0.12em] text-white mix-blend-difference sm:left-8 sm:right-8 sm:grid-cols-5">
          <p className="font-medium tracking-[-0.04em] normal-case sm:col-span-1">
            APSIS
          </p>
          <p className="hidden sm:block">1. Editorial</p>
          <p className="hidden sm:block">2. Orbit</p>
          <p className="hidden sm:block">3. Movement</p>
          <p className="justify-self-end">Index 01</p>
        </div>

        {scatteredImages.map((image, index) => (
          <div
            key={image.src}
            ref={(node) => {
              scatteredImagesRef.current[index] = node;
            }}
            className={[
              'absolute z-10 hidden overflow-hidden bg-[#d9d5cb] sm:block',
              'shadow-[0_18px_70px_rgba(0,0,0,0.22)]',
              image.className,
            ].join(' ')}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="24vw"
              className="object-cover saturate-[0.84]"
            />
          </div>
        ))}

        <div
          ref={textLayoutRef}
          className="absolute bottom-[10vh] left-5 z-30 max-w-[42rem] pr-8 sm:left-8 md:bottom-[13vh] md:max-w-[36vw]"
        >
          <p className="mb-10 text-[10px] font-light text-[#111111]/34">1.</p>
          <p className="mb-3 text-[clamp(1.7rem,3.2vw,3.9rem)] font-light leading-[0.9] tracking-[-0.075em] text-[#111111]/30">
            APSIS observes —
          </p>
          <h2 className="text-[clamp(2.35rem,4.8vw,5.9rem)] font-light leading-[0.9] tracking-[-0.08em] text-[#111111]">
            Human motion arranged as a living field.
          </h2>
          <div className="mt-9 grid max-w-[430px] gap-5 text-sm font-light leading-relaxed tracking-[0.01em] text-[#111111]/58 sm:grid-cols-[0.28fr_1fr]">
            <p className="text-[10px] text-[#111111]/32">2.</p>
            <p>
              Fabric, distance, pressure, and speed are composed like orbital
              data: quiet, tactile, and slightly unstable.
            </p>
          </div>
        </div>

        <div
          ref={heroImageRef}
          className="absolute left-1/2 top-[22vh] z-20 h-[52vh] w-[86vw] -translate-x-1/2 overflow-hidden bg-[#d9d5cb] shadow-[0_30px_90px_rgba(0,0,0,0.24)] md:left-[31%] md:top-[34%] md:h-[38vh] md:w-[31vw]"
        >
          <Image
            src="/images/editorials/editorial-01.jpg"
            alt="APSIS editorial one"
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 92vw"
            className="object-cover saturate-[0.92]"
          />
          <div className="pointer-events-none absolute inset-0 bg-[#efeee9]/[0.04] mix-blend-screen" />
        </div>

        <div className="pointer-events-none absolute bottom-5 left-5 right-5 z-40 flex items-center justify-between text-[9px] font-light uppercase tracking-[0.3em] text-white mix-blend-difference sm:left-8 sm:right-8">
          <span>APSIS EDITORIAL FIELD</span>
          <span>SCROLL TO ALIGN</span>
        </div>
      </div>
    </section>
  );
}
