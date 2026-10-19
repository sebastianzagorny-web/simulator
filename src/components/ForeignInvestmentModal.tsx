import React, { useState } from 'react';
import { GameState, ForeignInvestment } from '../types/game';
import { RealCountryData, getCountryTop15Companies, ForeignCompany } from '../data/realWorldMapData';
import { sound } from '../utils/sound';
import {
  TrendingUp,
  Building,
  Landmark,
  Coins,
  ShieldCheck,
  Briefcase,
  EyeOff,
  DollarSign,
  X,
  Crown,
  Percent,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  RotateCcw
} from 'lucide-react';

interface ForeignInvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetCountry: RealCountryData;
  state: GameState;
  onUpdateState: (updater: (prev: GameState) => GameState) => void;
  onLogEvent: (text: string, type: 'positive' | 'warning' | 'negative' | 'neutral') => void;
}

type InvestorSource = 'state' | 'president_private' | 'offshore';

export const ForeignInvestmentModal: React.FC<ForeignInvestmentModalProps> = ({
  isOpen,
  onClose,
  targetCountry,
  state,
  onUpdateState,
  onLogEvent
}) => {
  if (!isOpen) return null;

  const [activeInvestor, setActiveInvestor] = useState<InvestorSource>('state');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [customInvestAmount, setCustomInvestAmount] = useState<number>(5.0);

  // 15 largest corporations
  const top15Companies = getCountryTop15Companies(targetCountry.id, targetCountry.name, targetCountry.gdpBillions);

  // Balances
  const treasuryBalance = state.macro.treasury;
  const privateWealth = state.ruler.slushFund || 0;
  const offshoreWealth = state.ruler.secretSlushFund || 0;

  const getAvailableBalance = (source: InvestorSource) => {
    if (source === 'state') return treasuryBalance;
    if (source === 'president_private') return privateWealth;
    return offshoreWealth;
  };

  const currentAvailable = getAvailableBalance(activeInvestor);

  // Active investments for this country
  const countryInvestments = (state.foreignInvestments || []).filter(
    i => i.countryId === targetCountry.id
  );

  // Helper to get total owned shares for a company
  const getInvestmentsForCompany = (compName: string) => {
    return countryInvestments.filter(i => i.entityName === compName);
  };

  // 1. Invest in Company
  const handleInvest = (company: ForeignCompany, amountMrd: number) => {
    if (amountMrd <= 0) {
      onLogEvent('Investitionsbetrag muss größer als 0 sein.', 'warning');
      return;
    }

    if (currentAvailable < amountMrd) {
      const sourceName =
        activeInvestor === 'state'
          ? 'Staatskasse'
          : activeInvestor === 'president_private'
          ? 'Präsidenten-Privatvermögen'
          : 'Geheime Offshore-Konten';
      onLogEvent(`Guthaben (${sourceName}: $${currentAvailable.toFixed(2)} Mrd.) unzureichend für $${amountMrd} Mrd. Investition!`, 'negative');
      sound.playCrisis();
      return;
    }

    sound.playCoins();
    const sharesAcquired = Number(((amountMrd / company.marketCapBillions) * 100).toFixed(2));
    const isFullTakeover = sharesAcquired >= 99.5;

    const newInvestment: ForeignInvestment = {
      id: `inv-${targetCountry.id}-${company.id}-${activeInvestor}-${Date.now()}`,
      countryId: targetCountry.id,
      countryName: targetCountry.name,
      type: 'top10_company',
      investorSource: activeInvestor,
      entityName: company.name,
      sector: company.sector,
      investedMrd: amountMrd,
      sharesPercent: Math.min(100, sharesAcquired),
      quarterlyReturnPercent: company.returnRatePercent,
      lastProfitQuarterMrd: Number(((amountMrd * company.returnRatePercent) / 100).toFixed(3)),
      isWhollyOwned: isFullTakeover
    };

    onUpdateState(prev => {
      let updatedMacro = { ...prev.macro };
      let updatedRuler = { ...prev.ruler };

      if (activeInvestor === 'state') {
        updatedMacro.treasury = Math.max(0, updatedMacro.treasury - amountMrd);
      } else if (activeInvestor === 'president_private') {
        updatedRuler.slushFund = Math.max(0, updatedRuler.slushFund - amountMrd);
      } else {
        updatedRuler.secretSlushFund = Math.max(0, updatedRuler.secretSlushFund - amountMrd);
      }

      return {
        ...prev,
        macro: updatedMacro,
        ruler: updatedRuler,
        foreignInvestments: [...(prev.foreignInvestments || []), newInvestment]
      };
    });

    const investorLabel =
      activeInvestor === 'state'
        ? 'als Staat (Staatskasse)'
        : activeInvestor === 'president_private'
        ? 'als Präsident (Privatvermögen)'
        : 'über geheime Offshore-Konten';

    onLogEvent(
      `Investition getätigt: $${amountMrd} Mrd. in "${company.name}" (${targetCountry.name}) ${investorLabel} angelegt (${sharesAcquired}% Anteile).`,
      'positive'
    );
  };

  // 2. Full Takeover (100% M&A Acquisition)
  const handleFullTakeover = (company: ForeignCompany) => {
    const existing = getInvestmentsForCompany(company.name);
    const existingInvested = existing.reduce((sum, i) => sum + i.investedMrd, 0);
    const neededForTakeover = Math.max(1, Number((company.marketCapBillions - existingInvested).toFixed(2)));

    if (currentAvailable < neededForTakeover) {
      onLogEvent(
        `Zur 100%-Übernahme von ${company.name} werden $${neededForTakeover} Mrd. benötigt (Verfügbar: $${currentAvailable.toFixed(2)} Mrd.).`,
        'negative'
      );
      sound.playCrisis();
      return;
    }

    sound.playTriumph();

    // Remove existing partial and replace with 100% takeover
    const newTakeover: ForeignInvestment = {
      id: `takeover-${targetCountry.id}-${company.id}-${activeInvestor}-${Date.now()}`,
      countryId: targetCountry.id,
      countryName: targetCountry.name,
      type: 'top10_company',
      investorSource: activeInvestor,
      entityName: company.name,
      sector: company.sector,
      investedMrd: company.marketCapBillions,
      sharesPercent: 100,
      quarterlyReturnPercent: company.returnRatePercent * 1.25, // Bonus for full control
      lastProfitQuarterMrd: Number(((company.marketCapBillions * company.returnRatePercent * 1.25) / 100).toFixed(3)),
      isWhollyOwned: true
    };

    onUpdateState(prev => {
      let updatedMacro = { ...prev.macro };
      let updatedRuler = { ...prev.ruler };

      if (activeInvestor === 'state') {
        updatedMacro.treasury = Math.max(0, updatedMacro.treasury - neededForTakeover);
      } else if (activeInvestor === 'president_private') {
        updatedRuler.slushFund = Math.max(0, updatedRuler.slushFund - neededForTakeover);
      } else {
        updatedRuler.secretSlushFund = Math.max(0, updatedRuler.secretSlushFund - neededForTakeover);
      }

      const filtered = (prev.foreignInvestments || []).filter(
        i => !(i.countryId === targetCountry.id && i.entityName === company.name)
      );

      return {
        ...prev,
        macro: updatedMacro,
        ruler: updatedRuler,
        foreignInvestments: [...filtered, newTakeover]
      };
    });

    onLogEvent(
      `FEINDLICHE ÜBERNAHME ERFOLGREICH: ${company.name} (${targetCountry.name}) zu 100% erworben! Der Konzern ist nun vollständiges Eigentum.`,
      'positive'
    );
  };

  // 3. Sell Investment
  const handleSellInvestment = (inv: ForeignInvestment) => {
    sound.playCoins();
    const returnGain = Number((inv.investedMrd * 1.08).toFixed(2)); // +8% profit on exit

    onUpdateState(prev => {
      let updatedMacro = { ...prev.macro };
      let updatedRuler = { ...prev.ruler };

      if (inv.investorSource === 'president_private') {
        updatedRuler.slushFund = Number((updatedRuler.slushFund + returnGain).toFixed(2));
      } else if (inv.investorSource === 'offshore') {
        updatedRuler.secretSlushFund = Number((updatedRuler.secretSlushFund + returnGain).toFixed(2));
      } else {
        updatedMacro.treasury = Number((updatedMacro.treasury + returnGain).toFixed(2));
      }

      return {
        ...prev,
        macro: updatedMacro,
        ruler: updatedRuler,
        foreignInvestments: (prev.foreignInvestments || []).filter(i => i.id !== inv.id)
      };
    });

    onLogEvent(
      `Beteiligung an ${inv.entityName} liquidiert: $${returnGain} Mrd. (+8% Veräußerungsgewinn) zurückgebucht.`,
      'positive'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl h-[92vh] flex flex-col rounded-2xl bg-slate-950 border border-amber-500/30 shadow-2xl shadow-amber-950/50 overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-950 border-b border-amber-900/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-wide font-['Cinzel']">
                  Strategische Auslandsinvestitionen & Konzerne
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {targetCountry.name} (Top 15 Konzerne)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Direktinvestitionen als Staat, privates Präsidentenvermögen oder verdeckte Offshore-Strukturen
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

        {/* Investor Account Selector Ribbon */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 shrink-0">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
            Wählen Sie das Investitionskonto / die Kapitalquelle:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
            
            {/* Account 1: Staat (Staatskasse) */}
            <button
              onClick={() => {
                setActiveInvestor('state');
                sound.playClick();
              }}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                activeInvestor === 'state'
                  ? 'bg-amber-500/15 border-amber-400 text-white shadow-md shadow-amber-950/40'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold">
                  <Landmark className="w-4 h-4 text-amber-400" />
                  Staat (Staatskasse)
                </span>
                {activeInvestor === 'state' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
              </div>
              <div className="mt-2">
                <span className="text-xl font-black text-amber-400">
                  ${treasuryBalance.toFixed(1)} Mrd.
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Offizielle Staatseinnahmen & Steuerkasse
                </span>
              </div>
            </button>

            {/* Account 2: Präsident Privatvermögen */}
            <button
              onClick={() => {
                setActiveInvestor('president_private');
                sound.playClick();
              }}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                activeInvestor === 'president_private'
                  ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-md shadow-emerald-950/40'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold">
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  Präsident (Privatvermögen)
                </span>
                {activeInvestor === 'president_private' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <div className="mt-2">
                <span className="text-xl font-black text-emerald-400">
                  ${privateWealth.toFixed(1)} Mrd.
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Familien-Trusts & privates Portfolio
                </span>
              </div>
            </button>

            {/* Account 3: Geheime Offshore-Konten */}
            <button
              onClick={() => {
                setActiveInvestor('offshore');
                sound.playClick();
              }}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                activeInvestor === 'offshore'
                  ? 'bg-purple-500/15 border-purple-400 text-white shadow-md shadow-purple-950/40'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold">
                  <EyeOff className="w-4 h-4 text-purple-400" />
                  Geheime Offshore-Konten
                </span>
                {activeInvestor === 'offshore' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
              </div>
              <div className="mt-2">
                <span className="text-xl font-black text-purple-400">
                  ${offshoreWealth.toFixed(1)} Mrd.
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Nummernkonten & Briefkastengesellschaften
                </span>
              </div>
            </button>

          </div>

          {/* Investment Amount Calculator Bar */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 uppercase text-[10px]">Frei definierbare Summe:</span>
              <div className="relative">
                <DollarSign className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={customInvestAmount}
                  onChange={(e) => setCustomInvestAmount(parseFloat(e.target.value) || 0)}
                  className="pl-7 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-bold w-32 focus:outline-none focus:border-amber-400"
                />
              </div>
              <span className="text-slate-400">Mrd. {state.currencySymbol}</span>
            </div>

            {/* Quick chips */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 5, 10, 25, 50].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setCustomInvestAmount(amt)}
                  className={`px-2 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                    customInvestAmount === amt
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  +{amt} Mrd.
                </button>
              ))}
              <button
                onClick={() => setCustomInvestAmount(Number(currentAvailable.toFixed(1)))}
                className="px-2.5 py-1 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold border border-amber-500/40"
              >
                Max ({currentAvailable.toFixed(1)})
              </button>
            </div>
          </div>
        </div>

        {/* 15 Largest Corporations Catalog */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span className="font-bold uppercase tracking-wider text-amber-400">
              Die 15 marktbeherrschenden Großkonzerne von {targetCountry.name}
            </span>
            <span>Börsenwert kumuliert: ${top15Companies.reduce((s, c) => s + c.marketCapBillions, 0)} Mrd.</span>
          </div>

          <div className="space-y-3">
            {top15Companies.map((comp, idx) => {
              const investmentsInThis = getInvestmentsForCompany(comp.name);
              const totalInvested = investmentsInThis.reduce((s, i) => s + i.investedMrd, 0);
              const totalShares = investmentsInThis.reduce((s, i) => s + i.sharesPercent, 0);
              const isWhollyOwned = totalShares >= 99.5 || investmentsInThis.some(i => i.isWhollyOwned);

              const sharesForCustom = Number(((customInvestAmount / comp.marketCapBillions) * 100).toFixed(2));
              const projectedProfit = Number(((customInvestAmount * comp.returnRatePercent) / 100).toFixed(3));

              return (
                <div
                  key={comp.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isWhollyOwned
                      ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-400/80 shadow-lg shadow-amber-950/40'
                      : totalInvested > 0
                      ? 'bg-slate-900/90 border-slate-700'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top Bar: Name, Sector, Market Cap, Return */}
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <span className="font-mono text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 font-bold">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white">{comp.name}</h4>
                          {isWhollyOwned && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-slate-950 shadow-sm animate-pulse">
                              <Crown className="w-3 h-3" />
                              100% VOLLSTÄNDIGE ÜBERNAHME
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-amber-300 font-mono block mt-0.5">
                          {comp.sector}
                        </span>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="flex items-baseline gap-2 justify-end">
                        <span className="text-xs text-slate-400">Marktwert:</span>
                        <span className="text-sm font-black text-emerald-400">${comp.marketCapBillions} Mrd.</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="text-emerald-400 font-semibold">+{comp.returnRatePercent}% / Q</span>
                        <span>·</span>
                        <span>{comp.dividendYield}% Dividende p.a.</span>
                      </div>
                    </div>
                  </div>

                  {/* Company Description */}
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {comp.description}
                  </p>

                  {/* Already Held Holdings Breakdown */}
                  {investmentsInThis.length > 0 && (
                    <div className="mt-3 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 font-mono text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-bold uppercase text-amber-400">Bestehende Beteiligungen:</span>
                        <span className="text-white font-bold">Gesamt: {totalShares.toFixed(2)}% (${totalInvested} Mrd.)</span>
                      </div>

                      {investmentsInThis.map(inv => {
                        const srcLabel =
                          inv.investorSource === 'president_private'
                            ? '💼 Präsident (Privat)'
                            : inv.investorSource === 'offshore'
                            ? '🕵️ Offshore-Konto'
                            : '🏛️ Staat';

                        return (
                          <div key={inv.id} className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px]">
                            <span className="text-slate-300">
                              {srcLabel} · Investiert: <strong className="text-white">${inv.investedMrd} Mrd.</strong> ({inv.sharesPercent}%) · Gewinn: +${inv.lastProfitQuarterMrd} Mrd./Q
                            </span>
                            <button
                              onClick={() => handleSellInvestment(inv)}
                              className="px-2 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[10px] font-bold cursor-pointer"
                              title="Beteiligung mit +8% Veräußerungsgewinn liquidieren"
                            >
                              Verkaufen (+8%)
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Action Bar: Custom Investment + Full Takeover */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                    <div className="text-[11px] text-slate-400">
                      Investition von <strong className="text-white">${customInvestAmount} Mrd.</strong> ergibt ca.{' '}
                      <strong className="text-amber-400">{sharesForCustom}%</strong> Anteile (ca. +${projectedProfit} Mrd./Q Rendite).
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Custom Invest Button */}
                      <button
                        onClick={() => handleInvest(comp, customInvestAmount)}
                        className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>${customInvestAmount} Mrd. investieren</span>
                      </button>

                      {/* Full Takeover (100% Übernahme) */}
                      {!isWhollyOwned && (
                        <button
                          onClick={() => handleFullTakeover(comp)}
                          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-black tracking-wide shadow-md shadow-amber-950/40 transition-all cursor-pointer flex items-center gap-1.5"
                          title="Das gesamte restliche Aktienkapital aufkaufen und den Konzern vollständig übernehmen"
                        >
                          <Crown className="w-3.5 h-3.5" />
                          <span>100% Übernahme</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0 font-mono">
          <div>
            <span>Aktives Konto: <strong className="text-amber-400 uppercase">{activeInvestor}</strong> (Guthaben: ${currentAvailable.toFixed(1)} Mrd.)</span>
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
