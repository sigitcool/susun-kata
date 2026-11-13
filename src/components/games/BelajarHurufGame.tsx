import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, PenTool, Sparkles, Volume2 } from 'lucide-react';
import { LETTERS_DATA } from '../../data/curriculum';
import { DifficultyLevel, LetterItem, MascotMood } from '../../types/game';
import { audioEngine } from '../../utils/audioEngine';
import { buildLetterTracePaths } from '../../utils/gameLogic';
import { ItemIllustration } from '../illustrations/ItemIllustration';
import { Mascot } from '../Mascot';
import { SparkleBurstCanvas } from '../SparkleBurstCanvas';

interface BelajarHurufGameProps {
  level: DifficultyLevel;
  onCompleteRound: (result: {
    correctCount: number;
    mistakesCount: number;
    hintsUsed: number;
    detailText: string;
  }) => void;
}

export const BelajarHurufGame: React.FC<BelajarHurufGameProps> = ({
  level,
  onCompleteRound,
}) => {
  const [mode, setMode] = useState<'explore' | 'match'>('explore');
  const [selectedLetter, setSelectedLetter] = useState<LetterItem>(LETTERS_DATA[0]);
  const [traceKey, setTraceKey] = useState(0);

  // Matching uppercase & lowercase game state
  const matchSet = useMemo(() => {
    const filtered = LETTERS_DATA.filter((item) => item.level <= level);
    const pool = filtered.length >= 6 ? filtered : LETTERS_DATA;
    return pool.slice(0, 6);
  }, [level]);

  const [quizIdx, setQuizIdx] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [sparkleKey, setSparkleKey] = useState(0);
  const [mascotMood, setMascotMood] = useState<MascotMood>(MascotMood.HAPPY);

  const currentMatchTarget = matchSet[quizIdx] ?? matchSet[0];
  const lowercaseOptions = useMemo(() => {
    const others = LETTERS_DATA.filter((l) => l.letter !== currentMatchTarget.letter)
      .slice(0, 2)
      .map((l) => l.lowercase);
    const opts = [currentMatchTarget.lowercase, ...others];
    // Deterministic shuffle per index
    return opts.sort((a, b) => ((a.charCodeAt(0) + quizIdx) % 5) - ((b.charCodeAt(0) + quizIdx) % 5));
  }, [currentMatchTarget, quizIdx]);

  const handleSelectLetter = (item: LetterItem) => {
    setSelectedLetter(item);
    setTraceKey((k) => k + 1);
    audioEngine.playTileTap();
    audioEngine.speak(`${item.letter}. ${item.phonetic}`);
  };

  const handleAnswerMatch = (chosenLower: string) => {
    if (chosenLower === currentMatchTarget.lowercase) {
      setSparkleKey((k) => k + 1);
      audioEngine.playCorrectLetter();
      setMascotMood(MascotMood.CHEERING);
      setFeedback(`Benar! Huruf ${currentMatchTarget.letter} berpasangan dengan ${currentMatchTarget.lowercase}!`);
      audioEngine.speak(`Benar! ${currentMatchTarget.letter} besar dan ${currentMatchTarget.lowercase} kecil.`);

      window.setTimeout(() => {
        setFeedback(null);
        if (quizIdx + 1 < matchSet.length) {
          setQuizIdx((i) => i + 1);
          setMascotMood(MascotMood.HAPPY);
        } else {
          onCompleteRound({
            correctCount: matchSet.length,
            mistakesCount: mistakes,
            hintsUsed: 0,
            detailText: `Mengenal huruf A–Z dan mencocokkan ${matchSet.length} huruf besar & kecil`,
          });
        }
      }, 900);
    } else {
      setMistakes((m) => m + 1);
      setMascotMood(MascotMood.ENCOURAGING);
      setFeedback('Ayo coba lagi, perhatikan bentuk hurufnya!');
      audioEngine.playGentleTryAgain();
      audioEngine.speak('Ayo coba lagi, kamu pasti bisa!');
    }
  };

  const tracePaths = buildLetterTracePaths(selectedLetter.letter);

  return (
    <div className="space-y-6">
      <SparkleBurstCanvas burstKey={sparkleKey} intensity="small" />
      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-4 border-2 border-violet-100 shadow-xs">
        <Mascot
          mood={mascotMood}
          message={
            mode === 'explore'
              ? `Huruf ${selectedLetter.letter} untuk ${selectedLetter.word}. Sentuh huruf lain untuk belajar!`
              : feedback ?? `Cari huruf kecil yang cocok dengan huruf ${currentMatchTarget.letter}!`
          }
          size="sm"
        />

        <div className="flex items-center gap-2 bg-violet-50 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setMode('explore')}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap cursor-pointer transition-colors ${
              mode === 'explore'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'text-violet-800 hover:bg-violet-100'
            }`}
          >
            Kenali Huruf A–Z
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('match');
              setQuizIdx(0);
              setMistakes(0);
              audioEngine.speak(`Cari huruf kecil untuk huruf ${matchSet[0].letter}`);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap cursor-pointer transition-colors ${
              mode === 'match'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'text-violet-800 hover:bg-violet-100'
            }`}
          >
            Cocokkan Huruf
          </button>
        </div>
      </div>

      {mode === 'explore' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Featured Letter & Handwriting Animation */}
          <div className="lg:col-span-5 bg-white rounded-3xl border-2 border-violet-100 p-6 flex flex-col items-center text-center gap-4 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="bg-violet-50 border-2 border-violet-200 rounded-3xl px-6 py-4">
                <span className="font-display text-6xl font-extrabold text-violet-700">
                  {selectedLetter.letter}
                </span>
                <span className="font-display text-5xl font-bold text-pink-500 ml-2">
                  {selectedLetter.lowercase}
                </span>
              </div>

              {/* Animated SVG Stroke Writing */}
              <div className="w-28 h-28 bg-amber-50/70 border-2 border-amber-200 rounded-3xl p-2 relative">
                <svg key={traceKey} viewBox="0 0 100 100" className="w-full h-full">
                  {tracePaths.map((d, i) => (
                    <React.Fragment key={i}>
                      <path
                        d={d}
                        fill="none"
                        stroke="#E2E8F0"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d={d}
                        fill="none"
                        stroke="#7C3AED"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-stroke-draw"
                      />
                    </React.Fragment>
                  ))}
                </svg>
                <span className="sr-only">Animasi menulis huruf {selectedLetter.letter}</span>
              </div>
            </div>

            <ItemIllustration itemKey={selectedLetter.illustrationKey} size="lg" />

            <div>
              <h3 className="font-display text-3xl font-extrabold text-slate-900">
                {selectedLetter.word}
              </h3>
              <p className="text-sm font-semibold text-slate-500 mt-0.5">
                {selectedLetter.phonetic}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 w-full">
              <button
                type="button"
                onClick={() => audioEngine.speak(`${selectedLetter.letter}. ${selectedLetter.phonetic}`)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold cursor-pointer"
              >
                <Volume2 className="w-5 h-5" />
                <span>Dengarkan Huruf</span>
              </button>

              <button
                type="button"
                onClick={() => setTraceKey((k) => k + 1)}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold cursor-pointer"
              >
                <PenTool className="w-4 h-4" />
                <span>Tulis Ulang</span>
              </button>
            </div>
          </div>

          {/* Right: Full A-Z Interactive Grid */}
          <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-violet-100 p-5 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-slate-800">
                Pilih Huruf A sampai Z
              </h3>
              <button
                type="button"
                onClick={() => {
                  setMode('match');
                  setQuizIdx(0);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Main Cocokkan Huruf</span>
              </button>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-2.5">
              {LETTERS_DATA.map((item) => {
                const active = selectedLetter.letter === item.letter;
                return (
                  <motion.button
                    key={item.letter}
                    type="button"
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleSelectLetter(item)}
                    aria-label={`Huruf ${item.letter} untuk ${item.word}`}
                    className={`h-14 rounded-2xl font-display text-2xl font-extrabold border-b-4 transition-colors cursor-pointer ${
                      active
                        ? 'bg-violet-600 border-violet-800 text-white shadow-sm'
                        : 'bg-sky-50 hover:bg-sky-100 border-sky-200 text-slate-800'
                    }`}
                  >
                    {item.letter}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Uppercase-Lowercase Matching Game */
        <div className="bg-white rounded-3xl border-2 border-violet-100 p-6 md:p-10 text-center space-y-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500 tabular-nums">
            Soal {quizIdx + 1} dari {matchSet.length}
          </p>

          <div className="inline-flex flex-col items-center bg-violet-50 border-2 border-violet-200 rounded-3xl px-10 py-6">
            <span className="text-xs font-bold text-violet-600 mb-1">Huruf Besar</span>
            <span className="font-display text-7xl font-extrabold text-violet-800">
              {currentMatchTarget.letter}
            </span>
          </div>

          <p className="font-display text-xl font-bold text-slate-800">
            Mana huruf kecilnya?
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {lowercaseOptions.map((opt) => (
              <motion.button
                key={opt}
                type="button"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleAnswerMatch(opt)}
                aria-label={`Huruf kecil ${opt}`}
                className="w-24 h-24 rounded-3xl bg-amber-100 hover:bg-amber-200 border-b-4 border-amber-400 font-display text-5xl font-extrabold text-slate-900 cursor-pointer"
              >
                {opt}
              </motion.button>
            ))}
          </div>

          {feedback && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>{feedback}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
