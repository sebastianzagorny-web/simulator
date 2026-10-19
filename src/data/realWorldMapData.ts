export interface ForeignCompany {
  id: string;
  name: string;
  sector: string;
  marketCapBillions: number;
  returnRatePercent: number; // vierteljährliche Rendite in %
  dividendYield: number;     // jährliche Dividende in %
  description: string;
  ceo?: string;
  acquisitionCostBillions?: number; // 100% Übernahmekosten (inkl. 15% Kontrollprämie)
}

export interface ForeignStateEnterprise {
  id: string;
  name: string;
  sector: string;
  valuationBillions: number;
  returnRatePercent: number;
  strategicImportance: string;
}

export interface WeaponTradeItem {
  id: string;
  name: string;
  category: 'Landstreitkräfte' | 'Luftwaffe' | 'Marine & U-Boote' | 'Drohnen & Roboter' | 'Strategisch & Raketen';
  priceMrd: number;
  powerBonus: number;
  description: string;
}

export interface TechTradeItem {
  id: string;
  name: string;
  category: 'Raumfahrt & Satelliten' | 'Cyber & KI' | 'Nuklear- & Energietechnik' | 'Quantentechnologie';
  priceMrd: number;
  gdpBonusPercent: number;
  description: string;
}

export interface RealCountryData {
  id: string;
  name: string;
  isoCode: string;
  capital: string;
  region: string;
  populationMillions: number;
  gdpBillions: number;
  debtBillions?: number;  // Staatsverschuldung
  governmentGerman: string;
  leaderGerman: string;
  militaryScore: number; // 0 - 100
  relations: number;     // -100 to +100
  atWar: boolean;
  tradePact: boolean;
  flagColor: string;
  path: string;          // SVG path
  center: { x: number; y: number };
}

