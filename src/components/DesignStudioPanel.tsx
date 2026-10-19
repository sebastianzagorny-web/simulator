import React, { useState } from 'react';
import { GameState, FlagDesign, FlagPattern, FlagEmblem, CurrencyConfig, MonetaryStandard } from '../types/game';
import { sound } from '../utils/sound';
import { Flag, DollarSign, Sparkles, Shield, Check, Landmark, Layers, Eye, RefreshCw } from 'lucide-react';

interface DesignStudioPanelProps {
  state: GameState;
  onUpdateFlag: (design: FlagDesign) => void;
  onUpdateCurrency: (currency: CurrencyConfig) => void;
  onLogEvent: (text: string, type: 'positive' | 'warning' | 'negative' | 'neutral') => void;
}

const PRESET_CURRENCIES = [
  { code: 'EUR', name: 'Euro', symbol: '€', standard: 'fiat_floating' as MonetaryStandard, color: '#1e40af' },
  { code: 'USD', name: 'US-Dollar', symbol: '$', standard: 'fiat_floating' as MonetaryStandard, color: '#15803d' },
  { code: 'DEM', name: 'Deutsche Mark', symbol: 'DM', standard: 'partial_gold' as MonetaryStandard, color: '#b45309' },
  { code: 'CHF', name: 'Schweizer Franken', symbol: 'CHF', standard: 'gold_standard' as MonetaryStandard, color: '#dc2626' },
  { code: 'GBP', name: 'Britisches Pfund', symbol: '£', standard: 'fiat_floating' as MonetaryStandard, color: '#4338ca' },
  { code: 'JPY', name: 'Japanischer Yen', symbol: '¥', standard: 'fiat_floating' as MonetaryStandard, color: '#be123c' },
  { code: 'VAL', name: 'Souveräner Thaler', symbol: '𐆖', standard: 'gold_standard' as MonetaryStandard, color: '#ca8a04' }
];

