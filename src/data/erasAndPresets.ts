import { EraId, GameState, GovernmentType, SuccessionLaw, SuffrageType, StateEnterprise, InfrastructureLevel, LawPolicy, RivalNation, GamePlayMode } from '../types/game';
import {
  createInitialCabinet,
  createInitialFamily,
  createCorporate100,
  createIndustry10x10,
  createInitialTradeDeals,
  createInitialStocks,
  createInitialSecWatch,
  createInitialDonations,
  createInitialShadowSyndicate,
  createInitialWelfarePackages,
  createInitialPensionSystem,
  createInitialLiveConflicts,
  INITIAL_LUXURY_ASSETS,
  INITIAL_PRIVATE_BUSINESSES
} from './presidencyData';

export interface EraInfo {
  id: EraId;
  name: string;
  defaultYear: number;
  description: string;
  currencyDefault: { name: string; symbol: string };
}

export const ERAS: EraInfo[] = [
  {
    id: 'antiquity',
    name: 'Antike',
    defaultYear: -27, // 27 v. Chr. Pax Romana
    description: 'Die Morgendämmerung der Imperien, Legionen, Galeeren und das göttliche Herrscherrecht der Kaiser.',
    currencyDefault: { name: 'Römischer Denar', symbol: '𐆖' }
  },
  {
    id: 'middle_ages',
    name: 'Mittelalter',
    defaultYear: 1066,
    description: 'Feudale Herrschaftsgebiete, ritterlicher Ehrenkodex, kirchliche Vormacht und dynastische Kreuzzüge.',
    currencyDefault: { name: 'Souveräne Florintaler', symbol: 'ƒ' }
  },
  {
    id: 'early_modern',
    name: 'Frühe Neuzeit',
    defaultYear: 1648,
    description: 'Westfälischer Friede, Schwarzpulver-Imperien, globale Handelsflotten und höfische Kabale.',
    currencyDefault: { name: 'Dukaten', symbol: '⚜' }
  },
  {
    id: 'industrial',
    name: 'Industriezeitalter',
    defaultYear: 1871,
    description: 'Dampfmaschinen, Stahlhütten, Dreadnought-Schlachtschiffe und das Aufkommen parlamentarischer Massenpolitik.',
    currencyDefault: { name: 'Pfund Sterling', symbol: '£' }
  },
  {
    id: 'cold_war',
    name: 'Kalter Krieg',
    defaultYear: 1962,
    description: 'Nukleares Wettrüsten, Stellvertreterkriege, Weltraumwettlauf und globale ideologische Konfrontation.',
    currencyDefault: { name: 'US-Dollar / Rubel', symbol: '$' }
  },
  {
    id: 'modern',
    name: 'Gegenwart & Moderne',
    defaultYear: 2026,
    description: 'Globale Finanzmärkte, Drohnenkriegsführung, Cyber-Operationen und demokratische Polarisierung.',
    currencyDefault: { name: 'Euro / US-Dollar', symbol: '€' }
  },
  {
    id: 'near_future',
    name: 'Nahe Zukunft',
    defaultYear: 2045,
    description: 'Algorithmische Staatsführung, autonome Verteidigungsschwärme, Orbitalbergbau und geopolitische Ressourcenkriege.',
    currencyDefault: { name: 'Globales Kreditguthaben', symbol: '₢' }
  }
];

export interface ScenarioPreset {
  id: string;
  name: string;
  era: EraId;
  year: number;
  countryName: string;
  capitalCity: string;
  currencyName: string;
  currencySymbol: string;
  flagPrimary: string;
  flagSecondary: string;
  coatOfArms: string;
  motto: string;
  government: GovernmentType;
  termLength: number;
  maxTerms: number;
  suffrage: SuffrageType;
  succession: SuccessionLaw;
  rulerName: string;
  rulerTitle: string;
  dynastyName: string;
  portraitStyle: 'regal' | 'military' | 'statesman' | 'theocrat' | 'technocrat';
  initialGdp: number;
  initialDebt: number;
  treasury: number;
  description: string;
}

