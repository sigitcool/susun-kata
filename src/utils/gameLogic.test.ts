import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeParentInsights,
  buildLetterTracePaths,
  calculateLevelFromXP,
  calculateStarsEarned,
  checkWordAssembly,
  createSparkleBurstSeeds,
  findNextEmptySlotIndex,
  getHintTileForNextSlot,
  isDifficultyUnlocked,
  placeLetterInSlot,
  scrambleLetters,
} from './gameLogic';
import { AvatarId, DifficultyLevel, GameCategory, PlayerProgress } from '../types/game';
import {
  ANIMALS_DATA,
  CATEGORIES_META,
  COLORS_DATA,
  LETTERS_DATA,
  NUMBERS_DATA,
  QUIZ_ITEMS_DATA,
  WORDS_DATA,
} from '../data/curriculum';
import { getRealImageUrl } from '../data/realImages';

function createMockProgress(): PlayerProgress {
  const emptyCategoryStats = Object.values(GameCategory).reduce(
    (acc, cat) => {
      acc[cat] = {
        gamesPlayed: 0,
        correctCount: 0,
        totalAttempts: 0,
        starsEarned: 0,
        completedLevels: [],
      };
      return acc;
    },
    {} as PlayerProgress['categoryStats']
  );

  return {
    profile: { name: 'Alya', avatar: AvatarId.RABBIT },
    xp: 0,
    totalStars: 0,
    totalGamesPlayed: 0,
    totalCorrectAnswers: 0,
    totalMistakes: 0,
    unlockedBadges: [],
    lastPlayedCategory: null,
    lastPlayedLevel: null,
    categoryStats: emptyCategoryStats,
    history: [],
    audio: {
      volume: 0.8,
      voiceEnabled: true,
      sfxEnabled: true,
      musicEnabled: false,
      voiceRate: 0.92,
      hintsAlwaysAvailable: true,
      unlockAllLevels: false,
    },
  };
}

test('calculateLevelFromXP computes levels and progress cleanly', () => {
  const l1 = calculateLevelFromXP(0);
  assert.equal(l1.level, 1);
  assert.equal(l1.progressPercent, 0);

  const l2 = calculateLevelFromXP(180);
  assert.equal(l2.level, 2);
  assert.equal(l2.currentLevelXp, 60);
  assert.equal(l2.progressPercent, 50);
});

test('scrambleLetters preserves exact character multiset and avoids unscrambled word', () => {
  const tiles = scrambleLetters('BUKU', () => 0.42);
  assert.equal(tiles.length, 4);
  const sorted = tiles.map((t) => t.char).sort().join('');
  assert.equal(sorted, 'BKUU');
  assert.notEqual(tiles.map((t) => t.char).join(''), 'BUKU');
});

test('placeLetterInSlot handles BUKU assembly step-by-step and rejects wrong letters gently', () => {
  const bank = [
    { id: 't1', char: 'U' },
    { id: 't2', char: 'B' },
    { id: 't3', char: 'K' },
    { id: 't4', char: 'U' },
  ];
  let slots: Array<{ id: string; char: string } | null> = [null, null, null, null];

  // Wrong letter in slot 0 (expects B, given U)
  const wrong = placeLetterInSlot(slots, bank, 't1', 0, 'BUKU');
  assert.equal(wrong.accepted, false);
  assert.equal(wrong.reason, 'wrong_letter');

  // Correct letter B in slot 0
  const step1 = placeLetterInSlot(slots, bank, 't2', 0, 'BUKU');
  assert.equal(step1.accepted, true);
  slots = step1.slots;
  assert.equal(findNextEmptySlotIndex(slots), 1);

  // Hint finds U for slot 1
  const hint = getHintTileForNextSlot(slots, step1.bank, 'BUKU');
  assert.ok(hint !== null);
  assert.equal(hint.slotIndex, 1);
  assert.equal(hint.tile.char, 'U');

  // Complete remaining letters
  const step2 = placeLetterInSlot(slots, step1.bank, hint.tile.id, 1, 'BUKU');
  const step3 = placeLetterInSlot(step2.slots, step2.bank, 't3', 2, 'BUKU');
  const lastU = step3.bank[0];
  const step4 = placeLetterInSlot(step3.slots, step3.bank, lastU.id, 3, 'BUKU');

  const check = checkWordAssembly(step4.slots, 'BUKU');
  assert.equal(check.isComplete, true);
  assert.equal(check.isAllCorrect, true);
  assert.equal(check.assembledWord, 'BUKU');
});

