import React, { useState } from 'react';
import { GameState, Corporate100Item } from '../types/game';
import { sound } from '../utils/sound';
import {
  Building2,
  Search,
  Filter,
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  Gavel,
  Landmark,
  UserCheck,
  TrendingUp,
  Cpu,
  Zap,
  Globe2
} from 'lucide-react';

interface Corporate100PanelProps {
  state: GameState;
  onUpdateState: (updater: (prev: GameState) => GameState) => void;
  onLogEvent: (text: string, type: 'positive' | 'warning' | 'negative' | 'neutral') => void;
}

export const Corporate100Panel: React.FC<Corporate100PanelProps> = ({
  state,
  onUpdateState,
  onLogEvent
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('all');

  const glassCard = state.themeMode === 'light'
    ? 'bg-white/80 border-slate-200 text-slate-800 shadow-sm'
    : 'bg-slate-900/60 border-slate-800/80 text-slate-100 shadow-md backdrop-blur-md';

  const innerCard = state.themeMode === 'light'
    ? 'bg-slate-50 border-slate-200'
    : 'bg-slate-950/50 border-slate-800/60';

  const allSectors = Array.from(new Set(state.corporate100.map(c => c.sector)));

  const filteredList = state.corporate100.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.ceo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.majorOwner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'all' || c.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  // Action: Clean Nationalization (Kauf von Staatsanteilen)
  const handleNationalize = (corp: Corporate100Item) => {
    const cost = corp.valuationMrd * 0.51; // 51% majority buy
    if (state.macro.treasury < cost) {
      alert(`Unzureichende Staatskasse für den Erwerb der Kontrollmehrheit (${state.currencySymbol}${cost.toFixed(1)} Mrd. benötigt).`);
      return;
    }
    sound.playStamp();
    onUpdateState(prev => ({
      ...prev,
      macro: {
        ...prev.macro,
        treasury: Number((prev.macro.treasury - cost).toFixed(2))
      },
      corporate100: prev.corporate100.map(c =>
        c.rank === corp.rank ? { ...c, stateSharePercent: 51, status: 'state_owned' } : c
      ),
      stability: Math.min(100, prev.stability + 3)
    }));
    onLogEvent(`VERSTAATLICHUNG: Der Staat übernahm 51% der Anteile an „${corp.name}“ für ${state.currencySymbol}${cost.toFixed(1)} Mrd.`, 'positive');
  };

  // Action: Forced Expropriation (Zwangsenteignung)
  const handleExpropriate = (corp: Corporate100Item) => {
    sound.playStamp();
    onUpdateState(prev => ({
      ...prev,
      corporate100: prev.corporate100.map(c =>
        c.rank === corp.rank ? { ...c, stateSharePercent: 100, status: 'expropriated' } : c
      ),
      stability: Math.max(10, prev.stability - 8),
      unrest: Math.min(100, prev.unrest + 5),
      factions: {
        ...prev.factions,
        oligarchs: Math.max(5, prev.factions.oligarchs - 25),
        commonWorkers: Math.min(100, prev.factions.commonWorkers + 10)
      }
    }));
    onLogEvent(`ENTEIGNUNG: „${corp.name}“ wurde per Präsidialdekret entschädigungslos verstaatlicht! Oligarchen drohen mit Verfassungsklage.`, 'warning');
  };

  // Action: Confiscation (Beschlagnahmung)
  const handleConfiscate = (corp: Corporate100Item) => {
    sound.playCoin();
    const seizedFunds = corp.ownerWealthMrd * 0.4;
    onUpdateState(prev => ({
      ...prev,
      macro: {
        ...prev.macro,
        treasury: Number((prev.macro.treasury + seizedFunds).toFixed(2))
      },
      corporate100: prev.corporate100.map(c =>
        c.rank === corp.rank ? { ...c, status: 'confiscated', stateSharePercent: 100 } : c
      ),
      stability: Math.max(10, prev.stability - 4),
      ruler: {
        ...prev.ruler,
        reputation: Math.max(10, prev.ruler.reputation - 5)
      }
    }));
    onLogEvent(`BESCHLAGNAHMUNG: Vermögenswerte von „${corp.majorOwner}“ (${corp.name}) beschlagnahmt! ${state.currencySymbol}${seizedFunds.toFixed(1)} Mrd. der Staatskasse zugeführt.`, 'negative');
  };

  // Toggle Foreign Talent Campaign
  const handleToggleTalentCampaign = () => {
    sound.playClick();
    onUpdateState(prev => ({
      ...prev,
      macro: {
        ...prev.macro,
        foreignTalentCampaignActive: !prev.macro.foreignTalentCampaignActive,
        treasury: prev.macro.foreignTalentCampaignActive ? prev.macro.treasury : prev.macro.treasury - 2.5
      }
    }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className={`p-6 rounded-2xl border ${glassCard}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest font-mono">
              <Building2 className="w-4 h-4" />
              <span>Nationale Wirtschaftsmacht</span>
            </div>
            <h2 className="text-2xl font-black font-['Cinzel'] tracking-wide">
              Private Industrie · Die 100 wertvollsten Unternehmen
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Vollständige Übersicht über die 100 größten Industriekonzerne des Landes, deren Bewertung, CEOs, Eigentümer und bekannte Privatvermögen. Führen Sie Verstaatlichungen, Enteignungen oder Beschlagnahmungen durch.
            </p>
          </div>

          {/* Foreign Talent Recruitment Campaign Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleTalentCampaign}
              className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                state.macro.foreignTalentCampaignActive
                  ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>
                {state.macro.foreignTalentCampaignActive
                  ? 'Fachkräfte-Anwerbung: Aktiv (+0.35% BIP)'
                  : 'Fachkräfte-Kampagne starten (2.5 Mrd.)'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-4 rounded-xl border ${glassCard} flex flex-wrap items-center justify-between gap-3`}>
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Konzernname, CEO oder Eigentümer suchen..."
            className="w-full bg-transparent text-xs text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">Alle Branchen ({state.corporate100.length})</option>
            {allSectors.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Corporate 100 Table */}
      <div className={`p-4 rounded-2xl border ${glassCard} overflow-x-auto`}>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] text-slate-400 font-mono uppercase">
              <th className="py-2.5 px-3">Rang</th>
              <th className="py-2.5 px-3">Unternehmen</th>
              <th className="py-2.5 px-3">Branche</th>
              <th className="py-2.5 px-3 text-right">Marktwert</th>
              <th className="py-2.5 px-3 text-right">Umsatz / Gewinn</th>
              <th className="py-2.5 px-3">CEO & Führung</th>
              <th className="py-2.5 px-3">Haupteigentümer & Privatvermögen</th>
              <th className="py-2.5 px-3 text-center">Status / Staatsanteil</th>
              <th className="py-2.5 px-3 text-right">Staatsintervention</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filteredList.map((corp) => {
              const isState = corp.status === 'state_owned';
              const isExprop = corp.status === 'expropriated';
              const isConfisc = corp.status === 'confiscated';

              return (
                <tr key={corp.rank} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 font-bold text-amber-400">#{corp.rank}</td>
                  <td className="py-3 px-3 font-semibold text-slate-100 font-sans">
                    {corp.name}
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-sans">{corp.sector}</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-400">
                    {state.currencySymbol}{corp.valuationMrd} Mrd.
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300">
                    <div>{state.currencySymbol}{corp.revenueMrd} Mrd.</div>
                    <div className="text-[10px] text-emerald-400 font-bold">+{state.currencySymbol}{corp.profitMrd} Mrd. Netto</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-sans">
                    {corp.ceo}
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-sans">
                    <div>{corp.majorOwner}</div>
                    <div className="text-[10px] font-mono text-amber-400">
                      Vermögen: {state.currencySymbol}{corp.ownerWealthMrd} Mrd.
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isState ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' :
                      isExprop ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      isConfisc ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                      corp.stateSharePercent > 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {isState ? 'Verstaatlicht (51%)' :
                       isExprop ? 'Enteignet (100%)' :
                       isConfisc ? 'Beschlagnahmt' :
                       corp.stateSharePercent > 0 ? `${corp.stateSharePercent}% Staat` : 'Privatkonzern'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1 font-sans">
                      {!isState && !isExprop && !isConfisc && (
                        <>
                          <button
                            onClick={() => handleNationalize(corp)}
                            className="px-2 py-1 rounded bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 text-[10px] font-semibold transition-colors"
                            title="Mehrheit (51%) mit Staatskasse erwerben"
                          >
                            Verstaatlichen
                          </button>
                          <button
                            onClick={() => handleExpropriate(corp)}
                            className="px-2 py-1 rounded bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-[10px] font-semibold transition-colors"
                            title="Entschädigungslose Enteignung (hohes Marktrisiko)"
                          >
                            Enteignen
                          </button>
                          <button
                            onClick={() => handleConfiscate(corp)}
                            className="px-2 py-1 rounded bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-[10px] font-semibold transition-colors"
                            title="Vermögen wegen Korruption beschlagnahmen"
                          >
                            Beschlagnahmen
                          </button>
                        </>
                      )}
                      {(isState || isExprop || isConfisc) && (
                        <span className="text-[11px] text-slate-500 italic">Vollständig unter Staatskontrolle</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
