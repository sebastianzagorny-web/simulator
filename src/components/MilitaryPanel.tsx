import React from 'react';
import { GameState, MilitaryBranches, RivalNation } from '../types/game';
import { sound } from '../utils/sound';
import { Shield, Crosshair, Plane, Anchor, Radio, Swords, AlertTriangle, ArrowRight, DollarSign } from 'lucide-react';

interface MilitaryPanelProps {
  state: GameState;
  onUpdateMilitary: (military: MilitaryBranches) => void;
  onRecruitBranch: (branch: keyof MilitaryBranches, cost: number) => void;
  onLaunchCampaign: (targetRivalId: string) => void;
}

export const MilitaryPanel: React.FC<MilitaryPanelProps> = ({
  state,
  onUpdateMilitary,
  onRecruitBranch,
  onLaunchCampaign
}) => {
  const { military, macro, rivals } = state;

  const handleDefconChange = (level: 1 | 2 | 3 | 4 | 5) => {
    sound.playWarDrum();
    onUpdateMilitary({
      ...military,
      readinessDefcon: level
    });
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-950 p-6 space-y-6 text-slate-100 select-none">
      
      {/* Header Banner with War Room Image */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="/src/assets/images/military_command_map_1792329793753.jpg"
            alt="Strategic Command War Room"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-rose-400 font-semibold font-mono">
              <Shield className="w-4 h-4" />
              <span>Bundesministerium der Verteidigung & Generalstab</span>
            </div>
            <h2 className="text-2xl font-bold font-['Cinzel'] text-white mt-1">
              Streitkräfte, Lagezentrum & Rüstungsindustrie
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Befehligen Sie Heeresdivisionen, Flugzeugträgerverbände, das strategische Nuklearpotenzial und globale Rüstungsexporte.
            </p>
          </div>

          {/* DEFCON Selector Ribbon */}
          <div className="flex flex-col items-end gap-1 font-mono">
            <span className="text-[10px] text-slate-400 uppercase">Strategische Alarmstufe</span>
            <div className="flex items-center gap-1 bg-slate-950/90 p-1 rounded-lg border border-slate-800">
              {([5, 4, 3, 2, 1] as const).map((lvl) => {
                const isActive = military.readinessDefcon === lvl;
                return (
                  <button
                    key={lvl}
                    onClick={() => handleDefconChange(lvl)}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? lvl <= 2 ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                        : lvl <= 3 ? 'bg-amber-500 text-slate-950'
                        : 'bg-emerald-600 text-white'
                        : 'text-slate-400 hover:text-white bg-slate-900/50'
                    }`}
                  >
                    DEFCON {lvl}
                  </button>
                );
              })}
            </div>
            <span className="text-[10px] text-slate-400">
              {military.readinessDefcon === 1 ? 'Nuklearkrieg Unmittelbar Bevorstehend' : military.readinessDefcon === 5 ? 'Reguläre Friedensbereitschaft' : 'Erhöhte Gefechtsbereitschaft'}
            </span>
          </div>
        </div>
      </div>

      {/* Force Structure & Procurement Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        
        {/* Infantry */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5 font-sans">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Infanteriedivisionen</span>
              </span>
              <span className="text-lg font-bold text-white tabular-nums">
                {military.infantryDivisions}
              </span>
            </div>
            <p className="text-[11px] font-sans text-slate-400 mt-1">
              Mechanisierte Grenztruppen, Jägerbataillone und Objektschutzkräfte.
            </p>
          </div>
          <button
            onClick={() => onRecruitBranch('infantryDivisions', 15)}
            className="w-full py-2 rounded-lg border border-slate-700 bg-slate-950 hover:border-amber-500/50 hover:bg-amber-500/10 text-amber-300 font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>5 Divisionen rekrutieren ({15} Mrd. {state.currencySymbol})</span>
          </button>
        </div>

        {/* Armor */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5 font-sans">
                <Crosshair className="w-4 h-4 text-emerald-400" />
                <span>Panzerdivisionen</span>
              </span>
              <span className="text-lg font-bold text-white tabular-nums">
                {military.armoredDivisions}
              </span>
            </div>
            <p className="text-[11px] font-sans text-slate-400 mt-1">
              Kampfpanzer, Schützenpanzer und gepanzerte Durchbruchsbrigaden.
            </p>
          </div>
          <button
            onClick={() => onRecruitBranch('armoredDivisions', 25)}
            className="w-full py-2 rounded-lg border border-slate-700 bg-slate-950 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-300 font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>3 Panzerdiv. beschaffen ({25} Mrd. {state.currencySymbol})</span>
          </button>
        </div>

        {/* Air Squadrons */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5 font-sans">
                <Plane className="w-4 h-4 text-sky-400" />
                <span>Kampfgeschwader</span>
              </span>
              <span className="text-lg font-bold text-white tabular-nums">
                {military.fighterSquadrons}
              </span>
            </div>
            <p className="text-[11px] font-sans text-slate-400 mt-1">
              Luftüberlegenheitsjäger, Tarnkappenbomber und Abfangjägerstaffeln.
            </p>
          </div>
          <button
            onClick={() => onRecruitBranch('fighterSquadrons', 30)}
            className="w-full py-2 rounded-lg border border-slate-700 bg-slate-950 hover:border-sky-500/50 hover:bg-sky-500/10 text-sky-300 font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>4 Geschwader rüsten ({30} Mrd. {state.currencySymbol})</span>
          </button>
        </div>

        {/* Naval Fleets */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5 font-sans">
                <Anchor className="w-4 h-4 text-indigo-400" />
                <span>Flottenverbände</span>
              </span>
              <span className="text-lg font-bold text-white tabular-nums">
                {military.navalFleets}
              </span>
            </div>
            <p className="text-[11px] font-sans text-slate-400 mt-1">
              Trägerkampfgruppen, nukleare Angriffs-U-Boote und Lenkwaffenzerstörer.
            </p>
          </div>
          <button
            onClick={() => onRecruitBranch('navalFleets', 45)}
            className="w-full py-2 rounded-lg border border-slate-700 bg-slate-950 hover:border-indigo-500/50 hover:bg-indigo-500/10 text-indigo-300 font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>2 Flotten bauen ({45} Mrd. {state.currencySymbol})</span>
          </button>
        </div>

      </div>

      {/* Strategic Nuclear Deterrent & Arms Industry Export Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        
        {/* Nuclear Deterrent */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3 font-mono">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 font-sans">
              <Radio className="w-4 h-4 text-rose-500" />
              <span>Strategisches Nukleararsenal & Zweitschlagkapazität</span>
            </h3>
            <span className="text-rose-400 font-bold text-base tabular-nums">
              {military.nuclearWarheads} Sprengköpfe
            </span>
          </div>

          <p className="text-[11px] font-sans text-slate-300">
            Ein gewaltiges Nuklearpotenzial schützt das Vaterland vor direkten Invasionen, erfordert jedoch hohe Wartungsausgaben.
          </p>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => onRecruitBranch('nuclearWarheads', 50)}
              className="px-4 py-2 rounded-lg border border-rose-800 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-bold transition-colors cursor-pointer"
            >
              +100 Sprengköpfe anreichern ({50} Mrd. {state.currencySymbol})
            </button>
            <span className="text-slate-400 text-[11px]">
              Abschreckungs-Status: {military.nuclearWarheads > 500 ? 'UNANGREIFBAR' : 'MODERAT'}
            </span>
          </div>
        </div>

        {/* Global Arms Exports & Defense Manufacturing */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3 font-mono">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 font-sans">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Rüstungsindustrie & Globale Waffenexporte</span>
            </h3>
            <span className="text-emerald-400 font-bold text-base tabular-nums">
              +{state.currencySymbol}{military.annualArmsExports} Mrd. / Jahr
            </span>
          </div>

          <p className="text-[11px] font-sans text-slate-300">
            Exportieren Sie Waffensysteme, Kampfflugzeuge und Flugabwehrraketen an befreundete Partnerstaaten weltweit.
          </p>

          <div className="flex items-center gap-2 pt-2 font-sans">
            <button
              onClick={() => {
                sound.playCoins();
                onUpdateMilitary({
                  ...military,
                  annualArmsExports: military.annualArmsExports + 10
                });
              }}
              className="flex-1 py-2 rounded-lg border border-slate-700 bg-slate-950 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-300 font-bold transition-colors cursor-pointer"
            >
              Neuen Rüstungsexportvertrag ratifizieren (+10 Mrd./J.)
            </button>
          </div>
        </div>

      </div>

      {/* Active Geopolitical Conflict Theater & Border Invasion Campaigns */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Swords className="w-4 h-4 text-amber-400" />
              <span>Kriegsführung, Territorialeroberung & Grenzkonflikte</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Führen Sie gezielte Militäroperationen gegen rivalisierende Mächte zur Grenzsicherung und Rohstofferoberung.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rivals.map((rival) => {
            const ourStrength = military.infantryDivisions * 1.2 + military.armoredDivisions * 2.5 + military.fighterSquadrons * 2;
            const enemyStrength = rival.militaryStrength * 2.2;
            const winProbability = Math.round((ourStrength / (ourStrength + enemyStrength)) * 100);

            return (
              <div key={rival.id} className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold font-sans text-slate-100">{rival.name}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    rival.atWar ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {rival.atWar ? 'KRIEG' : 'FRIEDEN'}
                  </span>
                </div>

                <div className="space-y-1 text-[11px] border-t border-slate-800 pt-2">
                  <div className="flex justify-between text-slate-400">
                    <span>Militärstärke des Rivalen:</span>
                    <span className="text-slate-200">{rival.militaryStrength} / 100</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Erwartete Siegchance:</span>
                    <span className={`font-bold ${winProbability > 60 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {winProbability}%
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.playWarDrum();
                    onLaunchCampaign(rival.id);
                  }}
                  className="w-full py-2 rounded-lg bg-rose-700 hover:bg-rose-600 font-bold text-white uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors font-sans shadow cursor-pointer active:scale-95"
                >
                  <Crosshair className="w-4 h-4" />
                  <span>Offensive starten (35 Mrd. {state.currencySymbol})</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
