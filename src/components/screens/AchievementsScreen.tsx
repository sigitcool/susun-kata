import React from 'react';
import { ArrowLeft, Award, BookOpen, Crown, Lock, Palette, PawPrint, Rocket, Sparkles, Star, Trophy } from 'lucide-react';
import { BADGES_DATA, CATEGORIES_META } from '../../data/curriculum';
import { BadgeDefinition, MascotMood, PlayerProgress } from '../../types/game';
import { calculateLevelFromXP } from '../../utils/gameLogic';
import { Mascot } from '../Mascot';

interface AchievementsScreenProps {
  progress: PlayerProgress;
  onBack: () => void;
}

const renderBadgeIcon = (type: BadgeDefinition['iconType']) => {
  switch (type) {
    case 'star':
      return <Star className="w-7 h-7" />;
    case 'trophy':
      return <Trophy className="w-7 h-7" />;
    case 'book':
      return <BookOpen className="w-7 h-7" />;
    case 'paw':
      return <PawPrint className="w-7 h-7" />;
    case 'sparkles':
      return <Sparkles className="w-7 h-7" />;
    case 'crown':
      return <Crown className="w-7 h-7" />;
    case 'palette':
      return <Palette className="w-7 h-7" />;
    case 'rocket':
      return <Rocket className="w-7 h-7" />;
  }
};

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({
  progress,
  onBack,
}) => {
  const levelInfo = calculateLevelFromXP(progress.xp);
  const completedCategoriesCount = CATEGORIES_META.filter(
    (c) => (progress.categoryStats[c.id]?.gamesPlayed ?? 0) > 0
  ).length;
  const totalUnlockedLevels = CATEGORIES_META.reduce(
    (sum, c) => sum + 1 + (progress.categoryStats[c.id]?.completedLevels.length ?? 0),
    0
  );

  return (
    <div className="space-y-7">
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
          mood={MascotMood.CHEERING}
          message={`Wah ${progress.profile.name}, kamu sudah mengumpulkan ${progress.totalStars} bintang!`}
          size="sm"
        />
      </div>

      <div className="space-y-1">
        <h1 className="font-display text-3xl font-extrabold text-slate-900">
          Koleksi Bintang & Piala
        </h1>
        <p className="text-slate-600 font-medium">
          Level {levelInfo.level} · {levelInfo.title} · {progress.xp} XP terkumpul
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-3xl border-2 border-amber-200 p-5">
          <p className="text-xs font-bold text-amber-700">Total Bintang</p>
          <p className="font-display text-3xl font-extrabold text-amber-600 tabular-nums mt-1">
            {progress.totalStars}
          </p>
        </div>
        <div className="bg-white rounded-3xl border-2 border-sky-200 p-5">
          <p className="text-xs font-bold text-sky-700">Total Permainan</p>
          <p className="font-display text-3xl font-extrabold text-sky-600 tabular-nums mt-1">
            {progress.totalGamesPlayed}
          </p>
        </div>
        <div className="bg-white rounded-3xl border-2 border-emerald-200 p-5">
          <p className="text-xs font-bold text-emerald-700">Jawaban Benar</p>
          <p className="font-display text-3xl font-extrabold text-emerald-600 tabular-nums mt-1">
            {progress.totalCorrectAnswers}
          </p>
        </div>
        <div className="bg-white rounded-3xl border-2 border-violet-200 p-5">
          <p className="text-xs font-bold text-violet-700">Level Terbuka</p>
          <p className="font-display text-3xl font-extrabold text-violet-600 tabular-nums mt-1">
            {totalUnlockedLevels}
          </p>
        </div>
        <div className="bg-white rounded-3xl border-2 border-pink-200 p-5 col-span-2 lg:col-span-1">
          <p className="text-xs font-bold text-pink-700">Kategori Dimainkan</p>
          <p className="font-display text-3xl font-extrabold text-pink-600 tabular-nums mt-1">
            {completedCategoriesCount}/{CATEGORIES_META.length}
          </p>
        </div>
      </div>

      {/* Badges & Trophies */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-600" />
          <h2 className="font-display text-2xl font-extrabold text-slate-900">
            Lencana & Piala Penghargaan
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BADGES_DATA.map((badge) => {
            const unlocked = progress.unlockedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`rounded-3xl border-2 p-5 flex flex-col gap-3 transition-all ${
                  unlocked
                    ? 'bg-white border-amber-200 shadow-sm'
                    : 'bg-slate-50 border-slate-200 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white"
                    style={{ backgroundColor: unlocked ? badge.colorHex : '#94A3B8' }}
                  >
                    {renderBadgeIcon(badge.iconType)}
                  </div>
                  {!unlocked && <Lock className="w-4 h-4 text-slate-400" />}
                </div>
                <div>
                  <h3 className="font-display text-lg font-extrabold text-slate-900">
                    {badge.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-600 mt-1">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Category Progress List */}
      <section className="bg-white rounded-3xl border-2 border-sky-100 p-6 shadow-sm space-y-4">
        <h2 className="font-display text-xl font-extrabold text-slate-900">
          Kemajuan Per Kategori
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CATEGORIES_META.map((cat) => {
            const stat = progress.categoryStats[cat.id];
            const completed = stat?.completedLevels.length ?? 0;
            return (
              <div
                key={cat.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <div>
                  <p className="font-display font-bold text-slate-900">{cat.title}</p>
                  <p className="text-xs font-semibold text-slate-500 tabular-nums">
                    {stat?.gamesPlayed ?? 0} kali main · {completed}/3 level selesai
                  </p>
                </div>
                <div className="flex items-center gap-1 font-display font-extrabold text-amber-600 tabular-nums">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span>{stat?.starsEarned ?? 0}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