test('calculateStarsEarned always rewards >= 1 star and scales with mistakes', () => {
  const perfect = calculateStarsEarned(0, 0, 5);
  assert.equal(perfect.stars, 3);

  const someMistakes = calculateStarsEarned(2, 0, 5);
  assert.equal(someMistakes.stars, 2);

  const manyMistakes = calculateStarsEarned(10, 4, 5);
  assert.equal(manyMistakes.stars, 1);
});

test('isDifficultyUnlocked unlocks Level 2 after Level 1 completion', () => {
  const progress = createMockProgress();
  assert.equal(isDifficultyUnlocked(progress, GameCategory.SUSUN_KATA, DifficultyLevel.PEMULA), true);
  assert.equal(isDifficultyUnlocked(progress, GameCategory.SUSUN_KATA, DifficultyLevel.MENENGAH), false);

  progress.categoryStats[GameCategory.SUSUN_KATA].completedLevels.push(DifficultyLevel.PEMULA);
  assert.equal(isDifficultyUnlocked(progress, GameCategory.SUSUN_KATA, DifficultyLevel.MENENGAH), true);
  assert.equal(isDifficultyUnlocked(progress, GameCategory.SUSUN_KATA, DifficultyLevel.MAHIR), false);
});

test('analyzeParentInsights categorizes mastered and needs-practice categories', () => {
  const progress = createMockProgress();
  progress.totalGamesPlayed = 2;
  progress.categoryStats[GameCategory.SUSUN_KATA] = {
    gamesPlayed: 1,
    correctCount: 9,
    totalAttempts: 10,
    starsEarned: 3,
    completedLevels: [DifficultyLevel.PEMULA],
  };
  progress.categoryStats[GameCategory.MENGENAL_ANGKA] = {
    gamesPlayed: 1,
    correctCount: 2,
    totalAttempts: 5,
    starsEarned: 1,
    completedLevels: [],
  };

  const report = analyzeParentInsights(progress);
  assert.ok(report.masteredCategories.includes(GameCategory.SUSUN_KATA));
  assert.ok(report.needsPracticeCategories.includes(GameCategory.MENGENAL_ANGKA));
  assert.equal(report.overallAccuracyPercent, 73);
});

test('buildLetterTracePaths provides valid SVG strokes for all A-Z letters', () => {
  for (let code = 65; code <= 90; code++) {
    const ch = String.fromCharCode(code);
    const paths = buildLetterTracePaths(ch);
    assert.ok(paths.length >= 1, `Letter ${ch} should have stroke paths`);
  }
});

test('createSparkleBurstSeeds returns deterministic golden/pastel star seeds for small and celebration intensities', () => {
  const deterministicRng = () => 0.5;
  const smallSeeds = createSparkleBurstSeeds('small', deterministicRng);
  const celebrationSeeds = createSparkleBurstSeeds('celebration', deterministicRng);

  assert.equal(smallSeeds.length, 20);
  assert.equal(celebrationSeeds.length, 42);

  for (const seed of [...smallSeeds, ...celebrationSeeds]) {
    assert.ok(seed.starPoints === 4 || seed.starPoints === 5);
    assert.ok(seed.speed > 0);
    assert.ok(seed.size > 0);
    assert.match(seed.color, /^#[0-9A-F]{6}$/i);
  }
});

test('every curriculum item has a valid real internet image URL', () => {
  const allKeys = new Set<string>();
  for (const c of CATEGORIES_META) allKeys.add(c.illustrationKey);
  for (const l of LETTERS_DATA) allKeys.add(l.illustrationKey);
  for (const w of WORDS_DATA) allKeys.add(w.illustrationKey);
  for (const a of ANIMALS_DATA) allKeys.add(a.illustrationKey);
  for (const n of NUMBERS_DATA) allKeys.add(n.illustrationKey);
  for (const c of COLORS_DATA) allKeys.add(c.illustrationKey);
  for (const q of QUIZ_ITEMS_DATA) allKeys.add(q.illustrationKey);

  for (const key of allKeys) {
    const url = getRealImageUrl(key);
    assert.ok(url, `Missing real image URL for key "${key}"`);
    assert.match(url, /^https:\/\//);
  }
});


