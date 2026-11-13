import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, RotateCcw, Save, TrendingUp, Volume2 } from 'lucide-react';
import { CATEGORIES_META } from '../../data/curriculum';
import { AvatarId, PlayerProgress } from '../../types/game';
import { analyzeParentInsights } from '../../utils/gameLogic';
import { AVATAR_OPTIONS, AvatarIcon } from '../AvatarIcon';

interface ParentDashboardScreenProps {
  progress: PlayerProgress;
  onUpdateProfile: (name: string, avatar: AvatarId) => void;
  onUpdateAudio: (nextAudio: PlayerProgress['audio']) => void;
  onResetProgress: () => void;
  onBack: () => void;
}

export const ParentDashboardScreen: React.FC<ParentDashboardScreenProps> = ({
  progress,
  onUpdateProfile,
  onUpdateAudio,
  onResetProgress,
  onBack,
}) => {
  const [nameInput, setNameInput] = useState(progress.profile.name);
  const [avatarInput, setAvatarInput] = useState<AvatarId>(progress.profile.avatar);
  const [savedNotice, setSavedNotice] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const insights = analyzeParentInsights(progress);
  const getCatTitle = (id: string) =>
    CATEGORIES_META.find((c) => c.id === id)?.title ?? id;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(nameInput, avatarInput);
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2400);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Mode Anak</span>
        </button>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-sky-700">
          Pemantauan & Pengaturan
        </p>
        <h1 className="font-display text-3xl font-extrabold text-slate-900">
          Dashboard Orang Tua & Guru
        </h1>
        <p className="text-slate-600 font-medium mt-1">
          Pantau perkembangan belajar anak, kelola profil, atur audio, dan lihat riwayat bermain.
        </p>
      </div>

      {/* Overview Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
          <p className="text-xs font-bold text-slate-500">Jumlah Permainan</p>
          <p className="font-display text-3xl font-extrabold text-slate-900 tabular-nums mt-1">
            {insights.totalGames}
          </p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
          <p className="text-xs font-bold text-slate-500">Akurasi Keseluruhan</p>
          <p className="font-display text-3xl font-extrabold text-emerald-600 tabular-nums mt-1">
            {insights.overallAccuracyPercent}%
          </p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
          <p className="text-xs font-bold text-slate-500">Total Bintang</p>
          <p className="font-display text-3xl font-extrabold text-amber-600 tabular-nums mt-1">
            {progress.totalStars}
          </p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
          <p className="text-xs font-bold text-slate-500">Kategori Dikuasai</p>
          <p className="font-display text-3xl font-extrabold text-sky-700 tabular-nums mt-1">
            {insights.masteredCategories.length}
          </p>
        </div>
      </div>

      {/* Mastered vs Needs Practice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <h2 className="font-display text-xl font-extrabold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Kategori yang Dikuasai</span>
          </h2>
          {insights.masteredCategories.length === 0 ? (
            <p className="text-sm text-slate-500 font-medium">
              Belum ada kategori yang selesai dimainkan. Ajak anak bermain beberapa ronde!
            </p>
          ) : (
            <ul className="space-y-2">
              {insights.masteredCategories.map((catId) => {
                const stat = progress.categoryStats[catId];
                const acc =
                  stat && stat.totalAttempts > 0
                    ? Math.round((stat.correctCount / stat.totalAttempts) * 100)
                    : 100;
                return (
                  <li
                    key={catId}
                    className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 text-emerald-950 font-semibold text-sm"
                  >
                    <span>{getCatTitle(catId)}</span>
                    <span className="tabular-nums font-bold">{acc}% tepat</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <h2 className="font-display text-xl font-extrabold text-amber-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <span>Kategori yang Perlu Latihan</span>
          </h2>
          {insights.needsPracticeCategories.length === 0 &&
          insights.unexploredCategories.length === 0 ? (
            <p className="text-sm text-emerald-700 font-semibold">
              Luar biasa! Semua kategori sudah dikuasai dengan baik.
            </p>
          ) : (
            <ul className="space-y-2">
              {insights.needsPracticeCategories.map((catId) => (
                <li
                  key={catId}
                  className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 text-amber-950 font-semibold text-sm"
                >
                  <span>{getCatTitle(catId)}</span>
                  <span className="text-xs font-bold">Perlu latihan tambahan</span>
                </li>
              ))}
              {insights.unexploredCategories.slice(0, 4).map((catId) => (
                <li
                  key={catId}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 text-slate-700 font-semibold text-sm"
                >
                  <span>{getCatTitle(catId)}</span>
                  <span className="text-xs text-slate-500">Belum dicoba</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Profile Editor & Audio Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form
          onSubmit={handleSaveProfile}
          className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs"
        >
          <h2 className="font-display text-xl font-extrabold text-slate-900">
            Atur Profil Anak
          </h2>

          <div className="space-y-2">
            <label htmlFor="child-name-input" className="block text-sm font-bold text-slate-700">
              Nama Panggilan Anak
            </label>
            <input
              id="child-name-input"
              type="text"
              maxLength={24}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Contoh: Alya atau Bintang"
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-sky-500 focus:outline-none font-semibold text-slate-900"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-bold text-slate-700">Pilih Avatar Karakter</p>
            <div className="grid grid-cols-3 gap-3">
              {AVATAR_OPTIONS.map((opt) => {
                const selected = avatarInput === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAvatarInput(opt.id)}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 cursor-pointer ${
                      selected
                        ? 'border-sky-500 bg-sky-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <AvatarIcon avatar={opt.id} size="sm" />
                    <span className="text-xs font-bold text-slate-800">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Profil</span>
            </button>
            {savedNotice && (
              <span className="text-sm font-bold text-emerald-700">Profil tersimpan!</span>
            )}
          </div>
        </form>

        {/* Audio & Teacher Controls */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
          <h2 className="font-display text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-sky-600" />
            <span>Pengaturan Audio & Belajar</span>
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                <label htmlFor="parent-volume">Volume Suara</label>
                <span className="tabular-nums">{Math.round(progress.audio.volume * 100)}%</span>
              </div>
              <input
                id="parent-volume"
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

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 cursor-pointer">
              <span className="text-sm font-bold text-slate-800">Suara Pemandu (Bahasa Indonesia)</span>
              <input
                type="checkbox"
                checked={progress.audio.voiceEnabled}
                onChange={(e) =>
                  onUpdateAudio({ ...progress.audio, voiceEnabled: e.target.checked })
                }
                className="w-5 h-5 accent-sky-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 cursor-pointer">
              <span className="text-sm font-bold text-slate-800">Musik Latar Ceria</span>
              <input
                type="checkbox"
                checked={progress.audio.musicEnabled}
                onChange={(e) =>
                  onUpdateAudio({ ...progress.audio, musicEnabled: e.target.checked })
                }
                className="w-5 h-5 accent-sky-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 cursor-pointer">
              <span className="text-sm font-bold text-slate-800">Buka Semua Level (Mode Guru/Kelas)</span>
              <input
                type="checkbox"
                checked={progress.audio.unlockAllLevels}
                onChange={(e) =>
                  onUpdateAudio({ ...progress.audio, unlockAllLevels: e.target.checked })
                }
                className="w-5 h-5 accent-sky-600"
              />
            </label>
          </div>

          {/* Reset Progress with confirmation */}
          <div className="pt-3 border-t border-slate-100">
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-sm cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Progres Belajar</span>
              </button>
            ) : (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-3">
                <p className="text-sm font-bold text-rose-900">
                  Yakin ingin menghapus semua bintang, XP, dan riwayat permainan?
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onResetProgress();
                      setConfirmReset(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer"
                  >
                    Ya, Reset Sekarang
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Play History Table */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="font-display text-xl font-extrabold text-slate-900">
          Riwayat Permainan Terbaru
        </h2>
        {progress.history.length === 0 ? (
          <p className="text-sm text-slate-500 font-medium">
            Belum ada riwayat permainan. Progres akan muncul otomatis setelah anak menyelesaikan permainan.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold">
                  <th className="py-2.5 pr-4">Kategori</th>
                  <th className="py-2.5 pr-4">Level</th>
                  <th className="py-2.5 pr-4">Bintang</th>
                  <th className="py-2.5 pr-4">Akurasi</th>
                  <th className="py-2.5">Detail</th>
                </tr>
              </thead>
              <tbody>
                {progress.history.slice(0, 10).map((entry) => (
                  <tr key={entry.id} className="border-b border-slate-100">
                    <td className="py-3 pr-4 font-bold text-slate-800">{entry.categoryTitle}</td>
                    <td className="py-3 pr-4 tabular-nums text-slate-600">Level {entry.level}</td>
                    <td className="py-3 pr-4 tabular-nums font-bold text-amber-600">
                      {entry.stars} Bintang
                    </td>
                    <td className="py-3 pr-4 tabular-nums text-emerald-700 font-semibold">
                      {entry.accuracyPercent}%
                    </td>
                    <td className="py-3 text-slate-600">{entry.detailText}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
