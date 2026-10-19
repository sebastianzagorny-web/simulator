import React, { useState, useEffect } from 'react';
import { GameState, MilitaryBranches, WarReparation } from '../types/game';
import { RealCountryData, getCountryDebtBillions } from '../data/realWorldMapData';
import { sound } from '../utils/sound';
import {
  ShieldAlert,
  Swords,
  Crosshair,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Globe2,
  ExternalLink,
  Flame,
  Award,
  AlertTriangle,
  Zap,
  CheckCircle2,
  XCircle,
  Radio,
  X
} from 'lucide-react';

interface WarSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetCountry: RealCountryData;
  state: GameState;
  onUpdateState: (updater: (prev: GameState) => GameState) => void;
  onLogEvent: (text: string, type: 'positive' | 'warning' | 'negative' | 'neutral') => void;
}

export const WarSimulatorModal: React.FC<WarSimulatorModalProps> = ({
  isOpen,
  onClose,
  targetCountry,
  state,
  onUpdateState,
  onLogEvent
}) => {
  if (!isOpen) return null;

  // Armed forces availability from player's military
  const m = state.military;
  const initialAvailable = {
    infantryDivisions: m.infantryDivisions || 40,
    armoredDivisions: m.armoredDivisions || 20,
    specialForcesUnits: m.specialForcesUnits || 12,
    fighterSquadrons: m.fighterSquadrons || 30,
    navalFleets: m.navalFleets || 10,
    submarines: m.submarines || 15,
    nuclearSubmarines: m.nuclearSubmarines || 6,
    warships: m.warships || 28,
    nuclearAircraftCarriers: m.nuclearAircraftCarriers || 2,
    combatSatellites: m.combatSatellites || 4,
    strategicNuclearWeapons: m.strategicNuclearWeapons || 120,
    droneSwarmUnits: m.droneSwarmUnits || 100,
    roboticsLegions: m.roboticsLegions || 35
  };

  // Deployed forces into this conflict
  const [deployed, setDeployed] = useState({
    infantryDivisions: Math.round(initialAvailable.infantryDivisions * 0.7),
    armoredDivisions: Math.round(initialAvailable.armoredDivisions * 0.7),
    specialForcesUnits: Math.round(initialAvailable.specialForcesUnits * 0.8),
    fighterSquadrons: Math.round(initialAvailable.fighterSquadrons * 0.75),
    navalFleets: Math.round(initialAvailable.navalFleets * 0.6),
    submarines: Math.round(initialAvailable.submarines * 0.7),
    nuclearSubmarines: Math.round(initialAvailable.nuclearSubmarines * 0.5),
    warships: Math.round(initialAvailable.warships * 0.65),
    nuclearAircraftCarriers: Math.max(1, Math.round(initialAvailable.nuclearAircraftCarriers * 0.5)),
    combatSatellites: Math.round(initialAvailable.combatSatellites * 0.75),
    strategicNuclearWeapons: 0, // Spieler entscheidet über nukleare Eskalation
    droneSwarmUnits: Math.round(initialAvailable.droneSwarmUnits * 0.8),
    roboticsLegions: Math.round(initialAvailable.roboticsLegions * 0.75)
  });

  // 4 Attack stages: 1 to 4
  const [currentAttackStage, setCurrentAttackStage] = useState<number>(1);
  const [isExecutingAttack, setIsExecutingAttack] = useState<boolean>(false);
  const [warStatus, setWarStatus] = useState<'ongoing' | 'player_victory' | 'player_defeat'>('ongoing');
  
  // Real-time metrics
  const [totalWarCostMrd, setTotalWarCostMrd] = useState<number>(4.5);
  const [territoryGainedPercent, setTerritoryGainedPercent] = useState<number>(5);

  // Losses in real time
  const [playerLosses, setPlayerLosses] = useState({
    infantryLosses: 1200,
    tanksDestroyed: 18,
    jetsShotDown: 4,
    shipsLost: 1,
    dronesLost: 24
  });

  const [enemyLosses, setEnemyLosses] = useState({
    infantryLosses: 3400,
    tanksDestroyed: 54,
    jetsShotDown: 14,
    shipsLost: 3,
    dronesLost: 60
  });

  const [combatLogs, setCombatLogs] = useState<string[]>([
    `KRIEGSERKLÄRUNG an ${targetCountry.name}: Militärischer Oberbefehlshaber hat Kriegszustand ausgerufen.`,
    `Gefechtsbereitschaft auf DEFCON 1 hochgefahren. Aufklärungssatelliten fokussieren auf ${targetCountry.capital}.`
  ]);

  // Selected Tactical Doctrine per stage
  const [selectedDoctrine, setSelectedDoctrine] = useState<string>('balanced');
  const [cpuReactionText, setCpuReactionText] = useState<string>('');
  const [postWarResolutionChosen, setPostWarResolutionChosen] = useState<boolean>(false);

  // Calculate victory probability based on force strength, technology, and enemy militaryScore
  const playerCombatScore = 
    deployed.infantryDivisions * 4 +
    deployed.armoredDivisions * 8 +
    deployed.specialForcesUnits * 10 +
    deployed.fighterSquadrons * 9 +
    deployed.navalFleets * 12 +
    deployed.submarines * 7 +
    deployed.nuclearSubmarines * 16 +
    deployed.warships * 8 +
    deployed.nuclearAircraftCarriers * 35 +
    deployed.combatSatellites * 15 +
    deployed.strategicNuclearWeapons * 50 +
    deployed.droneSwarmUnits * 2.5 +
    deployed.roboticsLegions * 6;

  const enemyCombatScore = Math.max(80, targetCountry.militaryScore * 8.5 + (targetCountry.gdpBillions * 0.04));
  const rawWinProbability = Math.round((playerCombatScore / (playerCombatScore + enemyCombatScore)) * 100);
  const winProbability = Math.min(98, Math.max(12, rawWinProbability));

  // Attack Descriptions
  const attackStagesData = [
    {
      stage: 1,
      title: 'Angriff 1/4: Erstschlag, Luftüberlegenheit & Cyber-Offensive',
      description: 'Zerstörung feindlicher Frühwarnradare, Ausschaltung von Kommunikationsknoten und Etablierung einer lückenlosen Luftherrschaft über dem Zielgebiet.',
      doctrines: [
        { id: 'precision', label: 'Präzisions-Tarnkappenangriff', risk: 'Gering', bonus: '+15% Effizienz bei geringen Kollateralschäden', costMrd: 6.2 },
        { id: 'massive', label: 'Massiver Marschflugkörper-Teppich', risk: 'Mittel', bonus: '+35% Zerstörungskraft gegen feindliche Luftabwehr', costMrd: 12.5 },
        { id: 'cyber', label: 'Globaler Cyber- & Satelliten-Blackout', risk: 'Hoch', bonus: 'Feindliche Radar- und Lenkwaffensysteme temporär blind', costMrd: 4.8 }
      ]
    },
    {
      stage: 2,
      title: 'Angriff 2/4: Raketenartillerie, U-Boot-Duelle & Flottenschlacht',
      description: 'Seegefechte um kritische Meerengen, Abriegelung feindlicher Häfen und massiver Beschuss militärischer Depots aus sicherer Distanz.',
      doctrines: [
        { id: 'naval_blockade', label: 'U-Boot-Jagd & Vollständige Seeblockade', risk: 'Mittel', bonus: 'Unterbindet alle feindlichen Nachschublinien zur See', costMrd: 8.4 },
        { id: 'carrier_strike', label: 'Flugzeugträger-Schwerpunktangriff', risk: 'Mittel', bonus: 'Zerschlägt feindliche Küstenverteidigungen und Werften', costMrd: 14.0 },
        { id: 'hypersonic', label: 'Hyperschall-Artilleriebeschuss', risk: 'Gering', bonus: 'Zerstört verbunkerte Kommandozentralen der feindlichen Generalität', costMrd: 11.2 }
      ]
    },
    {
      stage: 3,
      title: 'Angriff 3/4: Massive Bodenoffensive & Frontdurchbruch',
      description: 'Panzerdurchbrüche, Sturm auf befestigte Linien, Einsatz von Roboter-Legionen, Drohnenschwärmen und Infiltration durch Elite-Sondereinheiten.',
      doctrines: [
        { id: 'blitz', label: 'Gepanzerter Blitz-Durchbruch', risk: 'Hoch', bonus: 'Gewinnt rasch 35% Territorium, erfordert schwere Panzereinheiten', costMrd: 16.8 },
        { id: 'swarm_robotics', label: 'Autonome Drohnen- & Roboter-Vorhut', risk: 'Niedrig', bonus: 'Minimiert eigene Personalverluste durch autonome Maschinen', costMrd: 13.5 },
        { id: 'special_ops', label: 'Spezialkräfte-Kommandounternehmen', risk: 'Mittel', bonus: 'Gezielte Festnahme oder Ausschaltung feindlicher Divisionskommandeure', costMrd: 7.6 }
      ]
    },
    {
      stage: 4,
      title: 'Angriff 4/4: Strategischer Entscheidungsschlag & Sturm auf die Hauptstadt',
      description: `Einkesselung von ${targetCountry.capital}, Niederschlagung der letzten organisierten Verteidiger und Erzwingung der bedingungslosen Kapitulation.`,
      doctrines: [
        { id: 'capital_storm', label: `Direkter Sturm auf das Regierungsviertel in ${targetCountry.capital}`, risk: 'Mittel', bonus: 'Erzwingt rasche Kapitulation mit intakter städtischer Infrastruktur', costMrd: 19.5 },
        { id: 'strategic_overwhelming', label: 'Totale militärische Überwältigung aller Resignationskräfte', risk: 'Gering', bonus: 'Unwiderstehliche Feuerüberlegenheit bricht jeden Restwiderstand', costMrd: 24.0 },
        { id: 'hypersonic_decapitation', label: 'Chirurgischer Enthauptungsschlag', risk: 'Hoch', bonus: 'Zerschlägt die oberste Staats- und Militärführung binnen Minuten', costMrd: 14.2 }
      ]
    }
  ];

  const currentStageInfo = attackStagesData[currentAttackStage - 1];

  // Execute an Attack Phase
  const handleExecuteAttack = () => {
    if (isExecutingAttack || warStatus !== 'ongoing') return;
    setIsExecutingAttack(true);
    sound.playWarDrum();

    const selectedDoc = currentStageInfo.doctrines.find(d => d.id === selectedDoctrine) || currentStageInfo.doctrines[0];
    const costAddition = selectedDoc.costMrd;

    // Simulate outcome based on win probability
    setTimeout(() => {
      const isRoundSuccess = Math.random() * 100 <= winProbability;
      
      const newCost = totalWarCostMrd + costAddition;
      setTotalWarCostMrd(Number(newCost.toFixed(2)));

      // Real-time Losses calculation
      const playerInfDelta = Math.round(isRoundSuccess ? 400 + Math.random() * 500 : 1200 + Math.random() * 1400);
      const playerTankDelta = Math.round(isRoundSuccess ? 5 + Math.random() * 8 : 15 + Math.random() * 20);
      const playerJetDelta = Math.round(isRoundSuccess ? 1 + Math.random() * 2 : 4 + Math.random() * 6);
      const playerDroneDelta = Math.round(15 + Math.random() * 25);

      const enemyInfDelta = Math.round(isRoundSuccess ? 2800 + Math.random() * 3500 : 900 + Math.random() * 1200);
      const enemyTankDelta = Math.round(isRoundSuccess ? 25 + Math.random() * 35 : 10 + Math.random() * 15);
      const enemyJetDelta = Math.round(isRoundSuccess ? 8 + Math.random() * 15 : 2 + Math.random() * 5);
      const enemyDroneDelta = Math.round(35 + Math.random() * 50);

      setPlayerLosses(prev => ({
        infantryLosses: prev.infantryLosses + playerInfDelta,
        tanksDestroyed: prev.tanksDestroyed + playerTankDelta,
        jetsShotDown: prev.jetsShotDown + playerJetDelta,
        shipsLost: prev.shipsLost + (isRoundSuccess ? 0 : 1),
        dronesLost: prev.dronesLost + playerDroneDelta
      }));

      setEnemyLosses(prev => ({
        infantryLosses: prev.infantryLosses + enemyInfDelta,
        tanksDestroyed: prev.tanksDestroyed + enemyTankDelta,
        jetsShotDown: prev.jetsShotDown + enemyJetDelta,
        shipsLost: prev.shipsLost + (isRoundSuccess ? 2 : 1),
        dronesLost: prev.dronesLost + enemyDroneDelta
      }));

      // Territory progress
      const territoryGain = isRoundSuccess ? 24 : 10;
      const nextTerritory = Math.min(100, territoryGainedPercent + territoryGain);
      setTerritoryGainedPercent(nextTerritory);

      // CPU Counter-Action / Reaction
      const cpuResponses = [
        `CPU: ${targetCountry.name} mobilisiert Reserveverbände und zieht Artilleriesperren vor ${targetCountry.capital} auf!`,
        `CPU: Feindliche Luftstreitkräfte versuchen Gegenangriff mit Tieffliegern, werden von unseren Abfangjägern abgefangen.`,
        `CPU: Der Generalstab von ${targetCountry.name} ordnet Rückzug auf die zweite Verteidigungslinie an. Schwere feindliche Materialverluste.`,
        `CPU: Feindliche Truppen kapitulieren zusehends in den äußeren Sektoren. ${targetCountry.capital} ist vollständig eingeschlossen!`
      ];
      const cpuMsg = cpuResponses[currentAttackStage - 1];
      setCpuReactionText(cpuMsg);

      // Log to combat console
      setCombatLogs(prev => [
        `[Phase ${currentAttackStage}/4 ERGEBNIS]: Doktrin "${selectedDoc.label}" ausgeführt. ${isRoundSuccess ? 'ERFOLG: Feindlinien durchbrochen!' : 'Harte Gefechte mit unerwartetem Widerstand.'} (${territoryGain}% Geländegewinn, Kosten: +${costAddition} Mrd.)`,
        cpuMsg,
        ...prev
      ]);

      setIsExecutingAttack(false);

      // Advance stage or conclude war
      if (currentAttackStage < 4) {
        setCurrentAttackStage(prev => prev + 1);
        setSelectedDoctrine(attackStagesData[currentAttackStage].doctrines[0].id);
      } else {
        // Conclude 4th Attack
        if (nextTerritory >= 60 || winProbability >= 45) {
          setWarStatus('player_victory');
          sound.playTriumph();
          onLogEvent(`SIEG IM KRIEG: Streitkräfte von ${targetCountry.name} haben bedingungslos kapituliert!`, 'positive');
        } else {
          setWarStatus('player_defeat');
          sound.playCrisis();
          onLogEvent(`KRIEGSNIEDERLAGE: Offensive gegen ${targetCountry.name} ist unter schweren Verlusten festgefahren.`, 'negative');
        }
      }
    }, 1200);
  };

  // Post-War Treaty Selection: 1. Föderation ODER 2. 50% BIP Reparationen für 20 Jahre
  const handleSelectPostWarResolution = (resolution: 'federation' | 'reparations') => {
    if (postWarResolutionChosen) return;
    setPostWarResolutionChosen(true);

    const enemyDebt = getCountryDebtBillions(targetCountry);
    const annualGdpReparations = Number((targetCountry.gdpBillions * 0.50).toFixed(2));
    const quarterlyGdpReparations = Number((annualGdpReparations / 4).toFixed(2));

    if (resolution === 'federation') {
      sound.playTriumph();
      onUpdateState(prev => ({
        ...prev,
        // Integrate into federation
        federatedCountries: [...(prev.federatedCountries || []), targetCountry.id],
        // Take over weapons and add to military
        military: {
          ...prev.military,
          infantryDivisions: prev.military.infantryDivisions + 15,
          armoredDivisions: prev.military.armoredDivisions + 8,
          fighterSquadrons: prev.military.fighterSquadrons + 12,
          navalFleets: prev.military.navalFleets + 3,
          readinessDefcon: 3
        },
        // Take over state treasury and resources
        macro: {
          ...prev.macro,
          // Add enemy resources and wealth directly to treasury
          treasury: prev.macro.treasury + Math.round(targetCountry.gdpBillions * 0.15),
          // Merge national debt
          nationalDebt: prev.macro.nationalDebt + Math.round(enemyDebt * 0.40)
        },
        stability: Math.min(100, prev.stability + 15),
        historyLog: [
          {
            year: prev.year,
            quarter: prev.quarter,
            text: `HISTORISCHE FÖDERATION: ${targetCountry.name} wurde feierlich in unsere Föderation eingegliedert! Sämtliche Einnahmen, Rohstoffe, Waffen und Vermögenswerte fließen ab sofort in unsere Staatskasse.`,
            type: 'positive'
          },
          ...prev.historyLog
        ]
      }));

      onLogEvent(`${targetCountry.name} wurde in die Föderation eingegliedert. Alle Staatseinnahmen & Waffen übernommen!`, 'positive');
    } else {
      // 50% of GDP for 20 years (= 80 quarters)
      sound.playCoins();
      const newReparation: WarReparation = {
        id: `rep-${targetCountry.id}-${Date.now()}`,
        countryId: targetCountry.id,
        countryName: targetCountry.name,
        annualReparationMrd: annualGdpReparations,
        quarterlyReparationMrd: quarterlyGdpReparations,
        remainingQuarters: 80, // 20 Jahre
        totalCollectedMrd: 0
      };

      onUpdateState(prev => ({
        ...prev,
        activeReparations: [...(prev.activeReparations || []), newReparation],
        stability: Math.min(100, prev.stability + 10),
        historyLog: [
          {
            year: prev.year,
            quarter: prev.quarter,
            text: `FRIEDENSVERTRAG: ${targetCountry.name} wurde zur Zahlung von 50% seines BIP (${annualGdpReparations} Mrd./Jahr bzw. ${quarterlyGdpReparations} Mrd./Quartal) für 20 Jahre an unsere Staatskasse verpflichtet!`,
            type: 'positive'
          },
          ...prev.historyLog
        ]
      }));

      onLogEvent(`Kriegszahlungen verhängt: ${targetCountry.name} zahlt für 20 Jahre 50% des BIP (${annualGdpReparations} Mrd./Jahr) in unsere Staatskasse!`, 'positive');
    }

    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-slate-950 border border-rose-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header HUD */}
        <div className="px-6 py-3.5 bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-950 border-b border-rose-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-600/20 border border-rose-500/50 text-rose-400">
              <Swords className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Cinzel'] font-black text-base text-white tracking-wider">
                  KRIEGSSIMULATOR & GEFECHTSZENTRALE
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-500/30 text-rose-300 font-mono text-[11px] font-bold border border-rose-500/40">
                  DEFCON 1 · KRIEGZUSTAND
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Feindlicher Staat: <span className="text-rose-400 font-bold">{targetCountry.name}</span> ({targetCountry.capital}) · Militärstärke: {targetCountry.militaryScore}/100
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* DrawOnAMap External Link */}
            <a
              href="https://drawonamap.com/de/world-map/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-mono text-amber-400 border border-amber-500/30 transition-colors shadow-sm"
              title="DrawOnAMap Weltkarte im neuen Tab öffnen"
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">DrawOnAMap Weltkarte</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real-time Status Bar: Victory Probability, Territory, Costs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-6 py-2.5 bg-slate-900/60 border-b border-slate-800 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Ermittelte Siegeschance</span>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${winProbability >= 65 ? 'text-emerald-400' : winProbability >= 45 ? 'text-amber-400' : 'text-rose-400'}`}>
                {winProbability}%
              </span>
              <span className="text-[10px] text-slate-400">
                ({winProbability >= 60 ? 'Militärische Überlegenheit' : 'Ausgeglichenes Kräfteverhältnis'})
              </span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Erobertes Territorium</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-amber-400">
                {territoryGainedPercent}%
              </span>
              <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden max-w-[90px]">
                <div 
                  className="bg-amber-400 h-full transition-all duration-500"
                  style={{ width: `${territoryGainedPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Kriegskosten in Echtzeit</span>
            <span className="text-sm font-bold text-rose-400 tabular-nums">
              {state.currencySymbol}{totalWarCostMrd.toFixed(1)} Mrd.
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Aktuelle Angriffsphase</span>
            <span className="text-sm font-bold text-cyan-400">
              Angriff {currentAttackStage} von 4
            </span>
          </div>
        </div>

        {/* Main Simulator Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 md:p-6 bg-[#060a11]">
          
          {/* LEFT COLUMN: Eingesetzte Waffen und Truppen mit Anzahl der verfügbaren Truppen */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span className="font-['Cinzel'] font-bold text-sm text-white">
                  STREITKRÄFTE & EINGESETZTE WAFFEN
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Verfügbar / Eingesetzt</span>
            </div>

            <div className="space-y-2 overflow-y-auto pr-1 text-xs font-mono max-h-[380px]">
              {[
                { key: 'infantryDivisions', label: 'Heer (Infanterie)', avail: initialAvailable.infantryDivisions, unit: 'Div.' },
                { key: 'armoredDivisions', label: 'Landstreitkräfte (Panzer)', avail: initialAvailable.armoredDivisions, unit: 'Div.' },
                { key: 'specialForcesUnits', label: 'Sondereinheiten (Kommandos)', avail: initialAvailable.specialForcesUnits, unit: 'Kdo.' },
                { key: 'fighterSquadrons', label: 'Luftwaffe (Kampfflugzeuge)', avail: initialAvailable.fighterSquadrons, unit: 'Geschw.' },
                { key: 'navalFleets', label: 'Marine (Flottenverbände)', avail: initialAvailable.navalFleets, unit: 'Flotten' },
                { key: 'submarines', label: 'U-Boote (Konventionell)', avail: initialAvailable.submarines, unit: 'Boote' },
                { key: 'nuclearSubmarines', label: 'Atom-U-Boote', avail: initialAvailable.nuclearSubmarines, unit: 'U-Boote' },
                { key: 'warships', label: 'Kriegsschiffe (Zerstörer)', avail: initialAvailable.warships, unit: 'Schiffe' },
                { key: 'nuclearAircraftCarriers', label: 'Flugzeugträger', avail: initialAvailable.nuclearAircraftCarriers, unit: 'Träger' },
                { key: 'combatSatellites', label: 'Kampfsatelliten (Orbital)', avail: initialAvailable.combatSatellites, unit: 'Satelliten' },
                { key: 'strategicNuclearWeapons', label: 'Strategische Waffen (Atom/Hyperschall)', avail: initialAvailable.strategicNuclearWeapons, unit: 'Sprengk.' },
                { key: 'droneSwarmUnits', label: 'Drohnen (Schwarmsysteme)', avail: initialAvailable.droneSwarmUnits, unit: 'Schwärme' },
                { key: 'roboticsLegions', label: 'Roboter (Kampfroboter)', avail: initialAvailable.roboticsLegions, unit: 'Legionen' }
              ].map((item) => {
                const k = item.key as keyof typeof deployed;
                const val = deployed[k];

                return (
                  <div key={item.key} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 font-sans text-xs">{item.label}</span>
                      <span className="text-amber-400 font-bold">
                        {val} <span className="text-slate-500 font-normal">/ {item.avail} {item.unit}</span>
                      </span>
                    </div>

                    {/* Deployment slider */}
                    <input
                      type="range"
                      min={0}
                      max={item.avail}
                      value={val}
                      disabled={warStatus !== 'ongoing' || isExecutingAttack}
                      onChange={(e) => {
                        const newVal = parseInt(e.target.value);
                        setDeployed(prev => ({ ...prev, [k]: newVal }));
                      }}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                );
              })}
            </div>

            {/* Live Losses Table */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-mono text-slate-400 block mb-1">Verluste in Echtzeit</span>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="p-2 rounded bg-slate-950 border border-rose-950/60 text-slate-300">
                  <span className="text-rose-400 font-bold block">Eigene Verluste</span>
                  <div>Soldaten: {playerLosses.infantryLosses.toLocaleString()}</div>
                  <div>Panzer: {playerLosses.tanksDestroyed} · Jets: {playerLosses.jetsShotDown}</div>
                  <div>Schiffe: {playerLosses.shipsLost} · Drohnen: {playerLosses.dronesLost}</div>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-emerald-950/60 text-slate-300">
                  <span className="text-emerald-400 font-bold block">Feindliche Verluste ({targetCountry.isoCode})</span>
                  <div>Soldaten: {enemyLosses.infantryLosses.toLocaleString()}</div>
                  <div>Panzer: {enemyLosses.tanksDestroyed} · Jets: {enemyLosses.jetsShotDown}</div>
                  <div>Schiffe: {enemyLosses.shipsLost} · Drohnen: {enemyLosses.dronesLost}</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 4 Angriffe, Gefechtslog & Nachkriegs-Schicksal */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            
            {/* Visual Radar Battlefield / Map Container */}
            <div className="relative h-44 rounded-xl overflow-hidden border border-slate-800 bg-[#070d18] flex items-center justify-center p-4">
              {/* Radar Grid Graphic */}
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="relative text-center z-10 max-w-md">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Crosshair className="w-5 h-5 text-rose-500 animate-spin" style={{ animationDuration: '6s' }} />
                  <span className="font-['Cinzel'] font-bold text-white text-sm tracking-wide">
                    OPERATIONS-SCHAUPLATZ: {targetCountry.name.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-2">
                  Frontlinie verschiebt sich dynamisch nach {targetCountry.capital}. Alle 4 Angriffsphasen werden interaktiv mit taktischen Doktrinen geführt.
                </p>
                <div className="flex items-center justify-center gap-3 text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                    BIP: ${targetCountry.gdpBillions} Mrd.
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                    Schulden: ${getCountryDebtBillions(targetCountry)} Mrd.
                  </span>
                </div>
              </div>
            </div>

            {/* If War is still ongoing: Show current attack phase */}
            {warStatus === 'ongoing' && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-mono text-amber-400 block font-bold">
                      {currentStageInfo.title}
                    </span>
                    <p className="text-xs text-slate-300 font-sans mt-0.5">
                      {currentStageInfo.description}
                    </p>
                  </div>
                </div>

                {/* Doctrine Selection */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-slate-400 block uppercase">
                    Wähle taktische Angriffsdoktrin:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {currentStageInfo.doctrines.map((doc) => (
                      <button
                        key={doc.id}
                        disabled={isExecutingAttack}
                        onClick={() => {
                          sound.playClick();
                          setSelectedDoctrine(doc.id);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          selectedDoctrine === doc.id
                            ? 'border-amber-400 bg-amber-500/20 text-white shadow-lg'
                            : 'border-slate-800 bg-slate-950/70 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-bold text-xs text-slate-200 mb-1">{doc.label}</div>
                        <div className="text-[10px] text-slate-400">{doc.bonus}</div>
                        <div className="text-[10px] font-mono text-amber-300 mt-1">Kosten: {doc.costMrd} Mrd.</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Execute Attack Button */}
                <button
                  disabled={isExecutingAttack}
                  onClick={handleExecuteAttack}
                  className={`w-full py-3 rounded-xl font-bold font-mono text-sm tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isExecutingAttack
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-lg shadow-rose-950/50 active:scale-98'
                  }`}
                >
                  <Flame className={`w-4 h-4 ${isExecutingAttack ? 'animate-bounce' : ''}`} />
                  {isExecutingAttack
                    ? 'FEUERBEFEHL LÄUFT... SCHLACHT WIRD SIMULIERT...'
                    : `ANGRIFF ${currentAttackStage}/4 BEFEHLEN & DURCHFÜHREN`}
                </button>
              </div>
            )}

            {/* POST-WAR RESOLUTION: Victory achieved! */}
            {warStatus === 'player_victory' && (
              <div className="bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950 border-2 border-emerald-500/60 rounded-xl p-5 space-y-4 animate-in fade-in zoom-in-95">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-400">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-['Cinzel'] font-black text-lg text-emerald-400">
                      SIEG & BEDINGUNGSLOSE KAPITULATION VON {targetCountry.name.toUpperCase()}!
                    </h3>
                    <p className="text-xs text-slate-300">
                      Die gegnerische Regierung hat kapituliert. Das besiegte Land unterwirft sich Ihren Bedingungen. Wählen Sie das Nachkriegs-Schicksal:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Option 1: Aufnahme in die Föderation */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 hover:border-amber-400 transition-all flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Globe2 className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-sm text-white">1. In Föderation aufnehmen</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Das besiegte Land wird vollständig in Ihren Bundesstaat eingegliedert:
                      </p>
                      <ul className="text-[11px] font-mono text-emerald-300 mt-2 space-y-1">
                        <li>✓ Sämtliche Steuern & Einnahmen fließen in Ihre Staatskasse</li>
                        <li>✓ Alle Rohstoffe & strategischen Ressourcen übernommen</li>
                        <li>✓ Alle verbliebenen Waffenarsenale integriert (+38 Militäreinheiten)</li>
                        <li>⚠ Übernahme von ${Math.round(getCountryDebtBillions(targetCountry) * 0.4)} Mrd. Staatsschulden</li>
                      </ul>
                    </div>

                    <button
                      disabled={postWarResolutionChosen}
                      onClick={() => handleSelectPostWarResolution('federation')}
                      className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs transition-colors cursor-pointer"
                    >
                      FÖDERATIONS-EINGLIEDERUNG VOLLZIEHEN
                    </button>
                  </div>

                  {/* Option 2: Kriegszahlungen (50% BIP für 20 Jahre) */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 hover:border-emerald-400 transition-all flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-sm text-white">2. Kriegszahlungen (Reparationen)</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Das Land behält formale Souveränität, muss aber gigantische Reparationen zahlen:
                      </p>
                      <ul className="text-[11px] font-mono text-emerald-300 mt-2 space-y-1">
                        <li>✓ Zahlung von <span className="font-bold">50% des BIP</span> für volle 20 Jahre (80 Quartale)</li>
                        <li>✓ Jährlich fließen ca. <span className="font-bold">${Math.round(targetCountry.gdpBillions * 0.5)} Mrd.</span> in Ihre Staatskasse</li>
                        <li>✓ Quartalsweise automatische Überweisung von ${Math.round((targetCountry.gdpBillions * 0.5) / 4)} Mrd.</li>
                        <li>✓ Keine Schuldenübernahme des Feindes</li>
                      </ul>
                    </div>

                    <button
                      disabled={postWarResolutionChosen}
                      onClick={() => handleSelectPostWarResolution('reparations')}
                      className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs transition-colors cursor-pointer"
                    >
                      KRIEGSREPARATIONEN (50% BIP / 20 JAHRE) DURCHSETZEN
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Defeat State */}
            {warStatus === 'player_defeat' && (
              <div className="bg-rose-950/40 border border-rose-500 rounded-xl p-4 text-center space-y-3">
                <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
                <h3 className="font-['Cinzel'] font-bold text-rose-400 text-base">
                  OFFENSIVE GESCHEITERT · TRUPPENRÜCKZUG ANGEORDNET
                </h3>
                <p className="text-xs text-slate-300 max-w-lg mx-auto">
                  Die gegnerischen Streitkräfte leisteten erbitterten Widerstand. Um einen totalen Verschleiß der Streitkräfte zu verhindern, wurde ein taktischer Waffenstillstand geschlossen.
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200"
                >
                  Gefechtszentrale schließen
                </button>
              </div>
            )}

            {/* Combat Log Console */}
            <div className="flex-1 bg-slate-950 border border-slate-800/80 rounded-xl p-3 flex flex-col space-y-1">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[10px] font-mono text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-rose-500 animate-pulse" />
                  <span>ECHTZEIT-GEFECHTSPROTOKOLL & VERLUSTMELDER</span>
                </div>
                <span>Echtzeit-Synchronisierung</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1 font-mono text-[11px] max-h-36 pr-1">
                {combatLogs.map((log, idx) => (
                  <div key={idx} className="text-slate-300 leading-tight">
                    <span className="text-amber-400 mr-1.5">»</span>
                    {log}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