export const PRESET_SCENARIOS: ScenarioPreset[] = [
  {
    id: 'modern_usa',
    name: 'Vereinigte Staaten (Gegenwart, 2026)',
    era: 'modern',
    year: 2026,
    countryName: 'Vereinigte Staaten',
    capitalCity: 'Washington, D.C.',
    currencyName: 'US-Dollar',
    currencySymbol: '$',
    flagPrimary: '#1d4ed8',
    flagSecondary: '#b91c1c',
    coatOfArms: 'Weißkopfseeadler mit Pfeilen & Olivenzweig',
    motto: 'E Pluribus Unum',
    government: 'presidential_democracy',
    termLength: 4,
    maxTerms: 2,
    suffrage: 'universal',
    succession: 'elective_council',
    rulerName: 'Präsident Alexander Hayes',
    rulerTitle: 'Oberbefehlshaber & Präsident',
    dynastyName: 'Hayes Polit-Dynastie',
    portraitStyle: 'statesman',
    initialGdp: 28500,
    initialDebt: 34000,
    treasury: 1200,
    description: 'Befehligen Sie die führende Weltmacht mit gewaltigem BIP, Flugzeugträgerflotten und gigantischen Staatsschulden, die auszubalancieren sind.'
  },
  {
    id: 'rome_antiquity',
    name: 'Römisches Reich (Antike, 27 v. Chr.)',
    era: 'antiquity',
    year: -27,
    countryName: 'Imperium Romanum',
    capitalCity: 'Rom',
    currencyName: 'Denarii',
    currencySymbol: '𐆖',
    flagPrimary: '#991b1b',
    flagSecondary: '#eab308',
    coatOfArms: 'Goldener SPQR-Legionsadler',
    motto: 'Senatus Populusque Romanus',
    government: 'absolute_monarchy',
    termLength: 0,
    maxTerms: 0,
    suffrage: 'none_absolute',
    succession: 'primogeniture',
    rulerName: 'Imperator Caesar Augustus',
    rulerTitle: 'Augustus & Princeps',
    dynastyName: 'Julisch-Claudische Dynastie',
    portraitStyle: 'regal',
    initialGdp: 450,
    initialDebt: 80,
    treasury: 140,
    description: 'Konsolidieren Sie den Mittelmeerraum mit unbezwingbaren Legionen, monumentalen Aquädukten und begründen Sie die Pax Romana.'
  },
  {
    id: 'cold_war_ussr',
    name: 'Sowjetunion (Kalter Krieg, 1962)',
    era: 'cold_war',
    year: 1962,
    countryName: 'Union der Sozialistischen Sowjetrepubliken',
    capitalCity: 'Moskau',
    currencyName: 'Sowjetischer Rubel',
    currencySymbol: '₽',
    flagPrimary: '#dc2626',
    flagSecondary: '#facc15',
    coatOfArms: 'Hammer, Sichel & Roter Stern',
    motto: 'Proletarier aller Länder, vereinigt euch!',
    government: 'one_party_autocracy',
    termLength: 0,
    maxTerms: 0,
    suffrage: 'party_members_only',
    succession: 'party_politburo',
    rulerName: 'Generalsekretär Viktor Malin',
    rulerTitle: 'Vorsitzender des Ministerrats',
    dynastyName: 'Bolschewistische Avantgarde',
    portraitStyle: 'military',
    initialGdp: 4200,
    initialDebt: 900,
    treasury: 650,
    description: 'Leiten Sie eine gigantische Planwirtschaft, kommandieren Sie Interkontinentalraketen, unterstützen Sie Stellvertreterkriege und befehligen Sie den KGB.'
  },
  {
    id: 'industrial_germany',
    name: 'Deutsches Kaiserreich (Industriezeitalter, 1871)',
    era: 'industrial',
    year: 1871,
    countryName: 'Deutsches Reich',
    capitalCity: 'Berlin',
    currencyName: 'Goldmark',
    currencySymbol: 'ℳ',
    flagPrimary: '#0f172a',
    flagSecondary: '#dc2626',
    coatOfArms: 'Preußisch-Deutscher Reichsadler',
    motto: 'Gott mit uns',
    government: 'constitutional_monarchy',
    termLength: 0,
    maxTerms: 0,
    suffrage: 'landowners_wealth',
    succession: 'primogeniture',
    rulerName: 'Kaiser Wilhelm & Kanzler Bismarck',
    rulerTitle: 'Kaiserliche Majestät',
    dynastyName: 'Haus Hohenzollern',
    portraitStyle: 'regal',
    initialGdp: 3100,
    initialDebt: 1200,
    treasury: 450,
    description: 'Entfesseln Sie eine industrielle Großmacht mit Kohlezechen, stählernen Eisenbahnnetzen, preußischer Disziplin und ausgefeilter Bismarckscher Bündnispolitik.'
  },
  {
    id: 'near_future_technate',
    name: 'Pazifisches Technat (Nahe Zukunft, 2045)',
    era: 'near_future',
    year: 2045,
    countryName: 'Pazifisches Technat',
    capitalCity: 'Neo-Singapur',
    currencyName: 'Quantenkredit',
    currencySymbol: '₢',
    flagPrimary: '#0284c7',
    flagSecondary: '#10b981',
    coatOfArms: 'Kybernetische Geodätische Sphäre',
    motto: 'Effizienz, Synthese, Weitblick',
    government: 'technocracy',
    termLength: 5,
    maxTerms: 3,
    suffrage: 'universal',
    succession: 'meritocratic',
    rulerName: 'Großkanzlerin Dr. Maya Lin',
    rulerTitle: 'Oberste Exekutiv-Schlichterin',
    dynastyName: 'Technologisches Direktorium',
    portraitStyle: 'technocrat',
    initialGdp: 34000,
    initialDebt: 18000,
    treasury: 3800,
    description: 'Herrschen Sie über Rechenalgorithmen, automatisierte Fusionskraftwerke, orbitale Verteidigungsgitter und einen vollkommen bargeldlosen kybernetischen Markt.'
  }
];