export const DesignStudioPanel: React.FC<DesignStudioPanelProps> = ({
  state,
  onUpdateFlag,
  onUpdateCurrency,
  onLogEvent
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'flag' | 'currency'>('flag');

  // Flag Designer Local State
  const [flag, setFlag] = useState<FlagDesign>(state.flagDesign || {
    pattern: 'tricolor_horizontal',
    primaryColor: '#0f172a',
    secondaryColor: '#dc2626',
    tertiaryColor: '#eab308',
    emblem: 'eagle',
    emblemColor: '#fbbf24',
    emblemPosition: 'center'
  });

  // Currency Designer Local State
  const [currency, setCurrency] = useState<CurrencyConfig>(state.currencyConfig || {
    code: state.currencyName.slice(0, 3).toUpperCase(),
    name: state.currencyName,
    symbol: state.currencySymbol,
    standard: 'fiat_floating',
    goldBackingPercent: 25,
    pegTarget: 'Frei schwebend',
    banknote: {
      denomination: 100,
      colorTint: '#15803d',
      motif: 'monument',
      watermark: true,
      hologramStripe: true,
      securityThread: true,
      seriesYear: state.year
    }
  });

  const handleApplyFlag = () => {
    sound.playStamp();
    onUpdateFlag(flag);
    onLogEvent(`Neue Staatsflagge offiziell proklamiert und an allen Regierungsgebäuden gehisst.`, 'positive');
  };

  const handleApplyCurrency = () => {
    sound.playCoins();
    onUpdateCurrency(currency);
    onLogEvent(`Währungsreform ratifiziert: Die "${currency.name}" (${currency.symbol}) wurde als gesetzliches Zahlungsmittel emittiert.`, 'positive');
  };

  const handleSelectPresetCurrency = (preset: typeof PRESET_CURRENCIES[0]) => {
    sound.playClick();
    setCurrency({
      ...currency,
      code: preset.code,
      name: preset.name,
      symbol: preset.symbol,
      standard: preset.standard,
      banknote: {
        ...currency.banknote,
        colorTint: preset.color
      }
    });
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-950 p-6 space-y-6 text-slate-100 select-none">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400 font-semibold font-mono">
            <Sparkles className="w-4 h-4" />
            <span>Staatliche Hoheitszeichen & Münzprägeanstalt</span>
          </div>
          <h2 className="text-2xl font-bold font-['Cinzel'] text-white mt-1">
            Flaggen- & Währungsdesigner
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Gestalten Sie die Staatsflagge und emittieren Sie eigene Banknoten und Münzen mit Golddeckung und Sicherheitsmerkmalen.
          </p>
        </div>

        {/* Tab Umschalter */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs font-semibold">
          <button
            onClick={() => {
              sound.playClick();
              setActiveSubTab('flag');
            }}
            className={`px-4 py-2 rounded-md transition-all flex items-center gap-1.5 ${
              activeSubTab === 'flag'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Flaggen-Designer</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveSubTab('currency');
            }}
            className={`px-4 py-2 rounded-md transition-all flex items-center gap-1.5 ${
              activeSubTab === 'currency'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Währungsdesigner</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: FLAGGEN-DESIGNER */}
      {activeSubTab === 'flag' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Linke Spalte: Live animierte Flaggenvorschau (5 Spalten) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block font-mono">
                Offizielle Staatsflagge (Live-Vorschau)
              </span>

              {/* Flaggenmast & Wehende Flagge */}
              <div className="relative w-full aspect-[3/2] rounded-lg overflow-hidden shadow-2xl border border-slate-700/80 bg-slate-950 flex items-center justify-center">
                {/* SVG Render der Flagge */}
                <svg viewBox="0 0 300 200" className="w-full h-full">
                  {renderFlagSvg(flag)}
                </svg>

                {/* Stoff-Falten Schattierung (Waving effect) */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-white/10 to-black/35 pointer-events-none mix-blend-overlay" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/15 via-transparent to-black/30 pointer-events-none" />
              </div>

              {/* Flaggen-Metadaten */}
              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 text-xs font-mono space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Muster:</span>
                  <span className="text-slate-200 capitalize">{flag.pattern.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Wappen:</span>
                  <span className="text-amber-400 capitalize">{flag.emblem.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Staatsgebiet:</span>
                  <span className="text-slate-200">{state.countryName}</span>
                </div>
              </div>

              <button
                onClick={handleApplyFlag}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold uppercase tracking-wider text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4 text-slate-950" />
                <span>Staatsflagge Hissen & Ratifizieren</span>
              </button>
            </div>
          </div>

          {/* Rechte Spalte: Gestaltungs-Werkzeuge (7 Spalten) */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5 text-xs">
            
            {/* Muster-Auswahl */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block font-mono">
                1. Grundmuster der Flagge
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'tricolor_horizontal', label: 'Horizontale Trikolore' },
                  { id: 'tricolor_vertical', label: 'Vertikale Trikolore' },
                  { id: 'bicolor_horizontal', label: 'Zweifarbig Horizontal' },
                  { id: 'bicolor_vertical', label: 'Zweifarbig Vertikal' },
                  { id: 'nordic_cross', label: 'Nordisches Kreuz' },
                  { id: 'saltire', label: 'Andreaskreuz (X)' },
                  { id: 'canton', label: 'Kanton (Eckfeld)' },
                  { id: 'solid_emblem', label: 'Einfarbig mit Wappen' }
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      sound.playClick();
                      setFlag({ ...flag, pattern: p.id as FlagPattern });
                    }}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      flag.pattern === p.id
                        ? 'border-amber-400 bg-amber-500/10 text-white font-bold'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Farb-Paletten */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block font-mono">
                2. Hoheitsfarben
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 text-[11px]">Primärfarbe (Oben/Links):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={flag.primaryColor}
                      onChange={(e) => setFlag({ ...flag, primaryColor: e.target.value })}
                      className="w-10 h-8 rounded border border-slate-800 cursor-pointer bg-transparent"
                    />
                    <span className="font-mono text-slate-300 text-xs">{flag.primaryColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 text-[11px]">Sekundärfarbe (Mitte/Kreuz):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={flag.secondaryColor}
                      onChange={(e) => setFlag({ ...flag, secondaryColor: e.target.value })}
                      className="w-10 h-8 rounded border border-slate-800 cursor-pointer bg-transparent"
                    />
                    <span className="font-mono text-slate-300 text-xs">{flag.secondaryColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 text-[11px]">Tertiärfarbe (Unten/Rechts):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={flag.tertiaryColor}
                      onChange={(e) => setFlag({ ...flag, tertiaryColor: e.target.value })}
                      className="w-10 h-8 rounded border border-slate-800 cursor-pointer bg-transparent"
                    />
                    <span className="font-mono text-slate-300 text-xs">{flag.tertiaryColor}</span>
                  </div>
                </div>
              </div>

              {/* Historische Farb-Presets */}
              <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[10px]">
                <span className="text-slate-500">Klassische Paletten:</span>
                {[
                  { name: 'Schwarz-Rot-Gold', c1: '#0f172a', c2: '#dc2626', c3: '#eab308' },
                  { name: 'Blau-Weiß-Rot', c1: '#1d4ed8', c2: '#ffffff', c3: '#dc2626' },
                  { name: 'Königsblau-Gold', c1: '#1e3a8a', c2: '#fbbf24', c3: '#1e3a8a' },
                  { name: 'Kaiser-Purpur', c1: '#581c87', c2: '#fbbf24', c3: '#3b0764' },
                  { name: 'Smaragd-Weiß', c1: '#065f46', c2: '#ffffff', c3: '#047857' }
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sound.playClick();
                      setFlag({
                        ...flag,
                        primaryColor: preset.c1,
                        secondaryColor: preset.c2,
                        tertiaryColor: preset.c3
                      });
                    }}
                    className="px-2 py-0.5 rounded border border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-300"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Heraldik & Wappensymbole */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block font-mono">
                3. Hoheitswappen & Symbolik
              </span>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'eagle', label: 'Reichsadler / Adler' },
                  { id: 'lion', label: 'Königlicher Löwe' },
                  { id: 'crown', label: 'Kaiserkrone' },
                  { id: 'stars_ring', label: 'Sternenkranz' },
                  { id: 'single_star', label: 'Souveränitätsstern' },
                  { id: 'sun', label: 'Strahlende Sonne' },
                  { id: 'laurel', label: 'Lorbeerkranz' },
                  { id: 'cross', label: 'Malteserkreuz' },
                  { id: 'crescent', label: 'Mondsichel & Stern' },
                  { id: 'anchor', label: 'Marine-Anker' },
                  { id: 'sword', label: 'Gekreuzte Schwerter' },
                  { id: 'none', label: 'Kein Wappensymbol' }
                ].map((sym) => (
                  <button
                    key={sym.id}
                    onClick={() => {
                      sound.playClick();
                      setFlag({ ...flag, emblem: sym.id as FlagEmblem });
                    }}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      flag.emblem === sym.id
                        ? 'border-amber-400 bg-amber-500/10 text-white font-bold'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {sym.label}
                  </button>
                ))}
              </div>

              {flag.emblem !== 'none' && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-slate-400 mb-1 text-[11px]">Wappenfarbe:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={flag.emblemColor}
                        onChange={(e) => setFlag({ ...flag, emblemColor: e.target.value })}
                        className="w-10 h-8 rounded border border-slate-800 cursor-pointer bg-transparent"
                      />
                      <span className="font-mono text-slate-300 text-xs">{flag.emblemColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 text-[11px]">Positionierung:</label>
                    <select
                      value={flag.emblemPosition}
                      onChange={(e) => setFlag({ ...flag, emblemPosition: e.target.value as typeof flag.emblemPosition })}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    >
                      <option value="center">Zentriert (Flaggenmitte)</option>
                      <option value="canton">Kanton (Oben Links)</option>
                      <option value="left">Hissseite (Links)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* SUBTAB 2: WÄHRUNGSAUSWAHL & WÄHRUNGSDESIGNER */}
      {activeSubTab === 'currency' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Linke Spalte: Live Banknoten-Vorschau (5 Spalten) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block font-mono">
                Offizielle Banknote (Emission)
              </span>

              {/* Banknoten-Visualisierung */}
              <div 
                className="relative w-full aspect-[2/1] rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700/80 p-4 flex flex-col justify-between"
                style={{ backgroundColor: currency.banknote.colorTint }}
              >
                {/* Guilloche feine Linien Muster Overlay */}
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]" />
                <div className="absolute inset-2 border border-white/30 rounded-lg pointer-events-none" />

                {/* Banknote Kopfzeile */}
                <div className="relative z-10 flex items-start justify-between text-white drop-shadow">
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest block opacity-90">
                      Zentralbank von {state.countryName}
                    </span>
                    <span className="font-['Cinzel'] font-black text-sm tracking-wide">
                      {currency.name.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xl font-black tabular-nums">
                      {currency.banknote.denomination} {currency.symbol}
                    </span>
                  </div>
                </div>

                {/* Banknote Mitte: Zentrales Motiv & Hologramm */}
                <div className="relative z-10 flex items-center justify-between px-2">
                  {/* Hologrammstreifen */}
                  {currency.banknote.hologramStripe && (
                    <div className="w-8 h-20 bg-gradient-to-b from-amber-300 via-sky-300 to-rose-400 opacity-90 rounded border border-white/50 shadow flex items-center justify-center">
                      <Shield className="w-4 h-4 text-slate-950" />
                    </div>
                  )}

                  {/* Motiv Darstellung */}
                  <div className="text-center font-['Cinzel'] text-white drop-shadow flex-1">
                    <Landmark className="w-10 h-10 mx-auto text-white/90 drop-shadow" />
                    <span className="text-[10px] uppercase tracking-wider block mt-1 font-mono">
                      {currency.banknote.motif === 'monument' ? 'Nationales Monument' : 'Souveränes Siegel'}
                    </span>
                  </div>

                  {/* Wasserzeichen */}
                  {currency.banknote.watermark && (
                    <div className="w-14 h-14 rounded-full border border-white/30 bg-white/10 flex items-center justify-center">
                      <span className="font-['Cinzel'] font-bold text-white/40 text-xs">SPQR</span>
                    </div>
                  )}
                </div>

                {/* Banknote Fußzeile: Seriennummer & Unterschrift */}
                <div className="relative z-10 flex items-end justify-between text-white/90 font-mono text-[9px] border-t border-white/20 pt-1.5">
                  <div>
                    <span className="block opacity-80">SERIE {currency.banknote.seriesYear}-A</span>
                    <span className="font-bold">#SN-9482014-CENTRAL</span>
                  </div>

                  <div className="text-right">
                    <span className="italic block font-serif text-[10px]">Präsident d. Zentralbank</span>
                    <span className="opacity-80">Gültiges gesetzliches Zahlungsmittel</span>
                  </div>
                </div>
              </div>

              {/* Währungs-Metadaten */}
              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 text-xs font-mono space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Währungs-Code:</span>
                  <span className="text-slate-200 font-bold">{currency.code}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Monetärer Standard:</span>
                  <span className="text-amber-400 capitalize">{currency.standard.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Golddeckung:</span>
                  <span className="text-emerald-400">{currency.goldBackingPercent}% Gedeckt</span>
                </div>
              </div>

              <button
                onClick={handleApplyCurrency}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold uppercase tracking-wider text-xs shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <DollarSign className="w-4 h-4 text-slate-950" />
                <span>Währung Reformieren & Banknoten Emittieren</span>
              </button>
            </div>
          </div>

          {/* Rechte Spalte: Währungsauswahl & Konfiguration (7 Spalten) */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5 text-xs">
            
            {/* Vordefinierte Währungen */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block font-mono">
                1. Schnellauswahl aus Weltwährungen
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_CURRENCIES.map((preset) => (
                  <button
                    key={preset.code}
                    onClick={() => handleSelectPresetCurrency(preset)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      currency.code === preset.code
                        ? 'border-emerald-400 bg-emerald-500/10 text-white font-bold'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-semibold text-slate-100">{preset.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{preset.code} ({preset.symbol})</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Spezifische Währungsdaten */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block font-mono">
                2. Währungs-Identität & Name
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Währungsname:</label>
                  <input
                    type="text"
                    value={currency.name}
                    onChange={(e) => setCurrency({ ...currency, name: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Symbol:</label>
                  <input
                    type="text"
                    value={currency.symbol}
                    onChange={(e) => setCurrency({ ...currency, symbol: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Währungscode (ISO):</label>
                  <input
                    type="text"
                    value={currency.code}
                    onChange={(e) => setCurrency({ ...currency, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Monetärer Standard & Golddeckung */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block font-mono">
                3. Monetärer Standard & Deckung
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Zentralbank-Standard:</label>
                  <select
                    value={currency.standard}
                    onChange={(e) => setCurrency({ ...currency, standard: e.target.value as MonetaryStandard })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="gold_standard">Klassischer Goldstandard (100% Gedeckt)</option>
                    <option value="partial_gold">Teil-Goldstandard (30-50% Reserve)</option>
                    <option value="fiat_floating">Freie Fiatwährung (Zentralbank-Steuerung)</option>
                    <option value="commodity_basket">Rohstoffkorb (Öl, Getreide, Metalle)</option>
                    <option value="digital_crypto">Staatliche Digitalwährung / CBDC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">
                    Gold- / Reserve-Deckungsgrad: <span className="text-amber-400 font-bold">{currency.goldBackingPercent}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currency.goldBackingPercent}
                    onChange={(e) => setCurrency({ ...currency, goldBackingPercent: Number(e.target.value) })}
                    className="w-full accent-amber-400 cursor-pointer mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Banknoten-Design Parameter */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block font-mono">
                4. Banknoten-Gestaltung & Sicherheitsmerkmale
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Nennwert:</label>
                  <select
                    value={currency.banknote.denomination}
                    onChange={(e) => setCurrency({
                      ...currency,
                      banknote: { ...currency.banknote, denomination: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  >
                    <option value={5}>5 {currency.symbol}</option>
                    <option value={10}>10 {currency.symbol}</option>
                    <option value={20}>20 {currency.symbol}</option>
                    <option value={50}>50 {currency.symbol}</option>
                    <option value={100}>100 {currency.symbol}</option>
                    <option value={200}>200 {currency.symbol}</option>
                    <option value={500}>500 {currency.symbol}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Banknoten-Farbe:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currency.banknote.colorTint}
                      onChange={(e) => setCurrency({
                        ...currency,
                        banknote: { ...currency.banknote, colorTint: e.target.value }
                      })}
                      className="w-10 h-8 rounded border border-slate-800 cursor-pointer bg-transparent"
                    />
                    <span className="font-mono text-slate-300 text-xs">{currency.banknote.colorTint}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Zentrales Motiv:</label>
                  <select
                    value={currency.banknote.motif}
                    onChange={(e) => setCurrency({
                      ...currency,
                      banknote: { ...currency.banknote, motif: e.target.value as typeof currency.banknote.motif }
                    })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="monument">Nationales Monument</option>
                    <option value="coat_of_arms">Kaiserliches Wappen</option>
                    <option value="sovereign_portrait">Porträt des Staatsoberhaupts</option>
                    <option value="science">Wissenschaft & Industrie</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                <button
                  type="button"
                  onClick={() => setCurrency({
                    ...currency,
                    banknote: { ...currency.banknote, hologramStripe: !currency.banknote.hologramStripe }
                  })}
                  className={`p-2 rounded border text-center transition-colors ${
                    currency.banknote.hologramStripe ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold' : 'border-slate-800 bg-slate-950 text-slate-500'
                  }`}
                >
                  Hologrammstreifen: {currency.banknote.hologramStripe ? 'AKTIV' : 'AUS'}
                </button>

                <button
                  type="button"
                  onClick={() => setCurrency({
                    ...currency,
                    banknote: { ...currency.banknote, watermark: !currency.banknote.watermark }
                  })}
                  className={`p-2 rounded border text-center transition-colors ${
                    currency.banknote.watermark ? 'border-sky-400 bg-sky-500/20 text-sky-300 font-bold' : 'border-slate-800 bg-slate-950 text-slate-500'
                  }`}
                >
                  Wasserzeichen: {currency.banknote.watermark ? 'AKTIV' : 'AUS'}
                </button>

                <button
                  type="button"
                  onClick={() => setCurrency({
                    ...currency,
                    banknote: { ...currency.banknote, securityThread: !currency.banknote.securityThread }
                  })}
                  className={`p-2 rounded border text-center transition-colors ${
                    currency.banknote.securityThread ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 font-bold' : 'border-slate-800 bg-slate-950 text-slate-500'
                  }`}
                >
                  Sicherheitsfaden: {currency.banknote.securityThread ? 'AKTIV' : 'AUS'}
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

// SVG Renderer Helper für Flaggen
function renderFlagSvg(flag: FlagDesign) {
  const { pattern, primaryColor, secondaryColor, tertiaryColor, emblem, emblemColor, emblemPosition } = flag;

  const renderPattern = () => {
    switch (pattern) {
      case 'tricolor_horizontal':
        return (
          <>
            <rect width="300" height="66.66" y="0" fill={primaryColor} />
            <rect width="300" height="66.66" y="66.66" fill={secondaryColor} />
            <rect width="300" height="66.66" y="133.33" fill={tertiaryColor} />
          </>
        );
      case 'tricolor_vertical':
        return (
          <>
            <rect width="100" height="200" x="0" fill={primaryColor} />
            <rect width="100" height="200" x="100" fill={secondaryColor} />
            <rect width="100" height="200" x="200" fill={tertiaryColor} />
          </>
        );
      case 'bicolor_horizontal':
        return (
          <>
            <rect width="300" height="100" y="0" fill={primaryColor} />
            <rect width="300" height="100" y="100" fill={secondaryColor} />
          </>
        );
      case 'bicolor_vertical':
        return (
          <>
            <rect width="150" height="200" x="0" fill={primaryColor} />
            <rect width="150" height="200" x="150" fill={secondaryColor} />
          </>
        );
      case 'nordic_cross':
        return (
          <>
            <rect width="300" height="200" fill={primaryColor} />
            {/* White outer cross */}
            <rect width="40" height="200" x="85" fill={tertiaryColor} />
            <rect width="300" height="40" y="80" fill={tertiaryColor} />
            {/* Inner cross */}
            <rect width="20" height="200" x="95" fill={secondaryColor} />
            <rect width="300" height="20" y="90" fill={secondaryColor} />
          </>
        );
      case 'saltire':
        return (
          <>
            <rect width="300" height="200" fill={primaryColor} />
            <line x1="0" y1="0" x2="300" y2="200" stroke={secondaryColor} strokeWidth="35" />
            <line x1="300" y1="0" x2="0" y2="200" stroke={secondaryColor} strokeWidth="35" />
          </>
        );
      case 'canton':
        return (
          <>
            <rect width="300" height="200" fill={primaryColor} />
            <rect width="130" height="100" fill={secondaryColor} />
          </>
        );
      default:
        return <rect width="300" height="200" fill={primaryColor} />;
    }
  };

  const renderEmblem = () => {
    if (emblem === 'none') return null;

    let cx = 150;
    let cy = 100;
    if (emblemPosition === 'canton') {
      cx = 65;
      cy = 50;
    } else if (emblemPosition === 'left') {
      cx = 80;
      cy = 100;
    }

    return (
      <g transform={`translate(${cx}, ${cy}) scale(1.1)`}>
        {emblem === 'eagle' && (
          <path
            d="M 0 -22 L 7 -14 L 18 -18 L 14 -4 L 24 4 L 12 12 L 8 24 L 0 16 L -8 24 L -12 12 L -24 4 L -14 -4 L -18 -18 L -7 -14 Z"
            fill={emblemColor}
            stroke="#000000"
            strokeWidth="1.2"
          />
        )}
        {emblem === 'crown' && (
          <path
            d="M -20 12 L -20 -8 L -10 2 L 0 -14 L 10 2 L 20 -8 L 20 12 Z"
            fill={emblemColor}
            stroke="#000000"
            strokeWidth="1.2"
          />
        )}
        {emblem === 'stars_ring' && (
          <g fill={emblemColor}>
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <circle
                key={deg}
                cx={22 * Math.cos((deg * Math.PI) / 180)}
                cy={22 * Math.sin((deg * Math.PI) / 180)}
                r="3"
              />
            ))}
          </g>
        )}
        {emblem === 'single_star' && (
          <polygon
            points="0,-18 5,-5 19,-5 8,4 12,18 0,9 -12,18 -8,4 -19,-5 -5,-5"
            fill={emblemColor}
          />
        )}
        {emblem === 'sun' && (
          <g fill={emblemColor}>
            <circle r="12" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line
                key={deg}
                x1={14 * Math.cos((deg * Math.PI) / 180)}
                y1={14 * Math.sin((deg * Math.PI) / 180)}
                x2={22 * Math.cos((deg * Math.PI) / 180)}
                y2={22 * Math.sin((deg * Math.PI) / 180)}
                stroke={emblemColor}
                strokeWidth="2.5"
              />
            ))}
          </g>
        )}
        {emblem === 'laurel' && (
          <path
            d="M -16 10 C -22 -10, -5 -22, 0 -22 C 5 -22, 22 -10, 16 10 C 12 18, -12 18, -16 10"
            fill="none"
            stroke={emblemColor}
            strokeWidth="4"
          />
        )}
        {emblem === 'cross' && (
          <path
            d="M -6 -22 L 6 -22 L 6 -6 L 22 -6 L 22 6 L 6 6 L 6 22 L -6 22 L -6 6 L -22 6 L -22 -6 L -6 -6 Z"
            fill={emblemColor}
          />
        )}
        {emblem === 'anchor' && (
          <path
            d="M 0 -18 L 0 16 M -12 8 C -12 18, 12 18, 12 8 M -8 -10 L 8 -10"
            fill="none"
            stroke={emblemColor}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        )}
      </g>
    );
  };

  return (
    <>
      {renderPattern()}
      {renderEmblem()}
    </>
  );
}
