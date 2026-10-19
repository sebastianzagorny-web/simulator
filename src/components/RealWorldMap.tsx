import React, { useState } from 'react';
import { GameState, ForeignLoan, ForeignInvestment, DiplomaticTreaty } from '../types/game';
import {
  REAL_WORLD_COUNTRIES,
  RealCountryData,
  getCountryDebtBillions,
  getCountryTop10Companies,
  getCountryStateEnterprises,
  getCountryWeaponsCatalog,
  getCountryTechCatalog,
  calculateLoanTerms,
  ForeignCompany,
  ForeignStateEnterprise,
  WeaponTradeItem,
  TechTradeItem
} from '../data/realWorldMapData';
import { sound } from '../utils/sound';
import { WarSimulatorModal } from './WarSimulatorModal';
import { GoogleWorldMap } from './GoogleWorldMap';
import { SanctionsModal } from './SanctionsModal';
import { ForeignInvestmentModal } from './ForeignInvestmentModal';
import {
  Globe,
  Shield,
  Swords,
  Handshake,
  DollarSign,
  Crosshair,
  X,
  Landmark,
  Users,
  TrendingUp,
  Building,
  Factory,
  Radio,
  ExternalLink,
  ChevronRight,
  Flame,
  Award,
  Coins,
  Cpu,
  FileCheck2,
  AlertTriangle
} from 'lucide-react';

interface RealWorldMapProps {
  state: GameState;
  onLogEvent: (text: string, type: 'positive' | 'warning' | 'negative' | 'neutral') => void;
  onUpdateState: (updater: Partial<GameState> | ((prev: GameState) => GameState)) => void;
}

type CountryModalTab = 'overview' | 'invest' | 'lending' | 'treaties' | 'arms_tech';

