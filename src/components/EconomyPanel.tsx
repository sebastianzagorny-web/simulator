import React, { useState } from 'react';
import { GameState, TaxRates, StateEnterprise } from '../types/game';
import { sound } from '../utils/sound';
import {
  Landmark,
  TrendingUp,
  DollarSign,
  PieChart,
  Layers,
  Building,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Sliders,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface EconomyPanelProps {
  state: GameState;
  onUpdateTaxes: (taxes: TaxRates) => void;
  onUpdateInterestRate: (rate: number) => void;
  onUpdateEnterprise: (enterpriseId: string, ownership: StateEnterprise['ownership']) => void;
  onExecuteEconomicLever: (action: 'quant_easing' | 'austerity' | 'capital_controls' | 'currency_devaluation') => void;
  onUpdateState: (updater: (prev: GameState) => GameState) => void;
  onLogEvent: (text: string, type: 'positive' | 'warning' | 'negative' | 'neutral') => void;
}

export const EconomyPanel: React.FC<EconomyPanelProps> = ({
  state,
  onUpdateTaxes,
  onUpdateInterestRate,
  onUpdateEnterprise,
  onExecuteEconomicLever,
  onUpdateState,
  onLogEvent
}) => {
  const { macro, taxes, enterprises } = state;
  const debtToGdp = (macro.nationalDebt / macro.gdp) * 100;

  const [directPayDebtAmount, setDirectPayDebtAmount] = useState<string>('10.0');

  const glassCard = state.themeMode === 'light'
    ? 'bg-white/80 border-slate-200 text-slate-800 shadow-sm'
    : 'bg-slate-900/60 border-slate-800/80 text-slate-100 shadow-md backdrop-blur-md';

  const innerCard = state.themeMode === 'light'
    ? 'bg-slate-50 border-slate-200'
    : 'bg-slate-950/50 border-slate-800/60';

  // Quarterly calculations
  const quarterlyGdp = macro.gdp / 4;
  const incomeYield = quarterlyGdp * 0.36 * (taxes.income / 100);
  const corporateYield = quarterlyGdp * 0.22 * (taxes.corporate / 100);
  const vatYield = quarterlyGdp * 0.26 * ((taxes.vat || 19) / 100);
  const fuelYield = quarterlyGdp * 0.06 * ((taxes.fuel || 25) / 100);
  const inheritanceYield = quarterlyGdp * 0.04 * ((taxes.inheritance || 10) / 100);
  const totalTaxYield = incomeYield + corporateYield + vatYield + fuelYield + inheritanceYield;

  const handleTaxChange = (key: keyof TaxRates, val: number) => {
    sound.playClick();
    onUpdateTaxes({
      ...taxes,
      [key]: val
    });
  };

  const handleDebtRepayQuarterlyChange = (val: number) => {
    sound.playClick();
    onUpdateState(prev => ({
      ...prev,
      macro: {
        ...prev.macro,
        debtRepayQuarterly: val
      }
    }));
  };

  const handleDirectDebtRepay = () => {
    const amount = parseFloat(directPayDebtAmount);
    if (isNaN(amount) || amount <= 0) return;

    if (macro.treasury < amount) {
      alert('Unzureichende Mittel in der Staatskasse.');
      return;
    }

    sound.playCoin();
    const repayVal = Math.min(macro.nationalDebt, amount);

    onUpdateState(prev => ({
      ...prev,
      macro: {
        ...prev.macro,
        treasury: Number((prev.macro.treasury - repayVal).toFixed(2)),
        nationalDebt: Number((prev.macro.nationalDebt - repayVal).toFixed(2))
      }
    }));

    onLogEvent(`SCHULDENTILGUNG: ${state.currencySymbol}${repayVal.toFixed(1)} Mrd. Staatsschulden sofort getilgt!`, 'positive');
  };

  return (
    <div className="w-full h-full overflow-y-auto space-y-6 pb-12 select-none">
      
      {/* Banner / Header */}
      <div className={`p-6 rounded-2xl border ${glassCard} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400 font-semibold font-mono">
            <Landmark className="w-4 h-4" />
            <span>Bundesfinanzministerium & Staatskasse</span>
          </div>
          <h2 className="text-2xl font-black font-['Cinzel'] tracking-wide mt-1">
            Staatsfinanzen, Steuern & Schuldenverwaltung
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Verwalten Sie Staatseinnahmen, justieren Sie Einkommen-, Unternehmens-, Mehrwert-, Mineralöl- und Erbschaftsteuern, bestimmen Sie die frei wählbare Schuldentilgung und kontrollieren Sie strategische Versorgungsmonopole.
          </p>
        </div>

        <div className={`p-3 rounded-xl border ${innerCard} font-mono text-xs flex items-center gap-4`}>
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Staatsbonität</span>
            <span className={`text-base font-bold ${
              macro.creditRating === 'AAA' ? 'text-emerald-400' :
              macro.creditRating === 'AA' || macro.creditRating === 'A' ? 'text-sky-400' :
              macro.creditRating === 'BBB' || macro.creditRating === 'BB' ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {macro.creditRating} NOTE
            </span>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <span className="text-[10px] text-slate-400 uppercase block">Schuldenquote</span>
            <span className={`text-base font-bold tabular-nums ${debtToGdp > 100 ? 'text-rose-400' : 'text-slate-200'}`}>
              {debtToGdp.toFixed(1)}% BIP
            </span>
          </div>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div className={`p-4 rounded-xl border ${innerCard} space-y-1`}>
          <span className="text-slate-400 text-[11px] block">Bruttoinlandsprodukt (BIP)</span>
          <span className="text-lg font-bold text-white tabular-nums">
            {state.currencySymbol}{macro.gdp.toLocaleString()} Mrd.
          </span>
          <span className={`text-[11px] flex items-center gap-1 font-semibold ${macro.gdpGrowthRate >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {macro.gdpGrowthRate >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {macro.gdpGrowthRate > 0 ? `+${macro.gdpGrowthRate}%` : `${macro.gdpGrowthRate}%`} p.a.
          </span>
        </div>

        <div className={`p-4 rounded-xl border ${innerCard} space-y-1`}>
          <span className="text-slate-400 text-[11px] block">Inflationsrate (VPI)</span>
          <span className={`text-lg font-bold tabular-nums ${macro.inflationRate > 5 ? 'text-rose-400' : 'text-slate-200'}`}>
            {macro.inflationRate.toFixed(1)}%
          </span>
          <span className="text-[11px] text-slate-400">
            Zielkorridor: 2,0% - 3,0%
          </span>
        </div>

        <div className={`p-4 rounded-xl border ${innerCard} space-y-1`}>
          <span className="text-slate-400 text-[11px] block">Staatsverschuldung</span>
          <span className="text-lg font-bold text-slate-200 tabular-nums">
            {state.currencySymbol}{macro.nationalDebt.toLocaleString()} Mrd.
          </span>
          <span className="text-[11px] text-slate-400">
            Kasse: <strong className="text-emerald-400">{state.currencySymbol}{macro.treasury.toFixed(1)} Mrd.</strong>
          </span>
        </div>

        <div className={`p-4 rounded-xl border ${innerCard} space-y-1`}>
          <span className="text-slate-400 text-[11px] block">Arbeitslosenquote</span>
          <span className={`text-lg font-bold tabular-nums ${macro.unemploymentRate > 7 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {macro.unemploymentRate.toFixed(1)}%
          </span>
          <span className="text-[11px] text-slate-400">
            Binnennachfrage: {macro.domesticDemand}/100
          </span>
        </div>
      </div>

      {/* Schuldentilgung & Schuldenmanagement (Frei einstellbar!) */}
      <div className={`p-6 rounded-2xl border ${glassCard} space-y-4`}>
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" />
              <span>Frei justierbare Schuldentilgung & Zinsdienst</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 mt-0.5">
              Nationale Schuldenbremse & Rückzahlungsstrategie
            </h3>
          </div>
          <div className="text-right font-mono text-xs">
            <span className="text-slate-400 block">Jährliche Zinslast:</span>
            <span className="text-rose-400 font-bold">
              ~{state.currencySymbol}{((macro.nationalDebt * (macro.interestRate / 100))).toFixed(1)} Mrd./Jahr
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Slider for regular quarterly repayment */}
          <div className={`p-4 rounded-xl border ${innerCard} space-y-3`}>
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300 font-semibold">Reguläre Tilgung pro Quartal:</span>
              <span className="text-emerald-400 font-bold text-sm">
                {state.currencySymbol}{(macro.debtRepayQuarterly || 0).toFixed(1)} Mrd./Q
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={macro.debtRepayQuarterly || 0}
              onChange={(e) => handleDebtRepayQuarterlyChange(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 (Keine Tilgung)</span>
              <span>25 Mrd./Q</span>
              <span>50 Mrd./Q (Aggressiv)</span>
            </div>
          </div>

          {/* Direct One-Off Debt Payoff */}
          <div className={`p-4 rounded-xl border ${innerCard} space-y-3`}>
            <span className="text-xs text-slate-300 font-semibold block">Einmalige Sofort-Sondertilgung:</span>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2 text-xs font-mono text-slate-400">{state.currencySymbol}</span>
                <input
                  type="number"
                  step="5"
                  min="1"
                  max={macro.treasury}
                  value={directPayDebtAmount}
                  onChange={(e) => setDirectPayDebtAmount(e.target.value)}
                  className="w-full pl-8 pr-12 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
                <span className="absolute right-3 top-2 text-xs font-mono text-slate-400">Mrd.</span>
              </div>
              <button
                onClick={handleDirectDebtRepay}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                Jetzt tilgen
              </button>
            </div>
            <span className="text-[10px] text-slate-400 block font-mono">
              Verfügbare Staatskasse: {state.currencySymbol}{macro.treasury.toFixed(1)} Mrd.
            </span>
          </div>
        </div>
      </div>

      {/* Steuertarife: Einkommen, Unternehmen, Mehrwert, Mineralöl, Erbschaft */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 5 Key Taxes */}
        <div className={`lg:col-span-7 p-6 rounded-2xl border ${glassCard} space-y-4`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-amber-400" />
                <span>Differenzierte Steuertarife</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Balancieren Sie Steuereinnahmen gegen private Investitionen und Kaufkraft der Bürger.
              </p>
            </div>
            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-400 block uppercase">Geschätztes Steueraufkommen</span>
              <span className="text-emerald-400 font-bold text-sm tabular-nums">
                {state.currencySymbol}{totalTaxYield.toFixed(1)} Mrd./Q
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Einkommensteuer */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-300 font-medium">Einkommensteuer:</span>
                <span className="text-amber-400 font-bold tabular-nums">{taxes.income}% ({state.currencySymbol}{incomeYield.toFixed(1)} Mrd./Q)</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                value={taxes.income}
                onChange={(e) => handleTaxChange('income', Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Beeinflusst die Bürgerbeliebtheit und private Konsumausgaben.</span>
            </div>

            {/* Unternehmenssteuer */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-300 font-medium">Unternehmens- & Körperschaftsteuer:</span>
                <span className="text-amber-400 font-bold tabular-nums">{taxes.corporate}% ({state.currencySymbol}{corporateYield.toFixed(1)} Mrd./Q)</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={taxes.corporate}
                onChange={(e) => handleTaxChange('corporate', Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Hohe Unternehmenssteuern generieren Einnahmen, dämpfen aber Investitionen.</span>
            </div>

            {/* Mehrwertsteuer (VAT) */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-300 font-medium">Mehrwertsteuer (MwSt.):</span>
                <span className="text-amber-400 font-bold tabular-nums">{taxes.vat || 19}% ({state.currencySymbol}{vatYield.toFixed(1)} Mrd./Q)</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={taxes.vat || 19}
                onChange={(e) => handleTaxChange('vat', Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Verbrauchsteuer auf alle inländischen Waren und Dienstleistungen.</span>
            </div>

            {/* Mineralölsteuer */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-300 font-medium">Mineralöl- & Energiesteuer:</span>
                <span className="text-amber-400 font-bold tabular-nums">{taxes.fuel || 25}% ({state.currencySymbol}{fuelYield.toFixed(1)} Mrd./Q)</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={taxes.fuel || 25}
                onChange={(e) => handleTaxChange('fuel', Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Besteuert fossile Kraftstoffe und Energieverbrauch. Fördert Dekarbonisierung.</span>
            </div>

            {/* Erbschaftsteuer */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-300 font-medium">Erbschaft- & Vermögensübergangssteuer:</span>
                <span className="text-amber-400 font-bold tabular-nums">{taxes.inheritance || 10}% ({state.currencySymbol}{inheritanceYield.toFixed(1)} Mrd./Q)</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={taxes.inheritance || 10}
                onChange={(e) => handleTaxChange('inheritance', Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Besteuert große Vermögensübertragungen; verringert soziale Ungleichheit.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Leitzins & Notfallhebel */}
        <div className={`lg:col-span-5 space-y-6`}>
          
          {/* Zentralbank-Leitzins */}
          <div className={`p-6 rounded-2xl border ${glassCard} space-y-4`}>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-400" />
                <span>Zentralbank-Leitzins</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Anheben, um Inflation zu bekämpfen; senken, um Kreditaufnahme und Investitionen anzukurbeln.
              </p>
            </div>

            <div className="space-y-2 font-mono">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Leitzins-Niveau:</span>
                <span className="text-sky-400 font-bold tabular-nums">{macro.interestRate.toFixed(2)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="16.0"
                step="0.25"
                value={macro.interestRate}
                onChange={(e) => {
                  sound.playClick();
                  onUpdateInterestRate(Number(e.target.value));
                }}
                className="w-full accent-sky-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0.5% (Expansiv)</span>
                <span>4.0% (Neutral)</span>
                <span>16.0% (Restriktiv)</span>
              </div>
            </div>
          </div>

          {/* Makroökonomische Notfallhebel */}
          <div className={`p-6 rounded-2xl border ${glassCard} space-y-3 text-xs`}>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Makroökonomische Notfallhebel</span>
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => onExecuteEconomicLever('quant_easing')}
                className={`w-full py-2 px-3 rounded-lg border text-left transition-colors flex items-center justify-between ${innerCard}`}
              >
                <div>
                  <div className="font-semibold text-slate-200">Quantitative Lockerung (Geldschöpfung)</div>
                  <div className="text-[10px] text-slate-400">+{state.currencySymbol}{Math.round(macro.gdp * 0.02)} Mrd. Kasse · +1.2% Inflation</div>
                </div>
                <span className="font-mono text-emerald-400 font-bold">+Liquidität</span>
              </button>

              <button
                onClick={() => onExecuteEconomicLever('austerity')}
                className={`w-full py-2 px-3 rounded-lg border text-left transition-colors flex items-center justify-between ${innerCard}`}
              >
                <div>
                  <div className="font-semibold text-slate-200">Strikter Sparkurs (Austerität)</div>
                  <div className="text-[10px] text-slate-400">-15 Mrd. Ausgaben · -4% Beliebtheit</div>
                </div>
                <span className="font-mono text-sky-400 font-bold">Sparen</span>
              </button>

              <button
                onClick={() => onExecuteEconomicLever('capital_controls')}
                className={`w-full py-2 px-3 rounded-lg border text-left transition-colors flex items-center justify-between ${innerCard}`}
              >
                <div>
                  <div className="font-semibold text-slate-200">Kapitalverkehrskontrollen verhängen</div>
                  <div className="text-[10px] text-slate-400">Stoppt Kapitalflucht · -1 Stufe Bonität</div>
                </div>
                <span className="font-mono text-amber-400 font-bold">Kontrolle</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Versorgungsbetriebe & Strategische Monopole */}
      <div className={`p-6 rounded-2xl border ${glassCard} space-y-4`}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-400" />
              <span>Strategische Konzerne, Versorgungsbetriebe & Kritische Infrastruktur</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Verwalten Sie staatliche Monopole für Wasser, Stromnetze, Pipelines und Telekommunikation. Privatisieren oder verstaatlichen Sie Schlüsselbetriebe.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enterprises.map((ent) => (
            <div key={ent.id} className={`p-4 rounded-xl border ${innerCard} space-y-2`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-200">{ent.name}</div>
                  <div className="text-[11px] text-slate-400">{ent.sector}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  ent.ownership === 'state_owned' ? 'bg-sky-500/20 text-sky-400' :
                  ent.ownership === 'joint_venture' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  {ent.ownership === 'state_owned' ? '100% Staatsbetrieb' :
                   ent.ownership === 'joint_venture' ? 'Öffentlich-Private Partnerschaft' : 'Vollständig privatisiert'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono my-2">
                <div>
                  <span className="text-[10px] text-slate-500 block">Quartalsgewinn für Kasse</span>
                  <span className="text-emerald-400 font-bold">+{state.currencySymbol}{ent.quarterlyProfit} Mrd.</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Versorgungseffizienz</span>
                  <span className="text-slate-200 font-bold">{ent.publicServiceEfficiency}%</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end gap-2 text-xs">
                {ent.ownership !== 'state_owned' && (
                  <button
                    onClick={() => onUpdateEnterprise(ent.id, 'state_owned')}
                    className="px-2.5 py-1 rounded bg-sky-600/20 text-sky-300 hover:bg-sky-600/30 border border-sky-500/30 text-[11px] font-semibold"
                  >
                    Voll verstaatlichen
                  </button>
                )}
                {ent.ownership !== 'joint_venture' && (
                  <button
                    onClick={() => onUpdateEnterprise(ent.id, 'joint_venture')}
                    className="px-2.5 py-1 rounded bg-amber-600/20 text-amber-300 hover:bg-amber-600/30 border border-amber-500/30 text-[11px] font-semibold"
                  >
                    Als PPP führen
                  </button>
                )}
                {ent.ownership !== 'privatized' && (
                  <button
                    onClick={() => onUpdateEnterprise(ent.id, 'privatized')}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold"
                  >
                    Privatisieren
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