// Coordinate viewbox: 0 0 1000 500 (Equirectangular standard projection)
export const REAL_WORLD_COUNTRIES: RealCountryData[] = [
  {
    id: 'usa',
    name: 'Vereinigte Staaten von Amerika',
    isoCode: 'USA',
    capital: 'Washington, D.C.',
    region: 'Nordamerika',
    populationMillions: 335.8,
    gdpBillions: 28500,
    governmentGerman: 'Präsidiale Bundesrepublik',
    leaderGerman: 'Präsident Alexander Hayes',
    militaryScore: 98,
    relations: 40,
    atWar: false,
    tradePact: true,
    flagColor: '#1e40af',
    center: { x: 210, y: 175 },
    path: 'M 130 140 L 220 135 L 290 145 L 305 175 L 300 205 L 285 220 L 255 210 L 210 235 L 165 215 L 125 180 Z'
  },
  {
    id: 'can',
    name: 'Kanada',
    isoCode: 'CAN',
    capital: 'Ottawa',
    region: 'Nordamerika',
    populationMillions: 40.1,
    gdpBillions: 2150,
    governmentGerman: 'Parlamentarische Monarchie',
    leaderGerman: 'Premierminister Justin Sterling',
    militaryScore: 72,
    relations: 65,
    atWar: false,
    tradePact: true,
    flagColor: '#dc2626',
    center: { x: 210, y: 100 },
    path: 'M 115 135 L 140 85 L 210 65 L 290 70 L 325 110 L 285 140 L 210 130 L 130 138 Z'
  },
  {
    id: 'mex',
    name: 'Mexiko',
    isoCode: 'MEX',
    capital: 'Mexiko-Stadt',
    region: 'Nordamerika',
    populationMillions: 129.5,
    gdpBillions: 1800,
    governmentGerman: 'Präsidialdemokratie',
    leaderGerman: 'Präsidentin Claudia Morales',
    militaryScore: 60,
    relations: 45,
    atWar: false,
    tradePact: true,
    flagColor: '#16a34a',
    center: { x: 195, y: 255 },
    path: 'M 165 218 L 225 238 L 240 260 L 235 285 L 215 280 L 180 250 Z'
  },
  {
    id: 'bra',
    name: 'Brasilien',
    isoCode: 'BRA',
    capital: 'Brasília',
    region: 'Südamerika',
    populationMillions: 216.4,
    gdpBillions: 2200,
    governmentGerman: 'Föderale Republik',
    leaderGerman: 'Präsident Luiz Silva',
    militaryScore: 68,
    relations: 30,
    atWar: false,
    tradePact: false,
    flagColor: '#15803d',
    center: { x: 345, y: 345 },
    path: 'M 290 285 L 345 280 L 390 310 L 395 365 L 360 415 L 320 380 L 285 330 Z'
  },
  {
    id: 'arg',
    name: 'Argentinien',
    isoCode: 'ARG',
    capital: 'Buenos Aires',
    region: 'Südamerika',
    populationMillions: 46.2,
    gdpBillions: 640,
    governmentGerman: 'Präsidialrepublik',
    leaderGerman: 'Präsident Javier Rossi',
    militaryScore: 52,
    relations: 25,
    atWar: false,
    tradePact: false,
    flagColor: '#38bdf8',
    center: { x: 315, y: 430 },
    path: 'M 305 385 L 340 385 L 345 440 L 325 485 L 305 470 L 300 410 Z'
  },
  {
    id: 'deu',
    name: 'Deutschland',
    isoCode: 'DEU',
    capital: 'Berlin',
    region: 'Europa',
    populationMillions: 84.4,
    gdpBillions: 4450,
    governmentGerman: 'Parlamentarische Bundesrepublik',
    leaderGerman: 'Bundeskanzler Henrik Weber',
    militaryScore: 78,
    relations: 75,
    atWar: false,
    tradePact: true,
    flagColor: '#eab308',
    center: { x: 505, y: 150 },
    path: 'M 495 140 L 515 138 L 522 152 L 512 165 L 494 162 Z'
  },
  {
    id: 'fra',
    name: 'Frankreich',
    isoCode: 'FRA',
    capital: 'Paris',
    region: 'Europa',
    populationMillions: 68.2,
    gdpBillions: 3050,
    governmentGerman: 'Semipräsidiale Republik',
    leaderGerman: 'Präsident Henri de Valois',
    militaryScore: 84,
    relations: 70,
    atWar: false,
    tradePact: true,
    flagColor: '#2563eb',
    center: { x: 478, y: 165 },
    path: 'M 465 152 L 492 148 L 494 175 L 478 190 L 460 178 Z'
  },
  {
    id: 'gbr',
    name: 'Vereinigtes Königreich',
    isoCode: 'GBR',
    capital: 'London',
    region: 'Europa',
    populationMillions: 67.8,
    gdpBillions: 3340,
    governmentGerman: 'Parlamentarische Monarchie',
    leaderGerman: 'Premierminister Arthur Pendelton',
    militaryScore: 86,
    relations: 65,
    atWar: false,
    tradePact: true,
    flagColor: '#1d4ed8',
    center: { x: 462, y: 132 },
    path: 'M 454 122 L 472 120 L 472 142 L 458 145 Z'
  },
  {
    id: 'ita',
    name: 'Italien',
    isoCode: 'ITA',
    capital: 'Rom',
    region: 'Europa',
    populationMillions: 58.9,
    gdpBillions: 2250,
    governmentGerman: 'Parlamentarische Republik',
    leaderGerman: 'Ministerpräsidentin Elena Conti',
    militaryScore: 74,
    relations: 60,
    atWar: false,
    tradePact: true,
    flagColor: '#16a34a',
    center: { x: 508, y: 182 },
    path: 'M 498 172 L 518 170 L 522 195 L 532 208 L 520 215 L 505 188 Z'
  },
  {
    id: 'esp',
    name: 'Spanien',
    isoCode: 'ESP',
    capital: 'Madrid',
    region: 'Europa',
    populationMillions: 48.4,
    gdpBillions: 1600,
    governmentGerman: 'Parlamentarische Erbmonarchie',
    leaderGerman: 'Ministerpräsident Carlos Solano',
    militaryScore: 69,
    relations: 60,
    atWar: false,
    tradePact: true,
    flagColor: '#dc2626',
    center: { x: 450, y: 188 },
    path: 'M 438 178 L 464 176 L 460 205 L 434 206 Z'
  },
  {
    id: 'pol',
    name: 'Polen',
    isoCode: 'POL',
    capital: 'Warschau',
    region: 'Europa',
    populationMillions: 37.8,
    gdpBillions: 840,
    governmentGerman: 'Parlamentarische Republik',
    leaderGerman: 'Präsident Marek Nowak',
    militaryScore: 73,
    relations: 55,
    atWar: false,
    tradePact: true,
    flagColor: '#ef4444',
    center: { x: 535, y: 148 },
    path: 'M 522 138 L 550 138 L 552 158 L 524 160 Z'
  },
  {
    id: 'ukr',
    name: 'Ukraine',
    isoCode: 'UKR',
    capital: 'Kiew',
    region: 'Europa',
    populationMillions: 38.0,
    gdpBillions: 180,
    governmentGerman: 'Semipräsidiale Republik',
    leaderGerman: 'Präsident Wolodymyr Schewtschenko',
    militaryScore: 76,
    relations: 50,
    atWar: false,
    tradePact: false,
    flagColor: '#0284c7',
    center: { x: 575, y: 155 },
    path: 'M 552 142 L 602 140 L 600 170 L 565 174 L 552 160 Z'
  },
  {
    id: 'rus',
    name: 'Russische Föderation',
    isoCode: 'RUS',
    capital: 'Moskau',
    region: 'Eurasien',
    populationMillions: 144.2,
    gdpBillions: 2050,
    governmentGerman: 'Präsidiale Autokratie',
    leaderGerman: 'Präsident Dmitri Wolkow',
    militaryScore: 92,
    relations: -40,
    atWar: false,
    tradePact: false,
    flagColor: '#b91c1c',
    center: { x: 680, y: 110 },
    path: 'M 555 125 L 610 95 L 750 80 L 890 90 L 880 145 L 760 160 L 630 155 L 560 138 Z'
  },
  {
    id: 'chn',
    name: 'Volksrepublik China',
    isoCode: 'CHN',
    capital: 'Peking',
    region: 'Ostasien',
    populationMillions: 1410.5,
    gdpBillions: 18500,
    governmentGerman: 'Einparteien-Volksrepublik',
    leaderGerman: 'Generalsekretär Zhao Ming',
    militaryScore: 95,
    relations: 5,
    atWar: false,
    tradePact: true,
    flagColor: '#ea580c',
    center: { x: 745, y: 205 },
    path: 'M 670 175 L 765 165 L 825 185 L 815 255 L 755 260 L 695 240 L 665 210 Z'
  },
  {
    id: 'ind',
    name: 'Indien',
    isoCode: 'IND',
    capital: 'Neu-Delhi',
    region: 'Südasien',
    populationMillions: 1428.6,
    gdpBillions: 3750,
    governmentGerman: 'Parlamentarische Bundesrepublik',
    leaderGerman: 'Premierminister Rajesh Sharma',
    militaryScore: 88,
    relations: 45,
    atWar: false,
    tradePact: true,
    flagColor: '#f97316',
    center: { x: 690, y: 250 },
    path: 'M 665 215 L 710 215 L 720 260 L 690 310 L 665 265 Z'
  },
  {
    id: 'jpn',
    name: 'Japan',
    isoCode: 'JPN',
    capital: 'Tokio',
    region: 'Ostasien',
    populationMillions: 124.5,
    gdpBillions: 4210,
    governmentGerman: 'Parlamentarische Monarchie',
    leaderGerman: 'Premierminister Kenji Sato',
    militaryScore: 82,
    relations: 70,
    atWar: false,
    tradePact: true,
    flagColor: '#e11d48',
    center: { x: 845, y: 195 },
    path: 'M 835 180 L 852 175 L 855 210 L 838 215 Z'
  },
  {
    id: 'sau',
    name: 'Saudi-Arabien',
    isoCode: 'SAU',
    capital: 'Riad',
    region: 'Naher Osten',
    populationMillions: 36.4,
    gdpBillions: 1100,
    governmentGerman: 'Absolute Monarchie',
    leaderGerman: 'König Salman Al-Saud',
    militaryScore: 75,
    relations: 35,
    atWar: false,
    tradePact: true,
    flagColor: '#15803d',
    center: { x: 595, y: 250 },
    path: 'M 570 230 L 618 230 L 625 270 L 590 285 L 565 258 Z'
  },
  {
    id: 'tur',
    name: 'Türkei',
    isoCode: 'TUR',
    capital: 'Ankara',
    region: 'Kleinasien & Naher Osten',
    populationMillions: 85.3,
    gdpBillions: 1150,
    governmentGerman: 'Präsidialrepublik',
    leaderGerman: 'Präsident Kemal Demir',
    militaryScore: 80,
    relations: 40,
    atWar: false,
    tradePact: true,
    flagColor: '#e11d48',
    center: { x: 565, y: 192 },
    path: 'M 545 185 L 590 182 L 592 205 L 545 204 Z'
  },
  {
    id: 'egy',
    name: 'Ägypten',
    isoCode: 'EGY',
    capital: 'Kairo',
    region: 'Nordafrika',
    populationMillions: 111.0,
    gdpBillions: 400,
    governmentGerman: 'Präsidialrepublik',
    leaderGerman: 'Präsident Farouk Mansour',
    militaryScore: 71,
    relations: 40,
    atWar: false,
    tradePact: true,
    flagColor: '#ca8a04',
    center: { x: 545, y: 235 },
    path: 'M 525 218 L 565 215 L 565 250 L 525 250 Z'
  },
  {
    id: 'zaf',
    name: 'Südafrika',
    isoCode: 'ZAF',
    capital: 'Pretoria',
    region: 'Südliches Afrika',
    populationMillions: 60.6,
    gdpBillions: 380,
    governmentGerman: 'Parlamentarische Republik',
    leaderGerman: 'Präsident Thabo Mbeko',
    militaryScore: 58,
    relations: 45,
    atWar: false,
    tradePact: true,
    flagColor: '#059669',
    center: { x: 545, y: 430 },
    path: 'M 525 405 L 570 405 L 565 450 L 520 445 Z'
  },
  {
    id: 'aus',
    name: 'Australien',
    isoCode: 'AUS',
    capital: 'Canberra',
    region: 'Ozeanien',
    populationMillions: 26.5,
    gdpBillions: 1720,
    governmentGerman: 'Parlamentarische Monarchie',
    leaderGerman: 'Premierminister Liam O’Connor',
    militaryScore: 75,
    relations: 75,
    atWar: false,
    tradePact: true,
    flagColor: '#0369a1',
    center: { x: 820, y: 380 },
    path: 'M 760 340 L 860 330 L 880 395 L 840 435 L 775 425 L 755 375 Z'
  },
  {
    id: 'swe',
    name: 'Schweden',
    isoCode: 'SWE',
    capital: 'Stockholm',
    region: 'Nordeuropa',
    populationMillions: 10.5,
    gdpBillions: 600,
    governmentGerman: 'Parlamentarische Monarchie',
    leaderGerman: 'Ministerpräsident Erik Lindqvist',
    militaryScore: 70,
    relations: 65,
    atWar: false,
    tradePact: true,
    flagColor: '#0284c7',
    center: { x: 518, y: 105 },
    path: 'M 505 85 L 525 80 L 532 120 L 512 125 Z'
  },
  {
    id: 'kor',
    name: 'Südkorea',
    isoCode: 'KOR',
    capital: 'Seoul',
    region: 'Ostasien',
    populationMillions: 51.7,
    gdpBillions: 1710,
    governmentGerman: 'Präsidialdemokratie',
    leaderGerman: 'Präsident Park Jae-sung',
    militaryScore: 89,
    relations: 60,
    atWar: false,
    tradePact: true,
    flagColor: '#2563eb',
    center: { x: 818, y: 202 },
    path: 'M 810 195 L 826 195 L 824 212 L 812 212 Z'
  },
  {
    id: 'idn',
    name: 'Indonesien',
    isoCode: 'IDN',
    capital: 'Jakarta',
    region: 'Südostasien',
    populationMillions: 277.5,
    gdpBillions: 1370,
    governmentGerman: 'Präsidialrepublik',
    leaderGerman: 'Präsident Budi Santoso',
    militaryScore: 66,
    relations: 45,
    atWar: false,
    tradePact: true,
    flagColor: '#dc2626',
    center: { x: 785, y: 310 },
    path: 'M 740 300 L 780 295 L 825 315 L 820 325 L 760 320 Z'
  },
  {
    id: 'nga',
    name: 'Nigeria',
    isoCode: 'NGA',
    capital: 'Abuja',
    region: 'Westafrika',
    populationMillions: 223.8,
    gdpBillions: 477,
    governmentGerman: 'Föderale Bundesrepublik',
    leaderGerman: 'Präsident Adebayo Tinubu',
    militaryScore: 60,
    relations: 40,
    atWar: false,
    tradePact: false,
    flagColor: '#16a34a',
    center: { x: 495, y: 280 },
    path: 'M 475 265 L 515 265 L 512 300 L 478 298 Z'
  },
  {
    id: 'col',
    name: 'Kolumbien',
    isoCode: 'COL',
    capital: 'Bogotá',
    region: 'Südamerika',
    populationMillions: 52.1,
    gdpBillions: 365,
    governmentGerman: 'Präsidialrepublik',
    leaderGerman: 'Präsident Mateo Ramirez',
    militaryScore: 55,
    relations: 50,
    atWar: false,
    tradePact: true,
    flagColor: '#eab308',
    center: { x: 278, y: 285 },
    path: 'M 265 265 L 290 265 L 295 300 L 270 305 Z'
  }
];