export const RealWorldMap: React.FC<RealWorldMapProps> = ({
  state,
  onLogEvent,
  onUpdateState
}) => {
  const [countries, setCountries] = useState<RealCountryData[]>(REAL_WORLD_COUNTRIES);
  const [selectedCountry, setSelectedCountry] = useState<RealCountryData | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<RealCountryData | null>(null);
  const [activeTab, setActiveTab] = useState<CountryModalTab>('overview');

  // Map Mode: 'google' (Google Maps JavaScript API) or 'vector' (SVG War Room)
  const [mapMode, setMapMode] = useState<'google' | 'vector'>('google');

  // War simulator modal state
  const [isWarModalOpen, setIsWarModalOpen] = useState<boolean>(false);
  const [warTargetCountry, setWarTargetCountry] = useState<RealCountryData | null>(null);

  // 30 Sanctions modal state
  const [isSanctionsModalOpen, setIsSanctionsModalOpen] = useState<boolean>(false);
  const [sanctionsTargetCountry, setSanctionsTargetCountry] = useState<RealCountryData | null>(null);

  // 15 Foreign Corporations Investment modal state
  const [isForeignInvestModalOpen, setIsForeignInvestModalOpen] = useState<boolean>(false);
  const [foreignInvestTargetCountry, setForeignInvestTargetCountry] = useState<RealCountryData | null>(null);

  // Lending negotiation state
  const [loanAmountMrd, setLoanAmountMrd] = useState<number>(15);
  const [loanDurationQuarters, setLoanDurationQuarters] = useState<number>(12); // 3 Jahre

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedContinent, setSelectedContinent] = useState<string>('all');

  // Coordinates for lines (Center of Europe / Player)
  const playerCenter = { x: 505, y: 155 };

  // Helper for applying state updates
  const applyStateUpdate = (updater: (prev: GameState) => GameState) => {
    onUpdateState(updater);
  };

  // Diplomatic quick actions
  const handleDiplomaticAction = (action: 'trade_pact' | 'improve_relations' | 'alliance' | 'embargo' | 'war' | 'peace') => {
    if (!selectedCountry) return;
    const c = selectedCountry;

    switch (action) {
      case 'trade_pact': {
        if (c.tradePact) {
          const updated = { ...c, tradePact: false, relations: c.relations - 10 };
          setCountries(prev => prev.map(item => item.id === c.id ? updated : item));
          setSelectedCountry(updated);
          onLogEvent(`Freihandelsabkommen mit ${c.name} wurde beendet.`, 'warning');
          sound.playClick();
        } else {
          if (c.relations < -20) {
            onLogEvent(`${c.name} lehnt Handelsgespräche aufgrund angespannter Beziehungen ab!`, 'negative');
            sound.playCrisis();
            return;
          }
          const updated = { ...c, tradePact: true, relations: Math.min(100, c.relations + 15) };
          setCountries(prev => prev.map(item => item.id === c.id ? updated : item));
          setSelectedCountry(updated);
          applyStateUpdate(prev => ({
            ...prev,
            macro: { ...prev.macro, gdpGrowthRate: prev.macro.gdpGrowthRate + 0.15 }
          }));
          onLogEvent(`Bilateraler Freihandelsvertrag mit ${c.name} ratifiziert.`, 'positive');
          sound.playCoins();
        }
        break;
      }

      case 'improve_relations': {
        if (state.macro.treasury < 10) {
          onLogEvent('Staatskasse unzureichend für hochrangige Staatsvisite (10 Mrd. erforderlich).', 'negative');
          sound.playCrisis();
          return;
        }
        applyStateUpdate(prev => ({
          ...prev,
          macro: { ...prev.macro, treasury: prev.macro.treasury - 10 }
        }));
        const updated = { ...c, relations: Math.min(100, c.relations + 20) };
        setCountries(prev => prev.map(item => item.id === c.id ? updated : item));
        setSelectedCountry(updated);
        onLogEvent(`Diplomatische Regierungsdelegation nach ${c.capital} entsandt. Beziehungen zu ${c.name} verbessert auf +${updated.relations}.`, 'positive');
        sound.playTriumph();
        break;
      }

      case 'alliance': {
        if (c.relations < 45) {
          onLogEvent(`${c.name} lehnt Militärbündnis ab. Erfordert mindestens +45 Beziehungspunkte.`, 'negative');
          sound.playCrisis();
          return;
        }
        const updated = { ...c, relations: Math.min(100, c.relations + 25) };
        setCountries(prev => prev.map(item => item.id === c.id ? updated : item));
        setSelectedCountry(updated);
        applyStateUpdate(prev => ({
          ...prev,
          military: { ...prev.military, readinessDefcon: 4 },
          stability: Math.min(100, prev.stability + 6)
        }));
        onLogEvent(`Verteidigungsbündnis mit ${c.name} feierlich besiegelt! Globale Abschreckung gestärkt.`, 'positive');
        sound.playTriumph();
        break;
      }

      case 'embargo': {
        sound.playStamp();
        setSanctionsTargetCountry(c);
        setIsSanctionsModalOpen(true);
        break;
      }

      case 'war': {
        // Trigger War Simulator Modal!
        sound.playWarDrum();
        const updated = { ...c, atWar: true, relations: -100, tradePact: false };
        setCountries(prev => prev.map(item => item.id === c.id ? updated : item));
        setSelectedCountry(updated);
        setWarTargetCountry(updated);
        setIsWarModalOpen(true);
        break;
      }

      case 'peace': {
        if (state.macro.treasury < 20) {
          onLogEvent('Mindestens 20 Mrd. Entschädigungsgelder zur Unterzeichnung des Friedensvertrags erforderlich.', 'negative');
          return;
        }
        sound.playTriumph();
        const updated = { ...c, atWar: false, relations: 0 };
        setCountries(prev => prev.map(item => item.id === c.id ? updated : item));
        setSelectedCountry(updated);
        applyStateUpdate(prev => ({
          ...prev,
          macro: { ...prev.macro, treasury: prev.macro.treasury - 20 },
          military: { ...prev.military, readinessDefcon: 4 }
        }));
        onLogEvent(`Waffenstillstands- und Friedensvertrag mit ${c.name} unterzeichnet.`, 'positive');
        break;
      }
    }
  };

  // 1. Foreign Investment in Top 10 Company
  const handleInvestInCompany = (company: ForeignCompany, investAmountMrd: number) => {
    if (state.macro.treasury < investAmountMrd) {
      onLogEvent(`Staatskasse unzureichend für Investition in ${company.name} (${investAmountMrd} Mrd. benötigt).`, 'negative');
      sound.playCrisis();
      return;
    }

    sound.playCoins();
    const sharesPct = Number(((investAmountMrd / company.marketCapBillions) * 100).toFixed(2));
    const newInv: ForeignInvestment = {
      id: `inv-${selectedCountry!.id}-${company.id}-${Date.now()}`,
      countryId: selectedCountry!.id,
      countryName: selectedCountry!.name,
      type: 'top10_company',
      entityName: company.name,
      sector: company.sector,
      investedMrd: investAmountMrd,
      sharesPercent: sharesPct,
      quarterlyReturnPercent: company.returnRatePercent,
      lastProfitQuarterMrd: Number(((investAmountMrd * company.returnRatePercent) / 100).toFixed(3))
    };

    applyStateUpdate(prev => ({
      ...prev,
      macro: { ...prev.macro, treasury: prev.macro.treasury - investAmountMrd },
      foreignInvestments: [...(prev.foreignInvestments || []), newInv]
    }));

    onLogEvent(`Strategische Beteiligung von ${investAmountMrd} Mrd. (${sharesPct}%) an ${company.name} (${selectedCountry!.name}) erworben.`, 'positive');
  };

  // 2. Foreign Investment in State Enterprise
  const handleInvestInStateEnterprise = (enterprise: ForeignStateEnterprise, investAmountMrd: number) => {
    if (state.macro.treasury < investAmountMrd) {
      onLogEvent(`Staatskasse unzureichend für Investition in ${enterprise.name} (${investAmountMrd} Mrd. benötigt).`, 'negative');
      sound.playCrisis();
      return;
    }

    sound.playCoins();
    const sharesPct = Number(((investAmountMrd / enterprise.valuationBillions) * 100).toFixed(2));
    const newInv: ForeignInvestment = {
      id: `inv-se-${selectedCountry!.id}-${enterprise.id}-${Date.now()}`,
      countryId: selectedCountry!.id,
      countryName: selectedCountry!.name,
      type: 'state_enterprise',
      entityName: enterprise.name,
      sector: enterprise.sector,
      investedMrd: investAmountMrd,
      sharesPercent: sharesPct,
      quarterlyReturnPercent: enterprise.returnRatePercent,
      lastProfitQuarterMrd: Number(((investAmountMrd * enterprise.returnRatePercent) / 100).toFixed(3))
    };

    applyStateUpdate(prev => ({
      ...prev,
      macro: { ...prev.macro, treasury: prev.macro.treasury - investAmountMrd },
      foreignInvestments: [...(prev.foreignInvestments || []), newInv]
    }));

    onLogEvent(`Beteiligung von ${investAmountMrd} Mrd. an Staatsunternehmen ${enterprise.name} (${selectedCountry!.name}) gezeichnet.`, 'positive');
  };

  // 3. Sell Foreign Investment
  const handleSellInvestment = (invId: string, investedMrd: number, entityName: string) => {
    sound.playCoins();
    applyStateUpdate(prev => ({
      ...prev,
      macro: { ...prev.macro, treasury: prev.macro.treasury + investedMrd * 1.05 },
      foreignInvestments: (prev.foreignInvestments || []).filter(i => i.id !== invId)
    }));
    onLogEvent(`Beteiligung an ${entityName} für ${Number((investedMrd * 1.05).toFixed(2))} Mrd. erfolgreich liquidiert.`, 'positive');
  };

  // 4. Lend Money to Country (Kredit vergeben)
  const handleIssueForeignLoan = () => {
    if (!selectedCountry) return;
    if (state.macro.treasury < loanAmountMrd) {
      onLogEvent(`Staatskasse unzureichend zur Kreditvergabe (${loanAmountMrd} Mrd. erforderlich).`, 'negative');
      sound.playCrisis();
      return;
    }

    const terms = calculateLoanTerms(selectedCountry, loanAmountMrd, loanDurationQuarters);
    sound.playTriumph();

    const newLoan: ForeignLoan = {
      id: `loan-${selectedCountry.id}-${Date.now()}`,
      countryId: selectedCountry.id,
      countryName: selectedCountry.name,
      principalMrd: loanAmountMrd,
      interestRatePercent: terms.interestRatePercent,
      totalRepaymentMrd: terms.totalRepaymentMrd,
      remainingMrd: terms.totalRepaymentMrd,
      installmentQuarterlyMrd: terms.quarterlyInstallmentMrd,
      totalQuarters: loanDurationQuarters,
      remainingQuarters: loanDurationQuarters,
      riskRating: terms.riskRating
    };

    applyStateUpdate(prev => ({
      ...prev,
      macro: { ...prev.macro, treasury: prev.macro.treasury - loanAmountMrd },
      foreignLoans: [...(prev.foreignLoans || []), newLoan]
    }));

    onLogEvent(`Staatskredit über ${loanAmountMrd} Mrd. an ${selectedCountry.name} bewilligt. Ausgehandelter Zinssatz: ${terms.interestRatePercent}% p.a. (${terms.quarterlyInstallmentMrd} Mrd./Quartal).`, 'positive');
  };

  // 5. Sign Treaties
  const handleSignTreaty = (treatyType: DiplomaticTreaty['type'], title: string, benefits: string) => {
    if (!selectedCountry) return;
    sound.playStamp();

    const newTreaty: DiplomaticTreaty = {
      id: `treaty-${selectedCountry.id}-${treatyType}-${Date.now()}`,
      countryId: selectedCountry.id,
      countryName: selectedCountry.name,
      type: treatyType,
      title,
      signedYear: state.year,
      signedQuarter: state.quarter,
      benefitsDescription: benefits
    };

    applyStateUpdate(prev => ({
      ...prev,
      diplomaticTreaties: [...(prev.diplomaticTreaties || []), newTreaty],
      stability: Math.min(100, prev.stability + 4)
    }));

    onLogEvent(`Völkerrechtliches Abkommen unterzeichnet: "${title}" mit ${selectedCountry.name}.`, 'positive');
  };

  // 6. Buy / Sell Weapons & Technology
  const handleBuyWeapon = (item: WeaponTradeItem) => {
    if (state.macro.treasury < item.priceMrd) {
      onLogEvent(`Staatskasse unzureichend zum Kauf von ${item.name} (${item.priceMrd} Mrd. benötigt).`, 'negative');
      sound.playCrisis();
      return;
    }

    sound.playWarDrum();
    applyStateUpdate(prev => ({
      ...prev,
      macro: { ...prev.macro, treasury: prev.macro.treasury - item.priceMrd },
      military: {
        ...prev.military,
        infantryDivisions: prev.military.infantryDivisions + 2,
        armoredDivisions: prev.military.armoredDivisions + (item.category === 'Landstreitkräfte' ? 2 : 1),
        fighterSquadrons: prev.military.fighterSquadrons + (item.category === 'Luftwaffe' ? 3 : 0),
        navalFleets: prev.military.navalFleets + (item.category === 'Marine & U-Boote' ? 1 : 0),
        droneSwarmUnits: prev.military.droneSwarmUnits + (item.category === 'Drohnen & Roboter' ? 20 : 0)
      }
    }));

    onLogEvent(`Rüstungskauf getätigt: ${item.name} aus ${selectedCountry!.name} für ${item.priceMrd} Mrd. importiert.`, 'positive');
  };

  const handleSellWeapon = (item: WeaponTradeItem) => {
    sound.playCoins();
    applyStateUpdate(prev => ({
      ...prev,
      macro: { ...prev.macro, treasury: prev.macro.treasury + item.priceMrd * 0.9 },
      military: {
        ...prev.military,
        annualArmsExports: prev.military.annualArmsExports + item.priceMrd
      }
    }));

    onLogEvent(`Rüstungsexport genehmigt: ${item.name} an ${selectedCountry!.name} für ${Number((item.priceMrd * 0.9).toFixed(2))} Mrd. verkauft.`, 'positive');
  };

  const handleBuyTech = (tech: TechTradeItem) => {
    if (state.macro.treasury < tech.priceMrd) {
      onLogEvent(`Staatskasse unzureichend für Technologielizenz (${tech.priceMrd} Mrd. benötigt).`, 'negative');
      sound.playCrisis();
      return;
    }

    sound.playTriumph();
    applyStateUpdate(prev => ({
      ...prev,
      macro: {
        ...prev.macro,
        treasury: prev.macro.treasury - tech.priceMrd,
        gdpGrowthRate: prev.macro.gdpGrowthRate + tech.gdpBonusPercent
      },
      stability: Math.min(100, prev.stability + 5)
    }));

    onLogEvent(`Technologietransfer vollzogen: "${tech.name}" von ${selectedCountry!.name} lizenziert (+${tech.gdpBonusPercent}% BIP-Wachstum).`, 'positive');
  };

  // Filtered countries
  const filteredCountries = countries.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.isoCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesContinent = selectedContinent === 'all' || c.region.toLowerCase().includes(selectedContinent.toLowerCase());
    return matchesSearch && matchesContinent;
  });

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 overflow-hidden select-none">
      
      {/* Geopolitischer Welttheater Banner with DrawOnAMap Link & Google Maps Mode */}
      <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs gap-y-2 shrink-0">
        <div className="flex items-center gap-3 text-slate-300">
          <Globe className="w-4 h-4 text-amber-400" />
          <span className="font-['Cinzel'] font-bold text-white tracking-wider text-xs sm:text-sm">
            ECHTE WELTKARTE & GEOPOLITISCHES WELTTHEATER
          </span>
          <span className="text-slate-500 hidden xl:inline">· Google Maps API, Reale Staaten, 30 Sanktionen & Krieg</span>
        </div>

        {/* Map Mode Switcher: Google Maps vs Vector Map */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono text-[11px]">
          <button
            onClick={() => {
              setMapMode('google');
              sound.playClick();
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors cursor-pointer font-bold ${
              mapMode === 'google'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Google Maps (Echt & Interaktiv)</span>
          </button>

          <button
            onClick={() => {
              setMapMode('vector');
              sound.playClick();
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors cursor-pointer font-bold ${
              mapMode === 'vector'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Vektormodell</span>
          </button>
        </div>

        {/* Right side controls: DrawOnAMap link & legend */}
        <div className="flex items-center gap-3 font-mono text-[11px]">
          {/* External DrawOnAMap World Map link requested by user */}
          <a
            href="https://drawonamap.com/de/world-map/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors shadow-sm font-semibold"
            title="Echte Weltkarte auf drawonamap.com öffnen"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>DrawOnAMap.com</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>

          <div className="hidden lg:flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-amber-400 block" />
              <span>Freihandel</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-rose-500 block" />
              <span>Krieg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Render Google Maps Mode OR Vector Map Mode */}
      {mapMode === 'google' ? (
        <div className="relative flex-1 w-full h-full overflow-hidden">
          <GoogleWorldMap
            state={state}
            onSelectCountry={(c) => {
              setSelectedCountry(c);
              setActiveTab('overview');
            }}
            onOpenWarSimulator={(c) => {
              setWarTargetCountry(c);
              setIsWarModalOpen(true);
            }}
            onOpenSanctions={(c) => {
              setSanctionsTargetCountry(c);
              setIsSanctionsModalOpen(true);
            }}
            onOpenInvestments={(c) => {
              setForeignInvestTargetCountry(c);
              setIsForeignInvestModalOpen(true);
            }}
            onOpenLending={(c) => {
              setSelectedCountry(c);
              setActiveTab('lending');
            }}
            onOpenTreaties={(c) => {
              setSelectedCountry(c);
              setActiveTab('treaties');
            }}
            onLogEvent={onLogEvent}
          />

          {/* Details Flyout accessible on Google Maps as well */}
          {selectedCountry && (
            <div className="absolute right-3 top-3 bottom-3 w-full max-w-xl bg-slate-950/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-2xl z-30 flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-10 duration-200">
              
              {/* Modal Header */}
              <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg border border-white/20 shrink-0"
                    style={{ backgroundColor: selectedCountry.flagColor }}
                  >
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base font-['Cinzel'] text-white">
                        {selectedCountry.name}
                      </h3>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 font-mono text-amber-400 font-bold">
                        {selectedCountry.isoCode}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {selectedCountry.capital} · {selectedCountry.region} · {selectedCountry.governmentGerman}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCountry(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Tabs inside Country Inspector */}
              <div className="flex items-center gap-1 px-3 py-2 bg-slate-950 border-b border-slate-800 overflow-x-auto scrollbar-none font-mono text-xs">
                {[
                  { id: 'overview', label: 'Übersicht & Diplomatie', icon: Globe },
                  { id: 'invest', label: 'Investieren (Top 10 & Staat)', icon: Building },
                  { id: 'lending', label: 'Geld verleihen (Kredit)', icon: DollarSign },
                  { id: 'treaties', label: 'Abkommen schließen', icon: Handshake },
                  { id: 'arms_tech', label: 'Waffen & Technologie', icon: Cpu }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        sound.playClick();
                        setActiveTab(tab.id as CountryModalTab);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-semibold ${
                        isActive
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Modal Body: Active Tab View */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                
                {/* TAB 1: ÜBERSICHT & DIPLOMATIE */}
                {activeTab === 'overview' && (
                  <div className="space-y-4 font-mono text-xs">
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">BIP</span>
                        <span className="text-emerald-400 font-bold text-sm tabular-nums">
                          ${selectedCountry.gdpBillions.toLocaleString()} Mrd.
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Verschuldung</span>
                        <span className="text-rose-400 font-bold text-sm tabular-nums">
                          ${getCountryDebtBillions(selectedCountry).toLocaleString()} Mrd.
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Bevölkerung</span>
                        <span className="text-sky-400 font-bold text-sm tabular-nums">
                          {selectedCountry.populationMillions} Mio.
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Militärstärke</span>
                        <span className="text-amber-400 font-bold text-sm tabular-nums">
                          {selectedCountry.militaryScore} / 100
                        </span>
                      </div>
                    </div>

                    {/* Leader & Government Info */}
                    <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Regierungschef / Staatsoberhaupt:</span>
                        <span className="text-white font-bold">{selectedCountry.leaderGerman}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Politisches System:</span>
                        <span className="text-slate-300">{selectedCountry.governmentGerman}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Bilaterale Beziehungen:</span>
                        <span className={`font-bold ${
                          selectedCountry.relations >= 40 ? 'text-emerald-400' :
                          selectedCountry.relations >= 0 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {selectedCountry.relations > 0 ? `+${selectedCountry.relations}` : selectedCountry.relations} Punkte
                        </span>
                      </div>
                    </div>

                    {/* Diplomatic Actions Buttons */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                        Diplomatische Maßnahmen
                      </span>

                      <button
                        onClick={() => handleDiplomaticAction('trade_pact')}
                        className="w-full py-2 px-3 rounded-xl border border-slate-800 bg-slate-900 hover:border-slate-700 flex items-center justify-between text-left transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Handshake className="w-4 h-4 text-amber-400" />
                          <span>{selectedCountry.tradePact ? 'Freihandelsabkommen aufkündigen' : 'Bilateralen Freihandelsvertrag ratifizieren'}</span>
                        </span>
                        <span className="text-[10px] text-slate-400">{selectedCountry.tradePact ? 'Aktiv' : '+15 Rel / +0.15% BIP'}</span>
                      </button>

                      <button
                        onClick={() => handleDiplomaticAction('improve_relations')}
                        className="w-full py-2 px-3 rounded-xl border border-slate-800 bg-slate-900 hover:border-slate-700 flex items-center justify-between text-left transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-emerald-400" />
                          <span>Hochrangige Staatsvisite & Wirtschaftsförderung</span>
                        </span>
                        <span className="text-[10px] text-emerald-400">Kosten: 10 Mrd. (+20 Rel)</span>
                      </button>

                      <button
                        onClick={() => handleDiplomaticAction('alliance')}
                        className="w-full py-2 px-3 rounded-xl border border-slate-800 bg-slate-900 hover:border-slate-700 flex items-center justify-between text-left transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-sky-400" />
                          <span>Militärisches Verteidigungsbündnis besiegeln</span>
                        </span>
                        <span className="text-[10px] text-slate-400">Min. +45 Rel</span>
                      </button>

                      <button
                        onClick={() => handleDiplomaticAction('embargo')}
                        className="w-full py-2 px-3 rounded-xl border border-slate-800 bg-slate-900 hover:border-slate-700 flex items-center justify-between text-left transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Crosshair className="w-4 h-4 text-rose-400" />
                          <span>Wirtschaftsembargo & Sanktionen verhängen</span>
                        </span>
                        <span className="text-[10px] text-rose-400">30 Sanktionen</span>
                      </button>

                      <button
                        onClick={() => {
                          sound.playClick();
                          setForeignInvestTargetCountry(selectedCountry);
                          setIsForeignInvestModalOpen(true);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 flex items-center justify-between text-left transition-colors text-amber-300 font-bold"
                      >
                        <span className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-amber-400" />
                          <span>Investieren (Top 10 & Staat)</span>
                        </span>
                        <span className="text-[10px] text-amber-400 font-mono">15 Konzerne & Offshore</span>
                      </button>
                    </div>

                    {/* Kriegszustand erklären / Kriegssimulator Trigger */}
                    <div className="pt-2">
                      <button
                        onClick={() => handleDiplomaticAction('war')}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 hover:from-rose-600 hover:to-rose-500 font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-950/60 cursor-pointer"
                      >
                        <Swords className="w-4 h-4 animate-pulse" />
                        <span>Kriegszustand erklären & Kriegssimulator starten</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 2: INVESTIEREN IN TOP 10 UNTERNEHMEN & STAATLICHE UNTERNEHMEN */}
                {activeTab === 'invest' && (
                  <div className="space-y-4">
                    {/* Dedicated Hub Launch Banner */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/50 via-slate-900 to-slate-900 border border-amber-500/40 flex items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-xs text-white">Investitionszentrum (Top 15 & Offshore-Konten)</h4>
                        <p className="text-[10px] text-slate-300 font-mono">Investieren als Staat, mit privatem Präsidentenvermögen oder verdeckten Offshore-Konten mit 100% Übernahmemöglichkeit.</p>
                      </div>
                      <button
                        onClick={() => {
                          sound.playCoins();
                          setForeignInvestTargetCountry(selectedCountry);
                          setIsForeignInvestModalOpen(true);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 cursor-pointer shadow-md"
                      >
                        Investieren (Top 10 & Staat)
                      </button>
                    </div>

                    {/* Top 10 / 15 Konzerne */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wide">
                          Die 15 größten Konzerne von {selectedCountry.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Börsennotiert</span>
                      </div>

                      <div className="space-y-2">
                        {getCountryTop10Companies(selectedCountry.id, selectedCountry.name, selectedCountry.gdpBillions).map((comp) => {
                          const existingInv = (state.foreignInvestments || []).find(
                            i => i.countryId === selectedCountry.id && i.entityName === comp.name
                          );

                          return (
                            <div key={comp.id} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-bold text-xs text-white">{comp.name}</h4>
                                  <span className="text-[10px] text-slate-400 font-mono block">{comp.sector}</span>
                                </div>
                                <div className="text-right font-mono">
                                  <span className="text-xs font-bold text-emerald-400 block">${comp.marketCapBillions} Mrd.</span>
                                  <span className="text-[10px] text-slate-400">Rendite: {comp.returnRatePercent}% / Q</span>
                                </div>
                              </div>
                              <p className="text-[11px] text-slate-400 leading-tight">{comp.description}</p>

                              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs font-mono">
                                {existingInv ? (
                                  <div className="flex items-center justify-between w-full">
                                    <span className="text-emerald-400 font-bold">
                                      Gehalten: {existingInv.investedMrd} Mrd. ({existingInv.sharesPercent}%) · Gewinn: +{existingInv.lastProfitQuarterMrd} Mrd./Q
                                    </span>
                                    <button
                                      onClick={() => handleSellInvestment(existingInv.id, existingInv.investedMrd, comp.name)}
                                      className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 text-[10px] font-bold"
                                    >
                                      Anteile verkaufen (+5% Gewinn)
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 ml-auto">
                                    <button
                                      onClick={() => handleInvestInCompany(comp, 2)}
                                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[10px]"
                                    >
                                      2 Mrd. investieren
                                    </button>
                                    <button
                                      onClick={() => handleInvestInCompany(comp, 5)}
                                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold"
                                    >
                                      5 Mrd. investieren
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Staatliche Unternehmen */}
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wide block">
                        Staatliche Unternehmen & Infrastrukturträger
                      </span>

                      <div className="space-y-2">
                        {getCountryStateEnterprises(selectedCountry.id, selectedCountry.name).map((se) => {
                          const existingInv = (state.foreignInvestments || []).find(
                            i => i.countryId === selectedCountry.id && i.entityName === se.name
                          );

                          return (
                            <div key={se.id} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-bold text-xs text-white">{se.name}</h4>
                                  <span className="text-[10px] text-cyan-300 font-mono block">{se.sector}</span>
                                </div>
                                <div className="text-right font-mono">
                                  <span className="text-xs font-bold text-slate-200">${se.valuationBillions} Mrd.</span>
                                  <span className="text-[10px] text-emerald-400">{se.returnRatePercent}% Rendite</span>
                                </div>
                              </div>
                              <p className="text-[11px] text-slate-400">{se.strategicImportance}</p>

                              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs font-mono">
                                {existingInv ? (
                                  <div className="flex items-center justify-between w-full">
                                    <span className="text-emerald-400 font-bold">
                                      Gehalten: {existingInv.investedMrd} Mrd. ({existingInv.sharesPercent}%)
                                    </span>
                                    <button
                                      onClick={() => handleSellInvestment(existingInv.id, existingInv.investedMrd, se.name)}
                                      className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 text-[10px] font-bold"
                                    >
                                      Beteiligung auflösen
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleInvestInStateEnterprise(se, 3)}
                                    className="ml-auto px-3 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold"
                                  >
                                    3 Mrd. Beteiligung zeichnen
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: GELD AN DAS LAND VERLEIHEN (KREDITVERGABE & ZINSEN) */}
                {activeTab === 'lending' && (
                  <div className="space-y-4 font-mono text-xs">
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                      <div className="flex items-center gap-2">
                        <Landmark className="w-4 h-4 text-amber-400" />
                        <h4 className="font-bold text-sm text-white">
                          Staatskredit an {selectedCountry.name} vergeben
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 font-sans">
                        Verleihen Sie Gelder aus Ihrer Staatskasse zu einem automatisch ausgehandelten Zinssatz. Die Rückzahlung erfolgt in festgelegten Quartalsraten direkt in Ihre Staatskasse.
                      </p>

                      {/* Loan Configuration */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="text-[10px] text-slate-400 uppercase block mb-1">Kreditsumme ({state.currencySymbol} Mrd.)</label>
                          <select
                            value={loanAmountMrd}
                            onChange={(e) => setLoanAmountMrd(parseFloat(e.target.value))}
                            className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-bold"
                          >
                            <option value="5">5 Mrd. {state.currencySymbol}</option>
                            <option value="10">10 Mrd. {state.currencySymbol}</option>
                            <option value="15">15 Mrd. {state.currencySymbol}</option>
                            <option value="25">25 Mrd. {state.currencySymbol}</option>
                            <option value="50">50 Mrd. {state.currencySymbol}</option>
                            <option value="100">100 Mrd. {state.currencySymbol}</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 uppercase block mb-1">Laufzeit & Raten</label>
                          <select
                            value={loanDurationQuarters}
                            onChange={(e) => setLoanDurationQuarters(parseInt(e.target.value))}
                            className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-bold"
                          >
                            <option value="4">4 Raten (1 Jahr)</option>
                            <option value="8">8 Raten (2 Jahre)</option>
                            <option value="12">12 Raten (3 Jahre)</option>
                            <option value="20">20 Raten (5 Jahre)</option>
                            <option value="40">40 Raten (10 Jahre)</option>
                          </select>
                        </div>
                      </div>

                      {/* Auto-Negotiated Conditions Preview */}
                      {(() => {
                        const terms = calculateLoanTerms(selectedCountry, loanAmountMrd, loanDurationQuarters);
                        return (
                          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 mt-2">
                            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                              Automatisch ausgehandelte Konditionen (Bonitätsanalyse)
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                                <span className="text-[10px] text-slate-400 block">Zinssatz p.a.</span>
                                <span className="text-emerald-400 font-bold text-sm">{terms.interestRatePercent}%</span>
                              </div>
                              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                                <span className="text-[10px] text-slate-400 block">Quartalsrate</span>
                                <span className="text-white font-bold text-sm">{terms.quarterlyInstallmentMrd} Mrd.</span>
                              </div>
                              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                                <span className="text-[10px] text-slate-400 block">Gesamtrückzahlung</span>
                                <span className="text-amber-300 font-bold text-sm">{terms.totalRepaymentMrd} Mrd.</span>
                              </div>
                              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                                <span className="text-[10px] text-slate-400 block">Bonitätsrating</span>
                                <span className="text-sky-400 font-bold text-sm">{terms.riskRating}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      <button
                        onClick={handleIssueForeignLoan}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold uppercase tracking-wider transition-all shadow-md mt-2 cursor-pointer"
                      >
                        Kreditvertrag verbindlich ratifizieren ({loanAmountMrd} Mrd. auszahlen)
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 4: VÖLKERRECHTLICHE ABKOMMEN SCHLIEßEN */}
                {activeTab === 'treaties' && (
                  <div className="space-y-4 font-mono text-xs">
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wide block">
                        Diplomatische Abkommen mit {selectedCountry.name}
                      </span>

                      {[
                        { type: 'trade_pact' as const, title: 'Bilateraler Freihandels- & Investitionspakt', benefits: '+0.25% BIP-Wachstum & Zollfreiheit für Exporte' },
                        { type: 'tech_alliance' as const, title: 'Technologische & Wissenschaftliche Innovationsallianz', benefits: '+0.18% Forschungswachstum & gegenseitiger KI-Wissenstransfer' },
                        { type: 'resource_pact' as const, title: 'Strategisches Rohstoff- & Energiesicherungsabkommen', benefits: 'Sicherung von Erdöl-, Gas- und Seltene-Erden-Lieferketten' },
                        { type: 'non_aggression' as const, title: 'Feierlicher Nichtangriffs- & Friedenspakt', benefits: 'Ausschluss gegenseitiger Kriegshandlungen, +8 Stabilität' },
                        { type: 'defense_pact' as const, title: 'Gemeinsames Militärisches Beistandsbündnis', benefits: 'Verteidigungsbeistand im Angriffsfall, Abschreckung' }
                      ].map((t) => {
                        const isSigned = (state.diplomaticTreaties || []).some(
                          dt => dt.countryId === selectedCountry.id && dt.type === t.type
                        );

                        return (
                          <div key={t.type} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-white text-xs">{t.title}</h4>
                              {isSigned ? (
                                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                                  Ratifiziert
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400">Offener Entwurf</span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-300 font-sans">{t.benefits}</p>
                            {!isSigned && (
                              <button
                                onClick={() => handleSignTreaty(t.type, t.title, t.benefits)}
                                className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
                              >
                                Abkommen feierlich unterzeichnen
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 5: WAFFEN & TECHNOLOGIE KAUFEN / VERKAUFEN */}
                {activeTab === 'arms_tech' && (
                  <div className="space-y-4 font-mono text-xs">
                    {/* Rüstungsmarkt */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-rose-400 uppercase tracking-wide block">
                        Rüstungsgüter & Militärtechnik von {selectedCountry.name}
                      </span>

                      <div className="space-y-2">
                        {getCountryWeaponsCatalog(selectedCountry.id).map((wpn) => (
                          <div key={wpn.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-bold text-white text-xs">{wpn.name}</span>
                                <span className="text-[10px] text-slate-400 block">{wpn.category}</span>
                              </div>
                              <span className="text-rose-400 font-bold">${wpn.priceMrd} Mrd.</span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-sans">{wpn.description}</p>
                            <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                              <span className="text-[10px] text-amber-400">+{wpn.powerBonus} Kampfkraft</span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleSellWeapon(wpn)}
                                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[10px]"
                                >
                                  Verkaufen (+${(wpn.priceMrd * 0.9).toFixed(1)} Mrd.)
                                </button>
                                <button
                                  onClick={() => handleBuyWeapon(wpn)}
                                  className="px-2.5 py-1 rounded bg-rose-600/30 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 text-[10px] font-bold"
                                >
                                  Kaufen
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Technologiemarkt */}
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide block">
                        Technologietransfer & Forschungslizenzen
                      </span>

                      <div className="space-y-2">
                        {getCountryTechCatalog(selectedCountry.id).map((tech) => (
                          <div key={tech.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-white text-xs">{tech.name}</span>
                              <span className="text-cyan-400 font-bold">${tech.priceMrd} Mrd.</span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-sans">{tech.description}</p>
                            <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                              <span className="text-[10px] text-emerald-400">+{tech.gdpBonusPercent}% Dauerhafter BIP-Schub</span>
                              <button
                                onClick={() => handleBuyTech(tech)}
                                className="px-3 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold"
                              >
                                Technologie lizenzieren
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

        </div>
      ) : (
        /* Vector Map Mode */
        <div className="relative flex-1 flex flex-col w-full h-full overflow-hidden">
          {/* Search & Continent Filter Bar for Vector Map */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-2 bg-slate-950/90 border-b border-slate-900 text-xs gap-3 shrink-0">
            <input
              type="text"
              placeholder="Staat suchen (z.B. USA, Deutschland, China, Frankreich)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs w-64 focus:outline-none focus:border-amber-400"
            />

            <div className="flex items-center gap-1 overflow-x-auto font-mono text-[11px]">
              {[
                { id: 'all', label: 'Alle' },
                { id: 'europa', label: 'Europa' },
                { id: 'nordamerika', label: 'Nordamerika' },
                { id: 'südamerika', label: 'Südamerika' },
                { id: 'asien', label: 'Asien' },
                { id: 'afrika', label: 'Afrika' },
                { id: 'ozeanien', label: 'Ozeanien' }
              ].map((cont) => (
                <button
                  key={cont.id}
                  onClick={() => setSelectedContinent(cont.id)}
                  className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                    selectedContinent === cont.id
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white bg-slate-900/60'
                  }`}
                >
                  {cont.label}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Interactive Geopolitical World Map */}
          <div className="relative flex-1 bg-[#070b12] flex items-center justify-center overflow-hidden">
        
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full max-h-[720px] select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id="worldOcean" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0d1527" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#040711" stopOpacity="1" />
            </radialGradient>
            <pattern id="latLongGrid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Oceans & Grid */}
          <rect width="1000" height="500" fill="url(#worldOcean)" />
          <rect width="1000" height="500" fill="url(#latLongGrid)" />

          {/* Continental Background Masses */}
          <g fill="#111827" stroke="#1f2937" strokeWidth="1" opacity="0.6">
            <path d="M 330 40 L 400 35 L 420 70 L 360 85 L 325 55 Z" />
            <path d="M 100 20 L 900 20 L 850 40 L 150 40 Z" />
            <path d="M 100 480 L 900 480 L 850 460 L 150 460 Z" />
          </g>

          {/* Connection Lines (Trade & War) */}
          {countries.map((country) => {
            const isTrade = country.tradePact;
            const isWar = country.atWar;
            if (!isTrade && !isWar) return null;

            return (
              <line
                key={`line-${country.id}`}
                x1={playerCenter.x}
                y1={playerCenter.y}
                x2={country.center.x}
                y2={country.center.y}
                stroke={isWar ? '#ef4444' : '#f59e0b'}
                strokeWidth={isWar ? 2.5 : 1.5}
                strokeDasharray={isWar ? 'none' : '4 4'}
                className={isWar ? 'animate-pulse' : ''}
              />
            );
          })}

          {/* Country SVG Paths */}
          {filteredCountries.map((country) => {
            const isSelected = selectedCountry?.id === country.id;
            const isHovered = hoveredCountry?.id === country.id;

            let fillColor = "#1e293b";
            if (country.atWar) fillColor = "#7f1d1d";
            else if (country.tradePact) fillColor = "#1e3a5f";
            else if (isSelected) fillColor = "#334155";
            else if (isHovered) fillColor = "#293548";

            return (
              <g
                key={country.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedCountry(country);
                  setActiveTab('overview');
                }}
                onMouseEnter={() => setHoveredCountry(country)}
                onMouseLeave={() => setHoveredCountry(null)}
                className="cursor-pointer transition-all duration-150"
              >
                <path
                  d={country.path}
                  fill={fillColor}
                  stroke={isSelected ? '#f59e0b' : country.atWar ? '#ef4444' : isHovered ? '#94a3b8' : '#334155'}
                  strokeWidth={isSelected ? 2.5 : isHovered ? 1.8 : 1.2}
                />

                <circle
                  cx={country.center.x}
                  cy={country.center.y}
                  r={isSelected ? 5.5 : 3.5}
                  fill={country.flagColor}
                  stroke="#ffffff"
                  strokeWidth="1.2"
                />

                <text
                  x={country.center.x}
                  y={country.center.y - 7}
                  fill={isSelected ? '#f59e0b' : '#94a3b8'}
                  fontSize="8"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="monospace"
                  className="pointer-events-none drop-shadow"
                >
                  {country.isoCode}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Country Tooltip */}
        {hoveredCountry && !selectedCountry && (
          <div
            className="absolute z-20 pointer-events-none bg-slate-950/95 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs font-mono max-w-xs"
            style={{
              left: `${Math.min(window.innerWidth - 240, Math.max(20, (hoveredCountry.center.x / 1000) * window.innerWidth - 60))}px`,
              top: `${Math.min(window.innerHeight - 200, Math.max(80, (hoveredCountry.center.y / 500) * (window.innerHeight - 150)))}px`
            }}
          >
            <div className="flex items-center gap-2 font-bold text-white mb-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hoveredCountry.flagColor }} />
              <span>{hoveredCountry.name}</span>
            </div>
            <div className="text-[11px] text-slate-300">
              BIP: ${hoveredCountry.gdpBillions.toLocaleString()} Mrd. · Schulden: ${getCountryDebtBillions(hoveredCountry).toLocaleString()} Mrd.
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Militär: {hoveredCountry.militaryScore}/100 · Klicken für Investitionen, Kredite & Diplomatie
            </div>
          </div>
        )}

        {/* COMPREHENSIVE COUNTRY DETAIL MODAL / FLYOUT */}
        {selectedCountry && (
          <div className="absolute right-3 top-3 bottom-3 w-full max-w-xl bg-slate-950/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-2xl z-30 flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-10 duration-200">
            
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg border border-white/20 shrink-0"
                  style={{ backgroundColor: selectedCountry.flagColor }}
                >
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base font-['Cinzel'] text-white">
                      {selectedCountry.name}
                    </h3>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 font-mono text-amber-400 font-bold">
                      {selectedCountry.isoCode}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedCountry.capital} · {selectedCountry.region} · {selectedCountry.governmentGerman}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedCountry(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs inside Country Inspector */}
            <div className="flex items-center gap-1 px-3 py-2 bg-slate-950 border-b border-slate-800 overflow-x-auto scrollbar-none font-mono text-xs">
              {[
                { id: 'overview', label: 'Übersicht & Diplomatie', icon: Globe },
                { id: 'invest', label: 'Investieren (Top 10 & Staat)', icon: Building },
                { id: 'lending', label: 'Geld verleihen (Kredit)', icon: DollarSign },
                { id: 'treaties', label: 'Abkommen schließen', icon: Handshake },
                { id: 'arms_tech', label: 'Waffen & Technologie', icon: Cpu }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      sound.playClick();
                      setActiveTab(tab.id as CountryModalTab);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-semibold ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body: Active Tab View */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {/* TAB 1: ÜBERSICHT & DIPLOMATIE */}
              {activeTab === 'overview' && (
                <div className="space-y-4 font-mono text-xs">
                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">BIP</span>
                      <span className="text-emerald-400 font-bold text-sm tabular-nums">
                        ${selectedCountry.gdpBillions.toLocaleString()} Mrd.
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Verschuldung</span>
                      <span className="text-rose-400 font-bold text-sm tabular-nums">
                        ${getCountryDebtBillions(selectedCountry).toLocaleString()} Mrd.
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Bevölkerung</span>
                      <span className="text-sky-400 font-bold text-sm tabular-nums">
                        {selectedCountry.populationMillions} Mio.
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Militärstärke</span>
                      <span className="text-amber-400 font-bold text-sm tabular-nums">
                        {selectedCountry.militaryScore} / 100
                      </span>
                    </div>
                  </div>

                  {/* Leader & Government Info */}
                  <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Regierungschef / Staatsoberhaupt:</span>
                      <span className="text-white font-bold">{selectedCountry.leaderGerman}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Politisches System:</span>
                      <span className="text-slate-300">{selectedCountry.governmentGerman}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Bilaterale Beziehungen:</span>
                      <span className={`font-bold ${
                        selectedCountry.relations >= 40 ? 'text-emerald-400' :
                        selectedCountry.relations >= 0 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {selectedCountry.relations > 0 ? `+${selectedCountry.relations}` : selectedCountry.relations} Punkte
                      </span>
                    </div>
                  </div>

                  {/* Diplomatic Actions Buttons */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      Diplomatische Maßnahmen
                    </span>

                    <button
                      onClick={() => handleDiplomaticAction('trade_pact')}
                      className="w-full py-2 px-3 rounded-xl border border-slate-800 bg-slate-900 hover:border-slate-700 flex items-center justify-between text-left transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Handshake className="w-4 h-4 text-amber-400" />
                        <span>{selectedCountry.tradePact ? 'Freihandelsvertrag aufkündigen' : 'Freihandelsvertrag ratifizieren'}</span>
                      </span>
                      <span className="text-[10px] text-amber-400">+0.15% BIP-Wachstum</span>
                    </button>

                    <button
                      onClick={() => handleDiplomaticAction('improve_relations')}
                      className="w-full py-2 px-3 rounded-xl border border-slate-800 bg-slate-900 hover:border-slate-700 flex items-center justify-between text-left transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-emerald-400" />
                        <span>Staatsvisite & Beziehungen verbessern</span>
                      </span>
                      <span className="text-[10px] text-slate-400">10 Mrd. {state.currencySymbol} (+20 Rel)</span>
                    </button>

                    <button
                      onClick={() => handleDiplomaticAction('alliance')}
                      className="w-full py-2 px-3 rounded-xl border border-slate-800 bg-slate-900 hover:border-slate-700 flex items-center justify-between text-left transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-sky-400" />
                        <span>Militärisches Verteidigungsbündnis besiegeln</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Min. +45 Rel</span>
                    </button>

                    <button
                      onClick={() => handleDiplomaticAction('embargo')}
                      className="w-full py-2 px-3 rounded-xl border border-slate-800 bg-slate-900 hover:border-slate-700 flex items-center justify-between text-left transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Crosshair className="w-4 h-4 text-rose-400" />
                        <span>Wirtschaftsembargo & Sanktionen verhängen</span>
                      </span>
                      <span className="text-[10px] text-rose-400">30 Sanktionen</span>
                    </button>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setForeignInvestTargetCountry(selectedCountry);
                        setIsForeignInvestModalOpen(true);
                      }}
                      className="w-full py-2.5 px-3 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 flex items-center justify-between text-left transition-colors text-amber-300 font-bold"
                    >
                      <span className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-amber-400" />
                        <span>Investieren (Top 10 & Staat)</span>
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono">15 Konzerne & Offshore</span>
                    </button>
                  </div>

                  {/* Kriegszustand erklären / Kriegssimulator Trigger */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleDiplomaticAction('war')}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 hover:from-rose-600 hover:to-rose-500 font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-950/60 cursor-pointer"
                    >
                      <Swords className="w-4 h-4 animate-pulse" />
                      <span>Kriegszustand erklären & Kriegssimulator starten</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: INVESTIEREN IN TOP 10 UNTERNEHMEN & STAATLICHE UNTERNEHMEN */}
              {activeTab === 'invest' && (
                <div className="space-y-4">
                  {/* Dedicated Hub Launch Banner */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/50 via-slate-900 to-slate-900 border border-amber-500/40 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-xs text-white">Investitionszentrum (Top 15 & Offshore-Konten)</h4>
                      <p className="text-[10px] text-slate-300 font-mono">Investieren als Staat, mit privatem Präsidentenvermögen oder verdeckten Offshore-Konten mit 100% Übernahmemöglichkeit.</p>
                    </div>
                    <button
                      onClick={() => {
                        sound.playCoins();
                        setForeignInvestTargetCountry(selectedCountry);
                        setIsForeignInvestModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 cursor-pointer shadow-md"
                    >
                      Investieren (Top 10 & Staat)
                    </button>
                  </div>

                  {/* Top 10 / 15 Konzerne */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wide">
                        Die 15 größten Konzerne von {selectedCountry.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Börsennotiert</span>
                    </div>

                    <div className="space-y-2">
                      {getCountryTop10Companies(selectedCountry.id, selectedCountry.name, selectedCountry.gdpBillions).map((comp) => {
                        const existingInv = (state.foreignInvestments || []).find(
                          i => i.countryId === selectedCountry.id && i.entityName === comp.name
                        );

                        return (
                          <div key={comp.id} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-bold text-xs text-white">{comp.name}</h4>
                                <span className="text-[10px] text-slate-400 font-mono block">{comp.sector}</span>
                              </div>
                              <div className="text-right font-mono">
                                <span className="text-xs font-bold text-emerald-400 block">${comp.marketCapBillions} Mrd.</span>
                                <span className="text-[10px] text-slate-400">Rendite: {comp.returnRatePercent}% / Q</span>
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-tight">{comp.description}</p>

                            <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs font-mono">
                              {existingInv ? (
                                <div className="flex items-center justify-between w-full">
                                  <span className="text-emerald-400 font-bold">
                                    Gehalten: {existingInv.investedMrd} Mrd. ({existingInv.sharesPercent}%) · Gewinn: +{existingInv.lastProfitQuarterMrd} Mrd./Q
                                  </span>
                                  <button
                                    onClick={() => handleSellInvestment(existingInv.id, existingInv.investedMrd, comp.name)}
                                    className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 text-[10px] font-bold"
                                  >
                                    Anteile verkaufen (+5% Gewinn)
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 ml-auto">
                                  <button
                                    onClick={() => handleInvestInCompany(comp, 2)}
                                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[10px]"
                                  >
                                    2 Mrd. investieren
                                  </button>
                                  <button
                                    onClick={() => handleInvestInCompany(comp, 5)}
                                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold"
                                  >
                                    5 Mrd. investieren
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Staatliche Unternehmen */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wide block">
                      Staatliche Unternehmen & Infrastrukturträger
                    </span>

                    <div className="space-y-2">
                      {getCountryStateEnterprises(selectedCountry.id, selectedCountry.name).map((se) => {
                        const existingInv = (state.foreignInvestments || []).find(
                          i => i.countryId === selectedCountry.id && i.entityName === se.name
                        );

                        return (
                          <div key={se.id} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-bold text-xs text-white">{se.name}</h4>
                                <span className="text-[10px] text-cyan-300 font-mono block">{se.sector}</span>
                              </div>
                              <div className="text-right font-mono">
                                <span className="text-xs font-bold text-slate-200">${se.valuationBillions} Mrd.</span>
                                <span className="text-[10px] text-emerald-400">{se.returnRatePercent}% Rendite</span>
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-400">{se.strategicImportance}</p>

                            <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs font-mono">
                              {existingInv ? (
                                <div className="flex items-center justify-between w-full">
                                  <span className="text-emerald-400 font-bold">
                                    Gehalten: {existingInv.investedMrd} Mrd. ({existingInv.sharesPercent}%)
                                  </span>
                                  <button
                                    onClick={() => handleSellInvestment(existingInv.id, existingInv.investedMrd, se.name)}
                                    className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 text-[10px] font-bold"
                                  >
                                    Beteiligung auflösen
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleInvestInStateEnterprise(se, 3)}
                                  className="ml-auto px-3 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold"
                                >
                                  3 Mrd. Beteiligung zeichnen
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: GELD AN DAS LAND VERLEIHEN (KREDITVERGABE & ZINSEN) */}
              {activeTab === 'lending' && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-amber-400" />
                      <h4 className="font-bold text-sm text-white">
                        Staatskredit an {selectedCountry.name} vergeben
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400 font-sans">
                      Verleihen Sie Gelder aus Ihrer Staatskasse zu einem automatisch ausgehandelten Zinssatz. Die Rückzahlung erfolgt in festgelegten Quartalsraten direkt in Ihre Staatskasse.
                    </p>

                    {/* Loan Configuration */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase block mb-1">Kreditsumme ({state.currencySymbol} Mrd.)</label>
                        <select
                          value={loanAmountMrd}
                          onChange={(e) => setLoanAmountMrd(parseFloat(e.target.value))}
                          className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-bold"
                        >
                          <option value="5">5 Mrd. {state.currencySymbol}</option>
                          <option value="10">10 Mrd. {state.currencySymbol}</option>
                          <option value="15">15 Mrd. {state.currencySymbol}</option>
                          <option value="25">25 Mrd. {state.currencySymbol}</option>
                          <option value="50">50 Mrd. {state.currencySymbol}</option>
                          <option value="100">100 Mrd. {state.currencySymbol}</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 uppercase block mb-1">Laufzeit & Raten</label>
                        <select
                          value={loanDurationQuarters}
                          onChange={(e) => setLoanDurationQuarters(parseInt(e.target.value))}
                          className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-bold"
                        >
                          <option value="4">4 Raten (1 Jahr)</option>
                          <option value="8">8 Raten (2 Jahre)</option>
                          <option value="12">12 Raten (3 Jahre)</option>
                          <option value="20">20 Raten (5 Jahre)</option>
                          <option value="40">40 Raten (10 Jahre)</option>
                        </select>
                      </div>
                    </div>

                    {/* Negotiated Terms Preview */}
                    {(() => {
                      const terms = calculateLoanTerms(selectedCountry, loanAmountMrd, loanDurationQuarters);
                      return (
                        <div className="p-3 rounded-lg bg-slate-950 border border-amber-500/30 space-y-2 mt-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">Ausgehandelter Zinssatz:</span>
                            <span className="text-amber-400 font-bold text-sm">{terms.interestRatePercent}% p.a.</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">Bonitäts-Rating des Landes:</span>
                            <span className="text-white font-bold">{terms.riskRating}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">Vierteljährliche Rate (Tilgung + Zins):</span>
                            <span className="text-emerald-400 font-bold">{terms.quarterlyInstallmentMrd} Mrd. / Quartal</span>
                          </div>
                          <div className="flex justify-between items-center text-xs border-t border-slate-800 pt-1.5">
                            <span className="text-slate-300 font-bold">Gesamtrückzahlung an Staatskasse:</span>
                            <span className="text-emerald-400 font-bold text-sm">{terms.totalRepaymentMrd} Mrd.</span>
                          </div>
                        </div>
                      );
                    })()}

                    <button
                      onClick={handleIssueForeignLoan}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                    >
                      Staatskredit verbindlich vereinbaren & auszahlen
                    </button>
                  </div>

                  {/* Active Loans to this Country */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
                      Aktive Kredite an {selectedCountry.name}
                    </span>
                    {((state.foreignLoans || []).filter(l => l.countryId === selectedCountry.id)).length === 0 ? (
                      <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-slate-500 text-center">
                        Keine aktiven Kredite vergeben.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {(state.foreignLoans || [])
                          .filter(l => l.countryId === selectedCountry.id)
                          .map((loan) => (
                            <div key={loan.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                              <div className="flex justify-between font-bold text-white">
                                <span>Kredit #{loan.id.slice(-6)} ({loan.riskRating})</span>
                                <span className="text-amber-400">{loan.interestRatePercent}% p.a.</span>
                              </div>
                              <div className="flex justify-between text-slate-400 text-[11px]">
                                <span>Restforderung: {loan.remainingMrd} Mrd.</span>
                                <span>Quartalsrate: +{loan.installmentQuarterlyMrd} Mrd.</span>
                              </div>
                              <div className="flex justify-between text-slate-400 text-[10px]">
                                <span>Verbleibende Raten: {loan.remainingQuarters} von {loan.totalQuarters}</span>
                                <span className="text-emerald-400">Zahlungsstatus: Pünktlich</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: ABKOMMEN SCHLIESSEN */}
              {activeTab === 'treaties' && (
                <div className="space-y-3 font-mono text-xs">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wide block">
                    Internationale Staatsverträge & Pakte
                  </span>

                  {[
                    { type: 'trade_pact' as const, title: 'Umfassendes Freihandels- & Zollabbauabkommen', benefits: '+0.15% jährliches BIP-Wachstum und garantierter Exportmarkt', minRel: -10 },
                    { type: 'defense_pact' as const, title: 'Bilateraler Sicherheits- & Beistandspakt', benefits: 'Militärische Beistandsgarantie im Angriffsfall und DEFCON-Absicherung', minRel: 40 },
                    { type: 'tech_alliance' as const, title: 'Technologie- & Wissenschafts-Allianz', benefits: 'Gemeinsame Forschungsprogramme (+0.2% Innovationsrate)', minRel: 25 },
                    { type: 'resource_pact' as const, title: 'Strategisches Rohstoff- & Energieabkommen', benefits: 'Garantierte Lieferkontingente von Erdöl, Gas und seltenen Erden', minRel: 10 },
                    { type: 'non_aggression' as const, title: 'Völkerrechtlicher Nichtangriffspakt', benefits: 'Verpflichtung zur friedlichen Streitbeilegung und Grenzsicherung', minRel: 0 },
                    { type: 'customs_union' as const, title: 'Währungs- & Zollunion', benefits: 'Gemeinsamer Binnenmarkt mit Steuervorteilen für Konzerne', minRel: 50 }
                  ].map((tr, idx) => {
                    const isSigned = (state.diplomaticTreaties || []).some(
                      t => t.countryId === selectedCountry.id && t.type === tr.type
                    );
                    const canSign = selectedCountry.relations >= tr.minRel;

                    return (
                      <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                        <div className="flex items-start justify-between">
                          <h4 className="font-bold text-white text-xs">{tr.title}</h4>
                          {isSigned ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                              Ratifiziert
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">Min. {tr.minRel} Rel</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-sans">{tr.benefits}</p>

                        {!isSigned && (
                          <div className="pt-1 flex justify-end">
                            <button
                              disabled={!canSign}
                              onClick={() => handleSignTreaty(tr.type, tr.title, tr.benefits)}
                              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                                canSign
                                  ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 cursor-pointer'
                                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                              }`}
                            >
                              {canSign ? 'Vertrag unterzeichnen' : `Beziehungen unzureichend (erfordert +${tr.minRel})`}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 5: WAFFEN & TECHNOLOGIE KAUFEN UND VERKAUFEN */}
              {activeTab === 'arms_tech' && (
                <div className="space-y-4 font-mono text-xs">
                  {/* Weapons Trade */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                        Waffenhandel mit {selectedCountry.name}
                      </span>
                      <span className="text-[10px] text-slate-400">Rüstungsmarkt</span>
                    </div>

                    <div className="space-y-2">
                      {getCountryWeaponsCatalog(selectedCountry.id).map((wpn) => (
                        <div key={wpn.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-white text-xs">{wpn.name}</span>
                            <span className="text-amber-400 font-bold">${wpn.priceMrd} Mrd.</span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-sans">{wpn.description}</p>
                          <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                            <span className="text-[10px] text-slate-400">{wpn.category} · +{wpn.powerBonus} Stärke</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleSellWeapon(wpn)}
                                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[10px]"
                              >
                                Eigene verkaufen
                              </button>
                              <button
                                onClick={() => handleBuyWeapon(wpn)}
                                className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px]"
                              >
                                Kaufen
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technology Transfer */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide block">
                      Technologietransfer & Forschungslizenzen
                    </span>

                    <div className="space-y-2">
                      {getCountryTechCatalog(selectedCountry.id).map((tech) => (
                        <div key={tech.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-white text-xs">{tech.name}</span>
                            <span className="text-cyan-400 font-bold">${tech.priceMrd} Mrd.</span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-sans">{tech.description}</p>
                          <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                            <span className="text-[10px] text-emerald-400">+{tech.gdpBonusPercent}% Dauerhafter BIP-Schub</span>
                            <button
                              onClick={() => handleBuyTech(tech)}
                              className="px-3 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold"
                            >
                              Technologie lizenzieren
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </div>
        </div>
      )}

      {/* Diplomatic Chronicle Ticker */}
      <div className="px-6 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center gap-3 overflow-x-auto text-[11px] font-mono text-slate-400 shrink-0">
        <span className="text-amber-400 font-bold uppercase shrink-0">Diplomatischer Ticker:</span>
        <div className="truncate">
          {state.historyLog[0]?.text || 'Alle internationalen Grenzstationen und Botschaften melden normalen Dienstbetrieb.'}
        </div>
      </div>

      {/* WAR SIMULATOR MODAL */}
      {isWarModalOpen && warTargetCountry && (
        <WarSimulatorModal
          isOpen={isWarModalOpen}
          onClose={() => {
            setIsWarModalOpen(false);
            setWarTargetCountry(null);
          }}
          targetCountry={warTargetCountry}
          state={state}
          onUpdateState={applyStateUpdate}
          onLogEvent={onLogEvent}
        />
      )}

      {/* 30 WIRTSCHAFTSSANKTIONEN & EMBARGO MODAL */}
      {isSanctionsModalOpen && sanctionsTargetCountry && (
        <SanctionsModal
          isOpen={isSanctionsModalOpen}
          onClose={() => {
            setIsSanctionsModalOpen(false);
            setSanctionsTargetCountry(null);
          }}
          targetCountry={sanctionsTargetCountry}
          state={state}
          onUpdateState={applyStateUpdate}
          onLogEvent={onLogEvent}
        />
      )}

      {/* 15 KONZERNE, STAATS- & OFFSHORE-INVESTITIONEN MODAL */}
      {isForeignInvestModalOpen && foreignInvestTargetCountry && (
        <ForeignInvestmentModal
          isOpen={isForeignInvestModalOpen}
          onClose={() => {
            setIsForeignInvestModalOpen(false);
            setForeignInvestTargetCountry(null);
          }}
          targetCountry={foreignInvestTargetCountry}
          state={state}
          onUpdateState={applyStateUpdate}
          onLogEvent={onLogEvent}
        />
      )}

    </div>
  );
};
