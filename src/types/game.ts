export type EraId = 
  | 'antiquity' 
  | 'middle_ages' 
  | 'early_modern' 
  | 'industrial' 
  | 'cold_war' 
  | 'modern' 
  | 'near_future';

export type GovernmentType = 
  | 'absolute_monarchy'
  | 'constitutional_monarchy'
  | 'parliamentary_democracy'
  | 'presidential_democracy'
  | 'military_dictatorship'
  | 'one_party_autocracy'
  | 'technocracy'
  | 'theocracy';

export type SuccessionLaw = 
  | 'primogeniture'
  | 'elective_council'
  | 'meritocratic'
  | 'military_junta'
  | 'party_politburo';

export type SuffrageType = 
  | 'universal'
  | 'landowners_wealth'
  | 'party_members_only'
  | 'military_only'
  | 'clergy_only'
  | 'none_absolute';

export type GamePlayMode = 'statesman' | 'shadow_president';
export type ThemeMode = 'dark' | 'light';

export type CreditRating = 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC' | 'D';

export interface TaxRates {
  income: number;          // Einkommensteuer 0 - 100 (%)
  corporate: number;       // Unternehmenssteuer 0 - 100 (%)
  vat: number;             // Mehrwertsteuer 0 - 100 (%)
  fuel: number;            // Mineralölsteuer 0 - 100 (%)
  inheritance: number;     // Erbschaftsteuer 0 - 100 (%)
  luxury?: number;         // Luxussteuer (optional backward compat)
  resources?: number;      // Rohstoffsteuer (optional backward compat)
  financial?: number;      // Finanztransaktionssteuer (optional backward compat)
}

export interface MacroEconomy {
  gdp: number;             // Milliarden
  gdpGrowthRate: number;   // %
  inflationRate: number;   // %
  interestRate: number;    // %
  nationalDebt: number;    // Milliarden
  unemploymentRate: number;// %
  creditRating: CreditRating;
  domesticDemand: number;  // 0 - 100 Index
  treasury: number;        // Milliarden liquide Staatskasse
  debtRepayQuarterly: number; // Frei einstellbare Tilgung pro Quartal in Mrd.
  debtRepayMode: 'manual' | 'auto_target';
  subsidiesTotal: number;  // Subventionen in Mrd.
  foreignTalentCampaignActive: boolean;
  foreignTalentBonus: number;
}

export interface ResourceItem {
  id: string;
  name: string;
  stockpile: number;       // Einheiten
  production: number;      // pro Quartal
  consumption: number;     // pro Quartal
  unitPrice: number;       // Weltmarktpreis
  importTariff: number;    // 0 - 100 %
}

export interface ResourcesState {
  energy: ResourceItem;
  metals: ResourceItem;
  food: ResourceItem;
  manufacturing: ResourceItem;
  goldReserves: ResourceItem;
}

export type EnterpriseOwnership = 'state_owned' | 'joint_venture' | 'privatized';

export interface StateEnterprise {
  id: string;
  name: string;
  sector: 'Water & Sanitation' | 'Power Grid' | 'Gas & Oil Pipelines' | 'Telecommunications';
  ownership: EnterpriseOwnership;
  quarterlyProfit: number; // to treasury
  publicServiceEfficiency: number; // 0 - 100
}

export interface InfrastructureLevel {
  id: string;
  name: string;
  category: 'transport' | 'control' | 'social' | 'welfare';
  level: number;           // 1 to 5
  costPerLevel: number;
  upkeepPerQuarter: number;
  description: string;
  bonusText: string;
}

export interface LawPolicy {
  id: string;
  category: 'labor' | 'environment' | 'penal' | 'civil_rights' | 'press' | 'religion';
  title: string;
  currentOption: string;
  options: {
    id: string;
    name: string;
    effectDescription: string;
    gdpMod: number;
    approvalMod: number;
    unrestMod: number;
    costPerQuarter: number;
  }[];
}

