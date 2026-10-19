import React from 'react';
import { GameState, CovertOperation, FactionLoyalty } from '../types/game';
import { sound } from '../utils/sound';
import { Eye, Skull, Flame, FileText, Lock, DollarSign, ShieldAlert, CheckCircle2, UserCheck } from 'lucide-react';

interface IntelligencePanelProps {
  state: GameState;
  onLaunchCovertOp: (opId: string) => void;
  onDepositSlushFund: (amount: number) => void;
  onBribeFaction: (factionKey: keyof FactionLoyalty, amount: number) => void;
  onFundMafiaCartel: () => void;
  onCrackdownMafia: () => void;
}

export const IntelligencePanel: React.FC<IntelligencePanelProps> = ({
  state,
  onLaunchCovertOp,
  onDepositSlushFund,
  onBribeFaction,
  onFundMafiaCartel,
  onCrackdownMafia
}) => {
  const { covertOps, ruler, factions, macro } = state;

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-950 p-6 space-y-6 text-slate-100 select-none">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-purple-400 font-semibold font-mono">
            <Eye className="w-4 h-4" />
            <span>Bundesnachrichtendienst & Geheime Staatsoperationen</span>
          </div>
          <h2 className="text-2xl font-bold font-['Cinzel'] text-white mt-1">
            Schattenpolitik, Geheimoperationen & Dynastisches Fluchtkapital
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Leiten Sie Spionagezellen, sabotieren Sie feindliche Infrastruktur, orchestrieren Sie Staatsstreiche und sichern Sie private Notfall-Rücklagen.
          </p>
        </div>

        {/* Ruler Private Slush Fund Box */}
        <div className="bg-slate-950/90 border border-amber-500/40 rounded-xl p-4 font-mono text-xs shadow-lg shadow-amber-500/5">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-[10px]">
            <Lock className="w-3.5 h-3.5" />
            <span>Privates Schweizer Dynastie-Sonderkonto</span>
          </div>
          <div className="text-xl font-bold text-amber-300 mt-1 tabular-nums">
            {state.currencySymbol}{ruler.slushFund.toFixed(1)} Mrd.
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Diskrete Vermögensreserve, geschützt vor Staatsbankrott oder Regimeabsturz
          </div>
          <div className="flex items-center gap-2 mt-2 font-sans">
            <button
              onClick={() => onDepositSlushFund(5)}
              className="px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-semibold transition-colors cursor-pointer"
            >
              +5 Mrd. {state.currencySymbol} aus Staatskasse abzweigen
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Covert Operations Registry (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Skull className="w-4 h-4 text-rose-500" />
                <span>Laufende Geheimdienst-Direktiven & Spionage</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Entsenden Sie Agenten über die Grenzen feindlicher Mächte zur Destabilisierung und Aufklärung.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {covertOps.map((op) => {
              const targetRival = state.rivals.find(r => r.id === op.targetRivalId)?.name || 'Feindliche Großmacht';
              return (
                <div key={op.id} className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-100 flex items-center gap-2">
                        {op.type === 'espionage' && <Eye className="w-4 h-4 text-sky-400" />}
                        {op.type === 'sabotage' && <Flame className="w-4 h-4 text-rose-400" />}
                        {op.type === 'assassination' && <Skull className="w-4 h-4 text-red-600" />}
                        {op.type === 'leak_scandal' && <FileText className="w-4 h-4 text-amber-400" />}
                        <span>{op.name}</span>
                      </h4>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Ziel: {targetRival} · Typus: {op.type === 'espionage' ? 'SPIONAGE' : op.type === 'sabotage' ? 'SABOTAGE' : 'VERDECKT'}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      op.active ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {op.active ? `IN DURCHFÜHRUNG (${op.progress}%)` : 'BEREIT'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {op.active && (
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 transition-all duration-300"
                        style={{ width: `${op.progress}%` }}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 font-mono text-[11px] bg-slate-900/60 p-2 rounded">
                    <div>
                      <span className="text-slate-400 block">Einsatzbudget:</span>
                      <span className="text-slate-200 font-bold">{state.currencySymbol}{op.cost} Mrd.</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Erfolgschance:</span>
                      <span className="text-emerald-400 font-bold">{op.successChance}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Entdeckungsrisiko:</span>
                      <span className="text-rose-400 font-bold">{op.risk}%</span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    {op.active ? (
                      <span className="text-slate-500 text-[11px] font-mono italic">
                        Feldagenten operieren tief im feindlichen Hinterland...
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          sound.playStamp();
                          onLaunchCovertOp(op.id);
                        }}
                        className="px-4 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 font-bold text-white text-xs uppercase tracking-wider transition-colors shadow cursor-pointer"
                      >
                        Geheimoperation autorisieren ({op.cost} Mrd. {state.currencySymbol})
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Patronage Bribes & Shadow Syndicates (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Faction Patronage & Bribes */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Patronage, Zuwendungen & Loyalitätsboni</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Verteilen Sie staatliche Fördermittel, um Schlüsselakteure im Machtgefüge loyal zu binden.
              </p>
            </div>

            <div className="space-y-2 font-mono">
              {[
                { name: 'Militärgeneräle & Generalstab', key: 'military' as keyof FactionLoyalty, val: factions.military },
                { name: 'Industriebarone & Oligarchen', key: 'oligarchs' as keyof FactionLoyalty, val: factions.oligarchs },
                { name: 'Hohe Geistlichkeit / Bischöfe', key: 'clergy' as keyof FactionLoyalty, val: factions.clergy },
                { name: 'Zivile Staatsbeamte & Justiz', key: 'bureaucracy' as keyof FactionLoyalty, val: factions.bureaucracy },
                { name: 'Subventionen für Arbeiter', key: 'commonWorkers' as keyof FactionLoyalty, val: factions.commonWorkers }
              ].map((f) => (
                <div key={f.key} className="flex items-center justify-between bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <div>
                    <span className="font-semibold text-slate-200 block font-sans">{f.name}</span>
                    <span className="text-[10px] text-slate-400">Aktuelle Loyalität: {f.val}%</span>
                  </div>
                  <button
                    onClick={() => onBribeFaction(f.key, 10)}
                    className="px-3 py-1 rounded border border-slate-700 bg-slate-900 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-300 font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    +12% Loyalität (10 Mrd. {state.currencySymbol})
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Underworld Mafias & Shadow Syndicates */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>Untergrund-Syndikate & Schattenwirtschaft</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Nutzen Sie verdeckte Schmuggelkartelle zur Geldbeschaffung oder befehlen Sie eine Razzia.
              </p>
            </div>

            <div className="space-y-2 font-sans">
              <button
                onClick={onFundMafiaCartel}
                className="w-full py-2 px-3 rounded-lg border border-slate-800 bg-slate-950 hover:border-amber-500/50 hover:bg-amber-500/10 text-left transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold text-amber-300">Schmuggelsyndikat instrumentalisieren</div>
                  <div className="text-[10px] text-slate-400 font-mono">+25 Mrd. Schwarzgeld · +8% Zivile Unruhe</div>
                </div>
                <DollarSign className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={onCrackdownMafia}
                className="w-full py-2 px-3 rounded-lg border border-slate-800 bg-slate-950 hover:border-sky-500/50 hover:bg-sky-500/10 text-left transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold text-sky-300">Landesweite Anti-Kartell-Großrazzia</div>
                  <div className="text-[10px] text-slate-400 font-mono">Kosten: 12 Mrd. {state.currencySymbol} · -12% Unruhe · +6 Beliebtheit</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
