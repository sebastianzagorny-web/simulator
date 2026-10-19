import React from 'react';
import { GameState } from '../types/game';
import { sound } from '../utils/sound';
import { Crown, Sparkles, RefreshCw, Skull, Trophy, Landmark } from 'lucide-react';

interface GameOverModalProps {
  state: GameState;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ state, onRestart }) => {
  if (!state.gameOver) return null;

  const isVictory = state.gameOver.victory;

  // Calculate legacy title based on achievements
  let epithet = 'Der Pragmatiker';
  if (isVictory) {
    if (state.ruler.reignYears >= 25) epithet = 'Der Große';
    else if (state.macro.gdp > 30000) epithet = 'Der Wohlstandsmehrer';
    else epithet = 'Der Siegreiche';
  } else {
    if (state.unrest > 80) epithet = 'Der Tyrann';
    else if (state.macro.treasury <= 0) epithet = 'Der Bankrotteur';
    else epithet = 'Der Abgesetzte';
  }

  const legacyScore = Math.round(
    (state.ruler.reignYears * 40) +
    (state.macro.gdp / 100) +
    (state.stability * 5) +
    (state.ruler.popularity * 4) +
    (state.ruler.slushFund * 20)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300 select-none">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        
        {/* Banner */}
        <div className={`px-6 py-6 text-center space-y-2 ${
          isVictory
            ? 'bg-gradient-to-b from-amber-500/20 to-slate-900 border-b border-amber-500/30'
            : 'bg-gradient-to-b from-rose-950/40 to-slate-900 border-b border-rose-900/40'
        }`}>
          <div className="flex justify-center">
            {isVictory ? (
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-amber-300" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center">
                <Skull className="w-8 h-8 text-rose-400" />
              </div>
            )}
          </div>

          <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400 block">
            {isVictory ? 'HISTORISCHES ERBE GESICHERT' : 'REGIME BEENDET & ENTZWEIT'}
          </span>

          <h2 className="text-2xl sm:text-3xl font-black font-['Cinzel'] text-white">
            {state.ruler.title} {state.ruler.name} "{epithet}"
          </h2>
        </div>

        {/* Reason Prose */}
        <div className="p-6 space-y-5">
          <p className="text-sm text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800 leading-relaxed text-center">
            {state.gameOver.reason}
          </p>

          {/* Historical Chronicle Summary */}
          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase block">Gesamte Regierungszeit</span>
              <span className="text-base font-bold text-white tabular-nums">
                {state.ruler.reignYears} Jahre
              </span>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase block">Prestige- & Vermächtnispunkte</span>
              <span className="text-base font-bold text-amber-400 tabular-nums">
                {legacyScore.toLocaleString()} PKT
              </span>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase block">Endgültiges BIP</span>
              <span className="text-base font-bold text-emerald-400 tabular-nums">
                {state.currencySymbol}{state.macro.gdp.toLocaleString()} Mrd.
              </span>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase block">Dynastisches Fluchtkapital</span>
              <span className="text-base font-bold text-amber-300 tabular-nums">
                {state.currencySymbol}{state.ruler.slushFund.toFixed(1)} Mrd.
              </span>
            </div>
          </div>

          {/* Restart Action */}
          <div className="pt-2">
            <button
              onClick={() => {
                sound.playStamp();
                onRestart();
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-slate-950" />
              <span>Neue Souveräne Herrschaft Beginnen</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
