import React, { useState } from 'react';
import { GameState, ActiveSanction } from '../types/game';
import { RealCountryData } from '../data/realWorldMapData';
import { ALL_30_SANCTIONS, SanctionDefinition, calculateSanctionsTotal } from '../data/sanctionsData';
import { sound } from '../utils/sound';
import {
  ShieldAlert,
  AlertOctagon,
  TrendingDown,
  Building2,
  Zap,
  Cpu,
  Flame,
  Truck,
  Users2,
  X,
  CheckCircle2,
  RotateCcw,
  Sliders,
  DollarSign,
  Search
} from 'lucide-react';

interface SanctionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetCountry: RealCountryData;
  state: GameState;
  onUpdateState: (updater: (prev: GameState) => GameState) => void;
  onLogEvent: (text: string, type: 'positive' | 'warning' | 'negative' | 'neutral') => void;
}

export const SanctionsModal: React.FC<SanctionsModalProps> = ({
  isOpen,
  onClose,
  targetCountry,
  state,
  onUpdateState,
  onLogEvent
}) => {
  if (!isOpen) return null;

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Active sanctions for this country from GameState
  const currentActiveForCountry: ActiveSanction[] = (state.activeSanctions || []).filter(
    s => s.countryId === targetCountry.id
  );
  const activeIds = new Set(currentActiveForCountry.map(s => s.sanctionId));

  // Compute live cumulative totals
  const stats = calculateSanctionsTotal(currentActiveForCountry);
  const totalBipLossDollar = Number(((targetCountry.gdpBillions * stats.totalGdpImpactPercent) / 100).toFixed(1));

  // Toggle single sanction
  const handleToggleSanction = (sanc: SanctionDefinition) => {
    const isEnacted = activeIds.has(sanc.id);

    if (isEnacted) {
      sound.playClick();
      onUpdateState(prev => ({
        ...prev,
        activeSanctions: (prev.activeSanctions || []).filter(
          s => !(s.countryId === targetCountry.id && s.sanctionId === sanc.id)
        )
      }));
      onLogEvent(`Sanktion "${sanc.name}" gegen ${targetCountry.name} wurde aufgehoben.`, 'neutral');
    } else {
      sound.playStamp();
      const newActive: ActiveSanction = {
        sanctionId: sanc.id,
        countryId: targetCountry.id,
        sanctionName: sanc.name,
        gdpImpactPercent: sanc.gdpImpactPercent
      };
      onUpdateState(prev => ({
        ...prev,
        activeSanctions: [...(prev.activeSanctions || []), newActive]
      }));
      onLogEvent(`Sanktion verhängt: "${sanc.name}" gegen ${targetCountry.name} (-${sanc.gdpImpactPercent}% BIP).`, 'warning');
    }
  };

  // Enact all 30 sanctions
  const handleEnactAll = () => {
    sound.playWarDrum();
    const allForCountry: ActiveSanction[] = ALL_30_SANCTIONS.map(s => ({
      sanctionId: s.id,
      countryId: targetCountry.id,
      sanctionName: s.name,
      gdpImpactPercent: s.gdpImpactPercent
    }));

    onUpdateState(prev => {
      const otherCountriesSanctions = (prev.activeSanctions || []).filter(s => s.countryId !== targetCountry.id);
      return {
        ...prev,
        activeSanctions: [...otherCountriesSanctions, ...allForCountry]
      };
    });

    onLogEvent(`MAXIMALER DRUCK: Alle 30 Wirtschaftssanktionen gegen ${targetCountry.name} in Kraft gesetzt!`, 'warning');
  };

  // Lift all sanctions
  const handleLiftAll = () => {
    sound.playTriumph();
    onUpdateState(prev => ({
      ...prev,
      activeSanctions: (prev.activeSanctions || []).filter(s => s.countryId !== targetCountry.id)
    }));
    onLogEvent(`Sämtliche Wirtschaftssanktionen gegen ${targetCountry.name} wurden vollständig aufgehoben.`, 'positive');
  };

  // Enact Preset
  const handleEnactPreset = (categoryName: SanctionDefinition['category']) => {
    sound.playStamp();
    const matching = ALL_30_SANCTIONS.filter(s => s.category === categoryName);
    const newSanctions: ActiveSanction[] = matching.map(s => ({
      sanctionId: s.id,
      countryId: targetCountry.id,
      sanctionName: s.name,
      gdpImpactPercent: s.gdpImpactPercent
    }));

    onUpdateState(prev => {
      const existingWithoutMatching = (prev.activeSanctions || []).filter(
        s => !(s.countryId === targetCountry.id && matching.some(m => m.id === s.sanctionId))
      );
      return {
        ...prev,
        activeSanctions: [...existingWithoutMatching, ...newSanctions]
      };
    });

    onLogEvent(`Sanktionspaket "${categoryName}" gegen ${targetCountry.name} verhängt.`, 'warning');
  };

  // Filtered list
  const filteredSanctions = ALL_30_SANCTIONS.filter(s => {
    const matchCat = selectedCategory === 'all' || s.category === selectedCategory;
    const matchSearch =
      s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.category.toLowerCase().includes(searchFilter.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl h-[92vh] flex flex-col rounded-2xl bg-slate-950 border border-rose-500/30 shadow-2xl shadow-rose-950/60 overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-rose-950/70 via-slate-900 to-slate-950 border-b border-rose-900/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-600/20 border border-rose-500/40 text-rose-400">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-wide font-['Cinzel']">
                  Wirtschaftsembargo & Sanktionen verhängen
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {targetCountry.name}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                30 völkerrechtliche Sanktionen · Zielgerichtete Schadenswirkung auf das Bruttoinlandsprodukt (BIP)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time GDP Impact Dashboard */}
        <div className="p-4 sm:p-5 bg-slate-900/80 border-b border-slate-800 shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* 1. Target GDP Impact */}
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-600/40 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-rose-300 font-mono">
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                  <TrendingDown className="w-4 h-4 text-rose-400" />
                  BIP-Verlust ({targetCountry.isoCode})
                </span>
                <span className="text-[10px] bg-rose-500/20 px-1.5 py-0.5 rounded text-rose-200">
                  Kumulativ
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-rose-400">
                  -{stats.totalGdpImpactPercent}%
                </span>
                <span className="text-xs font-mono text-slate-300">
                  (-${totalBipLossDollar} Mrd.)
                </span>
              </div>
              <div className="mt-1 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-rose-500 h-1.5 transition-all duration-300"
                  style={{ width: `${Math.min(100, (stats.totalGdpImpactPercent / 45) * 100)}%` }}
                />
              </div>
            </div>

            {/* 2. Active Sanctions Counter */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="font-bold uppercase tracking-wider">Verhängte Maßnahmen</span>
                <span className="text-amber-400 font-bold">{stats.count} / 30</span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-white">
                  {stats.count}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  von 30 aktiv
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                {stats.count === 30 ? 'Maximale Blockade' : stats.count > 0 ? 'Selektiver Druck' : 'Keine Restriktionen'}
              </span>
            </div>

            {/* 3. Domestic Cost */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="font-bold uppercase tracking-wider">Eigene Handelskosten</span>
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-amber-400">
                  -${stats.totalDomesticCostMrd}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Mrd. / Quartal
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Import-Verlagerung & Ausfallgebühren
              </span>
            </div>

            {/* 4. Target Country Base Data */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="font-bold uppercase tracking-wider">Ausgangs-BIP</span>
                <span className="text-slate-300 font-bold">${targetCountry.gdpBillions} Mrd.</span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-lg font-bold font-mono text-white">
                  ${Math.max(0, targetCountry.gdpBillions - totalBipLossDollar).toFixed(1)} Mrd.
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  effektives BIP
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Führung: {targetCountry.leaderGerman}
              </span>
            </div>

          </div>

          {/* Quick Actions / Presets */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-800/70 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Schnellpakete:</span>
              <button
                onClick={handleEnactAll}
                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors cursor-pointer shadow-sm"
              >
                Maximaler Druck (Alle 30)
              </button>
              <button
                onClick={() => handleEnactPreset('Finanz & Banken')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition-colors cursor-pointer"
              >
                Finanz- & SWIFT-Blockade
              </button>
              <button
                onClick={() => handleEnactPreset('High-Tech & KI')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors cursor-pointer"
              >
                Halbleiter- & KI-Embargo
              </button>
              <button
                onClick={() => handleEnactPreset('Energie & Rohstoffe')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors cursor-pointer"
              >
                Öl- & Gas-Exportstopp
              </button>
            </div>

            {stats.count > 0 && (
              <button
                onClick={handleLiftAll}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer ml-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Alle Sanktionen aufheben</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between px-6 py-2.5 bg-slate-950 border-b border-slate-800 gap-2 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
            {[
              { id: 'all', label: 'Alle (30)' },
              { id: 'Finanz & Banken', label: 'Finanz & Banken' },
              { id: 'Energie & Rohstoffe', label: 'Energie & Rohstoffe' },
              { id: 'High-Tech & KI', label: 'High-Tech & KI' },
              { id: 'Rüstung & Sicherheit', label: 'Rüstung & Sicherheit' },
              { id: 'Handel & Logistik', label: 'Handel & Logistik' },
              { id: 'Diplomatie & Eliten', label: 'Diplomatie & Eliten' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Sanktion filtern..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-8 pr-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-400 w-48 font-mono"
            />
          </div>
        </div>

        {/* 30 Sanctions Catalog Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredSanctions.map((sanc) => {
              const isEnacted = activeIds.has(sanc.id);

              return (
                <div
                  key={sanc.id}
                  className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                    isEnacted
                      ? 'bg-rose-950/30 border-rose-500/50 shadow-md shadow-rose-950/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Header: Title + Category + GDP Impact Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isEnacted ? 'bg-rose-500 animate-pulse' : 'bg-slate-600'}`} />
                          <h4 className="font-bold text-sm text-white">{sanc.name}</h4>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                          {sanc.category}
                        </span>
                      </div>

                      {/* Prominent GDP Impact Tag */}
                      <div className="text-right shrink-0">
                        <span className="px-2 py-0.5 rounded-md font-mono font-bold text-xs bg-rose-500/20 text-rose-300 border border-rose-500/40 block">
                          -{sanc.gdpImpactPercent}% BIP
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                          Zielland-Auswirkung
                        </span>
                      </div>
                    </div>

                    {/* Description & Strategic Impact */}
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {sanc.description}
                    </p>
                    <div className="mt-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 font-mono">
                      <span className="text-amber-400 font-semibold">Effekt:</span> {sanc.strategicEffect}
                    </div>
                  </div>

                  {/* Footer & Toggle Action */}
                  <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between font-mono text-xs">
                    <div className="text-[11px] text-slate-400">
                      <span>Eigene Kosten: ~${sanc.domesticCostMrd} Mrd./Q</span>
                    </div>

                    <button
                      onClick={() => handleToggleSanction(sanc)}
                      className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                        isEnacted
                          ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {isEnacted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Sanktion aufheben</span>
                        </>
                      ) : (
                        <>
                          <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                          <span>Sanktion verhängen</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0 font-mono">
          <div>
            <span>Rechtlicher Status: Gemäß Außenwirtschaftsgesetz & UN-Sicherheitsrat resolutionen konform.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
          >
            Schließen
          </button>
        </div>

      </div>
    </div>
  );
};
