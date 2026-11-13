import { BADGES_DATA, CATEGORIES_META } from '../data/curriculum';
import {
  AudioSettings,
  AvatarId,
  BadgeDefinition,
  CategoryProgress,
  DifficultyLevel,
  GameCategory,
  PlayerProfile,
  PlayerProgress,
  RoundResultSummary,
} from '../types/game';
import { calculateStarsEarned, evaluateUnlockedBadges } from './gameLogic';

const STORAGE_KEY = 'cerdas_ceria_state_v1';

function createInitialCategoryStats(): Record<GameCategory, CategoryProgress> {
  return Object.values(GameCategory).reduce(
    (acc, category) => {
      acc[category] = {
        gamesPlayed: 0,
        correctCount: 0,
        totalAttempts: 0,
        starsEarned: 0,
        completedLevels: [],
      };
      return acc;
    },
    {} as Record<GameCategory, CategoryProgress>
  );
}

export function createDefaultProgress(): PlayerProgress {
  return {
    profile: {
      name: 'Bintang',
      avatar: AvatarId.RABBIT,
    },
    xp: 0,
    totalStars: 0,
    totalGamesPlayed: 0,
    totalCorrectAnswers: 0,
    totalMistakes: 0,
    unlockedBadges: [],
    lastPlayedCategory: GameCategory.SUSUN_KATA,
    lastPlayedLevel: DifficultyLevel.PEMULA,
    categoryStats: createInitialCategoryStats(),
    history: [],
    audio: {
      volume: 0.85,
      voiceEnabled: true,
      sfxEnabled: true,
      musicEnabled: false,
      voiceRate: 0.9,
      hintsAlwaysAvailable: true,
      unlockAllLevels: false,
    },
  };
}

export function loadProgress(): PlayerProgress {
  if (typeof window === 'undefined') return createDefaultProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultProgress();
    const parsed = JSON.parse(raw) as Partial<PlayerProgress>;
    const defaults = createDefaultProgress();

    return {
      ...defaults,
      ...parsed,
      profile: {
        ...defaults.profile,
        ...(parsed.profile ?? {}),
      },
      audio: {
        ...defaults.audio,
        ...(parsed.audio ?? {}),
      },
      categoryStats: {
        ...defaults.categoryStats,
        ...(parsed.categoryStats ?? {}),
      },
      history: Array.isArray(parsed.history) ? parsed.history : [],
      unlockedBadges: Array.isArray(parsed.unlockedBadges) ? parsed.unlockedBadges : [],
    };
  } catch {
    return createDefaultProgress();
  }
}

export function saveProgress(progress: PlayerProgress): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage quota issues
  }
}

export function resetProgressStorage(): PlayerProgress {
  const fresh = createDefaultProgress();
  saveProgress(fresh);
  return fresh;
}

export function updateProfileInProgress(
  progress: PlayerProgress,
  profile: PlayerProfile
): PlayerProgress {
  const updated = {
    ...progress,
    profile: {
      name: profile.name.trim() || 'Bintang',
      avatar: profile.avatar,
    },
  };
  saveProgress(updated);
  return updated;
}

export function updateAudioInProgress(
  progress: PlayerProgress,
  audio: AudioSettings
): PlayerProgress {
  const updated = {
    ...progress,
    audio,
  };
  saveProgress(updated);
  return updated;
}

export function recordRoundCompletion(
  progress: PlayerProgress,
  params: {
    category: GameCategory;
    level: DifficultyLevel;
    correctCount: number;
    mistakesCount: number;
    hintsUsed: number;
    detailText: string;
  }
): { updatedProgress: PlayerProgress; summary: RoundResultSummary } {
  const { stars, xpEarned } = calculateStarsEarned(
    params.mistakesCount,
    params.hintsUsed,
    params.correctCount
  );

  const prevCat = progress.categoryStats[params.category] ?? {
    gamesPlayed: 0,
    correctCount: 0,
    totalAttempts: 0,
    starsEarned: 0,
    completedLevels: [],
  };

  const completedLevels = prevCat.completedLevels.includes(params.level)
    ? prevCat.completedLevels
    : [...prevCat.completedLevels, params.level];

  let unlockedNextLevel: DifficultyLevel | null = null;
  if (
    params.level === DifficultyLevel.PEMULA &&
    !prevCat.completedLevels.includes(DifficultyLevel.PEMULA)
  ) {
    unlockedNextLevel = DifficultyLevel.MENENGAH;
  } else if (
    params.level === DifficultyLevel.MENENGAH &&
    !prevCat.completedLevels.includes(DifficultyLevel.MENENGAH)
  ) {
    unlockedNextLevel = DifficultyLevel.MAHIR;
  }

  const totalAttemptsThisRound = Math.max(1, params.correctCount + params.mistakesCount);
  const accuracyPercent = Math.round((params.correctCount / totalAttemptsThisRound) * 100);
  const categoryTitle =
    CATEGORIES_META.find((c) => c.id === params.category)?.title ?? 'Permainan';

  const historyEntry = {
    id: `hist-${Date.now()}`,
    timestamp: new Date().toISOString(),
    category: params.category,
    categoryTitle,
    level: params.level,
    stars,
    xpEarned,
    accuracyPercent,
    detailText: params.detailText,
  };

  const intermediateProgress: PlayerProgress = {
    ...progress,
    xp: progress.xp + xpEarned,
    totalStars: progress.totalStars + stars,
    totalGamesPlayed: progress.totalGamesPlayed + 1,
    totalCorrectAnswers: progress.totalCorrectAnswers + params.correctCount,
    totalMistakes: progress.totalMistakes + params.mistakesCount,
    lastPlayedCategory: params.category,
    lastPlayedLevel: params.level,
    categoryStats: {
      ...progress.categoryStats,
      [params.category]: {
        gamesPlayed: prevCat.gamesPlayed + 1,
        correctCount: prevCat.correctCount + params.correctCount,
        totalAttempts: prevCat.totalAttempts + totalAttemptsThisRound,
        starsEarned: prevCat.starsEarned + stars,
        completedLevels,
      },
    },
    history: [historyEntry, ...progress.history].slice(0, 40),
  };

  const newlyUnlockedBadges: BadgeDefinition[] = evaluateUnlockedBadges(
    intermediateProgress,
    BADGES_DATA
  );

  const updatedProgress: PlayerProgress = {
    ...intermediateProgress,
    unlockedBadges: [
      ...intermediateProgress.unlockedBadges,
      ...newlyUnlockedBadges.map((b) => b.id),
    ],
  };

  saveProgress(updatedProgress);

  return {
    updatedProgress,
    summary: {
      category: params.category,
      level: params.level,
      stars,
      xpEarned,
      correctCount: params.correctCount,
      mistakesCount: params.mistakesCount,
      newlyUnlockedBadges,
      unlockedNextLevel,
      detailText: params.detailText,
    },
  };
}