export function getCountryDebtBillions(c: RealCountryData): number {
  if (c.debtBillions !== undefined) return c.debtBillions;
  // Realistische Annäherung nach Weltbank-Standards
  if (c.id === 'usa') return 34500;
  if (c.id === 'deu') return 2620;
  if (c.id === 'jpn') return 10800;
  if (c.id === 'fra') return 3120;
  if (c.id === 'gbr') return 2950;
  if (c.id === 'chn') return 14200;
  if (c.id === 'ita') return 2880;
  if (c.id === 'can') return 1950;
  if (c.id === 'ind') return 3100;
  if (c.id === 'rus') return 380;
  return Math.round(c.gdpBillions * 0.68);
}

export function getCountryTop15Companies(countryId: string, countryName: string, gdpBillions: number): ForeignCompany[] {
  if (countryId === 'usa') {
    return [
      { id: 'usa-c1', name: 'Apple Inc.', sector: 'Technologie & Consumer Electronics', marketCapBillions: 3450, returnRatePercent: 3.2, dividendYield: 0.6, description: 'Marktführer für Smartphones, Computer und digitale Ökosysteme.' },
      { id: 'usa-c2', name: 'Microsoft Corporation', sector: 'Software, Cloud & KI', marketCapBillions: 3200, returnRatePercent: 3.4, dividendYield: 0.8, description: 'Weltweiter Marktführer in Unternehmenssoftware, Azure Cloud und KI.' },
      { id: 'usa-c3', name: 'NVIDIA Corporation', sector: 'KI-Halbleiter & Grafikprozessoren', marketCapBillions: 3100, returnRatePercent: 4.8, dividendYield: 0.2, description: 'Dominanter Hersteller modernster KI-Beschleuniger und Tensor-Chips.' },
      { id: 'usa-c4', name: 'Alphabet Inc. (Google)', sector: 'Internet, Suche & Cloud', marketCapBillions: 2150, returnRatePercent: 3.1, dividendYield: 0.5, description: 'Globaler Marktführer in Internetsuche, YouTube und Android-Plattform.' },
      { id: 'usa-c5', name: 'Amazon.com Inc.', sector: 'E-Commerce & AWS Cloud', marketCapBillions: 2050, returnRatePercent: 3.0, dividendYield: 0.0, description: 'Größter E-Commerce-Konzern und führender Cloud-Infrastrukturanbieter.' },
      { id: 'usa-c6', name: 'Meta Platforms Inc.', sector: 'Social Media & VR', marketCapBillions: 1420, returnRatePercent: 3.6, dividendYield: 0.4, description: 'Betreiber von Facebook, Instagram, WhatsApp und KI-Laboratorien.' },
      { id: 'usa-c7', name: 'Berkshire Hathaway', sector: 'Finanzholding & Mischkonzern', marketCapBillions: 980, returnRatePercent: 2.2, dividendYield: 0.0, description: 'Strategische Beteiligungsgesellschaft unter Führung führender Investoren.' },
      { id: 'usa-c8', name: 'Tesla Inc.', sector: 'Elektromobilität & Robotik', marketCapBillions: 820, returnRatePercent: 3.8, dividendYield: 0.0, description: 'Pionier für autonomes Fahren, Batterietechnik und humanoide Roboter.' },
      { id: 'usa-c9', name: 'JPMorgan Chase & Co.', sector: 'Investmentbanking & Finanzwesen', marketCapBillions: 610, returnRatePercent: 2.7, dividendYield: 2.4, description: 'Größtes US-amerikanisches Geldinstitut mit globaler Vermögensverwaltung.' },
      { id: 'usa-c10', name: 'ExxonMobil Corp.', sector: 'Energie, Erdöl & Petrochemie', marketCapBillions: 480, returnRatePercent: 2.5, dividendYield: 3.3, description: 'Global integrierter Energie- und Förderkonzern mit gewaltigen Rohstoffreserven.' },
      { id: 'usa-c11', name: 'Eli Lilly and Company', sector: 'Biopharmazeutika & Adipositasforschung', marketCapBillions: 780, returnRatePercent: 3.9, dividendYield: 0.7, description: 'Führendes Pharmaunternehmen für Stoffwechsel- und Onkologiemedikamente.' },
      { id: 'usa-c12', name: 'Broadcom Inc.', sector: 'Netzwerkchips & Unternehmenssoftware', marketCapBillions: 650, returnRatePercent: 3.5, dividendYield: 1.5, description: 'Schlüsselhersteller für Hyperscale-Rechenzentren und drahtlose Kommunikation.' },
      { id: 'usa-c13', name: 'Walmart Inc.', sector: 'Einzelhandel & Versorgungsketten', marketCapBillions: 540, returnRatePercent: 2.1, dividendYield: 1.3, description: 'Umsatzstärkster Einzelhandelsriese der Welt mit dichtem Filialnetz.' },
      { id: 'usa-c14', name: 'Lockheed Martin Corp.', sector: 'Rüstung, Raumfahrt & F-35 Jets', marketCapBillions: 115, returnRatePercent: 2.9, dividendYield: 2.8, description: 'Größter Rüstungskonzern der Welt, Hersteller moderner Tarnkappen-Kampfflugzeuge.' },
      { id: 'usa-c15', name: 'Chevron Corporation', sector: 'Globale Erdölförderung & LNG', marketCapBillions: 290, returnRatePercent: 2.4, dividendYield: 4.1, description: 'Strategischer Rohstoffkonzern mit weltweiten Förderlizenzen.' }
    ];
  }

  if (countryId === 'deu') {
    return [
      { id: 'deu-c1', name: 'SAP SE', sector: 'ERP-Software & Enterprise Cloud', marketCapBillions: 245, returnRatePercent: 2.9, dividendYield: 1.2, description: 'Führender Anbieter für geschäftskritische Enterprise-Ressourcenplanung.' },
      { id: 'deu-c2', name: 'Siemens AG', sector: 'Industrieautomatisierung & Energie', marketCapBillions: 155, returnRatePercent: 2.6, dividendYield: 2.8, description: 'Weltweiter Technologieführer in Fabrikautomation und Medizintechnik.' },
      { id: 'deu-c3', name: 'Allianz SE', sector: 'Versicherung & Asset Management', marketCapBillions: 118, returnRatePercent: 2.5, dividendYield: 4.8, description: 'Europäischer Finanzgigant mit über 2 Billionen Euro verwaltetem Vermögen.' },
      { id: 'deu-c4', name: 'Deutsche Telekom AG', sector: 'Telekommunikation & 5G-Netze', marketCapBillions: 114, returnRatePercent: 2.3, dividendYield: 3.4, description: 'Größter europäischer Telekommunikationskonzern mit starker US-Präsenz.' },
      { id: 'deu-c5', name: 'Mercedes-Benz Group', sector: 'Premium-Automobilbau', marketCapBillions: 68, returnRatePercent: 2.4, dividendYield: 7.2, description: 'Traditionsreicher Hersteller von Luxus- und Elektroautomobilen.' },
      { id: 'deu-c6', name: 'BMW Group', sector: 'Mobilität & Fahrzeugbau', marketCapBillions: 62, returnRatePercent: 2.3, dividendYield: 6.8, description: 'Führender deutscher Premium-Automobil- und Motorradhersteller.' },
      { id: 'deu-c7', name: 'BASF SE', sector: 'Spezialchemie & Werkstoffe', marketCapBillions: 44, returnRatePercent: 2.1, dividendYield: 7.0, description: 'Weltweit größter Chemiekonzern mit zentralem Verbundstandort.' },
      { id: 'deu-c8', name: 'Volkswagen AG', sector: 'Automobilkonzern & Nutzfahrzeuge', marketCapBillions: 58, returnRatePercent: 2.2, dividendYield: 7.8, description: 'Global agierender Automobilriese mit Mehrmarken-Strategie.' },
      { id: 'deu-c9', name: 'Munich Re (Münchener Rück)', sector: 'Rückversicherung & Risikotransfer', marketCapBillions: 66, returnRatePercent: 2.8, dividendYield: 3.2, description: 'Weltweit größter Rückversicherer für globale Großrisiken.' },
      { id: 'deu-c10', name: 'Infineon Technologies AG', sector: 'Leistungshalbleiter & Sensorik', marketCapBillions: 48, returnRatePercent: 3.1, dividendYield: 1.0, description: 'Schlüsselhersteller von Halbleitern für Automobil- und Energiemärkte.' },
      { id: 'deu-c11', name: 'Rheinmetall AG', sector: 'Rüstungstechnik & Munition', marketCapBillions: 26, returnRatePercent: 4.2, dividendYield: 1.2, description: 'Führender europäischer Hersteller gepanzerter Kettenfahrzeuge und Artillerie.' },
      { id: 'deu-c12', name: 'DHL Group (Deutsche Post)', sector: 'Globale Logistik & Fracht', marketCapBillions: 46, returnRatePercent: 2.2, dividendYield: 4.5, description: 'Weltweit agierender Express- und Kontraktlogistikdienstleister.' },
      { id: 'deu-c13', name: 'Siemens Energy AG', sector: 'Gasturbinen & Stromübertragung', marketCapBillions: 24, returnRatePercent: 3.2, dividendYield: 0.0, description: 'Zentraler Ausrüster für kontinentale Hochspannungs- und Windkraftnetze.' },
      { id: 'deu-c14', name: 'Bayer AG', sector: 'Agrarwissenschaften & Pharma', marketCapBillions: 28, returnRatePercent: 2.0, dividendYield: 0.5, description: 'Internationaler Konzern für Saatgut, Pflanzenschutz und Arzneimittel.' },
      { id: 'deu-c15', name: 'Adidas AG', sector: 'Sportartikel & Bekleidung', marketCapBillions: 40, returnRatePercent: 2.5, dividendYield: 0.8, description: 'Weltbekannte Marke für Sportschuhe, Funktionsbekleidung und Sponsoring.' }
    ];
  }

  if (countryId === 'fra') {
    return [
      { id: 'fra-c1', name: 'LVMH Moët Hennessy Louis Vuitton', sector: 'Luxusgüter & Lifestyle', marketCapBillions: 385, returnRatePercent: 2.8, dividendYield: 1.8, description: 'Weltmarktführer für Luxusmode, Lederwaren, Weine und Uhren.' },
      { id: 'fra-c2', name: 'Hermès International', sector: 'Exklusive Luxusmanufaktur', marketCapBillions: 220, returnRatePercent: 2.6, dividendYield: 0.7, description: 'Höchstwertiger Luxushersteller mit herausragender Preismacht.' },
      { id: 'fra-c3', name: 'L\'Oréal S.A.', sector: 'Kosmetik & Konsumgüter', marketCapBillions: 215, returnRatePercent: 2.4, dividendYield: 1.6, description: 'Weltgrößter Kosmetik- und Schönheitskonzern mit globaler Markenreichweite.' },
      { id: 'fra-c4', name: 'TotalEnergies SE', sector: 'Öl, Gas & Erneuerbare Energien', marketCapBillions: 155, returnRatePercent: 2.9, dividendYield: 5.2, description: 'Integrierter Multi-Energie-Konzern mit weltweiten Förderprojekten.' },
      { id: 'fra-c5', name: 'Schneider Electric SE', sector: 'Energiemanagement & Automation', marketCapBillions: 135, returnRatePercent: 3.0, dividendYield: 1.7, description: 'Weltmarktführer für digitale Energieverteilung und industrielle Automatisierung.' },
      { id: 'fra-c6', name: 'Airbus SE', sector: 'Luft- & Raumfahrtkonzern', marketCapBillions: 125, returnRatePercent: 2.7, dividendYield: 1.5, description: 'Größter ziviler Flugzeugbauer und zentraler Rüstungs- und Raumfahrtkonzern.' },
      { id: 'fra-c7', name: 'Sanofi S.A.', sector: 'Biopharma & Impfstoffe', marketCapBillions: 110, returnRatePercent: 2.2, dividendYield: 4.1, description: 'Global agierendes Pharmaunternehmen mit Fokus auf Immunologie und Onkologie.' },
      { id: 'fra-c8', name: 'BNP Paribas', sector: 'Bank- & Finanzdienstleistungen', marketCapBillions: 80, returnRatePercent: 2.6, dividendYield: 7.2, description: 'Führende Universalbank der Eurozone mit globaler Präsenz.' },
      { id: 'fra-c9', name: 'AXA S.A.', sector: 'Versicherung & Finanzschutz', marketCapBillions: 76, returnRatePercent: 2.5, dividendYield: 6.0, description: 'Weltweiter Versicherungsriese mit Schwerpunkt auf Industrie- und Lebensversicherungen.' },
      { id: 'fra-c10', name: 'Dassault Aviation', sector: 'Verteidigung & Kampfjets (Rafale)', marketCapBillions: 48, returnRatePercent: 3.4, dividendYield: 1.8, description: 'Hersteller des Rafale-Kampfjets und von Falcon-Geschäftsreiseflugzeugen.' },
      { id: 'fra-c11', name: 'Thales Group', sector: 'Verteidigungselektronik & Radar', marketCapBillions: 34, returnRatePercent: 3.1, dividendYield: 2.1, description: 'Spezialist für Avionik, Raketenführung und sichere Militärkommunikation.' },
      { id: 'fra-c12', name: 'Safran S.A.', sector: 'Flugzeugtriebwerke & Raketenantriebe', marketCapBillions: 88, returnRatePercent: 2.9, dividendYield: 1.4, description: 'Hersteller der LEAP-Triebwerke und der Ariane-Trägerraketenmotoren.' },
      { id: 'fra-c13', name: 'Kering S.A.', sector: 'Luxusmarken (Gucci, Saint Laurent)', marketCapBillions: 38, returnRatePercent: 2.3, dividendYield: 4.5, description: 'Prestigeträchtige Luxusholding mit weltweitem Prestige-Vertrieb.' },
      { id: 'fra-c14', name: 'Danone S.A.', sector: 'Nahrungsmittel & Säuglingsernährung', marketCapBillions: 42, returnRatePercent: 2.1, dividendYield: 3.6, description: 'Weltweiter Marktführer bei Frischmilchprodukten und pflanzenbasierten Lebensmitteln.' },
      { id: 'fra-c15', name: 'Vinci S.A.', sector: 'Konzessionen & Großbauprojekte', marketCapBillions: 64, returnRatePercent: 2.4, dividendYield: 3.9, description: 'Betreiber europäischer Autobahnnetze, internationaler Großflughäfen und Megabauten.' }
    ];
  }

  if (countryId === 'chn') {
    return [
      { id: 'chn-c1', name: 'Tencent Holdings', sector: 'Internet, Gaming & WeChat', marketCapBillions: 460, returnRatePercent: 3.2, dividendYield: 0.9, description: 'Größter chinesischer Internet- und Gaming-Konzern mit universeller App-Infrastruktur.' },
      { id: 'chn-c2', name: 'Kweichow Moutai', sector: 'Spirituosen & Staatsbankette', marketCapBillions: 270, returnRatePercent: 2.6, dividendYield: 2.4, description: 'Nationales Kulturgut und hochprofitabler Hersteller von Luxus-Baijiu.' },
      { id: 'chn-c3', name: 'Alibaba Group', sector: 'E-Commerce, Cloud & Logistik', marketCapBillions: 210, returnRatePercent: 2.9, dividendYield: 1.2, description: 'Chinas dominanter digitaler Handelsplatz und führender Cloud-Anbieter.' },
      { id: 'chn-c4', name: 'Contemporary Amperex (CATL)', sector: 'Lithium-Ionen-Batterien', marketCapBillions: 135, returnRatePercent: 3.5, dividendYield: 1.4, description: 'Weltmarktführer für Elektrofahrzeug-Batterien und stationäre Stromspeicher.' },
      { id: 'chn-c5', name: 'BYD Company Ltd.', sector: 'Elektrofahrzeuge & Batterien', marketCapBillions: 110, returnRatePercent: 3.4, dividendYield: 1.1, description: 'Weltweit absatzstärkster Hersteller von Elektro- und Plug-In-Hybrid-Fahrzeugen.' },
      { id: 'chn-c6', name: 'Ping An Insurance Group', sector: 'Versicherung & Fintech', marketCapBillions: 115, returnRatePercent: 2.5, dividendYield: 5.5, description: 'Technologiegetriebener Finanzriese für Versicherungen und Bankgeschäfte.' },
      { id: 'chn-c7', name: 'Meituan', sector: 'Lokale Dienste & Liefernetzwerke', marketCapBillions: 95, returnRatePercent: 3.0, dividendYield: 0.0, description: 'Chinas größte Plattform für Essenslieferungen, Reisen und On-Demand-Dienste.' },
      { id: 'chn-c8', name: 'Semiconductor Mfg (SMIC)', sector: 'Halbleiter & Chipherstellung', marketCapBillions: 85, returnRatePercent: 3.8, dividendYield: 0.3, description: 'Nationale Flaggschiff-Foundry für Mikrochips und strategische Siliziumwafer.' },
      { id: 'chn-c9', name: 'Xiaomi Corporation', sector: 'Smartphones & Smart Devices', marketCapBillions: 75, returnRatePercent: 3.1, dividendYield: 0.0, description: 'Weltweiter Hersteller vernetzter Unterhaltungselektronik und Elektro-Sportlimousinen.' },
      { id: 'chn-c10', name: 'Baidu Inc.', sector: 'KI, autonome Fahrzeuge & Suche', marketCapBillions: 42, returnRatePercent: 2.8, dividendYield: 0.0, description: 'Pionier für künstliche Intelligenz, Suchalgorithmen und autonomes Fahren (Apollo).' },
      { id: 'chn-c11', name: 'PetroChina Company', sector: 'Erdöl- & Erdgasförderung', marketCapBillions: 180, returnRatePercent: 2.7, dividendYield: 6.8, description: 'Gigantischer staatlich dominierter Öl- und Petrochemiekonzern.' },
      { id: 'chn-c12', name: 'Industrial & Commercial Bank of China (ICBC)', sector: 'Bankwesen & Staatskredite', marketCapBillions: 240, returnRatePercent: 2.4, dividendYield: 6.2, description: 'Größte Bank der Welt nach Bilanzsumme mit über 4 Billionen USD Vermögen.' },
      { id: 'chn-c13', name: 'China Mobile Ltd.', sector: 'Telekommunikation & 5G', marketCapBillions: 190, returnRatePercent: 2.5, dividendYield: 6.5, description: 'Weltweit größter Mobilfunkanbieter mit fast 1 Milliarde Vertragskunden.' },
      { id: 'chn-c14', name: 'ZTE Corporation', sector: 'Netzwerkinfrastruktur & Telekommunikation', marketCapBillions: 32, returnRatePercent: 2.9, dividendYield: 2.0, description: 'Globaler Ausrüster von 5G-Basisstationen und optischen Datennetzen.' },
      { id: 'chn-c15', name: 'Norinco (China North Industries)', sector: 'Rüstungselektronik & Panzerfahrzeuge', marketCapBillions: 65, returnRatePercent: 3.6, dividendYield: 1.5, description: 'Zentraler Rüstungslieferant für gepanzerte Fahrzeuge und Präzisionsraketen.' }
    ];
  }

  // Fallback: Prozedurale, hochqualitative Top-15-Generierung für beliebige Nationen
  const baseScale = Math.max(12, Math.min(2500, gdpBillions * 0.12));
  const sectors = [
    { s: 'Banken & Finanzwesen', m: 1.25, r: 2.5, d: 3.8 },
    { s: 'Energie, Erdöl & Rohstoffe', m: 1.15, r: 2.8, d: 4.2 },
    { s: 'Telekommunikation & 5G-Netze', m: 0.95, r: 2.2, d: 3.5 },
    { s: 'Pharma & Medizintechnik', m: 0.85, r: 2.6, d: 2.1 },
    { s: 'Automobilbau & Elektromobilität', m: 0.8, r: 2.4, d: 3.0 },
    { s: 'Technologie, Cloud & KI', m: 0.75, r: 3.5, d: 1.0 },
    { s: 'Bergbau & Seltene Erden', m: 0.7, r: 2.7, d: 3.6 },
    { s: 'Konsumgüter & Agrarindustrie', m: 0.65, r: 2.1, d: 2.8 },
    { s: 'Bauwesen & Megainfrastruktur', m: 0.55, r: 2.3, d: 2.5 },
    { s: 'Luftfahrt & Rüstungsindustrie', m: 0.5, r: 3.2, d: 2.0 },
    { s: 'Chemie & Halbleitervorprodukte', m: 0.45, r: 2.6, d: 3.1 },
    { s: 'Transport, Häfen & Reedereien', m: 0.4, r: 2.2, d: 4.0 },
    { s: 'Versicherung & Risikomanagement', m: 0.38, r: 2.5, d: 4.5 },
    { s: 'Software & Cyber-Sicherheit', m: 0.35, r: 3.4, d: 0.8 },
    { s: 'Erneuerbare Energien & Speicher', m: 0.32, r: 3.1, d: 1.8 }
  ];

  return sectors.map((sec, idx) => ({
    id: `${countryId}-c${idx + 1}`,
    name: `${countryName.split(' ')[0]} ${sec.s.split(' ')[0]} AG (Konzern ${idx + 1})`,
    sector: sec.s,
    marketCapBillions: Math.max(2, Math.round(baseScale * sec.m * (1 - idx * 0.05))),
    returnRatePercent: sec.r,
    dividendYield: sec.d,
    description: `Führendes nationales Spitzenunternehmen im Bereich ${sec.s} mit dominanter Marktstellung.`
  }));
}

