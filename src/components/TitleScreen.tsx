import React, { useState } from 'react';
import { PRESET_SCENARIOS, ScenarioPreset } from '../data/erasAndPresets';
import { GamePlayMode } from '../types/game';
import { sound } from '../utils/sound';
import {
  Crown,
  Sparkles,
  Shield,
  Compass,
  Landmark,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  UserCheck,
  Skull
} from 'lucide-react';

interface TitleScreenProps {
  onSelectPreset: (preset: ScenarioPreset, playMode: GamePlayMode) => void;
  onOpenCustomBuilder: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onSelectPreset,
  onOpenCustomBuilder,
  isMuted,
  onToggleMute
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESET_SCENARIOS[0].id);
  const [playMode, setPlayMode] = useState<GamePlayMode>('statesman');

  const currentPreset = PRESET_SCENARIOS.find(p => p.id === selectedPresetId) || PRESET_SCENARIOS[0];

  const handleStartGame = () => {
    sound.playStamp();
    onSelectPreset(currentPreset, playMode);
  };

  // Keyboard shortcut for Enter
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleStartGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPreset, playMode]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col justify-between select-none">
      {/* Hero Visual Backdrop with Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_ruler_palace_1792329792498.jpg"
          alt="Grand Sovereign War Room and Presidential Palace"
          className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
      </div>

      {/* Top Bar with Audio & Crest */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-amber-500/40 p-0.5 overflow-hidden bg-slate-900/80 shadow-md">
            <img
              src="/src/assets/images/state_crest_emblem_1792329792261.jpg"
              alt="Staatswappen"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className="font-['Cinzel'] text-sm tracking-widest text-amber-400 font-bold block uppercase">
              Imperium & Republica
            </span>
            <span className="text-xs text-slate-400">Großstrategie & Geopolitisches Staatshandwerk</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              sound.playClick();
              onToggleMute();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            title="Ton an/aus"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>{isMuted ? 'Stumm' : 'Audio Aktiv'}</span>
          </button>
        </div>
      </header>

      {/* Centerpiece Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Title Lockup & Concept */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold font-mono">
                <Crown className="w-4 h-4" />
                <span>Souveräne Präsidenten- & Staatssimulation</span>
              </div>
              <h1 className="font-['Cinzel'] text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
                GLOBAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500">PRESIDENT</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Übernehmen Sie das supreme Oberkommando über eine moderne oder historische Weltmacht. Balancieren Sie Staatshaushalte, steuern Sie das Kabinett, leiten Sie Wirtschaftsmonopole, befehligen Sie Streitkräfte und entscheiden Sie über Wohlstand und Macht.
              </p>
            </div>

            {/* Game Mode Selection (Ehrlicher Staatsmann vs Schatten-Präsident) */}
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                Wählen Sie Ihren Regierungs- & Spielpfad:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    sound.playClick();
                    setPlayMode('statesman');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    playMode === 'statesman'
                      ? 'border-emerald-500 bg-emerald-500/15 shadow-lg shadow-emerald-500/10'
                      : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
                    <UserCheck className="w-4 h-4" />
                    <span>Ehrlicher Staatsmann</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Demokratische Regierungsführung, nachhaltige Sozialreformen, Rechtsstaatlichkeit und transparente Staatsfinanzen.
                  </p>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    setPlayMode('shadow_president');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    playMode === 'shadow_president'
                      ? 'border-purple-500 bg-purple-500/15 shadow-lg shadow-purple-500/10'
                      : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-400 mb-1">
                    <Skull className="w-4 h-4" />
                    <span>Schatten-Präsident</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Verdeckte Einflussnahme, kriminelle Unterwelt-Organisationen, geheime Offshore-Vermögen und manipulative Staatsaufträge.
                  </p>
                </button>
              </div>
            </div>

            {/* Presets Strip */}
            <div className="space-y-2 pt-1">
              <div className="text-xs font-medium uppercase tracking-wider text-slate-400 font-mono">
                Start-Nation & Epoche wählen
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESET_SCENARIOS.map((preset) => {
                  const isSelected = preset.id === selectedPresetId;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedPresetId(preset.id);
                      }}
                      className={`text-left p-3 rounded-lg border transition-all ${
                        isSelected
                          ? 'border-amber-500/80 bg-amber-500/10 shadow-lg shadow-amber-500/5'
                          : 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
                      }`}
                    >
                      <div className="text-xs font-semibold text-slate-200 truncate">
                        {preset.countryName}
                      </div>
                      <div className="text-[11px] text-slate-400 capitalize">
                        {preset.era === 'antiquity' ? 'Antike' : preset.era === 'cold_war' ? 'Kalter Krieg' : preset.era === 'industrial' ? 'Industriezeitalter' : preset.era === 'near_future' ? 'Nahe Zukunft' : 'Gegenwart'} · {preset.year < 0 ? `${Math.abs(preset.year)} v. Chr.` : `${preset.year} n. Chr.`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Start CTA and Custom Builder */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                onClick={handleStartGame}
                className="px-8 py-3.5 rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-bold text-sm tracking-wider uppercase shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Präsidentschaft Beginnen (Enter)</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onOpenCustomBuilder();
                }}
                className="px-5 py-3.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-medium text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span>Eigene Nation Konfigurieren</span>
              </button>
            </div>
          </div>

          {/* Right Column: Scenario Profile Card */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-2xl backdrop-blur-md space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-400 font-mono">
                  {currentPreset.era.toUpperCase()} · JAHR {currentPreset.year < 0 ? `${Math.abs(currentPreset.year)} V. CHR.` : `${currentPreset.year} N. CHR.`}
                </span>
                <h2 className="text-xl font-bold font-['Cinzel'] text-white mt-1">
                  {currentPreset.countryName}
                </h2>
                <div className="text-xs text-slate-400 italic">
                  "{currentPreset.motto}"
                </div>
              </div>
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-inner"
                style={{ backgroundColor: currentPreset.flagPrimary }}
              >
                <Shield className="w-5 h-5 text-amber-300" />
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentPreset.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs border-t border-b border-slate-800 py-3 font-mono">
              <div>
                <span className="text-slate-400 block text-[11px]">Staatsoberhaupt</span>
                <span className="text-slate-200 font-semibold">{currentPreset.rulerName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Dynastie / Partei</span>
                <span className="text-slate-200 font-semibold">{currentPreset.dynastyName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Regierungsform</span>
                <span className="text-slate-200 font-semibold capitalize">
                  {currentPreset.government.replace('_', ' ')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Start-BIP / Wirtschaftsleistung</span>
                <span className="text-emerald-400 font-semibold tabular-nums">
                  {currentPreset.currencySymbol}{currentPreset.initialGdp.toLocaleString()} Mrd.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-amber-400" />
                <span>Hauptstadt: {currentPreset.capitalCity}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                <span>Währung: {currentPreset.currencyName}</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Control-hint footer */}
      <footer className="relative z-10 px-8 py-3.5 border-t border-slate-900/80 bg-slate-950/80 text-center text-xs font-mono text-slate-400">
        Enter / Leertaste: Starten · Leertaste: Pausieren · 1 / 2 / 3 / 4: Simulations-Geschwindigkeit · N: Quartal vorrücken · M: Ton an/aus
      </footer>
    </div>
  );
};
