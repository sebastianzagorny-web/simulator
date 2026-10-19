/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  GameState,
  DilemmaOption,
  TaxRates,
  StateEnterprise,
  MilitaryBranches,
  FactionLoyalty,
  RivalNation,
  FlagDesign,
  CurrencyConfig,
  GamePlayMode,
  ThemeMode
} from './types/game';
import { PRESET_SCENARIOS, ScenarioPreset, buildNewGame } from './data/erasAndPresets';
import { simulateQuarter } from './simulation/engine';
import { sound } from './utils/sound';
import { TitleScreen } from './components/TitleScreen';
import { CustomNationModal } from './components/CustomNationModal';
import { TopStatusBar, ActiveTabType } from './components/TopStatusBar';
import { SidebarNavigation } from './components/SidebarNavigation';
import { RealWorldMap } from './components/RealWorldMap';
import { DemographicsPanel } from './components/DemographicsPanel';
import { DesignStudioPanel } from './components/DesignStudioPanel';
import { EconomyPanel } from './components/EconomyPanel';
import { InfrastructurePanel } from './components/InfrastructurePanel';
import { PoliticsPanel } from './components/PoliticsPanel';
import { MilitaryPanel } from './components/MilitaryPanel';
import { IntelligencePanel } from './components/IntelligencePanel';
import { PresidentPrivatePanel } from './components/PresidentPrivatePanel';
import { CabinetPanel } from './components/CabinetPanel';
import { Corporate100Panel } from './components/Corporate100Panel';
import { IndustryTradePanel } from './components/IndustryTradePanel';
import { StockMarketPanel } from './components/StockMarketPanel';
import { ShadowPresidentPanel } from './components/ShadowPresidentPanel';
import { CheatAdminModal } from './components/CheatAdminModal';
import { EventModal } from './components/EventModal';
import { GameOverModal } from './components/GameOverModal';

