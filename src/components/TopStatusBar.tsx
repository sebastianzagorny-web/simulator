import React from 'react';
import { GameState } from '../types/game';
import { sound } from '../utils/sound';
import {
  Play,
  Pause,
  FastForward,
  SkipForward,
  Volume2,
  VolumeX,
  Shield,
  AlertTriangle,
  TrendingUp,
  Sun,
  Moon,
  Terminal,
  DollarSign,
  Users,
  Award,
  Globe2,
  Building,
  Briefcase
} from 'lucide-react';

export type ActiveTabType = 
  | 'overview' 
  | 'president' 
  | 'cabinet' 
  | 'economy' 
  | 'corporate100' 
  | 'trade' 
  | 'stock' 
  | 'shadow' 
  | 'demographics' 
  | 'politics' 
  | 'military' 
  | 'design';

interface TopStatusBarProps {
  state: GameState;
  onTogglePause: () => void;
  onChangeSpeed: (speed: 1 | 2 | 3 | 4) => void;
  onAdvanceQuarter: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  activeTab: ActiveTabType;
  onSelectTab: (tab: ActiveTabType) => void;
  onToggleTheme: () => void;
  onOpenAdmin: () => void;
}

export const TopStatusBar: React.FC<TopStatusBarProps> = ({
  state,
  onTogglePause,
  onChangeSpeed,
  onAdvanceQuarter,
  isMuted,
  onToggleMute,
  activeTab,
  onSelectTab,
  onToggleTheme,
  onOpenAdmin
}) => {
  const isSurplus = state.macro.gdpGrowthRate >= 0;
  const yearText = state.year < 0 ? `${Math.abs(state.year)} v. Chr.` : `${state.year} n. Chr.`;

  // Calculate average foreign relations score (-100 to +100)
  const avgRelations = state.rivals.length > 0
    ? Math.round(state.rivals.reduce((acc, r) => acc + r.relations, 0) / state.rivals.length)
    : 50;

  const glassBar = state.themeMode === 'light'
    ? 'bg-white/90 backdrop-blur-xl border-b border-slate-300 text-slate-900 shadow-md'
    : 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 text-slate-100 shadow-xl';

  const subRibbon = state.themeMode === 'light'
    ? 'bg-slate-100/70 border-b border-slate-200'
    : 'bg-slate-950/50 border-b border-slate-900/60';

  return (
    <div className={`w-full select-none z-30 shrink-0 ${glassBar}`}>
      {/* 1. UPPER COMMAND CENTER HUD: Dauerhaft sichtbare Kennzahlen */}
      <div className={`flex flex-wrap items-center justify-between px-4 py-2 gap-y-2 ${subRibbon}`}>
        
        {/* Left: Nation, Mode & Ruler Identity */}
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow overflow-hidden border border-amber-500/40 shrink-0"
            style={{ backgroundColor: state.flagPrimaryColor }}
            title={`${state.countryName} - ${state.governmentType}`}
          >
            <Shield className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Cinzel'] font-black text-sm tracking-wide">
                {state.countryName}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-mono">
                {state.playMode === 'shadow_president' ? 'Schatten-Präsidentschaft' : 'Ehrlicher Staatsmann'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
              {state.ruler.title} {state.ruler.name} ({state.ruler.party})
            </div>
          </div>
        </div>

        {/* Center: Permanently Visible Vital Indicators */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs font-mono overflow-x-auto py-1">
          {/* Kalender */}
          <div className="text-center px-1.5">
            <span className="text-[9px] text-slate-400 block uppercase">Spieldatum</span>
            <span className="text-amber-400 font-bold tabular-nums">
              {yearText} · Q{state.quarter}
            </span>
          </div>

          {/* Staatskasse */}
          <div className="text-center px-1.5 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onSelectTab('economy')}>
            <span className="text-[9px] text-slate-400 block uppercase">Staatskasse</span>
            <span className="text-emerald-400 font-bold tabular-nums">
              {state.currencySymbol}{state.macro.treasury.toFixed(1)} Mrd.
            </span>
          </div>

          {/* BIP */}
          <div className="text-center px-1.5 cursor-pointer hover:opacity-80 transition-opacity hidden md:block" onClick={() => onSelectTab('economy')}>
            <span className="text-[9px] text-slate-400 block uppercase">BIP</span>
            <span className="text-slate-200 font-bold tabular-nums">
              {state.currencySymbol}{state.macro.gdp.toLocaleString()} Mrd.
            </span>
          </div>

          {/* Staatsverschuldung */}
          <div className="text-center px-1.5 cursor-pointer hover:opacity-80 transition-opacity hidden sm:block" onClick={() => onSelectTab('economy')}>
            <span className="text-[9px] text-slate-400 block uppercase">Verschuldung</span>
            <span className="text-rose-400 font-bold tabular-nums">
              {state.currencySymbol}{state.macro.nationalDebt.toFixed(1)} Mrd.
            </span>
          </div>

          {/* Bevölkerung */}
          <div className="text-center px-1.5 cursor-pointer hover:opacity-80 transition-opacity hidden lg:block" onClick={() => onSelectTab('demographics')}>
            <span className="text-[9px] text-slate-400 block uppercase">Bevölkerung</span>
            <span className="text-sky-400 font-bold tabular-nums">
              {state.population.total.toFixed(1)} Mio.
            </span>
          </div>

          {/* Zufriedenheit / Beliebtheit */}
          <div className="text-center px-1.5 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onSelectTab('president')}>
            <span className="text-[9px] text-slate-400 block uppercase">Beliebtheit</span>
            <span className={`font-bold tabular-nums ${state.ruler.popularity >= 50 ? 'text-sky-400' : 'text-rose-400'}`}>
              {Math.round(state.ruler.popularity)}%
            </span>
          </div>

          {/* Stabilität */}
          <div className="text-center px-1.5 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onSelectTab('politics')}>
            <span className="text-[9px] text-slate-400 block uppercase">Stabilität</span>
            <span className={`font-bold tabular-nums ${state.stability >= 60 ? 'text-emerald-400' : state.stability >= 30 ? 'text-amber-400' : 'text-rose-400'}`}>
              {state.stability}%
            </span>
          </div>

          {/* Arbeitslosigkeit */}
          <div className="text-center px-1.5 cursor-pointer hover:opacity-80 transition-opacity hidden xl:block" onClick={() => onSelectTab('economy')}>
            <span className="text-[9px] text-slate-400 block uppercase">Arbeitslose</span>
            <span className="text-amber-300 font-bold tabular-nums">
              {state.macro.unemploymentRate.toFixed(1)}%
            </span>
          </div>

          {/* Inflation */}
          <div className="text-center px-1.5 cursor-pointer hover:opacity-80 transition-opacity hidden xl:block" onClick={() => onSelectTab('economy')}>
            <span className="text-[9px] text-slate-400 block uppercase">Inflation</span>
            <span className={`font-bold tabular-nums ${state.macro.inflationRate > 5 ? 'text-rose-400' : 'text-slate-300'}`}>
              {state.macro.inflationRate.toFixed(1)}%
            </span>
          </div>

          {/* Internationale Beziehungen */}
          <div className="text-center px-1.5 cursor-pointer hover:opacity-80 transition-opacity hidden 2xl:block" onClick={() => onSelectTab('overview')}>
            <span className="text-[9px] text-slate-400 block uppercase">Int. Beziehungen</span>
            <span className={`font-bold tabular-nums ${avgRelations >= 60 ? 'text-emerald-400' : avgRelations >= 30 ? 'text-amber-400' : 'text-rose-400'}`}>
              {avgRelations > 0 ? `+${avgRelations}` : avgRelations}
            </span>
          </div>

          {/* Privatvermögen des Präsidenten */}
          <div className="text-center px-1.5 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onSelectTab('president')}>
            <span className="text-[9px] text-slate-400 block uppercase">Privatvermögen</span>
            <span className="text-amber-400 font-bold tabular-nums">
              {state.currencySymbol}{state.ruler.slushFund.toFixed(2)} Mrd.
            </span>
          </div>
        </div>

        {/* Right: Simulation Speeds, Admin, Theme & Audio Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Admin- / Cheat-Konsole Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenAdmin();
            }}
            className="p-1.5 rounded-lg border border-amber-500/50 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-all flex items-center gap-1 shadow-sm"
            title="Admin- & Cheat-Konsole öffnen"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="text-[11px] font-mono font-bold hidden sm:inline">Admin/Cheats</span>
          </button>

          {/* Light / Dark Theme Mode Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleTheme();
            }}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-900/60 text-slate-300 hover:text-white transition-colors"
            title="Design umschalten: Hell / Dunkel"
          >
            {state.themeMode === 'light' ? <Moon className="w-3.5 h-3.5 text-indigo-500" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          {/* Pause / Play */}
          <button
            onClick={() => {
              sound.playClick();
              onTogglePause();
            }}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
              state.isPaused 
                ? 'border-amber-500 bg-amber-500/20 text-amber-300' 
                : 'border-slate-700 bg-slate-900 text-slate-300 hover:text-white'
            }`}
            title="Leertaste: Pause / Weiter"
          >
            {state.isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span className="text-[11px] font-mono hidden md:inline">{state.isPaused ? 'Pausiert' : 'Laufend'}</span>
          </button>

          {/* 4 Speed Toggles: 1 (6 Min/J), 2 (3 Min/J), 3 (2 Min/J), 4 (1 Min/J) */}
          <div className="hidden sm:flex items-center bg-slate-900/80 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
            {([
              { spd: 1, label: '1x (6m)' },
              { spd: 2, label: '2x (3m)' },
              { spd: 3, label: '3x (2m)' },
              { spd: 4, label: 'Max (1m)' }
            ] as const).map(({ spd, label }) => (
              <button
                key={spd}
                onClick={() => {
                  sound.playClick();
                  onChangeSpeed(spd);
                }}
                className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                  state.gameSpeed === spd
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title={`Geschwindigkeit Stufe ${spd}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Advance Quarter Button */}
          <button
            onClick={() => {
              sound.playStamp();
              onAdvanceQuarter();
            }}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-amber-300 flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
            title="Taste: N (Quartal manuell vorrücken)"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span className="text-[11px] font-mono whitespace-nowrap">Q+1</span>
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleMute();
            }}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-colors"
            title="Ton an/aus"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </div>
      </div>
    </div>
  );
};