export function createInitialEnterprises(): StateEnterprise[] {
  return [
    {
      id: 'water_corp',
      name: 'Staatliche Fernwasserversorgung & Trinkwasserwerke',
      sector: 'Water & Sanitation',
      ownership: 'state_owned',
      quarterlyProfit: 8.5,
      publicServiceEfficiency: 82
    },
    {
      id: 'power_grid',
      name: 'Bundesstromnetz & Thermische Energieversorgung',
      sector: 'Power Grid',
      ownership: 'state_owned',
      quarterlyProfit: 14.2,
      publicServiceEfficiency: 78
    },
    {
      id: 'hydrocarbons_pipeline',
      name: 'Nationale Erdöl- & Gaspipelines-Infrastruktur',
      sector: 'Gas & Oil Pipelines',
      ownership: 'joint_venture',
      quarterlyProfit: 26.0,
      publicServiceEfficiency: 74
    },
    {
      id: 'telecom_postal',
      name: 'Telekom- & Satelliten-Kommunikationsnetz',
      sector: 'Telecommunications',
      ownership: 'joint_venture',
      quarterlyProfit: 11.8,
      publicServiceEfficiency: 80
    }
  ];
}

export function createInitialInfrastructure(): InfrastructureLevel[] {
  return [
    {
      id: 'highways',
      name: 'Bundesfernstraßen & Logistik-Autobahnen',
      category: 'transport',
      level: 2,
      costPerLevel: 45,
      upkeepPerQuarter: 5,
      description: 'Asphaltierte Transportadern verbinden Industriezentren mit Ballungsräumen.',
      bonusText: '+0.15% Quartals-BIP-Wachstum, -1% Logistikkosten'
    },
    {
      id: 'rail_freight',
      name: 'Hochgeschwindigkeits-Schienennetz & Güterbahnen',
      category: 'transport',
      level: 2,
      costPerLevel: 60,
      upkeepPerQuarter: 7,
      description: 'Elektrifizierte Schienenmagistralen für blitzschnelle Truppenverlegung und Warentransport.',
      bonusText: '+0.2% BIP, beschleunigt militärische Verlegungen'
    },
    {
      id: 'seaports',
      name: 'Tiefsee-Containerterminals & Marinehafen',
      category: 'transport',
      level: 2,
      costPerLevel: 75,
      upkeepPerQuarter: 8,
      description: 'Große Containerwerften und Marine-Trockendocks zur weltweiten Handels- und Machtprojektion.',
      bonusText: '+15% Außenhandelsvolumen, +4 Flottengröße'
    },
    {
      id: 'palace_center',
      name: 'Souveräner Regierungspalast & Staatszitadelle',
      category: 'control',
      level: 2,
      costPerLevel: 50,
      upkeepPerQuarter: 6,
      description: 'Monumentale Regierungsbauten zur Ausstrahlung von Macht, Majestät und Würde.',
      bonusText: '+10 Dynastische Legitimität, +5 Staatsstabilität'
    },
    {
      id: 'prisons_surveillance',
      name: 'Hochsicherheits-Gefängnisse & Staatliche Überwachung',
      category: 'control',
      level: 1,
      costPerLevel: 40,
      upkeepPerQuarter: 4,
      description: 'Justizvollzugsanstalten und flächendeckende polizeiliche Überwachungssysteme.',
      bonusText: '-8% Kriminalitätsunruhe, +6% Furcht-Index'
    },
    {
      id: 'schools_universities',
      name: 'Schulen, Exzellenzuniversitäten & Forschungszentren',
      category: 'social',
      level: 2,
      costPerLevel: 55,
      upkeepPerQuarter: 8,
      description: 'Zentren der höheren Schulbildung, akademischer Eliteforschung und naturwissenschaftlicher Institute.',
      bonusText: '+10% Forschungsleistung, +0.25% Langzeit-BIP'
    },
    {
      id: 'hospitals_health',
      name: 'Nationales Kliniknetz & Seuchenschutz-Zentren',
      category: 'social',
      level: 2,
      costPerLevel: 65,
      upkeepPerQuarter: 9,
      description: 'Moderne medizinische Universitätskliniken und Notfall-Quarantäneprotokolle.',
      bonusText: '+8 Beliebtheit im Volk, minimiert Seuchenopfer'
    },
    {
      id: 'water_food_security',
      name: 'Strategische Getreidespeicher & Notreserven',
      category: 'welfare',
      level: 2,
      costPerLevel: 35,
      upkeepPerQuarter: 4,
      description: 'Staatliche Getreidesilos und Wasserreservoirs garantieren die Grundversorgung der Nation.',
      bonusText: 'Verhindert Hungerrevolten bei Dürren und Missernten'
    }
  ];
}