export interface MilitaryBranches {
  infantryDivisions: number;           // Heer & Landstreitkräfte
  armoredDivisions: number;            // Gepanzerte Divisionen
  specialForcesUnits?: number;         // Sondereinheiten & Elite-Kommandos
  fighterSquadrons: number;            // Luftwaffe & Jagdgeschwader
  navalFleets: number;                 // Marine & Flottenverbände
  submarines?: number;                 // Konventionelle U-Boote
  nuclearSubmarines: number;           // Atom-U-Boote
  warships?: number;                   // Kriegsschiffe (Zerstörer, Fregatten)
  nuclearAircraftCarriers: number;     // Flugzeugträger
  combatSatellites?: number;           // Kampfsatelliten (Orbitalwaffen)
  strategicNuclearWeapons?: number;    // Strategische Waffen (Atomwaffen, Wasserstoffbomben, Hyperschallraketen)
  nuclearWarheads: number;             // Nuklearsprengköpfe (Gesamt)
  droneSwarmUnits: number;             // Drohnen & Schwarm-Systeme
  roboticsLegions: number;             // Roboter & Autonome Kampfsysteme
  readinessDefcon: 1 | 2 | 3 | 4 | 5; // 5 = Frieden, 1 = Höchste Alarmstufe
  annualArmsExports: number;          // Rüstungsexporte
  annualProcurementBudget: number;    // Beschaffungsbudget
}

export interface CovertOperation {
  id: string;
  name: string;
  type: 'espionage' | 'sabotage' | 'assassination' | 'leak_scandal' | 'proxy_rebel' | 'combating_syndicate' | 'cyber_strike';
  targetRivalId: string;
  cost: number;
  risk: number; // 0 - 100%
  successChance: number; // 0 - 100%
  active: boolean;
  progress: number;
}

export interface FactionLoyalty {
  military: number;     // 0 - 100
  oligarchs: number;    // 0 - 100
  commonWorkers: number;// 0 - 100
  clergy: number;       // 0 - 100
  bureaucracy: number;  // 0 - 100
}

export interface LuxuryAsset {
  id: string;
  name: string;
  category: 'villa' | 'yacht' | 'private_jet' | 'art_collection' | 'island' | 'racing_team';
  valueMrd: number;
  upkeepQuarterlyMio: number;
  prestigeBonus: number;
  purchased: boolean;
  imageUrl?: string;
}

export interface PrivateBusiness {
  id: string;
  name: string;
  sector: string;
  investedMrd: number;
  valuationMrd: number;
  quarterlyProfitMio: number;
  ownershipPercent: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: 'Ehepartner' | 'Sohn' | 'Tochter' | 'Bruder' | 'Schwester';
  age: number;
  currentRole: string;
  netWorthMio: number;
  loyalty: number;       // 0 - 100
  competence: number;    // 0 - 100
  corruptionRisk: number;// 0 - 100
  conflictLevel: number; // Interessenkonflikt 0 - 100
  investments: string;
  donationsMadeMio: number;
}

export interface RulerProfile {
  name: string;
  title: string;
  party: string;
  dynastyName: string;
  age: number;
  reignYears: number;
  portraitStyle: 'regal' | 'military' | 'statesman' | 'theocrat' | 'technocrat';
  legitimacy: number;   // 0 - 100
  prestige: number;     // 0 - 100
  popularity: number;   // 0 - 100
  reputation: number;   // 0 - 100
  politicalPower: number;// 0 - 100
  slushFund: number;    // Privatvermögen in Mrd. (Official private account)
  secretSlushFund: number; // Geheimes Schatten-Konto in Mrd. (Offshore / Unterwelt)
  luxuryAssets: LuxuryAsset[];
  privateBusinesses: PrivateBusiness[];
  heir: {
    name: string;
    age: number;
    competence: number;
    loyalty: number;
  };
}

export interface CabinetMinister {
  id: string;
  department: 
    | 'foreign' 
    | 'space' 
    | 'justice' 
    | 'environment' 
    | 'education' 
    | 'finance' 
    | 'economy' 
    | 'defense' 
    | 'health' 
    | 'interior' 
    | 'infrastructure';
  departmentName: string;
  name: string;
  salaryMio: number;           // Jahresgehalt in Mio.
  quarterlyBudgetMrd: number;  // Ministerbudget in Mrd.
  loyalty: number;             // 0 - 100
  competence: number;          // 0 - 100
  currentProject: string;
  projectProgress: number;     // 0 - 100
  disclosedInvestments: {
    asset: string;
    valueMio: number;
    industry: string;
  }[];
}

