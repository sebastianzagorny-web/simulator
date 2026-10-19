import React, { useState } from 'react';
import { GameState, CabinetMinister } from '../types/game';
import { sound } from '../utils/sound';
import {
  Users,
  Award,
  DollarSign,
  TrendingUp,
  Shield,
  Briefcase,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders
} from 'lucide-react';

interface CabinetPanelProps {
  state: GameState;
  onUpdateState: (updater: (prev: GameState) => GameState) => void;
  onLogEvent: (text: string, type: 'positive' | 'warning' | 'negative' | 'neutral') => void;
}

export const CabinetPanel: React.FC<CabinetPanelProps> = ({
  state,
  onUpdateState,
  onLogEvent
}) => {
  const [selectedMinisterId, setSelectedMinisterId] = useState<string>(state.cabinet[0]?.id || '');

  const glassCard = state.themeMode === 'light'
    ? 'bg-white/80 border-slate-200 text-slate-800 shadow-sm'
    : 'bg-slate-900/60 border-slate-800/80 text-slate-100 shadow-md backdrop-blur-md';

  const innerCard = state.themeMode === 'light'
    ? 'bg-slate-50 border-slate-200'
    : 'bg-slate-950/50 border-slate-800/60';

  const selectedMinister = state.cabinet.find(m => m.id === selectedMinisterId) || state.cabinet[0];

  const handleUpdateBudget = (ministerId: string, delta: number) => {
    sound.playClick();
    onUpdateState(prev => ({
      ...prev,
      cabinet: prev.cabinet.map(m => {
        if (m.id === ministerId) {
          const newBudget = Math.max(0.5, Math.min(40.0, Number((m.quarterlyBudgetMrd + delta).toFixed(1))));
          return { ...m, quarterlyBudgetMrd: newBudget };
        }
        return m;
      })
    }));
  };

  const handleUpdateSalary = (ministerId: string, delta: number) => {
    sound.playCoin();
    onUpdateState(prev => ({
      ...prev,
      cabinet: prev.cabinet.map(m => {
        if (m.id === ministerId) {
          const newSalary = Math.max(0.1, Math.min(2.0, Number((m.salaryMio + delta).toFixed(2))));
          return { ...m, salaryMio: newSalary, loyalty: Math.min(100, m.loyalty + (delta > 0 ? 3 : -4)) };
        }
        return m;
      })
    }));
  };

  const handleDismissMinister = (ministerId: string) => {
    sound.playStamp();
    const candidateNames = [
      'Dr. Robert Kroll', 'Stefanie Meyer-Landrut', 'Prof. Christian Lindner',
      'Anja Karliczek', 'Dr. Florian Berg', 'Vera Sommerfeld', 'Dr. Nils Brinkmann'
    ];
    const newName = candidateNames[Math.floor(Math.random() * candidateNames.length)];

    onUpdateState(prev => ({
      ...prev,
      cabinet: prev.cabinet.map(m => {
        if (m.id === ministerId) {
          return {
            ...m,
            name: newName,
            loyalty: 80,
            competence: Math.floor(75 + Math.random() * 20),
            projectProgress: 5,
            disclosedInvestments: [
              { asset: 'Breit gestreute Staatsfonds-Anteile', valueMio: 1.5, industry: 'Finanzen' }
            ]
          };
        }
        return m;
      })
    }));

    onLogEvent(`KABINETTSUMREST: Neuer Minister für ${selectedMinister.departmentName} berufen: ${newName}.`, 'warning');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className={`p-6 rounded-2xl border ${glassCard}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest font-mono">
              <Users className="w-4 h-4" />
              <span>Exekutivrat der Regierung</span>
            </div>
            <h2 className="text-2xl font-black font-['Cinzel'] tracking-wide">
              Kabinett & die 11 Bundesministerien
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Ernennen Sie Minister, justieren Sie Ministerbudgets und Gehälter. Ministerien agieren autonom innerhalb ihrer Etats. Private Vermögenswerte und Nebeneinkünfte der Minister werden lückenlos offengelegt.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className={`p-3 rounded-xl border ${innerCard} text-center`}>
              <span className="text-[10px] text-slate-400 block uppercase">Gesamtes Kabinettsbudget</span>
              <span className="text-emerald-400 font-bold">
                {state.currencySymbol}{state.cabinet.reduce((acc, m) => acc + m.quarterlyBudgetMrd, 0).toFixed(1)} Mrd./Q
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Minister List (11 Departments) & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 11 Departments Navigation List */}
        <div className={`lg:col-span-5 p-4 rounded-2xl border ${glassCard} space-y-2 max-h-[700px] overflow-y-auto`}>
          <div className="text-xs font-bold text-slate-300 px-2 py-1 font-mono uppercase tracking-wider">
            Ressorts ({state.cabinet.length})
          </div>
          {state.cabinet.map((minister) => {
            const isSelected = minister.id === selectedMinister.id;
            return (
              <button
                key={minister.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedMinisterId(minister.id);
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/10 shadow-sm'
                    : 'border-slate-800/80 bg-slate-900/40 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-200">{minister.departmentName}</div>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                    {state.currencySymbol}{minister.quarterlyBudgetMrd} Mrd.
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>{minister.name}</span>
                  <span>Effizienz: <strong className="text-slate-300">{minister.competence}%</strong></span>
                </div>
                
                {/* Progress bar of current autonomous project */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all"
                    style={{ width: `${minister.projectProgress}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Detailed Minister Dossier & Disclosure */}
        <div className={`lg:col-span-7 p-6 rounded-2xl border ${glassCard} flex flex-col justify-between space-y-6`}>
          {selectedMinister && (
            <>
              <div>
                {/* Header Profile */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-semibold text-amber-400 font-mono uppercase">
                      {selectedMinister.departmentName}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-100 mt-0.5">
                      {selectedMinister.name}
                    </h3>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Bundesminister/in im Dienst des Staatsoberhauptes
                    </div>
                  </div>
                  <button
                    onClick={() => handleDismissMinister(selectedMinister.id)}
                    className="px-3 py-1.5 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/30 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Minister entlassen
                  </button>
                </div>

                {/* Autonomes Projekt */}
                <div className={`p-4 rounded-xl border mt-4 ${innerCard}`}>
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-slate-400 uppercase font-bold">Autonome Ressort-Initiative</span>
                    <span className="text-amber-400 font-bold">{selectedMinister.projectProgress}% Fortschritt</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-200">
                    {selectedMinister.currentProject}
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all"
                      style={{ width: `${selectedMinister.projectProgress}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Wird quartalsweise autonom vom Ministerium mit zugewiesenem Budget vorangetrieben.
                  </div>
                </div>

                {/* Budgets & Salaries Sliders / Steppers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {/* Quarterly Budget */}
                  <div className={`p-4 rounded-xl border ${innerCard}`}>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Ressort-Budget (pro Quartal)</span>
                    <div className="text-xl font-bold font-mono text-emerald-400 my-1">
                      {state.currencySymbol}{selectedMinister.quarterlyBudgetMrd.toFixed(1)} Mrd.
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleUpdateBudget(selectedMinister.id, -1.0)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 border border-slate-700"
                      >
                        -1.0 Mrd.
                      </button>
                      <button
                        onClick={() => handleUpdateBudget(selectedMinister.id, +1.0)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 border border-slate-700"
                      >
                        +1.0 Mrd.
                      </button>
                      <button
                        onClick={() => handleUpdateBudget(selectedMinister.id, +5.0)}
                        className="px-2.5 py-1 rounded bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 text-xs font-mono border border-emerald-500/30"
                      >
                        +5.0 Mrd.
                      </button>
                    </div>
                  </div>

                  {/* Salary */}
                  <div className={`p-4 rounded-xl border ${innerCard}`}>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Jahresgehalt des Ministers</span>
                    <div className="text-xl font-bold font-mono text-amber-400 my-1">
                      {state.currencySymbol}{selectedMinister.salaryMio.toFixed(2)} Mio.
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleUpdateSalary(selectedMinister.id, -0.05)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 border border-slate-700"
                      >
                        Kürzen (-50k)
                      </button>
                      <button
                        onClick={() => handleUpdateSalary(selectedMinister.id, +0.10)}
                        className="px-2.5 py-1 rounded bg-amber-600/20 text-amber-300 hover:bg-amber-600/30 text-xs font-mono border border-amber-500/30"
                      >
                        Erhöhen (+100k)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Disclosed Private Investments (Offenlegungspflicht) */}
                <div className="mt-6">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-amber-400" />
                    <span>Gesetzlich offengelegte Privat-Investitionen des Ministers</span>
                  </div>

                  <div className="space-y-2">
                    {selectedMinister.disclosedInvestments.map((inv, idx) => (
                      <div key={idx} className={`p-3 rounded-lg border flex items-center justify-between text-xs ${innerCard}`}>
                        <div>
                          <div className="font-semibold text-slate-200">{inv.asset}</div>
                          <div className="text-slate-400 text-[11px]">Sektor: {inv.industry}</div>
                        </div>
                        <span className="font-mono font-bold text-amber-400">
                          {state.currencySymbol}{inv.valueMio.toFixed(1)} Mio.
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Loyalität zum Präsidenten: <strong className="text-sky-400">{selectedMinister.loyalty}%</strong></span>
                <span>Kompetenzbewertung: <strong className="text-emerald-400">{selectedMinister.competence}%</strong></span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
