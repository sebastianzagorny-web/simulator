import { DilemmaEvent } from '../types/game';

export const DILEMMA_EVENTS: DilemmaEvent[] = [
  {
    id: 'event_energy_crisis',
    title: 'Globale Energiekrise & Rohöl-Embargo',
    category: 'economic',
    description: 'Feindselige Kartell-Manöver haben internationale Pipelines und Seefrachtrouten empfindlich gestört. Energiepreise explodieren um 60%, wodurch Fabriken stillstehen und dem Stromnetz Blackouts drohen.',
    options: [
      {
        text: 'Strategische Ölreserven freigeben und Strompreisbremse für Bürger erlassen',
        outcomeText: 'Die Lebenshaltungskosten wurden stabilisiert, allerdings belasten Notkredite die Staatskasse.',
        treasuryDelta: -35,
        approvalDelta: 6,
        unrestDelta: -4,
        factionDeltas: { commonWorkers: 8, oligarchs: -4 }
      },
      {
        text: 'Freie Marktpreise zulassen & Industrieverbrauch rationieren',
        outcomeText: 'Energiekonzerne verbuchen Rekordgewinne, doch die arbeitende Bevölkerung ächzt unter der Teuerung.',
        treasuryDelta: 12,
        gdpGrowthDelta: -0.4,
        approvalDelta: -8,
        unrestDelta: 10,
        factionDeltas: { commonWorkers: -10, oligarchs: 12 }
      },
      {
        text: 'Zerstörerflotte entsenden, um Tankerkonvois durch Krisenregionen zu eskortieren',
        outcomeText: 'Souveräne Kriegsschiffe sichern die Seewege ab und schrecken Piraten und fremde Schikanen ab.',
        treasuryDelta: -20,
        approvalDelta: 4,
        militaryDelta: 5,
        relationsDelta: { rivalId: 'rival_eastern_bloc', delta: -15 }
      }
    ]
  },
  {
    id: 'event_border_skirmish',
    title: 'Grenzkonflikt & Artillerieduelle im Sektor 7',
    category: 'military',
    description: 'Grenzpatrouillen der Östlichen Koalition haben über die entmilitarisierte Pufferzone hinweg das Feuer eröffnet. Drei Grenzposten wurden zerstört, auf beiden Seiten gibt es Gefallene.',
    options: [
      {
        text: 'Vergeltungsluftschlag anordnen & Panzerdivisionen mobilisieren',
        outcomeText: 'Kampfgeschwader vernichten feindliche Artilleriestellungen in einer Demonstration souveräner Härte.',
        treasuryDelta: -40,
        approvalDelta: 12,
        unrestDelta: -5,
        militaryDelta: 8,
        relationsDelta: { rivalId: 'rival_eastern_bloc', delta: -35 }
      },
      {
        text: 'Dringlichkeitsgipfel unter internationaler Vermittlung einberufen',
        outcomeText: 'Am Verhandlungstisch wird ein fragiler Waffenstillstand erzielt; ein Flächenbrand wurde abgewendet.',
        treasuryDelta: -5,
        approvalDelta: 1,
        legitimacyDelta: 4,
        factionDeltas: { military: -6, commonWorkers: 5 },
        relationsDelta: { rivalId: 'rival_eastern_bloc', delta: 10 }
      },
      {
        text: 'Geheime Spezialeinheiten entsenden, um feindliche Bahnlinien zu sprengen',
        outcomeText: 'Kommandoeinheiten zerstören strategische Nachschubbrücken ohne offizielle Zurechnung.',
        treasuryDelta: -18,
        approvalDelta: 3,
        relationsDelta: { rivalId: 'rival_eastern_bloc', delta: -10 }
      }
    ]
  },
  {
    id: 'event_general_strike',
    title: 'Landesweiter Generalstreik der Gewerkschaften',
    category: 'social',
    description: 'Eisenbahnnetze, Frachthäfen und Postzentren stehen still. Über zwei Millionen Arbeiter besetzen Hauptplätze und fordern spürbare Lohnerhöhungen, Arbeitszeitverkürzung und Mietpreisdeckel.',
    options: [
      {
        text: 'Forderungen annehmen & Gesetzlichen Mindestlohn anheben',
        outcomeText: 'Der Streik endete friedlich. Die Belegschaften kehrten singend an die Werkbänke zurück.',
        treasuryDelta: -30,
        gdpGrowthDelta: -0.15,
        approvalDelta: 14,
        unrestDelta: -15,
        factionDeltas: { commonWorkers: 18, oligarchs: -14 }
      },
      {
        text: 'Notstandsdekret erlassen & Polizeikräfte zur Räumung befehlen',
        outcomeText: 'Bereitschaftspolizei räumte Bahnhöfe mit Wasserwerfern. Bittere Wut gärt in der Bevölkerung.',
        treasuryDelta: -10,
        approvalDelta: -12,
        unrestDelta: 8,
        factionDeltas: { military: 6, commonWorkers: -20, oligarchs: 10 }
      },
      {
        text: 'Gewerkschaftsspitze über Staatsmedien diskreditieren & bestechen',
        outcomeText: 'Enthüllungen spalteten das Bündnis; der Generalstreik brach binnen weniger Tage in sich zusammen.',
        treasuryDelta: -12,
        approvalDelta: -2,
        unrestDelta: -6,
        factionDeltas: { bureaucracy: 6, commonWorkers: -8 }
      }
    ]
  },
  {
    id: 'event_oligarch_tax_flight',
    title: 'Oligarchen-Schwarzgeld & Offshore-Kapitalflucht',
    category: 'economic',
    description: 'Whistleblower haben Register geleakt, die belegen, dass führende Industriekonzerne Milliarden an Steuergeldern über Briefkastenfirmen in Steueroasen geschleust haben.',
    options: [
      {
        text: 'Kapitalverkehrskontrollen verhängen & 40% Strafabgabe eintreiben',
        outcomeText: 'Milliarden flossen in die Staatskasse zurück. Die Oligarchen toben hinter verschlossenen Türen.',
        treasuryDelta: 75,
        approvalDelta: 10,
        unrestDelta: -6,
        factionDeltas: { oligarchs: -22, commonWorkers: 12 }
      },
      {
        text: 'Stille Steueramnestie gewähren im Tausch gegen Infrastrukturanleihen',
        outcomeText: 'Die Tycoons finanzieren Autobahnausbauten und Spitäler, ohne strafrechtlich belangt zu werden.',
        treasuryDelta: 40,
        approvalDelta: 2,
        factionDeltas: { oligarchs: 8, bureaucracy: 6 }
      },
      {
        text: 'Geheimen Prozentsatz in das private Dynastiekonto des Herrschers abzweigen',
        outcomeText: 'Ein diskreter Vergleich wurde besiegelt. Ihr persönliches Schweizer Fluchtkapital wächst rasant.',
        treasuryDelta: 15,
        legitimacyDelta: -5,
        factionDeltas: { oligarchs: 10 }
      }
    ]
  },
  {
    id: 'event_dynastic_heir_scandal',
    title: 'Dynastischer Skandal im Herrscherhaus',
    category: 'dynastic',
    description: 'Fotos Ihres designierten Thronfolgers auf einer verruchten Champagnergala mit ausländischen Waffenschiebern und Spionen wurden in unabhängigen Medien veröffentlicht.',
    options: [
      {
        text: 'Thronfolger öffentlich rügen & zur Strafversetzung an die Grenze abkommandieren',
        outcomeText: 'Das Volk bewundert Ihre unerbittliche Strenge, auch wenn der dynastische Stolz gekränkt ist.',
        approvalDelta: 8,
        unrestDelta: -4,
        legitimacyDelta: 6,
        factionDeltas: { military: 8 }
      },
      {
        text: 'Berichte als feindlichen Deepfake verurteilen & Zeitungen mit Maulkorb belegen',
        outcomeText: 'Das Staatsfernsehen sendet Gegendarstellungen, während Zensoren das Videomaterial löschen.',
        treasuryDelta: -8,
        approvalDelta: -6,
        unrestDelta: 5,
        legitimacyDelta: -4
      },
      {
        text: 'Thronfolger enterben & Nachfolge an meritokratischen Kronrat übertragen',
        outcomeText: 'Ein epochaler Verfassungsschritt! Bildungsbürger und Bürokraten bejubeln die Meritokratie.',
        approvalDelta: 12,
        legitimacyDelta: 10,
        factionDeltas: { bureaucracy: 14 }
      }
    ]
  },
  {
    id: 'event_terrorist_syndicate',
    title: 'Untergrund-Kartell im Überseehafen ausgehoben',
    category: 'social',
    description: 'Der Verfassungsschutz hat ein verzweigtes Syndikat enttarnt, das Schutzgelderpressung betreibt und geheime Waffendepots im Hafen der Hauptstadt unterhält.',
    options: [
      {
        text: 'Koordinierte Antiterroreinsätze der Spezialeinheiten & Schauprozess',
        outcomeText: 'Dutzende Kartellbosse wurden in Ketten vorgeführt. Das Sicherheitsgefühl der Bevölkerung steigt.',
        treasuryDelta: -12,
        approvalDelta: 9,
        unrestDelta: -8,
        factionDeltas: { bureaucracy: 8, military: 6 }
      },
      {
        text: 'Das Syndikat für verdeckte Auslandsoperationen anwerben & instrumentalisieren',
        outcomeText: 'Die Schmuggelrouten des Kartells operieren nun unter Kontrolle unseres Militärgeheimdienstes.',
        treasuryDelta: 25,
        approvalDelta: -4,
        legitimacyDelta: -6
      },
      {
        text: 'Kronzeugenregelung anbieten, um korrupte Spitzenbeamte zu überführen',
        outcomeText: 'Eine Säuberung korrupter Zollbeamter und Hafenfunktionäre stellt das Staatsvertrauen wieder her.',
        treasuryDelta: -5,
        approvalDelta: 7,
        factionDeltas: { bureaucracy: -8, commonWorkers: 10 }
      }
    ]
  },
  {
    id: 'event_foreign_trade_ultimatum',
    title: 'Handelsstreit & Zolldrohung des Morgenländischen Großreichs',
    category: 'geopolitical',
    description: 'Das Morgenländische Großreich droht mit 35% Strafzöllen auf unsere Stahl- und Agrarexporte, falls wir unsere Märkte nicht für ihre subventionierten Konsumgüter öffnen.',
    options: [
      {
        text: 'Mit Vergeltungszöllen antworten & heimische Stahlwerke bezuschussen',
        outcomeText: 'Handelskrieg ausgebrochen! Heimische Hütten expandieren, doch die Inflation zieht leicht an.',
        treasuryDelta: -18,
        gdpGrowthDelta: -0.2,
        approvalDelta: 5,
        relationsDelta: { rivalId: 'rival_dragon_dominion', delta: -25 }
      },
      {
        text: 'Ausgewogenes bilaterales Quotenabkommen aushandeln',
        outcomeText: 'Diplomaten schließen einen fairen Kompromissvertrag ab, der Schlüsselbranchen schützt.',
        treasuryDelta: -6,
        gdpGrowthDelta: 0.15,
        approvalDelta: 4,
        relationsDelta: { rivalId: 'rival_dragon_dominion', delta: 15 }
      },
      {
        text: 'Forderungen nachgeben, um billige Konsumgüter für das Volk zu sichern',
        outcomeText: 'Supermärkte werden mit Billigwaren überschwemmt; heimische Fabrikanten protestieren wütend.',
        gdpGrowthDelta: 0.25,
        approvalDelta: -5,
        unrestDelta: 6,
        factionDeltas: { oligarchs: -15, commonWorkers: -6 },
        relationsDelta: { rivalId: 'rival_dragon_dominion', delta: 25 }
      }
    ]
  },
  {
    id: 'event_epidemic_outbreak',
    title: 'Ausbruch eines neuartigen Atemwegsvirus',
    category: 'social',
    description: 'Eine hochansteckende Mutation grassiert an internationalen Bahnhöfen und Flughäfen. Provinzkrankenhäuser geraten an ihre Kapazitätsgrenzen, die Fehlzeiten in Fabriken steigen rapide.',
    options: [
      {
        text: 'Klinik-Notfallplan aktivieren, Masken verteilen & kostenlose Behandlungen garantieren',
        outcomeText: 'Schnelle Feldlazarette und Medikamentenverteilung verhinderten eine unkontrollierte Katastrophe.',
        treasuryDelta: -45,
        approvalDelta: 11,
        unrestDelta: -7,
        factionDeltas: { commonWorkers: 12 }
      },
      {
        text: 'Militärische Quarantänezone errichten & Seehäfen abriegeln',
        outcomeText: 'Das Virus wurde eingedämmt, doch der Handel erlitt einen empfindlichen Quartalseinbruch.',
        treasuryDelta: -15,
        gdpGrowthDelta: -0.5,
        approvalDelta: -4,
        unrestDelta: 8,
        factionDeltas: { military: 8 }
      },
      {
        text: 'Gefahr herunterspielen, um die Industrieproduktion ungestört weiterlaufen zu lassen',
        outcomeText: 'Fabriken blieben offen, doch überfüllte Leichenhallen und Vertrauensverlust erschüttern das Regime.',
        treasuryDelta: 0,
        approvalDelta: -15,
        unrestDelta: 16,
        legitimacyDelta: -8
      }
    ]
  }
];