export interface Corporate100Item {
  rank: number;
  name: string;
  sector: string;
  valuationMrd: number;
  revenueMrd: number;
  profitMrd: number;
  ceo: string;
  majorOwner: string;
  ownerWealthMrd: number;
  stateSharePercent: number; // 0 = voll privat, 100 = voll verstaatlicht
  status: 'private' | 'state_owned' | 'expropriated' | 'confiscated';
}

export interface SubSectorItem {
  id: string;
  name: string;
  productionRate: number;   // Einheiten
  domesticNeed: number;     // Einheiten
  worldMarketPrice: number; // Geldeinheiten pro Einheit
  importAmount: number;     // Einheiten
  exportAmount: number;     // Einheiten
  tariffPercent: number;    // 0 - 100 %
}

export interface MainIndustrySector {
  id: string;
  name: string;
  iconName: string;
  subSectors: SubSectorItem[];
}

export interface TradeDeal {
  id: string;
  partnerCountry: string;
  commodityName: string;
  type: 'import' | 'export';
  volumeQuarterly: number;
  pricePerUnit: number;
  valueQuarterlyMrd: number;
  durationQuarters: number;
  reliability: number; // 0 - 100 %
}

export interface StockItem {
  id: string;
  ticker: string;
  name: string;
  sector: string;
  currentPrice: number;
  priceHistory: number[];
  peRatio: number;
  dividendYield: number; // %
  marketCapMrd: number;
  volatility: number;
  stateSharesOwned: number;
  presidentSharesOwned: number;
  familySharesOwned: number;
}

export interface SecWatchCase {
  id: string;
  subject: string;
  allegation: string;
  suspicionScore: number;
  status: 'Ermittlung läuft' | 'Freigesprochen' | 'Bußgeld verhängt' | 'Anklage erhoben';
  fineMio?: number;
}

export interface DonationRecord {
  id: string;
  dateStr: string;
  source: string;
  recipient: string;
  amountMio: number;
  purpose: string;
}

export interface Underboss {
  id: string;
  name: string;
  alias: string;
  specialization: 'Schmuggel' | 'Geldwäsche' | 'Cybercrime' | 'Erpressung & Schutz' | 'Glücksspiel';
  loyalty: number;
  cutPercent: number;
}

export interface IllicitRacket {
  id: string;
  name: string;
  sector: string;
  incomeQuarterlyMio: number;
  riskPercent: number;
  territory: string;
  active: boolean;
}

export interface ShadowSyndicate {
  active: boolean;
  syndicateName: string;
  underbosses: Underboss[];
  rackets: IllicitRacket[];
  offshoreAccountsMrd: number;
  suspicionLevel: number;        // 0 - 100 %
  investigationPressure: number; // 0 - 100 %
  publicContractsAwarded: number;// Anzahl beeinflusster Aufträge
}

export interface WelfarePackage {
  id: string;
  title: string;
  category: 'Familie' | 'Arbeit' | 'Krise' | 'Wohnen';
  costMrd: number;
  stabilityBoost: number;
  unrestReduction: number;
  active: boolean;
  suggestedByAI: boolean;
}

export interface PensionSystem {
  targetLevelPercent: number; // Ziel: 75 %
  actualLevelPercent: number; // Aktuell berechnet
  sustainabilityIndex: number;// 0 - 100
  monthlyAverageEuro: number;
}

export interface LiveConflictTheater {
  id: string;
  regionName: string;
  parties: string[];
  escalationLevel: number; // 1 (Spannungen) bis 5 (Vollkollision / Nukleargefahr)
  recentCasualties: number;
  lastEventText: string;
  playerStance: 'neutral' | 'sanctions' | 'arms_support' | 'peacekeepers' | 'direct_intervention';
}

