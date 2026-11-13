import React, { useState } from 'react';
import { getRealImageUrl } from '../../data/realImages';

interface ItemIllustrationProps {
  itemKey: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_MAP = {
  xs: 'w-8 h-8',
  sm: 'w-14 h-14',
  md: 'w-24 h-24',
  lg: 'w-36 h-36 md:w-44 md:h-44',
  xl: 'w-44 h-44 md:w-52 md:h-52',
};

export const ItemIllustration: React.FC<ItemIllustrationProps> = ({
  itemKey,
  size = 'lg',
  className = '',
}) => {
  const key = itemKey.toLowerCase();
  const dim = SIZE_MAP[size];
  const realImageUrl = getRealImageUrl(key);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  if (realImageUrl && failedUrl !== realImageUrl) {
    const radiusClass = size === 'xs' ? 'rounded-lg border' : 'rounded-2xl border-2';
    return (
      <div
        className={`${dim} ${radiusClass} overflow-hidden bg-white border-sky-100 shadow-xs shrink-0 select-none ${className}`}
      >
        <img
          src={realImageUrl}
          alt={`Ilustrasi ${itemKey}`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailedUrl(realImageUrl)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const renderArtwork = () => {
    switch (key) {
      case 'buku':
        return (
          <g>
            <rect x="22" y="24" width="76" height="72" rx="10" fill="#38BDF8" stroke="#0369A1" strokeWidth="3.5" />
            <rect x="28" y="24" width="12" height="72" rx="4" fill="#0284C7" />
            <rect x="44" y="34" width="44" height="52" rx="6" fill="#FFFFFF" />
            <line x1="51" y1="46" x2="80" y2="46" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
            <line x1="51" y1="58" x2="80" y2="58" stroke="#F472B6" strokeWidth="4" strokeLinecap="round" />
            <line x1="51" y1="70" x2="72" y2="70" stroke="#34D399" strokeWidth="4" strokeLinecap="round" />
            <polygon points="88,18 92,28 102,28 94,34 97,44 88,38 79,44 82,34 74,28 84,28" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
          </g>
        );
      case 'bola':
        return (
          <g>
            <circle cx="60" cy="60" r="40" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3.5" />
            <polygon points="60,40 76,52 70,71 50,71 44,52" fill="#1E293B" />
            <path d="M 60 20 L 60 40 M 95 45 L 76 52 M 84 91 L 70 71 M 36 91 L 50 71 M 25 45 L 44 52" stroke="#1E293B" strokeWidth="3.5" />
            <circle cx="46" cy="36" r="6" fill="#38BDF8" opacity="0.45" />
          </g>
        );
      case 'meja':
        return (
          <g>
            <rect x="18" y="42" width="84" height="14" rx="6" fill="#F59E0B" stroke="#92400E" strokeWidth="3" />
            <rect x="28" y="56" width="10" height="42" rx="3" fill="#D97706" stroke="#92400E" strokeWidth="2.5" />
            <rect x="82" y="56" width="10" height="42" rx="3" fill="#D97706" stroke="#92400E" strokeWidth="2.5" />
            <rect x="44" y="28" width="24" height="14" rx="3" fill="#38BDF8" stroke="#0369A1" strokeWidth="2.5" />
            <circle cx="82" cy="34" r="8" fill="#EF4444" />
          </g>
        );
      case 'susu':
        return (
          <g>
            <polygon points="36,36 84,36 78,22 42,22" fill="#E0F2FE" stroke="#0284C7" strokeWidth="3" />
            <rect x="36" y="36" width="48" height="62" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3.5" />
            <rect x="36" y="54" width="48" height="24" fill="#38BDF8" opacity="0.35" />
            <circle cx="60" cy="66" r="9" fill="#0284C7" />
            <circle cx="58" cy="64" r="3" fill="#FFFFFF" />
          </g>
        );
      case 'mata':
        return (
          <g>
            <path d="M 16 60 Q 60 22 104 60 Q 60 98 16 60 Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="4" />
            <circle cx="60" cy="60" r="18" fill="#38BDF8" stroke="#0369A1" strokeWidth="3" />
            <circle cx="60" cy="60" r="9" fill="#1E293B" />
            <circle cx="65" cy="54" r="4" fill="#FFFFFF" />
          </g>
        );
      case 'gigi':
        return (
          <g>
            <path d="M 32 34 C 32 20, 52 20, 60 28 C 68 20, 88 20, 88 34 C 92 58, 84 96, 72 96 C 64 96, 62 72, 60 72 C 58 72, 56 96, 48 96 C 36 96, 28 58, 32 34 Z" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3.5" />
            <path d="M 48 48 Q 60 56 72 48" fill="none" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
            <circle cx="48" cy="40" r="3" fill="#1E293B" />
            <circle cx="72" cy="40" r="3" fill="#1E293B" />
          </g>
        );
      case 'ayam':
        return (
          <g>
            <path d="M 48 24 C 50 14, 62 14, 62 24 C 68 18, 76 24, 70 32" fill="#EF4444" />
            <ellipse cx="60" cy="64" rx="28" ry="26" fill="#FDE047" stroke="#CA8A04" strokeWidth="3" />
            <circle cx="46" cy="46" r="18" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3" />
            <polygon points="28,46 18,50 28,54" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
            <circle cx="42" cy="42" r="3.5" fill="#1E293B" />
            <ellipse cx="64" cy="66" rx="14" ry="10" fill="#FACC15" />
            <line x1="50" y1="88" x2="46" y2="100" stroke="#EA580C" strokeWidth="4" strokeLinecap="round" />
            <line x1="70" y1="88" x2="74" y2="100" stroke="#EA580C" strokeWidth="4" strokeLinecap="round" />
          </g>
        );
      case 'ikan':
        return (
          <g>
            <polygon points="82,60 104,40 104,80" fill="#F97316" stroke="#C2410C" strokeWidth="3" />
            <ellipse cx="56" cy="60" rx="34" ry="24" fill="#38BDF8" stroke="#0369A1" strokeWidth="3.5" />
            <path d="M 52 36 Q 62 18 72 38" fill="#FACC15" stroke="#CA8A04" strokeWidth="2.5" />
            <circle cx="38" cy="54" r="5" fill="#FFFFFF" />
            <circle cx="37" cy="54" r="2.8" fill="#1E293B" />
            <path d="M 30 66 Q 38 72 46 66" fill="none" stroke="#0369A1" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="16" cy="36" r="4" fill="#BAE6FD" />
            <circle cx="12" cy="24" r="3" fill="#BAE6FD" />
          </g>
        );
      case 'topi':
        return (
          <g>
            <path d="M 28 66 C 28 34, 92 34, 92 66 Z" fill="#38BDF8" stroke="#0369A1" strokeWidth="3.5" />
            <ellipse cx="60" cy="68" rx="46" ry="12" fill="#0284C7" stroke="#0369A1" strokeWidth="3" />
            <path d="M 30 58 Q 60 66 90 58" fill="none" stroke="#FACC15" strokeWidth="6" />
            <circle cx="60" cy="34" r="6" fill="#F472B6" />
          </g>
        );
      case 'sepatu':
        return (
          <g>
            <path d="M 24 42 L 48 42 L 56 64 L 94 68 C 102 70, 102 84, 92 84 L 24 84 Z" fill="#F43F5E" stroke="#9F1239" strokeWidth="3.5" strokeLinejoin="round" />
            <rect x="22" y="80" width="76" height="10" rx="5" fill="#FFFFFF" stroke="#9F1239" strokeWidth="3" />
            <line x1="48" y1="54" x2="62" y2="54" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="52" y1="62" x2="66" y2="62" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        );
      case 'apel':
        return (
          <g>
            <path d="M 60 32 C 60 22, 68 18, 72 22" fill="none" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="70" cy="24" rx="10" ry="6" transform="rotate(-25 70 24)" fill="#22C55E" />
            <path d="M 60 36 C 36 28, 22 48, 28 74 C 34 94, 52 98, 60 90 C 68 98, 86 94, 92 74 C 98 48, 84 28, 60 36 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="3.5" />
            <ellipse cx="44" cy="52" rx="6" ry="12" transform="rotate(-18 44 52)" fill="#FCA5A5" opacity="0.65" />
          </g>
        );
      case 'pisang':
        return (
          <g>
            <path d="M 28 78 C 46 92, 88 74, 92 30 C 86 24, 78 24, 78 30 C 74 60, 48 74, 30 68 C 24 68, 22 74, 28 78 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="3.5" />
            <rect x="82" y="20" width="8" height="10" rx="2" fill="#78350F" />
          </g>
        );
      case 'jeruk':
        return (
          <g>
            <circle cx="60" cy="64" r="34" fill="#FB923C" stroke="#C2410C" strokeWidth="3.5" />
            <ellipse cx="68" cy="26" rx="11" ry="6" transform="rotate(-20 68 26)" fill="#22C55E" />
            <circle cx="48" cy="50" r="4" fill="#FED7AA" />
            <circle cx="72" cy="72" r="2.5" fill="#C2410C" opacity="0.4" />
            <circle cx="48" cy="76" r="2.5" fill="#C2410C" opacity="0.4" />
          </g>
        );
      case 'anggur':
        return (
          <g>
            <line x1="60" y1="18" x2="60" y2="34" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="70" cy="24" rx="10" ry="6" fill="#22C55E" />
            <circle cx="46" cy="46" r="12" fill="#A855F7" stroke="#6B21A8" strokeWidth="2.5" />
            <circle cx="74" cy="46" r="12" fill="#A855F7" stroke="#6B21A8" strokeWidth="2.5" />
            <circle cx="60" cy="44" r="12" fill="#C084FC" stroke="#6B21A8" strokeWidth="2.5" />
            <circle cx="52" cy="64" r="12" fill="#A855F7" stroke="#6B21A8" strokeWidth="2.5" />
            <circle cx="68" cy="64" r="12" fill="#A855F7" stroke="#6B21A8" strokeWidth="2.5" />
            <circle cx="60" cy="82" r="12" fill="#9333EA" stroke="#6B21A8" strokeWidth="2.5" />
          </g>
        );
      case 'semangka':
        return (
          <g>
            <path d="M 18 52 A 42 42 0 0 0 102 52 Z" fill="#22C55E" stroke="#15803D" strokeWidth="3.5" />
            <path d="M 26 52 A 34 34 0 0 0 94 52 Z" fill="#EF4444" />
            <circle cx="46" cy="64" r="3" fill="#1E293B" />
            <circle cx="60" cy="70" r="3" fill="#1E293B" />
            <circle cx="74" cy="64" r="3" fill="#1E293B" />
          </g>
        );
      case 'stroberi':
        return (
          <g>
            <path d="M 40 34 Q 60 22 80 34 L 68 42 L 60 36 L 52 42 Z" fill="#22C55E" stroke="#15803D" strokeWidth="2.5" />
            <path d="M 34 42 C 30 62, 46 96, 60 96 C 74 96, 90 62, 86 42 C 74 36, 46 36, 34 42 Z" fill="#F43F5E" stroke="#BE123C" strokeWidth="3.5" />
            <circle cx="50" cy="54" r="2.5" fill="#FDE047" />
            <circle cx="68" cy="54" r="2.5" fill="#FDE047" />
            <circle cx="59" cy="68" r="2.5" fill="#FDE047" />
            <circle cx="52" cy="78" r="2.5" fill="#FDE047" />
            <circle cx="68" cy="78" r="2.5" fill="#FDE047" />
          </g>
        );
      case 'nanas':
        return (
          <g>
            <polygon points="60,14 50,36 70,36" fill="#22C55E" />
            <polygon points="42,20 52,38 62,32" fill="#16A34A" />
            <polygon points="78,20 68,38 58,32" fill="#16A34A" />
            <ellipse cx="60" cy="66" rx="26" ry="30" fill="#FACC15" stroke="#CA8A04" strokeWidth="3.5" />
            <line x1="42" y1="52" x2="78" y2="80" stroke="#CA8A04" strokeWidth="2.5" />
            <line x1="78" y1="52" x2="42" y2="80" stroke="#CA8A04" strokeWidth="2.5" />
          </g>
        );
      case 'wortel':
        return (
          <g>
            <path d="M 60 28 L 50 14 M 60 28 L 60 12 M 60 28 L 70 14" stroke="#22C55E" strokeWidth="5" strokeLinecap="round" />
            <path d="M 40 34 C 40 28, 80 28, 80 34 L 64 98 C 62 102, 58 102, 56 98 Z" fill="#F97316" stroke="#C2410C" strokeWidth="3.5" />
            <line x1="48" y1="48" x2="60" y2="48" stroke="#C2410C" strokeWidth="3" strokeLinecap="round" />
            <line x1="56" y1="64" x2="68" y2="64" stroke="#C2410C" strokeWidth="3" strokeLinecap="round" />
          </g>
        );
      case 'kucing':
        return (
          <g>
            <polygon points="28,46 32,20 48,36" fill="#FB923C" stroke="#C2410C" strokeWidth="3" />
            <polygon points="92,46 88,20 72,36" fill="#FB923C" stroke="#C2410C" strokeWidth="3" />
            <circle cx="60" cy="62" r="32" fill="#FDBA74" stroke="#C2410C" strokeWidth="3.5" />
            <circle cx="48" cy="58" r="4.5" fill="#1E293B" />
            <circle cx="72" cy="58" r="4.5" fill="#1E293B" />
            <polygon points="56,66 64,66 60,71" fill="#F43F5E" />
            <path d="M 52 75 Q 60 81 68 75" fill="none" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="24" y1="64" x2="38" y2="66" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="82" y1="66" x2="96" y2="64" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );
      case 'anjing':
        return (
          <g>
            <ellipse cx="26" cy="58" rx="10" ry="22" transform="rotate(14 26 58)" fill="#92400E" />
            <ellipse cx="94" cy="58" rx="10" ry="22" transform="rotate(-14 94 58)" fill="#92400E" />
            <circle cx="60" cy="60" r="30" fill="#FDE68A" stroke="#92400E" strokeWidth="3.5" />
            <circle cx="48" cy="54" r="4.5" fill="#1E293B" />
            <circle cx="72" cy="54" r="4.5" fill="#1E293B" />
            <ellipse cx="60" cy="66" rx="7" ry="5" fill="#1E293B" />
            <path d="M 52 76 Q 60 82 68 76" fill="none" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" />
          </g>
        );
      case 'sapi':
        return (
          <g>
            <ellipse cx="26" cy="46" rx="10" ry="6" transform="rotate(-20 26 46)" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
            <ellipse cx="94" cy="46" rx="10" ry="6" transform="rotate(20 94 46)" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
            <circle cx="60" cy="60" r="31" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3.5" />
            <circle cx="45" cy="44" r="9" fill="#1E293B" />
            <circle cx="48" cy="56" r="4" fill="#1E293B" />
            <circle cx="72" cy="56" r="4" fill="#1E293B" />
            <ellipse cx="60" cy="74" rx="20" ry="13" fill="#FBCFE8" stroke="#DB2777" strokeWidth="2.5" />
            <circle cx="53" cy="73" r="2.5" fill="#9D174D" />
            <circle cx="67" cy="73" r="2.5" fill="#9D174D" />
          </g>
        );
      case 'bebek':
        return (
          <g>
            <circle cx="60" cy="58" r="30" fill="#FDE047" stroke="#CA8A04" strokeWidth="3.5" />
            <circle cx="50" cy="50" r="4.5" fill="#1E293B" />
            <circle cx="70" cy="50" r="4.5" fill="#1E293B" />
            <ellipse cx="60" cy="66" rx="16" ry="8" fill="#F97316" stroke="#C2410C" strokeWidth="2.5" />
          </g>
        );
      case 'gajah':
        return (
          <g>
            <ellipse cx="24" cy="58" rx="16" ry="24" fill="#94A3B8" stroke="#475569" strokeWidth="3" />
            <ellipse cx="96" cy="58" rx="16" ry="24" fill="#94A3B8" stroke="#475569" strokeWidth="3" />
            <circle cx="60" cy="56" r="28" fill="#CBD5E1" stroke="#475569" strokeWidth="3.5" />
            <path d="M 54 64 L 54 88 C 54 96, 68 96, 68 88" fill="none" stroke="#94A3B8" strokeWidth="10" strokeLinecap="round" />
            <circle cx="48" cy="50" r="4" fill="#1E293B" />
            <circle cx="72" cy="50" r="4" fill="#1E293B" />
          </g>
        );
      case 'singa':
        return (
          <g>
            <circle cx="60" cy="60" r="38" fill="#EA580C" stroke="#9A3412" strokeWidth="3" />
            <circle cx="60" cy="60" r="25" fill="#FDE047" stroke="#CA8A04" strokeWidth="2.5" />
            <circle cx="51" cy="55" r="3.8" fill="#1E293B" />
            <circle cx="69" cy="55" r="3.8" fill="#1E293B" />
            <polygon points="56,64 64,64 60,69" fill="#9A3412" />
            <path d="M 52 74 Q 60 79 68 74" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );
      case 'harimau':
        return (
          <g>
            <circle cx="32" cy="34" r="9" fill="#F97316" stroke="#9A3412" strokeWidth="2.5" />
            <circle cx="88" cy="34" r="9" fill="#F97316" stroke="#9A3412" strokeWidth="2.5" />
            <circle cx="60" cy="60" r="30" fill="#FB923C" stroke="#9A3412" strokeWidth="3.5" />
            <path d="M 54 34 L 60 44 L 66 34 M 34 56 L 44 58 M 86 56 L 76 58" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="49" cy="56" r="4" fill="#1E293B" />
            <circle cx="71" cy="56" r="4" fill="#1E293B" />
            <ellipse cx="60" cy="70" rx="12" ry="9" fill="#FFFFFF" />
            <polygon points="56,66 64,66 60,70" fill="#1E293B" />
          </g>
        );
      case 'katak':
        return (
          <g>
            <circle cx="42" cy="38" r="11" fill="#4ADE80" stroke="#15803D" strokeWidth="3" />
            <circle cx="78" cy="38" r="11" fill="#4ADE80" stroke="#15803D" strokeWidth="3" />
            <circle cx="42" cy="38" r="5" fill="#FFFFFF" />
            <circle cx="78" cy="38" r="5" fill="#FFFFFF" />
            <circle cx="42" cy="38" r="2.8" fill="#1E293B" />
            <circle cx="78" cy="38" r="2.8" fill="#1E293B" />
            <ellipse cx="60" cy="66" rx="34" ry="24" fill="#4ADE80" stroke="#15803D" strokeWidth="3.5" />
            <path d="M 42 70 Q 60 82 78 70" fill="none" stroke="#15803D" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        );
      case 'lebah':
        return (
          <g>
            <ellipse cx="48" cy="34" rx="12" ry="16" transform="rotate(-20 48 34)" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="2.5" />
            <ellipse cx="72" cy="34" rx="12" ry="16" transform="rotate(20 72 34)" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="2.5" />
            <ellipse cx="60" cy="64" rx="30" ry="22" fill="#FACC15" stroke="#1E293B" strokeWidth="3.5" />
            <line x1="52" y1="43" x2="52" y2="85" stroke="#1E293B" strokeWidth="6" />
            <line x1="68" y1="43" x2="68" y2="85" stroke="#1E293B" strokeWidth="6" />
            <circle cx="40" cy="58" r="3.5" fill="#1E293B" />
          </g>
        );
      case 'kupu':
        return (
          <g>
            <ellipse cx="38" cy="46" rx="20" ry="16" fill="#F472B6" stroke="#BE185D" strokeWidth="3" />
            <ellipse cx="82" cy="46" rx="20" ry="16" fill="#F472B6" stroke="#BE185D" strokeWidth="3" />
            <ellipse cx="42" cy="74" rx="15" ry="13" fill="#A78BFA" stroke="#6D28D9" strokeWidth="3" />
            <ellipse cx="78" cy="74" rx="15" ry="13" fill="#A78BFA" stroke="#6D28D9" strokeWidth="3" />
            <rect x="56" y="34" width="8" height="52" rx="4" fill="#1E293B" />
            <path d="M 58 34 Q 48 20 42 22 M 62 34 Q 72 20 78 22" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );
      case 'kelinci':
        return (
          <g>
            <ellipse cx="44" cy="28" rx="9" ry="22" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="3" />
            <ellipse cx="76" cy="28" rx="9" ry="22" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="3" />
            <ellipse cx="44" cy="29" rx="4.5" ry="14" fill="#F9A8D4" />
            <ellipse cx="76" cy="29" rx="4.5" ry="14" fill="#F9A8D4" />
            <circle cx="60" cy="68" r="28" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="3.5" />
            <circle cx="49" cy="64" r="4" fill="#1E293B" />
            <circle cx="71" cy="64" r="4" fill="#1E293B" />
            <ellipse cx="60" cy="72" rx="4" ry="2.8" fill="#F472B6" />
          </g>
        );
      case 'panda':
        return (
          <g>
            <circle cx="32" cy="34" r="11" fill="#1E293B" />
            <circle cx="88" cy="34" r="11" fill="#1E293B" />
            <circle cx="60" cy="62" r="31" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3.5" />
            <ellipse cx="47" cy="58" rx="8" ry="10" transform="rotate(-15 47 58)" fill="#1E293B" />
            <ellipse cx="73" cy="58" rx="8" ry="10" transform="rotate(15 73 58)" fill="#1E293B" />
            <circle cx="47" cy="56" r="3" fill="#FFFFFF" />
            <circle cx="73" cy="56" r="3" fill="#FFFFFF" />
            <ellipse cx="60" cy="68" rx="5" ry="3.5" fill="#1E293B" />
          </g>
        );
      case 'penguin':
        return (
          <g>
            <ellipse cx="60" cy="62" rx="28" ry="34" fill="#1E293B" />
            <ellipse cx="60" cy="68" rx="19" ry="24" fill="#FFFFFF" />
            <circle cx="50" cy="48" r="3.5" fill="#FFFFFF" />
            <circle cx="70" cy="48" r="3.5" fill="#FFFFFF" />
            <circle cx="50" cy="48" r="1.8" fill="#1E293B" />
            <circle cx="70" cy="48" r="1.8" fill="#1E293B" />
            <polygon points="54,56 66,56 60,64" fill="#F97316" />
          </g>
        );
      case 'jerapah':
        return (
          <g>
            <rect x="48" y="48" width="24" height="52" rx="10" fill="#FACC15" stroke="#CA8A04" strokeWidth="3" />
            <circle cx="60" cy="38" r="18" fill="#FDE047" stroke="#CA8A04" strokeWidth="3" />
            <line x1="52" y1="22" x2="50" y2="12" stroke="#92400E" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="68" y1="22" x2="70" y2="12" stroke="#92400E" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="50" cy="12" r="3.5" fill="#92400E" />
            <circle cx="70" cy="12" r="3.5" fill="#92400E" />
            <circle cx="53" cy="35" r="3" fill="#1E293B" />
            <circle cx="67" cy="35" r="3" fill="#1E293B" />
            <circle cx="58" cy="68" r="5" fill="#D97706" />
            <circle cx="64" cy="84" r="4" fill="#D97706" />
          </g>
        );
      case 'burung':
        return (
          <g>
            <ellipse cx="60" cy="62" rx="28" ry="24" fill="#38BDF8" stroke="#0369A1" strokeWidth="3.5" />
            <polygon points="86,56 100,60 86,66" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
            <circle cx="72" cy="54" r="4" fill="#1E293B" />
            <ellipse cx="52" cy="64" rx="14" ry="9" fill="#BAE6FD" />
          </g>
        );
      case 'domba':
        return (
          <g>
            <circle cx="44" cy="50" r="16" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />
            <circle cx="76" cy="50" r="16" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />
            <circle cx="60" cy="40" r="16" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />
            <circle cx="48" cy="70" r="16" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />
            <circle cx="72" cy="70" r="16" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />
            <ellipse cx="60" cy="60" rx="16" ry="18" fill="#334155" />
            <circle cx="54" cy="56" r="3" fill="#FFFFFF" />
            <circle cx="66" cy="56" r="3" fill="#FFFFFF" />
          </g>
        );
      case 'kambing':
      case 'rusa':
      case 'kuda':
        return (
          <g>
            <path d="M 42 26 L 34 14 M 78 26 L 86 14" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="60" cy="58" rx="26" ry="30" fill="#D97706" stroke="#78350F" strokeWidth="3.5" />
            <circle cx="50" cy="50" r="4" fill="#1E293B" />
            <circle cx="70" cy="50" r="4" fill="#1E293B" />
            <ellipse cx="60" cy="72" rx="16" ry="11" fill="#FDE68A" />
          </g>
        );
      case 'monyet':
        return (
          <g>
            <circle cx="26" cy="56" r="10" fill="#FDE68A" stroke="#92400E" strokeWidth="3" />
            <circle cx="94" cy="56" r="10" fill="#FDE68A" stroke="#92400E" strokeWidth="3" />
            <circle cx="60" cy="58" r="28" fill="#92400E" />
            <ellipse cx="60" cy="66" rx="20" ry="16" fill="#FDE68A" />
            <circle cx="50" cy="52" r="4" fill="#1E293B" />
            <circle cx="70" cy="52" r="4" fill="#1E293B" />
            <path d="M 52 70 Q 60 76 68 70" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );
      case 'ular':
        return (
          <g>
            <path d="M 24 78 C 24 54, 54 54, 54 70 C 54 84, 84 84, 84 56 C 84 36, 62 34, 62 34" fill="none" stroke="#22C55E" strokeWidth="14" strokeLinecap="round" />
            <circle cx="58" cy="34" r="12" fill="#22C55E" stroke="#15803D" strokeWidth="2.5" />
            <circle cx="54" cy="32" r="2.8" fill="#1E293B" />
          </g>
        );
      case 'zebra':
        return (
          <g>
            <ellipse cx="60" cy="60" rx="28" ry="30" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3.5" />
            <path d="M 38 42 L 54 48 M 34 58 L 52 60 M 82 42 L 66 48 M 86 58 L 68 60" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
            <circle cx="50" cy="52" r="4" fill="#1E293B" />
            <circle cx="70" cy="52" r="4" fill="#1E293B" />
          </g>
        );
      case 'mobil':
      case 'bus':
        return (
          <g>
            <path d="M 24 60 L 34 38 L 84 38 L 96 60 Z" fill={key === 'bus' ? '#FACC15' : '#38BDF8'} stroke="#1E293B" strokeWidth="3" />
            <rect x="16" y="58" width="88" height="24" rx="8" fill={key === 'bus' ? '#F59E0B' : '#0284C7'} stroke="#1E293B" strokeWidth="3.5" />
            <rect x="38" y="43" width="18" height="14" rx="2" fill="#E0F2FE" />
            <rect x="62" y="43" width="18" height="14" rx="2" fill="#E0F2FE" />
            <circle cx="36" cy="84" r="11" fill="#1E293B" />
            <circle cx="36" cy="84" r="5" fill="#CBD5E1" />
            <circle cx="84" cy="84" r="11" fill="#1E293B" />
            <circle cx="84" cy="84" r="5" fill="#CBD5E1" />
          </g>
        );
      case 'pesawat':
        return (
          <g>
            <path d="M 20 62 L 96 42 L 102 52 L 32 76 Z" fill="#38BDF8" stroke="#0369A1" strokeWidth="3" />
            <polygon points="48,54 34,26 48,26 68,50" fill="#F472B6" stroke="#BE185D" strokeWidth="2.5" />
            <polygon points="50,68 42,92 56,92 68,64" fill="#F472B6" stroke="#BE185D" strokeWidth="2.5" />
            <circle cx="78" cy="52" r="4" fill="#FFFFFF" />
          </g>
        );
      case 'kereta':
        return (
          <g>
            <rect x="22" y="34" width="76" height="46" rx="10" fill="#EF4444" stroke="#991B1B" strokeWidth="3.5" />
            <rect x="32" y="44" width="22" height="18" rx="4" fill="#E0F2FE" />
            <rect x="64" y="44" width="22" height="18" rx="4" fill="#E0F2FE" />
            <circle cx="38" cy="86" r="9" fill="#1E293B" />
            <circle cx="82" cy="86" r="9" fill="#1E293B" />
            <rect x="34" y="20" width="12" height="14" rx="3" fill="#1E293B" />
          </g>
        );
      case 'kapal':
        return (
          <g>
            <polygon points="60,20 60,64 88,64" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" />
            <polygon points="56,28 56,64 34,64" fill="#FACC15" stroke="#CA8A04" strokeWidth="2.5" />
            <path d="M 20 68 L 100 68 L 88 90 L 32 90 Z" fill="#0284C7" stroke="#0369A1" strokeWidth="3" />
          </g>
        );
      case 'rumah':
      case 'sekolah':
        return (
          <g>
            <polygon points="18,54 60,20 102,54" fill={key === 'sekolah' ? '#EF4444' : '#F472B6'} stroke="#1E293B" strokeWidth="3.5" strokeLinejoin="round" />
            <rect x="28" y="54" width="64" height="44" rx="4" fill="#FEF3C7" stroke="#1E293B" strokeWidth="3.5" />
            <rect x="50" y="68" width="20" height="30" rx="3" fill="#38BDF8" stroke="#1E293B" strokeWidth="2.5" />
            <rect x="34" y="62" width="12" height="12" rx="2" fill="#BAE6FD" stroke="#1E293B" strokeWidth="2" />
            <rect x="74" y="62" width="12" height="12" rx="2" fill="#BAE6FD" stroke="#1E293B" strokeWidth="2" />
          </g>
        );
      case 'bunga':
        return (
          <g>
            <line x1="60" y1="62" x2="60" y2="100" stroke="#22C55E" strokeWidth="6" strokeLinecap="round" />
            <circle cx="60" cy="32" r="14" fill="#F472B6" />
            <circle cx="42" cy="48" r="14" fill="#F472B6" />
            <circle cx="78" cy="48" r="14" fill="#F472B6" />
            <circle cx="50" cy="66" r="14" fill="#F472B6" />
            <circle cx="70" cy="66" r="14" fill="#F472B6" />
            <circle cx="60" cy="52" r="13" fill="#FACC15" stroke="#CA8A04" strokeWidth="2.5" />
          </g>
        );
      case 'pelangi':
        return (
          <g>
            <path d="M 18 82 A 42 42 0 0 1 102 82" fill="none" stroke="#EF4444" strokeWidth="8" strokeLinecap="round" />
            <path d="M 26 82 A 34 34 0 0 1 94 82" fill="none" stroke="#FACC15" strokeWidth="8" strokeLinecap="round" />
            <path d="M 34 82 A 26 26 0 0 1 86 82" fill="none" stroke="#34D399" strokeWidth="8" strokeLinecap="round" />
            <path d="M 42 82 A 18 18 0 0 1 78 82" fill="none" stroke="#38BDF8" strokeWidth="8" strokeLinecap="round" />
            <circle cx="24" cy="84" r="12" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="2.5" />
            <circle cx="96" cy="84" r="12" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="2.5" />
          </g>
        );
      case 'bintang':
        return (
          <g>
            <polygon
              points="60,16 72,44 102,46 79,66 86,96 60,80 34,96 41,66 18,46 48,44"
              fill="#FACC15"
              stroke="#CA8A04"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <circle cx="52" cy="54" r="3.5" fill="#1E293B" />
            <circle cx="68" cy="54" r="3.5" fill="#1E293B" />
            <path d="M 54 64 Q 60 69 66 64" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );
      case 'matahari':
        return (
          <g>
            <circle cx="60" cy="60" r="24" fill="#FACC15" stroke="#EA580C" strokeWidth="3.5" />
            <path d="M 60 16 L 60 28 M 60 92 L 60 104 M 16 60 L 28 60 M 92 60 L 104 60 M 28 28 L 38 38 M 82 82 L 92 92 M 92 28 L 82 38 M 38 82 L 28 92" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
            <circle cx="52" cy="56" r="3" fill="#1E293B" />
            <circle cx="68" cy="56" r="3" fill="#1E293B" />
            <path d="M 54 66 Q 60 72 66 66" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );
      case 'balon':
        return (
          <g>
            <path d="M 60 82 Q 56 94 64 104" fill="none" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="60" cy="48" rx="28" ry="34" fill="#F472B6" stroke="#BE185D" strokeWidth="3.5" />
            <polygon points="54,81 66,81 60,88" fill="#F472B6" stroke="#BE185D" strokeWidth="2" />
            <ellipse cx="48" cy="36" rx="6" ry="11" transform="rotate(-20 48 36)" fill="#FBCFE8" opacity="0.7" />
          </g>
        );
      case 'payung':
        return (
          <g>
            <path d="M 60 22 L 60 86 C 60 96, 74 96, 74 86" fill="none" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 18 58 A 42 36 0 0 1 102 58 Q 88 52 74 58 Q 60 52 46 58 Q 32 52 18 58 Z" fill="#A78BFA" stroke="#5B21B6" strokeWidth="3.5" />
          </g>
        );
      case 'jam':
        return (
          <g>
            <circle cx="60" cy="60" r="36" fill="#FFFFFF" stroke="#0284C7" strokeWidth="5" />
            <circle cx="60" cy="60" r="4" fill="#1E293B" />
            <line x1="60" y1="60" x2="60" y2="36" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
            <line x1="60" y1="60" x2="78" y2="60" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
          </g>
        );
      case 'lampu':
        return (
          <g>
            <path d="M 42 54 A 24 24 0 1 1 78 54 C 78 66, 70 70, 70 78 L 50 78 C 50 70, 42 66, 42 54 Z" fill="#FDE047" stroke="#CA8A04" strokeWidth="3.5" />
            <rect x="48" y="78" width="24" height="14" rx="4" fill="#94A3B8" stroke="#475569" strokeWidth="2.5" />
          </g>
        );
      case 'tas':
        return (
          <g>
            <path d="M 44 36 C 44 22, 76 22, 76 36" fill="none" stroke="#1E293B" strokeWidth="4" />
            <rect x="28" y="36" width="64" height="58" rx="14" fill="#38BDF8" stroke="#0369A1" strokeWidth="3.5" />
            <rect x="38" y="58" width="44" height="24" rx="8" fill="#FACC15" stroke="#CA8A04" strokeWidth="2.5" />
          </g>
        );
      case 'kue':
        return (
          <g>
            <rect x="26" y="54" width="68" height="36" rx="8" fill="#FBCFE8" stroke="#DB2777" strokeWidth="3.5" />
            <path d="M 26 58 Q 38 70 50 58 Q 60 70 70 58 Q 82 70 94 58" fill="none" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
            <rect x="57" y="32" width="6" height="22" fill="#38BDF8" />
            <ellipse cx="60" cy="24" rx="5" ry="7" fill="#FACC15" />
          </g>
        );
      case 'roti':
      case 'keju':
        return (
          <g>
            {key === 'keju' ? (
              <>
                <polygon points="22,78 96,78 96,44 22,60" fill="#FACC15" stroke="#CA8A04" strokeWidth="3.5" strokeLinejoin="round" />
                <circle cx="48" cy="68" r="5" fill="#CA8A04" opacity="0.5" />
                <circle cx="76" cy="60" r="7" fill="#CA8A04" opacity="0.5" />
              </>
            ) : (
              <>
                <rect x="24" y="42" width="72" height="44" rx="16" fill="#F59E0B" stroke="#92400E" strokeWidth="3.5" />
                <rect x="34" y="52" width="52" height="26" rx="10" fill="#FDE68A" />
              </>
            )}
          </g>
        );
      case 'kunci':
        return (
          <g>
            <circle cx="40" cy="60" r="18" fill="#FACC15" stroke="#CA8A04" strokeWidth="3.5" />
            <circle cx="40" cy="60" r="7" fill="#FFFFFF" />
            <rect x="56" y="55" width="44" height="10" rx="4" fill="#FACC15" stroke="#CA8A04" strokeWidth="3" />
            <rect x="78" y="64" width="8" height="12" rx="2" fill="#FACC15" stroke="#CA8A04" strokeWidth="2.5" />
            <rect x="90" y="64" width="8" height="16" rx="2" fill="#FACC15" stroke="#CA8A04" strokeWidth="2.5" />
          </g>
        );
      case 'kacamata':
        return (
          <g>
            <circle cx="38" cy="60" r="18" fill="#BAE6FD" stroke="#1E293B" strokeWidth="4" />
            <circle cx="82" cy="60" r="18" fill="#BAE6FD" stroke="#1E293B" strokeWidth="4" />
            <path d="M 56 58 Q 60 52 64 58" fill="none" stroke="#1E293B" strokeWidth="4" />
          </g>
        );
      case 'kamera':
        return (
          <g>
            <rect x="44" y="30" width="32" height="12" rx="4" fill="#475569" />
            <rect x="20" y="38" width="80" height="54" rx="12" fill="#38BDF8" stroke="#0369A1" strokeWidth="3.5" />
            <circle cx="60" cy="65" r="18" fill="#1E293B" stroke="#FFFFFF" strokeWidth="4" />
            <circle cx="60" cy="65" r="8" fill="#38BDF8" />
          </g>
        );
      case 'baju':
      case 'rok':
        return key === 'rok' ? (
          <g>
            <rect x="40" y="28" width="40" height="10" rx="4" fill="#DB2777" />
            <polygon points="40,38 80,38 96,88 24,88" fill="#F472B6" stroke="#BE185D" strokeWidth="3.5" strokeLinejoin="round" />
          </g>
        ) : (
          <g>
            <path d="M 38 30 L 20 44 L 30 58 L 40 50 L 40 90 L 80 90 L 80 50 L 90 58 L 100 44 L 82 30 Q 60 40 38 30 Z" fill="#34D399" stroke="#047857" strokeWidth="3.5" strokeLinejoin="round" />
          </g>
        );
      case 'kursi':
        return (
          <g>
            <rect x="34" y="24" width="52" height="36" rx="6" fill="#A78BFA" stroke="#5B21B6" strokeWidth="3.5" />
            <rect x="30" y="58" width="60" height="12" rx="5" fill="#7C3AED" stroke="#5B21B6" strokeWidth="3" />
            <line x1="38" y1="70" x2="38" y2="96" stroke="#5B21B6" strokeWidth="6" strokeLinecap="round" />
            <line x1="82" y1="70" x2="82" y2="96" stroke="#5B21B6" strokeWidth="6" strokeLinecap="round" />
          </g>
        );
      case 'pintu':
        return (
          <g>
            <rect x="34" y="20" width="52" height="80" rx="6" fill="#D97706" stroke="#78350F" strokeWidth="3.5" />
            <rect x="44" y="30" width="32" height="24" rx="3" fill="#FDE68A" />
            <circle cx="76" cy="64" r="4.5" fill="#FACC15" stroke="#78350F" strokeWidth="2" />
          </g>
        );
      case 'gelas':
      case 'air':
      case 'teh':
        return (
          <g>
            <polygon points="36,30 84,30 76,92 44,92" fill={key === 'teh' ? '#D97706' : '#BAE6FD'} stroke="#0284C7" strokeWidth="3.5" strokeLinejoin="round" />
            <path d="M 40 44 L 80 44" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          </g>
        );
      case 'api':
        return (
          <g>
            <path d="M 60 18 C 80 40, 92 60, 84 82 C 78 96, 42 96, 36 82 C 28 60, 46 38, 60 18 Z" fill="#F97316" stroke="#C2410C" strokeWidth="3" />
            <path d="M 60 44 C 70 58, 74 70, 68 82 C 64 88, 56 88, 52 82 C 46 70, 52 58, 60 44 Z" fill="#FACC15" />
          </g>
        );
      case 'es':
        return (
          <g>
            <polygon points="44,64 76,64 60,102" fill="#F59E0B" stroke="#B45309" strokeWidth="3" />
            <circle cx="52" cy="50" r="16" fill="#F472B6" stroke="#DB2777" strokeWidth="2.5" />
            <circle cx="68" cy="50" r="16" fill="#38BDF8" stroke="#0284C7" strokeWidth="2.5" />
            <circle cx="60" cy="36" r="16" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.5" />
          </g>
        );
      case 'boneka':
        return (
          <g>
            <circle cx="38" cy="32" r="10" fill="#B45309" />
            <circle cx="82" cy="32" r="10" fill="#B45309" />
            <circle cx="60" cy="48" r="24" fill="#D97706" stroke="#78350F" strokeWidth="3" />
            <ellipse cx="60" cy="82" rx="22" ry="18" fill="#F59E0B" stroke="#78350F" strokeWidth="3" />
            <circle cx="52" cy="45" r="3" fill="#1E293B" />
            <circle cx="68" cy="45" r="3" fill="#1E293B" />
            <ellipse cx="60" cy="54" rx="8" ry="6" fill="#FDE68A" />
          </g>
        );
      case 'ibu':
        return (
          <g>
            <circle cx="60" cy="46" r="22" fill="#FDE6C4" stroke="#92400E" strokeWidth="3" />
            <path d="M 36 46 C 36 20, 84 20, 84 46 C 72 34, 48 34, 36 46 Z" fill="#7C2D12" />
            <path d="M 30 98 C 34 72, 86 72, 90 98 Z" fill="#F472B6" stroke="#BE185D" strokeWidth="3" />
            <circle cx="52" cy="46" r="3" fill="#1E293B" />
            <circle cx="68" cy="46" r="3" fill="#1E293B" />
            <path d="M 54 56 Q 60 62 66 56" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );
      case 'vas':
        return (
          <g>
            <path d="M 46 46 L 74 46 L 82 78 C 82 94, 38 94, 38 78 Z" fill="#38BDF8" stroke="#0369A1" strokeWidth="3.5" />
            <line x1="60" y1="26" x2="60" y2="46" stroke="#22C55E" strokeWidth="4" />
            <circle cx="60" cy="24" r="10" fill="#F472B6" />
            <circle cx="60" cy="24" r="4" fill="#FACC15" />
          </g>
        );
      case 'ubi':
        return (
          <g>
            <ellipse cx="60" cy="64" rx="34" ry="20" transform="rotate(-14 60 64)" fill="#9333EA" stroke="#581C87" strokeWidth="3.5" />
            <circle cx="48" cy="60" r="3" fill="#C084FC" />
            <circle cx="70" cy="66" r="3" fill="#C084FC" />
          </g>
        );
      case 'ban':
        return (
          <g>
            <circle cx="60" cy="60" r="36" fill="#334155" stroke="#0F172A" strokeWidth="4" />
            <circle cx="60" cy="60" r="18" fill="#E2E8F0" stroke="#475569" strokeWidth="3" />
            <circle cx="60" cy="60" r="6" fill="#64748B" />
          </g>
        );
      case 'rak':
        return (
          <g>
            <rect x="26" y="24" width="68" height="76" rx="6" fill="#FDE68A" stroke="#B45309" strokeWidth="3.5" />
            <line x1="26" y1="50" x2="94" y2="50" stroke="#B45309" strokeWidth="4" />
            <line x1="26" y1="74" x2="94" y2="74" stroke="#B45309" strokeWidth="4" />
            <rect x="34" y="30" width="10" height="18" rx="2" fill="#38BDF8" />
            <rect x="48" y="30" width="10" height="18" rx="2" fill="#F472B6" />
            <rect x="64" y="54" width="12" height="18" rx="2" fill="#34D399" />
          </g>
        );
      case 'sup':
        return (
          <g>
            <path d="M 24 58 A 36 30 0 0 0 96 58 Z" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3.5" />
            <ellipse cx="60" cy="58" rx="36" ry="9" fill="#FACC15" stroke="#CA8A04" strokeWidth="3" />
            <circle cx="48" cy="58" r="4" fill="#F97316" />
            <circle cx="66" cy="59" r="4" fill="#22C55E" />
          </g>
        );
      case 'obat':
        return (
          <g>
            <rect x="36" y="36" width="48" height="60" rx="10" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3.5" />
            <rect x="44" y="22" width="32" height="14" rx="4" fill="#38BDF8" stroke="#0284C7" strokeWidth="3" />
            <path d="M 60 54 L 60 78 M 48 66 L 72 66" stroke="#EF4444" strokeWidth="7" strokeLinecap="round" />
          </g>
        );
      case 'xilofon':
        return (
          <g>
            <rect x="20" y="34" width="14" height="54" rx="5" fill="#EF4444" stroke="#991B1B" strokeWidth="2.5" />
            <rect x="38" y="38" width="14" height="48" rx="5" fill="#FACC15" stroke="#CA8A04" strokeWidth="2.5" />
            <rect x="56" y="42" width="14" height="42" rx="5" fill="#22C55E" stroke="#15803D" strokeWidth="2.5" />
            <rect x="74" y="46" width="14" height="36" rx="5" fill="#38BDF8" stroke="#0369A1" strokeWidth="2.5" />
            <rect x="92" y="50" width="12" height="30" rx="5" fill="#A855F7" stroke="#6B21A8" strokeWidth="2.5" />
          </g>
        );
      case 'yoyo':
        return (
          <g>
            <path d="M 60 16 L 60 40" stroke="#64748B" strokeWidth="3" />
            <circle cx="60" cy="66" r="28" fill="#F43F5E" stroke="#9F1239" strokeWidth="3.5" />
            <circle cx="60" cy="66" r="14" fill="#FACC15" stroke="#9F1239" strokeWidth="2.5" />
          </g>
        );
      case 'cicak':
      case 'elang':
      case 'flamingo':
        return (
          <g>
            <ellipse cx="60" cy="60" rx="28" ry="26" fill={key === 'flamingo' ? '#F472B6' : key === 'elang' ? '#92400E' : '#84CC16'} stroke="#1E293B" strokeWidth="3" />
            <circle cx="50" cy="54" r="4" fill="#FFFFFF" />
            <circle cx="70" cy="54" r="4" fill="#FFFFFF" />
            <circle cx="50" cy="54" r="2" fill="#1E293B" />
            <circle cx="70" cy="54" r="2" fill="#1E293B" />
            <polygon points="56,64 64,64 60,72" fill="#FACC15" />
          </g>
        );
      case 'kaki':
      case 'jari':
        return (
          <g>
            <rect x="38" y="48" width="44" height="44" rx="16" fill="#FDE6C4" stroke="#B45309" strokeWidth="3" />
            <rect x="34" y="28" width="10" height="28" rx="5" fill="#FDE6C4" stroke="#B45309" strokeWidth="2.5" />
            <rect x="47" y="20" width="10" height="34" rx="5" fill="#FDE6C4" stroke="#B45309" strokeWidth="2.5" />
            <rect x="60" y="22" width="10" height="32" rx="5" fill="#FDE6C4" stroke="#B45309" strokeWidth="2.5" />
            <rect x="73" y="28" width="10" height="28" rx="5" fill="#FDE6C4" stroke="#B45309" strokeWidth="2.5" />
          </g>
        );
      default: {
        // Fallback illustrated badge with object initial & pastel frame
        const label = key.slice(0, 1).toUpperCase();
        return (
          <g>
            <rect x="20" y="20" width="80" height="80" rx="22" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="4" />
            <circle cx="60" cy="56" r="22" fill="#FACC15" />
            <text
              x="60"
              y="66"
              textAnchor="middle"
              fontSize="28"
              fontWeight="800"
              fill="#1E293B"
              fontFamily="Outfit, sans-serif"
            >
              {label}
            </text>
          </g>
        );
      }
    }
  };

  return (
    <svg
      viewBox="0 0 120 120"
      className={`${dim} select-none shrink-0 ${className}`}
      role="img"
      aria-label={`Ilustrasi ${itemKey}`}
    >
      {renderArtwork()}
    </svg>
  );
};
