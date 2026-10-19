import {
  CabinetMinister,
  Corporate100Item,
  FamilyMember,
  IllicitRacket,
  LiveConflictTheater,
  LuxuryAsset,
  MainIndustrySector,
  PensionSystem,
  PrivateBusiness,
  SecWatchCase,
  ShadowSyndicate,
  StockItem,
  TradeDeal,
  Underboss,
  WelfarePackage,
  DonationRecord
} from '../types/game';

export const INITIAL_LUXURY_ASSETS: LuxuryAsset[] = [
  {
    id: 'lux_villa',
    name: 'Präsidiales Anwesen am Genfer See',
    category: 'villa',
    valueMrd: 0.25,
    upkeepQuarterlyMio: 1.5,
    prestigeBonus: 8,
    purchased: false
  },
  {
    id: 'lux_yacht',
    name: '140m Superyacht „Imperator VI“',
    category: 'yacht',
    valueMrd: 0.65,
    upkeepQuarterlyMio: 4.2,
    prestigeBonus: 14,
    purchased: false
  },
  {
    id: 'lux_jet',
    name: 'Präsidenten-Flotte (2x Gulfstream G700)',
    category: 'private_jet',
    valueMrd: 0.18,
    upkeepQuarterlyMio: 2.1,
    prestigeBonus: 10,
    purchased: false
  },
  {
    id: 'lux_art',
    name: 'Meisterwerke-Kunstsammlung (Renaissance bis Moderne)',
    category: 'art_collection',
    valueMrd: 0.40,
    upkeepQuarterlyMio: 0.8,
    prestigeBonus: 12,
    purchased: false
  },
  {
    id: 'lux_island',
    name: 'Privatinsel „Sovereign Atoll“ in der Karibik',
    category: 'island',
    valueMrd: 1.20,
    upkeepQuarterlyMio: 3.5,
    prestigeBonus: 22,
    purchased: false
  },
  {
    id: 'lux_f1',
    name: 'Mehrheitsanteil an Formel-1-Weltmeisterteam',
    category: 'racing_team',
    valueMrd: 1.80,
    upkeepQuarterlyMio: 8.0,
    prestigeBonus: 25,
    purchased: false
  }
];

export const INITIAL_PRIVATE_BUSINESSES: PrivateBusiness[] = [
  {
    id: 'biz_real_estate',
    name: 'Alpha Prime Capital & Immobilien',
    sector: 'Gewerbeimmobilien & Logistikparks',
    investedMrd: 0.45,
    valuationMrd: 0.95,
    quarterlyProfitMio: 14.5,
    ownershipPercent: 85
  },
  {
    id: 'biz_logistics',
    name: 'Trans-Oceanic Fracht & Containerlinien',
    sector: 'Internationale Schifffahrt',
    investedMrd: 0.80,
    valuationMrd: 1.40,
    quarterlyProfitMio: 22.0,
    ownershipPercent: 60
  }
];

export function createInitialFamily(): FamilyMember[] {
  return [
    {
      id: 'fam_spouse',
      name: 'Eleonora von Bergmann',
      relation: 'Ehepartner',
      age: 49,
      currentRole: 'Vorsitzende der Nationalen Kulturstiftung',
      netWorthMio: 340,
      loyalty: 94,
      competence: 82,
      corruptionRisk: 12,
      conflictLevel: 15,
      investments: 'Kunststiftungen, Schweizer Staatsanleihen, Weingüter in der Toskana',
      donationsMadeMio: 8.5
    },
    {
      id: 'fam_heir_1',
      name: 'Maximilian Hayes',
      relation: 'Sohn',
      age: 26,
      currentRole: 'Junior-Vorstand bei Alpha Prime Capital',
      netWorthMio: 125,
      loyalty: 88,
      competence: 76,
      corruptionRisk: 34,
      conflictLevel: 42,
      investments: 'Tech-Startups, Venture Capital, Krypto-Hedgefonds',
      donationsMadeMio: 2.1
    },
    {
      id: 'fam_daughter',
      name: 'Dr. Clara Hayes',
      relation: 'Tochter',
      age: 24,
      currentRole: 'Sondergesandte für Entwicklungszusammenarbeit',
      netWorthMio: 45,
      loyalty: 92,
      competence: 90,
      corruptionRisk: 8,
      conflictLevel: 10,
      investments: 'Grüne Energie-Fonds, Medizinische Forschungsethik',
      donationsMadeMio: 4.8
    },
    {
      id: 'fam_brother',
      name: 'Konstantin Hayes',
      relation: 'Bruder',
      age: 52,
      currentRole: 'Aufsichtsrat & Rüstungslobbyist',
      netWorthMio: 580,
      loyalty: 72,
      competence: 84,
      corruptionRisk: 68,
      conflictLevel: 75,
      investments: 'Verteidigungskonzerne, Bergbau-Konzessionen, Rohstoff-Terminkontrakte',
      donationsMadeMio: 18.0
    }
  ];
}

