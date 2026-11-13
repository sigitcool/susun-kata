import React from 'react';
import { Award, BookOpen, GraduationCap, Home, Settings, Star } from 'lucide-react';
import { ScreenId } from '../types/game';

interface TopNavProps {
  currentScreen: ScreenId;
  totalStars: number;
  onNavigate: (screen: ScreenId) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentScreen,
  totalStars,
  onNavigate,
}) => {
  const navItems: Array<{ id: ScreenId; label: string; icon: React.ReactNode }> = [
    { id: ScreenId.HOME, label: 'Beranda', icon: <Home className="w-4 h-4" /> },
    { id: ScreenId.CATEGORIES, label: 'Permainan', icon: <BookOpen className="w-4 h-4" /> },
    { id: ScreenId.ACHIEVEMENTS, label: 'Piala', icon: <Award className="w-4 h-4" /> },
    { id: ScreenId.PARENT, label: 'Orang Tua', icon: <GraduationCap className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 border-b border-sky-100 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Title */}
        <button
          type="button"
          onClick={() => onNavigate(ScreenId.HOME)}
          className="font-display text-sm sm:text-lg lg:text-xl font-extrabold tracking-tight text-sky-700 whitespace-nowrap truncate max-w-[235px] sm:max-w-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-lg"
        >
          Cerdas bersama Revan Utomo
        </button>

        {/* Zone 2: Clean single-line navigation links */}
        <nav aria-label="Navigasi Utama" className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const active = currentScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap shrink-0 py-1.5 border-b-2 transition-colors cursor-pointer ${
                  active
                    ? 'text-sky-700 border-sky-500'
                    : 'text-slate-600 border-transparent hover:text-sky-700'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Stars Counter */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate(ScreenId.ACHIEVEMENTS)}
            aria-label={`Total bintang ${totalStars}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-sm tabular-nums whitespace-nowrap shrink-0 cursor-pointer hover:bg-amber-100 transition-colors"
          >
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{totalStars}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate(ScreenId.SETTINGS)}
            aria-label="Pengaturan"
            className={`p-2 rounded-xl border transition-colors cursor-pointer shrink-0 ${
              currentScreen === ScreenId.SETTINGS
                ? 'bg-sky-600 text-white border-sky-600'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-sky-50'
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile compact bottom/sub bar kept well under 15% height */}
      <nav
        aria-label="Navigasi Ponsel"
        className="md:hidden flex items-center justify-around border-t border-sky-50 bg-white px-2 py-1"
      >
        {navItems.map((item) => {
          const active = currentScreen === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer ${
                active ? 'bg-sky-100 text-sky-800' : 'text-slate-600'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