export function createInitialLaws(): LawPolicy[] {
  return [
    {
      id: 'labor_rights',
      category: 'labor',
      title: 'Arbeitszeitgesetz & Arbeitnehmerrechte',
      currentOption: 'standard_44',
      options: [
        {
          id: 'laissez_faire',
          name: 'Laissez-Faire / Unreguliert',
          effectDescription: 'Maximiert Konzernmargen, erhöht jedoch das Risiko massiver Generalstreiks.',
          gdpMod: 0.35,
          approvalMod: -8,
          unrestMod: 7,
          costPerQuarter: 0
        },
        {
          id: 'standard_44',
          name: 'Geregelte 40-Stunden-Woche',
          effectDescription: 'Ausgewogener Kompromiss zwischen hoher Produktivität und sozialem Frieden.',
          gdpMod: 0.1,
          approvalMod: 2,
          unrestMod: -2,
          costPerQuarter: 2
        },
        {
          id: 'worker_councils',
          name: '35-Stunden-Woche & Gesetzlicher Mindestlohn',
          effectDescription: 'Sehr geschätzt von der Arbeiterschaft; dämpft private Kapitalrenditen leicht.',
          gdpMod: -0.2,
          approvalMod: 10,
          unrestMod: -8,
          costPerQuarter: 8
        }
      ]
    },
    {
      id: 'environmental_code',
      category: 'environment',
      title: 'Umweltschutz- & Ressourcenauflagen',
      currentOption: 'moderate_standards',
      options: [
        {
          id: 'unrestricted',
          name: 'Schrankenlose Ressourcenausbeutung',
          effectDescription: 'Maximiert Bergbau und Schürfrechte auf Kosten schwerer Umweltschäden.',
          gdpMod: 0.3,
          approvalMod: -6,
          unrestMod: 4,
          costPerQuarter: 0
        },
        {
          id: 'moderate_standards',
          name: 'Immissionsschutz- & Reinhaltungsstandards',
          effectDescription: 'Verhältnismäßiger Umweltschutz im Einklang mit Industrieinteressen.',
          gdpMod: 0.0,
          approvalMod: 3,
          unrestMod: -1,
          costPerQuarter: 3
        },
        {
          id: 'green_transition',
          name: 'Strikte Ökologievorgaben & Grüne Subventionen',
          effectDescription: 'Verhindert ökologische Krisen; erfordert erhebliche Staatsausgaben.',
          gdpMod: -0.15,
          approvalMod: 8,
          unrestMod: -4,
          costPerQuarter: 12
        }
      ]
    },
    {
      id: 'penal_system',
      category: 'penal',
      title: 'Strafgesetzbuch & Justizvollzug',
      currentOption: 'common_law',
      options: [
        {
          id: 'rehabilitative',
          name: 'Resozialisierung & Bewährungshilfe',
          effectDescription: 'Hohe Bürgerrechte, milde Rückfallquotensenkung bei Schwerstkriminalität.',
          gdpMod: 0.05,
          approvalMod: 4,
          unrestMod: -3,
          costPerQuarter: 4
        },
        {
          id: 'common_law',
          name: 'Rechtsstaatliche Haft- & Bußgelder',
          effectDescription: 'Etablierte zivilrechtliche und strafrechtliche Strafrahmen.',
          gdpMod: 0.0,
          approvalMod: 0,
          unrestMod: 0,
          costPerQuarter: 2
        },
        {
          id: 'draconian_martial',
          name: 'Drakonische Strafen & Zwangsarbeitslager',
          effectDescription: 'Zerschlägt Straßenkriminalität und Dissens durch staatliche Einschüchterung.',
          gdpMod: 0.1,
          approvalMod: -10,
          unrestMod: -12,
          costPerQuarter: 6
        }
      ]
    },
    {
      id: 'press_speech',
      category: 'press',
      title: 'Pressefreiheit & Mediengesetzgebung',
      currentOption: 'free_press',
      options: [
        {
          id: 'free_press',
          name: 'Freie & Unabhängige Presse',
          effectDescription: 'Journalisten decken Korruption auf; erhöht das demokratische Ansehen.',
          gdpMod: 0.1,
          approvalMod: 6,
          unrestMod: -2,
          costPerQuarter: 0
        },
        {
          id: 'licensed_friendly',
          name: 'Staatliche Lizenzierung & Medienkontrolle',
          effectDescription: 'Regierung steuert Presselizenzen; dämpft mediale Skandale ab.',
          gdpMod: 0.0,
          approvalMod: -2,
          unrestMod: 2,
          costPerQuarter: 3
        },
        {
          id: 'state_monopoly',
          name: 'Vollständiges Staatspropaganda-Monopol',
          effectDescription: 'Nur regierungsamtliche Berichte erlaubt; ausländische Medien zensiert.',
          gdpMod: -0.2,
          approvalMod: -8,
          unrestMod: -6,
          costPerQuarter: 10
        }
      ]
    },
    {
      id: 'religious_policy',
      category: 'religion',
      title: 'Religionspolitik & Trennung Staat-Kirche',
      currentOption: 'secular',
      options: [
        {
          id: 'secular',
          name: 'Strikter Laizismus / Säkularer Staat',
          effectDescription: 'Staatliche Neutralität gegenüber allen Religionen und Glaubensrichtungen.',
          gdpMod: 0.05,
          approvalMod: 2,
          unrestMod: -2,
          costPerQuarter: 1
        },
        {
          id: 'state_church',
          name: 'Staatskirche mit Toleranzedikt',
          effectDescription: 'Klerus-Loyalität gesichert; milde Spannungen mit Minderheiten.',
          gdpMod: 0.0,
          approvalMod: 4,
          unrestMod: 1,
          costPerQuarter: 4
        },
        {
          id: 'theocratic_mandate',
          name: 'Theokratisches Mandat & Glaubensdogma',
          effectDescription: 'Der geistliche Rat besitzt ein unumstößliches Veto gegen alle Gesetze.',
          gdpMod: -0.2,
          approvalMod: -6,
          unrestMod: 5,
          costPerQuarter: 6
        }
      ]
    }
  ];
}

