import React from 'react';
import { DilemmaEvent, DilemmaOption } from '../types/game';
import { sound } from '../utils/sound';
import { AlertCircle, ShieldAlert, Sparkles, Flame, Check } from 'lucide-react';

interface EventModalProps {
  event: DilemmaEvent | null;
  onSelectOption: (option: DilemmaOption) => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, onSelectOption }) => {
  if (!event) return null;

  const handleOptionClick = (opt: DilemmaOption) => {
    sound.playStamp();
    onSelectOption(opt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        
        {/* Urgent Alert Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 px-6 py-2.5 flex items-center justify-between text-slate-950 font-mono text-xs font-bold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-slate-950" />
            <span>Dringende Kabinetts-Depesche · {event.category.toUpperCase()}-KRISE</span>
          </div>
          <span>Entscheidung Erforderlich</span>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel'] text-white">
            {event.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/50 p-4 rounded-lg border border-slate-800">
            {event.description}
          </p>

          <div className="space-y-2.5 pt-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 block font-mono">
              Souveräne Exekutiv-Erlasse & Handlungsoptionen
            </span>

            {event.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(option)}
                className="w-full text-left p-3.5 rounded-lg border border-slate-800 bg-slate-950/80 hover:border-amber-500/70 hover:bg-amber-500/10 transition-all group flex flex-col space-y-1.5 cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs sm:text-sm text-slate-100 group-hover:text-amber-300 transition-colors">
                    {option.text}
                  </span>
                  <Check className="w-4 h-4 text-transparent group-hover:text-amber-400 transition-colors shrink-0" />
                </div>
                <div className="text-[11px] text-slate-400 leading-tight">
                  {option.outcomeText}
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
