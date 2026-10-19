import React from 'react';
import { GameState } from '../types/game';
import { sound } from '../utils/sound';
import { Terminal, X, DollarSign, TrendingUp, ShieldAlert, Award, Sparkles, AlertOctagon, HeartHandshake, Zap } from 'lucide-react';

interface CheatAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: GameState;
  onUpdateState: (updater: (prev: GameState) => GameState) => void;
}

export const CheatAdminModal: React.FC<CheatAdminModalProps> = ({
  isOpen,
  onClose,
  state,
  onUpdateState
}) => {
  if (!isOpen) return null;

  const glassBg = state.themeMode === 'light'
    ? 'bg-white/90 backdrop-blur-xl border-slate-300 text-slate-900 shadow-2xl'
    : 'bg-slate-950/90 backdrop-blur-xl border-amber-500/30 text-slate-100 shadow-2xl shadow-amber-500/10';

  const cardBg = state.themeMode === 'light'
    ? 'bg-slate-100/90 border-slate-200'
    : 'bg-slate-900/60 border-slate-800';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border p-6 ${glassBg}`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black font-['Cinzel'] tracking-wide text-amber-400 flex items-center gap-2">
                ADMIN- & CHEAT-KONSOLE <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">SOVEREIGN ROOT ACCESS</span>
              </h2>
              <p className="text-xs text-slate-400">
                Direkte Manipulation sämtlicher Staatsfinanzen, Privatvermögen, Wirtschaftskennzahlen, Ministerien, Militär- und Geheimdienstwerte.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cheat Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          
          {/* 1. Staatsfinanzen */}
          <div className={`p-4 rounded-xl border ${cardBg}`}>
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 mb-3">
              <DollarSign className="w-4 h-4" />
              <span>Staatsfinanzen & Haushalt</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                onClick={() => {
                  sound.playCoin();
                  onUpdateState(prev => ({
                    ...prev,
                    macro: { ...prev.macro, treasury: prev.macro.treasury + 100 }
                  }));
                }}
                className="p-2 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-all text-left"
              >
                +100 Mrd. Staatskasse
              </button>
              <button
                onClick={() => {
                  sound.playCoin();
                  onUpdateState(prev => ({
                    ...prev,
                    macro: { ...prev.macro, treasury: prev.macro.treasury + 1000 }
                  }));
                }}
                className="p-2 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-all text-left"
              >
                +1 Billion Staatskasse
              </button>
              <button
                onClick={() => {
                  sound.playStamp();
                  onUpdateState(prev => ({
                    ...prev,
                    macro: { ...prev.macro, nationalDebt: 0, creditRating: 'AAA' }
                  }));
                }}
                className="p-2 rounded bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 transition-all text-left"
              >
                Schulden komplett tilgen (0)
              </button>
              <button
                onClick={() => {
                  sound.playStamp();
                  onUpdateState(prev => ({
                    ...prev,
                    macro: { ...prev.macro, nationalDebt: prev.macro.nationalDebt + 500 }
                  }));
                }}
                className="p-2 rounded bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 transition-all text-left"
              >
                +500 Mrd. Schulden
              </button>
            </div>
          </div>

          {/* 2. Präsidenten-Privatvermögen */}
          <div className={`p-4 rounded-xl border ${cardBg}`}>
            <div className="flex items-center gap-2 text-sm font-bold text-amber-400 mb-3">
              <Award className="w-4 h-4" />
              <span>Privatvermögen des Präsidenten</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                onClick={() => {
                  sound.playCoin();
                  onUpdateState(prev => ({
                    ...prev,
                    ruler: { ...prev.ruler, slushFund: prev.ruler.slushFund + 10 }
                  }));
                }}
                className="p-2 rounded bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 transition-all text-left"
              >
                +10 Mrd. Offizielles Privatkonto
              </button>
              <button
                onClick={() => {
                  sound.playCoin();
                  onUpdateState(prev => ({
                    ...prev,
                    ruler: { ...prev.ruler, secretSlushFund: (prev.ruler.secretSlushFund || 0) + 25 }
                  }));
                }}
                className="p-2 rounded bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 transition-all text-left"
              >
                +25 Mrd. Geheimes Schattenkonto
              </button>
              <button
                onClick={() => {
                  sound.playStamp();
                  onUpdateState(prev => ({
                    ...prev,
                    ruler: { ...prev.ruler, reputation: 100, politicalPower: 100, legitimacy: 100 }
                  }));
                }}
                className="p-2 rounded bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 transition-all text-left"
              >
                100% Reputation & Macht
              </button>
              <button
                onClick={() => {
                  sound.playStamp();
                  onUpdateState(prev => ({
                    ...prev,
                    shadowSyndicate: {
                      ...prev.shadowSyndicate,
                      investigationPressure: 0,
                      suspicionLevel: 0
                    }
                  }));
                }}
                className="p-2 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-all text-left"
              >
                Ermittlungsdruck auf 0%
              </button>
            </div>
          </div>

          {/* 3. Volk, Politik & Stabilität */}
          <div className={`p-4 rounded-xl border ${cardBg}`}>
            <div className="flex items-center gap-2 text-sm font-bold text-sky-400 mb-3">
              <HeartHandshake className="w-4 h-4" />
              <span>Volk, Politik & Stabilität</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                onClick={() => {
                  sound.playStamp();
                  onUpdateState(prev => ({
                    ...prev,
                    stability: 100,
                    unrest: 0,
                    ruler: { ...prev.ruler, popularity: 99 }
                  }));
                }}
                className="p-2 rounded bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 transition-all text-left"
              >
                100% Stabilität & 0% Unruhe
              </button>
              <button
                onClick={() => {
                  sound.playStamp();
                  onUpdateState(prev => ({
                    ...prev,
                    factions: {
                      military: 100,
                      oligarchs: 100,
                      commonWorkers: 100,
                      clergy: 100,
                      bureaucracy: 100
                    }
                  }));
                }}
                className="p-2 rounded bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 transition-all text-left"
              >
                Alle Fraktionen 100% Loyal
              </button>
              <button
                onClick={() => {
                  sound.playStamp();
                  onUpdateState(prev => ({
                    ...prev,
                    unrest: 85,
                    stability: 20
                  }));
                }}
                className="p-2 rounded bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 transition-all text-left"
              >
                Chaos-Trigger: 85% Unruhe
              </button>
              <button
                onClick={() => {
                  sound.playStamp();
                  onUpdateState(prev => ({
                    ...prev,
                    population: { ...prev.population, total: Number((prev.population.total * 1.1).toFixed(1)) }
                  }));
                }}
                className="p-2 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-all text-left"
              >
                +10% Bevölkerung
              </button>
            </div>
          </div>

          {/* 4. Konjunktur & Wirtschaft */}
          <div className={`p-4 rounded-xl border ${cardBg}`}>
            <div className="flex items-center gap-2 text-sm font-bold text-cyan-400 mb-3">
              <TrendingUp className="w-4 h-4" />
              <span>Konjunktur, Zinsen & Rohstoffe</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                onClick={() => {
                  sound.playStamp();
                  onUpdateState(prev => ({
                    ...prev,
                    macro: {
                      ...prev.macro,
                      gdpGrowthRate: 6.5,
                      inflationRate: 1.8,
                      unemploymentRate: 2.5
                    }
                  }));
                }}
                className="p-2 rounded bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 transition-all text-left"
              >
                Wirtschafts-Boom (+6.5% BIP)
              </button>
              <button
                onClick={() => {
                  sound.playCoin();
                  onUpdateState(prev => {
                    const nextRes = { ...prev.resources };
                    Object.keys(nextRes).forEach(k => {
                      nextRes[k as keyof typeof nextRes] = {
                        ...nextRes[k as keyof typeof nextRes],
                        stockpile: 999999
                      };
                    });
                    return { ...prev, resources: nextRes };
                  });
                }}
                className="p-2 rounded bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 transition-all text-left"
              >
                Alle Rohstofflager maxen (999.999)
              </button>
              <button
                onClick={() => {
                  sound.playStamp();
                  onUpdateState(prev => ({
                    ...prev,
                    macro: { ...prev.macro, gdp: prev.macro.gdp * 1.5 }
                  }));
                }}
                className="p-2 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-all text-left"
              >
                +50% BIP-Sprung
              </button>
              <button
                onClick={() => {
                  sound.playStamp();
                  onUpdateState(prev => ({
                    ...prev,
                    pensionSystem: { ...prev.pensionSystem, actualLevelPercent: 75.0, sustainabilityIndex: 98 }
                  }));
                }}
                className="p-2 rounded bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 transition-all text-left"
              >
                Rentenniveau sofort auf 75%
              </button>
            </div>
          </div>

          {/* 5. Militär, Streitkräfte & Arsenal */}
          <div className={`p-4 rounded-xl border ${cardBg}`}>
            <div className="flex items-center gap-2 text-sm font-bold text-rose-400 mb-3">
              <ShieldAlert className="w-4 h-4" />
              <span>Militär, Rüstung & Streitkräfte</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                onClick={() => {
                  sound.playStamp();
                  onUpdateState(prev => ({
                    ...prev,
                    military: {
                      ...prev.military,
                      nuclearWarheads: prev.military.nuclearWarheads + 500,
                      nuclearSubmarines: (prev.military.nuclearSubmarines || 0) + 10,
                      droneSwarmUnits: (prev.military.droneSwarmUnits || 0) + 200,
                      roboticsLegions: (prev.military.roboticsLegions || 0) + 50
                    }
                  }));
                }}
                className="p-2 rounded bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 transition-all text-left"
              >
                Arsenal aufrüsten (+Nuklear & Drohnen)
              </button>
              <button
                onClick={() => {
                  sound.playStamp();
                  onUpdateState(prev => ({
                    ...prev,
                    military: { ...prev.military, readinessDefcon: 1 }
                  }));
                }}
                className="p-2 rounded bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 transition-all text-left"
              >
                DEFCON 1 (Maximale Kampfbereitschaft)
              </button>
              <button
                onClick={() => {
                  sound.playStamp();
                  onUpdateState(prev => ({
                    ...prev,
                    military: { ...prev.military, readinessDefcon: 5 }
                  }));
                }}
                className="p-2 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-all text-left"
              >
                DEFCON 5 (Friedensbereitschaft)
              </button>
              <button
                onClick={() => {
                  sound.playStamp();
                  onUpdateState(prev => ({
                    ...prev,
                    rivals: prev.rivals.map(r => ({ ...r, relations: 95, atWar: false }))
                  }));
                }}
                className="p-2 rounded bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 transition-all text-left"
              >
                Weltfrieden (Alle Nationen verbündet)
              </button>
            </div>
          </div>

          {/* 6. Kabinett & Ministerien */}
          <div className={`p-4 rounded-xl border ${cardBg}`}>
            <div className="flex items-center gap-2 text-sm font-bold text-indigo-400 mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Kabinett & Ministerien</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                onClick={() => {
                  sound.playStamp();
                  onUpdateState(prev => ({
                    ...prev,
                    cabinet: prev.cabinet.map(m => ({ ...m, loyalty: 100, competence: 100 }))
                  }));
                }}
                className="p-2 rounded bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all text-left"
              >
                Alle Minister 100% Kompetenz & Loyalität
              </button>
              <button
                onClick={() => {
                  sound.playStamp();
                  onUpdateState(prev => ({
                    ...prev,
                    cabinet: prev.cabinet.map(m => ({ ...m, quarterlyBudgetMrd: m.quarterlyBudgetMrd * 2 }))
                  }));
                }}
                className="p-2 rounded bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all text-left"
              >
                Ministerbudgets verdoppeln
              </button>
              <button
                onClick={() => {
                  sound.playStamp();
                  onUpdateState(prev => ({
                    ...prev,
                    cabinet: prev.cabinet.map(m => ({ ...m, projectProgress: 100 }))
                  }));
                }}
                className="p-2 rounded bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all text-left"
              >
                Alle Minister-Projekte sofort fertigstellen
              </button>
              <button
                onClick={() => {
                  sound.playStamp();
                  onUpdateState(prev => ({
                    ...prev,
                    infrastructure: prev.infrastructure.map(inf => ({ ...inf, level: 5 }))
                  }));
                }}
                className="p-2 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-all text-left"
              >
                Infrastruktur Stufe 5 für alle Sektoren
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>Simulation Root-Level: Alle Änderungen werden direkt in die Live-Engine übernommen.</span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