export function createInitialRivals(): RivalNation[] {
  return [
    {
      id: 'rival_north_accord',
      name: 'Nordische Föderation',
      leader: 'Premierministerin Cynthia Vance',
      government: 'Parlamentarische Republik',
      powerScore: 88,
      relations: 55,
      atWar: false,
      tradePact: true,
      militaryStrength: 82,
      gdp: 21000,
      flagColor: '#2563eb',
      coordinates: { x: 260, y: 150 }
    },
    {
      id: 'rival_eastern_bloc',
      name: 'Östliche Koalition',
      leader: 'Oberster Marschall Igor Rostow',
      government: 'Militärische Oligarchie',
      powerScore: 92,
      relations: -25,
      atWar: false,
      tradePact: false,
      militaryStrength: 95,
      gdp: 19500,
      flagColor: '#dc2626',
      coordinates: { x: 620, y: 180 }
    },
    {
      id: 'rival_dragon_dominion',
      name: 'Morgenländisches Großreich',
      leader: 'Vorsitzender Li Wei',
      government: 'Technokratisches Direktorat',
      powerScore: 94,
      relations: 10,
      atWar: false,
      tradePact: true,
      militaryStrength: 90,
      gdp: 26000,
      flagColor: '#ea580c',
      coordinates: { x: 740, y: 240 }
    },
    {
      id: 'rival_desert_caliphate',
      name: 'Wüsten-Sultanat',
      leader: 'Emir Tariq Al-Mansur',
      government: 'Absolute Monarchie',
      powerScore: 76,
      relations: 20,
      atWar: false,
      tradePact: true,
      militaryStrength: 68,
      gdp: 8500,
      flagColor: '#16a34a',
      coordinates: { x: 530, y: 280 }
    },
    {
      id: 'rival_southern_union',
      name: 'Südliche Bundesrepublik',
      leader: 'Präsidentin Isabella Torres',
      government: 'Präsidialdemokratie',
      powerScore: 68,
      relations: 45,
      atWar: false,
      tradePact: false,
      militaryStrength: 58,
      gdp: 7200,
      flagColor: '#ca8a04',
      coordinates: { x: 330, y: 390 }
    }
  ];
}

