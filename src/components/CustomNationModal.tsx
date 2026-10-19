import React, { useState } from 'react';
import { ERAS, EraInfo } from '../data/erasAndPresets';
import { EraId, GovernmentType, SuccessionLaw, SuffrageType } from '../types/game';
import { sound } from '../utils/sound';
import { X, Sparkles, Flag, Crown, Landmark, Scroll } from 'lucide-react';

interface CustomNationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCustomGame: (config: {
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
  }) => void;
}

export const CustomNationModal: React.FC<CustomNationModalProps> = ({
  isOpen,
  onClose,
  onCreateCustomGame
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'era' | 'state' | 'dynasty' | 'politics'>('era');

  // Form State
  const [selectedEra, setSelectedEra] = useState<EraId>('modern');
  const [year, setYear] = useState<number>(2026);
  const [countryName, setCountryName] = useState<string>('Republic of Valoria');
  const [capitalCity, setCapitalCity] = useState<string>('Aurelia');
  const [currencyName, setCurrencyName] = useState<string>('Valor');
  const [currencySymbol, setCurrencySymbol] = useState<string>('V$');
  const [flagPrimary, setFlagPrimary] = useState<string>('#1e40af');
  const [flagSecondary, setFlagSecondary] = useState<string>('#ca8a04');
  const [coatOfArms, setCoatOfArms] = useState<string>('Golden Griffin & Laurel');
  const [motto, setMotto] = useState<string>('Strength in Unity, Wisdom in Law');

  // Dynasty State
  const [rulerName, setRulerName] = useState<string>('Lord Regent Julian Vance');
  const [rulerTitle, setRulerTitle] = useState<string>('President-General');
  const [dynastyName, setDynastyName] = useState<string>('House of Vance');
  const [portraitStyle, setPortraitStyle] = useState<'regal' | 'military' | 'statesman' | 'theocrat' | 'technocrat'>('statesman');
  const [succession, setSuccession] = useState<SuccessionLaw>('meritocratic');

  // Politics State
  const [government, setGovernment] = useState<GovernmentType>('presidential_democracy');
  const [termLength, setTermLength] = useState<number>(5);
  const [maxTerms, setMaxTerms] = useState<number>(2);
  const [suffrage, setSuffrage] = useState<SuffrageType>('universal');

  const handleEraChange = (eraId: EraId) => {
    setSelectedEra(eraId);
    const eraObj = ERAS.find(e => e.id === eraId);
    if (eraObj) {
      setYear(eraObj.defaultYear);
      setCurrencyName(eraObj.currencyDefault.name);
      setCurrencySymbol(eraObj.currencyDefault.symbol);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playStamp();
    onCreateCustomGame({
      era: selectedEra,
      year,
      countryName,
      capitalCity,
      currencyName,
      currencySymbol,
      flagPrimary,
      flagSecondary,
      coatOfArms,
      motto,
      government,
      termLength: government === 'absolute_monarchy' || government === 'military_dictatorship' ? 0 : termLength,
      maxTerms: government === 'absolute_monarchy' ? 0 : maxTerms,
      suffrage,
      succession,
      rulerName,
      rulerTitle,
      dynastyName,
      portraitStyle,
      initialGdp: 12500,
      initialDebt: 8200,
      treasury: 1500,
      description: `Custom sovereign realm established under ${rulerTitle} ${rulerName} with a ${government.replace('_', ' ')} constitution.`
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-['Cinzel'] text-lg font-bold text-white tracking-wide">
                Eigenen Souveränen Staat Gründen
              </h2>
              <p className="text-xs text-slate-400">
                Konfigurieren Sie Epoche, Dynastie, Verfassung, Staatsform und Hoheitszeichen
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-800 bg-slate-950/20 text-xs font-medium">
          <button
            onClick={() => setActiveTab('era')}
            className={`px-4 py-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'era'
                ? 'border-amber-400 text-amber-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scroll className="w-3.5 h-3.5" />
            <span>1. Epoche & Zeit</span>
          </button>
          <button
            onClick={() => setActiveTab('state')}
            className={`px-4 py-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'state'
                ? 'border-amber-400 text-amber-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>2. Staat & Symbole</span>
          </button>
          <button
            onClick={() => setActiveTab('dynasty')}
            className={`px-4 py-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'dynasty'
                ? 'border-amber-400 text-amber-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>3. Dynastie & Herrscher</span>
          </button>
          <button
            onClick={() => setActiveTab('politics')}
            className={`px-4 py-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'politics'
                ? 'border-amber-400 text-amber-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>4. Verfassung & Gesetze</span>
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-300">
          
          {/* TAB 1: ERA */}
          {activeTab === 'era' && (
            <div className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Epoche der Weltgeschichte wählen
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ERAS.map((era) => (
                  <button
                    key={era.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      handleEraChange(era.id);
                    }}
                    className={`p-3 text-left rounded-lg border transition-all ${
                      selectedEra === era.id
                        ? 'border-amber-400 bg-amber-500/10 text-white'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-sm text-slate-100">{era.name}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{era.description}</div>
                  </button>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Startjahr (n. Chr. oder negativ für v. Chr.):
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full sm:w-48 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
            </div>
          )}

          {/* TAB 2: STATE */}
          {activeTab === 'state' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Offizieller Staatsname:</label>
                  <input
                    type="text"
                    value={countryName}
                    onChange={(e) => setCountryName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Hauptstadt:</label>
                  <input
                    type="text"
                    value={capitalCity}
                    onChange={(e) => setCapitalCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Währungsbezeichnung:</label>
                  <input
                    type="text"
                    value={currencyName}
                    onChange={(e) => setCurrencyName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Währungssymbol:</label>
                  <input
                    type="text"
                    value={currencySymbol}
                    onChange={(e) => setCurrencySymbol(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Primäre Flaggenfarbe:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={flagPrimary}
                      onChange={(e) => setFlagPrimary(e.target.value)}
                      className="w-10 h-8 rounded border border-slate-800 cursor-pointer bg-transparent"
                    />
                    <span className="font-mono text-slate-300">{flagPrimary}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Sekundäre Flaggenfarbe:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={flagSecondary}
                      onChange={(e) => setFlagSecondary(e.target.value)}
                      className="w-10 h-8 rounded border border-slate-800 cursor-pointer bg-transparent"
                    />
                    <span className="font-mono text-slate-300">{flagSecondary}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nationales Staatsmotto:</label>
                <input
                  type="text"
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white italic"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Staatswappen / Hoheitszeichen:</label>
                <input
                  type="text"
                  value={coatOfArms}
                  onChange={(e) => setCoatOfArms(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>
            </div>
          )}

          {/* TAB 3: DYNASTY */}
          {activeTab === 'dynasty' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Herrscherhaus / Dynastie / Partei:</label>
                  <input
                    type="text"
                    value={dynastyName}
                    onChange={(e) => setDynastyName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Name des Staatsoberhaupts:</label>
                  <input
                    type="text"
                    value={rulerName}
                    onChange={(e) => setRulerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Offizieller Herrschertitel:</label>
                  <input
                    type="text"
                    value={rulerTitle}
                    onChange={(e) => setRulerTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    placeholder="z.B. Kaiser, Bundespräsident, Premierminister, Generalissimus"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Porträt-Archetyp:</label>
                  <select
                    value={portraitStyle}
                    onChange={(e) => setPortraitStyle(e.target.value as typeof portraitStyle)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="statesman">Demokratischer Staatsmann</option>
                    <option value="regal">Kaiserlicher / Monarchischer Regent</option>
                    <option value="military">Militärischer Oberbefehlshaber</option>
                    <option value="theocrat">Theokratischer Patriarch</option>
                    <option value="technocrat">Wissenschaftlicher Technokrat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Erbfolge- & Nachfolgesystem:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'primogeniture', label: 'Erbliche Primogenitur', desc: 'Ältestes legitimes Kind erbt die Krone' },
                    { id: 'meritocratic', label: 'Meritokratischer Kronrat', desc: 'Fähigster Direktor des Kabinetts wird berufen' },
                    { id: 'elective_council', label: 'Wahlversammlung & Parlament', desc: 'Freie demokratische oder ständische Abstimmung' },
                    { id: 'military_junta', label: 'Militärjunta-Kommando', desc: 'Generalstab ernennt Nachfolger' },
                    { id: 'party_politburo', label: 'Politbüro-Beschluss', desc: 'Zentralkomitee wählt neuen Generalsekretär' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSuccession(item.id as SuccessionLaw)}
                      className={`p-2.5 text-left rounded-lg border text-xs transition-all ${
                        succession === item.id
                          ? 'border-amber-400 bg-amber-500/10 text-white'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-semibold text-slate-200">{item.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: POLITICS & CONSTITUTION */}
          {activeTab === 'politics' && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-1">Souveräne Regierungsform:</label>
                <select
                  value={government}
                  onChange={(e) => setGovernment(e.target.value as GovernmentType)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                >
                  <option value="presidential_democracy">Präsidialdemokratie</option>
                  <option value="parliamentary_democracy">Parlamentarische Demokratie</option>
                  <option value="constitutional_monarchy">Konstitutionelle Monarchie</option>
                  <option value="absolute_monarchy">Absolute Monarchie (Autokratie)</option>
                  <option value="military_dictatorship">Militärdiktatur</option>
                  <option value="one_party_autocracy">Einparteien-Autokratie</option>
                  <option value="technocracy">Technokratie</option>
                  <option value="theocracy">Theokratie</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Amtszeitdauer (Jahre):</label>
                  <select
                    value={termLength}
                    onChange={(e) => setTermLength(Number(e.target.value))}
                    disabled={government === 'absolute_monarchy' || government === 'military_dictatorship'}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white disabled:opacity-50"
                  >
                    <option value={4}>4 Jahre</option>
                    <option value={5}>5 Jahre</option>
                    <option value={8}>8 Jahre</option>
                    <option value={0}>Auf Lebenszeit (Keine Wahlen)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Wiederwahlbeschränkung:</label>
                  <select
                    value={maxTerms}
                    onChange={(e) => setMaxTerms(Number(e.target.value))}
                    disabled={government === 'absolute_monarchy' || termLength === 0}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white disabled:opacity-50"
                  >
                    <option value={1}>Maximal 1 Wiederwahl</option>
                    <option value={2}>Maximal 2 Amtszeiten</option>
                    <option value={0}>Unbegrenzte Wiederwahl</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Wahlrecht & Bürgerbeteiligung:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'universal', label: 'Allgemeines Wahlrecht' },
                    { id: 'landowners_wealth', label: 'Zensuswahlrecht (Besitz & Steuern)' },
                    { id: 'party_members_only', label: 'Nur Parteikader & Funktionäre' },
                    { id: 'military_only', label: 'Nur Angehörige der Streitkräfte' },
                    { id: 'clergy_only', label: 'Nur Klerus & Geistlicher Rat' },
                    { id: 'none_absolute', label: 'Kein Wahlrecht (Absolutes Dekret)' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSuffrage(s.id as SuffrageType)}
                      className={`p-2.5 text-left rounded-lg border text-xs transition-all ${
                        suffrage === s.id
                          ? 'border-amber-400 bg-amber-500/10 text-white font-medium'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer / Submit */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Verfassung Ratifizieren & Starten</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
