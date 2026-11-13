import React, { useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { AchievementsScreen } from './components/screens/AchievementsScreen';
import { CategorySelectScreen } from './components/screens/CategorySelectScreen';
import { GamePlayScreen } from './components/screens/GamePlayScreen';
import { GameResultScreen } from './components/screens/GameResultScreen';
import { HomeDashboard } from './components/screens/HomeDashboard';
import { LevelSelectScreen } from './components/screens/LevelSelectScreen';
import { ParentDashboardScreen } from './components/screens/ParentDashboardScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { SplashScreen } from './components/screens/SplashScreen';
import { TopNav } from './components/TopNav';
import {
  AvatarId,
  DifficultyLevel,
  GameCategory,
  PlayerProgress,
  RoundResultSummary,
  ScreenId,
} from './types/game';
import { audioEngine } from './utils/audioEngine';
import {
  loadProgress,
  recordRoundCompletion,
  resetProgressStorage,
  updateAudioInProgress,
  updateProfileInProgress,
} from './utils/storage';

export default function App() {
  const [progress, setProgress] = useState<PlayerProgress>(() => loadProgress());
  const [screen, setScreen] = useState<ScreenId>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        return ScreenId.HOME;
      }
    }
    return ScreenId.SPLASH;
  });

  const [selectedCategory, setSelectedCategory] = useState<GameCategory>(
    GameCategory.SUSUN_KATA
  );
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel>(
    DifficultyLevel.PEMULA
  );
  const [roundKey, setRoundKey] = useState(0);
  const [lastResult, setLastResult] = useState<RoundResultSummary | null>(null);
  const [spokenCaption, setSpokenCaption] = useState<string | null>(null);

  useEffect(() => {
    audioEngine.updateSettings(progress.audio);
  }, [progress.audio]);

  useEffect(() => {
    audioEngine.onCaptionChange((text) => setSpokenCaption(text));
    return () => {
      audioEngine.stopSpeaking();
      audioEngine.stopBackgroundMusic();
    };
  }, []);

  useEffect(() => {
    if (screen === ScreenId.SPLASH) {
      document.body.dataset.state = 'title';
    } else if (screen === ScreenId.RESULT) {
      document.body.dataset.state = 'gameover';
    } else {
      document.body.dataset.state = 'playing';
    }
  }, [screen]);

  const handleStartQuickPlay = (category: GameCategory, level: DifficultyLevel) => {
    setSelectedCategory(category);
    setSelectedLevel(level);
    setRoundKey((k) => k + 1);
    setScreen(ScreenId.PLAY);
  };

  const handleSelectCategory = (category: GameCategory) => {
    setSelectedCategory(category);
    setScreen(ScreenId.LEVELS);
  };

  const handleSelectLevel = (level: DifficultyLevel) => {
    setSelectedLevel(level);
    setRoundKey((k) => k + 1);
    setScreen(ScreenId.PLAY);
  };

  const handleCompleteRound = (result: {
    correctCount: number;
    mistakesCount: number;
    hintsUsed: number;
    detailText: string;
  }) => {
    const { updatedProgress, summary } = recordRoundCompletion(progress, {
      category: selectedCategory,
      level: selectedLevel,
      ...result,
    });
    setProgress(updatedProgress);
    setLastResult(summary);
    setScreen(ScreenId.RESULT);
  };

  const handleUpdateProfile = (name: string, avatar: AvatarId) => {
    setProgress((prev) => updateProfileInProgress(prev, { name, avatar }));
  };

  const handleUpdateAudio = (nextAudio: PlayerProgress['audio']) => {
    setProgress((prev) => updateAudioInProgress(prev, nextAudio));
  };

  const handleResetProgress = () => {
    const fresh = resetProgressStorage();
    setProgress(fresh);
    setLastResult(null);
  };

  if (screen === ScreenId.SPLASH) {
    return (
      <SplashScreen
        childName={progress.profile.name}
        onStart={() => {
          audioEngine.playTileTap();
          audioEngine.speak(`Halo ${progress.profile.name}! Selamat datang di Cerdas bersama Revan Utomo!`);
          setScreen(ScreenId.HOME);
        }}
        onOpenParent={() => setScreen(ScreenId.PARENT)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F4FAFF] text-slate-900 relative flex flex-col">
      {/* Gentle Pastel Background Clouds & Stars */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <svg className="absolute top-12 left-6 w-36 opacity-45" viewBox="0 0 160 80">
          <circle cx="50" cy="48" r="24" fill="#FFFFFF" />
          <circle cx="80" cy="36" r="30" fill="#FFFFFF" />
          <circle cx="112" cy="48" r="22" fill="#FFFFFF" />
          <rect x="46" y="46" width="70" height="26" rx="12" fill="#FFFFFF" />
        </svg>
        <svg className="absolute top-20 right-10 w-44 opacity-45" viewBox="0 0 160 80">
          <circle cx="50" cy="48" r="24" fill="#FFFFFF" />
          <circle cx="82" cy="36" r="30" fill="#FFFFFF" />
          <circle cx="114" cy="48" r="22" fill="#FFFFFF" />
          <rect x="46" y="46" width="72" height="26" rx="12" fill="#FFFFFF" />
        </svg>
      </div>

      <TopNav
        currentScreen={screen}
        totalStars={progress.totalStars}
        onNavigate={(nextScreen) => {
          audioEngine.stopSpeaking();
          setScreen(nextScreen);
        }}
      />

      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 md:px-6 py-6 md:py-8">
        {screen === ScreenId.HOME && (
          <HomeDashboard
            progress={progress}
            onStartQuickPlay={handleStartQuickPlay}
            onSelectCategory={handleSelectCategory}
            onNavigate={setScreen}
          />
        )}

        {screen === ScreenId.CATEGORIES && (
          <CategorySelectScreen
            progress={progress}
            onSelectCategory={handleSelectCategory}
            onBack={() => setScreen(ScreenId.HOME)}
          />
        )}

        {screen === ScreenId.LEVELS && (
          <LevelSelectScreen
            category={selectedCategory}
            progress={progress}
            onSelectLevel={handleSelectLevel}
            onBack={() => setScreen(ScreenId.CATEGORIES)}
          />
        )}

        {screen === ScreenId.PLAY && (
          <GamePlayScreen
            key={`${selectedCategory}-${selectedLevel}-${roundKey}`}
            category={selectedCategory}
            level={selectedLevel}
            progress={progress}
            onToggleVoice={() =>
              handleUpdateAudio({
                ...progress.audio,
                voiceEnabled: !progress.audio.voiceEnabled,
              })
            }
            onBack={() => setScreen(ScreenId.LEVELS)}
            onCompleteRound={handleCompleteRound}
          />
        )}

        {screen === ScreenId.RESULT && lastResult && (
          <GameResultScreen
            result={lastResult}
            childName={progress.profile.name}
            onReplay={() => {
              setRoundKey((k) => k + 1);
              setScreen(ScreenId.PLAY);
            }}
            onContinue={() => {
              if (lastResult.unlockedNextLevel) {
                setSelectedLevel(lastResult.unlockedNextLevel);
                setRoundKey((k) => k + 1);
                setScreen(ScreenId.PLAY);
              } else {
                setScreen(ScreenId.CATEGORIES);
              }
            }}
            onGoHome={() => setScreen(ScreenId.HOME)}
          />
        )}

        {screen === ScreenId.ACHIEVEMENTS && (
          <AchievementsScreen
            progress={progress}
            onBack={() => setScreen(ScreenId.HOME)}
          />
        )}

        {screen === ScreenId.PARENT && (
          <ParentDashboardScreen
            progress={progress}
            onUpdateProfile={handleUpdateProfile}
            onUpdateAudio={handleUpdateAudio}
            onResetProgress={handleResetProgress}
            onBack={() => setScreen(ScreenId.HOME)}
          />
        )}

        {screen === ScreenId.SETTINGS && (
          <SettingsScreen
            progress={progress}
            onUpdateAudio={handleUpdateAudio}
            onResetProgress={handleResetProgress}
            onBack={() => setScreen(ScreenId.HOME)}
          />
        )}
      </main>

      {/* Spoken Caption Assist placed in wide-screen side margin so it never overlaps centered interactive tiles */}
      {spokenCaption && (
        <div
          role="status"
          aria-live="polite"
          className="hidden xl:flex fixed bottom-4 right-4 z-40 max-w-xs bg-slate-900/90 text-white px-4 py-2.5 rounded-2xl shadow-lg items-center gap-2.5 text-sm font-semibold pointer-events-none"
        >
          <Volume2 className="w-4 h-4 text-sky-300 shrink-0" />
          <span className="truncate">{spokenCaption}</span>
        </div>
      )}
    </div>
  );
}