export function buildNewGame(presetOrCustom: Partial<ScenarioPreset>, playMode: GamePlayMode = 'statesman'): GameState {
  const preset = PRESET_SCENARIOS[0]; // fallback
  const p = { ...preset, ...presetOrCustom };
  
  return {
    era: p.era,
    year: p.year,
    quarter: 1,
    playMode,
    themeMode: 'dark',
    countryName: p.countryName,
    capitalCity: p.capitalCity,
    currencyName: p.currencyName,
    currencySymbol: p.currencySymbol,
    flagPrimaryColor: p.flagPrimary,
    flagSecondaryColor: p.flagSecondary,
    coatOfArmsSymbol: p.coatOfArms,
    motto: p.motto,
    
    // Design & Demografie
    flagDesign: {
      pattern: 'tricolor_horizontal',
      primaryColor: p.flagPrimary,
      secondaryColor: '#ffffff',
      tertiaryColor: p.flagSecondary,
      emblem: 'eagle',
      emblemColor: '#fbbf24',
      emblemPosition: 'center'
    },
    currencyConfig: {
      code: p.currencyName.slice(0, 3).toUpperCase(),
      name: p.currencyName,
      symbol: p.currencySymbol,
      standard: 'fiat_floating',
      goldBackingPercent: 30,
      pegTarget: 'Frei schwebend',
      banknote: {
        denomination: 100,
        colorTint: p.flagPrimary,
        motif: 'monument',
        watermark: true,
        hologramStripe: true,
        securityThread: true,
        seriesYear: p.year
      }
    },
    population: {
      total: p.id === 'modern_usa' ? 335.8 : p.id === 'rome_antiquity' ? 56.5 : p.id === 'cold_war_ussr' ? 220.0 : p.id === 'industrial_germany' ? 41.2 : 68.4,
      growthRate: 0.65,
      birthRatePer1000: 11.2,
      deathRatePer1000: 9.4,
      netMigrationThousands: 180,
      lifeExpectancy: p.era === 'antiquity' ? 42.0 : p.era === 'middle_ages' ? 48.0 : p.era === 'industrial' ? 58.0 : 81.2,
      urbanizationRate: p.era === 'antiquity' ? 22.0 : p.era === 'middle_ages' ? 18.0 : p.era === 'industrial' ? 48.0 : 79.5,
      hdiIndex: p.era === 'antiquity' ? 0.380 : p.era === 'industrial' ? 0.620 : 0.935,
      literacyRate: p.era === 'antiquity' ? 25 : p.era === 'industrial' ? 78 : 99,
      povertyRate: p.era === 'antiquity' ? 65 : p.era === 'industrial' ? 35 : 12.4,
      ageDistribution: {
        youth0to14: 16.4,
        working15to64: 63.8,
        seniors65Plus: 19.8
      },
      socialClasses: {
        upperClass: 4,
        middleClass: 54,
        workingClass: 32,
        impoverished: 10
      },
      majorCities: [
        { name: p.capitalCity, population: 4.2, region: 'Metropolregion der Hauptstadt' },
        { name: 'Aurelia Hafenstadt', population: 2.8, region: 'Küstendistrikt' },
        { name: 'Kaisershafen', population: 1.9, region: 'Industrierevier' },
        { name: 'Bergstadt Neustadt', population: 1.4, region: 'Montan- und Rohstoffregion' }
      ]
    },

    governmentType: p.government,
    termLength: p.termLength,
    termsServed: 1,
    maxTerms: p.maxTerms,
    nextElectionYear: p.termLength > 0 ? p.year + p.termLength : null,
    suffrage: p.suffrage,
    succession: p.succession,
    
    stability: 78,
    unrest: 16,
    fearIndex: 12,
    censorshipLevel: 'free',
    
    ruler: {
      name: p.rulerName,
      title: p.rulerTitle,
      party: 'Nationale Reform- & Zukunftsallianz',
      dynastyName: p.dynastyName,
      age: 48,
      reignYears: 2,
      portraitStyle: p.portraitStyle,
      legitimacy: 85,
      prestige: 75,
      popularity: 64,
      reputation: 80,
      politicalPower: 76,
      slushFund: 4.5,
      secretSlushFund: playMode === 'shadow_president' ? 8.5 : 0.6,
      luxuryAssets: [...INITIAL_LUXURY_ASSETS],
      privateBusinesses: [...INITIAL_PRIVATE_BUSINESSES],
      heir: {
        name: 'Kronprinz Lukas',
        age: 21,
        competence: 72,
        loyalty: 88
      }
    },

    family: createInitialFamily(),
    cabinet: createInitialCabinet(),
    
    macro: {
      gdp: p.initialGdp,
      gdpGrowthRate: 2.8,
      inflationRate: 2.4,
      interestRate: 4.25,
      nationalDebt: p.initialDebt,
      unemploymentRate: 4.6,
      creditRating: 'AAA',
      domesticDemand: 82,
      treasury: p.treasury,
      debtRepayQuarterly: 5.0,
      debtRepayMode: 'manual',
      subsidiesTotal: 15.0,
      foreignTalentCampaignActive: true,
      foreignTalentBonus: 1.4
    },
    
    taxes: {
      income: 24,
      corporate: 21,
      vat: 19,
      fuel: 28,
      inheritance: 12,
      luxury: 14,
      resources: 18,
      financial: 2
    },
    
    resources: {
      energy: {
        id: 'energy',
        name: 'Erdöl, Erdgas & Elektrischer Strom',
        stockpile: 1800,
        production: 450,
        consumption: 420,
        unitPrice: 85,
        importTariff: 10
      },
      metals: {
        id: 'metals',
        name: 'Eisen, Stahl & Seltene Erden',
        stockpile: 1400,
        production: 320,
        consumption: 310,
        unitPrice: 110,
        importTariff: 8
      },
      food: {
        id: 'food',
        name: 'Getreide, Agrargüter & Viehzucht',
        stockpile: 2400,
        production: 600,
        consumption: 540,
        unitPrice: 42,
        importTariff: 5
      },
      manufacturing: {
        id: 'manufacturing',
        name: 'Hochtechnologie & Industriegüter',
        stockpile: 950,
        production: 380,
        consumption: 360,
        unitPrice: 195,
        importTariff: 12
      },
      goldReserves: {
        id: 'goldReserves',
        name: 'Staatliche Gold- & Währungsreserven',
        stockpile: 850,
        production: 20,
        consumption: 5,
        unitPrice: 450,
        importTariff: 0
      }
    },
    
    enterprises: createInitialEnterprises(),
    infrastructure: createInitialInfrastructure(),
    laws: createInitialLaws(),
    
    military: {
      infantryDivisions: 48,
      armoredDivisions: 22,
      specialForcesUnits: 14,
      fighterSquadrons: 35,
      navalFleets: 12,
      submarines: 18,
      nuclearSubmarines: 8,
      warships: 32,
      nuclearAircraftCarriers: 3,
      combatSatellites: 6,
      strategicNuclearWeapons: p.era === 'cold_war' || p.era === 'modern' || p.era === 'near_future' ? 240 : 0,
      nuclearWarheads: p.era === 'cold_war' || p.era === 'modern' || p.era === 'near_future' ? 1400 : 0,
      droneSwarmUnits: 140,
      roboticsLegions: 45,
      readinessDefcon: 5,
      annualArmsExports: 24.5,
      annualProcurementBudget: 32.0
    },
    
    factions: {
      military: 74,
      oligarchs: 68,
      commonWorkers: 61,
      clergy: 70,
      bureaucracy: 80
    },
    
    covertOps: [
      {
        id: 'op_espionage_1',
        name: 'Operation Nachtigall',
        type: 'espionage',
        targetRivalId: 'rival_eastern_bloc',
        cost: 15,
        risk: 25,
        successChance: 78,
        active: false,
        progress: 0
      },
      {
        id: 'op_sabotage_1',
        name: 'Operation Eiserner Hebel',
        type: 'sabotage',
        targetRivalId: 'rival_dragon_dominion',
        cost: 25,
        risk: 40,
        successChance: 65,
        active: false,
        progress: 0
      }
    ],
    
    rivals: createInitialRivals(),

    // Industry & Trade
    corporate100: createCorporate100(),
    industrySectors: createIndustry10x10(),
    tradeDeals: createInitialTradeDeals(),

    // Stock Market & SEC & Donations
    stocks: createInitialStocks(),
    secWatchCases: createInitialSecWatch(),
    donations: createInitialDonations(),

    // Underworld & Shadow Syndicate
    shadowSyndicate: createInitialShadowSyndicate(),

    // Social & Demographics Expansion
    welfarePackages: createInitialWelfarePackages(),
    pensionSystem: createInitialPensionSystem(),

    // Conflicts Live Theater
    liveConflicts: createInitialLiveConflicts(),
    
    // Foreign Affairs, Sovereign Lending, Global Investments & War Outcomes
    foreignLoans: [
      {
        id: 'loan-pol-1',
        countryId: 'pol',
        countryName: 'Polen',
        principalMrd: 15.0,
        interestRatePercent: 4.5,
        totalRepaymentMrd: 18.375,
        remainingMrd: 16.5,
        installmentQuarterlyMrd: 0.92,
        totalQuarters: 20,
        remainingQuarters: 18,
        riskRating: 'A'
      }
    ],
    foreignInvestments: [
      {
        id: 'inv-usa-1',
        countryId: 'usa',
        countryName: 'Vereinigte Staaten von Amerika',
        type: 'top10_company',
        entityName: 'Apple Inc.',
        sector: 'Technologie & Consumer Electronics',
        investedMrd: 8.0,
        sharesPercent: 0.25,
        quarterlyReturnPercent: 2.8,
        lastProfitQuarterMrd: 0.22
      },
      {
        id: 'inv-fra-1',
        countryId: 'fra',
        countryName: 'Frankreich',
        type: 'state_enterprise',
        entityName: 'Électricité de France (EDF)',
        sector: 'Nuklearenergie & Netzinfrastruktur',
        investedMrd: 5.0,
        sharesPercent: 4.2,
        quarterlyReturnPercent: 2.1,
        lastProfitQuarterMrd: 0.11
      }
    ],
    diplomaticTreaties: [
      {
        id: 'treaty-fra-1',
        countryId: 'fra',
        countryName: 'Frankreich',
        type: 'trade_pact',
        title: 'Bilateraler Vertrag für Freihandel & Zollabbau',
        signedYear: p.year - 1,
        signedQuarter: 3,
        benefitsDescription: '+0.15% BIP-Wachstum & steuerbegünstigter Güterverkehr'
      },
      {
        id: 'treaty-usa-1',
        countryId: 'usa',
        countryName: 'Vereinigte Staaten von Amerika',
        type: 'defense_pact',
        title: 'Transatlantischer Sicherheits- & Verteidigungspakt',
        signedYear: p.year - 2,
        signedQuarter: 1,
        benefitsDescription: 'Gegenseitige nukleare & konventionelle Schutzgarantie, +10 Stabilität'
      }
    ],
    federatedCountries: [],
    activeReparations: [],
    activeSanctions: [],
    
    isPaused: true,
    gameSpeed: 1,
    activeDilemma: null,
    historyLog: [
      {
        year: p.year,
        quarter: 1,
        text: `Die Regierungszeit von ${p.rulerTitle} ${p.rulerName} (${playMode === 'shadow_president' ? 'Schatten-Präsident' : 'Ehrlicher Staatsmann'}) über ${p.countryName} hat feierlich begonnen.`,
        type: 'positive'
      }
    ],
    gameOver: null
  };
}
