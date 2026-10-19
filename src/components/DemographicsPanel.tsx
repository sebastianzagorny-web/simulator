import React from 'react';
import { GameState, WelfarePackage } from '../types/game';
import { sound } from '../utils/sound';
import {
  Users,
  Baby,
  HeartPulse,
  GraduationCap,
  Building2,
  TrendingUp,
  Sparkles,
  MapPin,
  Award,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  DollarSign
} from 'lucide-react';

interface DemographicsPanelProps {
  state: GameState;
  onExecuteDemographicPolicy: (policyKey: 'child_support' | 'skilled_migration' | 'social_housing' | 'pension_boost') => void;
  onUpdateState: (updater: (prev: GameState) => GameState) => void;
}

export const DemographicsPanel: React.FC<DemographicsPanelProps> = ({
  state,
  onExecuteDemographicPolicy,
  onUpdateState
}) => {
  const { population, macro, pensionSystem, welfarePackages } = state;

  const glassCard = state.themeMode === 'light'
    ? 'bg-white/80 border-slate-200 text-slate-800 shadow-sm'
    : 'bg-slate-900/60 border-slate-800/80 text-slate-100 shadow-md backdrop-blur-md';

  const innerCard = state.themeMode === 'light'
    ? 'bg-slate-50 border-slate-200'
    : 'bg-slate-950/50 border-slate-800/60';

  const handleToggleWelfare = (packageId: string) => {
    sound.playClick();
    onUpdateState(prev => ({
      ...prev,
      welfarePackages: prev.welfarePackages.map(w =>
        w.id === packageId ? { ...w, active: !w.active } : w
      )
    }));
  };

  const handleUpdatePensionTarget = (newTarget: number) => {
    sound.playClick();
    onUpdateState(prev => ({
      ...prev,
      pensionSystem: {
        ...prev.pensionSystem,
        targetLevelPercent: newTarget
      }
    }));
  };

  return (
    <div className="w-full h-full overflow-y-auto space-y-6 pb-12 select-none">
      
      {/* Header Banner */}
      <div className={`p-6 rounded-2xl border ${glassCard} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-sky-400 font-semibold font-mono">
            <Users className="w-4 h-4" />
            <span>Statistisches Bundesamt & Demografisches Institut</span>
          </div>
          <h2 className="text-2xl font-black font-['Cinzel'] tracking-wide mt-1">
            Bevölkerungszentrum & Sozialsystem
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Überwachen Sie Geburtenrate, Altersstruktur, Beschäftigung, Migration und Lebensstandard. Verwalten Sie automatisch vorgeschlagene Hilfspakete und das gesetzliche Rentenniveau.
          </p>
        </div>

        <div className={`p-3 rounded-xl border ${innerCard} font-mono text-xs flex items-center gap-4`}>
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Gesamtbevölkerung</span>
            <span className="text-sky-400 font-bold text-lg tabular-nums">
              {population.total.toFixed(1)} Mio.
            </span>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <span className="text-[10px] text-slate-400 uppercase block">Wachstumsrate</span>
            <span className={`font-bold text-base tabular-nums ${population.growthRate >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {population.growthRate >= 0 ? `+${population.growthRate.toFixed(2)}%` : `${population.growthRate.toFixed(2)}%`}
            </span>
          </div>
        </div>
      </div>

      {/* Hauptkennzahlen-Raster */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div className={`p-4 rounded-xl border ${innerCard} space-y-1`}>
          <span className="text-slate-400 text-[11px] block flex items-center gap-1.5">
            <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
            Lebenserwartung
          </span>
          <span className="text-lg font-bold text-white tabular-nums">
            {population.lifeExpectancy.toFixed(1)} Jahre
          </span>
          <span className="text-[11px] text-slate-400">
            Sterberate: {population.deathRatePer1000} ‰
          </span>
        </div>

        <div className={`p-4 rounded-xl border ${innerCard} space-y-1`}>
          <span className="text-slate-400 text-[11px] block flex items-center gap-1.5">
            <Baby className="w-3.5 h-3.5 text-amber-400" />
            Geburtenrate
          </span>
          <span className="text-lg font-bold text-amber-300 tabular-nums">
            {population.birthRatePer1000.toFixed(1)} pro 1.000
          </span>
          <span className="text-[11px] text-slate-400">
            Netto-Zuzug: +{population.netMigrationThousands}k / J.
          </span>
        </div>

        <div className={`p-4 rounded-xl border ${innerCard} space-y-1`}>
          <span className="text-slate-400 text-[11px] block flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            Human Development Index
          </span>
          <span className="text-lg font-bold text-emerald-400 tabular-nums">
            {population.hdiIndex.toFixed(3)}
          </span>
          <span className="text-[11px] text-slate-400">
            Einstufung: Sehr hoch
          </span>
        </div>

        <div className={`p-4 rounded-xl border ${innerCard} space-y-1`}>
          <span className="text-slate-400 text-[11px] block flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-purple-400" />
            Urbanisierungsgrad
          </span>
          <span className="text-lg font-bold text-purple-300 tabular-nums">
            {population.urbanizationRate.toFixed(1)}%
          </span>
          <span className="text-[11px] text-slate-400">
            Alphabetisierung: {population.literacyRate}%
          </span>
        </div>
      </div>

      {/* RENTENSYSTEM (Zielwert 75 %) & Hilfspakete */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Gesetzliches Rentensystem mit 75% Zielwert */}
        <div className={`lg:col-span-6 p-6 rounded-2xl border ${glassCard} space-y-4`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Gesetzliches Rentenniveau</span>
              </div>
              <h3 className="text-lg font-bold text-slate-100 mt-0.5">
                Generationenvertrag & Rentenanpassung
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-xs border border-amber-500/30">
              Zielwert: 75 %
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Das gesetzliche Rentenniveau hat einen Zielwert von 75 Prozent. Es passt sich dynamisch an Reallöhne, Wirtschaftswachstum, Beschäftigung, Altersstruktur und die Finanzierbarkeit der Staatskasse an.
          </p>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className={`p-3 rounded-xl border ${innerCard}`}>
              <span className="text-[10px] text-slate-400 block uppercase">Aktuelles Rentenniveau</span>
              <span className="text-2xl font-bold text-emerald-400">
                {pensionSystem?.actualLevelPercent || 68.5}%
              </span>
              <div className="text-[10px] text-slate-500 mt-1">Konvergiert auf 75% Ziel</div>
            </div>

            <div className={`p-3 rounded-xl border ${innerCard}`}>
              <span className="text-[10px] text-slate-400 block uppercase">Durchschnittliche Rente</span>
              <span className="text-2xl font-bold text-amber-400">
                {state.currencySymbol}{pensionSystem?.monthlyAverageEuro || 1780} / M.
              </span>
              <div className="text-[10px] text-slate-500 mt-1">Tragfähigkeit: {pensionSystem?.sustainabilityIndex || 82}%</div>
            </div>
          </div>

          {/* Slider for target */}
          <div className="pt-2">
            <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
              <span>Zielwert einstellen ({pensionSystem?.targetLevelPercent || 75}%):</span>
              <span className="text-amber-400 font-bold">Standard: 75%</span>
            </div>
            <input
              type="range"
              min="50"
              max="90"
              step="1"
              value={pensionSystem?.targetLevelPercent || 75}
              onChange={(e) => handleUpdatePensionTarget(parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Automatisch vorgeschlagene Hilfspakete */}
        <div className={`lg:col-span-6 p-6 rounded-2xl border ${glassCard} space-y-4`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Staatliche Hilfspakete</span>
              </div>
              <h3 className="text-lg font-bold text-slate-100 mt-0.5">
                Automatische Konjunktur- & Sozialhilfen
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">KI-Systemempfehlungen</span>
          </div>

          <p className="text-xs text-slate-400">
            Pakete werden basierend auf Inflation, Arbeitslosigkeit und Unruhe automatisch vorgeschlagen und können individuell aktiviert oder modifiziert werden.
          </p>

          <div className="space-y-3">
            {welfarePackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  pkg.active ? 'border-emerald-500/50 bg-emerald-500/10' : innerCard
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-200">{pkg.title}</div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Kategorie: {pkg.category} · Kosten: <span className="text-amber-400">{state.currencySymbol}{pkg.costMrd} Mrd./Q</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleWelfare(pkg.id)}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                      pkg.active
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {pkg.active ? 'Aktiviert' : 'Aktivieren'}
                  </button>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400 mt-2">
                  <span className="text-emerald-400 font-semibold">+{pkg.stabilityBoost}% Stabilität</span>
                  <span className="text-sky-400 font-semibold">-{pkg.unrestReduction}% Unruhe</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Altersverteilung & Demografischer Wandel */}
      <div className={`p-6 rounded-2xl border ${glassCard} space-y-4`}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <span>Altersstruktur & Demografische Säulen</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Verhältnis von Erwerbstätigen zu abhängigen Jugendlichen und Senioren.
            </p>
          </div>
          <span className="text-slate-400 font-mono text-[11px]">
            Erwerbsquote: {population.ageDistribution.working15to64}%
          </span>
        </div>

        <div className="space-y-4 font-mono text-xs">
          {/* Jugend */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-300">Jugend (0–14 Jahre):</span>
              <span className="text-amber-400 font-bold tabular-nums">
                {population.ageDistribution.youth0to14}% ({((population.total * population.ageDistribution.youth0to14) / 100).toFixed(1)} Mio.)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-amber-400"
                style={{ width: `${population.ageDistribution.youth0to14 * 2}%` }}
              />
            </div>
          </div>

          {/* Erwerbstätige */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-300">Erwerbsbevölkerung (15–64 Jahre):</span>
              <span className="text-emerald-400 font-bold tabular-nums">
                {population.ageDistribution.working15to64}% ({((population.total * population.ageDistribution.working15to64) / 100).toFixed(1)} Mio.)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-emerald-400"
                style={{ width: `${population.ageDistribution.working15to64}%` }}
              />
            </div>
          </div>

          {/* Senioren */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-300">Senioren & Ruheständler (65+ Jahre):</span>
              <span className="text-sky-400 font-bold tabular-nums">
                {population.ageDistribution.seniors65Plus}% ({((population.total * population.ageDistribution.seniors65Plus) / 100).toFixed(1)} Mio.)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-sky-400"
                style={{ width: `${population.ageDistribution.seniors65Plus * 2}%` }}
              />
            </div>
          </div>
        </div>

        {/* Soziale Schichtung */}
        <div className="pt-4 border-t border-slate-800 space-y-3 font-mono">
          <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block font-sans">
            Soziale Schichtung & Wohlstandsverteilung
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className={`p-2.5 rounded border ${innerCard}`}>
              <span className="text-slate-400 block text-[10px]">Oberschicht</span>
              <span className="text-white font-bold text-sm tabular-nums">{population.socialClasses.upperClass}%</span>
            </div>
            <div className={`p-2.5 rounded border ${innerCard}`}>
              <span className="text-slate-400 block text-[10px]">Mittelstand</span>
              <span className="text-emerald-400 font-bold text-sm tabular-nums">{population.socialClasses.middleClass}%</span>
            </div>
            <div className={`p-2.5 rounded border ${innerCard}`}>
              <span className="text-slate-400 block text-[10px]">Arbeiterklasse</span>
              <span className="text-sky-400 font-bold text-sm tabular-nums">{population.socialClasses.workingClass}%</span>
            </div>
            <div className={`p-2.5 rounded border ${innerCard}`}>
              <span className="text-slate-400 block text-[10px]">Armutsgefährdet</span>
              <span className="text-rose-400 font-bold text-sm tabular-nums">{population.socialClasses.impoverished}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Große Metropolen & Städteübersicht */}
      <div className={`p-6 rounded-2xl border ${glassCard} space-y-4 text-xs`}>
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Wichtigste Ballungsräume & Metropolen</span>
          </h3>
          <span className="text-slate-400 font-mono text-[11px]">
            Hauptstadt: {state.capitalCity}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
          {population.majorCities.map((city, idx) => (
            <div key={idx} className={`p-3 rounded-xl border ${innerCard} space-y-1`}>
              <div className="flex items-center justify-between">
                <span className="font-bold font-sans text-slate-100 text-xs truncate">{city.name}</span>
                <span className="text-[10px] text-amber-400 font-bold">{idx === 0 ? 'HAUPTSTADT' : 'METROPOLE'}</span>
              </div>
              <div className="text-base font-bold text-white tabular-nums">
                {city.population.toFixed(2)} Mio.
              </div>
              <div className="text-[10px] text-slate-400 font-sans">
                Region: {city.region}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
