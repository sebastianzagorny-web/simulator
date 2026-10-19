import React, { useState } from 'react';
import { GameState, StockItem, SecWatchCase, DonationRecord } from '../types/game';
import { sound } from '../utils/sound';
import {
  TrendingUp,
  Landmark,
  ShieldAlert,
  HeartHandshake,
  DollarSign,
  AlertOctagon,
  Search,
  CheckCircle2,
  Sliders,
  Sparkles
} from 'lucide-react';

interface StockMarketPanelProps {
  state: GameState;
  onUpdateState: (updater: (prev: GameState) => GameState) => void;
  onLogEvent: (text: string, type: 'positive' | 'warning' | 'negative' | 'neutral') => void;
}

export const StockMarketPanel: React.FC<StockMarketPanelProps> = ({
  state,
  onUpdateState,
  onLogEvent
}) => {
  const [selectedStockId, setSelectedStockId] = useState<string>(state.stocks[0]?.id || '');
  const [tradeSharesAmount, setTradeSharesAmount] = useState<number>(100000);
  const [investorEntity, setInvestorEntity] = useState<'state' | 'president' | 'family'>('state');

  // Donation form state
  const [donSource, setDonSource] = useState<string>('Staatsfonds');
  const [donRecipient, setDonRecipient] = useState<string>('Nationale Krebsforschung');
  const [donAmount, setDonAmount] = useState<number>(10);
  const [donPurpose, setDonPurpose] = useState<string>('Medizinische Spitzenförderung');

  const glassCard = state.themeMode === 'light'
    ? 'bg-white/80 border-slate-200 text-slate-800 shadow-sm'
    : 'bg-slate-900/60 border-slate-800/80 text-slate-100 shadow-md backdrop-blur-md';

  const innerCard = state.themeMode === 'light'
    ? 'bg-slate-50 border-slate-200'
    : 'bg-slate-950/50 border-slate-800/60';

  const selectedStock = state.stocks.find(s => s.id === selectedStockId) || state.stocks[0];

  // Buy shares
  const handleBuyShares = () => {
    if (!selectedStock) return;
    const totalCost = (selectedStock.currentPrice * tradeSharesAmount) / 1e9; // in Mrd

    if (investorEntity === 'state') {
      if (state.macro.treasury < totalCost) {
        alert('Unzureichende Staatskasse für diesen Aktienkauf.');
        return;
      }
      sound.playCoin();
      onUpdateState(prev => ({
        ...prev,
        macro: { ...prev.macro, treasury: Number((prev.macro.treasury - totalCost).toFixed(3)) },
        stocks: prev.stocks.map(s => s.id === selectedStock.id ? { ...s, stateSharesOwned: s.stateSharesOwned + tradeSharesAmount } : s)
      }));
    } else if (investorEntity === 'president') {
      if (state.ruler.slushFund < totalCost) {
        alert('Unzureichendes privates Präsidenten-Guthaben.');
        return;
      }
      sound.playCoin();
      onUpdateState(prev => ({
        ...prev,
        ruler: { ...prev.ruler, slushFund: Number((prev.ruler.slushFund - totalCost).toFixed(3)) },
        stocks: prev.stocks.map(s => s.id === selectedStock.id ? { ...s, presidentSharesOwned: s.presidentSharesOwned + tradeSharesAmount } : s)
      }));
    } else {
      // Family
      sound.playCoin();
      onUpdateState(prev => ({
        ...prev,
        stocks: prev.stocks.map(s => s.id === selectedStock.id ? { ...s, familySharesOwned: s.familySharesOwned + tradeSharesAmount } : s)
      }));
    }

    onLogEvent(`BÖRSENORDER: ${tradeSharesAmount.toLocaleString()} Aktien von „${selectedStock.ticker}“ erworben.`, 'positive');
  };

  // Sell shares
  const handleSellShares = () => {
    if (!selectedStock) return;
    const currentOwned = investorEntity === 'state' ? selectedStock.stateSharesOwned :
                         investorEntity === 'president' ? selectedStock.presidentSharesOwned :
                         selectedStock.familySharesOwned;

    if (currentOwned < tradeSharesAmount) {
      alert('Nicht genügend Aktien im Depot für diese Verkaufsorder.');
      return;
    }

    const proceeds = (selectedStock.currentPrice * tradeSharesAmount) / 1e9; // in Mrd
    sound.playCoin();

    onUpdateState(prev => {
      const updatedStocks = prev.stocks.map(s => {
        if (s.id !== selectedStock.id) return s;
        if (investorEntity === 'state') return { ...s, stateSharesOwned: s.stateSharesOwned - tradeSharesAmount };
        if (investorEntity === 'president') return { ...s, presidentSharesOwned: s.presidentSharesOwned - tradeSharesAmount };
        return { ...s, familySharesOwned: s.familySharesOwned - tradeSharesAmount };
      });

      if (investorEntity === 'state') {
        return { ...prev, macro: { ...prev.macro, treasury: Number((prev.macro.treasury + proceeds).toFixed(3)) }, stocks: updatedStocks };
      } else if (investorEntity === 'president') {
        return { ...prev, ruler: { ...prev.ruler, slushFund: Number((prev.ruler.slushFund + proceeds).toFixed(3)) }, stocks: updatedStocks };
      } else {
        return { ...prev, stocks: updatedStocks };
      }
    });

    onLogEvent(`BÖRSENORDER: ${tradeSharesAmount.toLocaleString()} Aktien von „${selectedStock.ticker}“ veräußert.`, 'neutral');
  };

  // SEC case resolution
  const handleResolveSecCase = (caseId: string, action: 'fine' | 'indict' | 'clear') => {
    sound.playStamp();
    onUpdateState(prev => ({
      ...prev,
      secWatchCases: prev.secWatchCases.map(c => {
        if (c.id !== caseId) return c;
        if (action === 'fine') return { ...c, status: 'Bußgeld verhängt', fineMio: 25.0 };
        if (action === 'indict') return { ...c, status: 'Anklage erhoben' };
        return { ...c, status: 'Freigesprochen' };
      }),
      macro: {
        ...prev.macro,
        treasury: action === 'fine' ? prev.macro.treasury + 0.025 : prev.macro.treasury
      }
    }));
  };

  // Add Donation
  const handleAddDonation = () => {
    if (donAmount <= 0) return;
    sound.playCoin();
    const newDonation: DonationRecord = {
      id: `don_${Date.now()}`,
      dateStr: 'Gerade eben',
      source: donSource,
      recipient: donRecipient,
      amountMio: donAmount,
      purpose: donPurpose
    };

    onUpdateState(prev => ({
      ...prev,
      donations: [newDonation, ...prev.donations],
      macro: donSource === 'Staatsfonds' ? { ...prev.macro, treasury: prev.macro.treasury - (donAmount / 1000) } : prev.macro,
      ruler: donSource === 'Präsident privat' ? { ...prev.ruler, slushFund: prev.ruler.slushFund - (donAmount / 1000), reputation: Math.min(100, prev.ruler.reputation + 2) } : prev.ruler
    }));

    onLogEvent(`SPENDE GEBUCHT: ${donSource} spendete ${state.currencySymbol}${donAmount} Mio. an „${donRecipient}“.`, 'positive');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className={`p-6 rounded-2xl border ${glassCard}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest font-mono">
              <TrendingUp className="w-4 h-4" />
              <span>Kapitalmärkte & Börsenüberwachung</span>
            </div>
            <h2 className="text-2xl font-black font-['Cinzel'] tracking-wide">
              Dynamischer Börsenmarkt, SEC-Aufsicht & Spendenwesen
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Aktienkurse reagieren in Echtzeit auf Zinsbeschlüsse, Inflation, BIP-Wachstum und politische Interventionen. Investieren Sie als Staat, Präsident oder Familie.
            </p>
          </div>
        </div>
      </div>

      {/* Stock Market Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Ticker List */}
        <div className={`lg:col-span-5 p-4 rounded-2xl border ${glassCard} space-y-2`}>
          <div className="text-xs font-bold text-slate-300 px-2 py-1 font-mono uppercase tracking-wider">
            Notierte Wertpapiere ({state.stocks.length})
          </div>

          {state.stocks.map((stock) => {
            const isSelected = stock.id === selectedStock.id;
            const priceDelta = stock.priceHistory.length > 1
              ? stock.currentPrice - stock.priceHistory[stock.priceHistory.length - 2]
              : 0;
            const isUp = priceDelta >= 0;

            return (
              <button
                key={stock.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedStockId(stock.id);
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/10 shadow-sm'
                    : 'border-slate-800 bg-slate-900/40 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400 text-sm">{stock.ticker}</span>
                    <span className="text-xs font-semibold text-slate-200 truncate max-w-[160px]">{stock.name}</span>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-xs font-bold text-slate-100">{state.currencySymbol}{stock.currentPrice.toFixed(2)}</div>
                    <div className={`text-[10px] font-semibold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isUp ? `+${priceDelta.toFixed(2)}` : priceDelta.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 font-mono">
                  <span>KGV: {stock.peRatio}</span>
                  <span>Div: {stock.dividendYield}%</span>
                  <span>Cap: {state.currencySymbol}{stock.marketCapMrd} Mrd.</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Stock Detail & Trading Terminal */}
        <div className={`lg:col-span-7 p-6 rounded-2xl border ${glassCard} space-y-6`}>
          {selectedStock && (
            <>
              <div>
                <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black font-mono text-amber-400">{selectedStock.ticker}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">{selectedStock.sector}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-100 mt-1">{selectedStock.name}</h3>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-2xl font-bold text-emerald-400">
                      {state.currencySymbol}{selectedStock.currentPrice.toFixed(2)}
                    </span>
                    <div className="text-xs text-slate-400">Aktueller Handelskurs</div>
                  </div>
                </div>

                {/* Mini SVG Chart of Price History */}
                <div className={`p-4 rounded-xl border mt-4 ${innerCard}`}>
                  <div className="text-xs font-mono text-slate-400 mb-2">Kursverlauf (Letzte Quartale):</div>
                  <div className="h-28 w-full flex items-end gap-2 pt-2">
                    {selectedStock.priceHistory.map((price, idx) => {
                      const minPrice = Math.min(...selectedStock.priceHistory) * 0.9;
                      const maxPrice = Math.max(...selectedStock.priceHistory) * 1.1;
                      const heightPercent = ((price - minPrice) / (maxPrice - minPrice)) * 100;

                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                          <span className="text-[9px] font-mono text-slate-400">{price.toFixed(0)}</span>
                          <div
                            className="w-full bg-gradient-to-t from-amber-500 to-amber-300 rounded-t transition-all"
                            style={{ height: `${Math.max(10, heightPercent)}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Depots Overview */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs font-mono">
                  <div className={`p-2.5 rounded-lg border ${innerCard}`}>
                    <span className="text-[10px] text-slate-400 block uppercase">Staatsdepot</span>
                    <span className="text-emerald-400 font-bold">{selectedStock.stateSharesOwned.toLocaleString()} Stk.</span>
                  </div>
                  <div className={`p-2.5 rounded-lg border ${innerCard}`}>
                    <span className="text-[10px] text-slate-400 block uppercase">Präsident privat</span>
                    <span className="text-amber-400 font-bold">{selectedStock.presidentSharesOwned.toLocaleString()} Stk.</span>
                  </div>
                  <div className={`p-2.5 rounded-lg border ${innerCard}`}>
                    <span className="text-[10px] text-slate-400 block uppercase">Familiendepot</span>
                    <span className="text-purple-400 font-bold">{selectedStock.familySharesOwned.toLocaleString()} Stk.</span>
                  </div>
                </div>

                {/* Order Execution Terminal */}
                <div className={`p-4 rounded-xl border mt-4 ${innerCard}`}>
                  <div className="text-xs font-bold text-slate-200 mb-2">Handelsauftrag platzieren</div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Handelndes Konto</label>
                      <select
                        value={investorEntity}
                        onChange={(e) => setInvestorEntity(e.target.value as any)}
                        className="w-full px-2 py-1.5 rounded border border-slate-700 bg-slate-900 text-xs text-white focus:outline-none"
                      >
                        <option value="state">Staat (Staatskasse)</option>
                        <option value="president">Präsident (Privatkonto)</option>
                        <option value="family">Familie Hayes</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Stückzahl ({tradeSharesAmount.toLocaleString()})</label>
                      <input
                        type="number"
                        step="50000"
                        min="10000"
                        value={tradeSharesAmount}
                        onChange={(e) => setTradeSharesAmount(parseInt(e.target.value) || 10000)}
                        className="w-full px-2 py-1.5 rounded border border-slate-700 bg-slate-900 text-xs text-white focus:outline-none font-mono"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleBuyShares}
                        className="flex-1 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        Kaufen
                      </button>
                      <button
                        onClick={handleSellShares}
                        className="flex-1 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        Verkaufen
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Börsenaufsicht (SEC / BaFin) & Spendenwesen Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SEC Surveillance */}
        <div className={`lg:col-span-6 p-6 rounded-2xl border ${glassCard}`}>
          <div className="flex items-center gap-2 text-base font-bold text-amber-400 mb-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span>Börsenaufsicht & Marktüberwachung (SEC)</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Automatisierte Aufdeckung von Insidergeschäften, Marktmanipulationen und auffälligen Transaktionen vor Leitzins- oder Verstaatlichungsentscheiden.
          </p>

          <div className="space-y-3">
            {state.secWatchCases.map((c) => (
              <div key={c.id} className={`p-3.5 rounded-xl border ${innerCard}`}>
                <div className="flex items-start justify-between">
                  <div className="text-xs font-bold text-slate-200">{c.subject}</div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                    Verdacht: {c.suspicionScore}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{c.allegation}</p>
                <div className="mt-2 text-xs font-semibold text-slate-300">
                  Status: <strong className="text-amber-400">{c.status}</strong>
                </div>

                {c.status === 'Ermittlung läuft' && (
                  <div className="mt-3 pt-2 border-t border-slate-800 flex gap-2">
                    <button
                      onClick={() => handleResolveSecCase(c.id, 'fine')}
                      className="px-2.5 py-1 rounded bg-amber-600/20 text-amber-300 hover:bg-amber-600/30 text-[10px] font-semibold border border-amber-500/30"
                    >
                      25 Mio. Bußgeld verhängen
                    </button>
                    <button
                      onClick={() => handleResolveSecCase(c.id, 'indict')}
                      className="px-2.5 py-1 rounded bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 text-[10px] font-semibold border border-rose-500/30"
                    >
                      Strafanzeige erheben
                    </button>
                    <button
                      onClick={() => handleResolveSecCase(c.id, 'clear')}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                    >
                      Einstellen
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Donations Registry */}
        <div className={`lg:col-span-6 p-6 rounded-2xl border ${glassCard}`}>
          <div className="flex items-center gap-2 text-base font-bold text-emerald-400 mb-2">
            <HeartHandshake className="w-5 h-5" />
            <span>Spendenregister & Gemeinwohlförderung</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Transparentes Verzeichnis über Spenden von Unternehmen, Unternehmern, Staat und Ministern mit Nachweis über Herkunft und Zweck.
          </p>

          {/* Form to donate */}
          <div className={`p-3.5 rounded-xl border mb-4 ${innerCard}`}>
            <div className="text-xs font-semibold text-slate-200 mb-2">Neue Spende tätigen / erfassen</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-end text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Herkunft</label>
                <select
                  value={donSource}
                  onChange={(e) => setDonSource(e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-700 bg-slate-900 text-white text-xs"
                >
                  <option value="Staatsfonds">Staatsfonds</option>
                  <option value="Präsident privat">Präsident privat</option>
                  <option value="Ministerium des Innern">Ministerium des Innern</option>
                  <option value="Industriekonsortium">Industriekonsortium</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Empfänger</label>
                <input
                  type="text"
                  value={donRecipient}
                  onChange={(e) => setDonRecipient(e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-700 bg-slate-900 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Betrag (Mio.)</label>
                <input
                  type="number"
                  min="1"
                  value={donAmount}
                  onChange={(e) => setDonAmount(parseInt(e.target.value) || 1)}
                  className="w-full px-2 py-1 rounded border border-slate-700 bg-slate-900 text-white text-xs font-mono"
                />
              </div>

              <div>
                <button
                  onClick={handleAddDonation}
                  className="w-full py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Buchen
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto">
            {state.donations.map((d) => (
              <div key={d.id} className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${innerCard}`}>
                <div>
                  <div className="font-semibold text-slate-200">{d.source} → {d.recipient}</div>
                  <div className="text-[11px] text-slate-400">{d.purpose} · <span className="italic">{d.dateStr}</span></div>
                </div>
                <span className="font-mono font-bold text-emerald-400">
                  {state.currencySymbol}{d.amountMio} Mio.
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