export function createInitialCabinet(): CabinetMinister[] {
  return [
    {
      id: 'min_foreign',
      department: 'foreign',
      departmentName: 'Auswärtiges Amt & Globale Diplomatie',
      name: 'Dr. Helene Wallner',
      salaryMio: 0.38,
      quarterlyBudgetMrd: 4.5,
      loyalty: 82,
      competence: 88,
      currentProject: 'Modernisierung multilateraler Freihandelsabkommen & Botschaftsnetz',
      projectProgress: 45,
      disclosedInvestments: [
        { asset: 'Globale Dividenden-ETFs', valueMio: 3.2, industry: 'Finanzen' },
        { asset: 'Immobilienfonds Brüssel & Genf', valueMio: 2.1, industry: 'Immobilien' }
      ]
    },
    {
      id: 'min_space',
      department: 'space',
      departmentName: 'Raumfahrt & Zukunftsmissionen',
      name: 'Prof. Viktor Kren',
      salaryMio: 0.35,
      quarterlyBudgetMrd: 6.2,
      loyalty: 79,
      competence: 95,
      currentProject: 'Orbitales Satelliten-Frühwarnsystem & Trägerraketen der 3. Generation',
      projectProgress: 30,
      disclosedInvestments: [
        { asset: 'AeroSpace Venture Anteile', valueMio: 1.8, industry: 'Raumfahrt' },
        { asset: 'Solar-Tech Aktien', valueMio: 1.2, industry: 'Erneuerbare Energien' }
      ]
    },
    {
      id: 'min_justice',
      department: 'justice',
      departmentName: 'Justiz & Verfassungsschutz',
      name: 'Barbara Schönfeld',
      salaryMio: 0.36,
      quarterlyBudgetMrd: 3.8,
      loyalty: 90,
      competence: 91,
      currentProject: 'Digitalisierung der Bundesgerichte & Anti-Korruptionsprüfstelle',
      projectProgress: 60,
      disclosedInvestments: [
        { asset: 'Staatsanleihen Bundesrepublik', valueMio: 2.8, industry: 'Staatsfinanzen' }
      ]
    },
    {
      id: 'min_environment',
      department: 'environment',
      departmentName: 'Umwelt, Klima & Naturschutz',
      name: 'Janina Brandau',
      salaryMio: 0.34,
      quarterlyBudgetMrd: 5.4,
      loyalty: 76,
      competence: 84,
      currentProject: 'Renaturierung von Flussauen & Aufforstung strategischer Wassereinzugsgebiete',
      projectProgress: 40,
      disclosedInvestments: [
        { asset: 'Ökologische Waldwirtschafts-GmbH', valueMio: 0.9, industry: 'Forstwirtschaft' }
      ]
    },
    {
      id: 'min_education',
      department: 'education',
      departmentName: 'Bildung, Wissenschaft & Hochschulen',
      name: 'Prof. Dr. Matthias Vogt',
      salaryMio: 0.35,
      quarterlyBudgetMrd: 8.5,
      loyalty: 85,
      competence: 92,
      currentProject: 'Bundesweites Exzellenznetzwerk für Quantencomputing & MINT-Förderung',
      projectProgress: 55,
      disclosedInvestments: [
        { asset: 'Patente für Lehrmedien & Software', valueMio: 1.4, industry: 'EdTech' }
      ]
    },
    {
      id: 'min_finance',
      department: 'finance',
      departmentName: 'Finanzen & Bundesschatz',
      name: 'Christian Lindemann',
      salaryMio: 0.40,
      quarterlyBudgetMrd: 9.8,
      loyalty: 88,
      competence: 94,
      currentProject: 'Automatisierte Steuererhebung, Schuldenbremsen-Audit & Zinsmanagement',
      projectProgress: 70,
      disclosedInvestments: [
        { asset: 'Blue-Chip Aktienportfolio', valueMio: 6.5, industry: 'Industrie & Banken' },
        { asset: 'Goldbarren Tresoranlage Zürich', valueMio: 4.0, industry: 'Edelmetalle' }
      ]
    },
    {
      id: 'min_economy',
      department: 'economy',
      departmentName: 'Wirtschaft & Industriepolitik',
      name: 'Thorsten Eichel',
      salaryMio: 0.38,
      quarterlyBudgetMrd: 11.2,
      loyalty: 81,
      competence: 86,
      currentProject: 'Transformationsfonds für Halbleiterwerke & Automobil-Umstellung',
      projectProgress: 35,
      disclosedInvestments: [
        { asset: 'Beteiligung Maschinenbau Eichel KG', valueMio: 8.2, industry: 'Maschinenbau' },
        { asset: 'Immobilienkomplex Frankfurt', valueMio: 3.9, industry: 'Immobilien' }
      ]
    },
    {
      id: 'min_defense',
      department: 'defense',
      departmentName: 'Verteidigung & Streitkräfte',
      name: 'General a.D. Marcus Raven',
      salaryMio: 0.42,
      quarterlyBudgetMrd: 18.5,
      loyalty: 92,
      competence: 96,
      currentProject: 'Beschaffung von Stealth-Kampfdrohnen & Modernisierung des Panzerschutzes',
      projectProgress: 48,
      disclosedInvestments: [
        { asset: 'Rüstungs- und Sensorikfonds', valueMio: 4.5, industry: 'Verteidigung' }
      ]
    },
    {
      id: 'min_health',
      department: 'health',
      departmentName: 'Gesundheit, Pflege & Epidemieschutz',
      name: 'Dr. Annette Gerber',
      salaryMio: 0.36,
      quarterlyBudgetMrd: 14.0,
      loyalty: 84,
      competence: 89,
      currentProject: 'Nationale Reserve für Notfallarzneien & Intensivbetten-Modernisierung',
      projectProgress: 65,
      disclosedInvestments: [
        { asset: 'Medizintechnik-Aktien', valueMio: 2.4, industry: 'Pharma' }
      ]
    },
    {
      id: 'min_interior',
      department: 'interior',
      departmentName: 'Inneres, Sicherheit & Katastrophenschutz',
      name: 'Klaus-Dieter Hartung',
      salaryMio: 0.38,
      quarterlyBudgetMrd: 10.5,
      loyalty: 87,
      competence: 87,
      currentProject: 'Bundesweiter Katastrophen-Warnfunk & Cyber-Abwehrzentrum',
      projectProgress: 52,
      disclosedInvestments: [
        { asset: 'Gewerbeimmobilien Berlin & Dresden', valueMio: 3.1, industry: 'Immobilien' }
      ]
    },
    {
      id: 'min_infrastructure',
      department: 'infrastructure',
      departmentName: 'Infrastruktur, Verkehr & Digitalnetze',
      name: 'Sabine Leutner',
      salaryMio: 0.37,
      quarterlyBudgetMrd: 12.8,
      loyalty: 83,
      competence: 85,
      currentProject: 'Hochgeschwindigkeits-Schienenkorridor & 100% Glasfaserausbau',
      projectProgress: 42,
      disclosedInvestments: [
        { asset: 'Telekom- und Netzinfrastrukturfonds', valueMio: 2.7, industry: 'Telekom' }
      ]
    }
  ];
}

