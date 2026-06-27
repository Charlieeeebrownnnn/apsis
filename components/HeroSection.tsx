'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

type HeroSectionProps = {
  isReady: boolean;
  isExiting: boolean;
  onEnded: () => void;
  onExitComplete: () => void;
};

const heroExitTransition = {
  duration: 2.25,
  ease: [0.83, 0, 0.17, 1],
} as const;

export default function HeroSection({
  isReady,
  isExiting,
  onEnded,
  onExitComplete,
}: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !isReady || hasStartedRef.current) {
      return;
    }

    video.currentTime = 0;
    void video.play();
    hasStartedRef.current = true;
  }, [isReady]);

  const handleEnded = () => {
    videoRef.current?.pause();
    onEnded();
  };

  return (
    <motion.section
      className="fixed inset-0 z-40 flex h-screen items-end overflow-hidden bg-black text-white will-change-transform"
      initial={false}
      animate={{
        borderBottomLeftRadius: isExiting ? 34 : 0,
        borderTopLeftRadius: isExiting ? 34 : 0,
        boxShadow: isExiting
          ? '-40px 0 90px rgba(5,5,4,0.28)'
          : '0 0 0 rgba(5,5,4,0)',
        x: isExiting ? '108%' : '0%',
      }}
      transition={heroExitTransition}
      onAnimationComplete={() => {
        if (isExiting) {
          onExitComplete();
        }
      }}
      aria-label="APSIS hero film"
    >
      <motion.div
        className="absolute inset-0 origin-center"
        initial={false}
        animate={{
          filter: isExiting ? 'blur(3px)' : 'blur(0px)',
          scale: isExiting ? 1.11 : 1,
          x: isExiting ? '-7%' : '0%',
        }}
        transition={heroExitTransition}
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay={isReady}
          muted
          playsInline
          preload="auto"
          onEnded={handleEnded}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      </motion.div>

      <motion.div
        className="absolute inset-0 bg-black"
        initial={false}
        animate={{ opacity: isExiting ? 0.18 : 0.3 }}
        transition={heroExitTransition}
      />

      <motion.div
        className="pointer-events-none absolute inset-y-0 left-0 w-[18vw] bg-gradient-to-r from-black/48 via-black/16 to-transparent"
        initial={false}
        animate={{ opacity: isExiting ? 1 : 0 }}
        transition={{ duration: 1.55, ease: 'easeInOut' }}
      />

      <motion.div
        className="pointer-events-none absolute inset-0 bg-[#efeee9]"
        initial={false}
        animate={{ opacity: isExiting ? [0, 0.08, 0] : 0 }}
        transition={{ duration: 1.65, ease: [0.83, 0, 0.17, 1] }}
      />

      <motion.div
        className="relative z-10 w-full px-8 pb-10 sm:px-12 sm:pb-12 md:px-16 md:pb-16 lg:px-24 lg:pb-24"
        initial={false}
        animate={{
          opacity: isReady && !isExiting ? 1 : 0,
          y: isExiting ? -38 : 0,
          filter: isExiting ? 'blur(8px)' : 'blur(0px)',
        }}
        transition={{ duration: isExiting ? 0.72 : 0.9, ease: 'easeInOut' }}
      >
        <div className="max-w-lg space-y-3">
          <p className="text-3xl font-extralight tracking-[0.42em] uppercase sm:text-4xl md:text-5xl">
            APSIS
          </p>
          <div className="space-y-1 text-sm font-extralight tracking-[0.16em] text-white/88 uppercase sm:text-base md:text-lg">
            <p>Human Motion</p>
            <p>Observed Like Stars</p>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
