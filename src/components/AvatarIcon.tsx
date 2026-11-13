import React from 'react';
import { AvatarId } from '../types/game';

export const AVATAR_OPTIONS: Array<{ id: AvatarId; label: string; bgHex: string }> = [
  { id: AvatarId.BOY, label: 'Anak Laki-laki', bgHex: '#DBEAFE' },
  { id: AvatarId.GIRL, label: 'Anak Perempuan', bgHex: '#FCE7F3' },
  { id: AvatarId.CAT, label: 'Kucing', bgHex: '#FEF3C7' },
  { id: AvatarId.RABBIT, label: 'Kelinci', bgHex: '#E0F2FE' },
  { id: AvatarId.BEAR, label: 'Beruang', bgHex: '#FFEDD5' },
  { id: AvatarId.PANDA, label: 'Panda', bgHex: '#D1FAE5' },
];

interface AvatarIconProps {
  avatar: AvatarId;
  size?: 'sm' | 'md' | 'lg';
}

export const AvatarIcon: React.FC<AvatarIconProps> = ({ avatar, size = 'md' }) => {
  const sizeClass =
    size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-20 h-20' : 'w-14 h-14';
  const meta = AVATAR_OPTIONS.find((a) => a.id === avatar) ?? AVATAR_OPTIONS[3];

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm overflow-hidden`}
      style={{ backgroundColor: meta.bgHex }}
      aria-label={meta.label}
    >
      <svg viewBox="0 0 80 80" className="w-full h-full" aria-hidden="true">
        {avatar === AvatarId.BOY && (
          <>
            <circle cx="40" cy="44" r="21" fill="#FDE6C4" />
            <path d="M 19 38 C 19 18, 61 18, 61 38 C 52 30, 28 30, 19 38 Z" fill="#334155" />
            <circle cx="33" cy="43" r="3" fill="#1E293B" />
            <circle cx="47" cy="43" r="3" fill="#1E293B" />
            <path d="M 34 52 Q 40 57 46 52" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 22 76 C 24 62, 56 62, 58 76 Z" fill="#0284C7" />
          </>
        )}
        {avatar === AvatarId.GIRL && (
          <>
            <circle cx="20" cy="36" r="8" fill="#7C2D12" />
            <circle cx="60" cy="36" r="8" fill="#7C2D12" />
            <circle cx="40" cy="44" r="21" fill="#FDE6C4" />
            <path d="M 18 40 C 18 18, 62 18, 62 40 C 52 31, 28 31, 18 40 Z" fill="#7C2D12" />
            <circle cx="33" cy="44" r="3" fill="#1E293B" />
            <circle cx="47" cy="44" r="3" fill="#1E293B" />
            <circle cx="28" cy="49" r="3.5" fill="#F9A8D4" opacity="0.7" />
            <circle cx="52" cy="49" r="3.5" fill="#F9A8D4" opacity="0.7" />
            <path d="M 34 52 Q 40 57 46 52" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 22 76 C 24 62, 56 62, 58 76 Z" fill="#DB2777" />
          </>
        )}
        {avatar === AvatarId.CAT && (
          <>
            <polygon points="20,38 24,16 37,29" fill="#FB923C" />
            <polygon points="60,38 56,16 43,29" fill="#FB923C" />
            <circle cx="40" cy="45" r="21" fill="#FDBA74" />
            <circle cx="33" cy="43" r="3" fill="#1E293B" />
            <circle cx="47" cy="43" r="3" fill="#1E293B" />
            <polygon points="37,49 43,49 40,53" fill="#F43F5E" />
            <path d="M 35 55 Q 40 59 45 55" fill="none" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
          </>
        )}
        {avatar === AvatarId.RABBIT && (
          <>
            <ellipse cx="30" cy="22" rx="6" ry="15" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="2" />
            <ellipse cx="50" cy="22" rx="6" ry="15" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="2" />
            <ellipse cx="30" cy="22" rx="3" ry="9" fill="#F9A8D4" />
            <ellipse cx="50" cy="22" rx="3" ry="9" fill="#F9A8D4" />
            <circle cx="40" cy="48" r="20" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="2" />
            <circle cx="33" cy="46" r="3" fill="#1E293B" />
            <circle cx="47" cy="46" r="3" fill="#1E293B" />
            <ellipse cx="40" cy="51" rx="3" ry="2" fill="#F472B6" />
            <path d="M 35 55 Q 40 59 45 55" fill="none" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
          </>
        )}
        {avatar === AvatarId.BEAR && (
          <>
            <circle cx="23" cy="28" r="8" fill="#B45309" />
            <circle cx="57" cy="28" r="8" fill="#B45309" />
            <circle cx="40" cy="45" r="21" fill="#D97706" />
            <ellipse cx="40" cy="51" rx="10" ry="8" fill="#FDE68A" />
            <circle cx="33" cy="42" r="3" fill="#1E293B" />
            <circle cx="47" cy="42" r="3" fill="#1E293B" />
            <ellipse cx="40" cy="48" rx="4" ry="2.8" fill="#1E293B" />
            <path d="M 35 54 Q 40 58 45 54" fill="none" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
          </>
        )}
        {avatar === AvatarId.PANDA && (
          <>
            <circle cx="23" cy="28" r="8" fill="#1E293B" />
            <circle cx="57" cy="28" r="8" fill="#1E293B" />
            <circle cx="40" cy="46" r="21" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <ellipse cx="32" cy="44" rx="6" ry="7" transform="rotate(-15 32 44)" fill="#1E293B" />
            <ellipse cx="48" cy="44" rx="6" ry="7" transform="rotate(15 48 44)" fill="#1E293B" />
            <circle cx="32" cy="43" r="2.2" fill="#FFFFFF" />
            <circle cx="48" cy="43" r="2.2" fill="#FFFFFF" />
            <ellipse cx="40" cy="51" rx="3.5" ry="2.5" fill="#1E293B" />
            <path d="M 35 56 Q 40 60 45 56" fill="none" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
          </>
        )}
      </svg>
    </div>
  );
};