// 100 Most valuable companies
export function createCorporate100(): Corporate100Item[] {
  const sectors = [
    'Automotive & Mobilität',
    'Halbleiter & Mikroelektronik',
    'Chemie & Werkstoffe',
    'Pharmakologie & Biotechnologie',
    'Maschinen- & Anlagenbau',
    'Energie & Netzbetreiber',
    'Rüstung & Wehrtechnik',
    'Bankwesen & Finanzdienstleistungen',
    'Telekommunikation & Cloud',
    'Logistik & Welthandel',
    'Rohstoffe & Montanindustrie',
    'Luft- & Raumfahrt'
  ];

  const prefixNames = [
    'Aegis', 'Bavaria', 'Continental', 'Deutsche', 'Euclid', 'Helios', 'Hyperion', 'Imperial',
    'Kronos', 'Lumina', 'Mercurius', 'Nordic', 'Optima', 'Phoenix', 'Quantum', 'Rhein',
    'Sovereign', 'Titan', 'United', 'Vanguard', 'Waldenburg', 'Zeissler', 'Aethelgard', 'Omni'
  ];

  const suffixNames = [
    'Dynamics', 'Industries', 'Systems', 'Holdings AG', 'Technologies', 'Energy Group',
    'Capital & Credit', 'Logistics Worldwide', 'AeroSpace', 'Pharma AG', 'Silicon Solutions',
    'Motors SE', 'Metallurgy', 'Networks', 'Robotics', 'Materials Corp.'
  ];

  const ceos = [
    'Dr. Albrecht von Stauffen', 'Evelyn Richter', 'Maximilian Brandt', 'Sarah Engel',
    'Klaus Weidemann', 'Dr. Miriam Schuster', 'Thorsten Beck', 'Friedrich Sommer',
    'Anna Kowalska', 'Henrik Lindberg', 'Dr. Wolfgang Porschel', 'Valerie Leclerc',
    'Carl-Friedrich Voss', 'Katrin Baumgartner', 'Stefan Holzer', 'Monika Becker'
  ];

  const owners = [
    'Familienstiftung von Stauffen', 'BlackRock Sovereign Fund', 'Vanguard Institutional',
    'Quandt-Holding', 'Staatsfonds Norwegen', 'Porschel Heritage Trust', 'Goldman Sachs Alliance',
    'Dr. Albrecht von Stauffen privat', 'Privatkonsortium Kronos', 'Staatsbeteiligung 25%'
  ];

  const list: Corporate100Item[] = [];

  for (let i = 1; i <= 100; i++) {
    const pfx = prefixNames[(i * 7) % prefixNames.length];
    const sfx = suffixNames[(i * 11) % suffixNames.length];
    const sector = sectors[(i * 3) % sectors.length];
    const ceo = ceos[(i * 5) % ceos.length];
    const owner = owners[(i * 9) % owners.length];

    // Valuation descending from 450 Mrd down to 12 Mrd
    const valuation = Number((480 / Math.pow(i, 0.48)).toFixed(1));
    const revenue = Number((valuation * (0.35 + (i % 7) * 0.05)).toFixed(1));
    const profit = Number((revenue * (0.08 + (i % 5) * 0.03)).toFixed(1));
    const ownerWealth = Number((valuation * 0.18 + (i % 10) * 1.5).toFixed(1));

    list.push({
      rank: i,
      name: `${pfx} ${sfx}`,
      sector,
      valuationMrd: valuation,
      revenueMrd: revenue,
      profitMrd: profit,
      ceo,
      majorOwner: owner,
      ownerWealthMrd: ownerWealth,
      stateSharePercent: i <= 5 ? 25 : i % 8 === 0 ? 33 : 0,
      status: 'private'
    });
  }

  return list;
}

