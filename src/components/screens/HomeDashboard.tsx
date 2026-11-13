import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Award, Play, Star, Volume2 } from 'lucide-react';
import { BADGES_DATA, CATEGORIES_META } from '../../data/curriculum';
import { DifficultyLevel, GameCategory, MascotMood, PlayerProgress, ScreenId } from '../../types/game';
import { audioEngine } from '../../utils/audioEngine';
import { calculateLevelFromXP } from '../../utils/gameLogic';
import { AvatarIcon } from '../AvatarIcon';
import { ItemIllustration } from '../illustrations/ItemIllustration';
import { Mascot } from '../Mascot';

interface HomeDashboardProps {
  progress: PlayerProgress;
  onStartQuickPlay: (category: GameCategory, level: DifficultyLevel) => void;
  onSelectCategory: (category: GameCategory) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  progress,
  onStartQuickPlay,
  onSelectCategory,
  onNavigate,
}) => {
  const levelInfo = calculateLevelFromXP(progress.xp);
  const lastCatMeta = CATEGORIES_META.find((c) => c.id === progress.lastPlayedCategory);

  return (
    <div className="space-y-8">
      {/* Child Profile & Hero Spotlight */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Child Profile Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl border-2 border-sky-100 p-6 shadow-sm flex flex-col justify-between gap-5">
          <div className="flex items-center gap-4">
            <AvatarIcon avatar={progress.profile.avatar} size="lg" />
            <div>
              <p className="text-xs font-semibold text-slate-500">Halo Sahabat Cerdas</p>
              <h1 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900">
                {progress.profile.name}
              </h1>
              <p className="text-sm font-bold text-sky-700">
                Level {levelInfo.level} · {levelInfo.title}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 tabular-nums">
              <span>Pengalaman (XP)</span>
              <span>
                {levelInfo.currentLevelXp} / {levelInfo.nextLevelXp} XP
              </span>
            </div>
            <div className="w-full h-3.5 bg-sky-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(8, levelInfo.progressPercent)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-1">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center">
              <p className="font-display text-2xl font-extrabold text-amber-700 tabular-nums">
                {progress.totalStars}
              </p>
              <p className="text-xs font-semibold text-amber-900">Bintang</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center">
              <p className="font-display text-2xl font-extrabold text-emerald-700 tabular-nums">
                {progress.totalGamesPlayed}
              </p>
              <p className="text-xs font-semibold text-emerald-900">Permainan</p>
            </div>
            <div className="bg-violet-50 border border-violet-200 rounded-2xl p-3 text-center">
              <p className="font-display text-2xl font-extrabold text-violet-700 tabular-nums">
                {progress.unlockedBadges.length}/{BADGES_DATA.length}
              </p>
              <p className="text-xs font-semibold text-violet-900">Lencana</p>
            </div>
          </div>
        </div>

        {/* Right: Featured Primary Game Spotlight (Susun Kata) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-3xl p-6 md:p-8 text-white shadow-md flex flex-col justify-between gap-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-3 max-w-md">
              <p className="text-xs font-bold uppercase tracking-wider text-sky-100">
                Permainan Utama · Susun Kata
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold leading-tight">
                Ayo Susun Huruf Menjadi Kata!
              </h2>
              <p className="text-sky-50 text-sm md:text-base font-medium">
                Dengarkan suara kata seperti BUKU, BOLA, dan MEJA, lalu susun hurufnya bersama Kiko!
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onStartQuickPlay(GameCategory.SUSUN_KATA, DifficultyLevel.PEMULA)}
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 border-b-4 border-amber-600 text-slate-900 font-display text-lg font-extrabold cursor-pointer shadow-sm"
                >
                  <Play className="w-5 h-5 fill-slate-900" />
                  <span>Mulai Bermain</span>
                </motion.button>

                <button
                  type="button"
                  onClick={() =>
                    audioEngine.speak(
                      `Halo ${progress.profile.name}! Ayo kita bermain susun huruf menjadi kata bersama Kiko!`
                    )
                  }
                  aria-label="Dengarkan sapaan Kiko"
                  className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm cursor-pointer"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>Sapa Kiko</span>
                </button>
              </div>
            </div>

            <div className="bg-white/95 rounded-3xl p-4 shadow-sm self-center">
              <ItemIllustration itemKey="buku" size="lg" />
            </div>
          </div>

          <Mascot
            mood={MascotMood.HAPPY}
            message="Pilih permainan di bawah atau tekan Mulai Bermain untuk menyusun kata!"
            size="sm"
          />
        </div>
      </section>

      {/* 8 Categories Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-extrabold text-slate-900">
            Kategori Permainan
          </h2>
          <button
            type="button"
            onClick={() => onNavigate(ScreenId.CATEGORIES)}
            className="flex items-center gap-1 text-sm font-bold text-sky-700 hover:text-sky-800 cursor-pointer"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES_META.map((cat) => {
            const stat = progress.categoryStats[cat.id];
            return (
              <motion.button
                key={cat.id}
                type="button"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  audioEngine.playTileTap();
                  onSelectCategory(cat.id);
                }}
                className="text-left rounded-3xl p-5 border-2 transition-shadow hover:shadow-md cursor-pointer flex flex-col justify-between gap-4"
                style={{
                  backgroundColor: cat.surfaceHex,
                  borderColor: cat.borderHex,
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="bg-white rounded-2xl p-2.5 shadow-xs">
                    <ItemIllustration itemKey={cat.illustrationKey} size="sm" />
                  </div>
                  <span
                    className="text-xs font-bold tabular-nums"
                    style={{ color: cat.accentHex }}
                  >
                    {cat.badgeText}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-lg font-extrabold text-slate-900">
                    {cat.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/60 text-xs font-bold text-slate-700 tabular-nums">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    {stat?.starsEarned ?? 0} Bintang
                  </span>
                  <span>{stat?.gamesPlayed ?? 0}x Main</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Last Played & Achievements Preview */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border-2 border-sky-100 p-6 shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-sky-700">Permainan Terakhir</p>
            <h3 className="font-display text-xl font-extrabold text-slate-900">
              {lastCatMeta?.title ?? 'Susun Kata'}
            </h3>
            <p className="text-sm font-medium text-slate-600">
              Level {progress.lastPlayedLevel ?? 1} · Lanjutkan latihan serumu!
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onStartQuickPlay(
                progress.lastPlayedCategory ?? GameCategory.SUSUN_KATA,
                progress.lastPlayedLevel ?? DifficultyLevel.PEMULA
              )
            }
            className="px-5 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shrink-0 cursor-pointer"
          >
            Lanjutkan
          </button>
        </div>

        <div className="bg-white rounded-3xl border-2 border-amber-100 p-6 shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-amber-700">Pencapaian Anak</p>
            <h3 className="font-display text-xl font-extrabold text-slate-900">
              Koleksi Bintang & Piala
            </h3>
            <p className="text-sm font-medium text-slate-600 tabular-nums">
              {progress.unlockedBadges.length} dari {BADGES_DATA.length} lencana sudah terbuka
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate(ScreenId.ACHIEVEMENTS)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-sm shrink-0 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>Lihat Piala</span>
          </button>
        </div>
      </section>
    </div>
  );
};
