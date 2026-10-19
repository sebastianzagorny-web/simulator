import React from 'react';
import { GameState, LawPolicy, FactionLoyalty } from '../types/game';
import { sound } from '../utils/sound';
import { Scale, Users, Flame, Megaphone, ShieldAlert, CheckCircle2, AlertOctagon, Vote, Radio } from 'lucide-react';

interface PoliticsPanelProps {
  state: GameState;
  onUpdateLaw: (lawId: string, optionId: string) => void;
  onIssueEmergencyDecree: (decreeId: string) => void;
  onExecutePoliticalAction: (action: 'campaign_rally' | 'gerrymander' | 'bribe_opposition' | 'state_media_blitz') => void;
  onToggleCurfew: () => void;
}

export const PoliticsPanel: React.FC<PoliticsPanelProps> = ({
  state,
  onUpdateLaw,
  onIssueEmergencyDecree,
  onExecutePoliticalAction,
  onToggleCurfew
}) => {
  const { laws, factions, ruler, stability, unrest, fearIndex, nextElectionYear, year } = state;

  const yearsUntilElection = nextElectionYear !== null ? Math.max(0, nextElectionYear - year) : null;

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-950 p-6 space-y-6 text-slate-100 select-none">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400 font-semibold font-mono">
            <Scale className="w-4 h-4" />
            <span>Bundesministerium der Justiz, des Innern & Staatskanzlei</span>
          </div>
          <h2 className="text-2xl font-bold font-['Cinzel'] text-white mt-1">
            Politisches System, Gesetze & Machterhalt
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Erlassen Sie Gesetze, steuern Sie gesellschaftliche Interessengruppen, führen Sie demokratische Wahlkämpfe oder nutzen Sie Notverordnungen.
          </p>
        </div>

        {/* Faction Health / Stability Gauge */}
        <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-2.5 rounded-lg border border-slate-800 font-mono text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Staatsstabilität</span>
            <span className={`text-base font-bold tabular-nums ${stability >= 60 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {stability}%
            </span>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <span className="text-[10px] text-slate-400 uppercase block">Zivile Unruhe</span>
            <span className={`text-base font-bold tabular-nums ${unrest > 35 ? 'text-rose-400' : 'text-slate-200'}`}>
              {unrest}%
            </span>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <span className="text-[10px] text-slate-400 uppercase block">Furcht-Index</span>
            <span className="text-base font-bold text-amber-400 tabular-nums">
              {fearIndex}%
            </span>
          </div>
        </div>
      </div>

      {/* Factions Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-sky-400" />
            <span>Säulen der Macht: Loyalität der Fraktionen</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            Niedrige Loyalität riskiert Meutereien, Generalstreiks oder Militärputsch
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono">
          {[
            { label: 'Streitkräfte / Militär', key: 'military' as keyof FactionLoyalty, val: factions.military },
            { label: 'Industrielle & Oligarchen', key: 'oligarchs' as keyof FactionLoyalty, val: factions.oligarchs },
            { label: 'Arbeiterschaft & Gewerkschaften', key: 'commonWorkers' as keyof FactionLoyalty, val: factions.commonWorkers },
            { label: 'Geistlichkeit & Religionsrat', key: 'clergy' as keyof FactionLoyalty, val: factions.clergy },
            { label: 'Staatsbürokratie & Justiz', key: 'bureaucracy' as keyof FactionLoyalty, val: factions.bureaucracy }
          ].map((f) => {
            const isDanger = f.val < 30;
            return (
              <div key={f.key} className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-1.5">
                <span className="text-slate-400 text-[10px] block truncate font-sans font-semibold">
                  {f.label}
                </span>
                <div className="flex items-center justify-between">
                  <span className={`text-base font-bold tabular-nums ${isDanger ? 'text-rose-400 animate-pulse' : 'text-slate-100'}`}>
                    {f.val}%
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase">
                    {f.val >= 70 ? 'Loyal' : f.val >= 40 ? 'Zufrieden' : 'Dissident'}
                  </span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      f.val >= 60 ? 'bg-emerald-400' : f.val >= 30 ? 'bg-amber-400' : 'bg-rose-500'
                    }`}
                    style={{ width: `${f.val}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Statutory Laws & Policies (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5 text-xs">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              <span>Gesetzgebung & Staatliche Verordnungen</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Passen Sie Gesetzesparagrafen an, um Arbeit, Bürgerrechte, Justiz und Medien zu gestalten.
            </p>
          </div>

          <div className="space-y-4">
            {laws.map((policy) => (
              <div key={policy.id} className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-200 text-xs">{policy.title}</h4>
                  <span className="text-[10px] text-amber-400 uppercase font-mono">
                    {policy.category}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {policy.options.map((opt) => {
                    const isSelected = policy.currentOption === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          sound.playStamp();
                          onUpdateLaw(policy.id, opt.id);
                        }}
                        className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'border-amber-400 bg-amber-500/10 text-white font-medium shadow'
                            : 'border-slate-800/80 bg-slate-900/50 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-sans font-semibold text-xs">
                          {isSelected && <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />}
                          <span>{opt.name}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                          {opt.effectDescription}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Elections, Emergency Decrees & Police State (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Democratic Elections / Succession Control */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Vote className="w-4 h-4 text-emerald-400" />
                <span>Wahlen & Politisches Mandat</span>
              </h3>
              <span className="font-mono text-xs text-sky-400 font-bold">
                {yearsUntilElection !== null ? `${yearsUntilElection} Jahre bis zur Wahl` : 'Mandat auf Lebenszeit'}
              </span>
            </div>

            <div className="space-y-3 font-mono">
              <div className="flex justify-between items-center bg-slate-950/60 p-2.5 rounded border border-slate-800">
                <span className="text-slate-300">Beliebtheit im Volk:</span>
                <span className={`text-base font-bold tabular-nums ${ruler.popularity >= 50 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {Math.round(ruler.popularity)}%
                </span>
              </div>

              <div className="space-y-2 font-sans">
                <button
                  onClick={() => {
                    sound.playCoins();
                    onExecutePoliticalAction('campaign_rally');
                  }}
                  className="w-full py-2 px-3 rounded-lg border border-slate-800 bg-slate-950 hover:border-slate-700 text-left transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="font-semibold text-slate-200">Landesweite Wahlkampftour & Wahlversprechen</div>
                    <div className="text-[10px] text-slate-400 font-mono">Kosten: 8 Mrd. {state.currencySymbol} · +6% Beliebtheit</div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">+Wahlkampf</span>
                </button>

                <button
                  onClick={() => {
                    sound.playStamp();
                    onExecutePoliticalAction('state_media_blitz');
                  }}
                  className="w-full py-2 px-3 rounded-lg border border-slate-800 bg-slate-950 hover:border-slate-700 text-left transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="font-semibold text-slate-200">Staatliche Fernseh-Propagandakampagne</div>
                    <div className="text-[10px] text-slate-400 font-mono">Kosten: 5 Mrd. {state.currencySymbol} · +4% Beliebtheit, +5 Bürokratie</div>
                  </div>
                  <Radio className="w-4 h-4 text-amber-400" />
                </button>

                <button
                  onClick={() => {
                    sound.playStamp();
                    onExecutePoliticalAction('gerrymander');
                  }}
                  className="w-full py-2 px-3 rounded-lg border border-slate-800 bg-slate-950 hover:border-slate-700 text-left transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="font-semibold text-slate-200">Wahlbezirke manipulieren (Gerrymandering)</div>
                    <div className="text-[10px] text-slate-400 font-mono">+10% Wahlsieg-Vorteil · +8% Zivile Unruhe</div>
                  </div>
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Emergency Presidential Decrees (Dictatorial Power) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>Präsidiale Notverordnungen & Dekrete</span>
              </h3>
              <span className="text-[10px] text-rose-400 font-mono uppercase">Direktbefehl</span>
            </div>

            <p className="text-[11px] text-slate-400">
              Notverordnungen umgehen das Parlament, bergen aber das Risiko schwerer Unruhen und internationaler Ächtung.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => {
                  sound.playWarDrum();
                  onIssueEmergencyDecree('martial_law');
                }}
                className="w-full py-2 px-3 rounded-lg border border-rose-900/40 bg-rose-950/20 hover:bg-rose-950/40 text-left transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold text-rose-300">Kriegsrecht & Ausnahmezustand verhängen</div>
                  <div className="text-[10px] text-slate-400 font-mono">Senkt Unruhe sofort (-20) · +20 Furcht-Index</div>
                </div>
                <Flame className="w-4 h-4 text-rose-500" />
              </button>

              <button
                onClick={() => {
                  sound.playStamp();
                  onToggleCurfew();
                }}
                className="w-full py-2 px-3 rounded-lg border border-slate-800 bg-slate-950 hover:border-slate-700 text-left transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-semibold text-slate-200">Nächtliche Ausgangssperre erlassen</div>
                  <div className="text-[10px] text-slate-400 font-mono">Militär- und Polizeipatrouillen unterbinden Krawalle</div>
                </div>
                <span className="text-xs font-mono text-amber-400 font-bold">Ausgangssperre</span>
              </button>

              <button
                onClick={() => {
                  sound.playStamp();
                  onIssueEmergencyDecree('freeze_opposition');
                }}
                className="w-full py-2 px-3 rounded-lg border border-slate-800 bg-slate-950 hover:border-slate-700 text-left transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-semibold text-slate-200">Bankkonten der Oppositionsparteien einfrieren</div>
                  <div className="text-[10px] text-slate-400 font-mono">Konfisziert 15 Mrd. {state.currencySymbol} für die Staatskasse · -10 Beliebtheit</div>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">Einfrieren</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