// 10 Main Sectors each with 10 Subsectors (= 100 total!)
export function createIndustry10x10(): MainIndustrySector[] {
  return [
    {
      id: 'sec_energy',
      name: '1. Energie & Grundversorgung',
      iconName: 'Zap',
      subSectors: [
        { id: 'en_nuclear', name: 'Kernkraft & Fusionsforschung', productionRate: 420, domesticNeed: 380, worldMarketPrice: 85, importAmount: 20, exportAmount: 60, tariffPercent: 5 },
        { id: 'en_crude_oil', name: 'Erdölförderung & Raffinerien', productionRate: 650, domesticNeed: 710, worldMarketPrice: 78, importAmount: 110, exportAmount: 50, tariffPercent: 8 },
        { id: 'en_natural_gas', name: 'Erdgasförderung & LNG-Terminals', productionRate: 480, domesticNeed: 520, worldMarketPrice: 62, importAmount: 85, exportAmount: 45, tariffPercent: 6 },
        { id: 'en_coal', name: 'Braunkohle- & Steinkohlekraft', productionRate: 290, domesticNeed: 260, worldMarketPrice: 42, importAmount: 10, exportAmount: 40, tariffPercent: 12 },
        { id: 'en_solar', name: 'Photovoltaik- & Solarparks', productionRate: 380, domesticNeed: 350, worldMarketPrice: 55, importAmount: 30, exportAmount: 60, tariffPercent: 4 },
        { id: 'en_wind_offshore', name: 'Windenergie (Offshore & Onshore)', productionRate: 460, domesticNeed: 410, worldMarketPrice: 58, importAmount: 15, exportAmount: 65, tariffPercent: 3 },
        { id: 'en_hydrogen', name: 'Grüner Wasserstoff & Elektrolyseure', productionRate: 180, domesticNeed: 210, worldMarketPrice: 115, importAmount: 50, exportAmount: 20, tariffPercent: 5 },
        { id: 'en_geothermal', name: 'Geothermie & Fernwärmenetze', productionRate: 140, domesticNeed: 135, worldMarketPrice: 48, importAmount: 5, exportAmount: 10, tariffPercent: 2 },
        { id: 'en_grid', name: 'Höchstspannungs-Stromübertragungsnetz', productionRate: 510, domesticNeed: 490, worldMarketPrice: 72, importAmount: 20, exportAmount: 40, tariffPercent: 4 },
        { id: 'en_battery_storage', name: 'Großbatteriespeicher & Netzpuffer', productionRate: 220, domesticNeed: 240, worldMarketPrice: 130, importAmount: 45, exportAmount: 25, tariffPercent: 6 }
      ]
    },
    {
      id: 'sec_metals',
      name: '2. Rohstoffe, Metalle & Montanindustrie',
      iconName: 'Boxes',
      subSectors: [
        { id: 'met_rare_earths', name: 'Seltene Erden (Neodym, Dysprosium)', productionRate: 90, domesticNeed: 140, worldMarketPrice: 240, importAmount: 65, exportAmount: 15, tariffPercent: 10 },
        { id: 'met_lithium', name: 'Lithiumförderung & Akku-Salze', productionRate: 110, domesticNeed: 180, worldMarketPrice: 195, importAmount: 85, exportAmount: 15, tariffPercent: 8 },
        { id: 'met_copper', name: 'Kupferminen & Kathodenschmelzen', productionRate: 340, domesticNeed: 390, worldMarketPrice: 92, importAmount: 70, exportAmount: 20, tariffPercent: 5 },
        { id: 'met_steel', name: 'Hochofenstahl & Elektrostahlwerke', productionRate: 580, domesticNeed: 520, worldMarketPrice: 65, importAmount: 40, exportAmount: 100, tariffPercent: 9 },
        { id: 'met_gold', name: 'Goldabbau & Edelmetall-Raffinerien', productionRate: 45, domesticNeed: 35, worldMarketPrice: 480, importAmount: 10, exportAmount: 20, tariffPercent: 0 },
        { id: 'met_platinum', name: 'Platingruppenmetalle & Katalysatormetalle', productionRate: 35, domesticNeed: 50, worldMarketPrice: 380, importAmount: 22, exportAmount: 7, tariffPercent: 2 },
        { id: 'met_titanium', name: 'Titan-Schwamm & Luftfahrtlegierungen', productionRate: 75, domesticNeed: 95, worldMarketPrice: 160, importAmount: 32, exportAmount: 12, tariffPercent: 6 },
        { id: 'met_aluminum', name: 'Bauxit & Primäraluminium-Hütten', productionRate: 410, domesticNeed: 440, worldMarketPrice: 58, importAmount: 60, exportAmount: 30, tariffPercent: 7 },
        { id: 'met_nickel', name: 'Nickel für Superlegierungen', productionRate: 130, domesticNeed: 160, worldMarketPrice: 125, importAmount: 45, exportAmount: 15, tariffPercent: 5 },
        { id: 'met_cobalt', name: 'Kobaltkonzentrat & Batteriematerial', productionRate: 60, domesticNeed: 95, worldMarketPrice: 175, importAmount: 45, exportAmount: 10, tariffPercent: 8 }
      ]
    },
    {
      id: 'sec_agri',
      name: '3. Agrar, Ernährung & Forstwirtschaft',
      iconName: 'Wheat',
      subSectors: [
        { id: 'ag_wheat', name: 'Weizen-, Gerste- & Getreideanbau', productionRate: 620, domesticNeed: 540, worldMarketPrice: 45, importAmount: 30, exportAmount: 110, tariffPercent: 6 },
        { id: 'ag_livestock', name: 'Rinderzucht, Schweine & Geflügel', productionRate: 510, domesticNeed: 480, worldMarketPrice: 52, importAmount: 25, exportAmount: 55, tariffPercent: 8 },
        { id: 'ag_dairy', name: 'Milchwirtschaft & Käsereien', productionRate: 440, domesticNeed: 410, worldMarketPrice: 48, importAmount: 15, exportAmount: 45, tariffPercent: 7 },
        { id: 'ag_fertilizer', name: 'Stickstoff- & Phosphatdüngemittel', productionRate: 360, domesticNeed: 330, worldMarketPrice: 68, importAmount: 20, exportAmount: 50, tariffPercent: 5 },
        { id: 'ag_seeds', name: 'Saatgutzucht & Agrar-Genetik', productionRate: 190, domesticNeed: 160, worldMarketPrice: 140, importAmount: 15, exportAmount: 45, tariffPercent: 4 },
        { id: 'ag_soy', name: 'Sojabohnen & Eiweißfuttermittel', productionRate: 180, domesticNeed: 310, worldMarketPrice: 58, importAmount: 145, exportAmount: 15, tariffPercent: 6 },
        { id: 'ag_sugar', name: 'Zuckerrüben & Stärkeproduktion', productionRate: 320, domesticNeed: 290, worldMarketPrice: 38, importAmount: 20, exportAmount: 50, tariffPercent: 9 },
        { id: 'ag_coffee', name: 'Kaffee-, Tee- & Kakaoverarbeitung', productionRate: 85, domesticNeed: 190, worldMarketPrice: 110, importAmount: 120, exportAmount: 15, tariffPercent: 4 },
        { id: 'ag_fisheries', name: 'Hochseefischerei & Aquakulturen', productionRate: 240, domesticNeed: 270, worldMarketPrice: 75, importAmount: 55, exportAmount: 25, tariffPercent: 7 },
        { id: 'ag_timber', name: 'Forstwirtschaft & Nutzholz-Sägewerke', productionRate: 380, domesticNeed: 340, worldMarketPrice: 62, importAmount: 20, exportAmount: 60, tariffPercent: 5 }
      ]
    },
    {
      id: 'sec_hightech',
      name: '4. Hochtechnologie, Halbleiter & KI',
      iconName: 'Cpu',
      subSectors: [
        { id: 'hi_wafers', name: 'Halbleiter-Wafer (3nm & 2nm Fertigung)', productionRate: 310, domesticNeed: 420, worldMarketPrice: 350, importAmount: 140, exportAmount: 30, tariffPercent: 4 },
        { id: 'hi_ai_servers', name: 'KI-Rechenzentren & Tensor-Supercomputer', productionRate: 280, domesticNeed: 320, worldMarketPrice: 420, importAmount: 80, exportAmount: 40, tariffPercent: 3 },
        { id: 'hi_quantum', name: 'Quantenprozessoren & Kryptochips', productionRate: 95, domesticNeed: 85, worldMarketPrice: 580, importAmount: 15, exportAmount: 25, tariffPercent: 2 },
        { id: 'hi_robotics', name: 'Industrieroboter & Humanoide Assistenten', productionRate: 340, domesticNeed: 290, worldMarketPrice: 210, importAmount: 30, exportAmount: 80, tariffPercent: 5 },
        { id: 'hi_cloud', name: 'Sovereign Cloud & Unternehmenssoftware', productionRate: 450, domesticNeed: 410, worldMarketPrice: 185, importAmount: 40, exportAmount: 80, tariffPercent: 3 },
        { id: 'hi_optics', name: 'Präzisionsoptik & EUV-Lithographie', productionRate: 190, domesticNeed: 140, worldMarketPrice: 490, importAmount: 10, exportAmount: 60, tariffPercent: 4 },
        { id: 'hi_sensors', name: 'Sensorik & IoT-Messelektronik', productionRate: 390, domesticNeed: 350, worldMarketPrice: 120, importAmount: 35, exportAmount: 75, tariffPercent: 5 },
        { id: 'hi_biotech', name: 'Gensequenzierung & Bio-Informatik', productionRate: 210, domesticNeed: 195, worldMarketPrice: 280, importAmount: 25, exportAmount: 40, tariffPercent: 3 },
        { id: 'hi_nanotech', name: 'Nanomaterialien & Graphen-Synthese', productionRate: 130, domesticNeed: 120, worldMarketPrice: 310, importAmount: 20, exportAmount: 30, tariffPercent: 4 },
        { id: 'hi_cybersec', name: 'Cyber-Defense & Zero-Trust-Verschlüsselung', productionRate: 360, domesticNeed: 330, worldMarketPrice: 220, importAmount: 25, exportAmount: 55, tariffPercent: 2 }
      ]
    },
    {
      id: 'sec_machinery',
      name: '5. Maschinenbau & Schwerindustrie',
      iconName: 'Cog',
      subSectors: [
        { id: 'mac_cnc', name: 'CNC-Werkzeugmaschinen & Fräszentren', productionRate: 460, domesticNeed: 370, worldMarketPrice: 175, importAmount: 25, exportAmount: 115, tariffPercent: 6 },
        { id: 'mac_shipbuilding', name: 'Schiffbau (Großfrachter, LNG-Tanker)', productionRate: 210, domesticNeed: 190, worldMarketPrice: 260, importAmount: 30, exportAmount: 50, tariffPercent: 7 },
        { id: 'mac_rail', name: 'Schienenfahrzeuge & Hochgeschwindigkeitszüge', productionRate: 320, domesticNeed: 260, worldMarketPrice: 190, importAmount: 15, exportAmount: 75, tariffPercent: 5 },
        { id: 'mac_construction', name: 'Schwere Baumaschinen & Großbagger', productionRate: 380, domesticNeed: 310, worldMarketPrice: 165, importAmount: 20, exportAmount: 90, tariffPercent: 6 },
        { id: 'mac_turbines', name: 'Gasturbinen & Kraftwerksgeneratoren', productionRate: 270, domesticNeed: 210, worldMarketPrice: 230, importAmount: 10, exportAmount: 70, tariffPercent: 4 },
        { id: 'mac_foundries', name: 'Gießereien & Präzisionsschmieden', productionRate: 410, domesticNeed: 390, worldMarketPrice: 95, importAmount: 30, exportAmount: 50, tariffPercent: 6 },
        { id: 'mac_cranes', name: 'Hafenkräne & Schwerlasthebezeuge', productionRate: 240, domesticNeed: 180, worldMarketPrice: 180, importAmount: 15, exportAmount: 75, tariffPercent: 5 },
        { id: 'mac_hydraulics', name: 'Industriehydraulik & Pneumatiksysteme', productionRate: 390, domesticNeed: 340, worldMarketPrice: 125, importAmount: 25, exportAmount: 75, tariffPercent: 5 },
        { id: 'mac_pumps', name: 'Hochleistungspumpen & Verdichter', productionRate: 350, domesticNeed: 310, worldMarketPrice: 110, importAmount: 20, exportAmount: 60, tariffPercent: 5 },
        { id: 'mac_packaging', name: 'Automatisierte Verpackungsstraßen', productionRate: 330, domesticNeed: 280, worldMarketPrice: 135, importAmount: 20, exportAmount: 70, tariffPercent: 4 }
      ]
    },
    {
      id: 'sec_pharma',
      name: '6. Chemie, Pharmazie & Medizintechnik',
      iconName: 'FlaskConical',
      subSectors: [
        { id: 'ph_vaccines', name: 'mRNA-Impfstoffe & Immuntherapien', productionRate: 290, domesticNeed: 240, worldMarketPrice: 290, importAmount: 20, exportAmount: 70, tariffPercent: 2 },
        { id: 'ph_basic_chem', name: 'Basischemie (Ethylen, Ammoniak, Chlor)', productionRate: 540, domesticNeed: 520, worldMarketPrice: 72, importAmount: 45, exportAmount: 65, tariffPercent: 6 },
        { id: 'ph_polymers', name: 'Spezialpolymere & Hochleistungskunststoffe', productionRate: 460, domesticNeed: 390, worldMarketPrice: 115, importAmount: 25, exportAmount: 95, tariffPercent: 5 },
        { id: 'ph_agrochemicals', name: 'Pflanzenschutzmittel & Biopestizide', productionRate: 370, domesticNeed: 320, worldMarketPrice: 135, importAmount: 20, exportAmount: 70, tariffPercent: 6 },
        { id: 'ph_specialty', name: 'Spezialpharmaka & Krebsmedikamente', productionRate: 310, domesticNeed: 280, worldMarketPrice: 340, importAmount: 35, exportAmount: 65, tariffPercent: 3 },
        { id: 'ph_medtech', name: 'Medizintechnik (MRT, OP-Roboter, Implantate)', productionRate: 360, domesticNeed: 290, worldMarketPrice: 270, importAmount: 25, exportAmount: 95, tariffPercent: 3 },
        { id: 'ph_catalysts', name: 'Industriekatalysatoren & Feinchemie', productionRate: 220, domesticNeed: 190, worldMarketPrice: 210, importAmount: 15, exportAmount: 45, tariffPercent: 4 },
        { id: 'ph_coatings', name: 'Industrielacke & Korrosionsschutz', productionRate: 380, domesticNeed: 340, worldMarketPrice: 85, importAmount: 25, exportAmount: 65, tariffPercent: 5 },
        { id: 'ph_diagnostics', name: 'Labor-Diagnostik & Antikörper-Tests', productionRate: 310, domesticNeed: 260, worldMarketPrice: 165, importAmount: 20, exportAmount: 70, tariffPercent: 3 },
        { id: 'ph_consumables', name: 'Medizinische Einwegartikel & Schutzkleidung', productionRate: 420, domesticNeed: 450, worldMarketPrice: 42, importAmount: 70, exportAmount: 40, tariffPercent: 4 }
      ]
    },
    {
      id: 'sec_consumer',
      name: '7. Konsumgüter, Automotive & Lifestyle',
      iconName: 'Car',
      subSectors: [
        { id: 'co_ev_cars', name: 'Elektrofahrzeuge & Hybridlimousinen', productionRate: 580, domesticNeed: 490, worldMarketPrice: 190, importAmount: 40, exportAmount: 130, tariffPercent: 8 },
        { id: 'co_trucks', name: 'Schwere Nutzfahrzeuge & Kommunal-LKW', productionRate: 390, domesticNeed: 310, worldMarketPrice: 160, importAmount: 20, exportAmount: 100, tariffPercent: 7 },
        { id: 'co_electronics', name: 'Smartphones, TV-Geräte & Heimcomputer', productionRate: 280, domesticNeed: 520, worldMarketPrice: 145, importAmount: 280, exportAmount: 40, tariffPercent: 5 },
        { id: 'co_appliances', name: 'Weiße Ware (Kühlschränke, Waschmaschinen)', productionRate: 410, domesticNeed: 380, worldMarketPrice: 95, importAmount: 45, exportAmount: 75, tariffPercent: 6 },
        { id: 'co_textiles', name: 'Textilindustrie, Sportbekleidung & Schuhe', productionRate: 220, domesticNeed: 490, worldMarketPrice: 48, importAmount: 310, exportAmount: 40, tariffPercent: 8 },
        { id: 'co_furniture', name: 'Möbeldesign, Küchen & Inneneinrichtung', productionRate: 370, domesticNeed: 350, worldMarketPrice: 75, importAmount: 45, exportAmount: 65, tariffPercent: 6 },
        { id: 'co_processed_food', name: 'Lebensmittelverarbeitung & Brauereien', productionRate: 560, domesticNeed: 510, worldMarketPrice: 55, importAmount: 30, exportAmount: 80, tariffPercent: 7 },
        { id: 'co_cosmetics', name: 'Kosmetik, Parfümerie & Körperpflege', productionRate: 340, domesticNeed: 290, worldMarketPrice: 110, importAmount: 30, exportAmount: 80, tariffPercent: 5 },
        { id: 'co_watches', name: 'Luxusuhren & Feinmechanik', productionRate: 140, domesticNeed: 90, worldMarketPrice: 380, importAmount: 10, exportAmount: 60, tariffPercent: 6 },
        { id: 'co_packaging', name: 'Recyclingfähige Verpackungslösungen', productionRate: 450, domesticNeed: 430, worldMarketPrice: 40, importAmount: 30, exportAmount: 50, tariffPercent: 5 }
      ]
    },
    {
      id: 'sec_construction',
      name: '8. Bauwirtschaft, Zement & Smart Cities',
      iconName: 'Building',
      subSectors: [
        { id: 'bu_cement', name: 'Klinkerarme Zemente & Transportbeton', productionRate: 590, domesticNeed: 560, worldMarketPrice: 45, importAmount: 20, exportAmount: 50, tariffPercent: 8 },
        { id: 'bu_structural', name: 'Stahlbeton-Hochbau & Wolkenkratzer', productionRate: 440, domesticNeed: 420, worldMarketPrice: 120, importAmount: 15, exportAmount: 35, tariffPercent: 5 },
        { id: 'bu_bridges', name: 'Brückenbau, Viadukte & Tiefbau', productionRate: 390, domesticNeed: 380, worldMarketPrice: 140, importAmount: 10, exportAmount: 20, tariffPercent: 4 },
        { id: 'bu_timber', name: 'Massivholzbau & Brettsperrholz', productionRate: 310, domesticNeed: 270, worldMarketPrice: 85, importAmount: 15, exportAmount: 55, tariffPercent: 5 },
        { id: 'bu_insulation', name: 'Dämmstoffe & Energieeffizienz', productionRate: 420, domesticNeed: 390, worldMarketPrice: 70, importAmount: 20, exportAmount: 50, tariffPercent: 6 },
        { id: 'bu_glass', name: 'Architekturglas & Dreifach-Isolierung', productionRate: 360, domesticNeed: 330, worldMarketPrice: 75, importAmount: 20, exportAmount: 50, tariffPercent: 5 },
        { id: 'bu_tunnels', name: 'Tunnelvortriebsmaschinen & U-Bahnen', productionRate: 230, domesticNeed: 190, worldMarketPrice: 220, importAmount: 10, exportAmount: 50, tariffPercent: 4 },
        { id: 'bu_precast', name: 'Modulare Fertigbau-Elemente', productionRate: 380, domesticNeed: 350, worldMarketPrice: 88, importAmount: 15, exportAmount: 45, tariffPercent: 5 },
        { id: 'bu_smart_grid', name: 'Gebäudeautomation & Smart-Metering', productionRate: 320, domesticNeed: 290, worldMarketPrice: 150, importAmount: 25, exportAmount: 55, tariffPercent: 4 },
        { id: 'bu_recycling', name: 'Baustoff-Recycling & Zirkuläre Aufbereitung', productionRate: 410, domesticNeed: 390, worldMarketPrice: 50, importAmount: 10, exportAmount: 30, tariffPercent: 3 }
      ]
    },
    {
      id: 'sec_finance',
      name: '9. Finanzmärkte, Logistik & Dienstleistungen',
      iconName: 'Landmark',
      subSectors: [
        { id: 'fi_investment', name: 'Investmentbanking & Konsortialkredite', productionRate: 510, domesticNeed: 460, worldMarketPrice: 210, importAmount: 30, exportAmount: 80, tariffPercent: 2 },
        { id: 'fi_reinsurance', name: 'Rückversicherungen & Risikotransfer', productionRate: 460, domesticNeed: 390, worldMarketPrice: 230, importAmount: 20, exportAmount: 90, tariffPercent: 1 },
        { id: 'fi_shipping', name: 'Reedereien & Container-Terminals', productionRate: 480, domesticNeed: 420, worldMarketPrice: 140, importAmount: 25, exportAmount: 85, tariffPercent: 3 },
        { id: 'fi_telecom', name: 'Glasfaser-Backbones & 5G-Mobilfunk', productionRate: 520, domesticNeed: 490, worldMarketPrice: 110, importAmount: 20, exportAmount: 50, tariffPercent: 3 },
        { id: 'fi_legal', name: 'Wirtschaftskanzleien & M&A-Beratung', productionRate: 370, domesticNeed: 340, worldMarketPrice: 195, importAmount: 15, exportAmount: 45, tariffPercent: 2 },
        { id: 'fi_auditing', name: 'Wirtschaftsprüfung & Ratingagenturen', productionRate: 340, domesticNeed: 310, worldMarketPrice: 175, importAmount: 15, exportAmount: 45, tariffPercent: 2 },
        { id: 'fi_media', name: 'Internationale Medienkonzerne & Streaming', productionRate: 410, domesticNeed: 380, worldMarketPrice: 125, importAmount: 40, exportAmount: 70, tariffPercent: 4 },
        { id: 'fi_tourism', name: 'Kongresstourismus, Luxushotels & Fluggesellschaften', productionRate: 490, domesticNeed: 450, worldMarketPrice: 105, importAmount: 35, exportAmount: 75, tariffPercent: 4 },
        { id: 'fi_data_centers', name: 'Hyperscale-Rechenzentren & Colocation', productionRate: 440, domesticNeed: 390, worldMarketPrice: 180, importAmount: 25, exportAmount: 75, tariffPercent: 3 },
        { id: 'fi_fintech', name: 'Fintech-Zahlungsabwicklung & Neobanken', productionRate: 430, domesticNeed: 380, worldMarketPrice: 165, importAmount: 20, exportAmount: 70, tariffPercent: 2 }
      ]
    },
    {
      id: 'sec_defense',
      name: '10. Rüstung, Raumfahrt & Wehrtechnik',
      iconName: 'ShieldAlert',
      subSectors: [
        { id: 'de_space_launch', name: 'Orbital-Schwerlastraketen & Satellitenbusse', productionRate: 240, domesticNeed: 190, worldMarketPrice: 390, importAmount: 15, exportAmount: 65, tariffPercent: 4 },
        { id: 'de_drones', name: 'Autonome KI-Drohnenschwärme & Loitering Munition', productionRate: 380, domesticNeed: 290, worldMarketPrice: 280, importAmount: 20, exportAmount: 110, tariffPercent: 5 },
        { id: 'de_armor', name: 'Reaktivpanzerungen & Kampfpanzer Leopard/Abrams', productionRate: 340, domesticNeed: 260, worldMarketPrice: 260, importAmount: 15, exportAmount: 95, tariffPercent: 6 },
        { id: 'de_fighter_jets', name: 'Tarnkappen-Kampfflugzeuge der 6. Generation', productionRate: 260, domesticNeed: 210, worldMarketPrice: 480, importAmount: 20, exportAmount: 70, tariffPercent: 5 },
        { id: 'de_submarines', name: 'Brennstoffzellen- & Nuklear-U-Boote', productionRate: 190, domesticNeed: 140, worldMarketPrice: 520, importAmount: 10, exportAmount: 60, tariffPercent: 4 },
        { id: 'de_air_defense', name: 'Hyperschall-Raketenabwehr & Laser-C-RAM', productionRate: 310, domesticNeed: 240, worldMarketPrice: 360, importAmount: 15, exportAmount: 85, tariffPercent: 4 },
        { id: 'de_radar', name: 'AESA-Radare & Elektronische Kampfführung (EW)', productionRate: 330, domesticNeed: 250, worldMarketPrice: 290, importAmount: 15, exportAmount: 95, tariffPercent: 3 },
        { id: 'de_munitions', name: 'Präzisions-Artilleriegranaten (155mm) & Marschflugkörper', productionRate: 470, domesticNeed: 360, worldMarketPrice: 130, importAmount: 25, exportAmount: 135, tariffPercent: 5 },
        { id: 'de_cyberweapons', name: 'Strategische Cyberwaffen & Netzinfiltration', productionRate: 290, domesticNeed: 240, worldMarketPrice: 380, importAmount: 10, exportAmount: 60, tariffPercent: 0 },
        { id: 'de_space_stations', name: 'Orbitale Verteidigungsstationen & Aufklärungsgitter', productionRate: 140, domesticNeed: 110, worldMarketPrice: 650, importAmount: 5, exportAmount: 35, tariffPercent: 2 }
      ]
    }
  ];
}

