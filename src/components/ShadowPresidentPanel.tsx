import React, { useState } from 'react';
import { GameState, Underboss, IllicitRacket } from '../types/game';
import { sound } from '../utils/sound';
import {
  Skull,
  EyeOff,
  AlertTriangle,
  Briefcase,
  DollarSign,
  ShieldAlert,
  Building,
  CheckCircle2,
  Trash2,
  Sparkles,
  Zap,
  Lock
} from 'lucide-react';

interface ShadowPresidentPanelProps {
  state: GameState;
  onUpdateState: (updater: (prev: GameState) => GameState) => void;
  onLogEvent: (text: string, type: 'positive' | 'warning' | 'negative' | 'neutral') => void;
}

export const ShadowPresidentPanel: React.FC<ShadowPresidentPanelProps> = ({
  state,
  onUpdateState,
  onLogEvent
}) => {
  const [bribeTarget, setBribeTarget] = useState<string>('Generalstaatsanwalt');

  const glassCard = state.themeMode === 'light'
    ? 'bg-white/80 border-slate-200 text-slate-800 shadow-sm'
    : 'bg-slate-900/60 border-purple-900/40 text-slate-100 shadow-md backdrop-blur-md';

  const innerCard = state.themeMode === 'light'
    ? 'bg-slate-50 border-slate-200'
    : 'bg-slate-950/60 border-purple-900/30';

  const syndicate = state.shadowSyndicate;

  // Toggle Racket active status
  const handleToggleRacket = (racketId: string) => {
    sound.playClick();
    onUpdateState(prev => ({
      ...prev,
      shadowSyndicate: {
        ...prev.shadowSyndicate,
        rackets: prev.shadowSyndicate.rackets.map(r => r.id === racketId ? { ...r, active: !r.active } : r)
      }
    }));
  };

  // Award corrupt public contract to shell company
  const handleAwardCorruptContract = () => {
    if (state.macro.treasury < 5.0) {
      alert('Unzureichende Staatskasse für die Ausschreibung dieses Großauftrags.');
      return;
    }
    sound.playCoin();
    const kickbackMrd = 1.25;

    onUpdateState(prev => ({
      ...prev,
      macro: {
        ...prev.macro,
        treasury: Number((prev.macro.treasury - 5.0).toFixed(2))
      },
      ruler: {
        ...prev.ruler,
        secretSlushFund: Number(((prev.ruler.secretSlushFund || 0) + kickbackMrd).toFixed(2)),
        reputation: Math.max(10, prev.ruler.reputation - 4)
      },
      shadowSyndicate: {
        ...prev.shadowSyndicate,
        publicContractsAwarded: prev.shadowSyndicate.publicContractsAwarded + 1,
        suspicionLevel: Math.min(100, prev.shadowSyndicate.suspicionLevel + 8),
        investigationPressure: Math.min(100, prev.shadowSyndicate.investigationPressure + 5)
      },
      stability: Math.max(10, prev.stability - 3)
    }));

    onLogEvent(
      `KORRUPTIONS-AUFTRAG: Öffentlicher Infrastrukturauftrag an Briefkastenfirma vergeben. ${state.currencySymbol}${kickbackMrd} Mrd. Schmiergeld auf das geheime Schattenkonto gebucht!`,
      'warning'
    );
  };

  // Bribe authorities to lower investigation pressure
  const handleBribe = () => {
    const costMrd = 0.5;
    if ((state.ruler.secretSlushFund || 0) < costMrd) {
      alert('Nicht genügend verdecktes Kapital auf dem Schattenkonto für dieses Schmiergeld.');
      return;
    }
    sound.playCoin();
    onUpdateState(prev => ({
      ...prev,
      ruler: {
        ...prev.ruler,
        secretSlushFund: Number(((prev.ruler.secretSlushFund || 0) - costMrd).toFixed(2))
      },
      shadowSyndicate: {
        ...prev.shadowSyndicate,
        investigationPressure: Math.max(0, prev.shadowSyndicate.investigationPressure - 18),
        suspicionLevel: Math.max(0, prev.shadowSyndicate.suspicionLevel - 10)
      }
    }));

    onLogEvent(`VERDECKTE BESTECHUNG: ${bribeTarget} mit ${state.currencySymbol}${costMrd} Mrd. geschmiert. Ermittlungsakten vernichtet.`, 'positive');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className={`p-6 rounded-2xl border ${glassCard}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-widest font-mono">
              <Skull className="w-4 h-4" />
              <span>Schatten-Präsidentschaft & Unterwelt-Kartell</span>
            </div>
            <h2 className="text-2xl font-black font-['Cinzel'] tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-amber-300">
              {syndicate.syndicateName}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Verwalten Sie geheime Scheinfirmen, Unterbosse, Schmuggelrouten und Geldwäschenetzwerke. Vergeben Sie manipulierte Staatsaufträge für persönliche Schmiergelder und halten Sie die Bundespolizei in Schach.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className={`p-3 rounded-xl border ${innerCard} text-center`}>
              <span className="text-[10px] text-slate-400 block uppercase">Verdachtsniveau</span>
              <span className={`font-bold ${syndicate.suspicionLevel > 50 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`}>
                {syndicate.suspicionLevel}%
              </span>
            </div>
            <div className={`p-3 rounded-xl border ${innerCard} text-center`}>
              <span className="text-[10px] text-slate-400 block uppercase">Ermittlungsdruck</span>
              <span className={`font-bold ${syndicate.investigationPressure > 60 ? 'text-rose-500 font-black' : 'text-purple-400'}`}>
                {syndicate.investigationPressure}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Accounts Contrast: Official State Account vs Secret Shadow Account */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-2xl border ${glassCard}`}>
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-400" />
            <span>Offizielles Staatskonto (Transparenter Haushalt)</span>
          </div>
          <div className="text-3xl font-black font-mono text-emerald-400 my-2">
            {state.currencySymbol}{state.macro.treasury.toFixed(2)} Mrd.
          </div>
          <p className="text-xs text-slate-400">
            Öffentlich einsehbare Mittel für Ministerien, Infrastruktur, Polizei, Gesundheit und Schuldendienst.
          </p>
        </div>

        <div className={`p-6 rounded-2xl border border-purple-500/40 bg-purple-950/20 backdrop-blur-md`}>
          <div className="text-xs font-mono uppercase tracking-wider text-purple-400 mb-1 flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-purple-400" />
            <span>Geheimes Schattenkonto (Panama & Caymans)</span>
          </div>
          <div className="text-3xl font-black font-mono text-purple-300 my-2">
            {state.currencySymbol}{(state.ruler.secretSlushFund || 0).toFixed(2)} Mrd.
          </div>
          <p className="text-xs text-purple-300/80">
            Geheime Kassen für Schmiergelder, Attentate, politische Erpressung und Schmierkonten.
          </p>
        </div>
      </div>

      {/* Underbosses & Gang Territories */}
      <div className={`p-6 rounded-2xl border ${glassCard}`}>
        <h3 className="text-base font-bold text-slate-100 mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-purple-400" />
          <span>Unterbosse des Syndikats</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {syndicate.underbosses.map((boss) => (
            <div key={boss.id} className={`p-4 rounded-xl border ${innerCard}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-200">{boss.name}</div>
                  <div className="text-xs text-purple-400 font-semibold">„{boss.alias}“</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                  {boss.cutPercent}% Beteiligung
                </span>
              </div>

              <div className="mt-3 text-xs text-slate-400">
                Spezialisierung: <strong className="text-slate-200">{boss.specialization}</strong>
              </div>
              <div className="mt-1 text-xs text-slate-400">
                Loyalität: <strong className="text-sky-400">{boss.loyalty}%</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rackets & Operations */}
      <div className={`p-6 rounded-2xl border ${glassCard}`}>
        <h3 className="text-base font-bold text-slate-100 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-amber-400" />
          <span>Geschäftszweige, Schmuggel & Schutzgelder</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {syndicate.rackets.map((racket) => (
            <div key={racket.id} className={`p-4 rounded-xl border ${innerCard} space-y-2`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-200">{racket.name}</div>
                  <div className="text-[11px] text-slate-400">{racket.territory}</div>
                </div>
                <button
                  onClick={() => handleToggleRacket(racket.id)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    racket.active
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {racket.active ? 'Aktiv' : 'Pausiert'}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs font-mono pt-2">
                <span className="text-slate-400">Quartalsertrag:</span>
                <span className="text-emerald-400 font-bold">+{racket.incomeQuarterlyMio} Mio.</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Entdeckungsrisiko:</span>
                <span className="text-rose-400 font-bold">{racket.riskPercent}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Corrupt Public Contracts & Bribery Terminal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Award Public Contract for Personal Kickback */}
        <div className={`p-6 rounded-2xl border ${glassCard} flex flex-col justify-between`}>
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Manipulierte Staatsaufträge vergeben</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Schreiben Sie einen staatlichen Großauftrag über 5 Mrd. aus und manipulieren Sie die Ausschreibung zugunsten einer Ihrer Scheinfirmen. Sie erhalten 1.25 Mrd. direkt auf Ihr Schattenkonto, steigern aber den Korruptionsverdacht.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Bisher vergeben: <strong className="text-amber-400">{syndicate.publicContractsAwarded} Aufträge</strong></span>
            <button
              onClick={handleAwardCorruptContract}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all cursor-pointer"
            >
              Auftrag zuschustern (+1.25 Mrd. Kickback)
            </button>
          </div>
        </div>

        {/* Bribe Officials to Suppress Investigation */}
        <div className={`p-6 rounded-2xl border ${glassCard} flex flex-col justify-between`}>
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Schmiergeld & Ermittlungen unterdrücken</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Zahlen Sie gezielte Schmiergelder aus dem Schattenkonto an Justizbeamte, Richter oder Chefredakteure, um den Ermittlungsdruck und Verdacht drastisch zu senken.
            </p>

            <div className="mb-4">
              <label className="text-[10px] text-slate-400 block mb-1">Zielperson</label>
              <select
                value={bribeTarget}
                onChange={(e) => setBribeTarget(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs text-white focus:outline-none"
              >
                <option value="Generalstaatsanwalt">Generalstaatsanwalt (-Ermittlungsdruck)</option>
                <option value="Chefredakteur Leitmedien">Chefredakteur Leitmedien (-Skandalrisiko)</option>
                <option value="Bundesrechnungshof-Prüfer">Bundesrechnungshof-Prüfer (-Verdacht)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Kosten: <strong className="text-purple-400">{state.currencySymbol}0.50 Mrd.</strong></span>
            <button
              onClick={handleBribe}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all cursor-pointer"
            >
              Schmiergeld zahlen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
