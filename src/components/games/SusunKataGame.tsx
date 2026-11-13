import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Lightbulb, RotateCcw, Sparkles, Volume2 } from 'lucide-react';
import { WORDS_DATA } from '../../data/curriculum';
import { DifficultyLevel, LetterTile, MascotMood, WordItem } from '../../types/game';
import { audioEngine } from '../../utils/audioEngine';
import {
  checkWordAssembly,
  findNextEmptySlotIndex,
  getHintTileForNextSlot,
  placeLetterInSlot,
  scrambleLetters,
} from '../../utils/gameLogic';
import { ConfettiCanvas } from '../ConfettiCanvas';
import { SparkleBurstCanvas } from '../SparkleBurstCanvas';
import { ItemIllustration } from '../illustrations/ItemIllustration';
import { Mascot } from '../Mascot';

interface SusunKataGameProps {
  level: DifficultyLevel;
  hintsAlwaysAvailable: boolean;
  onCompleteRound: (result: {
    correctCount: number;
    mistakesCount: number;
    hintsUsed: number;
    detailText: string;
  }) => void;
}

export const SusunKataGame: React.FC<SusunKataGameProps> = ({
  level,
  hintsAlwaysAvailable,
  onCompleteRound,
}) => {
  const levelWords: WordItem[] = useMemo(() => {
    const filtered = WORDS_DATA.filter((w) => w.level === level);
    return filtered.slice(0, 5);
  }, [level]);

  const [wordIndex, setWordIndex] = useState(0);
  const currentWord = levelWords[wordIndex] ?? WORDS_DATA[0];

  const [slots, setSlots] = useState<Array<LetterTile | null>>([]);
  const [bank, setBank] = useState<LetterTile[]>([]);
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);
  const [draggedTileId, setDraggedTileId] = useState<string | null>(null);
  const [wiggleTileId, setWiggleTileId] = useState<string | null>(null);
  const [justPlacedSlot, setJustPlacedSlot] = useState<number | null>(null);
  const [wordSolved, setWordSolved] = useState(false);

  const [mistakes, setMistakes] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [sparkleKey, setSparkleKey] = useState(0);
  const [sparkleIntensity, setSparkleIntensity] = useState<'small' | 'celebration'>('small');
  const [mascotMood, setMascotMood] = useState<MascotMood>(MascotMood.HAPPY);
  const [mascotMsg, setMascotMsg] = useState(
    'Klik tombol suara untuk mendengar kata, lalu susun hurufnya!'
  );

  // Initialize each word
  useEffect(() => {
    const chars = currentWord.word.split('');
    setSlots(Array(chars.length).fill(null));
    setBank(scrambleLetters(currentWord.word));
    setSelectedTileId(null);
    setDraggedTileId(null);
    setWordSolved(false);
    setMascotMood(MascotMood.SPEAKING);
    setMascotMsg(`Ini adalah ${currentWord.word.toLowerCase()}. Ayo susun hurufnya!`);

    const timer = window.setTimeout(() => {
      if (level === DifficultyLevel.MAHIR) {
        audioEngine.speak(`Tebak dan susun kata: ${currentWord.word}`);
      } else {
        audioEngine.speakWordAndSpell(currentWord.word);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [currentWord, level]);

  const handleTryPlace = (tileId: string, targetSlotIndex: number) => {
    if (wordSolved) return;
    const outcome = placeLetterInSlot(
      slots,
      bank,
      tileId,
      targetSlotIndex,
      currentWord.word
    );

    if (outcome.accepted) {
      setSlots(outcome.slots);
      setBank(outcome.bank);
      setSelectedTileId(null);
      setJustPlacedSlot(targetSlotIndex);
      window.setTimeout(() => setJustPlacedSlot(null), 400);

      const assembly = checkWordAssembly(outcome.slots, currentWord.word);
      if (assembly.isAllCorrect) {
        setWordSolved(true);
        setSparkleIntensity('celebration');
        setSparkleKey((k) => k + 1);
        setMascotMood(MascotMood.CHEERING);
        setMascotMsg(`Hebat! Kamu berhasil menyusun kata ${currentWord.word}!`);
        audioEngine.playCelebrationFanfare();
        window.setTimeout(() => {
          audioEngine.speak(`Hebat! Kamu berhasil menyusun kata ${currentWord.word}!`);
        }, 280);
      } else {
        setSparkleIntensity('small');
        setSparkleKey((k) => k + 1);
        setMascotMood(MascotMood.HAPPY);
        setMascotMsg('Bagus! Lanjutkan huruf berikutnya.');
        audioEngine.playCorrectLetter();
      }
    } else if (outcome.reason === 'wrong_letter') {
      setMistakes((m) => m + 1);
      setWiggleTileId(tileId);
      window.setTimeout(() => setWiggleTileId(null), 450);
      setMascotMood(MascotMood.ENCOURAGING);
      setMascotMsg('Ayo coba lagi, kamu pasti bisa!');
      audioEngine.playGentleTryAgain();
      audioEngine.speak('Ayo coba lagi, kamu pasti bisa!');
    }
  };

  const handleTapTile = (tile: LetterTile) => {
    if (wordSolved) return;
    audioEngine.playTileTap();
    audioEngine.speak(tile.char, { rate: 0.85, pitch: 1.2 });
    const nextSlot = findNextEmptySlotIndex(slots);
    if (nextSlot !== -1) {
      handleTryPlace(tile.id, nextSlot);
    } else {
      setSelectedTileId(tile.id);
    }
  };

  const handleTapSlot = (slotIdx: number) => {
    if (wordSolved) return;
    if (selectedTileId) {
      handleTryPlace(selectedTileId, slotIdx);
    }
  };

  const handleHint = () => {
    if (wordSolved) return;
    const hint = getHintTileForNextSlot(slots, bank, currentWord.word);
    if (!hint) return;
    setHintsUsed((h) => h + 1);
    setMascotMood(MascotMood.THINKING);
    setMascotMsg(`Petunjuk: Huruf berikutnya adalah ${hint.tile.char} (${currentWord.hint})`);
    audioEngine.speak(`Huruf berikutnya adalah ${hint.tile.char}`);
    handleTryPlace(hint.tile.id, hint.slotIndex);
  };

  const handleResetWord = () => {
    const chars = currentWord.word.split('');
    setSlots(Array(chars.length).fill(null));
    setBank(scrambleLetters(currentWord.word));
    setSelectedTileId(null);
    setWordSolved(false);
    setMascotMood(MascotMood.HAPPY);
    setMascotMsg(`Ayo susun lagi kata ${currentWord.word}!`);
    audioEngine.speakWordAndSpell(currentWord.word);
  };

  const handleNextWord = () => {
    if (wordIndex + 1 < levelWords.length) {
      setWordIndex((i) => i + 1);
    } else {
      onCompleteRound({
        correctCount: levelWords.length,
        mistakesCount: mistakes,
        hintsUsed,
        detailText: `Menyusun ${levelWords.length} kata: ${levelWords.map((w) => w.word).join(', ')}`,
      });
    }
  };

  const showHintButton = level !== DifficultyLevel.MAHIR || hintsAlwaysAvailable;

  return (
    <div className="space-y-4">
      <ConfettiCanvas active={wordSolved} />
      <SparkleBurstCanvas burstKey={sparkleKey} intensity={sparkleIntensity} />

      {/* Progress & Mascot header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white/90 rounded-3xl p-3.5 md:p-4 border-2 border-sky-100 shadow-xs">
        <Mascot
          mood={mascotMood}
          message={mascotMsg}
          size="sm"
          onClick={() => audioEngine.speak(mascotMsg)}
        />
        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-500">Kata ke</p>
            <p className="font-display text-lg font-extrabold text-sky-700 tabular-nums">
              {wordIndex + 1} / {levelWords.length}
            </p>
          </div>
          <div className="w-24 h-3 bg-sky-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full transition-all duration-300"
              style={{ width: `${((wordIndex + (wordSolved ? 1 : 0)) / levelWords.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stage 1: Picture & Audio Stage */}
      <div className="bg-white rounded-3xl border-2 border-sky-100 p-4 md:p-6 shadow-sm flex flex-col items-center text-center gap-4">
        <div className="bg-gradient-to-b from-sky-50 to-amber-50/60 rounded-3xl px-6 py-4 border border-sky-100 flex flex-col items-center">
          {level === DifficultyLevel.MAHIR && !wordSolved ? (
            <div className="flex flex-col items-center gap-2 py-3 px-5">
              <div className="w-24 h-24 rounded-full bg-violet-100 border-4 border-violet-300 flex items-center justify-center">
                <Volume2 className="w-12 h-12 text-violet-600" />
              </div>
              <p className="text-sm font-semibold text-violet-700">
                Mode Mahir: Dengarkan suara kata dan susun hurufnya!
              </p>
            </div>
          ) : (
            <motion.div
              key={currentWord.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              <ItemIllustration itemKey={currentWord.illustrationKey} size="lg" />
            </motion.div>
          )}
          <p className="mt-1.5 text-xs font-semibold text-slate-500">
            {currentWord.categoryLabel} · {currentWord.hint}
          </p>
        </div>

        {/* Audio & Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={() => audioEngine.speakWordAndSpell(currentWord.word)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm md:text-base shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Volume2 className="w-5 h-5" />
            <span>Dengarkan Kata</span>
          </button>

          <button
            type="button"
            onClick={() => audioEngine.speakSpellingOnly(currentWord.word)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-violet-100 hover:bg-violet-200 text-violet-800 font-bold text-sm md:text-base transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Dengarkan Ejaan</span>
          </button>

          {showHintButton && (
            <button
              type="button"
              onClick={handleHint}
              disabled={wordSolved}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 disabled:opacity-50 text-amber-900 font-bold text-sm md:text-base transition-all cursor-pointer"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Petunjuk</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleResetWord}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm md:text-base transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ulangi</span>
          </button>
        </div>

        {/* Stage 2: Empty Letter Slots */}
        <div
          aria-label="Kotak susun huruf"
          className="flex flex-wrap items-center justify-center gap-2.5 md:gap-3.5"
        >
          {slots.map((placed, idx) => {
            const isBounce = justPlacedSlot === idx;
            return (
              <div
                key={`slot-${idx}`}
                data-testid={`letter-slot-${idx}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const droppedId = e.dataTransfer.getData('text/plain') || draggedTileId;
                  if (droppedId) {
                    handleTryPlace(droppedId, idx);
                    setDraggedTileId(null);
                  }
                }}
              >
                <button
                  type="button"
                  onClick={() => handleTapSlot(idx)}
                  aria-label={placed ? `Kotak ${idx + 1} terisi ${placed.char}` : `Kotak kosong ${idx + 1}`}
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl border-3 font-display text-2xl md:text-3xl font-extrabold flex items-center justify-center transition-all cursor-pointer ${
                    placed
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-sm'
                      : 'bg-sky-50 border-dashed border-sky-300 text-sky-400 hover:border-sky-500'
                  } ${isBounce ? 'animate-pop-bounce' : ''}`}
                >
                  {placed ? placed.char : '?'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Stage 3: Scrambled Letter Bank */}
        {!wordSolved ? (
          <div className="w-full">
            <p className="text-xs font-semibold text-slate-500 mb-2.5">
              Seret huruf ke kotak di atas atau ketuk huruf untuk menyusun kata
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5 md:gap-3.5">
              {bank.map((tile) => {
                const isWiggling = wiggleTileId === tile.id;
                const isSelected = selectedTileId === tile.id;
                return (
                  <motion.button
                    key={tile.id}
                    type="button"
                    data-testid={`letter-tile-${tile.char}`}
                    draggable
                    onDragStart={(e: unknown) => {
                      const dragEvent = e as React.DragEvent<HTMLButtonElement>;
                      dragEvent.dataTransfer?.setData('text/plain', tile.id);
                      setDraggedTileId(tile.id);
                    }}
                    onClick={() => handleTapTile(tile)}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.92 }}
                    aria-label={`Pilih huruf ${tile.char}`}
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl border-b-4 font-display text-2xl md:text-3xl font-extrabold flex items-center justify-center shadow-sm transition-colors cursor-grab active:cursor-grabbing ${
                      isSelected
                        ? 'bg-amber-300 border-amber-600 text-slate-900 ring-4 ring-amber-200'
                        : 'bg-amber-100 hover:bg-amber-200 border-amber-400 text-amber-950'
                    } ${isWiggling ? 'animate-wiggle bg-rose-100 border-rose-400' : ''}`}
                  >
                    {tile.char}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-5 space-y-4"
          >
            <p className="font-display text-2xl font-extrabold text-emerald-800">
              Hebat! Kata {currentWord.word} Benar!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleResetWord}
                className="px-5 py-3 rounded-2xl bg-white border-2 border-emerald-300 text-emerald-800 font-bold hover:bg-emerald-100 cursor-pointer"
              >
                ULANGI
              </button>
              <button
                type="button"
                onClick={handleNextWord}
                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-sm cursor-pointer"
              >
                {wordIndex + 1 < levelWords.length ? 'LANJUTKAN' : 'LIHAT HADIAH'}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
