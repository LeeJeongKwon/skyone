import React from 'react';

interface SangpyeongCoinProps {
  isHead: boolean; // true = 앞면 (常平通寶, 양, 3점), false = 뒷면 (음, 2점)
  isFlipping?: boolean;
  size?: 'sm' | 'md' | 'lg';
  delayMs?: number;
}

export const SangpyeongCoin: React.FC<SangpyeongCoinProps> = ({
  isHead,
  isFlipping = false,
  size = 'md',
  delayMs = 0,
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12 text-[10px]',
    md: 'w-16 h-16 sm:w-20 sm:h-20 text-xs sm:text-sm',
    lg: 'w-20 h-20 sm:w-24 sm:h-24 text-sm sm:text-base',
  }[size];

  const holeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4 sm:w-5 sm:h-5',
    lg: 'w-5 h-5 sm:w-6 sm:h-6',
  }[size];

  return (
    <div
      style={{ animationDelay: `${delayMs}ms` }}
      className={`relative rounded-full select-none flex items-center justify-center shadow-lg transition-transform ${sizeClasses} ${
        isFlipping ? 'animate-coin-tumble' : ''
      }`}
    >
      {/* Coin Outer Rim & Metallic Gradient */}
      <div className={`w-full h-full rounded-full border-2 sm:border-3 p-1 flex items-center justify-center relative overflow-hidden transition-colors ${
        isHead
          ? 'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 border-amber-400/80 shadow-amber-900/40'
          : 'bg-gradient-to-br from-stone-600 via-stone-700 to-stone-800 border-stone-400/80 shadow-stone-900/40'
      }`}>
        {/* Subtle metallic radial sheen */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_60%)] pointer-events-none" />

        {/* Center Square Cutout (方孔) */}
        <div className={`relative ${holeClasses} bg-stone-950 border border-amber-300/40 rounded-xs shadow-inner z-10 flex items-center justify-center`} />

        {/* Inscriptions */}
        {isHead ? (
          <div className="absolute inset-0 flex flex-col justify-between items-center py-1 sm:py-1.5 font-serif-kr font-extrabold text-amber-200 tracking-tighter">
            <span className="leading-none drop-shadow-xs">常</span>
            <div className="w-full flex justify-between px-1 sm:px-2 leading-none">
              <span className="drop-shadow-xs">寶</span>
              <span className="drop-shadow-xs">通</span>
            </div>
            <span className="leading-none drop-shadow-xs">平</span>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col justify-between items-center py-1.5 font-serif-kr font-bold text-stone-300 tracking-wider">
            <span className="text-[10px] sm:text-xs leading-none opacity-80">戶</span>
            <div className="w-full flex justify-between px-2 text-[9px] sm:text-[11px] leading-none opacity-60">
              <span>●</span>
              <span>●</span>
            </div>
            <span className="text-[10px] sm:text-xs leading-none opacity-80">一</span>
          </div>
        )}
      </div>

      {/* Floating Value Tag (양 3점 / 음 2점) */}
      <span className={`absolute -bottom-2 px-1.5 py-0.2 rounded text-[10px] font-bold font-mono tracking-tight border shadow-xs ${
        isHead 
          ? 'bg-amber-950/90 text-amber-300 border-amber-700/60' 
          : 'bg-stone-900/90 text-stone-300 border-stone-600/60'
      }`}>
        {isHead ? '陽 3' : '陰 2'}
      </span>
    </div>
  );
};