// Backwards compatibility alias
export const getCountryTop10Companies = getCountryTop15Companies;

export function getCountryStateEnterprises(countryId: string, countryName: string): ForeignStateEnterprise[] {
  if (countryId === 'usa') {
    return [
      { id: 'usa-se1', name: 'Amtrak (National Railroad Passenger Corp.)', sector: 'Schieneninfrastruktur & Transport', valuationBillions: 45, returnRatePercent: 1.8, strategicImportance: 'Zentrales Personenverkehrs-Schienennetz der Vereinigten Staaten.' },
      { id: 'usa-se2', name: 'Tennessee Valley Authority (TVA)', sector: 'Energieerzeugung & Wasserkraft', valuationBillions: 60, returnRatePercent: 2.2, strategicImportance: 'Nukleare und hydroelektrische Stromversorgung für 10 Millionen Bürger.' },
      { id: 'usa-se3', name: 'United States Postal Service (USPS)', sector: 'Postlogistik & Basisinfrastruktur', valuationBillions: 35, returnRatePercent: 1.5, strategicImportance: 'Bundesweites staatliches Logistik- und Zustellnetzwerk.' },
      { id: 'usa-se4', name: 'Strategic Petroleum Reserve Management', sector: 'Nationale Erdöl- & Energiereserve', valuationBillions: 80, returnRatePercent: 2.5, strategicImportance: 'Strategische Rohölbevorratung zur Abwehr von globalen Versorgungskrisen.' }
    ];
  }

  if (countryId === 'deu') {
    return [
      { id: 'deu-se1', name: 'Deutsche Bahn AG', sector: 'Schieneninfrastruktur & Güterverkehr', valuationBillions: 55, returnRatePercent: 1.9, strategicImportance: 'Größtes Eisenbahnnetzwerk Mitteleuropas mit integralem Taktfahrplan.' },
      { id: 'deu-se2', name: 'Bundesdruckerei Gruppe GmbH', sector: 'Hochsicherheitstechnologie & ID-Systeme', valuationBillions: 12, returnRatePercent: 2.8, strategicImportance: 'Herstellung hoheitlicher Pässe, Banknoten und kryptografischer Vertrauensdienste.' },
      { id: 'deu-se3', name: 'DFS Deutsche Flugsicherung GmbH', sector: 'Luftverkehrsüberwachung', valuationBillions: 15, returnRatePercent: 2.1, strategicImportance: 'Sicherheit und Lenkung des zivilen und militärischen Luftraums.' },
      { id: 'deu-se4', name: 'Uniper SE (Staatliche Mehrheit)', sector: 'Gasimporte & Großkraftwerke', valuationBillions: 28, returnRatePercent: 2.4, strategicImportance: 'Kritische Gasversorgung und Sicherung der thermischen Grundlast.' }
    ];
  }

  if (countryId === 'fra') {
    return [
      { id: 'fra-se1', name: 'Électricité de France (EDF)', sector: 'Nuklearenergie & europäische Verbundnetze', valuationBillions: 95, returnRatePercent: 2.4, strategicImportance: 'Betreiber von 56 Atomreaktoren zur Erzeugung kohlenstoffarmer Grundlast.' },
      { id: 'fra-se2', name: 'SNCF Réseau', sector: 'Hochgeschwindigkeits-Schienennetz (TGV)', valuationBillions: 50, returnRatePercent: 1.8, strategicImportance: 'Europas schnellstes Schienenfernverkehrsnetz mit kontinentalen Trassen.' },
      { id: 'fra-se3', name: 'Naval Group (Staatliche Mehrheit)', sector: 'Militärischer U-Boot- & Kriegsschiffbau', valuationBillions: 32, returnRatePercent: 3.1, strategicImportance: 'Bau von nukleargetriebenen Unterseebooten und Flugzeugträgern.' },
      { id: 'fra-se4', name: 'Aéroports de Paris (Groupe ADP)', sector: 'Flughafeninfrastruktur Paris-CDG', valuationBillions: 25, returnRatePercent: 2.5, strategicImportance: 'Zentrales interkontinentales Luftverkehrsdrehkreuz Frankreichs.' }
    ];
  }

  if (countryId === 'chn') {
    return [
      { id: 'chn-se1', name: 'State Grid Corporation of China', sector: 'Globales Höchstspannungsnetz (UHV)', valuationBillions: 420, returnRatePercent: 2.6, strategicImportance: 'Größtes Stromversorgungsunternehmen der Erde mit Ultra-Hochspannungsleitungen.' },
      { id: 'chn-se2', name: 'China National Petroleum Corp (CNPC)', sector: 'Ölförderung & nationale Pipelines', valuationBillions: 350, returnRatePercent: 2.8, strategicImportance: 'Sicherung der nationalen Rohöl- und Erdgasversorgung Chinas.' },
      { id: 'chn-se3', name: 'China Railway (CR)', sector: 'Hochgeschwindigkeitsnetz (über 45.000 km)', valuationBillions: 310, returnRatePercent: 1.9, strategicImportance: 'Weltweit ausgedehntestes Hochgeschwindigkeitszug-Netzwerk.' },
      { id: 'chn-se4', name: 'Aviation Industry Corp of China (AVIC)', sector: 'Militärluftfahrt & Raumfahrt', valuationBillions: 180, returnRatePercent: 3.2, strategicImportance: 'Entwicklung von Tarnkappen-Kampfflugzeugen und militärischen Drohnensystemen.' }
    ];
  }

  return [
    { id: `${countryId}-se1`, name: `Staatliche Energiegesellschaft ${countryName}`, sector: 'Stromnetz & Energieerzeugung', valuationBillions: 30, returnRatePercent: 2.2, strategicImportance: `Zentraler Energieversorger von ${countryName}.` },
    { id: `${countryId}-se2`, name: `Nationale Eisenbahnen & Häfen ${countryName}`, sector: 'Transport & Logistik', valuationBillions: 22, returnRatePercent: 1.9, strategicImportance: 'Rückgrat des Personen- und Güterverkehrs.' },
    { id: `${countryId}-se3`, name: `Nationale Rohstoff- & Bergbaugesellschaft`, sector: 'Rohstoffextraktion & Bergbau', valuationBillions: 38, returnRatePercent: 2.7, strategicImportance: 'Kontrolle über strategische Erze und mineralische Ressourcen.' },
    { id: `${countryId}-se4`, name: `Telekommunikations-Infrastruktur ${countryName}`, sector: 'Breitband & Funknetze', valuationBillions: 18, returnRatePercent: 2.3, strategicImportance: 'Sichere Regierungskommunikation und Zivilnetz.' }
  ];
}