export function createInitialTradeDeals(): TradeDeal[] {
  return [
    {
      id: 'deal_1',
      partnerCountry: 'Vereinigte Staaten',
      commodityName: 'Halbleiter & KI-Server',
      type: 'import',
      volumeQuarterly: 120,
      pricePerUnit: 350,
      valueQuarterlyMrd: 4.2,
      durationQuarters: 12,
      reliability: 95
    },
    {
      id: 'deal_2',
      partnerCountry: 'Frankreich',
      commodityName: 'Kernenergie & Luftfahrtkomponenten',
      type: 'export',
      volumeQuarterly: 95,
      pricePerUnit: 260,
      valueQuarterlyMrd: 2.5,
      durationQuarters: 8,
      reliability: 92
    },
    {
      id: 'deal_3',
      partnerCountry: 'Großbritannien',
      commodityName: 'Finanzdienstleistungen & Rückversicherungen',
      type: 'export',
      volumeQuarterly: 140,
      pricePerUnit: 210,
      valueQuarterlyMrd: 3.1,
      durationQuarters: 16,
      reliability: 90
    },
    {
      id: 'deal_4',
      partnerCountry: 'Norwegen',
      commodityName: 'LNG-Erdgas & Wasserkraftreserven',
      type: 'import',
      volumeQuarterly: 160,
      pricePerUnit: 65,
      valueQuarterlyMrd: 1.8,
      durationQuarters: 20,
      reliability: 98
    },
    {
      id: 'deal_5',
      partnerCountry: 'Japan',
      commodityName: 'Robotik & Medizintechnik',
      type: 'export',
      volumeQuarterly: 80,
      pricePerUnit: 270,
      valueQuarterlyMrd: 2.2,
      durationQuarters: 10,
      reliability: 94
    }
  ];
}

