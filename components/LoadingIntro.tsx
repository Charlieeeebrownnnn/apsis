'use client';

import { motion } from 'framer-motion';

type LoadingIntroProps = {
  className?: string;
  onEnded?: () => void;
};

export default function LoadingIntro({
  className = '',
  onEnded,
}: LoadingIntroProps) {
  return (
    <motion.div
      className={['fixed inset-0 z-50 overflow-hidden bg-black', className].join(
        ' ',
      )}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      <video
        className="h-full w-full object-cover"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={onEnded}
      >
        <source src="/videos/loading.mp4" type="video/mp4" />
      </video>

      <div className="pointer-events-none absolute inset-0 bg-black/8" />
    </motion.div>
  );
}