export function getCountryWeaponsCatalog(countryId: string): WeaponTradeItem[] {
  return [
    { id: 'wpn-1', name: 'Modernste Kampfpanzer-Brigade (50 Einheiten)', category: 'Landstreitkräfte', priceMrd: 1.2, powerBonus: 3, description: 'Schwer gepanzerte Gefechtsfahrzeuge mit Reaktivpanzerung und 120mm-Glattrohrkanone.' },
    { id: 'wpn-2', name: 'Mehrzweck-Tarnkappen-Kampfjets (12 Jets)', category: 'Luftwaffe', priceMrd: 2.5, powerBonus: 5, description: '5. Generation Überschalljets mit AESA-Radar, Radartarnung und BVR-Lenkflugkörpern.' },
    { id: 'wpn-3', name: 'Flugabwehr- & Raketenschild-Batterie', category: 'Strategisch & Raketen', priceMrd: 1.8, powerBonus: 4, description: 'Mehrschichtiges Raketenabwehrsystem gegen ballistische Flugkörper und Marschflugkörper.' },
    { id: 'wpn-4', name: 'Autonomer KI-Drohnenschwarm (100 Einheiten)', category: 'Drohnen & Roboter', priceMrd: 0.8, powerBonus: 3, description: 'Vernetzte Mikrodrohnen zur Zielbekämpfung und Gefechtsfeldaufklärung.' },
    { id: 'wpn-5', name: 'Moderner Stealth-Zerstörer mit Lenkwaffen', category: 'Marine & U-Boote', priceMrd: 2.2, powerBonus: 4, description: 'Radargetarnter Kriegsschiff-Zerstörer mit Vertikalstartzellen für Marschflugkörper.' },
    { id: 'wpn-6', name: 'Nukleargetriebenes Angriffs-U-Boot', category: 'Marine & U-Boote', priceMrd: 3.5, powerBonus: 6, description: 'Tiefseetaugliches Atom-U-Boot mit unbegrenzter Reichweite und Torpedobewaffnung.' }
  ];
}