export default function App() {
  const [viewMode, setViewMode] = useState<'title' | 'playing'>('title');
  const [gameState, setGameState] = useState<GameState>(() => buildNewGame(PRESET_SCENARIOS[0]));
  const [activeTab, setActiveTab] = useState<ActiveTabType>('overview');
  const [isCustomBuilderOpen, setIsCustomBuilderOpen] = useState<boolean>(false);
  const [isCheatAdminOpen, setIsCheatAdminOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Simulation tick loop
  const timerRef = useRef<number | null>(null);

  const advanceOneQuarter = () => {
    setGameState((prev) => {
      if (prev.gameOver) return prev;
      const { nextState } = simulateQuarter(prev);
      return nextState;
    });
  };

  useEffect(() => {
    if (viewMode !== 'playing' || gameState.isPaused || gameState.activeDilemma || gameState.gameOver) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Speeds:
    // 1: Normal (6 min / year = 90 sec / quarter = 90000ms)
    // 2: Stufe 2 (3 min / year = 45 sec / quarter = 45000ms)
    // 3: Stufe 3 (2 min / year = 30 sec / quarter = 30000ms)
    // 4: Max (1 min / year = 15 sec / quarter = 15000ms)
    const intervalMs =
      gameState.gameSpeed === 4 ? 15000 :
      gameState.gameSpeed === 3 ? 30000 :
      gameState.gameSpeed === 2 ? 45000 :
      90000;

    timerRef.current = window.setInterval(() => {
      advanceOneQuarter();
    }, intervalMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [viewMode, gameState.isPaused, gameState.gameSpeed, gameState.activeDilemma, gameState.gameOver]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
        if (viewMode === 'playing') {
          e.preventDefault();
          sound.playClick();
          setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
        }
      } else if (e.key === '1') {
        sound.playClick();
        setGameState((prev) => ({ ...prev, gameSpeed: 1 }));
      } else if (e.key === '2') {
        sound.playClick();
        setGameState((prev) => ({ ...prev, gameSpeed: 2 }));
      } else if (e.key === '3') {
        sound.playClick();
        setGameState((prev) => ({ ...prev, gameSpeed: 3 }));
      } else if (e.key === '4') {
        sound.playClick();
        setGameState((prev) => ({ ...prev, gameSpeed: 4 }));
      } else if (e.key === 'n' || e.key === 'N') {
        if (viewMode === 'playing') {
          sound.playStamp();
          advanceOneQuarter();
        }
      } else if (e.key === 'm' || e.key === 'M') {
        const nextMute = sound.toggleMute();
        setIsMuted(nextMute);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode]);

  // Start with selected preset and play mode
  const handleSelectPreset = (preset: ScenarioPreset, playMode: GamePlayMode = 'statesman') => {
    const newState = buildNewGame(preset, playMode);
    setGameState(newState);
    setViewMode('playing');
  };

  // Start with custom nation builder
  const handleCreateCustom = (customConfig: Parameters<typeof buildNewGame>[0]) => {
    const newState = buildNewGame(customConfig);
    setGameState(newState);
    setIsCustomBuilderOpen(false);
    setViewMode('playing');
  };

  // Log Imperial Event Helper
  const handleLogEvent = (text: string, type: 'positive' | 'warning' | 'negative' | 'neutral') => {
    setGameState((prev) => ({
      ...prev,
      historyLog: [
        {
          year: prev.year,
          quarter: prev.quarter,
          text,
          type
        },
        ...prev.historyLog
      ].slice(0, 30)
    }));
  };

  // Toggle Theme Mode (Dark / Light Glassmorphism)
  const handleToggleTheme = () => {
    sound.playClick();
    setGameState((prev) => ({
      ...prev,
      themeMode: prev.themeMode === 'dark' ? 'light' : 'dark'
    }));
  };

  // Dilemma resolution
  const handleSelectDilemmaOption = (opt: DilemmaOption) => {
    setGameState((prev) => {
      let gdpGrowth = prev.macro.gdpGrowthRate;
      let treasury = prev.macro.treasury;
      let popularity = prev.ruler.popularity;
      let unrest = prev.unrest;
      let militaryStrength = prev.military.infantryDivisions;
      let legitimacy = prev.ruler.legitimacy;
      const factions = { ...prev.factions };
      const rivals = [...prev.rivals];

      if (opt.gdpGrowthDelta) gdpGrowth += opt.gdpGrowthDelta;
      if (opt.treasuryDelta) treasury += opt.treasuryDelta;
      if (opt.approvalDelta) popularity += opt.approvalDelta;
      if (opt.unrestDelta) unrest = Math.max(0, Math.min(100, unrest + opt.unrestDelta));
      if (opt.militaryDelta) militaryStrength = Math.max(0, militaryStrength + opt.militaryDelta);
      if (opt.legitimacyDelta) legitimacy = Math.max(0, Math.min(100, legitimacy + opt.legitimacyDelta));

      if (opt.factionDeltas) {
        (Object.keys(opt.factionDeltas) as (keyof FactionLoyalty)[]).forEach((fk) => {
          if (opt.factionDeltas![fk]) {
            factions[fk] = Math.max(0, Math.min(100, factions[fk] + opt.factionDeltas![fk]!));
          }
        });
      }

      if (opt.relationsDelta) {
        const rivalIdx = rivals.findIndex((r) => r.id === opt.relationsDelta!.rivalId);
        if (rivalIdx !== -1) {
          rivals[rivalIdx] = {
            ...rivals[rivalIdx],
            relations: Math.max(-100, Math.min(100, rivals[rivalIdx].relations + opt.relationsDelta.delta))
          };
        }
      }

      sound.playStamp();

      return {
        ...prev,
        activeDilemma: null,
        unrest,
        ruler: {
          ...prev.ruler,
          popularity: Math.max(0, Math.min(100, popularity)),
          legitimacy
        },
        macro: {
          ...prev.macro,
          gdpGrowthRate: Number(gdpGrowth.toFixed(2)),
          treasury: Number(treasury.toFixed(1))
        },
        military: {
          ...prev.military,
          infantryDivisions: militaryStrength
        },
        factions,
        rivals,
        historyLog: [
          {
            year: prev.year,
            quarter: prev.quarter,
            text: `DEKRET VOLLSTRECKT: ${opt.outcomeText}`,
            type: 'neutral' as const
          },
          ...prev.historyLog
        ].slice(0, 30)
      };
    });
  };

  // Flag and Currency designer updates
  const handleUpdateFlag = (newDesign: FlagDesign) => {
    setGameState((prev) => ({
      ...prev,
      flagDesign: newDesign,
      flagPrimaryColor: newDesign.primaryColor,
      flagSecondaryColor: newDesign.secondaryColor
    }));
  };

  const handleUpdateCurrency = (newConfig: CurrencyConfig) => {
    setGameState((prev) => ({
      ...prev,
      currencyConfig: newConfig,
      currencyName: newConfig.name,
      currencySymbol: newConfig.symbol
    }));
  };

  // Infrastructure upgrade
  const handleUpgradeInfrastructure = (infraId: string) => {
    setGameState((prev) => {
      const inf = prev.infrastructure.find((i) => i.id === infraId);
      if (!inf || inf.level >= 5 || prev.macro.treasury < inf.costPerLevel) return prev;
      sound.playHammer();
      return {
        ...prev,
        macro: {
          ...prev.macro,
          treasury: Number((prev.macro.treasury - inf.costPerLevel).toFixed(1))
        },
        infrastructure: prev.infrastructure.map((i) => (i.id === infraId ? { ...i, level: i.level + 1 } : i))
      };
    });
  };

  // Politics & Laws
  const handleUpdateLaw = (policyId: string, optionId: string) => {
    sound.playStamp();
    setGameState((prev) => ({
      ...prev,
      laws: prev.laws.map((l) => (l.id === policyId ? { ...l, currentOption: optionId } : l))
    }));
  };

  const handleIssueEmergencyDecree = (decreeType: string) => {
    sound.playStamp();
    setGameState((prev) => {
      if (decreeType === 'martial_law' || decreeType === 'decree_martial_law') {
        return {
          ...prev,
          fearIndex: Math.min(100, prev.fearIndex + 25),
          unrest: Math.max(0, prev.unrest - 30),
          stability: Math.min(100, prev.stability + 15),
          ruler: { ...prev.ruler, popularity: Math.max(10, prev.ruler.popularity - 12) }
        };
      }
      if (decreeType === 'anti_corruption' || decreeType === 'decree_anti_corruption') {
        return {
          ...prev,
          stability: Math.min(100, prev.stability + 12),
          ruler: { ...prev.ruler, popularity: Math.min(100, prev.ruler.popularity + 8) },
          factions: { ...prev.factions, oligarchs: Math.max(0, prev.factions.oligarchs - 20) }
        };
      }
      if (decreeType === 'stimulus_surge' || decreeType === 'decree_stimulus') {
        if (prev.macro.treasury < 25) return prev;
        return {
          ...prev,
          macro: {
            ...prev.macro,
            treasury: prev.macro.treasury - 25,
            gdpGrowthRate: prev.macro.gdpGrowthRate + 1.8
          },
          ruler: { ...prev.ruler, popularity: Math.min(100, prev.ruler.popularity + 10) }
        };
      }
      if (decreeType === 'press_gag' || decreeType === 'decree_press_gag') {
        return {
          ...prev,
          censorshipLevel: 'state_monopoly',
          fearIndex: Math.min(100, prev.fearIndex + 15),
          ruler: { ...prev.ruler, popularity: Math.max(5, prev.ruler.popularity - 15) }
        };
      }
      return {
        ...prev,
        stability: Math.min(100, prev.stability + 5)
      };
    });
  };

  const handleExecutePoliticalAction = (action: 'campaign_rally' | 'gerrymander' | 'bribe_opposition' | 'state_media_blitz' | string) => {
    sound.playStamp();
    setGameState((prev) => {
      if (action === 'campaign_rally') {
        return {
          ...prev,
          macro: { ...prev.macro, treasury: Math.max(0, prev.macro.treasury - 2) },
          ruler: { ...prev.ruler, popularity: Math.min(100, prev.ruler.popularity + 6) }
        };
      }
      if (action === 'gerrymander') {
        return {
          ...prev,
          stability: Math.min(100, prev.stability + 8),
          unrest: Math.min(100, prev.unrest + 5)
        };
      }
      if (action === 'bribe_opposition') {
        if (prev.ruler.slushFund < 2.0) return prev;
        return {
          ...prev,
          ruler: { ...prev.ruler, slushFund: Number((prev.ruler.slushFund - 2.0).toFixed(2)) },
          stability: Math.min(100, prev.stability + 14)
        };
      }
      if (action === 'state_media_blitz') {
        if (prev.macro.treasury < 3.0) return prev;
        return {
          ...prev,
          macro: { ...prev.macro, treasury: Number((prev.macro.treasury - 3.0).toFixed(2)) },
          ruler: { ...prev.ruler, popularity: Math.min(100, prev.ruler.popularity + 9) },
          unrest: Math.max(0, prev.unrest - 5)
        };
      }
      if (action === 'dissolve_parliament') {
        return {
          ...prev,
          unrest: Math.min(100, prev.unrest + 15),
          stability: Math.max(0, prev.stability - 10),
          nextElectionYear: prev.year + 1
        };
      }
      return prev;
    });
  };

  const handleToggleCurfew = () => {
    sound.playClick();
    setGameState((prev) => ({
      ...prev,
      fearIndex: prev.fearIndex > 30 ? 10 : 45,
      unrest: Math.max(0, prev.unrest - 10)
    }));
  };

  // Military recruits
  const handleRecruitBranch = (branch: keyof MilitaryBranches, costMrd: number) => {
    setGameState((prev) => {
      if (prev.macro.treasury < costMrd) return prev;
      sound.playStamp();
      return {
        ...prev,
        macro: { ...prev.macro, treasury: Number((prev.macro.treasury - costMrd).toFixed(1)) },
        military: {
          ...prev.military,
          [branch]: ((prev.military[branch] as number) || 0) + (branch === 'nuclearWarheads' ? 50 : 5)
        }
      };
    });
  };

  const handleLaunchCampaign = (targetRivalId: string, aggressionType: 'border_skirmish' | 'full_invasion' | 'air_strike' = 'border_skirmish') => {
    sound.playMarch();
    setGameState((prev) => {
      const rival = prev.rivals.find((r) => r.id === targetRivalId);
      if (!rival) return prev;
      const relDrop = aggressionType === 'full_invasion' ? 80 : 30;
      const newEntry = {
        year: prev.year,
        quarter: prev.quarter,
        text: `MILITÄR-OPERATION: Militärschlag gegen ${rival.name} autorisiert! DEFCON 1 ausgerufen.`,
        type: 'negative' as const
      };
      return {
        ...prev,
        military: { ...prev.military, readinessDefcon: 1 },
        rivals: prev.rivals.map((r) =>
          r.id === targetRivalId ? { ...r, relations: Math.max(-100, r.relations - relDrop), atWar: true } : r
        ),
        historyLog: [newEntry, ...prev.historyLog].slice(0, 30)
      };
    });
  };

  // Covert operations & Slush fund
  const handleLaunchCovertOp = (opId: string) => {
    setGameState((prev) => {
      const op = prev.covertOps.find((o) => o.id === opId);
      if (!op || prev.ruler.slushFund < op.cost) return prev;
      sound.playMarch();
      return {
        ...prev,
        ruler: { ...prev.ruler, slushFund: Number((prev.ruler.slushFund - op.cost).toFixed(1)) },
        covertOps: prev.covertOps.map((o) => (o.id === opId ? { ...o, active: true, progress: 0 } : o))
      };
    });
  };

  const handleDepositSlushFund = (amount: number) => {
    setGameState((prev) => {
      if (prev.macro.treasury < amount) return prev;
      sound.playCoin();
      return {
        ...prev,
        macro: { ...prev.macro, treasury: Number((prev.macro.treasury - amount).toFixed(1)) },
        ruler: { ...prev.ruler, slushFund: Number((prev.ruler.slushFund + amount).toFixed(1)) },
        stability: Math.max(0, prev.stability - 3)
      };
    });
  };

  const handleBribeFaction = (factionKey: keyof FactionLoyalty, cost: number) => {
    setGameState((prev) => {
      if (prev.ruler.slushFund < cost) return prev;
      sound.playCoin();
      return {
        ...prev,
        ruler: { ...prev.ruler, slushFund: Number((prev.ruler.slushFund - cost).toFixed(1)) },
        factions: {
          ...prev.factions,
          [factionKey]: Math.min(100, prev.factions[factionKey] + 15)
        }
      };
    });
  };

  const handleFundMafiaCartel = (amount: number) => {
    setGameState((prev) => {
      if (prev.ruler.slushFund < amount) return prev;
      sound.playCoin();
      return {
        ...prev,
        ruler: { ...prev.ruler, slushFund: Number((prev.ruler.slushFund - amount).toFixed(1)) },
        fearIndex: Math.min(100, prev.fearIndex + 12),
        unrest: Math.min(100, prev.unrest + 6)
      };
    });
  };

  const handleCrackdownMafia = () => {
    sound.playMarch();
    setGameState((prev) => ({
      ...prev,
      stability: Math.min(100, prev.stability + 8),
      unrest: Math.max(0, prev.unrest - 10),
      ruler: { ...prev.ruler, popularity: Math.min(100, prev.ruler.popularity + 6) }
    }));
  };

  // Demographic Policies
  const handleExecuteDemographicPolicy = (policyKey: 'child_support' | 'skilled_migration' | 'social_housing' | 'pension_boost') => {
    setGameState((prev) => {
      sound.playStamp();
      if (policyKey === 'child_support') {
        if (prev.macro.treasury < 4) return prev;
        return {
          ...prev,
          macro: { ...prev.macro, treasury: prev.macro.treasury - 4 },
          population: {
            ...prev.population,
            birthRatePer1000: Number((prev.population.birthRatePer1000 + 0.4).toFixed(1)),
            growthRate: Number((prev.population.growthRate + 0.12).toFixed(2))
          }
        };
      }
      if (policyKey === 'skilled_migration') {
        return {
          ...prev,
          population: {
            ...prev.population,
            netMigrationThousands: prev.population.netMigrationThousands + 120,
            growthRate: Number((prev.population.growthRate + 0.18).toFixed(2))
          },
          macro: { ...prev.macro, gdpGrowthRate: prev.macro.gdpGrowthRate + 0.25 }
        };
      }
      if (policyKey === 'social_housing') {
        if (prev.macro.treasury < 6) return prev;
        return {
          ...prev,
          macro: { ...prev.macro, treasury: prev.macro.treasury - 6 },
          unrest: Math.max(0, prev.unrest - 6),
          stability: Math.min(100, prev.stability + 5)
        };
      }
      if (policyKey === 'pension_boost') {
        if (prev.macro.treasury < 8) return prev;
        return {
          ...prev,
          macro: { ...prev.macro, treasury: prev.macro.treasury - 8 },
          ruler: { ...prev.ruler, popularity: Math.min(100, prev.ruler.popularity + 7) },
          pensionSystem: { ...prev.pensionSystem, actualLevelPercent: Math.min(85, prev.pensionSystem.actualLevelPercent + 2.5) }
        };
      }
      return prev;
    });
  };

  // Economic levers
  const handleExecuteEconomicLever = (action: 'quant_easing' | 'austerity' | 'capital_controls' | 'currency_devaluation') => {
    sound.playStamp();
    setGameState((prev) => {
      if (action === 'quant_easing') {
        const printed = Math.round(prev.macro.gdp * 0.02);
        return {
          ...prev,
          macro: {
            ...prev.macro,
            treasury: prev.macro.treasury + printed,
            inflationRate: prev.macro.inflationRate + 1.2
          }
        };
      }
      if (action === 'austerity') {
        return {
          ...prev,
          macro: {
            ...prev.macro,
            treasury: prev.macro.treasury + 15,
            gdpGrowthRate: Math.max(-4, prev.macro.gdpGrowthRate - 0.8)
          },
          ruler: { ...prev.ruler, popularity: Math.max(5, prev.ruler.popularity - 8) }
        };
      }
      if (action === 'capital_controls') {
        return {
          ...prev,
          stability: Math.min(100, prev.stability + 4),
          macro: {
            ...prev.macro,
            interestRate: Math.max(0.5, prev.macro.interestRate - 1.0)
          }
        };
      }
      return prev;
    });
  };

  const themeClasses = gameState.themeMode === 'light'
    ? 'bg-gradient-to-br from-slate-100 via-slate-50 to-amber-50/30 text-slate-900'
    : 'bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100';

  return (
    <div className={`relative w-screen h-screen overflow-hidden flex flex-col font-sans transition-colors duration-300 ${themeClasses}`}>
      {viewMode === 'title' ? (
        <TitleScreen
          onSelectPreset={handleSelectPreset}
          onOpenCustomBuilder={() => setIsCustomBuilderOpen(true)}
          isMuted={isMuted}
          onToggleMute={() => {
            const m = sound.toggleMute();
            setIsMuted(m);
          }}
        />
      ) : (
        <div className="flex-1 flex flex-col w-full h-full overflow-hidden">
          
          {/* Top Status Bar & Permanent HUD Ribbon */}
          <TopStatusBar
            state={gameState}
            onTogglePause={() => setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }))}
            onChangeSpeed={(speed) => setGameState((prev) => ({ ...prev, gameSpeed: speed }))}
            onAdvanceQuarter={advanceOneQuarter}
            isMuted={isMuted}
            onToggleMute={() => {
              const m = sound.toggleMute();
              setIsMuted(m);
            }}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onToggleTheme={handleToggleTheme}
            onOpenAdmin={() => setIsCheatAdminOpen(true)}
          />

          {/* Body Content with Sidebar Navigation ("Menüleiste seitlich") */}
          <div className="flex-1 flex flex-row w-full h-[calc(100%-53px)] overflow-hidden">
            <SidebarNavigation
              state={gameState}
              activeTab={activeTab}
              onSelectTab={setActiveTab}
            />

            {/* Active Tab Viewport */}
            <main className="flex-1 w-full overflow-y-auto relative p-4 md:p-6">
              
              {/* 1. Real World Map & Diplomacy */}
              {activeTab === 'overview' && (
                <RealWorldMap
                  state={gameState}
                  onLogEvent={handleLogEvent}
                  onUpdateState={(updater) => {
                    if (typeof updater === 'function') {
                      setGameState(updater);
                    } else {
                      setGameState((prev) => ({ ...prev, ...updater }));
                    }
                  }}
                />
              )}

            {/* 2. President Private Panel & Family */}
            {activeTab === 'president' && (
              <PresidentPrivatePanel
                state={gameState}
                onUpdateState={(updater) => setGameState(updater)}
                onLogEvent={handleLogEvent}
              />
            )}

            {/* 3. Cabinet & 11 Ministries */}
            {activeTab === 'cabinet' && (
              <CabinetPanel
                state={gameState}
                onUpdateState={(updater) => setGameState(updater)}
                onLogEvent={handleLogEvent}
              />
            )}

            {/* 4. Economy, Taxes, Debt Repayment */}
            {activeTab === 'economy' && (
              <EconomyPanel
                state={gameState}
                onUpdateTaxes={(taxes) => setGameState((prev) => ({ ...prev, taxes }))}
                onUpdateInterestRate={(rate) => {
                  setGameState((prev) => ({
                    ...prev,
                    macro: { ...prev.macro, interestRate: rate }
                  }));
                }}
                onUpdateEnterprise={(entId, ownership) => {
                  setGameState((prev) => ({
                    ...prev,
                    enterprises: prev.enterprises.map((e) => (e.id === entId ? { ...e, ownership } : e))
                  }));
                }}
                onExecuteEconomicLever={handleExecuteEconomicLever}
                onUpdateState={(updater) => setGameState(updater)}
                onLogEvent={handleLogEvent}
              />
            )}

            {/* 5. Corporate 100 & Nationalization */}
            {activeTab === 'corporate100' && (
              <Corporate100Panel
                state={gameState}
                onUpdateState={(updater) => setGameState(updater)}
                onLogEvent={handleLogEvent}
              />
            )}

            {/* 6. Industry & Trade 10x10 */}
            {activeTab === 'trade' && (
              <IndustryTradePanel
                state={gameState}
                onUpdateState={(updater) => setGameState(updater)}
                onLogEvent={handleLogEvent}
              />
            )}

            {/* 7. Stock Market, SEC & Donations */}
            {activeTab === 'stock' && (
              <StockMarketPanel
                state={gameState}
                onUpdateState={(updater) => setGameState(updater)}
                onLogEvent={handleLogEvent}
              />
            )}

            {/* 8. Shadow President & Underworld */}
            {activeTab === 'shadow' && (
              <ShadowPresidentPanel
                state={gameState}
                onUpdateState={(updater) => setGameState(updater)}
                onLogEvent={handleLogEvent}
              />
            )}

            {/* 9. Demographics & 75% Pension */}
            {activeTab === 'demographics' && (
              <DemographicsPanel
                state={gameState}
                onExecuteDemographicPolicy={handleExecuteDemographicPolicy}
                onUpdateState={(updater) => setGameState(updater)}
              />
            )}

            {/* 10. Politics, Decrees & Laws */}
            {activeTab === 'politics' && (
              <PoliticsPanel
                state={gameState}
                onUpdateLaw={handleUpdateLaw}
                onIssueEmergencyDecree={handleIssueEmergencyDecree}
                onExecutePoliticalAction={handleExecutePoliticalAction}
                onToggleCurfew={handleToggleCurfew}
              />
            )}

            {/* 11. Military, Arms & Conflicts */}
            {activeTab === 'military' && (
              <MilitaryPanel
                state={gameState}
                onUpdateMilitary={(mil) => setGameState((prev) => ({ ...prev, military: mil }))}
                onRecruitBranch={handleRecruitBranch}
                onLaunchCampaign={handleLaunchCampaign}
              />
            )}

            {/* 12. Flag & Banknote Design Studio */}
            {activeTab === 'design' && (
              <DesignStudioPanel
                state={gameState}
                onUpdateFlag={handleUpdateFlag}
                onUpdateCurrency={handleUpdateCurrency}
                onLogEvent={handleLogEvent}
              />
            )}

          </main>
        </div>
      </div>
    )}

      {/* Admin- & Cheat-Modal */}
      <CheatAdminModal
        isOpen={isCheatAdminOpen}
        onClose={() => setIsCheatAdminOpen(false)}
        state={gameState}
        onUpdateState={(updater) => setGameState(updater)}
      />

      {/* Custom Sovereign State Builder Modal */}
      <CustomNationModal
        isOpen={isCustomBuilderOpen}
        onClose={() => setIsCustomBuilderOpen(false)}
        onCreateCustomGame={handleCreateCustom}
      />

      {/* Urgent Cabinet Dilemma Event Modal */}
      <EventModal
        event={gameState.activeDilemma}
        onSelectOption={handleSelectDilemmaOption}
      />

      {/* Game Over / Victory Modal */}
      <GameOverModal
        state={gameState}
        onRestart={() => {
          setViewMode('title');
          setGameState(buildNewGame(PRESET_SCENARIOS[0]));
        }}
      />
    </div>
  );
}
