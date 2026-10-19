import React, { useState } from 'react';
import { GameState, LuxuryAsset, PrivateBusiness, FamilyMember } from '../types/game';
import { sound } from '../utils/sound';
import {
  User,
  Shield,
  Briefcase,
  DollarSign,
  Send,
  Building,
  Award,
  Users,
  Compass,
  AlertTriangle,
  TrendingUp,
  Gem,
  PlusCircle,
  EyeOff,
  CheckCircle2,
  Trash2,
  ChevronRight
} from 'lucide-react';

interface PresidentPrivatePanelProps {
  state: GameState;
  onUpdateState: (updater: (prev: GameState) => GameState) => void;
  onLogEvent: (text: string, type: 'positive' | 'warning' | 'negative' | 'neutral') => void;
}

export const PresidentPrivatePanel: React.FC<PresidentPrivatePanelProps> = ({
  state,
  onUpdateState,
  onLogEvent
}) => {
  const [transferAmountInput, setTransferAmountInput] = useState<string>('5.0');
  const [newBizName, setNewBizName] = useState<string>('');
  const [newBizSector, setNewBizSector] = useState<string>('Hochtechnologie & KI');
  const [newBizCapital, setNewBizCapital] = useState<number>(0.5);

  const glassCard = state.themeMode === 'light'
    ? 'bg-white/80 border-slate-200 text-slate-800 shadow-sm'
    : 'bg-slate-900/60 border-slate-800/80 text-slate-100 shadow-md backdrop-blur-md';

  const innerCard = state.themeMode === 'light'
    ? 'bg-slate-50 border-slate-200'
    : 'bg-slate-950/50 border-slate-800/60';

  // Transfer cash from private account to State Treasury (supports > 1 Billion!)
  const handleTransferToTreasury = () => {
    const amount = parseFloat(transferAmountInput);
    if (isNaN(amount) || amount <= 0) return;

    if (state.ruler.slushFund < amount) {
      alert('Unzureichendes privates Guthaben auf dem offiziellen Privatkonto.');
      return;
    }

    sound.playCoin();
    onUpdateState(prev => ({
      ...prev,
      ruler: {
        ...prev.ruler,
        slushFund: Number((prev.ruler.slushFund - amount).toFixed(3)),
        reputation: Math.min(100, prev.ruler.reputation + (amount >= 5 ? 8 : 4)),
        popularity: Math.min(100, prev.ruler.popularity + (amount >= 5 ? 6 : 3))
      },
      macro: {
        ...prev.macro,
        treasury: Number((prev.macro.treasury + amount).toFixed(2))
      }
    }));

    onLogEvent(
      `PATRIOTISCHE SPENDE: Präsident ${state.ruler.name} überwies privat ${state.currencySymbol}${amount.toFixed(2)} Mrd. an die Staatskasse!`,
      'positive'
    );
  };

  // Buy or sell luxury asset
  const handleToggleLuxury = (asset: LuxuryAsset) => {
    sound.playClick();
    if (!asset.purchased) {
      if (state.ruler.slushFund < asset.valueMrd) {
        alert('Nicht genügend privates Kapital für diese Luxusanschaffung.');
        return;
      }
      onUpdateState(prev => ({
        ...prev,
        ruler: {
          ...prev.ruler,
          slushFund: Number((prev.ruler.slushFund - asset.valueMrd).toFixed(3)),
          prestige: Math.min(100, prev.ruler.prestige + asset.prestigeBonus),
          luxuryAssets: prev.ruler.luxuryAssets.map(l => l.id === asset.id ? { ...l, purchased: true } : l)
        }
      }));
      onLogEvent(`LUXUSERWERB: Präsident erwarb „${asset.name}“ für ${state.currencySymbol}${asset.valueMrd} Mrd.`, 'positive');
    } else {
      // Sell back for 75%
      const sellValue = Number((asset.valueMrd * 0.75).toFixed(3));
      onUpdateState(prev => ({
        ...prev,
        ruler: {
          ...prev.ruler,
          slushFund: Number((prev.ruler.slushFund + sellValue).toFixed(3)),
          prestige: Math.max(10, prev.ruler.prestige - Math.round(asset.prestigeBonus * 0.6)),
          luxuryAssets: prev.ruler.luxuryAssets.map(l => l.id === asset.id ? { ...l, purchased: false } : l)
        }
      }));
      onLogEvent(`VERKAUF: „${asset.name}“ veräußert für ${state.currencySymbol}${sellValue} Mrd.`, 'neutral');
    }
  };

  // Found private company
  const handleFoundBusiness = () => {
    if (!newBizName.trim()) return;
    if (state.ruler.slushFund < newBizCapital) {
      alert('Unzureichendes privates Kapital für die Unternehmensgründung.');
      return;
    }
    sound.playStamp();
    const newBiz: PrivateBusiness = {
      id: `biz_${Date.now()}`,
      name: newBizName.trim(),
      sector: newBizSector,
      investedMrd: newBizCapital,
      valuationMrd: Number((newBizCapital * 1.35).toFixed(2)),
      quarterlyProfitMio: Number((newBizCapital * 22).toFixed(1)),
      ownershipPercent: 100
    };

    onUpdateState(prev => ({
      ...prev,
      ruler: {
        ...prev.ruler,
        slushFund: Number((prev.ruler.slushFund - newBizCapital).toFixed(3)),
        privateBusinesses: [newBiz, ...(prev.ruler.privateBusinesses || [])]
      }
    }));

    onLogEvent(`UNTERNEHMENSGRÜNDUNG: Präsident gründete privat die „${newBiz.name}“ im Sektor ${newBiz.sector}.`, 'positive');
    setNewBizName('');
  };

  // Appoint family member to a key role
  const handleAppointFamily = (memberId: string, roleName: string) => {
    sound.playStamp();
    onUpdateState(prev => {
      const targetMember = prev.family.find(m => m.id === memberId);
      const isSensitiveRole = roleName.includes('Minister') || roleName.includes('Geheimdienst') || roleName.includes('Zentralbank');
      const conflictSpike = isSensitiveRole ? 25 : 10;

      return {
        ...prev,
        family: prev.family.map(m => m.id === memberId ? { ...m, currentRole: roleName, conflictLevel: Math.min(100, m.conflictLevel + conflictSpike) } : m),
        stability: Math.max(10, prev.stability - (isSensitiveRole && (targetMember?.corruptionRisk || 0) > 40 ? 5 : 0))
      };
    });

    onLogEvent(`FAMILIENERNENNUNG: Familienmitglied für die Schlüsselposition „${roleName}“ ernannt.`, 'warning');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: President Profile & Identity */}
      <div className={`p-6 rounded-2xl border ${glassCard}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Avatar & Title */}
          <div className="lg:col-span-4 flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl border-2 border-amber-500/50 bg-gradient-to-br from-amber-500/20 to-slate-900 flex items-center justify-center shadow-lg overflow-hidden shrink-0">
              <User className="w-10 h-10 text-amber-400" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold font-mono">
                {state.playMode === 'shadow_president' ? 'Schatten-Präsident & Oberhaupt' : 'Demokratischer Staatsmann & Präsident'}
              </div>
              <h2 className="text-2xl font-black font-['Cinzel'] tracking-wide">
                {state.ruler.title} {state.ruler.name}
              </h2>
              <div className="text-xs text-slate-400">
                Partei: <span className="text-slate-200 font-semibold">{state.ruler.party || 'Nationale Reform-Koalition'}</span> · {state.ruler.age} Jahre
              </div>
            </div>
          </div>

          {/* Key Political Metrics */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
            <div className={`p-3 rounded-xl border ${innerCard}`}>
              <span className="text-[10px] text-slate-400 block uppercase">Beliebtheit</span>
              <span className="text-lg font-bold text-sky-400">{Math.round(state.ruler.popularity)}%</span>
            </div>
            <div className={`p-3 rounded-xl border ${innerCard}`}>
              <span className="text-[10px] text-slate-400 block uppercase">Reputation</span>
              <span className="text-lg font-bold text-emerald-400">{Math.round(state.ruler.reputation || 80)}/100</span>
            </div>
            <div className={`p-3 rounded-xl border ${innerCard}`}>
              <span className="text-[10px] text-slate-400 block uppercase">Machtposition</span>
              <span className="text-lg font-bold text-amber-400">{Math.round(state.ruler.politicalPower || 75)}/100</span>
            </div>
            <div className={`p-3 rounded-xl border ${innerCard}`}>
              <span className="text-[10px] text-slate-400 block uppercase">Amtszeit</span>
              <span className="text-lg font-bold text-purple-400">{state.ruler.reignYears} Jahre</span>
            </div>
          </div>
        </div>
      </div>

      {/* Presidential Wealth Hub: Official Cash vs Offshore & Transfer to Treasury */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Accounts Overview & Treasury Donation */}
        <div className={`lg:col-span-6 p-6 rounded-2xl border ${glassCard} flex flex-col justify-between`}>
          <div>
            <div className="flex items-center gap-2 text-base font-bold text-amber-400 mb-4">
              <DollarSign className="w-5 h-5" />
              <span>Präsidiale Konten & Vermögensübertragung</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {/* Official Account */}
              <div className={`p-4 rounded-xl border ${innerCard}`}>
                <div className="text-[11px] text-slate-400 uppercase font-mono">Offizielles Privatvermögen</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                  {state.currencySymbol}{state.ruler.slushFund.toFixed(2)} Mrd.
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Legale Dividenden, Unternehmergewinne & Gehalt
                </div>
              </div>

              {/* Secret Offshore / Underworld Account */}
              <div className={`p-4 rounded-xl border ${innerCard}`}>
                <div className="text-[11px] text-purple-400 uppercase font-mono flex items-center gap-1">
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Schatten- & Offshore-Konto</span>
                </div>
                <div className="text-2xl font-bold font-mono text-purple-400 mt-1">
                  {state.currencySymbol}{(state.ruler.secretSlushFund || 0).toFixed(2)} Mrd.
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Verdeckte Kassen in Panama, Zürich & Caymans
                </div>
              </div>
            </div>

            {/* Direct Donation to State Treasury (> 1 Mrd. support) */}
            <div className={`p-4 rounded-xl border ${innerCard}`}>
              <div className="text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                <Send className="w-4 h-4 text-emerald-400" />
                <span>Milliardenspende an die Staatskasse</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Überweisen Sie persönliches Vermögen direkt in den Staatshaushalt zur Schuldentilgung oder für Infrastrukturprojekte. Erhöht Ansehen und Beliebtheit im Volk.
              </p>
              
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[140px]">
                  <span className="absolute left-3 top-2 text-xs font-mono text-slate-400">{state.currencySymbol}</span>
                  <input
                    type="number"
                    step="0.5"
                    min="0.1"
                    max={state.ruler.slushFund}
                    value={transferAmountInput}
                    onChange={(e) => setTransferAmountInput(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Milliardenbetrag"
                  />
                  <span className="absolute right-3 top-2 text-xs font-mono text-slate-400">Mrd.</span>
                </div>

                {/* Preset quick buttons */}
                {[1, 5, 10, 50].map((quick) => (
                  <button
                    key={quick}
                    onClick={() => setTransferAmountInput(quick.toString())}
                    className="px-2 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700 transition-colors"
                  >
                    +{quick} Mrd.
                  </button>
                ))}

                <button
                  onClick={handleTransferToTreasury}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Jetzt überweisen</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Luxury Goods & Prestige Assets */}
        <div className={`lg:col-span-6 p-6 rounded-2xl border ${glassCard}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-base font-bold text-amber-400">
              <Gem className="w-5 h-5" />
              <span>Privater Luxus- & Repräsentationsfuhrpark</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Prestige: <strong className="text-amber-400">{state.ruler.prestige}/100</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
            {state.ruler.luxuryAssets.map((asset) => {
              return (
                <div
                  key={asset.id}
                  className={`p-3 rounded-xl border transition-all ${
                    asset.purchased
                      ? 'border-amber-500/50 bg-amber-500/10 shadow-sm'
                      : innerCard
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-slate-200">{asset.name}</div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Wert: <span className="text-amber-400">{state.currencySymbol}{asset.valueMrd} Mrd.</span> · +{asset.prestigeBonus} Prestige
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Unterhalt: {state.currencySymbol}{asset.upkeepQuarterlyMio} Mio./Q
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => handleToggleLuxury(asset)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                        asset.purchased
                          ? 'bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/30'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
                      }`}
                    >
                      {asset.purchased ? 'Veräußern' : 'Kaufen'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Private Businesses: Gründung, Ausbau & Verkauf */}
      <div className={`p-6 rounded-2xl border ${glassCard}`}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <Building className="w-5 h-5" />
              <span>Präsidiale Unternehmensbeteiligungen & Konzerne</span>
            </h3>
            <p className="text-xs text-slate-400">
              Gründen Sie eigene Unternehmen in unterschiedlichen Sektoren, legen Sie Investitionssummen fest und kassieren Sie quartalsweise Dividenden.
            </p>
          </div>
        </div>

        {/* Existing Private Businesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {(state.ruler.privateBusinesses || []).map((biz) => (
            <div key={biz.id} className={`p-4 rounded-xl border ${innerCard}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-200">{biz.name}</div>
                  <div className="text-[11px] text-slate-400">{biz.sector}</div>
                </div>
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {biz.ownershipPercent}% Anteil
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block">Marktwert</span>
                  <span className="text-slate-200 font-semibold">{state.currencySymbol}{biz.valuationMrd} Mrd.</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Gewinn / Q</span>
                  <span className="text-emerald-400 font-semibold">+{biz.quarterlyProfitMio} Mio.</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                <button
                  onClick={() => {
                    sound.playCoin();
                    onUpdateState(prev => ({
                      ...prev,
                      ruler: {
                        ...prev.ruler,
                        privateBusinesses: prev.ruler.privateBusinesses.map(b =>
                          b.id === biz.id ? { ...b, valuationMrd: Number((b.valuationMrd * 1.25).toFixed(2)), quarterlyProfitMio: Number((b.quarterlyProfitMio * 1.25).toFixed(1)) } : b
                        )
                      }
                    }));
                  }}
                  className="text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Erweitern (+25%)
                </button>
                <button
                  onClick={() => {
                    sound.playCoin();
                    const sellCash = biz.valuationMrd * (biz.ownershipPercent / 100);
                    onUpdateState(prev => ({
                      ...prev,
                      ruler: {
                        ...prev.ruler,
                        slushFund: Number((prev.ruler.slushFund + sellCash).toFixed(3)),
                        privateBusinesses: prev.ruler.privateBusinesses.filter(b => b.id !== biz.id)
                      }
                    }));
                    onLogEvent(`VERKAUF: „${biz.name}“ für ${state.currencySymbol}${sellCash.toFixed(2)} Mrd. abgestoßen.`, 'neutral');
                  }}
                  className="text-rose-400 hover:text-rose-300 transition-colors"
                >
                  Abstoßen ({state.currencySymbol}{biz.valuationMrd} Mrd.)
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Founding New Company Form */}
        <div className={`p-4 rounded-xl border border-dashed border-slate-700 ${innerCard}`}>
          <div className="text-xs font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Neues Unternehmen gründen</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div className="sm:col-span-2">
              <label className="text-[10px] text-slate-400 block mb-1">Unternehmensname</label>
              <input
                type="text"
                value={newBizName}
                onChange={(e) => setNewBizName(e.target.value)}
                placeholder="z. B. Sovereign Orbitals GmbH"
                className="w-full px-3 py-1.5 rounded border border-slate-700 bg-slate-900 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Branche</label>
              <select
                value={newBizSector}
                onChange={(e) => setNewBizSector(e.target.value)}
                className="w-full px-2 py-1.5 rounded border border-slate-700 bg-slate-900 text-xs text-white focus:outline-none"
              >
                <option value="Hochtechnologie & KI">Hochtechnologie & KI</option>
                <option value="Gewerbeimmobilien">Gewerbeimmobilien</option>
                <option value="Rüstung & Wehrtechnik">Rüstung & Wehrtechnik</option>
                <option value="Erneuerbare Energien">Erneuerbare Energien</option>
                <option value="Internationale Logistik">Internationale Logistik</option>
                <option value="Medien & Unterhaltung">Medien & Unterhaltung</option>
              </select>
            </div>
            <div>
              <button
                onClick={handleFoundBusiness}
                className="w-full py-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Gründen ({state.currencySymbol}{newBizCapital} Mrd.)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Family Administration: Stammbaum & Postenvergabe */}
      <div className={`p-6 rounded-2xl border ${glassCard}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>Familienverwaltung & Dynastische Schlüsselpositionen</span>
            </h3>
            <p className="text-xs text-slate-400">
              Überblick über Vermögen, Loyalität, Kompetenz und Interessenkonflikte aller Familienmitglieder. Vergeben Sie Schlüsselpositionen an loyale Vertraute.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.family.map((member) => (
            <div key={member.id} className={`p-4 rounded-xl border ${innerCard}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-200">{member.name}</div>
                  <div className="text-xs text-amber-400 font-semibold">{member.relation} · {member.age} Jahre</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {state.currencySymbol}{member.netWorthMio} Mio.
                  </span>
                  <div className="text-[10px] text-slate-500">Privatvermögen</div>
                </div>
              </div>

              {/* Status & Metrics */}
              <div className="grid grid-cols-3 gap-2 my-3 text-center text-xs font-mono">
                <div className="p-1.5 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-[9px] text-slate-400 block uppercase">Loyalität</span>
                  <span className="text-sky-400 font-bold">{member.loyalty}%</span>
                </div>
                <div className="p-1.5 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-[9px] text-slate-400 block uppercase">Kompetenz</span>
                  <span className="text-emerald-400 font-bold">{member.competence}%</span>
                </div>
                <div className="p-1.5 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-[9px] text-slate-400 block uppercase">Interessenkonflikt</span>
                  <span className={`font-bold ${member.conflictLevel > 40 ? 'text-rose-400' : 'text-slate-300'}`}>
                    {member.conflictLevel}%
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-300 mb-2">
                Aktuelle Position: <strong className="text-amber-300">{member.currentRole}</strong>
              </div>
              <div className="text-[11px] text-slate-400 truncate mb-3">
                Investments: {member.investments}
              </div>

              {/* Appointment options */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
                {[
                  'Botschafter in Genf',
                  'Aufsichtsrat Staatsbank',
                  'Präsident der Kulturstiftung',
                  'Sonderbeauftragter Rüstung'
                ].map((post) => (
                  <button
                    key={post}
                    onClick={() => handleAppointFamily(member.id, post)}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300 border border-slate-700 transition-colors"
                  >
                    Als {post.split(' ')[0]} ernennen
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