export interface RivalNation {
  id: string;
  name: string;
  leader: string;
  government: string;
  powerScore: number;
  relations: number;    // -100 (Krieg) bis +100 (Allianz)
  atWar: boolean;
  tradePact: boolean;
  militaryStrength: number;
  gdp: number;
  flagColor: string;
  coordinates: { x: number; y: number };
}

export interface ForeignLoan {
  id: string;
  countryId: string;
  countryName: string;
  principalMrd: number;
  interestRatePercent: number;
  totalRepaymentMrd: number;
  remainingMrd: number;
  installmentQuarterlyMrd: number;
  totalQuarters: number;
  remainingQuarters: number;
  riskRating: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC';
}

export interface ForeignInvestment {
  id: string;
  countryId: string;
  countryName: string;
  type: 'top10_company' | 'state_enterprise';
  investorSource?: 'state' | 'president_private' | 'offshore';
  entityName: string;
  sector: string;
  investedMrd: number;
  sharesPercent: number;
  quarterlyReturnPercent: number;
  lastProfitQuarterMrd: number;
  isWhollyOwned?: boolean;
}

export interface ActiveSanction {
  sanctionId: string;
  countryId: string;
  sanctionName: string;
  gdpImpactPercent: number;
}

export interface DiplomaticTreaty {
  id: string;
  countryId: string;
  countryName: string;
  type: 'trade_pact' | 'defense_pact' | 'tech_alliance' | 'resource_pact' | 'non_aggression' | 'customs_union';
  title: string;
  signedYear: number;
  signedQuarter: number;
  benefitsDescription: string;
}

export interface WarReparation {
  id: string;
  countryId: string;
  countryName: string;
  annualReparationMrd: number;
  quarterlyReparationMrd: number;
  remainingQuarters: number;
  totalCollectedMrd: number;
}

export interface DilemmaOption {
  text: string;
  outcomeText: string;
  treasuryDelta?: number;
  gdpGrowthDelta?: number;
  approvalDelta?: number;
  unrestDelta?: number;
  relationsDelta?: { rivalId: string; delta: number };
  factionDeltas?: Partial<FactionLoyalty>;
  militaryDelta?: number;
  legitimacyDelta?: number;
}

export interface DilemmaEvent {
  id: string;
  title: string;
  category: 'economic' | 'geopolitical' | 'dynastic' | 'social' | 'military';
  description: string;
  options: DilemmaOption[];
  eraRestricted?: EraId[];
}

export type FlagPattern = 
  | 'tricolor_horizontal' 
  | 'tricolor_vertical' 
  | 'bicolor_horizontal' 
  | 'bicolor_vertical' 
  | 'nordic_cross' 
  | 'saltire' 
  | 'canton' 
  | 'diagonal' 
  | 'solid_emblem';

export type FlagEmblem = 
  | 'eagle' 
  | 'lion' 
  | 'stars_ring' 
  | 'single_star' 
  | 'sun' 
  | 'laurel' 
  | 'crown' 
  | 'cross' 
  | 'crescent' 
  | 'anchor' 
  | 'hammer_sickle' 
  | 'sword' 
  | 'none';

export interface FlagDesign {
  pattern: FlagPattern;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  emblem: FlagEmblem;
  emblemColor: string;
  emblemPosition: 'center' | 'canton' | 'left';
}

export type MonetaryStandard = 
  | 'gold_standard' 
  | 'partial_gold' 
  | 'fiat_floating' 
  | 'pegged_currency' 
  | 'digital_crypto' 
  | 'commodity_basket';

export interface BanknoteDesign {
  denomination: number;
  colorTint: string;
  motif: 'sovereign_portrait' | 'monument' | 'coat_of_arms' | 'industrial' | 'nature' | 'science';
  watermark: boolean;
  hologramStripe: boolean;
  securityThread: boolean;
  seriesYear: number;
}

export interface CurrencyConfig {
  code: string;
  name: string;
  symbol: string;
  standard: MonetaryStandard;
  goldBackingPercent: number;
  pegTarget: string;
  banknote: BanknoteDesign;
}