export function getCountryTechCatalog(countryId: string): TechTradeItem[] {
  return [
    { id: 'tech-1', name: 'Militärische Satellitenaufklärung & Laseroptik', category: 'Raumfahrt & Satelliten', priceMrd: 4.0, gdpBonusPercent: 0.1, description: 'Echtzeit-Gefechtsfeldüberwachung aus dem niedrigen Erdorbit mit Sub-Dezimeter-Auflösung.' },
    { id: 'tech-2', name: 'Quantenverschlüsselung & Cyber-Verteidigung', category: 'Cyber & KI', priceMrd: 3.5, gdpBonusPercent: 0.15, description: 'Post-Quanten-Kryptografie zum vollständigen Schutz kritischer Regierungsinfrastrukturen.' },
    { id: 'tech-3', name: 'Hyperschall-Staustrahltriebwerke', category: 'Strategisch & Raketen' as any, priceMrd: 5.0, gdpBonusPercent: 0.12, description: 'Antriebstechnologie für Geschwindigkeiten über Mach 5 mit extremer Manövrierfähigkeit.' },
    { id: 'tech-4', name: 'Modulare Reaktoren der 4. Generation (SMR)', category: 'Nuklear- & Energietechnik', priceMrd: 6.0, gdpBonusPercent: 0.25, description: 'Kompakte, inhärent sichere Kernkraftwerke zur dezentralen sauberen Energieversorgung.' },
    { id: 'tech-5', name: 'Autonome Gefechtsfeld-Robotik & KI-Logistik', category: 'Cyber & KI', priceMrd: 4.5, gdpBonusPercent: 0.18, description: 'Selbstlernende neuronale Netze zur taktischen Einheitenkoordination ohne Latenz.' }
  ];
}

