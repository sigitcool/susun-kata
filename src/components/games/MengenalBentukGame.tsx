import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Volume2 } from 'lucide-react';
import { SHAPES_DATA } from '../../data/curriculum';
import { DifficultyLevel, MascotMood, ShapeItem } from '../../types/game';
import { audioEngine } from '../../utils/audioEngine';
import { Mascot } from '../Mascot';
import { SparkleBurstCanvas } from '../SparkleBurstCanvas';

interface MengenalBentukGameProps {
  level: DifficultyLevel;
  onCompleteRound: (result: {
    correctCount: number;
    mistakesCount: number;
    hintsUsed: number;
    detailText: string;
  }) => void;
}

export const ShapeSvg: React.FC<{
  type: ShapeItem['shapeType'];
  colorHex: string;
  sizeClass?: string;
}> = ({ type, colorHex, sizeClass = 'w-28 h-28' }) => (
  <svg viewBox="0 0 120 120" className={sizeClass} aria-hidden="true">
    {type === 'circle' && <circle cx="60" cy="60" r="42" fill={colorHex} stroke="#1E293B" strokeWidth="4" />}
    {type === 'triangle' && (
      <polygon points="60,18 104,98 16,98" fill={colorHex} stroke="#1E293B" strokeWidth="4" strokeLinejoin="round" />
    )}
    {type === 'square' && (
      <rect x="22" y="22" width="76" height="76" rx="8" fill={colorHex} stroke="#1E293B" strokeWidth="4" />
    )}
    {type === 'rectangle' && (
      <rect x="12" y="34" width="96" height="52" rx="8" fill={colorHex} stroke="#1E293B" strokeWidth="4" />
    )}
    {type === 'star' && (
      <polygon
        points="60,14 73,43 105,46 81,67 88,98 60,82 32,98 39,67 15,46 47,43"
        fill={colorHex}
        stroke="#1E293B"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    )}
    {type === 'oval' && <ellipse cx="60" cy="60" rx="46" ry="30" fill={colorHex} stroke="#1E293B" strokeWidth="4" />}
    {type === 'heart' && (
      <path
        d="M 60 98 C 24 74, 16 48, 28 32 C 38 18, 54 24, 60 36 C 66 24, 82 18, 92 32 C 104 48, 96 74, 60 98 Z"
        fill={colorHex}
        stroke="#1E293B"
        strokeWidth="4"
      />
    )}
    {type === 'diamond' && (
      <polygon points="60,14 102,60 60,106 18,60" fill={colorHex} stroke="#1E293B" strokeWidth="4" strokeLinejoin="round" />
    )}
  </svg>
);

