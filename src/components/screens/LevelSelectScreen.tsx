import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Lock, Play } from 'lucide-react';
import { CATEGORIES_META } from '../../data/curriculum';
import { DifficultyLevel, GameCategory, MascotMood, PlayerProgress } from '../../types/game';
import { isDifficultyUnlocked } from '../../utils/gameLogic';
import { Mascot } from '../Mascot';

interface LevelSelectScreenProps {
  category: GameCategory;
  progress: PlayerProgress;
  onSelectLevel: (level: DifficultyLevel) => void;
  onBack: () => void;
}

const LEVELS_META: Array<{
  level: DifficultyLevel;
  title: string;
  subtitle: string;
  details: string[];
  accentBg: string;
  borderHex: string;
}> = [
  {
    level: DifficultyLevel.PEMULA,
    title: 'LEVEL 1 – PEMULA',
    subtitle: 'Langkah awal bermain dan mengenal dasar',
    details: [
      'Mengenal gambar dan huruf dengan jelas',
      'Kata sederhana 2–3 huruf & kata BUKU',
      'Petunjuk selalu tersedia setiap saat',
    ],
    accentBg: 'bg-emerald-50',
    borderHex: '#6EE7B7',
  },
  {
    level: DifficultyLevel.MENENGAH,
    title: 'LEVEL 2 – MENENGAH',
    subtitle: 'Tantangan membaca & berhitung lebih seru',
    details: [
      'Menyusun kata 4–5 huruf (BOLA, MEJA, SUSU)',
      'Menghitung benda & mencocokkan gambar',
      'Terbuka setelah menyelesaikan Level 1',
    ],
    accentBg: 'bg-sky-50',
    borderHex: '#7DD3FC',
  },
  {
    level: DifficultyLevel.MAHIR,
    title: 'LEVEL 3 – MAHIR',
    subtitle: 'Tantangan juara cilik tanpa petunjuk',
    details: [
      'Kata panjang 5–8 huruf (SEPATU, PELANGI)',
      'Tebak kata berdasarkan suara',
      'Terbuka setelah menyelesaikan Level 2',
    ],
    accentBg: 'bg-violet-50',
    borderHex: '#C4B5FD',
  },
];

export const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({
  category,
  progress,
  onSelectLevel,
  onBack,
}) => {
  const catMeta = CATEGORIES_META.find((c) => c.id === category) ?? CATEGORIES_META[0];
  const completed = progress.categoryStats[category]?.completedLevels ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Kategori</span>
        </button>

        <Mascot
          mood={MascotMood.HAPPY}
          message={`Pilih level untuk permainan ${catMeta.title}!`}
          size="sm"
        />
      </div>

      <div className="space-y-1">
        <p className="text-sm font-bold" style={{ color: catMeta.accentHex }}>
          {catMeta.title}
        </p>
        <h1 className="font-display text-3xl font-extrabold text-slate-900">
          Pilih Tingkat Kesulitan
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {LEVELS_META.map((item) => {
          const unlocked = isDifficultyUnlocked(progress, category, item.level);
          const isDone = completed.includes(item.level);

          return (
            <motion.div
              key={item.level}
              whileHover={unlocked ? { y: -4 } : undefined}
              className={`rounded-3xl p-6 border-2 flex flex-col justify-between gap-5 shadow-sm ${
                unlocked ? item.accentBg : 'bg-slate-100 opacity-80'
              }`}
              style={{ borderColor: unlocked ? item.borderHex : '#CBD5E1' }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-extrabold text-slate-700">
                    {item.title}
                  </span>
                  {isDone ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                      Selesai
                    </span>
                  ) : !unlocked ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500">
                      <Lock className="w-4 h-4" />
                      Terkunci
                    </span>
                  ) : null}
                </div>

                <p className="font-display text-lg font-bold text-slate-900">
                  {item.subtitle}
                </p>

                <ul className="space-y-2 text-sm text-slate-700 font-medium">
                  {item.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span aria-hidden="true">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                disabled={!unlocked}
                onClick={() => onSelectLevel(item.level)}
                className={`w-full py-3.5 rounded-2xl font-display font-extrabold text-base flex items-center justify-center gap-2 transition-all ${
                  unlocked
                    ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-xs cursor-pointer active:scale-95'
                    : 'bg-slate-300 text-slate-600 cursor-not-allowed'
                }`}
              >
                {unlocked ? (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Main Level {item.level}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Selesaikan Level {item.level - 1}</span>
                  </>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
