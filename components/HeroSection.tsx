'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

type HeroSectionProps = {
  isReady: boolean;
  isExiting: boolean;
  onEnded: () => void;
  onExitComplete: () => void;
};

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
      className="fixed inset-0 z-40 flex h-screen items-end overflow-hidden bg-black text-white"
      initial={false}
      animate={{ x: isExiting ? '100%' : '0%' }}
      transition={{ duration: 1.45, ease: 'easeInOut' }}
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
        animate={{ scale: isExiting ? 1.06 : 1 }}
        transition={{ duration: 1.45, ease: 'easeInOut' }}
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
        animate={{ opacity: isExiting ? 0.4 : 0.3 }}
        transition={{ duration: 1.45, ease: 'easeInOut' }}
      />

      <motion.div
        className="relative z-10 w-full px-8 pb-10 sm:px-12 sm:pb-12 md:px-16 md:pb-16 lg:px-24 lg:pb-24"
        initial={false}
        animate={{
          opacity: isReady && !isExiting ? 1 : 0,
          y: isExiting ? -24 : 0,
        }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
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
