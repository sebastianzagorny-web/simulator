import React from 'react';
import { GameState, InfrastructureLevel } from '../types/game';
import { sound } from '../utils/sound';
import { Truck, ShieldCheck, GraduationCap, HeartPulse, Sparkles, Building2, Anchor, Train } from 'lucide-react';

interface InfrastructurePanelProps {
  state: GameState;
  onUpgradeInfrastructure: (infraId: string) => void;
}

export const InfrastructurePanel: React.FC<InfrastructurePanelProps> = ({
  state,
  onUpgradeInfrastructure
}) => {
  const { infrastructure, macro } = state;

  // Group by category
  const transport = infrastructure.filter(i => i.category === 'transport');
  const control = infrastructure.filter(i => i.category === 'control');
  const social = infrastructure.filter(i => i.category === 'social');
  const welfare = infrastructure.filter(i => i.category === 'welfare');

  const totalUpkeep = infrastructure.reduce((sum, item) => sum + (item.level * item.upkeepPerQuarter), 0);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'transport': return <Truck className="w-4 h-4 text-sky-400" />;
      case 'control': return <ShieldCheck className="w-4 h-4 text-amber-400" />;
      case 'social': return <GraduationCap className="w-4 h-4 text-emerald-400" />;
      default: return <HeartPulse className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-950 p-6 space-y-6 text-slate-100 select-none">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400 font-semibold font-mono">
            <Building2 className="w-4 h-4" />
            <span>Bundesministerium für Verkehr, Bau & Soziales</span>
          </div>
          <h2 className="text-2xl font-bold font-['Cinzel'] text-white mt-1">
            Staatliche Infrastruktur & Daseinsvorsorge
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Finanzieren Sie monumentale Logistikachsen, Regierungszitadellen, Eliteuniversitäten und modernste Gesundheitseinrichtungen.
          </p>
        </div>

        <div className="bg-slate-950/80 px-4 py-2.5 rounded-lg border border-slate-800 font-mono text-xs">
          <span className="text-[10px] text-slate-400 uppercase block">Infrastruktur-Unterhaltskosten</span>
          <span className="text-rose-400 font-bold text-base tabular-nums">
            -{state.currencySymbol}{totalUpkeep.toFixed(1)} Mrd. / Quartal
          </span>
        </div>
      </div>

      {/* Grid of Sections */}
      <div className="space-y-6">
        
        {/* Section 1: Transport & Logistics */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
            <Truck className="w-4 h-4" />
            <span>Transportachsen & Globale Logistik</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {transport.map((item) => renderInfraCard(item, macro.treasury, state.currencySymbol, onUpgradeInfrastructure))}
          </div>
        </div>

        {/* Section 2: Representation, Palaces & State Control */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Staatliche Repräsentation, Paläste & Kontrolle</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {control.map((item) => renderInfraCard(item, macro.treasury, state.currencySymbol, onUpgradeInfrastructure))}
          </div>
        </div>

        {/* Section 3: Education, Health & Public Services */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <GraduationCap className="w-4 h-4" />
            <span>Bildung, Spitzenforschung & Gesundheitswesen</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {social.map((item) => renderInfraCard(item, macro.treasury, state.currencySymbol, onUpgradeInfrastructure))}
          </div>
        </div>

        {/* Section 4: Basic Welfare Services & Food Security */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
            <HeartPulse className="w-4 h-4" />
            <span>Öffentliche Daseinsvorsorge, Wasserwerke & Getreidespeicher</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {welfare.map((item) => renderInfraCard(item, macro.treasury, state.currencySymbol, onUpgradeInfrastructure))}
          </div>
        </div>

      </div>

    </div>
  );
};

function renderInfraCard(
  item: InfrastructureLevel,
  treasury: number,
  currencySymbol: string,
  onUpgrade: (id: string) => void
) {
  const isMax = item.level >= 5;
  const upgradeCost = item.costPerLevel * item.level;
  const canAfford = treasury >= upgradeCost;

  return (
    <div key={item.id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 text-xs">
      <div>
        <div className="flex items-start justify-between">
          <h4 className="font-bold text-slate-100">{item.name}</h4>
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Stufe {item.level} / 5
          </span>
        </div>

        {/* Visual Level Bars */}
        <div className="flex items-center gap-1.5 py-2">
          {[1, 2, 3, 4, 5].map((lvl) => (
            <div
              key={lvl}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                lvl <= item.level ? 'bg-amber-400' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        <p className="text-slate-400 text-[11px] leading-relaxed">
          {item.description}
        </p>

        <div className="mt-2.5 p-2 rounded bg-slate-950/70 border border-slate-800/80 text-[11px] font-mono text-emerald-400">
          Bonus: {item.bonusText}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-mono text-[11px]">
        <div>
          <span className="text-slate-500 block">Unterhalt:</span>
          <span className="text-slate-300">-{currencySymbol}{(item.level * item.upkeepPerQuarter)} Mrd./Q</span>
        </div>

        {isMax ? (
          <span className="text-slate-500 font-bold uppercase">MAXIMALE STUFE</span>
        ) : (
          <button
            onClick={() => {
              if (canAfford) {
                sound.playStamp();
                onUpgrade(item.id);
              } else {
                sound.playCrisis();
              }
            }}
            disabled={!canAfford}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 font-bold transition-all ${
              canAfford
                ? 'border-amber-500/70 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 cursor-pointer active:scale-95'
                : 'border-slate-800 bg-slate-900/50 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ausbauen ({currencySymbol}{upgradeCost} Mrd.)</span>
          </button>
        )}
      </div>
    </div>
  );
}
