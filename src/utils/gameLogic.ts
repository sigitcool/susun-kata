import {
  BadgeDefinition,
  CategoryProgress,
  DifficultyLevel,
  GameCategory,
  LetterTile,
  PlayerProgress,
} from '../types/game';

export interface LevelInfo {
  level: number;
  title: string;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
}

const LEVEL_TITLES = [
  'Penjelajah Kecil',
  'Bintang Pemula',
  'Sahabat Huruf',
  'Pembaca Ceria',
  'Penghitung Hebat',
  'Juara Warna',
  'Petualang Cerdas',
  'Bintang Bersinar',
  'Juara Cilik',
  'Master Ceria',
];

export function calculateLevelFromXP(xp: number): LevelInfo {
  const safeXp = Math.max(0, Math.floor(xp));
  const xpPerLevel = 120;
  const level = Math.floor(safeXp / xpPerLevel) + 1;
  const currentLevelXp = safeXp % xpPerLevel;
  const progressPercent = Math.min(100, Math.round((currentLevelXp / xpPerLevel) * 100));
  const titleIndex = Math.min(LEVEL_TITLES.length - 1, level - 1);

  return {
    level,
    title: LEVEL_TITLES[titleIndex],
    currentLevelXp,
    nextLevelXp: xpPerLevel,
    progressPercent,
  };
}

export function scrambleLetters(word: string, rng: () => number = Math.random): LetterTile[] {
  const clean = word.trim().toUpperCase();
  const chars = clean.split('');
  const tiles: LetterTile[] = chars.map((char, index) => ({
    id: `tile-${index}-${char}`,
    char,
  }));

  if (tiles.length <= 1) {
    return tiles;
  }

  const hasDistinctChars = new Set(chars).size > 1;

  for (let attempt = 0; attempt < 12; attempt++) {
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const temp = tiles[i];
      tiles[i] = tiles[j];
      tiles[j] = temp;
    }

    const resulting = tiles.map((t) => t.char).join('');
    if (!hasDistinctChars || resulting !== clean) {
      return tiles;
    }
  }

  // Fallback swap first two distinct chars so it's never identical to target
  const firstDiff = tiles.findIndex((t) => t.char !== tiles[0].char);
  if (firstDiff > 0) {
    const tmp = tiles[0];
    tiles[0] = tiles[firstDiff];
    tiles[firstDiff] = tmp;
  }

  return tiles;
}

export interface WordAssemblyCheck {
  isComplete: boolean;
  isAllCorrect: boolean;
  slotValidity: Array<'empty' | 'correct' | 'wrong'>;
  assembledWord: string;
}

export function checkWordAssembly(
  slots: Array<LetterTile | null>,
  targetWord: string
): WordAssemblyCheck {
  const targetChars = targetWord.trim().toUpperCase().split('');
  const slotValidity: Array<'empty' | 'correct' | 'wrong'> = targetChars.map((expected, idx) => {
    const placed = slots[idx];
    if (!placed) return 'empty';
    return placed.char.toUpperCase() === expected ? 'correct' : 'wrong';
  });

  const isComplete = slots.length === targetChars.length && slots.every((s) => s !== null);
  const isAllCorrect = isComplete && slotValidity.every((v) => v === 'correct');
  const assembledWord = slots.map((s) => (s ? s.char : '_')).join('');

  return {
    isComplete,
    isAllCorrect,
    slotValidity,
    assembledWord,
  };
}

export interface SlotPlacementOutcome {
  accepted: boolean;
  slots: Array<LetterTile | null>;
  bank: LetterTile[];
  reason: 'correct' | 'wrong_letter' | 'slot_occupied' | 'invalid';
}

export function placeLetterInSlot(
  currentSlots: Array<LetterTile | null>,
  currentBank: LetterTile[],
  tileId: string,
  targetSlotIndex: number,
  targetWord: string
): SlotPlacementOutcome {
  const tile = currentBank.find((t) => t.id === tileId);
  const targetChars = targetWord.trim().toUpperCase().split('');

  if (!tile || targetSlotIndex < 0 || targetSlotIndex >= targetChars.length) {
    return {
      accepted: false,
      slots: currentSlots,
      bank: currentBank,
      reason: 'invalid',
    };
  }

  if (currentSlots[targetSlotIndex] !== null) {
    return {
      accepted: false,
      slots: currentSlots,
      bank: currentBank,
      reason: 'slot_occupied',
    };
  }

  const expectedChar = targetChars[targetSlotIndex];
  if (tile.char.toUpperCase() !== expectedChar) {
    return {
      accepted: false,
      slots: currentSlots,
      bank: currentBank,
      reason: 'wrong_letter',
    };
  }

  const nextSlots = [...currentSlots];
  nextSlots[targetSlotIndex] = tile;
  const nextBank = currentBank.filter((t) => t.id !== tileId);

  return {
    accepted: true,
    slots: nextSlots,
    bank: nextBank,
    reason: 'correct',
  };
}

