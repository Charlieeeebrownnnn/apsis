'use client';

import { motion } from 'framer-motion';

type LoadingIntroProps = {
  className?: string;
  isExiting?: boolean;
  onEnded?: () => void;
  onExitComplete?: () => void;
};

const orbitalBallPath = {
  cx: [
    424, 438, 451, 456, 448, 430, 402, 366, 330, 302, 276, 250, 222, 188, 152, 112,
    78, 62, 72, 104, 142, 184, 226, 270, 314, 354, 390, 414, 424,
  ],
  cy: [
    184, 168, 145, 122, 102, 94, 91, 92, 104, 124, 154, 186, 218, 250, 272, 282,
    282, 270, 244, 218, 196, 186, 188, 196, 210, 214, 206, 194, 184,
  ],
};

export default function LoadingIntro({
  className = '',
  isExiting = false,
  onEnded,
  onExitComplete,
}: LoadingIntroProps) {
  return (
    <motion.div
      className={[
        'fixed inset-0 z-50 overflow-hidden bg-[#d9d5cd] text-[#6f6d68]',
        className,
      ].join(' ')}
      initial={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
      animate={{
        clipPath: isExiting ? 'inset(0% 0% 100% 0%)' : 'inset(0% 0% 0% 0%)',
        opacity: isExiting ? 0.18 : 1,
      }}
      transition={{ duration: 1.35, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => {
        if (isExiting) {
          onExitComplete?.();
        }
      }}
    >
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.56),transparent_36%),radial-gradient(circle_at_50%_72%,rgba(92,86,76,0.14),transparent_54%),linear-gradient(135deg,rgba(255,255,255,0.18),rgba(17,17,17,0.055))]"
        animate={{ opacity: isExiting ? 0.18 : 1, scale: isExiting ? 1.08 : 1 }}
        transition={{ duration: 1.35, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="absolute inset-0 opacity-[0.34] [background-image:radial-gradient(rgba(47,45,40,0.14)_0.55px,transparent_0.55px)] [background-size:3px_3px]"
        animate={{ opacity: isExiting ? 0 : 0.34 }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(84,78,69,0.11))]"
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 1.05, ease: 'easeInOut' }}
      />

      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-center px-6"
        initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
        animate={{
          opacity: isExiting ? 0 : 1,
          y: isExiting ? -28 : 0,
          filter: isExiting ? 'blur(14px)' : 'blur(0px)',
          scale: isExiting ? 0.96 : 1,
        }}
        transition={{
          duration: isExiting ? 0.95 : 1.1,
          ease: isExiting ? [0.76, 0, 0.24, 1] : [0.16, 1, 0.3, 1],
        }}
      >
        <motion.svg
          viewBox="0 0 532 390"
          className="h-[min(38vh,310px)] w-[min(70vw,520px)] overflow-visible"
          aria-label="APSIS orbital placeholder mark"
          initial="hidden"
          animate="visible"
        >
          <defs>
            <filter id="apsis-emboss" x="-45%" y="-45%" width="190%" height="190%">
              <feDropShadow dx="-1.2" dy="-1.1" stdDeviation="0.7" floodColor="#ffffff" floodOpacity="0.92" />
              <feDropShadow dx="1.2" dy="2.8" stdDeviation="1.8" floodColor="#59554d" floodOpacity="0.28" />
              <feDropShadow dx="0" dy="12" stdDeviation="8" floodColor="#5d5a54" floodOpacity="0.16" />
            </filter>
            <linearGradient id="apsis-stroke" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#fdfaf1" />
              <stop offset="42%" stopColor="#dfdad0" />
              <stop offset="100%" stopColor="#fffdf7" />
            </linearGradient>
          </defs>

          <motion.path
            d="M63 283 C37 255 73 205 134 179 C190 155 236 170 285 198 C316 216 343 217 372 196"
            pathLength="1"
            fill="none"
            stroke="url(#apsis-stroke)"
            strokeWidth="7.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#apsis-emboss)"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: { pathLength: 1, opacity: 1 },
            }}
            transition={{ duration: 2.05, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.path
            d="M137 323 C188 279 255 238 336 194 C363 180 388 164 407 149"
            pathLength="1"
            fill="none"
            stroke="url(#apsis-stroke)"
            strokeWidth="6.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.96"
            filter="url(#apsis-emboss)"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: { pathLength: 1, opacity: 0.96 },
            }}
            transition={{ duration: 1.95, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.path
            d="M157 333 L260 60 L366 334"
            pathLength="1"
            fill="none"
            stroke="url(#apsis-stroke)"
            strokeWidth="8.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#apsis-emboss)"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: { pathLength: 1, opacity: 1 },
            }}
            transition={{ duration: 1.82, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.path
            d="M314 115 C369 82 434 78 456 112 C476 143 450 166 429 187"
            pathLength="1"
            fill="none"
            stroke="url(#apsis-stroke)"
            strokeWidth="6.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#apsis-emboss)"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: { pathLength: 1, opacity: 0.98 },
            }}
            transition={{ duration: 1.48, delay: 0.66, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.path
            d="M328 245 C361 224 394 201 421 184"
            pathLength="1"
            fill="none"
            stroke="url(#apsis-stroke)"
            strokeWidth="6.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#apsis-emboss)"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: { pathLength: 1, opacity: 0.94 },
            }}
            transition={{ duration: 1.28, delay: 0.92, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.polygon
            points="260,128 302,247 220,247"
            fill="rgba(255,255,255,0.065)"
            stroke="rgba(255,255,255,0.34)"
            strokeWidth="1.2"
            initial={{ opacity: 0, scale: 0.96, transformOrigin: '260px 205px' }}
            animate={{ opacity: 0.72, scale: 1 }}
            transition={{ duration: 1.18, delay: 1.06, ease: [0.16, 1, 0.3, 1] }}
          />

          <motion.circle
            cx="424"
            cy="184"
            r="11.5"
            fill="#f8f4ea"
            opacity="0.58"
            filter="url(#apsis-emboss)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.58 }}
            transition={{ duration: 0.8, delay: 1.05 }}
          />

          <motion.circle
            r="9"
            fill="#f9f5eb"
            stroke="#d1cbc0"
            strokeWidth="1"
            filter="url(#apsis-emboss)"
            initial={{
              cx: orbitalBallPath.cx[0],
              cy: orbitalBallPath.cy[0],
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              cx: orbitalBallPath.cx,
              cy: orbitalBallPath.cy,
              opacity: 1,
              scale: [0.92, 1, 0.96, 1, 0.94, 1],
            }}
            transition={{
              cx: { duration: 5.4, repeat: Infinity, ease: 'linear' },
              cy: { duration: 5.4, repeat: Infinity, ease: 'linear' },
              opacity: { duration: 0.5, delay: 0.72 },
              scale: { duration: 5.4, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        </motion.svg>

        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[clamp(34px,4.4vw,64px)] font-light tracking-[0.48em] text-[#696761]">
            APSIS
          </p>
          <p className="mt-4 text-[10px] uppercase tracking-[0.58em] text-[#77746d]/78">
            Orbital Rebellion Est. 2026
          </p>
          <p className="mt-12 text-[10px] uppercase tracking-[0.55em] text-[#77746d]/70">
            Motion&nbsp;&nbsp;&middot;&nbsp;&nbsp;Utility&nbsp;&nbsp;&middot;&nbsp;&nbsp;Future
          </p>
        </motion.div>

        <motion.div
          className="mt-16 flex items-center gap-7 text-[10px] uppercase tracking-[0.45em] text-[#77746d]/76"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
        >
          <span>Loading</span>
          <span className="relative h-px w-36 overflow-hidden bg-[#77746d]/22">
            <motion.span
              className="absolute inset-y-0 left-0 w-full origin-left bg-[#77746d]/70"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 4.2, delay: 0.35, ease: [0.83, 0, 0.17, 1] }}
              onAnimationComplete={() => {
                if (!isExiting) {
                  onEnded?.();
                }
              }}
            />
          </span>
        </motion.div>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-0 bg-[#efeee9]"
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? [0, 0.22, 0] : 0 }}
        transition={{ duration: 1.05, ease: [0.76, 0, 0.24, 1] }}
      />
    </motion.div>
  );
}
