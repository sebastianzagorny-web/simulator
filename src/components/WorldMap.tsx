import React, { useState } from 'react';
import { GameState, RivalNation } from '../types/game';
import { sound } from '../utils/sound';
import { Shield, Swords, Globe2, Handshake, DollarSign, Crosshair, X, AlertTriangle } from 'lucide-react';

interface WorldMapProps {
  state: GameState;
  onUpdateRival: (rivalId: string, updates: Partial<RivalNation>) => void;
  onUpdateState: (updates: Partial<GameState>) => void;
  onLogEvent: (text: string, type: 'positive' | 'warning' | 'negative' | 'neutral') => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  state,
  onUpdateRival,
  onUpdateState,
  onLogEvent
}) => {
  const [selectedRival, setSelectedRival] = useState<RivalNation | null>(null);

  // Sovereign player coordinate on map
  const playerCoords = { x: 420, y: 220 };

  const handleDiplomaticAction = (action: 'trade_pact' | 'improve_relations' | 'demand_tribute' | 'declare_war' | 'sign_peace' | 'fund_rebels') => {
    if (!selectedRival) return;
    const r = selectedRival;

    switch (action) {
      case 'trade_pact': {
        if (r.tradePact) {
          onUpdateRival(r.id, { tradePact: false, relations: r.relations - 10 });
          onLogEvent(`Terminated Free Trade Agreement with ${r.name}.`, 'warning');
          sound.playClick();
        } else {
          if (r.relations < -20) {
            onLogEvent(`${r.name} rejects trade talks due to hostile relations!`, 'negative');
            sound.playCrisis();
            return;
          }
          onUpdateRival(r.id, { tradePact: true, relations: Math.min(100, r.relations + 15) });
          onUpdateState({
            macro: {
              ...state.macro,
              gdpGrowthRate: state.macro.gdpGrowthRate + 0.15
            }
          });
          onLogEvent(`Signed bilateral Free Trade Agreement with ${r.name}. Trade routes activated.`, 'positive');
          sound.playCoins();
        }
        break;
      }

      case 'improve_relations': {
        if (state.macro.treasury < 10) {
          onLogEvent('Insufficient funds for state diplomatic mission (Requires $10B).', 'negative');
          sound.playCrisis();
          return;
        }
        onUpdateState({
          macro: { ...state.macro, treasury: state.macro.treasury - 10 }
        });
        const newRel = Math.min(100, r.relations + 20);
        onUpdateRival(r.id, { relations: newRel });
        onLogEvent(`Dispatched high-level diplomatic delegation with gifts to ${r.name}. Relations improved to ${newRel}.`, 'positive');
        sound.playTriumph();
        break;
      }

      case 'demand_tribute': {
        if (r.relations < 0 && r.militaryStrength > state.military.infantryDivisions) {
          onLogEvent(`${r.name} ridiculed your tribute demand and placed their armed forces on high alert!`, 'negative');
          onUpdateRival(r.id, { relations: Math.max(-100, r.relations - 25) });
          sound.playCrisis();
          return;
        }
        const tributeAmount = Math.round(r.gdp * 0.005);
        onUpdateState({
          macro: { ...state.macro, treasury: state.macro.treasury + tributeAmount }
        });
        onUpdateRival(r.id, { relations: Math.max(-100, r.relations - 20) });
        onLogEvent(`Extracted ${state.currencySymbol}${tributeAmount}B in diplomatic concessions from ${r.name}.`, 'positive');
        sound.playCoins();
        break;
      }

      case 'declare_war': {
        sound.playWarDrum();
        onUpdateRival(r.id, { atWar: true, relations: -100, tradePact: false });
        onUpdateState({
          military: {
            ...state.military,
            readinessDefcon: 2
          },
          stability: Math.max(10, state.stability - 8),
          unrest: Math.min(100, state.unrest + 12)
        });
        onLogEvent(`WAR DECLARED: Sovereign forces initiated invasion operations against ${r.name}!`, 'negative');
        break;
      }

      case 'sign_peace': {
        if (state.macro.treasury < 25) {
          onLogEvent('Requires $25B in war reparations to broker peace treaty.', 'negative');
          return;
        }
        onUpdateState({
          macro: { ...state.macro, treasury: state.macro.treasury - 25 },
          military: { ...state.military, readinessDefcon: 4 }
        });
        onUpdateRival(r.id, { atWar: false, relations: 0 });
        onLogEvent(`Ceasefire and Armistice treaty signed with ${r.name}. Active hostilities concluded.`, 'positive');
        sound.playTriumph();
        break;
      }

      case 'fund_rebels': {
        if (state.macro.treasury < 15) {
          onLogEvent('Requires $15B in covert black budget funds.', 'negative');
          return;
        }
        onUpdateState({
          macro: { ...state.macro, treasury: state.macro.treasury - 15 }
        });
        onUpdateRival(r.id, {
          powerScore: Math.max(20, r.powerScore - 8),
          militaryStrength: Math.max(20, r.militaryStrength - 6)
        });
        onLogEvent(`Covertly armed opposition partisans inside ${r.name}. Enemy power degraded.`, 'positive');
        sound.playStamp();
        break;
      }
    }

    // Refresh selected modal
    const updated = state.rivals.find(rv => rv.id === r.id);
    if (updated) setSelectedRival(updated);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 overflow-hidden select-none">
      
      {/* Geopolitical Stage Banner */}
      <div className="flex items-center justify-between px-6 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Globe2 className="w-4 h-4 text-amber-400" />
          <span className="font-['Cinzel'] font-bold text-white tracking-wider">
            GLOBAL THEATER OF STATECRAFT
          </span>
          <span className="text-slate-500">· Interactive Geopolitical Map</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-amber-400 block" />
            <span>Active Trade Pact</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-rose-500 block" />
            <span>Armed Conflict</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div className="relative flex-1 bg-[#090d16] flex items-center justify-center overflow-hidden">
        
        {/* SVG World Map Vector Backdrop */}
        <svg
          viewBox="0 0 1000 520"
          className="w-full h-full max-h-[720px] select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id="oceanGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#050811" stopOpacity="1" />
            </radialGradient>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Ocean Background & Grid */}
          <rect width="1000" height="520" fill="url(#oceanGlow)" />
          <rect width="1000" height="520" fill="url(#grid)" />

          {/* Stylized Continental Landmass Outlines */}
          <g fill="#131c2e" stroke="#1e293b" strokeWidth="1.2" opacity="0.85">
            {/* North America */}
            <path d="M 120 80 Q 240 60 300 120 Q 320 200 240 240 Q 180 230 140 180 Z" />
            {/* South America */}
            <path d="M 230 260 Q 310 270 330 360 Q 290 460 250 480 Q 210 380 220 290 Z" />
            {/* Europe */}
            <path d="M 420 80 Q 520 70 560 140 Q 510 180 430 160 Q 400 120 420 80 Z" />
            {/* Africa */}
            <path d="M 430 190 Q 560 180 570 290 Q 530 420 480 440 Q 420 320 430 190 Z" />
            {/* Asia */}
            <path d="M 570 70 Q 820 60 880 180 Q 820 280 680 260 Q 580 200 570 70 Z" />
            {/* Oceania */}
            <path d="M 760 330 Q 870 330 860 420 Q 770 440 740 370 Z" />
          </g>

          {/* Lines connecting player to rivals */}
          {state.rivals.map((rival) => {
            const isTrade = rival.tradePact;
            const isWar = rival.atWar;
            let strokeColor = "rgba(100, 116, 139, 0.25)";
            let strokeDash = "4 4";
            let strokeWidth = 1;

            if (isWar) {
              strokeColor = "#ef4444";
              strokeDash = "none";
              strokeWidth = 2.5;
            } else if (isTrade) {
              strokeColor = "#f59e0b";
              strokeDash = "6 4";
              strokeWidth = 1.8;
            }

            return (
              <line
                key={`line-${rival.id}`}
                x1={playerCoords.x}
                y1={playerCoords.y}
                x2={rival.coordinates.x}
                y2={rival.coordinates.y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDash}
                className={isWar ? 'animate-pulse' : ''}
              />
            );
          })}

          {/* Player Sovereign Territory Node */}
          <g
            transform={`translate(${playerCoords.x}, ${playerCoords.y})`}
            className="cursor-pointer"
          >
            <circle r="22" fill={state.flagPrimaryColor} opacity="0.3" className="animate-ping" />
            <circle r="14" fill={state.flagPrimaryColor} stroke="#fbbf24" strokeWidth="2.5" />
            <text
              y="-22"
              textAnchor="middle"
              className="font-['Cinzel'] font-bold text-[12px] fill-amber-300 drop-shadow"
            >
              {state.countryName} (SOVEREIGN)
            </text>
            <text
              y="28"
              textAnchor="middle"
              className="font-mono text-[10px] fill-slate-300 drop-shadow"
            >
              Capital: {state.capitalCity}
            </text>
          </g>

          {/* Rival Sovereign Nation Nodes */}
          {state.rivals.map((rival) => {
            const isSelected = selectedRival?.id === rival.id;
            return (
              <g
                key={rival.id}
                transform={`translate(${rival.coordinates.x}, ${rival.coordinates.y})`}
                onClick={() => {
                  sound.playClick();
                  setSelectedRival(rival);
                }}
                className="cursor-pointer group"
              >
                {rival.atWar && (
                  <circle r="20" fill="#dc2626" opacity="0.4" className="animate-ping" />
                )}
                <circle
                  r={isSelected ? 14 : 11}
                  fill={rival.flagColor}
                  stroke={isSelected ? '#f59e0b' : rival.atWar ? '#ef4444' : '#475569'}
                  strokeWidth={isSelected ? 3 : 1.5}
                  className="transition-all duration-200 group-hover:scale-125"
                />
                
                {/* Nation Name Label */}
                <text
                  y="-18"
                  textAnchor="middle"
                  className={`font-semibold text-[11px] drop-shadow ${
                    rival.atWar ? 'fill-rose-400 font-bold' : isSelected ? 'fill-amber-300' : 'fill-slate-200'
                  }`}
                >
                  {rival.name}
                </text>

                {/* Subtext info */}
                <text
                  y="22"
                  textAnchor="middle"
                  className="font-mono text-[9px] fill-slate-400"
                >
                  {rival.atWar ? 'AT WAR' : rival.tradePact ? 'TRADE PACT' : `Rel: ${rival.relations}`}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Rival Diplomatic Dossier Drawer */}
        {selectedRival && (
          <div className="absolute right-6 top-6 bottom-6 w-80 sm:w-96 bg-slate-900/95 border border-slate-800 rounded-xl shadow-2xl backdrop-blur-md p-5 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200 text-xs">
            
            {/* Drawer Header */}
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center font-bold text-white shadow"
                    style={{ backgroundColor: selectedRival.flagColor }}
                  >
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm font-['Cinzel'] text-white">
                      {selectedRival.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 block font-mono">
                      {selectedRival.government}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRival(null)}
                  className="p-1 text-slate-400 hover:text-white rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Leader & Metrics */}
              <div className="space-y-3 pt-3 font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Head of State</span>
                  <span className="text-slate-200 font-semibold">{selectedRival.leader}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-slate-400 block">GDP:</span>
                    <span className="text-emerald-400 font-bold tabular-nums">
                      ${selectedRival.gdp.toLocaleString()}B
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Military Power:</span>
                    <span className="text-slate-200 font-bold tabular-nums">
                      {selectedRival.militaryStrength} / 100
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Diplomatic Relations:</span>
                    <span className={`font-bold tabular-nums ${
                      selectedRival.relations >= 30 ? 'text-emerald-400' :
                      selectedRival.relations >= 0 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {selectedRival.relations > 0 ? `+${selectedRival.relations}` : selectedRival.relations}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Status:</span>
                    <span className={`font-bold ${selectedRival.atWar ? 'text-rose-400' : selectedRival.tradePact ? 'text-amber-400' : 'text-slate-300'}`}>
                      {selectedRival.atWar ? 'Hostile War' : selectedRival.tradePact ? 'Trade Partner' : 'Neutral State'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Diplomatic Levers */}
              <div className="space-y-2 pt-4">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 block">
                  Statecraft Actions
                </span>

                <button
                  onClick={() => handleDiplomaticAction('trade_pact')}
                  className={`w-full py-2 px-3 rounded-lg border flex items-center justify-between transition-colors ${
                    selectedRival.tradePact
                      ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-1.5 font-medium">
                    <Handshake className="w-3.5 h-3.5 text-amber-400" />
                    <span>{selectedRival.tradePact ? 'Dissolve Free Trade Agreement' : 'Sign Free Trade Pact'}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">+0.15% GDP</span>
                </button>

                <button
                  onClick={() => handleDiplomaticAction('improve_relations')}
                  className="w-full py-2 px-3 rounded-lg border border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-200 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-1.5 font-medium">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Dispatch Diplomatic Envoy</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Cost: $10B</span>
                </button>

                <button
                  onClick={() => handleDiplomaticAction('demand_tribute')}
                  className="w-full py-2 px-3 rounded-lg border border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-200 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-1.5 font-medium">
                    <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                    <span>Demand Sovereign Tribute</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">-20 Rel</span>
                </button>

                <button
                  onClick={() => handleDiplomaticAction('fund_rebels')}
                  className="w-full py-2 px-3 rounded-lg border border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-200 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-1.5 font-medium">
                    <Crosshair className="w-3.5 h-3.5 text-sky-400" />
                    <span>Fund Insurgent Proxy Rebels</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Cost: $15B</span>
                </button>
              </div>
            </div>

            {/* War / Peace Section */}
            <div className="pt-4 border-t border-slate-800">
              {selectedRival.atWar ? (
                <button
                  onClick={() => handleDiplomaticAction('sign_peace')}
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow"
                >
                  <Handshake className="w-4 h-4" />
                  <span>Broker Armistice Peace Treaty ($25B)</span>
                </button>
              ) : (
                <button
                  onClick={() => handleDiplomaticAction('declare_war')}
                  className="w-full py-2.5 rounded-lg bg-rose-700 hover:bg-rose-600 font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow"
                >
                  <Swords className="w-4 h-4" />
                  <span>Declare Sovereign War</span>
                </button>
              )}
            </div>

          </div>
        )}

      </div>

      {/* Bottom Dispatch / Recent History Ribbon */}
      <div className="px-6 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center gap-3 overflow-x-auto text-[11px] font-mono text-slate-400 shrink-0">
        <span className="text-amber-400 font-bold uppercase shrink-0">Imperial Dispatch:</span>
        <div className="truncate">
          {state.historyLog[0]?.text || 'All frontiers reporting calm. Treasury and military commands in operational readiness.'}
        </div>
      </div>
    </div>
  );
};
