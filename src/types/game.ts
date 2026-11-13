export enum GameCategory {
  BELAJAR_HURUF = 'belajar_huruf',
  SUSUN_KATA = 'susun_kata',
  MENGENAL_HEWAN = 'mengenal_hewan',
  MENGENAL_ANGKA = 'mengenal_angka',
  MENGENAL_WARNA = 'mengenal_warna',
  MENGENAL_BENTUK = 'mengenal_bentuk',
  TEBAK_GAMBAR = 'tebak_gambar',
  PASANGKAN_GAMBAR = 'pasangkan_gambar',
}

export enum DifficultyLevel {
  PEMULA = 1,
  MENENGAH = 2,
  MAHIR = 3,
}

export enum AvatarId {
  BOY = 'boy',
  GIRL = 'girl',
  CAT = 'cat',
  RABBIT = 'rabbit',
  BEAR = 'bear',
  PANDA = 'panda',
}

export enum ScreenId {
  SPLASH = 'splash',
  HOME = 'home',
  CATEGORIES = 'categories',
  LEVELS = 'levels',
  PLAY = 'play',
  RESULT = 'result',
  ACHIEVEMENTS = 'achievements',
  PARENT = 'parent',
  SETTINGS = 'settings',
}

export enum MascotMood {
  HAPPY = 'happy',
  CHEERING = 'cheering',
  ENCOURAGING = 'encouraging',
  THINKING = 'thinking',
  SPEAKING = 'speaking',
}

export interface CategoryMeta {
  id: GameCategory;
  title: string;
  subtitle: string;
  accentHex: string;
  surfaceHex: string;
  borderHex: string;
  badgeText: string;
  illustrationKey: string;
}

export interface LetterItem {
  letter: string;
  lowercase: string;
  word: string;
  illustrationKey: string;
  phonetic: string;
  level: DifficultyLevel;
}

export interface WordItem {
  id: string;
  word: string;
  illustrationKey: string;
  categoryLabel: string;
  level: DifficultyLevel;
  hint: string;
}

export interface AnimalItem {
  id: string;
  name: string;
  illustrationKey: string;
  soundText: string;
  soundProfile: 'rooster' | 'cat' | 'dog' | 'cow' | 'goat' | 'sheep' | 'duck' | 'horse' | 'elephant' | 'lion' | 'tiger' | 'monkey' | 'frog' | 'bird' | 'bee' | 'snake' | 'rabbit' | 'giraffe' | 'panda' | 'penguin';
  habitat: string;
  level: DifficultyLevel;
}

export interface NumberItem {
  value: number;
  word: string;
  objectName: string;
  illustrationKey: string;
  level: DifficultyLevel;
}

export interface ColorItem {
  id: string;
  name: string;
  hex: string;
  textOnHex: string;
  objectName: string;
  illustrationKey: string;
  level: DifficultyLevel;
}

export interface ShapeItem {
  id: string;
  name: string;
  shapeType: 'circle' | 'triangle' | 'square' | 'rectangle' | 'star' | 'oval' | 'heart' | 'diamond';
  sidesLabel: string;
  exampleObject: string;
  colorHex: string;
  level: DifficultyLevel;
}

export interface QuizItem {
  id: string;
  targetWord: string;
  illustrationKey: string;
  options: string[];
  level: DifficultyLevel;
  questionAudio: string;
}

export interface LetterTile {
  id: string;
  char: string;
}

export interface CategoryProgress {
  gamesPlayed: number;
  correctCount: number;
  totalAttempts: number;
  starsEarned: number;
  completedLevels: DifficultyLevel[];
}

export interface GameHistoryEntry {
  id: string;
  timestamp: string;
  category: GameCategory;
  categoryTitle: string;
  level: DifficultyLevel;
  stars: number;
  xpEarned: number;
  accuracyPercent: number;
  detailText: string;
}

export interface AudioSettings {
  volume: number;
  voiceEnabled: boolean;
  sfxEnabled: boolean;
  musicEnabled: boolean;
  voiceRate: number;
  hintsAlwaysAvailable: boolean;
  unlockAllLevels: boolean;
}

export interface PlayerProfile {
  name: string;
  avatar: AvatarId;
}

export interface PlayerProgress {
  profile: PlayerProfile;
  xp: number;
  totalStars: number;
  totalGamesPlayed: number;
  totalCorrectAnswers: number;
  totalMistakes: number;
  unlockedBadges: string[];
  lastPlayedCategory: GameCategory | null;
  lastPlayedLevel: DifficultyLevel | null;
  categoryStats: Record<GameCategory, CategoryProgress>;
  history: GameHistoryEntry[];
  audio: AudioSettings;
}

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  iconType: 'star' | 'trophy' | 'book' | 'paw' | 'sparkles' | 'crown' | 'palette' | 'rocket';
  colorHex: string;
}

export interface RoundResultSummary {
  category: GameCategory;
  level: DifficultyLevel;
  stars: number;
  xpEarned: number;
  correctCount: number;
  mistakesCount: number;
  newlyUnlockedBadges: BadgeDefinition[];
  unlockedNextLevel: DifficultyLevel | null;
  detailText: string;
}
