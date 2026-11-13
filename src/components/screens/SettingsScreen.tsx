import React, { useState } from 'react';
import { ArrowLeft, Music, RotateCcw, Sparkles, Volume2 } from 'lucide-react';
import { PlayerProgress } from '../../types/game';
import { audioEngine } from '../../utils/audioEngine';

interface SettingsScreenProps {
  progress: PlayerProgress;
  onUpdateAudio: (next: PlayerProgress['audio']) => void;
  onResetProgress: () => void;
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  progress,
  onUpdateAudio,
  onResetProgress,
  onBack,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali</span>
      </button>

      <div className="bg-white rounded-3xl border-2 border-sky-100 p-6 md:p-8 shadow-sm space-y-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900">
            Pengaturan Suara & Permainan
          </h1>
          <p className="text-slate-600 font-medium mt-1">
            Atur volume suara, musik latar ceria, dan bantuan petunjuk bermain.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-2">
            <div className="flex items-center justify-between text-sm font-bold text-slate-800">
              <label htmlFor="settings-volume" className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-sky-600" />
                <span>Volume Utama</span>
              </label>
              <span className="tabular-nums text-sky-700">
                {Math.round(progress.audio.volume * 100)}%
              </span>
            </div>
            <input
              id="settings-volume"
              type="range"
              min={0}
              max={100}
              value={Math.round(progress.audio.volume * 100)}
              onChange={(e) =>
                onUpdateAudio({ ...progress.audio, volume: Number(e.target.value) / 100 })
              }
              className="w-full accent-sky-600"
            />
          </div>

          <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="font-bold text-slate-900 text-sm">Suara Pengucapan (Bahasa Indonesia)</p>
                <p className="text-xs text-slate-500">Membacakan kata, huruf, angka, dan pujian</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={progress.audio.voiceEnabled}
              onChange={(e) =>
                onUpdateAudio({ ...progress.audio, voiceEnabled: e.target.checked })
              }
              className="w-5 h-5 accent-sky-600"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <div>
                <p className="font-bold text-slate-900 text-sm">Efek Suara Permainan</p>
                <p className="text-xs text-slate-500">Suara ketukan huruf, benar, dan perayaan</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={progress.audio.sfxEnabled}
              onChange={(e) =>
                onUpdateAudio({ ...progress.audio, sfxEnabled: e.target.checked })
              }
              className="w-5 h-5 accent-sky-600"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div className="flex items-center gap-3">
              <Music className="w-5 h-5 text-pink-500" />
              <div>
                <p className="font-bold text-slate-900 text-sm">Musik Latar Ceria</p>
                <p className="text-xs text-slate-500">Melodi lembut yang ramah untuk anak</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={progress.audio.musicEnabled}
              onChange={(e) =>
                onUpdateAudio({ ...progress.audio, musicEnabled: e.target.checked })
              }
              className="w-5 h-5 accent-sky-600"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <p className="font-bold text-slate-900 text-sm">Petunjuk Selalu Tersedia</p>
              <p className="text-xs text-slate-500">Tampilkan tombol Petunjuk di semua level</p>
            </div>
            <input
              type="checkbox"
              checked={progress.audio.hintsAlwaysAvailable}
              onChange={(e) =>
                onUpdateAudio({ ...progress.audio, hintsAlwaysAvailable: e.target.checked })
              }
              className="w-5 h-5 accent-sky-600"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => audioEngine.speak('Halo! Suara Cerdas bersama Revan Utomo sudah siap digunakan.')}
            className="px-5 py-3 rounded-2xl bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold text-sm cursor-pointer"
          >
            Tes Suara Sekarang
          </button>

          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Data</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setConfirmReset(false);
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs cursor-pointer"
              >
                Konfirmasi Reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Batal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
