import React, { useState } from 'react';
import { GameState, MainIndustrySector, SubSectorItem, TradeDeal } from '../types/game';
import { sound } from '../utils/sound';
import {
  Boxes,
  Zap,
  Wheat,
  Cpu,
  Cog,
  FlaskConical,
  Car,
  Building,
  Landmark,
  ShieldAlert,
  Globe2,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  PlusCircle,
  Trash2,
  CheckCircle2,
  Sliders
} from 'lucide-react';

interface IndustryTradePanelProps {
  state: GameState;
  onUpdateState: (updater: (prev: GameState) => GameState) => void;
  onLogEvent: (text: string, type: 'positive' | 'warning' | 'negative' | 'neutral') => void;
}

export const IndustryTradePanel: React.FC<IndustryTradePanelProps> = ({
  state,
  onUpdateState,
  onLogEvent
}) => {
  const [selectedSectorId, setSelectedSectorId] = useState<string>(state.industrySectors[0]?.id || 'sec_energy');
  const [newDealPartner, setNewDealPartner] = useState<string>('Frankreich');
  const [newDealCommodity, setNewDealCommodity] = useState<string>('Halbleiter & KI-Server');
  const [newDealType, setNewDealType] = useState<'import' | 'export'>('export');
  const [newDealVolume, setNewDealVolume] = useState<number>(50);

  const glassCard = state.themeMode === 'light'
    ? 'bg-white/80 border-slate-200 text-slate-800 shadow-sm'
    : 'bg-slate-900/60 border-slate-800/80 text-slate-100 shadow-md backdrop-blur-md';

  const innerCard = state.themeMode === 'light'
    ? 'bg-slate-50 border-slate-200'
    : 'bg-slate-950/50 border-slate-800/60';

  const activeSector = state.industrySectors.find(s => s.id === selectedSectorId) || state.industrySectors[0];

  // Adjust subsector import/export/tariff
  const handleUpdateSubSector = (sectorId: string, subId: string, field: 'importAmount' | 'exportAmount' | 'tariffPercent', value: number) => {
    sound.playClick();
    onUpdateState(prev => ({
      ...prev,
      industrySectors: prev.industrySectors.map(sec => {
        if (sec.id !== sectorId) return sec;
        return {
          ...sec,
          subSectors: sec.subSectors.map(sub => {
            if (sub.id !== subId) return sub;
            return { ...sub, [field]: Math.max(0, value) };
          })
        };
      })
    }));
  };

  // Add new trade agreement (supports up to 100 concurrent contracts)
  const handleAddTradeDeal = () => {
    if (state.tradeDeals.length >= 100) {
      alert('Die maximale Grenze von 100 bilateralen Handelsverträgen ist erreicht.');
      return;
    }
    sound.playStamp();
    const pricePerUnit = 120 + Math.floor(Math.random() * 150);
    const valueQuarterly = Number(((newDealVolume * pricePerUnit) / 1000).toFixed(2));

    const newDeal: TradeDeal = {
      id: `deal_${Date.now()}`,
      partnerCountry: newDealPartner,
      commodityName: newDealCommodity,
      type: newDealType,
      volumeQuarterly: newDealVolume,
      pricePerUnit,
      valueQuarterlyMrd: valueQuarterly,
      durationQuarters: 12,
      reliability: 92
    };

    onUpdateState(prev => ({
      ...prev,
      tradeDeals: [newDeal, ...prev.tradeDeals]
    }));

    onLogEvent(`HANDELSVERTRAG: Neuer bilateraler Vertrag mit ${newDealPartner} geschlossen (${newDealType === 'export' ? 'Export' : 'Import'} von ${newDealCommodity}).`, 'positive');
  };

  const handleCancelTradeDeal = (dealId: string) => {
    sound.playClick();
    onUpdateState(prev => ({
      ...prev,
      tradeDeals: prev.tradeDeals.filter(d => d.id !== dealId)
    }));
  };

  const getSectorIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-4 h-4 text-amber-400" />;
      case 'Boxes': return <Boxes className="w-4 h-4 text-emerald-400" />;
      case 'Wheat': return <Wheat className="w-4 h-4 text-yellow-500" />;
      case 'Cpu': return <Cpu className="w-4 h-4 text-sky-400" />;
      case 'Cog': return <Cog className="w-4 h-4 text-slate-300" />;
      case 'FlaskConical': return <FlaskConical className="w-4 h-4 text-purple-400" />;
      case 'Car': return <Car className="w-4 h-4 text-rose-400" />;
      case 'Building': return <Building className="w-4 h-4 text-indigo-400" />;
      case 'Landmark': return <Landmark className="w-4 h-4 text-emerald-400" />;
      case 'ShieldAlert': return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      default: return <Boxes className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className={`p-6 rounded-2xl border ${glassCard}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest font-mono">
              <Globe2 className="w-4 h-4" />
              <span>Industriekapazität & Globaler Warenaustausch</span>
            </div>
            <h2 className="text-2xl font-black font-['Cinzel'] tracking-wide">
              Industrie, Rohstoffe & Welthandel (10x10 Sektoren)
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              10 Hauptsektoren mit je 10 differenzierten Unterbereichen (100 Industriezweige). Dynamische Weltmarktpreise, frei justierbare Import- und Exportmengen sowie bilaterale Handelsabkommen (bis zu 100 Verträge).
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className={`p-3 rounded-xl border ${innerCard} text-center`}>
              <span className="text-[10px] text-slate-400 block uppercase">Aktive Handelsverträge</span>
              <span className="text-amber-400 font-bold">{state.tradeDeals.length} / 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* 10 Main Sectors Navigation Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {state.industrySectors.map((sector) => {
          const isSelected = sector.id === activeSector.id;
          return (
            <button
              key={sector.id}
              onClick={() => {
                sound.playClick();
                setSelectedSectorId(sector.id);
              }}
              className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                isSelected
                  ? 'border-amber-500 bg-amber-500/15 text-amber-300 shadow-sm'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {getSectorIcon(sector.iconName)}
              <span>{sector.name}</span>
            </button>
          );
        })}
      </div>

      {/* 10 Subsectors of the Selected Main Sector */}
      <div className={`p-6 rounded-2xl border ${glassCard}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            {getSectorIcon(activeSector.iconName)}
            <span>{activeSector.name} · Die 10 Unterbereiche</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Preise & Quoten dynamisch an Weltmarkt angepasst
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeSector.subSectors.map((sub) => {
            const balance = sub.productionRate - sub.domesticNeed;
            const isSurplus = balance >= 0;

            return (
              <div key={sub.id} className={`p-4 rounded-xl border ${innerCard} space-y-3`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-200">{sub.name}</div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Weltmarktpreis: <strong className="text-emerald-400">{state.currencySymbol}{sub.worldMarketPrice}/Einheit</strong>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    isSurplus ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {isSurplus ? `+${balance} Überschuss` : `${balance} Defizit`}
                  </span>
                </div>

                {/* Key Numbers */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-[9px] text-slate-400 block uppercase">Inländische Produktion</span>
                    <span className="font-bold text-slate-200">{sub.productionRate} Einh./Q</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-[9px] text-slate-400 block uppercase">Inlandsbedarf</span>
                    <span className="font-bold text-slate-200">{sub.domesticNeed} Einh./Q</span>
                  </div>
                </div>

                {/* Controls: Import, Export, Tariff */}
                <div className="space-y-2 pt-2 border-t border-slate-800 text-[11px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-400">Importquote ({sub.importAmount} Einh.):</span>
                    <input
                      type="range"
                      min="0"
                      max="400"
                      step="5"
                      value={sub.importAmount}
                      onChange={(e) => handleUpdateSubSector(activeSector.id, sub.id, 'importAmount', parseInt(e.target.value))}
                      className="w-32 accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-400">Exportquote ({sub.exportAmount} Einh.):</span>
                    <input
                      type="range"
                      min="0"
                      max="400"
                      step="5"
                      value={sub.exportAmount}
                      onChange={(e) => handleUpdateSubSector(activeSector.id, sub.id, 'exportAmount', parseInt(e.target.value))}
                      className="w-32 accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-400">Schutzzoll ({sub.tariffPercent}%):</span>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="1"
                      value={sub.tariffPercent}
                      onChange={(e) => handleUpdateSubSector(activeSector.id, sub.id, 'tariffPercent', parseInt(e.target.value))}
                      className="w-32 accent-purple-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trade Agreements: Up to 100 bilateral contracts */}
      <div className={`p-6 rounded-2xl border ${glassCard}`}>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <Landmark className="w-5 h-5" />
              <span>Internationale Handelsverträge ({state.tradeDeals.length} / 100)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Abschluss langfristiger Handelsabkommen. Exportverträge stärken Staatskasse und Währung; Importverträge sichern Rohstoffe für die Industrie.
            </p>
          </div>
        </div>

        {/* Existing Contracts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {state.tradeDeals.map((deal) => {
            const isExport = deal.type === 'export';
            return (
              <div key={deal.id} className={`p-3.5 rounded-xl border ${innerCard}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-200">{deal.partnerCountry}</div>
                    <div className="text-[11px] text-slate-400">{deal.commodityName}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isExport ? 'bg-emerald-500/20 text-emerald-400' : 'bg-sky-500/20 text-sky-400'
                  }`}>
                    {isExport ? 'Export' : 'Import'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 my-2 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Volumen</span>
                    <span className="text-slate-300 font-semibold">{deal.volumeQuarterly} Einh./Q</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Quartalswert</span>
                    <span className="text-emerald-400 font-semibold">{state.currencySymbol}{deal.valueQuarterlyMrd} Mrd.</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400 text-[11px]">Zuverlässigkeit: {deal.reliability}%</span>
                  <button
                    onClick={() => handleCancelTradeDeal(deal.id)}
                    className="text-rose-400 hover:text-rose-300 text-[11px] transition-colors"
                  >
                    Vertrag kündigen
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Create Trade Agreement Form */}
        <div className={`p-4 rounded-xl border border-dashed border-slate-700 ${innerCard}`}>
          <div className="text-xs font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Neuen bilateralen Handelsvertrag unterzeichnen</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Partnerland</label>
              <select
                value={newDealPartner}
                onChange={(e) => setNewDealPartner(e.target.value)}
                className="w-full px-2 py-1.5 rounded border border-slate-700 bg-slate-900 text-xs text-white focus:outline-none"
              >
                {state.rivals.map(r => (
                  <option key={r.id} value={r.name}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Handelsgut</label>
              <input
                type="text"
                value={newDealCommodity}
                onChange={(e) => setNewDealCommodity(e.target.value)}
                className="w-full px-2 py-1.5 rounded border border-slate-700 bg-slate-900 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Art</label>
              <select
                value={newDealType}
                onChange={(e) => setNewDealType(e.target.value as 'import' | 'export')}
                className="w-full px-2 py-1.5 rounded border border-slate-700 bg-slate-900 text-xs text-white focus:outline-none"
              >
                <option value="export">Export (+Einnahmen)</option>
                <option value="import">Import (Versorgung)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Volumen ({newDealVolume})</label>
              <input
                type="number"
                min="10"
                max="500"
                step="10"
                value={newDealVolume}
                onChange={(e) => setNewDealVolume(parseInt(e.target.value) || 10)}
                className="w-full px-2 py-1.5 rounded border border-slate-700 bg-slate-900 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <button
                onClick={handleAddTradeDeal}
                className="w-full py-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Vertrag ratifizieren
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