export function createInitialStocks(): StockItem[] {
  return [
    {
      id: 'stk_1',
      ticker: 'APEX',
      name: 'Apex BioTech & Pharma AG',
      sector: 'Pharmakologie',
      currentPrice: 142.50,
      priceHistory: [128, 131, 135, 133, 138, 142.5],
      peRatio: 18.4,
      dividendYield: 3.2,
      marketCapMrd: 185.0,
      volatility: 14,
      stateSharesOwned: 1200000,
      presidentSharesOwned: 450000,
      familySharesOwned: 120000
    },
    {
      id: 'stk_2',
      ticker: 'VEX',
      name: 'Volks-Energie & Stromnetz AG',
      sector: 'Energie & Netz',
      currentPrice: 68.20,
      priceHistory: [64, 65, 66, 67, 66, 68.2],
      peRatio: 12.1,
      dividendYield: 5.4,
      marketCapMrd: 94.0,
      volatility: 8,
      stateSharesOwned: 15000000,
      presidentSharesOwned: 800000,
      familySharesOwned: 350000
    },
    {
      id: 'stk_3',
      ticker: 'RST',
      name: 'Rheinmetall & Wehrtechnik SE',
      sector: 'Rüstung',
      currentPrice: 485.00,
      priceHistory: [380, 410, 430, 460, 475, 485],
      peRatio: 26.5,
      dividendYield: 2.1,
      marketCapMrd: 62.0,
      volatility: 22,
      stateSharesOwned: 4500000,
      presidentSharesOwned: 250000,
      familySharesOwned: 600000
    },
    {
      id: 'stk_4',
      ticker: 'QNT',
      name: 'Quantum Silicon & AI Foundry',
      sector: 'Halbleiter',
      currentPrice: 312.40,
      priceHistory: [240, 265, 290, 280, 305, 312.4],
      peRatio: 38.2,
      dividendYield: 0.8,
      marketCapMrd: 320.0,
      volatility: 28,
      stateSharesOwned: 800000,
      presidentSharesOwned: 600000,
      familySharesOwned: 150000
    },
    {
      id: 'stk_5',
      ticker: 'DBC',
      name: 'Deutsche Bundes-Credit Bank',
      sector: 'Finanzen',
      currentPrice: 44.80,
      priceHistory: [41, 42, 43, 42, 44, 44.8],
      peRatio: 9.8,
      dividendYield: 6.2,
      marketCapMrd: 75.0,
      volatility: 12,
      stateSharesOwned: 10000000,
      presidentSharesOwned: 300000,
      familySharesOwned: 200000
    }
  ];
}

