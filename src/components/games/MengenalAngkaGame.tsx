import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Volume2 } from 'lucide-react';
import { NUMBERS_DATA } from '../../data/curriculum';
import { DifficultyLevel, MascotMood, NumberItem } from '../../types/game';
import { audioEngine } from '../../utils/audioEngine';
import { ItemIllustration } from '../illustrations/ItemIllustration';
import { Mascot } from '../Mascot';
import { SparkleBurstCanvas } from '../SparkleBurstCanvas';

interface MengenalAngkaGameProps {
  level: DifficultyLevel;
  onCompleteRound: (result: {
    correctCount: number;
    mistakesCount: number;
    hintsUsed: number;
    detailText: string;
  }) => void;
}

export const MengenalAngkaGame: React.FC<MengenalAngkaGameProps> = ({
  level,
  onCompleteRound,
}) => {
  const [mode, setMode] = useState<'explore' | 'count'>('explore');
  const [activeNum, setActiveNum] = useState<NumberItem>(NUMBERS_DATA[0]);
  const [countedTaps, setCountedTaps] = useState<number[]>([]);

  const quizNumbers = useMemo(() => {
    const filtered = NUMBERS_DATA.filter((n) => n.level === level);
    return filtered.slice(0, 5);
  }, [level]);

  const [quizIdx, setQuizIdx] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [sparkleKey, setSparkleKey] = useState(0);
  const [mascotMood, setMascotMood] = useState<MascotMood>(MascotMood.HAPPY);
  const [mascotMsg, setMascotMsg] = useState('Ketuk angka 1 sampai 20 untuk belajar berhitung!');

  const targetNum = quizNumbers[quizIdx] ?? NUMBERS_DATA[0];

  const options = useMemo(() => {
    const opt1 = Math.max(1, targetNum.value - 1);
    const opt2 = Math.min(20, targetNum.value + 2);
    const set = Array.from(new Set([targetNum.value, opt1, opt2]));
    while (set.length < 3) {
      set.push(((set[set.length - 1] + 2) % 20) + 1);
    }
    return set.sort((a, b) => a - b);
  }, [targetNum]);

  const handlePickExploreNumber = (item: NumberItem) => {
    setActiveNum(item);
    setCountedTaps([]);
    audioEngine.playTileTap();
    audioEngine.speak(`Angka ${item.value}. ${item.value} ${item.objectName.toLowerCase()}.`);
  };

  const handleTapCountObject = (idx: number) => {
    if (!countedTaps.includes(idx)) {
      const next = [...countedTaps, idx];
      setCountedTaps(next);
      setSparkleKey((k) => k + 1);
      audioEngine.playCorrectLetter();
      audioEngine.speak(String(next.length));
    }
  };

  const handleAnswerCount = (chosenVal: number) => {
    if (chosenVal === targetNum.value) {
      setSparkleKey((k) => k + 1);
      audioEngine.playCorrectLetter();
      setMascotMood(MascotMood.CHEERING);
      setMascotMsg(`Pintar! Ada ${targetNum.value} ${targetNum.objectName.toLowerCase()}!`);
      audioEngine.speak(`Benar! Jumlahnya ada ${targetNum.value}.`);

      window.setTimeout(() => {
        if (quizIdx + 1 < quizNumbers.length) {
          const next = quizNumbers[quizIdx + 1];
          setQuizIdx((i) => i + 1);
          setMascotMood(MascotMood.HAPPY);
          setMascotMsg(`Ayo hitung ada berapa ${next.objectName.toLowerCase()}!`);
          audioEngine.speak(`Ada berapa ${next.objectName.toLowerCase()} di gambar?`);
        } else {
          onCompleteRound({
            correctCount: quizNumbers.length,
            mistakesCount: mistakes,
            hintsUsed: 0,
            detailText: `Menghitung benda dan mengenal angka level ${level}`,
          });
        }
      }, 850);
    } else {
      setMistakes((m) => m + 1);
      setMascotMood(MascotMood.ENCOURAGING);
      setMascotMsg('Yuk hitung pelan-pelan bersama Kiko, kamu pasti bisa!');
      audioEngine.playGentleTryAgain();
      audioEngine.speak('Ayo coba lagi, hitung pelan-pelan!');
    }
  };

  return (
    <div className="space-y-6">
      <SparkleBurstCanvas burstKey={sparkleKey} intensity="small" />
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-4 border-2 border-amber-100 shadow-xs">
        <Mascot mood={mascotMood} message={mascotMsg} size="sm" />
        <div className="flex items-center gap-2 bg-amber-50 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setMode('explore')}
            className={`px-4 py-2 rounded-xl text-sm font-bold cursor-pointer ${
              mode === 'explore' ? 'bg-amber-500 text-white' : 'text-amber-900 hover:bg-amber-100'
            }`}
          >
            Angka 1–20
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('count');
              setQuizIdx(0);
              setMistakes(0);
              setMascotMsg(`Hitung ada berapa ${quizNumbers[0].objectName.toLowerCase()}!`);
              audioEngine.speak(`Ada berapa ${quizNumbers[0].objectName.toLowerCase()} di gambar?`);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-bold cursor-pointer ${
              mode === 'count' ? 'bg-amber-500 text-white' : 'text-amber-900 hover:bg-amber-100'
            }`}
          >
            Hitung Benda
          </button>
        </div>
      </div>

      {mode === 'explore' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-3xl border-2 border-amber-100 p-6 flex flex-col items-center text-center gap-4 shadow-sm">
            <div className="w-28 h-28 rounded-3xl bg-amber-100 border-4 border-amber-300 flex items-center justify-center">
              <span className="font-display text-6xl font-extrabold text-amber-900 tabular-nums">
                {activeNum.value}
              </span>
            </div>
            <div>
              <h3 className="font-display text-3xl font-extrabold text-slate-900">
                {activeNum.word}
              </h3>
              <p className="text-sm font-semibold text-slate-500">
                Ketuk gambar benda di bawah untuk menghitung satu per satu!
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 bg-sky-50/70 rounded-2xl p-4 w-full">
              {Array.from({ length: activeNum.value }).map((_, idx) => {
                const tapped = countedTaps.includes(idx);
                return (
                  <motion.button
                    key={idx}
                    type="button"
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleTapCountObject(idx)}
                    aria-label={`${activeNum.objectName} ke ${idx + 1}`}
                    className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                      tapped ? 'bg-emerald-200 ring-2 ring-emerald-500 scale-105' : 'bg-white hover:bg-amber-50'
                    }`}
                  >
                    <ItemIllustration itemKey={activeNum.illustrationKey} size="xs" />
                  </motion.button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() =>
                audioEngine.speak(`Angka ${activeNum.value}. ${activeNum.word}.`)
              }
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
              <span>Sebutkan Angka</span>
            </button>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-amber-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-slate-800">
                Pilih Angka 1 sampai 20
              </h3>
              <button
                type="button"
                onClick={() => {
                  setMode('count');
                  setQuizIdx(0);
                  audioEngine.speak(`Ada berapa ${quizNumbers[0].objectName.toLowerCase()}?`);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Main Hitung Benda</span>
              </button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {NUMBERS_DATA.map((item) => {
                const active = activeNum.value === item.value;
                return (
                  <motion.button
                    key={item.value}
                    type="button"
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handlePickExploreNumber(item)}
                    className={`h-16 rounded-2xl font-display text-2xl font-extrabold tabular-nums border-b-4 cursor-pointer transition-colors ${
                      active
                        ? 'bg-amber-500 border-amber-700 text-white'
                        : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-950'
                    }`}
                  >
                    {item.value}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border-2 border-amber-100 p-6 md:p-10 text-center space-y-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500 tabular-nums">
            Soal Berhitung {quizIdx + 1} / {quizNumbers.length}
          </p>

          <h3 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900">
            Ada berapa {targetNum.objectName.toLowerCase()} di bawah ini?
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-3 bg-sky-50/70 border-2 border-sky-100 rounded-3xl p-6 max-w-2xl mx-auto">
            {Array.from({ length: targetNum.value }).map((_, idx) => (
              <div key={idx} className="bg-white p-2 rounded-2xl shadow-xs">
                <ItemIllustration itemKey={targetNum.illustrationKey} size="sm" />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {options.map((opt) => (
              <motion.button
                key={opt}
                type="button"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleAnswerCount(opt)}
                className="w-24 h-24 rounded-3xl bg-amber-100 hover:bg-amber-200 border-b-4 border-amber-400 font-display text-4xl font-extrabold text-slate-900 tabular-nums cursor-pointer"
              >
                {opt}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