export function findNextEmptySlotIndex(slots: Array<LetterTile | null>): number {
  return slots.findIndex((s) => s === null);
}

export function getHintTileForNextSlot(
  slots: Array<LetterTile | null>,
  bank: LetterTile[],
  targetWord: string
): { slotIndex: number; tile: LetterTile } | null {
  const slotIndex = findNextEmptySlotIndex(slots);
  if (slotIndex === -1) return null;
  const expectedChar = targetWord.trim().toUpperCase()[slotIndex];
  const tile = bank.find((t) => t.char.toUpperCase() === expectedChar);
  if (!tile) return null;
  return { slotIndex, tile };
}

export function calculateStarsEarned(
  mistakes: number,
  hintsUsed: number,
  totalItems: number
): { stars: number; xpEarned: number } {
  const safeItems = Math.max(1, totalItems);
  const penalty = mistakes + hintsUsed * 0.5;

  let stars = 3;
  if (penalty > Math.max(2, safeItems * 0.75)) {
    stars = 1;
  } else if (penalty > 0.5) {
    stars = 2;
  }

  const baseXp = safeItems * 15;
  const starBonus = stars * 15;
  return {
    stars,
    xpEarned: baseXp + starBonus,
  };
}

export function isDifficultyUnlocked(
  progress: PlayerProgress,
  category: GameCategory,
  level: DifficultyLevel
): boolean {
  if (level === DifficultyLevel.PEMULA) return true;
  if (progress.audio.unlockAllLevels) return true;

  const stats = progress.categoryStats[category];
  if (!stats) return false;

  if (level === DifficultyLevel.MENENGAH) {
    return stats.completedLevels.includes(DifficultyLevel.PEMULA);
  }
  if (level === DifficultyLevel.MAHIR) {
    return stats.completedLevels.includes(DifficultyLevel.MENENGAH);
  }
  return false;
}

export interface ParentInsightReport {
  totalGames: number;
  overallAccuracyPercent: number;
  masteredCategories: GameCategory[];
  needsPracticeCategories: GameCategory[];
  unexploredCategories: GameCategory[];
}

export function analyzeParentInsights(progress: PlayerProgress): ParentInsightReport {
  const categories = Object.values(GameCategory);
  const masteredCategories: GameCategory[] = [];
  const needsPracticeCategories: GameCategory[] = [];
  const unexploredCategories: GameCategory[] = [];

  let totalCorrect = 0;
  let totalAttempts = 0;

  for (const cat of categories) {
    const stat: CategoryProgress | undefined = progress.categoryStats[cat];
    if (!stat || stat.gamesPlayed === 0) {
      unexploredCategories.push(cat);
      continue;
    }

    totalCorrect += stat.correctCount;
    totalAttempts += stat.totalAttempts;
    const accuracy = stat.totalAttempts > 0 ? (stat.correctCount / stat.totalAttempts) * 100 : 100;

    if (accuracy >= 75 && stat.gamesPlayed >= 1) {
      masteredCategories.push(cat);
    } else {
      needsPracticeCategories.push(cat);
    }
  }

  const overallAccuracyPercent =
    totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 100;

  return {
    totalGames: progress.totalGamesPlayed,
    overallAccuracyPercent,
    masteredCategories,
    needsPracticeCategories,
    unexploredCategories,
  };
}

export function evaluateUnlockedBadges(
  progress: PlayerProgress,
  allBadges: BadgeDefinition[]
): BadgeDefinition[] {
  const newlyUnlocked: BadgeDefinition[] = [];
  const has = (id: string) => progress.unlockedBadges.includes(id);

  const check = (id: string, condition: boolean) => {
    if (!has(id) && condition) {
      const found = allBadges.find((b) => b.id === id);
      if (found) newlyUnlocked.push(found);
    }
  };

  check('first_star', progress.totalStars >= 1);
  check('word_builder', (progress.categoryStats[GameCategory.SUSUN_KATA]?.gamesPlayed ?? 0) >= 1);
  check('letter_friend', (progress.categoryStats[GameCategory.BELAJAR_HURUF]?.gamesPlayed ?? 0) >= 1);
  check('animal_explorer', (progress.categoryStats[GameCategory.MENGENAL_HEWAN]?.gamesPlayed ?? 0) >= 1);
  check('number_whiz', (progress.categoryStats[GameCategory.MENGENAL_ANGKA]?.gamesPlayed ?? 0) >= 1);
  check('color_artist', (progress.categoryStats[GameCategory.MENGENAL_WARNA]?.gamesPlayed ?? 0) >= 1);
  check('star_collector_15', progress.totalStars >= 15);
  check('super_champion', progress.totalGamesPlayed >= 8);

  return newlyUnlocked;
}

