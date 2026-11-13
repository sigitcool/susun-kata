import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Star, Volume2 } from 'lucide-react';
import { CATEGORIES_META } from '../../data/curriculum';
import { GameCategory, MascotMood, PlayerProgress } from '../../types/game';
import { audioEngine } from '../../utils/audioEngine';
import { ItemIllustration } from '../illustrations/ItemIllustration';
import { Mascot } from '../Mascot';

interface CategorySelectScreenProps {
  progress: PlayerProgress;
  onSelectCategory: (category: GameCategory) => void;
  onBack: () => void;
}

export const CategorySelectScreen: React.FC<CategorySelectScreenProps> = ({
  progress,
  onSelectCategory,
  onBack,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <Mascot
          mood={MascotMood.HAPPY}
          message="Pilih permainan yang ingin kamu mainkan hari ini!"
          size="sm"
        />
      </div>

      <div className="space-y-1">
        <h1 className="font-display text-3xl font-extrabold text-slate-900">
          Pilih Kategori Permainan
        </h1>
        <p className="text-slate-600 font-medium">
          Semua permainan dilengkapi suara bahasa Indonesia yang ramah anak.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {CATEGORIES_META.map((cat) => {
          const stat = progress.categoryStats[cat.id];
          return (
            <motion.div
              key={cat.id}
              whileHover={{ y: -4 }}
              className="rounded-3xl p-5 border-2 flex flex-col justify-between gap-4 shadow-xs"
              style={{ backgroundColor: cat.surfaceHex, borderColor: cat.borderHex }}
            >
              <div className="flex items-start justify-between">
                <div className="bg-white rounded-2xl p-3 shadow-xs">
                  <ItemIllustration itemKey={cat.illustrationKey} size="md" />
                </div>
                <button
                  type="button"
                  onClick={() => audioEngine.speak(`${cat.title}. ${cat.subtitle}`)}
                  aria-label={`Dengarkan info ${cat.title}`}
                  className="p-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <p className="text-xs font-bold mb-0.5" style={{ color: cat.accentHex }}>
                  {cat.badgeText}
                </p>
                <h2 className="font-display text-xl font-extrabold text-slate-900">
                  {cat.title}
                </h2>
                <p className="text-sm font-medium text-slate-600 mt-1">
                  {cat.subtitle}
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-white/60">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 tabular-nums">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                    {stat?.starsEarned ?? 0} Bintang
                  </span>
                  <span>{stat?.completedLevels.length ?? 0}/3 Level</span>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className="w-full py-3 rounded-2xl text-white font-bold text-sm shadow-xs cursor-pointer transition-transform active:scale-95"
                  style={{ backgroundColor: cat.accentHex }}
                >
                  Pilih {cat.title}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
