import React from 'react';
import { motion } from 'motion/react';
import { MascotMood } from '../types/game';

interface MascotProps {
  mood?: MascotMood;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const Mascot: React.FC<MascotProps> = ({
  mood = MascotMood.HAPPY,
  message,
  size = 'md',
  onClick,
}) => {
  const dimensions =
    size === 'sm' ? 'w-16 h-16' : size === 'lg' ? 'w-32 h-32 md:w-36 md:h-36' : 'w-24 h-24';

  const bodyBounce =
    mood === MascotMood.CHEERING
      ? { y: [0, -10, 0], rotate: [0, -4, 4, 0] }
      : mood === MascotMood.SPEAKING
        ? { scale: [1, 1.04, 1] }
        : { y: [0, -4, 0] };

  return (
    <div className="flex items-center gap-3 md:gap-4">
      <motion.button
        type="button"
        onClick={onClick}
        aria-label="Kiko si Kelinci Ceria"
        animate={bodyBounce}
        transition={{
          duration: mood === MascotMood.CHEERING ? 0.8 : 2.6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileTap={{ scale: 0.92 }}
        className={`${dimensions} shrink-0 relative focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 rounded-full cursor-pointer`}
      >
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-sm" aria-hidden="true">
          {/* Soft pastel halo */}
          <circle cx="60" cy="64" r="50" fill="#E0F2FE" />
          {/* Left & Right Rabbit Ears */}
          <ellipse cx="42" cy="28" rx="11" ry="24" transform="rotate(-10 42 28)" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" />
          <ellipse cx="42" cy="29" rx="5.5" ry="15" transform="rotate(-10 42 29)" fill="#F9A8D4" />
          <ellipse cx="78" cy="28" rx="11" ry="24" transform="rotate(10 78 28)" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" />
          <ellipse cx="78" cy="29" rx="5.5" ry="15" transform="rotate(10 78 29)" fill="#F9A8D4" />

          {/* Shirt / Collar */}
          <path d="M 30 98 C 32 82, 88 82, 90 98 Z" fill="#FACC15" stroke="#0284C7" strokeWidth="3" />
          <circle cx="60" cy="94" r="5" fill="#F472B6" />

          {/* Head */}
          <ellipse cx="60" cy="64" rx="33" ry="29" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" />

          {/* Rosy Cheeks */}
          <ellipse cx="38" cy="70" rx="6" ry="3.5" fill="#F9A8D4" opacity="0.75" />
          <ellipse cx="82" cy="70" rx="6" ry="3.5" fill="#F9A8D4" opacity="0.75" />

          {/* Eyes */}
          {mood === MascotMood.CHEERING ? (
            <>
              <path d="M 41 60 Q 47 53 53 60" fill="none" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 67 60 Q 73 53 79 60" fill="none" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="47" cy="59" r="5" fill="#1E293B" />
              <circle cx="48.5" cy="57.2" r="1.8" fill="#FFFFFF" />
              <circle cx="73" cy="59" r="5" fill="#1E293B" />
              <circle cx="74.5" cy="57.2" r="1.8" fill="#FFFFFF" />
            </>
          )}

          {/* Cute Pink Nose */}
          <ellipse cx="60" cy="66" rx="4" ry="2.8" fill="#F472B6" />

          {/* Mouth based on mood */}
          {mood === MascotMood.CHEERING ? (
            <path d="M 51 72 Q 60 82 69 72 Z" fill="#FB7185" stroke="#1E293B" strokeWidth="2.4" />
          ) : mood === MascotMood.SPEAKING ? (
            <ellipse cx="60" cy="74" rx="5" ry="4" fill="#FB7185" stroke="#1E293B" strokeWidth="2.2" />
          ) : mood === MascotMood.ENCOURAGING ? (
            <path d="M 53 73 Q 60 77 67 73" fill="none" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" />
          ) : (
            <path d="M 52 72 Q 60 79 68 72" fill="none" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" />
          )}

          {/* Sparkles when cheering */}
          {mood === MascotMood.CHEERING && (
            <>
              <path d="M 18 46 L 21 38 L 24 46 L 32 49 L 24 52 L 21 60 L 18 52 L 10 49 Z" fill="#FACC15" />
              <path d="M 98 40 L 100 34 L 102 40 L 108 42 L 102 44 L 100 50 L 98 44 L 92 42 Z" fill="#34D399" />
            </>
          )}
        </svg>
      </motion.button>

      {message && (
        <div
          role="status"
          aria-live="polite"
          className="relative bg-white border-2 border-sky-200 rounded-2xl px-4 py-2.5 shadow-sm max-w-md"
        >
          <p className="text-sm md:text-base font-semibold text-slate-800 leading-snug">
            {message}
          </p>
        </div>
      )}
    </div>
  );
};
