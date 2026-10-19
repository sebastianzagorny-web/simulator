import React, { useState } from 'react';
import { GameState } from '../types/game';
import { sound } from '../utils/sound';
import { ActiveTabType } from './TopStatusBar';
import {
  Globe2,
  User,
  Briefcase,
  TrendingUp,
  Building,
  Factory,
  BarChart3,
  Skull,
  Users,
  Scroll,
  Shield,
  Palette,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Flame,
  Award
} from 'lucide-react';

interface SidebarNavigationProps {
  state: GameState;
  activeTab: ActiveTabType;
  onSelectTab: (tab: ActiveTabType) => void;
}

interface NavItem {
  id: ActiveTabType;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  highlightCondition?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  state,
  activeTab,
  onSelectTab
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Status badges
  const atWarCount = (state.rivals || []).filter(r => r.atWar).length;
  const activeLoansCount = (state.foreignLoans || []).filter(l => l.remainingQuarters > 0).length;
  const defconLevel = state.military.readinessDefcon;

  const sections: NavSection[] = [
    {
      title: 'Geopolitik & Führung',
      items: [
        {
          id: 'overview',
          label: 'Echte Weltkarte',
          sublabel: 'Diplomatie, Kredite & Krieg',
          icon: Globe2,
          badge: atWarCount > 0 ? `${atWarCount} Krieg` : activeLoansCount > 0 ? `${activeLoansCount} Kredite` : undefined,
          badgeColor: atWarCount > 0 ? 'bg-rose-500 text-white' : 'bg-amber-500/20 text-amber-300'
        },
        {
          id: 'president',
          label: 'Präsident & Dynastie',
          sublabel: 'Privatvermögen & Familie',
          icon: User,
          badge: `${state.currencySymbol}${state.ruler.slushFund.toFixed(1)}B`,
          badgeColor: 'bg-emerald-500/20 text-emerald-300'
        },
        {
          id: 'cabinet',
          label: 'Bundeskabinett',
          sublabel: '11 Fachministerien',
          icon: Briefcase,
          badge: '11 Ressorts',
          badgeColor: 'bg-slate-700/50 text-slate-300'
        }
      ]
    },
    {
      title: 'Wirtschaft & Finanzen',
      items: [
        {
          id: 'economy',
          label: 'Staatsfinanzen',
          sublabel: 'Steuern & Schulden',
          icon: TrendingUp,
          badge: `${state.currencySymbol}${state.macro.treasury.toFixed(0)}B`,
          badgeColor: state.macro.treasury >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
        },
        {
          id: 'corporate100',
          label: 'Top 100 Konzerne',
          sublabel: 'Wirtschaft & Enteignung',
          icon: Building
        },
        {
          id: 'trade',
          label: 'Industrie & Welthandel',
          sublabel: '10x10 Branchensektoren',
          icon: Factory
        },
        {
          id: 'stock',
          label: 'Börse, SEC & Spenden',
          sublabel: 'Aktienhandel & Aufsicht',
          icon: BarChart3
        },
        {
          id: 'shadow',
          label: 'Schatten-Präsident',
          sublabel: 'Unterwelt & Kartelle',
          icon: Skull,
          badge: state.playMode === 'shadow_president' ? 'Aktiv' : undefined,
          badgeColor: 'bg-purple-900/60 text-purple-300 border border-purple-500/40',
          highlightCondition: state.playMode === 'shadow_president'
        }
      ]
    },
    {
      title: 'Staat & Sicherheit',
      items: [
        {
          id: 'demographics',
          label: 'Bevölkerungszentrum',
          sublabel: 'Demografie & 75%-Rente',
          icon: Users,
          badge: `${(state.ruler.popularity || 65).toFixed(0)}%`,
          badgeColor: 'bg-sky-500/20 text-sky-300'
        },
        {
          id: 'politics',
          label: 'Dekrete & Gesetze',
          sublabel: 'Politische Reformen',
          icon: Scroll
        },
        {
          id: 'military',
          label: 'Streitkräfte & Rüstung',
          sublabel: 'Heer, Flotte, Drohnen & Nuklear',
          icon: Shield,
          badge: `DEFCON ${defconLevel}`,
          badgeColor: defconLevel <= 2 ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 text-amber-400'
        },
        {
          id: 'design',
          label: 'Hoheitszeichen',
          sublabel: 'Flagge & Währungsstudio',
          icon: Palette
        }
      ]
    }
  ];

  const sidebarBg = state.themeMode === 'light'
    ? 'bg-slate-50/95 border-r border-slate-300 text-slate-800 shadow-xl'
    : 'bg-slate-950/95 border-r border-slate-800/80 text-slate-200 shadow-2xl backdrop-blur-2xl';

  return (
    <aside
      className={`relative select-none flex flex-col shrink-0 transition-all duration-300 z-20 ${
        isCollapsed ? 'w-18' : 'w-64 sm:w-72'
      } ${sidebarBg} h-full`}
    >
      {/* Sidebar Header & Collapse Toggle */}
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-slate-800/80">
        {!isCollapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-md border border-amber-500/30"
              style={{ backgroundColor: state.flagPrimaryColor }}
            >
              <Award className="w-4 h-4 text-amber-300" />
            </div>
            <div className="truncate">
              <span className="font-['Cinzel'] font-black text-xs tracking-wider text-amber-400 block uppercase">
                KOMMANDOZENTRALE
              </span>
              <span className="text-[10px] text-slate-400 font-mono block truncate">
                {state.countryName}
              </span>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div 
            className="w-8 h-8 mx-auto rounded-lg flex items-center justify-center shrink-0 shadow border border-amber-500/30"
            style={{ backgroundColor: state.flagPrimaryColor }}
            title={state.countryName}
          >
            <Award className="w-4 h-4 text-amber-300" />
          </div>
        )}

        <button
          onClick={() => {
            sound.playClick();
            setIsCollapsed(!isCollapsed);
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors ml-auto"
          title={isCollapsed ? 'Menüleiste ausklappen' : 'Menüleiste einklappen'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {sections.map((sec, secIdx) => (
          <div key={secIdx} className="space-y-1">
            {!isCollapsed && (
              <div className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-mono text-slate-400 font-semibold">
                {sec.title}
              </div>
            )}

            <div className="space-y-0.5">
              {sec.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      sound.playClick();
                      onSelectTab(item.id);
                    }}
                    title={isCollapsed ? `${item.label} - ${item.sublabel}` : undefined}
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl transition-all text-left relative group ${
                      isActive
                        ? state.themeMode === 'light'
                          ? 'bg-amber-500/15 text-amber-900 font-bold border border-amber-500/40 shadow-sm'
                          : 'bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-300 font-bold border border-amber-500/40 shadow-lg shadow-amber-500/5'
                        : state.themeMode === 'light'
                          ? 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 border border-transparent'
                          : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    {/* Active Indicator Bar */}
                    {isActive && (
                      <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-amber-400 rounded-r shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                    )}

                    <div className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-slate-900/60 text-slate-400 group-hover:text-amber-400 group-hover:bg-slate-800/80'
                    }`}>
                      <IconComponent className="w-4 h-4" />
                    </div>

                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs truncate tracking-tight">
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-semibold shrink-0 ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 truncate block font-sans">
                          {item.sublabel}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info in Sidebar */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Simulation aktiv</span>
          </div>
          <span className="text-slate-400">v4.0 Pro</span>
        </div>
      )}
    </aside>
  );
};