export function createInitialSecWatch(): SecWatchCase[] {
  return [
    {
      id: 'sec_1',
      subject: 'Hedging-Aktivitäten vor Zinsentscheid der Zentralbank',
      allegation: 'Verdacht auf Insiderhandel mit Staatsanleihen-Derivaten durch Ministeriumskontakte',
      suspicionScore: 68,
      status: 'Ermittlung läuft'
    },
    {
      id: 'sec_2',
      subject: 'Apex BioTech Großtransaktion vor Zulassungsentscheid',
      allegation: 'Ungewöhnliche Call-Optionen über Briefkastenfirma in Liechtenstein',
      suspicionScore: 42,
      status: 'Ermittlung läuft'
    }
  ];
}

export function createInitialDonations(): DonationRecord[] {
  return [
    {
      id: 'don_1',
      dateStr: 'Vor 2 Monaten',
      source: 'Kronos Industries Holding',
      recipient: 'Regierungspartei Wahlkampffonds',
      amountMio: 4.5,
      purpose: 'Förderung wirtschaftsfreundlicher Rahmenbedingungen & Messen'
    },
    {
      id: 'don_2',
      dateStr: 'Vor 4 Monaten',
      source: 'Präsidenten-Privatstiftung Hayes',
      recipient: 'Nationales Waisenfonds & Kinderkrankenhaus',
      amountMio: 15.0,
      purpose: 'Gemeinnützige medizinische Ausstattung'
    },
    {
      id: 'don_3',
      dateStr: 'Vor 6 Monaten',
      source: 'Verband der Maschinenbau-Industrie',
      recipient: 'Stiftung für Begabtenförderung & Bildung',
      amountMio: 6.2,
      purpose: 'Stipendienprogramme für MINT-Studenten'
    }
  ];
}

