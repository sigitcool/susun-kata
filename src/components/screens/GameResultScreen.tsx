import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Award, Home, RotateCcw, Star } from 'lucide-react';
import { MascotMood, RoundResultSummary } from '../../types/game';
import { audioEngine } from '../../utils/audioEngine';
import { ConfettiCanvas } from '../ConfettiCanvas';
import { SparkleBurstCanvas } from '../SparkleBurstCanvas';
import { Mascot } from '../Mascot';

interface GameResultScreenProps {
  result: RoundResultSummary;
  childName: string;
  onReplay: () => void;
  onContinue: () => void;
  onGoHome: () => void;
}

export const GameResultScreen: React.FC<GameResultScreenProps> = ({
  result,
  childName,
  onReplay,
  onContinue,
  onGoHome,
}) => {
  const [sparkleKey, setSparkleKey] = useState(0);

  useEffect(() => {
    setSparkleKey((k) => k + 1);
    audioEngine.playCelebrationFanfare();
    const t = window.setTimeout(() => {
      audioEngine.speak(
        `Hebat sekali ${childName}! Kamu mendapatkan ${result.stars} bintang dan ${result.xpEarned} poin pengalaman!`
      );
    }, 350);
    return () => window.clearTimeout(t);
  }, [childName, result]);

  return (
    <div className="max-w-2xl mx-auto py-4">
      <ConfettiCanvas active={true} />
      <SparkleBurstCanvas burstKey={sparkleKey} intensity="celebration" originYRatio={0.38} />

      <motion.section
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2rem] border-2 border-amber-200 p-7 md:p-10 text-center shadow-lg space-y-6"
      >
        <div className="flex justify-center">
          <Mascot mood={MascotMood.CHEERING} size="lg" />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-bold text-emerald-700">Permainan Selesai</p>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900">
            Hebat Sekali, {childName}!
          </h1>
          <p className="text-slate-600 font-medium">{result.detailText}</p>
        </div>

        {/* Animated Stars */}
        <div className="flex items-center justify-center gap-4 py-2">
          {[1, 2, 3].map((idx) => {
            const earned = idx <= result.stars;
            return (
              <motion.div
                key={idx}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: idx * 0.14, type: 'spring', stiffness: 260 }}
              >
                <Star
                  className={`w-14 h-14 md:w-16 md:h-16 ${
                    earned
                      ? 'fill-amber-400 text-amber-500 drop-shadow-sm'
                      : 'fill-slate-100 text-slate-300'
                  }`}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Mastery Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="font-display text-2xl font-extrabold text-amber-700 tabular-nums">
              +{result.stars}
            </p>
            <p className="text-xs font-semibold text-amber-900">Bintang</p>
          </div>
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4">
            <p className="font-display text-2xl font-extrabold text-sky-700 tabular-nums">
              +{result.xpEarned}
            </p>
            <p className="text-xs font-semibold text-sky-900">Poin XP</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <p className="font-display text-2xl font-extrabold text-emerald-700 tabular-nums">
              {result.correctCount}
            </p>
            <p className="text-xs font-semibold text-emerald-900">Jawaban Benar</p>
          </div>
        </div>

        {result.unlockedNextLevel && (
          <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 text-sm font-bold text-violet-900">
            Selamat! Level {result.unlockedNextLevel} sudah terbuka untuk kategori ini!
          </div>
        )}

        {result.newlyUnlockedBadges.length > 0 && (
          <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4 space-y-2">
            <p className="text-sm font-extrabold text-pink-900 flex items-center justify-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>Lencana Baru Terbuka!</span>
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {result.newlyUnlockedBadges.map((b) => (
                <span key={b.id} className="text-sm font-bold text-pink-800">
                  {b.title}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onReplay}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-sky-100 hover:bg-sky-200 text-sky-900 font-display font-extrabold cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>ULANGI</span>
          </button>

          <button
            type="button"
            onClick={onContinue}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 border-b-4 border-emerald-700 text-white font-display font-extrabold cursor-pointer shadow-sm"
          >
            <span>LANJUTKAN</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onGoHome}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
          >
            <Home className="w-5 h-5" />
            <span>Beranda</span>
          </button>
        </div>
      </motion.section>
    </div>
  );
};