export function calculateLoanTerms(country: RealCountryData, amountMrd: number, quarters: number): {
  interestRatePercent: number;
  totalRepaymentMrd: number;
  quarterlyInstallmentMrd: number;
  riskRating: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC';
} {
  const debt = getCountryDebtBillions(country);
  const debtRatio = debt / Math.max(1, country.gdpBillions);
  
  let riskRating: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC' = 'A';
  let baseRate = 3.5;

  if (debtRatio < 0.5 && country.relations >= 40) {
    riskRating = 'AAA';
    baseRate = 2.8;
  } else if (debtRatio < 0.75 && country.relations >= 20) {
    riskRating = 'AA';
    baseRate = 3.4;
  } else if (debtRatio < 1.0 && country.relations >= 0) {
    riskRating = 'A';
    baseRate = 4.2;
  } else if (debtRatio < 1.3) {
    riskRating = 'BBB';
    baseRate = 5.6;
  } else if (debtRatio < 1.6) {
    riskRating = 'BB';
    baseRate = 7.5;
  } else if (debtRatio < 2.0) {
    riskRating = 'B';
    baseRate = 9.8;
  } else {
    riskRating = 'CCC';
    baseRate = 13.5;
  }

  // Relations bonus/malus
  const relDiscount = Math.max(-1.5, Math.min(1.5, (country.relations / 100) * 1.5));
  const finalAnnualRate = Math.max(1.8, Number((baseRate - relDiscount).toFixed(2)));

  const years = quarters / 4;
  const totalInterest = amountMrd * (finalAnnualRate / 100) * years;
  const totalRepayment = amountMrd + totalInterest;
  const quarterlyInstallment = totalRepayment / quarters;

  return {
    interestRatePercent: finalAnnualRate,
    totalRepaymentMrd: Number(totalRepayment.toFixed(3)),
    quarterlyInstallmentMrd: Number(quarterlyInstallment.toFixed(3)),
    riskRating
  };
}