export const MengenalBentukGame: React.FC<MengenalBentukGameProps> = ({
  level,
  onCompleteRound,
}) => {
  const [mode, setMode] = useState<'explore' | 'quiz'>('explore');
  const [activeShape, setActiveShape] = useState<ShapeItem>(SHAPES_DATA[0]);

  const quizShapes = useMemo(() => {
    const filtered = SHAPES_DATA.filter((s) => s.level <= level);
    return filtered.slice(0, 5);
  }, [level]);

  const [quizIdx, setQuizIdx] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [sparkleKey, setSparkleKey] = useState(0);
  const [mascotMood, setMascotMood] = useState<MascotMood>(MascotMood.HAPPY);
  const [mascotMsg, setMascotMsg] = useState('Sentuh gambar bentuk untuk mengenal nama dan sisinya!');

  const targetShape = quizShapes[quizIdx] ?? SHAPES_DATA[0];

  const options = useMemo(() => {
    const others = SHAPES_DATA.filter((s) => s.id !== targetShape.id).slice(0, 2);
    return [targetShape, ...others].sort((a, b) =>
      ((a.name.charCodeAt(0) + quizIdx) % 5) - ((b.name.charCodeAt(0) + quizIdx) % 5)
    );
  }, [targetShape, quizIdx]);

  const handleSelectShape = (shape: ShapeItem) => {
    setActiveShape(shape);
    setMascotMood(MascotMood.SPEAKING);
    setMascotMsg(`Ini adalah ${shape.name}. ${shape.sidesLabel}.`);
    audioEngine.playTileTap();
    audioEngine.speak(`Ini bentuk ${shape.name.toLowerCase()}. ${shape.sidesLabel}.`);
  };

  const handleAnswer = (chosen: ShapeItem) => {
    if (chosen.id === targetShape.id) {
      setSparkleKey((k) => k + 1);
      audioEngine.playCorrectLetter();
      setMascotMood(MascotMood.CHEERING);
      setMascotMsg(`Benar sekali! Itu adalah bentuk ${targetShape.name}!`);
      audioEngine.speak(`Benar! Itu bentuk ${targetShape.name.toLowerCase()}!`);

      window.setTimeout(() => {
        if (quizIdx + 1 < quizShapes.length) {
          const next = quizShapes[quizIdx + 1];
          setQuizIdx((i) => i + 1);
          setMascotMood(MascotMood.HAPPY);
          setMascotMsg(`Sekarang cari bentuk ${next.name}!`);
          audioEngine.speak(`Yang manakah bentuk ${next.name.toLowerCase()}?`);
        } else {
          onCompleteRound({
            correctCount: quizShapes.length,
            mistakesCount: mistakes,
            hintsUsed: 0,
            detailText: `Mengenal dan mencocokkan ${quizShapes.length} bentuk geometri`,
          });
        }
      }, 850);
    } else {
      setMistakes((m) => m + 1);
      setMascotMood(MascotMood.ENCOURAGING);
      setMascotMsg('Ayo perhatikan bentuknya lagi, kamu pasti bisa!');
      audioEngine.playGentleTryAgain();
      audioEngine.speak('Ayo coba lagi, kamu pasti bisa!');
    }
  };

  return (
    <div className="space-y-6">
      <SparkleBurstCanvas burstKey={sparkleKey} intensity="small" />
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-4 border-2 border-teal-100 shadow-xs">
        <Mascot mood={mascotMood} message={mascotMsg} size="sm" />
        <div className="flex items-center gap-2 bg-teal-50 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setMode('explore')}
            className={`px-4 py-2 rounded-xl text-sm font-bold cursor-pointer ${
              mode === 'explore' ? 'bg-teal-600 text-white' : 'text-teal-900 hover:bg-teal-100'
            }`}
          >
            Kenali Bentuk
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('quiz');
              setQuizIdx(0);
              setMistakes(0);
              setMascotMsg(`Mana bentuk ${quizShapes[0].name}?`);
              audioEngine.speak(`Yang manakah bentuk ${quizShapes[0].name.toLowerCase()}?`);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-bold cursor-pointer ${
              mode === 'quiz' ? 'bg-teal-600 text-white' : 'text-teal-900 hover:bg-teal-100'
            }`}
          >
            Tebak Bentuk
          </button>
        </div>
      </div>

      {mode === 'explore' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-3xl border-2 border-teal-100 p-6 flex flex-col items-center text-center gap-4 shadow-sm">
            <div className="bg-teal-50/70 rounded-3xl p-8 border border-teal-100">
              <ShapeSvg type={activeShape.shapeType} colorHex={activeShape.colorHex} sizeClass="w-36 h-36" />
            </div>
            <div>
              <h3 className="font-display text-3xl font-extrabold text-slate-900">
                {activeShape.name}
              </h3>
              <p className="text-sm font-semibold text-slate-500 mt-1">
                {activeShape.sidesLabel} · Contoh: {activeShape.exampleObject}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                audioEngine.speak(`Ini adalah ${activeShape.name.toLowerCase()}. ${activeShape.sidesLabel}.`)
              }
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
              <span>Dengarkan Bentuk</span>
            </button>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-teal-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-slate-800">
                Pilih Bentuk Geometri
              </h3>
              <button
                type="button"
                onClick={() => {
                  setMode('quiz');
                  setQuizIdx(0);
                  audioEngine.speak(`Yang manakah bentuk ${quizShapes[0].name.toLowerCase()}?`);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Main Tebak Bentuk</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SHAPES_DATA.map((shape) => {
                const active = activeShape.id === shape.id;
                return (
                  <motion.button
                    key={shape.id}
                    type="button"
                    whileTap={{ scale: 0.94 }}
                    onClick={() => handleSelectShape(shape)}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 cursor-pointer ${
                      active
                        ? 'bg-teal-100 border-teal-500'
                        : 'bg-slate-50 hover:bg-teal-50 border-slate-100'
                    }`}
                  >
                    <ShapeSvg type={shape.shapeType} colorHex={shape.colorHex} sizeClass="w-14 h-14" />
                    <span className="font-display text-xs font-extrabold text-slate-800">
                      {shape.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border-2 border-teal-100 p-6 md:p-10 text-center space-y-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500 tabular-nums">
            Bentuk {quizIdx + 1} / {quizShapes.length}
          </p>
          <h3 className="font-display text-3xl font-extrabold text-slate-900">
            Yang manakah bentuk <span className="text-teal-600">{targetShape.name}</span>?
          </h3>
          <button
            type="button"
            onClick={() => audioEngine.speak(`Yang manakah bentuk ${targetShape.name.toLowerCase()}?`)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-teal-100 text-teal-800 font-bold cursor-pointer"
          >
            <Volume2 className="w-5 h-5" />
            <span>Dengarkan Pertanyaan</span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {options.map((opt) => (
              <motion.button
                key={opt.id}
                type="button"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleAnswer(opt)}
                aria-label={`Pilih bentuk ${opt.name}`}
                className="bg-sky-50/70 hover:bg-teal-50 border-2 border-sky-200 hover:border-teal-400 rounded-3xl p-6 flex flex-col items-center gap-2 cursor-pointer"
              >
                <ShapeSvg type={opt.shapeType} colorHex={opt.colorHex} sizeClass="w-24 h-24" />
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