export function buildLetterTracePaths(letter: string): string[] {
  const upper = letter.toUpperCase();
  const paths: Record<string, string[]> = {
    A: ['M 25 85 L 50 15 L 75 85', 'M 33 62 L 67 62'],
    B: ['M 30 15 L 30 85', 'M 30 15 C 72 15, 72 48, 30 48', 'M 30 48 C 76 48, 76 85, 30 85'],
    C: ['M 74 28 C 52 8, 22 22, 22 50 C 22 78, 52 92, 74 72'],
    D: ['M 28 15 L 28 85', 'M 28 15 C 80 15, 80 85, 28 85'],
    E: ['M 30 15 L 30 85', 'M 30 15 L 72 15', 'M 30 50 L 64 50', 'M 30 85 L 72 85'],
    F: ['M 30 15 L 30 85', 'M 30 15 L 72 15', 'M 30 50 L 62 50'],
    G: ['M 74 28 C 52 8, 22 22, 22 50 C 22 78, 55 92, 74 72 L 74 52 L 54 52'],
    H: ['M 28 15 L 28 85', 'M 72 15 L 72 85', 'M 28 50 L 72 50'],
    I: ['M 36 15 L 64 15', 'M 50 15 L 50 85', 'M 36 85 L 64 85'],
    J: ['M 66 15 L 66 64 C 66 86, 30 88, 26 68'],
    K: ['M 30 15 L 30 85', 'M 72 15 L 30 52 L 74 85'],
    L: ['M 30 15 L 30 85 L 74 85'],
    M: ['M 20 85 L 20 15 L 50 56 L 80 15 L 80 85'],
    N: ['M 26 85 L 26 15 L 74 85 L 74 15'],
    O: ['M 50 15 C 80 15, 80 85, 50 85 C 20 85, 20 15, 50 15'],
    P: ['M 30 15 L 30 85', 'M 30 15 C 76 15, 76 52, 30 52'],
    Q: ['M 50 15 C 80 15, 80 85, 50 85 C 20 85, 20 15, 50 15', 'M 56 64 L 78 86'],
    R: ['M 30 15 L 30 85', 'M 30 15 C 74 15, 74 50, 30 50', 'M 46 50 L 74 85'],
    S: ['M 72 26 C 55 10, 25 18, 28 36 C 32 52, 74 48, 72 70 C 70 88, 34 88, 24 72'],
    T: ['M 20 18 L 80 18', 'M 50 18 L 50 85'],
    U: ['M 26 15 L 26 60 C 26 88, 74 88, 74 60 L 74 15'],
    V: ['M 22 15 L 50 85 L 78 15'],
    W: ['M 16 15 L 34 85 L 50 38 L 66 85 L 84 15'],
    X: ['M 24 15 L 76 85', 'M 76 15 L 24 85'],
    Y: ['M 24 15 L 50 50 L 76 15', 'M 50 50 L 50 85'],
    Z: ['M 24 18 L 76 18 L 24 84 L 76 84'],
  };
  return paths[upper] ?? ['M 30 15 L 30 85'];
}

export interface SparkleSeed {
  angleRad: number;
  speed: number;
  size: number;
  color: string;
  starPoints: 4 | 5;
  twinklePhase: number;
  spinSpeed: number;
}

const SPARKLE_PALETTE = [
  '#FACC15',
  '#FDE047',
  '#38BDF8',
  '#F472B6',
  '#34D399',
  '#A78BFA',
];

export function createSparkleBurstSeeds(
  intensity: 'small' | 'celebration',
  rng: () => number = Math.random
): SparkleSeed[] {
  const count = intensity === 'celebration' ? 42 : 20;
  const baseSpeed = intensity === 'celebration' ? 5.2 : 3.8;

  return Array.from({ length: count }, (_, idx) => {
    const jitter = (rng() - 0.5) * 0.35;
    const angleRad = (idx / count) * Math.PI * 2 + jitter;
    return {
      angleRad,
      speed: baseSpeed * (0.55 + rng() * 0.9),
      size: intensity === 'celebration' ? 9 + rng() * 11 : 7 + rng() * 8,
      color: SPARKLE_PALETTE[idx % SPARKLE_PALETTE.length],
      starPoints: idx % 2 === 0 ? 4 : 5,
      twinklePhase: rng() * Math.PI * 2,
      spinSpeed: (rng() - 0.5) * 0.14,
    };
  });
}

