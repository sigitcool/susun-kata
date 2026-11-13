import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Volume2 } from 'lucide-react';
import { COLORS_DATA } from '../../data/curriculum';
import { ColorItem, DifficultyLevel, MascotMood } from '../../types/game';
import { audioEngine } from '../../utils/audioEngine';
import { ItemIllustration } from '../illustrations/ItemIllustration';
import { Mascot } from '../Mascot';
import { SparkleBurstCanvas } from '../SparkleBurstCanvas';

interface MengenalWarnaGameProps {
  level: DifficultyLevel;
  onCompleteRound: (result: {
    correctCount: number;
    mistakesCount: number;
    hintsUsed: number;
    detailText: string;
  }) => void;
}

export const MengenalWarnaGame: React.FC<MengenalWarnaGameProps> = ({
  level,
  onCompleteRound,
}) => {
  const [mode, setMode] = useState<'explore' | 'quiz'>('explore');
  const [selectedColor, setSelectedColor] = useState<ColorItem>(COLORS_DATA[0]);

  const quizColors = useMemo(() => {
    const filtered = COLORS_DATA.filter((c) => c.level <= level);
    return filtered.slice(0, 5);
  }, [level]);

  const [quizIdx, setQuizIdx] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [sparkleKey, setSparkleKey] = useState(0);
  const [mascotMood, setMascotMood] = useState<MascotMood>(MascotMood.HAPPY);
  const [mascotMsg, setMascotMsg] = useState('Sentuh warna favoritmu untuk mendengar namanya!');

  const targetColor = quizColors[quizIdx] ?? COLORS_DATA[0];

  const options = useMemo(() => {
    const others = COLORS_DATA.filter((c) => c.id !== targetColor.id).slice(0, 2);
    return [targetColor, ...others].sort((a, b) =>
      ((a.name.charCodeAt(0) + quizIdx) % 5) - ((b.name.charCodeAt(0) + quizIdx) % 5)
    );
  }, [targetColor, quizIdx]);

  const handlePickColor = (item: ColorItem) => {
    setSelectedColor(item);
    setMascotMood(MascotMood.SPEAKING);
    setMascotMsg(`Ini warna ${item.name}, seperti ${item.objectName.toLowerCase()}!`);
    audioEngine.playTileTap();
    audioEngine.speak(`Warna ${item.name.toLowerCase()}. Seperti ${item.objectName.toLowerCase()}.`);
  };

  const handleAnswer = (chosen: ColorItem) => {
    if (chosen.id === targetColor.id) {
      setSparkleKey((k) => k + 1);
      audioEngine.playCorrectLetter();
      setMascotMood(MascotMood.CHEERING);
      setMascotMsg(`Hebat! Itu benar warna ${targetColor.name}!`);
      audioEngine.speak(`Hebat! Itu warna ${targetColor.name.toLowerCase()}!`);

      window.setTimeout(() => {
        if (quizIdx + 1 < quizColors.length) {
          const next = quizColors[quizIdx + 1];
          setQuizIdx((i) => i + 1);
          setMascotMood(MascotMood.HAPPY);
          setMascotMsg(`Sekarang cari warna ${next.name}!`);
          audioEngine.speak(`Mana warna ${next.name.toLowerCase()}?`);
        } else {
          onCompleteRound({
            correctCount: quizColors.length,
            mistakesCount: mistakes,
            hintsUsed: 0,
            detailText: `Mengenal dan mencocokkan ${quizColors.length} warna`,
          });
        }
      }, 850);
    } else {
      setMistakes((m) => m + 1);
      setMascotMood(MascotMood.ENCOURAGING);
      setMascotMsg('Ayo coba lagi, kamu pasti bisa!');
      audioEngine.playGentleTryAgain();
      audioEngine.speak('Ayo coba lagi, kamu pasti bisa!');
    }
  };

  return (
    <div className="space-y-6">
      <SparkleBurstCanvas burstKey={sparkleKey} intensity="small" />
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-4 border-2 border-pink-100 shadow-xs">
        <Mascot mood={mascotMood} message={mascotMsg} size="sm" />
        <div className="flex items-center gap-2 bg-pink-50 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setMode('explore')}
            className={`px-4 py-2 rounded-xl text-sm font-bold cursor-pointer ${
              mode === 'explore' ? 'bg-pink-600 text-white' : 'text-pink-900 hover:bg-pink-100'
            }`}
          >
            Kenali 8 Warna
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('quiz');
              setQuizIdx(0);
              setMistakes(0);
              setMascotMsg(`Mana warna ${quizColors[0].name}?`);
              audioEngine.speak(`Mana warna ${quizColors[0].name.toLowerCase()}?`);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-bold cursor-pointer ${
              mode === 'quiz' ? 'bg-pink-600 text-white' : 'text-pink-900 hover:bg-pink-100'
            }`}
          >
            Cocokkan Warna
          </button>
        </div>
      </div>

      {mode === 'explore' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-3xl border-2 border-pink-100 p-6 flex flex-col items-center text-center gap-4 shadow-sm">
            <div
              className="w-36 h-36 rounded-3xl border-4 border-slate-200 shadow-inner flex items-center justify-center"
              style={{ backgroundColor: selectedColor.hex }}
            >
              <span
                className="font-display text-2xl font-extrabold"
                style={{ color: selectedColor.textOnHex }}
              >
                {selectedColor.name}
              </span>
            </div>

            <ItemIllustration itemKey={selectedColor.illustrationKey} size="md" />
            <p className="text-base font-bold text-slate-700">{selectedColor.objectName}</p>

            <button
              type="button"
              onClick={() => audioEngine.speak(`Ini warna ${selectedColor.name.toLowerCase()}`)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-bold cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
              <span>Dengarkan Warna</span>
            </button>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-pink-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-slate-800">
                Pilih Warna Ceria
              </h3>
              <button
                type="button"
                onClick={() => {
                  setMode('quiz');
                  setQuizIdx(0);
                  audioEngine.speak(`Mana warna ${quizColors[0].name.toLowerCase()}?`);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Main Cocokkan Warna</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {COLORS_DATA.map((item) => (
                <motion.button
                  key={item.id}
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handlePickColor(item)}
                  className="rounded-2xl p-4 border-2 border-slate-200 flex flex-col items-center gap-2 cursor-pointer shadow-xs"
                  style={{ backgroundColor: item.hex }}
                >
                  <span
                    className="font-display text-base font-extrabold"
                    style={{ color: item.textOnHex }}
                  >
                    {item.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border-2 border-pink-100 p-6 md:p-10 text-center space-y-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500 tabular-nums">
            Warna {quizIdx + 1} / {quizColors.length}
          </p>
          <h3 className="font-display text-3xl font-extrabold text-slate-900">
            Pilih warna <span className="text-pink-600">{targetColor.name}</span>!
          </h3>
          <button
            type="button"
            onClick={() => audioEngine.speak(`Mana warna ${targetColor.name.toLowerCase()}?`)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-pink-100 text-pink-800 font-bold cursor-pointer"
          >
            <Volume2 className="w-5 h-5" />
            <span>Dengarkan Warna</span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {options.map((opt) => (
              <motion.button
                key={opt.id}
                type="button"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleAnswer(opt)}
                aria-label={`Pilih warna ${opt.name}`}
                className="h-36 rounded-3xl border-4 border-slate-200 shadow-sm flex flex-col items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: opt.hex }}
              >
                <span className="sr-only">{opt.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
