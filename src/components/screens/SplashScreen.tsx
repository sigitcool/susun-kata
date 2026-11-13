import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Play, Sparkles } from 'lucide-react';
import { MascotMood } from '../../types/game';
import { Mascot } from '../Mascot';

interface SplashScreenProps {
  childName: string;
  onStart: () => void;
  onOpenParent: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  childName,
  onStart,
  onOpenParent,
}) => {
  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 py-10 bg-sky-100">
      {/* Illustrated Storybook Background */}
      <img
        src="/src/assets/images/splash_hero_art_1794531682668.jpg"
        alt="Ilustrasi langit pastel, awan, pelangi, dan bukit hijau Cerdas bersama Revan Utomo"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50/60 via-white/35 to-emerald-50/75" />

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 max-w-2xl w-full bg-white/95 border-4 border-white rounded-[2rem] shadow-xl p-7 md:p-10 text-center space-y-6"
      >
        <div className="flex justify-center">
          <Mascot mood={MascotMood.CHEERING} size="lg" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-sky-700">
            Cerdas bersama Revan Utomo
          </h1>
          <p className="font-display text-lg md:text-xl font-bold text-amber-600">
            Dunia Bermain dan Belajar Anak
          </p>
          <p className="text-slate-600 text-base md:text-lg font-medium max-w-md mx-auto">
            &ldquo;Bermain, Belajar, dan Tumbuh Bersama&rdquo;
          </p>
        </div>

        <div className="bg-sky-50/80 border border-sky-100 rounded-2xl px-5 py-3 inline-flex items-center gap-2 text-sm font-semibold text-sky-900">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Halo {childName}! Kiko sudah siap menemanimu bermain hari ini.</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          <motion.button
            type="button"
            data-start="true"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={onStart}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 border-b-4 border-emerald-700 text-white font-display text-xl font-extrabold shadow-md cursor-pointer"
          >
            <Play className="w-6 h-6 fill-white" />
            <span>Mulai Bermain</span>
          </motion.button>

          <button
            type="button"
            onClick={onOpenParent}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 font-bold text-sm cursor-pointer"
          >
            <GraduationCap className="w-5 h-5" />
            <span>Orang Tua / Guru</span>
          </button>
        </div>
      </motion.section>
    </main>
  );
};
