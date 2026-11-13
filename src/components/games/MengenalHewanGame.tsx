import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Music, Sparkles, Volume2 } from 'lucide-react';
import { ANIMALS_DATA } from '../../data/curriculum';
import { AnimalItem, DifficultyLevel, MascotMood } from '../../types/game';
import { audioEngine } from '../../utils/audioEngine';
import { ItemIllustration } from '../illustrations/ItemIllustration';
import { Mascot } from '../Mascot';
import { SparkleBurstCanvas } from '../SparkleBurstCanvas';

interface MengenalHewanGameProps {
  level: DifficultyLevel;
  onCompleteRound: (result: {
    correctCount: number;
    mistakesCount: number;
    hintsUsed: number;
    detailText: string;
  }) => void;
}

export const MengenalHewanGame: React.FC<MengenalHewanGameProps> = ({
  level,
  onCompleteRound,
}) => {
  const [mode, setMode] = useState<'explore' | 'quiz'>('explore');
  const [activeAnimal, setActiveAnimal] = useState<AnimalItem>(ANIMALS_DATA[0]);

  const quizAnimals = useMemo(() => {
    const filtered = ANIMALS_DATA.filter((a) => a.level <= level);
    return filtered.slice(0, 5);
  }, [level]);

  const [quizIdx, setQuizIdx] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [sparkleKey, setSparkleKey] = useState(0);
  const [mascotMood, setMascotMood] = useState<MascotMood>(MascotMood.HAPPY);
  const [mascotMsg, setMascotMsg] = useState('Sentuh gambar hewan untuk mendengar nama dan suaranya!');

  const currentQuizAnimal = quizAnimals[quizIdx] ?? ANIMALS_DATA[0];

  const quizOptions = useMemo(() => {
    const distractors = ANIMALS_DATA.filter((a) => a.id !== currentQuizAnimal.id).slice(0, 2);
    return [currentQuizAnimal, ...distractors].sort((a, b) =>
      ((a.name.charCodeAt(0) + quizIdx) % 7) - ((b.name.charCodeAt(0) + quizIdx) % 7)
    );
  }, [currentQuizAnimal, quizIdx]);

  const handleSelectAnimal = (animal: AnimalItem) => {
    setActiveAnimal(animal);
    setMascotMood(MascotMood.SPEAKING);
    setMascotMsg(`Ini adalah ${animal.name}. Suaranya: "${animal.soundText}"`);
    audioEngine.speak(`Ini adalah ${animal.name.toLowerCase()}.`);
  };

  const handleAnswerQuiz = (chosen: AnimalItem) => {
    if (chosen.id === currentQuizAnimal.id) {
      setSparkleKey((k) => k + 1);
      audioEngine.playCorrectLetter();
      setMascotMood(MascotMood.CHEERING);
      setMascotMsg(`Hebat! Itu benar ${currentQuizAnimal.name}!`);
      audioEngine.speak(`Hebat! Itu benar ${currentQuizAnimal.name.toLowerCase()}!`);

      window.setTimeout(() => {
        if (quizIdx + 1 < quizAnimals.length) {
          const next = quizAnimals[quizIdx + 1];
          setQuizIdx((i) => i + 1);
          setMascotMood(MascotMood.HAPPY);
          setMascotMsg(`Sekarang tebak yang mana gambar ${next.name}!`);
          audioEngine.speak(`Yang manakah gambar ${next.name.toLowerCase()}?`);
        } else {
          onCompleteRound({
            correctCount: quizAnimals.length,
            mistakesCount: mistakes,
            hintsUsed: 0,
            detailText: `Mengenal & mencocokkan ${quizAnimals.length} hewan`,
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
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-4 border-2 border-emerald-100 shadow-xs">
        <Mascot mood={mascotMood} message={mascotMsg} size="sm" />
        <div className="flex items-center gap-2 bg-emerald-50 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setMode('explore')}
            className={`px-4 py-2 rounded-xl text-sm font-bold cursor-pointer ${
              mode === 'explore' ? 'bg-emerald-600 text-white' : 'text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            Kenali 20 Hewan
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('quiz');
              setQuizIdx(0);
              setMistakes(0);
              setMascotMsg(`Yang manakah gambar ${quizAnimals[0].name}?`);
              audioEngine.speak(`Yang manakah gambar ${quizAnimals[0].name.toLowerCase()}?`);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-bold cursor-pointer ${
              mode === 'quiz' ? 'bg-emerald-600 text-white' : 'text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            Kuis Tebak Hewan
          </button>
        </div>
      </div>

      {mode === 'explore' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-3xl border-2 border-emerald-100 p-6 flex flex-col items-center text-center gap-4 shadow-sm">
            <div className="bg-emerald-50/70 rounded-3xl p-6 border border-emerald-100">
              <ItemIllustration itemKey={activeAnimal.illustrationKey} size="xl" />
            </div>
            <div>
              <h3 className="font-display text-3xl font-extrabold text-slate-900">
                {activeAnimal.name}
              </h3>
              <p className="text-sm font-semibold text-slate-500 mt-1">
                Tempat tinggal: {activeAnimal.habitat} · Suara: {activeAnimal.soundText}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => audioEngine.speak(`Ini adalah ${activeAnimal.name.toLowerCase()}`)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
              >
                <Volume2 className="w-5 h-5" />
                <span>Nama Hewan</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  audioEngine.playAnimalSound(activeAnimal.soundProfile, activeAnimal.soundText)
                }
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold cursor-pointer"
              >
                <Music className="w-5 h-5" />
                <span>Suara Hewan</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-emerald-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-slate-800">
                Daftar 20 Hewan Lucu
              </h3>
              <button
                type="button"
                onClick={() => {
                  setMode('quiz');
                  setQuizIdx(0);
                  audioEngine.speak(`Yang manakah gambar ${quizAnimals[0].name.toLowerCase()}?`);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Mulai Kuis Hewan</span>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ANIMALS_DATA.map((animal) => {
                const selected = activeAnimal.id === animal.id;
                return (
                  <motion.button
                    key={animal.id}
                    type="button"
                    whileTap={{ scale: 0.94 }}
                    onClick={() => handleSelectAnimal(animal)}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 cursor-pointer transition-colors ${
                      selected
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-950'
                        : 'bg-slate-50 hover:bg-emerald-50 border-slate-100 text-slate-800'
                    }`}
                  >
                    <ItemIllustration itemKey={animal.illustrationKey} size="sm" />
                    <span className="font-display text-sm font-bold">{animal.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border-2 border-emerald-100 p-6 md:p-10 text-center space-y-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500 tabular-nums">
            Tebak Hewan {quizIdx + 1} / {quizAnimals.length}
          </p>
          <div className="space-y-3">
            <h3 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900">
              Yang manakah gambar <span className="text-emerald-600">{currentQuizAnimal.name}</span>?
            </h3>
            <button
              type="button"
              onClick={() =>
                audioEngine.speak(`Yang manakah gambar ${currentQuizAnimal.name.toLowerCase()}?`)
              }
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-100 text-emerald-800 font-bold cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
              <span>Dengarkan Pertanyaan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {quizOptions.map((opt) => (
              <motion.button
                key={opt.id}
                type="button"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswerQuiz(opt)}
                aria-label={`Pilih ${opt.name}`}
                className="bg-sky-50/70 hover:bg-emerald-50 border-2 border-sky-200 hover:border-emerald-400 rounded-3xl p-6 flex flex-col items-center gap-3 cursor-pointer transition-colors"
              >
                <ItemIllustration itemKey={opt.illustrationKey} size="md" />
                <span className="font-display text-xl font-extrabold text-slate-800">
                  {opt.name}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