export interface PopulationStats {
  total: number; // in Millionen
  growthRate: number; // %
  birthRatePer1000: number;
  deathRatePer1000: number;
  netMigrationThousands: number;
  lifeExpectancy: number; // Jahre
  urbanizationRate: number; // %
  hdiIndex: number; // 0.0 - 1.0
  literacyRate: number; // %
  povertyRate: number; // %
  ageDistribution: {
    youth0to14: number;
    working15to64: number;
    seniors65Plus: number;
  };
  socialClasses: {
    upperClass: number;
    middleClass: number;
    workingClass: number;
    impoverished: number;
  };
  majorCities: {
    name: string;
    population: number;
    region: string;
  }[];
}

export interface GameState {
  era: EraId;
  year: number;
  quarter: 1 | 2 | 3 | 4;
  playMode: GamePlayMode;     // 'statesman' (Ehrlicher Staatsmann) oder 'shadow_president' (Schatten-Präsident)
  themeMode: ThemeMode;       // 'dark' oder 'light'
  countryName: string;
  capitalCity: string;
  currencyName: string;
  currencySymbol: string;
  flagPrimaryColor: string;
  flagSecondaryColor: string;
  coatOfArmsSymbol: string;
  motto: string;
  
  // Design & Demographics
  flagDesign: FlagDesign;
  currencyConfig: CurrencyConfig;
  population: PopulationStats;

  governmentType: GovernmentType;
  termLength: number; // 0 für lebenslang
  termsServed: number;
  maxTerms: number;   // 0 für unbegrenzt
  nextElectionYear: number | null;
  suffrage: SuffrageType;
  succession: SuccessionLaw;
  
  stability: number;  // 0 - 100
  unrest: number;     // 0 - 100
  fearIndex: number;  // 0 - 100 (Polizeistaat / Kontrolle)
  censorshipLevel: 'free' | 'controlled' | 'state_monopoly' | 'total_blackout';
  
  ruler: RulerProfile;
  family: FamilyMember[];
  cabinet: CabinetMinister[];
  macro: MacroEconomy;
  taxes: TaxRates;
  resources: ResourcesState;
  enterprises: StateEnterprise[];
  infrastructure: InfrastructureLevel[];
  laws: LawPolicy[];
  military: MilitaryBranches;
  factions: FactionLoyalty;
  covertOps: CovertOperation[];
  rivals: RivalNation[];

  // Industry & Trade
  corporate100: Corporate100Item[];
  industrySectors: MainIndustrySector[];
  tradeDeals: TradeDeal[];

  // Stock Market & SEC & Donations
  stocks: StockItem[];
  secWatchCases: SecWatchCase[];
  donations: DonationRecord[];

  // Underworld & Shadow Syndicate
  shadowSyndicate: ShadowSyndicate;

  // Social & Demographics Expansion
  welfarePackages: WelfarePackage[];
  pensionSystem: PensionSystem;

  // Conflicts Live Theater
  liveConflicts: LiveConflictTheater[];

  // Foreign Affairs, Global Investments, Sovereign Lending & War Outcomes
  foreignLoans: ForeignLoan[];
  foreignInvestments: ForeignInvestment[];
  diplomaticTreaties: DiplomaticTreaty[];
  federatedCountries: string[]; // List of country IDs integrated into our federation
  activeReparations: WarReparation[]; // 50% GDP reparations for 20 years
  activeSanctions?: ActiveSanction[]; // Verhängte Wirtschaftssanktionen

  // Game loop controls
  isPaused: boolean;
  gameSpeed: 1 | 2 | 3 | 4; // 1 = Normal (6 Min/J), 2 = Stufe 2 (3 Min/J), 3 = Stufe 3 (2 Min/J), 4 = Max (1 Min/J)
  activeDilemma: DilemmaEvent | null;
  historyLog: {
    year: number;
    quarter: number;
    text: string;
    type: 'positive' | 'warning' | 'negative' | 'neutral';
  }[];
  gameOver: {
    isOver: boolean;
    reason: string;
    victory: boolean;
  } | null;
}
