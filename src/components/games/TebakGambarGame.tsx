import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { QUIZ_ITEMS_DATA } from '../../data/curriculum';
import { DifficultyLevel, MascotMood } from '../../types/game';
import { audioEngine } from '../../utils/audioEngine';
import { ItemIllustration } from '../illustrations/ItemIllustration';
import { Mascot } from '../Mascot';
import { SparkleBurstCanvas } from '../SparkleBurstCanvas';

interface TebakGambarGameProps {
  level: DifficultyLevel;
  onCompleteRound: (result: {
    correctCount: number;
    mistakesCount: number;
    hintsUsed: number;
    detailText: string;
  }) => void;
}

export const TebakGambarGame: React.FC<TebakGambarGameProps> = ({
  level,
  onCompleteRound,
}) => {
  const items = useMemo(() => {
    const filtered = QUIZ_ITEMS_DATA.filter((q) => q.level === level);
    return filtered.slice(0, 6);
  }, [level]);

  const [index, setIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [wrongOption, setWrongOption] = useState<string | null>(null);
  const [sparkleKey, setSparkleKey] = useState(0);
  const [mascotMood, setMascotMood] = useState<MascotMood>(MascotMood.HAPPY);
  const [mascotMsg, setMascotMsg] = useState(items[0]?.questionAudio ?? 'Ini gambar apa ya?');

  const current = items[index] ?? QUIZ_ITEMS_DATA[0];

  useEffect(() => {
    setMascotMood(MascotMood.SPEAKING);
    setMascotMsg(current.questionAudio);
    const t = window.setTimeout(() => {
      audioEngine.speak(current.questionAudio);
    }, 200);
    return () => window.clearTimeout(t);
  }, [current]);

  const handlePickOption = (option: string) => {
    if (option === current.targetWord) {
      setSparkleKey((k) => k + 1);
      audioEngine.playCorrectLetter();
      setMascotMood(MascotMood.CHEERING);
      setMascotMsg(`Hebat! Benar sekali, ini adalah ${current.targetWord}!`);
      audioEngine.speak(`Hebat! Ini adalah ${current.targetWord.toLowerCase()}!`);

      window.setTimeout(() => {
        if (index + 1 < items.length) {
          setIndex((i) => i + 1);
        } else {
          onCompleteRound({
            correctCount: items.length,
            mistakesCount: mistakes,
            hintsUsed: 0,
            detailText: `Menebak ${items.length} gambar dengan tepat`,
          });
        }
      }, 850);
    } else {
      setMistakes((m) => m + 1);
      setWrongOption(option);
      window.setTimeout(() => setWrongOption(null), 450);
      setMascotMood(MascotMood.ENCOURAGING);
      setMascotMsg('Ayo coba lagi, kamu pasti bisa!');
      audioEngine.playGentleTryAgain();
      audioEngine.speak('Ayo coba lagi, kamu pasti bisa!');
    }
  };

  return (
    <div className="space-y-6">
      <SparkleBurstCanvas burstKey={sparkleKey} intensity="small" />
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-4 border-2 border-orange-100 shadow-xs">
        <Mascot mood={mascotMood} message={mascotMsg} size="sm" />
        <div className="text-right">
          <p className="text-xs font-semibold text-slate-500">Pertanyaan</p>
          <p className="font-display text-lg font-extrabold text-orange-600 tabular-nums">
            {index + 1} / {items.length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border-2 border-orange-100 p-6 md:p-10 text-center space-y-6 shadow-sm">
        <div className="inline-flex flex-col items-center bg-orange-50/60 border border-orange-100 rounded-3xl p-8">
          <ItemIllustration itemKey={current.illustrationKey} size="xl" />
        </div>

        <div>
          <button
            type="button"
            onClick={() => audioEngine.speak(current.questionAudio)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold cursor-pointer"
          >
            <Volume2 className="w-5 h-5" />
            <span>Dengarkan Soal</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {current.options.map((opt) => (
            <motion.button
              key={opt}
              type="button"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => handlePickOption(opt)}
              className={`py-5 px-6 rounded-2xl border-b-4 font-display text-2xl font-extrabold cursor-pointer transition-colors ${
                wrongOption === opt
                  ? 'animate-wiggle bg-rose-100 border-rose-400 text-rose-900'
                  : 'bg-sky-50 hover:bg-amber-100 border-sky-300 hover:border-amber-400 text-slate-900'
              }`}
            >
              {opt}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};
