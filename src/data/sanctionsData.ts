export interface SanctionDefinition {
  id: string;
  name: string;
  category: 'Finanz & Banken' | 'Energie & Rohstoffe' | 'High-Tech & KI' | 'Rüstung & Sicherheit' | 'Handel & Logistik' | 'Diplomatie & Eliten';
  description: string;
  gdpImpactPercent: number; // Wie viel Prozent BIP-Rückgang im Zielland
  domesticCostMrd: number;  // Eigene Handelskosten in Mrd. / Quartal
  relationsPenalty: number; // Diplomatische Verschlechterung
  strategicEffect: string;
}

export const ALL_30_SANCTIONS: SanctionDefinition[] = [
  // 1. Finanz & Banken (6)
  {
    id: 'sanc-01',
    name: 'SWIFT-Ausschluss & Interbanken-Sperre',
    category: 'Finanz & Banken',
    description: 'Vollständiger Ausschluss aller staatlichen und privaten Großbanken aus dem internationalen Zahlungsverkehr SWIFT.',
    gdpImpactPercent: 2.8,
    domesticCostMrd: 0.8,
    relationsPenalty: -25,
    strategicEffect: 'Lähmung des internationalen Devisenverkehrs und Zahlungsverkehrs.'
  },
  {
    id: 'sanc-02',
    name: 'Einfrierung der Zentralbankreserven',
    category: 'Finanz & Banken',
    description: 'Blockade aller staatlichen Währungs- und Goldreserven bei ausländischen Zentralbanken und Clearinghäusern.',
    gdpImpactPercent: 3.5,
    domesticCostMrd: 0.5,
    relationsPenalty: -30,
    strategicEffect: 'Verlust der Währungsstützungskraft, Währungsabwertung und Inflation im Zielland.'
  },
  {
    id: 'sanc-03',
    name: 'Ausschluss von Staatsanleihen & Kapitalmärkten',
    category: 'Finanz & Banken',
    description: 'Verbot für westliche Fonds und Institutionen, Neuemissionen von Staats- und Unternehmensanleihen des Landes zu zeichnen.',
    gdpImpactPercent: 2.2,
    domesticCostMrd: 0.4,
    relationsPenalty: -18,
    strategicEffect: 'Explodierende Refinanzierungszinsen und Schuldenkrise.'
  },
  {
    id: 'sanc-04',
    name: 'Einfrierung von Staatsfonds & Auslandsvermögen',
    category: 'Finanz & Banken',
    description: 'Beschlagnahmung und treuhänderische Verwahrung von Staatsfonds, Immobilien und Auslandskonten staatlicher Entitäten.',
    gdpImpactPercent: 2.4,
    domesticCostMrd: 0.3,
    relationsPenalty: -22,
    strategicEffect: 'Austrocknung langfristiger staatlicher Reservepolster.'
  },
  {
    id: 'sanc-05',
    name: 'Verbot von Krediten, Bürgschaften & Exportversicherungen',
    category: 'Finanz & Banken',
    description: 'Stopp aller Hermesdeckungen, multilateralen Kredite und bilateralen Bürgschaften für Handelsgeschäfte.',
    gdpImpactPercent: 1.5,
    domesticCostMrd: 0.6,
    relationsPenalty: -15,
    strategicEffect: 'Zusammenbruch ausländischer Direktinvestitionen und Lieferantenkredite.'
  },
  {
    id: 'sanc-06',
    name: 'Sekundärsanktionen gegen Finanzinstitute dritter Staaten',
    category: 'Finanz & Banken',
    description: 'Androhung des Dollar- und Euro-Lizenzentzugs für Banken in Drittstaaten, die Geschäfte mit dem sanktionierten Staat abwickeln.',
    gdpImpactPercent: 3.0,
    domesticCostMrd: 1.2,
    relationsPenalty: -28,
    strategicEffect: 'Isolation von alternativen Korrespondenzbanken und Umgehungsrouten.'
  },

  // 2. Energie & Rohstoffe (5)
  {
    id: 'sanc-07',
    name: 'Rohöl-Exportembargo & Preisobergrenze',
    category: 'Energie & Rohstoffe',
    description: 'Totaler Einfuhrstopp für Rohöl und Erdölerzeugnisse sowie seeseitiges Transport- und Versicherungsverbot.',
    gdpImpactPercent: 3.2,
    domesticCostMrd: 1.5,
    relationsPenalty: -26,
    strategicEffect: 'Drastischer Einbruch der staatlichen Haupteinnahmequelle.'
  },
  {
    id: 'sanc-08',
    name: 'Erdgas-Lieferstopp & Pipeline-Sperren',
    category: 'Energie & Rohstoffe',
    description: 'Kappung von Ferngaspipelines und Annahmestopp für Flüssigerdgas-Tanker (LNG) aus dem Zielland.',
    gdpImpactPercent: 2.5,
    domesticCostMrd: 1.8,
    relationsPenalty: -24,
    strategicEffect: 'Stilllegung von Gasförderfeldern und Einnahmenverlust.'
  },
  {
    id: 'sanc-09',
    name: 'Kohle- & Brennstoff-Einfuhrverbot',
    category: 'Energie & Rohstoffe',
    description: 'Verbot aller Importe von Steinkohle, Braunkohle, Koks und Torf.',
    gdpImpactPercent: 1.0,
    domesticCostMrd: 0.3,
    relationsPenalty: -12,
    strategicEffect: 'Logistische Blockade und Einnahmeausfall im Bergbausektor.'
  },
  {
    id: 'sanc-10',
    name: 'Edelmetall-, Gold- & Diamantenhandelsverbot',
    category: 'Energie & Rohstoffe',
    description: 'Verbot des Handels mit Gold, Platin, Palladium und Rohdiamanten an internationalen Handelsbörsen.',
    gdpImpactPercent: 1.3,
    domesticCostMrd: 0.2,
    relationsPenalty: -16,
    strategicEffect: 'Verhinderung der Umgehung von Finanzblockaden durch physische Werte.'
  },
  {
    id: 'sanc-11',
    name: 'Nuklearbrennstoff- & Uran-Handelsstopp',
    category: 'Energie & Rohstoffe',
    description: 'Importstopp für angereichertes Uran und nukleare Komponenten staatlicher Nuklearkonzerne.',
    gdpImpactPercent: 0.9,
    domesticCostMrd: 0.4,
    relationsPenalty: -14,
    strategicEffect: 'Kappung nukleartechnischer Exporterlöse.'
  },

  // 3. High-Tech & KI (5)
  {
    id: 'sanc-12',
    name: 'Halbleiter- & Hochleistungs-Chip-Embargo',
    category: 'High-Tech & KI',
    description: 'Exportverbot für fortschrittliche Mikroprozessoren (unter 14nm), Lithographie-Maschinen und Chip-Design-Tools.',
    gdpImpactPercent: 2.1,
    domesticCostMrd: 0.7,
    relationsPenalty: -20,
    strategicEffect: 'Massive Technologielücke, Stillstand in moderner Rüstung und Automobilbau.'
  },
  {
    id: 'sanc-13',
    name: 'Bann von KI-Beschleunigern & Rechenzentrum-Hardware',
    category: 'High-Tech & KI',
    description: 'Lieferstopp für spezialisierte KI-Grafikprozessoren, Tensor-Rechenkerne und Servercluster.',
    gdpImpactPercent: 1.8,
    domesticCostMrd: 0.5,
    relationsPenalty: -18,
    strategicEffect: 'Rückschlag in nationaler KI-Entwicklung und militärischer Datenverarbeitung.'
  },
  {
    id: 'sanc-14',
    name: 'ERP- & Enterprise-Software-Lizenzstopp',
    category: 'High-Tech & KI',
    description: 'Widerruf von Lizenzen für geschäftskritische Enterprise-Software (SAP, Oracle, Microsoft, Cloud-Dienste).',
    gdpImpactPercent: 1.7,
    domesticCostMrd: 0.4,
    relationsPenalty: -16,
    strategicEffect: 'Verwaltungs- und Lieferkettenchaos in Großkonzernen des Ziellandes.'
  },
  {
    id: 'sanc-15',
    name: 'Telekommunikations- & 5G-Hardware-Sperre',
    category: 'High-Tech & KI',
    description: 'Verbot der Lieferung von Mobilfunkstationen, optischen Routern und Glasfaser-Infrastruktur.',
    gdpImpactPercent: 1.2,
    domesticCostMrd: 0.3,
    relationsPenalty: -13,
    strategicEffect: 'Verfall digitaler Netze und Kommunikationsinfrastruktur.'
  },
  {
    id: 'sanc-16',
    name: 'Forschungskooperations- & Technologietransfer-Stopp',
    category: 'High-Tech & KI',
    description: 'Kündigung aller gemeinsamen universitären Forschungsprojekte und Patent-Lizenzabkommen.',
    gdpImpactPercent: 1.1,
    domesticCostMrd: 0.2,
    relationsPenalty: -14,
    strategicEffect: 'Wissenschaftliche Isolation und Braindrain qualifizierter Ingenieure.'
  },

  // 4. Rüstung & Sicherheit (5)
  {
    id: 'sanc-17',
    name: 'Vollständiges Rüstungs- & Munitionsembargo',
    category: 'Rüstung & Sicherheit',
    description: 'Strikter Stopp aller Verkäufe, Lieferungen und Reparaturen von Kriegswaffen, Munition und Trägersystemen.',
    gdpImpactPercent: 1.6,
    domesticCostMrd: 0.4,
    relationsPenalty: -22,
    strategicEffect: 'Erschöpfung militärischer Reserven und Ersatzteilmangel an der Front.'
  },
  {
    id: 'sanc-18',
    name: 'Dual-Use-Technologie & Präzisionsoptik-Embargo',
    category: 'Rüstung & Sicherheit',
    description: 'Exportverbot für Wärmebildkameras, Laser-Zielsucher, Drohnenelektronik und Navigationskreisel.',
    gdpImpactPercent: 1.4,
    domesticCostMrd: 0.3,
    relationsPenalty: -17,
    strategicEffect: 'Degradierung der Präzisionsschlagfähigkeiten der Streitkräfte.'
  },
  {
    id: 'sanc-19',
    name: 'Sicherheits- & Satellitenaufklärungs-Blockade',
    category: 'Rüstung & Sicherheit',
    description: 'Kappung des Zugangs zu kommerziellen Satellitendaten, Radarbildern und GPS-Korrektursignalen.',
    gdpImpactPercent: 1.2,
    domesticCostMrd: 0.2,
    relationsPenalty: -19,
    strategicEffect: 'Taktische Blindheit bei Truppenbewegungen und Zielkoordinierung.'
  },
  {
    id: 'sanc-20',
    name: 'Spezialchemikalien- & Ausgangsstoff-Bann',
    category: 'Rüstung & Sicherheit',
    description: 'Ausfuhrverbot für Rohstoffe zur Sprengstoff-, Raketentreibstoff- und Schutzausrüstungsproduktion.',
    gdpImpactPercent: 1.0,
    domesticCostMrd: 0.2,
    relationsPenalty: -15,
    strategicEffect: 'Drosselung der heimischen Rüstungsproduktion.'
  },
  {
    id: 'sanc-21',
    name: 'Bann privater Sicherheits- & Söldnerunternehmen',
    category: 'Rüstung & Sicherheit',
    description: 'Einstufung paramilitärischer Verbände und Söldnerfirmen als terroristische Organisationen.',
    gdpImpactPercent: 0.6,
    domesticCostMrd: 0.1,
    relationsPenalty: -12,
    strategicEffect: 'Austrocknung internationaler Rekrutierung und Schwarzgeldströme.'
  },

  // 5. Handel & Logistik (5)
  {
    id: 'sanc-22',
    name: 'Vollständige Luftraumsperre für zivile & Frachtjets',
    category: 'Handel & Logistik',
    description: 'Schließung des eigenen Luftraums für alle Fluggesellschaften und Regierungsmaschinen des Ziellandes.',
    gdpImpactPercent: 1.4,
    domesticCostMrd: 0.5,
    relationsPenalty: -18,
    strategicEffect: 'Verdreifachung von Frachtflugzeiten und Zusammenbruch des internationalen Tourismus.'
  },
  {
    id: 'sanc-23',
    name: 'Seehäfen-Sperre & Frachtschiff-Zulassungsverbot',
    category: 'Handel & Logistik',
    description: 'Verweigerung des Hafenzugangs für Schiffe unter Flagge oder im Eigentum des Ziellandes.',
    gdpImpactPercent: 2.0,
    domesticCostMrd: 0.8,
    relationsPenalty: -21,
    strategicEffect: 'Blockade des Seefracht-Exports und Unterbrechung maritimer Lieferketten.'
  },
  {
    id: 'sanc-24',
    name: 'Industriemaschinen- & CNC-Werkzeug-Embargo',
    category: 'Handel & Logistik',
    description: 'Lieferverbot für moderne Fräsmaschinen, Turbinen, Kompressoren und Industrieanlagen.',
    gdpImpactPercent: 1.5,
    domesticCostMrd: 0.4,
    relationsPenalty: -15,
    strategicEffect: 'Schleichender Verfall der industriellen Produktionskapazität.'
  },
  {
    id: 'sanc-25',
    name: 'Kfz-, Eisenbahn- & Nutzfahrzeuge-Importstopp',
    category: 'Handel & Logistik',
    description: 'Ausfuhrverbot für Lokomotiven, Lkws, Pkws und deren Ersatzteile.',
    gdpImpactPercent: 1.1,
    domesticCostMrd: 0.3,
    relationsPenalty: -12,
    strategicEffect: 'Engpässe im inländischen Güter- und Schienentransport.'
  },
  {
    id: 'sanc-26',
    name: 'Düngemittel- & Agrarchemikalien-Restriktionen',
    category: 'Handel & Logistik',
    description: 'Zollbelegung und Quoten auf Kali- und Stickstoffdünger sowie Pflanzenschutzmittel.',
    gdpImpactPercent: 1.1,
    domesticCostMrd: 0.4,
    relationsPenalty: -13,
    strategicEffect: 'Preiseinbrüche bei staatlichen Agrarexporteuren.'
  },

  // 6. Diplomatie & Eliten (4)
  {
    id: 'sanc-27',
    name: 'Gezielte Sanktionen gegen Oligarchen & Staatselite',
    category: 'Diplomatie & Eliten',
    description: 'Vermögensarrest, Yachtbeschlagnahmungen und Luxusimmobilien-Sperren für führende Regierungskader.',
    gdpImpactPercent: 0.8,
    domesticCostMrd: 0.1,
    relationsPenalty: -15,
    strategicEffect: 'Spaltung innerhalb der regierenden Elite und Vertrauensverlust in Führung.'
  },
  {
    id: 'sanc-28',
    name: 'Luxusgüter-, Kunst-, Schmuck- & Uhrenbann',
    category: 'Diplomatie & Eliten',
    description: 'Totalverbot des Exports von Designermode, Luxusautos, Champagner und teurem Schmuck.',
    gdpImpactPercent: 0.4,
    domesticCostMrd: 0.2,
    relationsPenalty: -8,
    strategicEffect: 'Direkte Lifestyle-Einschränkung für die politische Nomenklatura.'
  },
  {
    id: 'sanc-29',
    name: 'Diplomaten-Ausweisung & Visa-Sperren für Spitzenbeamte',
    category: 'Diplomatie & Eliten',
    description: 'Ausweisung von 80% des Botschaftspersonals und Einreiseverbote für Parlamentarier und Richter.',
    gdpImpactPercent: 0.3,
    domesticCostMrd: 0.05,
    relationsPenalty: -20,
    strategicEffect: 'Bruch diplomatischer Kanäle und internationale Ächtung.'
  },
  {
    id: 'sanc-30',
    name: 'Abschaltung staatlicher Propagandamedien & Rundfunkzensur',
    category: 'Diplomatie & Eliten',
    description: 'Lizenzentzug und Sendeverbot für staatlich gelenkte Auslandssender und digitale Propaganda-Netzwerke.',
    gdpImpactPercent: 0.2,
    domesticCostMrd: 0.02,
    relationsPenalty: -10,
    strategicEffect: 'Eindämmung von Informationskriegsführung und Desinformationskampagnen.'
  }
];

export function calculateSanctionsTotal(activeSanctions: { sanctionId: string }[]) {
  const activeIds = new Set(activeSanctions.map(s => s.sanctionId));
  const activeDefs = ALL_30_SANCTIONS.filter(s => activeIds.has(s.id));
  
  const totalGdpImpactPercent = activeDefs.reduce((acc, curr) => acc + curr.gdpImpactPercent, 0);
  const totalDomesticCostMrd = activeDefs.reduce((acc, curr) => acc + curr.domesticCostMrd, 0);
  const totalRelationsPenalty = activeDefs.reduce((acc, curr) => acc + curr.relationsPenalty, 0);

  return {
    count: activeDefs.length,
    totalGdpImpactPercent: Number(totalGdpImpactPercent.toFixed(1)),
    totalDomesticCostMrd: Number(totalDomesticCostMrd.toFixed(2)),
    totalRelationsPenalty,
    activeDefs
  };
}
