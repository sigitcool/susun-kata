import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Volume2 } from 'lucide-react';
import { DifficultyLevel, MascotMood } from '../../types/game';
import { audioEngine } from '../../utils/audioEngine';
import { ItemIllustration } from '../illustrations/ItemIllustration';
import { Mascot } from '../Mascot';
import { SparkleBurstCanvas } from '../SparkleBurstCanvas';

interface PasangkanGambarGameProps {
  level: DifficultyLevel;
  onCompleteRound: (result: {
    correctCount: number;
    mistakesCount: number;
    hintsUsed: number;
    detailText: string;
  }) => void;
}

type PairMode = 'pic_pic' | 'pic_word' | 'sound_pic';

interface PairCard {
  id: string;
  pairKey: string;
  displayType: 'image' | 'word' | 'sound';
  label: string;
  illustrationKey: string;
}

const PAIR_ITEMS = [
  { key: 'buku', label: 'BUKU' },
  { key: 'bola', label: 'BOLA' },
  { key: 'apel', label: 'APEL' },
  { key: 'ikan', label: 'IKAN' },
  { key: 'kucing', label: 'KUCING' },
  { key: 'topi', label: 'TOPI' },
];

export const PasangkanGambarGame: React.FC<PasangkanGambarGameProps> = ({
  level,
  onCompleteRound,
}) => {
  const [pairMode, setPairMode] = useState<PairMode>('pic_word');
  const pairCount = level === DifficultyLevel.PEMULA ? 3 : level === DifficultyLevel.MENENGAH ? 4 : 5;

  const activeItems = useMemo(() => PAIR_ITEMS.slice(0, pairCount), [pairCount]);

  const cards: PairCard[] = useMemo(() => {
    const left: PairCard[] = activeItems.map((it) => ({
      id: `left-${it.key}`,
      pairKey: it.key,
      displayType: pairMode === 'sound_pic' ? 'sound' : 'image',
      label: it.label,
      illustrationKey: it.key,
    }));

    const right: PairCard[] = activeItems.map((it) => ({
      id: `right-${it.key}`,
      pairKey: it.key,
      displayType: pairMode === 'pic_word' ? 'word' : 'image',
      label: it.label,
      illustrationKey: it.key,
    }));

    // Deterministic scramble for right column
    const shuffledRight = [...right].sort((a, b) =>
      ((a.label.charCodeAt(0) * 3 + pairMode.length) % 11) -
      ((b.label.charCodeAt(0) * 3 + pairMode.length) % 11)
    );

    return [...left, ...shuffledRight];
  }, [activeItems, pairMode]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [matchedKeys, setMatchedKeys] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [sparkleKey, setSparkleKey] = useState(0);
  const [sparkleIntensity, setSparkleIntensity] = useState<'small' | 'celebration'>('small');
  const [mascotMood, setMascotMood] = useState<MascotMood>(MascotMood.HAPPY);
  const [mascotMsg, setMascotMsg] = useState('Pilih dua kartu yang berpasangan!');

  const handleModeSwitch = (nextMode: PairMode) => {
    setPairMode(nextMode);
    setSelectedIds([]);
    setMatchedKeys([]);
    setMistakes(0);
    setMascotMood(MascotMood.HAPPY);
    setMascotMsg(
      nextMode === 'pic_pic'
        ? 'Cocokkan gambar yang sama!'
        : nextMode === 'pic_word'
          ? 'Cocokkan gambar dengan katanya!'
          : 'Dengarkan suara lalu cocokkan dengan gambarnya!'
    );
  };

  const handleCardTap = (card: PairCard) => {
    if (matchedKeys.includes(card.pairKey)) return;

    if (card.displayType === 'sound') {
      audioEngine.speak(card.label.toLowerCase());
    } else {
      audioEngine.playTileTap();
    }

    if (selectedIds.includes(card.id)) {
      setSelectedIds(selectedIds.filter((id) => id !== card.id));
      return;
    }

    const nextSelected = [...selectedIds, card.id];
    setSelectedIds(nextSelected);

    if (nextSelected.length === 2) {
      const first = cards.find((c) => c.id === nextSelected[0]);
      const second = cards.find((c) => c.id === nextSelected[1]);

      if (first && second && first.pairKey === second.pairKey) {
        const nextMatched = [...matchedKeys, first.pairKey];
        setMatchedKeys(nextMatched);
        setSelectedIds([]);
        setSparkleIntensity(nextMatched.length === activeItems.length ? 'celebration' : 'small');
        setSparkleKey((k) => k + 1);
        audioEngine.playCorrectLetter();
        setMascotMood(MascotMood.CHEERING);
        setMascotMsg(`Cocok! Pasangan ${first.label} ditemukan!`);
        audioEngine.speak(`Cocok! ${first.label.toLowerCase()}.`);

        if (nextMatched.length === activeItems.length) {
          const modeLabel =
            pairMode === 'pic_word'
              ? 'Gambar & Kata'
              : pairMode === 'pic_pic'
                ? 'Gambar & Gambar'
                : 'Suara & Gambar';
          window.setTimeout(() => {
            onCompleteRound({
              correctCount: activeItems.length,
              mistakesCount: mistakes,
              hintsUsed: 0,
              detailText: `Memasangkan ${activeItems.length} kartu (${modeLabel})`,
            });
          }, 700);
        }
      } else {
        setMistakes((m) => m + 1);
        setMascotMood(MascotMood.ENCOURAGING);
        setMascotMsg('Belum cocok, ayo coba pasangan lain!');
        audioEngine.playGentleTryAgain();
        window.setTimeout(() => {
          setSelectedIds([]);
        }, 550);
      }
    }
  };

  const leftCards = cards.filter((c) => c.id.startsWith('left-'));
  const rightCards = cards.filter((c) => c.id.startsWith('right-'));

  return (
    <div className="space-y-6">
      <SparkleBurstCanvas burstKey={sparkleKey} intensity={sparkleIntensity} />
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-4 border-2 border-indigo-100 shadow-xs">
        <Mascot mood={mascotMood} message={mascotMsg} size="sm" />
        <div className="flex flex-wrap items-center gap-1.5 bg-indigo-50 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => handleModeSwitch('pic_word')}
            className={`px-3 py-2 rounded-xl text-xs md:text-sm font-bold cursor-pointer ${
              pairMode === 'pic_word' ? 'bg-indigo-600 text-white' : 'text-indigo-900 hover:bg-indigo-100'
            }`}
          >
            Gambar & Kata
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch('pic_pic')}
            className={`px-3 py-2 rounded-xl text-xs md:text-sm font-bold cursor-pointer ${
              pairMode === 'pic_pic' ? 'bg-indigo-600 text-white' : 'text-indigo-900 hover:bg-indigo-100'
            }`}
          >
            Gambar & Gambar
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch('sound_pic')}
            className={`px-3 py-2 rounded-xl text-xs md:text-sm font-bold cursor-pointer ${
              pairMode === 'sound_pic' ? 'bg-indigo-600 text-white' : 'text-indigo-900 hover:bg-indigo-100'
            }`}
          >
            Suara & Gambar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border-2 border-indigo-100 p-5 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-slate-600 tabular-nums">
            Pasangan ditemukan: {matchedKeys.length} / {activeItems.length}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-8 max-w-3xl mx-auto">
          {/* Left Column */}
          <div className="space-y-3">
            {leftCards.map((card) => {
              const isMatched = matchedKeys.includes(card.pairKey);
              const isSelected = selectedIds.includes(card.id);
              return (
                <motion.button
                  key={card.id}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  disabled={isMatched}
                  onClick={() => handleCardTap(card)}
                  className={`w-full h-24 rounded-2xl border-2 flex items-center justify-center gap-3 px-4 cursor-pointer transition-all ${
                    isMatched
                      ? 'bg-emerald-100 border-emerald-400 opacity-75'
                      : isSelected
                        ? 'bg-amber-100 border-amber-500 ring-4 ring-amber-200'
                        : 'bg-sky-50 hover:bg-sky-100 border-sky-200'
                  }`}
                >
                  {card.displayType === 'sound' ? (
                    <div className="flex items-center gap-2 text-indigo-700 font-bold">
                      <Volume2 className="w-6 h-6" />
                      <span>Dengar Suara</span>
                    </div>
                  ) : (
                    <ItemIllustration itemKey={card.illustrationKey} size="sm" />
                  )}
                  {isMatched && <Check className="w-5 h-5 text-emerald-700" />}
                </motion.button>
              );
            })}
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            {rightCards.map((card) => {
              const isMatched = matchedKeys.includes(card.pairKey);
              const isSelected = selectedIds.includes(card.id);
              return (
                <motion.button
                  key={card.id}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  disabled={isMatched}
                  onClick={() => handleCardTap(card)}
                  className={`w-full h-24 rounded-2xl border-2 flex items-center justify-center gap-3 px-4 cursor-pointer transition-all ${
                    isMatched
                      ? 'bg-emerald-100 border-emerald-400 opacity-75'
                      : isSelected
                        ? 'bg-amber-100 border-amber-500 ring-4 ring-amber-200'
                        : 'bg-violet-50 hover:bg-violet-100 border-violet-200'
                  }`}
                >
                  {card.displayType === 'word' ? (
                    <span className="font-display text-xl md:text-2xl font-extrabold text-slate-900">
                      {card.label}
                    </span>
                  ) : (
                    <ItemIllustration itemKey={card.illustrationKey} size="sm" />
                  )}
                  {isMatched && <Check className="w-5 h-5 text-emerald-700" />}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