export function createInitialShadowSyndicate(): ShadowSyndicate {
  return {
    active: true,
    syndicateName: 'Das Kartell von Valoria (Geheimes Syndikat)',
    underbosses: [
      {
        id: 'ub_1',
        name: 'Vittorio „Der Notar“ Salvi',
        alias: 'Der Notar',
        specialization: 'Geldwäsche',
        loyalty: 85,
        cutPercent: 12
      },
      {
        id: 'ub_2',
        name: 'Taras „Kranich“ Voronin',
        alias: 'Der Kranich',
        specialization: 'Schmuggel',
        loyalty: 78,
        cutPercent: 15
      },
      {
        id: 'ub_3',
        name: 'Elena „ZeroDay“ Rostova',
        alias: 'ZeroDay',
        specialization: 'Cybercrime',
        loyalty: 91,
        cutPercent: 10
      }
    ],
    rackets: [
      {
        id: 'rkt_1',
        name: 'Hafen-Schmuggelnetzwerk Süd',
        sector: 'Zollfreie Frachten & Elektronik',
        incomeQuarterlyMio: 38,
        riskPercent: 28,
        territory: 'Häfen & Zollfreizonen',
        active: true
      },
      {
        id: 'rkt_2',
        name: 'Offshore-Briefkastenfirmen Panama & Caymans',
        sector: 'Steuerumgehung & Geldwäsche',
        incomeQuarterlyMio: 55,
        riskPercent: 22,
        territory: 'Internationaler Bankensektor',
        active: true
      },
      {
        id: 'rkt_3',
        name: 'Cyber-Erpressung & Daten-Leasing',
        sector: 'Ransomware & Industriespionage',
        incomeQuarterlyMio: 42,
        riskPercent: 35,
        territory: 'Virtueller Raum',
        active: true
      }
    ],
    offshoreAccountsMrd: 1.85,
    suspicionLevel: 24,
    investigationPressure: 18,
    publicContractsAwarded: 4
  };
}

export function createInitialWelfarePackages(): WelfarePackage[] {
  return [
    {
      id: 'welf_energy',
      title: 'Staatliche Strom- & Gaspreisbremse',
      category: 'Krise',
      costMrd: 4.8,
      stabilityBoost: 8,
      unrestReduction: 12,
      active: true,
      suggestedByAI: false
    },
    {
      id: 'welf_family',
      title: 'Kindergrundsicherung & Familienstartgeld',
      category: 'Familie',
      costMrd: 6.2,
      stabilityBoost: 6,
      unrestReduction: 5,
      active: false,
      suggestedByAI: true
    },
    {
      id: 'welf_housing',
      title: 'Mietpreisdeckel & Sozialer Wohnungsbaufonds',
      category: 'Wohnen',
      costMrd: 5.5,
      stabilityBoost: 7,
      unrestReduction: 8,
      active: false,
      suggestedByAI: true
    },
    {
      id: 'welf_citizen',
      title: 'Bürgergeld-Zulage & Inflationsausgleichsprämie',
      category: 'Arbeit',
      costMrd: 7.0,
      stabilityBoost: 9,
      unrestReduction: 14,
      active: false,
      suggestedByAI: true
    }
  ];
}

export function createInitialPensionSystem(): PensionSystem {
  return {
    targetLevelPercent: 75, // 75% Zielwert wie gefordert!
    actualLevelPercent: 68.5,
    sustainabilityIndex: 82,
    monthlyAverageEuro: 1780
  };
}

export function createInitialLiveConflicts(): LiveConflictTheater[] {
  return [
    {
      id: 'conf_1',
      regionName: 'Straße von Hormus & Golfregion',
      parties: ['Westliche Koalition', 'Regionalmacht Süd'],
      escalationLevel: 3,
      recentCasualties: 140,
      lastEventText: 'Drohnenangriff auf einen Öltanker im Seegang; Geleitkreuzer im Gefechtszustand.',
      playerStance: 'sanctions'
    },
    {
      id: 'conf_2',
      regionName: 'Östliche Pufferzone & Grenzflüsse',
      parties: ['Ostblock-Dominion', 'Freie Grenzprovinzen'],
      escalationLevel: 4,
      recentCasualties: 820,
      lastEventText: 'Artillerieduelle entlang der Demarkationslinie, Panzereinheiten verlegt.',
      playerStance: 'arms_support'
    }
  ];
}
