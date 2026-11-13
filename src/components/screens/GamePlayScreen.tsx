import React from 'react';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { CATEGORIES_META } from '../../data/curriculum';
import { DifficultyLevel, GameCategory, PlayerProgress } from '../../types/game';
import { BelajarHurufGame } from '../games/BelajarHurufGame';
import { MengenalAngkaGame } from '../games/MengenalAngkaGame';
import { MengenalBentukGame } from '../games/MengenalBentukGame';
import { MengenalHewanGame } from '../games/MengenalHewanGame';
import { MengenalWarnaGame } from '../games/MengenalWarnaGame';
import { PasangkanGambarGame } from '../games/PasangkanGambarGame';
import { SusunKataGame } from '../games/SusunKataGame';
import { TebakGambarGame } from '../games/TebakGambarGame';

interface GamePlayScreenProps {
  category: GameCategory;
  level: DifficultyLevel;
  progress: PlayerProgress;
  onToggleVoice: () => void;
  onBack: () => void;
  onCompleteRound: (result: {
    correctCount: number;
    mistakesCount: number;
    hintsUsed: number;
    detailText: string;
  }) => void;
}

export const GamePlayScreen: React.FC<GamePlayScreenProps> = ({
  category,
  level,
  progress,
  onToggleVoice,
  onBack,
  onCompleteRound,
}) => {
  const catMeta = CATEGORIES_META.find((c) => c.id === category) ?? CATEGORIES_META[0];
  const levelName =
    level === DifficultyLevel.PEMULA
      ? 'Level 1 · Pemula'
      : level === DifficultyLevel.MENENGAH
        ? 'Level 2 · Menengah'
        : 'Level 3 · Mahir';

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <div>
            <h1 className="font-display text-xl md:text-2xl font-extrabold text-slate-900">
              {catMeta.title}
            </h1>
            <p className="text-xs font-bold text-slate-500">{levelName}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleVoice}
          aria-label={progress.audio.voiceEnabled ? 'Matikan suara' : 'Nyalakan suara'}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border font-bold text-sm cursor-pointer ${
            progress.audio.voiceEnabled
              ? 'bg-sky-50 border-sky-200 text-sky-800'
              : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}
        >
          {progress.audio.voiceEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
          <span>{progress.audio.voiceEnabled ? 'Suara Aktif' : 'Suara Hening'}</span>
        </button>
      </div>

      {category === GameCategory.SUSUN_KATA && (
        <SusunKataGame
          level={level}
          hintsAlwaysAvailable={progress.audio.hintsAlwaysAvailable}
          onCompleteRound={onCompleteRound}
        />
      )}
      {category === GameCategory.BELAJAR_HURUF && (
        <BelajarHurufGame level={level} onCompleteRound={onCompleteRound} />
      )}
      {category === GameCategory.MENGENAL_HEWAN && (
        <MengenalHewanGame level={level} onCompleteRound={onCompleteRound} />
      )}
      {category === GameCategory.MENGENAL_ANGKA && (
        <MengenalAngkaGame level={level} onCompleteRound={onCompleteRound} />
      )}
      {category === GameCategory.MENGENAL_WARNA && (
        <MengenalWarnaGame level={level} onCompleteRound={onCompleteRound} />
      )}
      {category === GameCategory.MENGENAL_BENTUK && (
        <MengenalBentukGame level={level} onCompleteRound={onCompleteRound} />
      )}
      {category === GameCategory.TEBAK_GAMBAR && (
        <TebakGambarGame level={level} onCompleteRound={onCompleteRound} />
      )}
      {category === GameCategory.PASANGKAN_GAMBAR && (
        <PasangkanGambarGame level={level} onCompleteRound={onCompleteRound} />
      )}
    </div>
  );
};
