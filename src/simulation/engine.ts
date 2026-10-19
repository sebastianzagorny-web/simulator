import { GameState, DilemmaEvent, CreditRating, StockItem, CabinetMinister, WelfarePackage } from '../types/game';
import { DILEMMA_EVENTS } from '../data/dilemmas';

export interface QuarterlySummary {
  revenueTotal: number;
  taxBreakdown: {
    income: number;
    corporate: number;
    vat: number;
    fuel: number;
    inheritance: number;
    luxury?: number;
    resources?: number;
    financial?: number;
  };
  enterpriseProfits: number;
  armsExportRevenue: number;
  expenditureTotal: number;
  militaryUpkeep: number;
  infrastructureUpkeep: number;
  cabinetBudgetsTotal: number;
  welfareExpenditure: number;
  debtRepaymentMade: number;
  lawExpenditures: number;
  debtInterest: number;
  netQuarterlyBalance: number;
  gdpDelta: number;
  unrestDelta: number;
  approvalDelta: number;
}

export function calculateCreditRating(debtToGdp: number, treasury: number): CreditRating {
  if (debtToGdp < 40 && treasury > 100) return 'AAA';
  if (debtToGdp < 60) return 'AA';
  if (debtToGdp < 80) return 'A';
  if (debtToGdp < 105) return 'BBB';
  if (debtToGdp < 130) return 'BB';
  if (debtToGdp < 160) return 'B';
  if (debtToGdp < 200) return 'CCC';
  return 'D';
}

export function simulateQuarter(prevState: GameState): { nextState: GameState; summary: QuarterlySummary } {
  const g = { ...prevState };
  
  // 1. Advance Calendar
  let nextQuarter = (g.quarter + 1) as 1 | 2 | 3 | 4;
  let nextYear = g.year;
  if (g.quarter === 4) {
    nextQuarter = 1;
    nextYear = g.year + 1;
    g.ruler.age += 1;
    g.ruler.reignYears += 1;
    g.ruler.heir.age += 1;
  }

  // 2. Tax Revenues (based on GDP fraction per quarter)
  const quarterlyGdp = g.macro.gdp / 4;
  const incomeTaxRev = quarterlyGdp * 0.36 * (g.taxes.income / 100);
  const corpTaxRev = quarterlyGdp * 0.22 * (g.taxes.corporate / 100);
  const vatTaxRev = quarterlyGdp * 0.26 * ((g.taxes.vat ?? 19) / 100);
  const fuelTaxRev = quarterlyGdp * 0.06 * ((g.taxes.fuel ?? 25) / 100);
  const inheritanceTaxRev = quarterlyGdp * 0.04 * ((g.taxes.inheritance ?? 10) / 100);
  const taxTotal = incomeTaxRev + corpTaxRev + vatTaxRev + fuelTaxRev + inheritanceTaxRev;

  // Enterprise Profits
  const enterpriseProfits = g.enterprises.reduce((acc, ent) => {
    if (ent.ownership === 'state_owned') return acc + ent.quarterlyProfit;
    if (ent.ownership === 'joint_venture') return acc + ent.quarterlyProfit * 0.5;
    return acc; // privatized pays corporate tax instead
  }, 0);

  // Arms Export Revenue
  const armsExportRev = (g.military.annualArmsExports / 4);

  // Trade Deals net balance
  let tradeBalance = 0;
  if (g.tradeDeals && g.tradeDeals.length > 0) {
    g.tradeDeals.forEach(deal => {
      if (deal.type === 'export') {
        tradeBalance += deal.valueQuarterlyMrd * 0.15; // State duty & revenue
      } else {
        tradeBalance -= deal.valueQuarterlyMrd * 0.05; // State subsidy/import cost
      }
    });
  }

  // 2b. Foreign Sovereign Lending Repayments & Interest
  let loanRepaymentsRevenue = 0;
  const nextForeignLoans = (g.foreignLoans || []).map(loan => {
    if (loan.remainingQuarters > 0 && loan.remainingMrd > 0) {
      const payment = Math.min(loan.remainingMrd, loan.installmentQuarterlyMrd);
      loanRepaymentsRevenue += payment;
      return {
        ...loan,
        remainingMrd: Math.max(0, Number((loan.remainingMrd - payment).toFixed(3))),
        remainingQuarters: loan.remainingQuarters - 1
      };
    }
    return loan;
  });

  // 2c. Foreign Investments Dividends & Profits (Top 10 & State Enterprises)
  let foreignInvestmentsRevenue = 0;
  const nextForeignInvestments = (g.foreignInvestments || []).map(inv => {
    const returnRate = inv.quarterlyReturnPercent || 2.2;
    const profit = Number(((inv.investedMrd * returnRate) / 100).toFixed(3));
    foreignInvestmentsRevenue += profit;
    return {
      ...inv,
      lastProfitQuarterMrd: profit
    };
  });

  // 2d. War Reparations (50% GDP of defeated nations for 20 years)
  let warReparationsRevenue = 0;
  const nextActiveReparations = (g.activeReparations || []).map(rep => {
    if (rep.remainingQuarters > 0) {
      warReparationsRevenue += rep.quarterlyReparationMrd;
      return {
        ...rep,
        remainingQuarters: rep.remainingQuarters - 1,
        totalCollectedMrd: Number((rep.totalCollectedMrd + rep.quarterlyReparationMrd).toFixed(2))
      };
    }
    return rep;
  });

  // 2e. Federated Countries Revenues (Sämtliche Einnahmen & Rohstoffe)
  let federationRevenues = 0;
  if (g.federatedCountries && g.federatedCountries.length > 0) {
    federationRevenues = g.federatedCountries.length * 24.0; // Quartalsüberschuss aus eingegliederten Föderationsstaaten
  }

  const revenueTotal = taxTotal + enterpriseProfits + armsExportRev + tradeBalance + loanRepaymentsRevenue + foreignInvestmentsRevenue + warReparationsRevenue + federationRevenues;

  // 3. Expenditures
  // Military upkeep based on forces & DEFCON readiness (DEFCON 1 is double upkeep)
  const defconMultiplier = (6 - g.military.readinessDefcon) * 0.2 + 0.8;
  const militaryUpkeep = (
    g.military.infantryDivisions * 0.35 +
    g.military.armoredDivisions * 0.75 +
    g.military.fighterSquadrons * 0.65 +
    g.military.navalFleets * 1.4 +
    (g.military.droneSwarmUnits || 0) * 0.02 +
    (g.military.roboticsLegions || 0) * 0.08 +
    (g.military.nuclearSubmarines || 0) * 0.35 +
    (g.military.nuclearAircraftCarriers || 0) * 0.80 +
    g.military.nuclearWarheads * 0.05
  ) * defconMultiplier;

  // Infrastructure Upkeep
  const infrastructureUpkeep = g.infrastructure.reduce((acc, inf) => acc + (inf.level * inf.upkeepPerQuarter), 0);

  // Cabinet autonomous department budgets
  const cabinetBudgetsTotal = (g.cabinet || []).reduce((acc, min) => acc + (min.quarterlyBudgetMrd || 1.0), 0);

  // Welfare packages expenditure
  const welfareExpenditure = (g.welfarePackages || [])
    .filter(w => w.active)
    .reduce((acc, w) => acc + w.costMrd, 0);

  // Law Expenditures & modifiers
  let lawExpenditures = 0;
  let lawGdpBonus = 0;
  let lawApprovalBonus = 0;
  let lawUnrestBonus = 0;

  g.laws.forEach(policy => {
    const activeOpt = policy.options.find(o => o.id === policy.currentOption);
    if (activeOpt) {
      lawExpenditures += activeOpt.costPerQuarter;
      lawGdpBonus += activeOpt.gdpMod;
      lawApprovalBonus += activeOpt.approvalMod;
      lawUnrestBonus += activeOpt.unrestMod;
    }
  });

  // National Debt Interest
  const sovereignRiskSpread = g.macro.creditRating === 'AAA' ? 0.0 :
    g.macro.creditRating === 'AA' ? 0.2 :
    g.macro.creditRating === 'A' ? 0.5 :
    g.macro.creditRating === 'BBB' ? 1.0 :
    g.macro.creditRating === 'BB' ? 2.2 :
    g.macro.creditRating === 'B' ? 3.8 :
    g.macro.creditRating === 'CCC' ? 6.5 : 11.0;
  
  const annualInterestRate = Math.max(0.5, g.macro.interestRate + sovereignRiskSpread);
  const debtInterest = (g.macro.nationalDebt * (annualInterestRate / 100)) / 4;

  const expenditureTotal = militaryUpkeep + infrastructureUpkeep + cabinetBudgetsTotal + welfareExpenditure + lawExpenditures + debtInterest;
  const netQuarterlyBalance = revenueTotal - expenditureTotal;

  // 4. Update Treasury and Debt
  let nextTreasury = g.macro.treasury + netQuarterlyBalance;
  let nextDebt = g.macro.nationalDebt;
  let debtRepaymentMade = 0;

  if (nextTreasury < 0) {
    // Automatically borrow if treasury is negative
    nextDebt += Math.abs(nextTreasury);
    nextTreasury = 0;
  } else {
    // Adjustable user debt repayment
    const targetRepay = g.macro.debtRepayQuarterly || 0;
    if (targetRepay > 0 && nextTreasury > targetRepay && nextDebt > 0) {
      const repayAmount = Math.min(nextDebt, Math.min(targetRepay, nextTreasury * 0.8));
      nextDebt -= repayAmount;
      nextTreasury -= repayAmount;
      debtRepaymentMade = repayAmount;
    }
  }

  // 5. Macroeconomic Trajectory
  const avgTaxRate = (g.taxes.income + g.taxes.corporate + (g.taxes.vat || 19) + (g.taxes.fuel || 25)) / 4;
  const taxDrag = (avgTaxRate - 22) * 0.035;
  const interestDrag = (g.macro.interestRate - 3.5) * 0.15;
  const infraGdpBoost = g.infrastructure.reduce((acc, inf) => acc + (inf.level * 0.04), 0);
  const foreignTalentBoost = g.macro.foreignTalentCampaignActive ? 0.35 : 0.0;

  let nextGdpGrowth = Math.max(-4.0, Math.min(8.5, 2.6 + infraGdpBoost + foreignTalentBoost + lawGdpBonus - taxDrag - interestDrag));
  const quarterlyGdpMultiplier = 1 + (nextGdpGrowth / 400);
  const nextGdp = Math.max(10, g.macro.gdp * quarterlyGdpMultiplier);

  // Inflation adjustments
  let nextInflation = g.macro.inflationRate + (nextGdpGrowth > 4 ? 0.2 : -0.1) - (g.macro.interestRate - 3) * 0.08;
  if (nextDebt > nextGdp * 1.5) nextInflation += 0.25;
  nextInflation = Math.max(0.5, Math.min(25.0, nextInflation));

  // Unemployment adjustments
  let nextUnemployment = g.macro.unemploymentRate - (nextGdpGrowth - 2.5) * 0.12;
  nextUnemployment = Math.max(2.2, Math.min(24.0, nextUnemployment));

  // Debt-to-GDP and Credit Rating
  const debtToGdp = (nextDebt / nextGdp) * 100;
  const nextRating = calculateCreditRating(debtToGdp, nextTreasury);

  // 6. Resources simulation
  const nextResources = { ...g.resources };
  let resourceDeficitSpike = 0;

  (Object.keys(nextResources) as (keyof typeof nextResources)[]).forEach(k => {
    const res = { ...nextResources[k] };
    const net = res.production - res.consumption;
    res.stockpile = Math.max(0, res.stockpile + net);
    if (res.stockpile === 0 && net < 0) {
      resourceDeficitSpike += 4;
    }
    nextResources[k] = res;
  });

  // 7. Covert Operations progress
  const nextCovertOps = g.covertOps.map(op => {
    if (!op.active) return op;
    const nextProg = op.progress + 25;
    if (nextProg >= 100) {
      return { ...op, progress: 0, active: false };
    }
    return { ...op, progress: nextProg };
  });

  // 8. Cabinet Autonomous Progression & Private Disclosure
  const nextCabinet = (g.cabinet || []).map(min => {
    const progressGain = Math.round(5 + (min.competence / 15) + (min.quarterlyBudgetMrd * 0.8));
    const newProgress = Math.min(100, min.projectProgress + progressGain);
    return {
      ...min,
      projectProgress: newProgress >= 100 ? 10 : newProgress
    };
  });

  // 9. Autonomous Stock Market Simulation
  let totalDividendToState = 0;
  let totalDividendToPresident = 0;
  let totalDividendToFamily = 0;

  const nextStocks: StockItem[] = (g.stocks || []).map(stk => {
    const marketMood = (nextGdpGrowth - 2.5) * 1.5 - (nextInflation - 2.5) * 0.8;
    const randomFluctuation = (Math.random() - 0.48) * (stk.volatility / 3);
    const priceChange = stk.currentPrice * ((marketMood + randomFluctuation) / 100);
    const newPrice = Math.max(2.0, Number((stk.currentPrice + priceChange).toFixed(2)));
    const newHistory = [...stk.priceHistory.slice(-14), newPrice];

    // Quarterly dividend calculation
    const quarterlyDividendPerShare = (newPrice * (stk.dividendYield / 100)) / 4;
    totalDividendToState += (stk.stateSharesOwned * quarterlyDividendPerShare) / 1e9; // in Mrd
    totalDividendToPresident += (stk.presidentSharesOwned * quarterlyDividendPerShare) / 1e9;
    totalDividendToFamily += (stk.familySharesOwned * quarterlyDividendPerShare) / 1e6; // in Mio

    return {
      ...stk,
      currentPrice: newPrice,
      priceHistory: newHistory
    };
  });

  nextTreasury += totalDividendToState;

  // 10. Autonomous Pension System (Target 75%)
  const workingRatio = g.population.ageDistribution.working15to64 / Math.max(1, g.population.ageDistribution.seniors65Plus);
  const targetPension = g.pensionSystem?.targetLevelPercent || 75;
  // Natural economic convergence towards 75% depending on employment & treasury strength
  const economicPull = (nextGdpGrowth > 2 ? 0.3 : -0.2) + (nextUnemployment < 5 ? 0.4 : -0.3);
  const currentPension = g.pensionSystem?.actualLevelPercent || 68.5;
  const nextActualPension = Math.max(50, Math.min(85, Number((currentPension + (targetPension - currentPension) * 0.05 + economicPull * 0.1).toFixed(1))));

  const nextPensionSystem = {
    targetLevelPercent: 75,
    actualLevelPercent: nextActualPension,
    sustainabilityIndex: Math.max(30, Math.min(99, Math.round(75 + (workingRatio - 3) * 10 - (nextActualPension - 70) * 1.5))),
    monthlyAverageEuro: Math.round(1750 * (nextActualPension / 75))
  };

  // 11. Autonomous Shadow Syndicate / Underworld
  let secretCashGain = 0;
  let nextShadow = { ...g.shadowSyndicate };
  if (nextShadow && nextShadow.active) {
    const racketEarnings = nextShadow.rackets.filter(r => r.active).reduce((sum, r) => sum + r.incomeQuarterlyMio, 0);
    const bossCut = racketEarnings * 0.2;
    const netIllicitMrd = (racketEarnings - bossCut) / 1000;
    secretCashGain = netIllicitMrd;
    
    // Suspicion fluctuates with rackets & investigation
    let newSuspicion = nextShadow.suspicionLevel + (racketEarnings > 100 ? 3 : 1) - (g.fearIndex > 50 ? 2 : 0);
    newSuspicion = Math.max(5, Math.min(95, newSuspicion));
    let newInvest = nextShadow.investigationPressure + (newSuspicion > 50 ? 4 : -2);
    newInvest = Math.max(0, Math.min(100, newInvest));

    nextShadow = {
      ...nextShadow,
      offshoreAccountsMrd: Number((nextShadow.offshoreAccountsMrd + netIllicitMrd).toFixed(2)),
      suspicionLevel: newSuspicion,
      investigationPressure: newInvest
    };
  }

  // 12. Unrest, Popular Approval, and Stability
  const welfareStabilityBoost = (g.welfarePackages || []).filter(w => w.active).reduce((sum, w) => sum + w.stabilityBoost, 0);
  const welfareUnrestDrop = (g.welfarePackages || []).filter(w => w.active).reduce((sum, w) => sum + w.unrestReduction, 0);

  let unrestDelta = (nextUnemployment > 7 ? 2 : -1) + (nextInflation > 6 ? 3 : -1) + lawUnrestBonus + resourceDeficitSpike - Math.round(welfareUnrestDrop * 0.3);
  if (g.stability < 40) unrestDelta += 2;
  const nextUnrest = Math.max(0, Math.min(100, g.unrest + unrestDelta));

  let approvalDelta = (nextGdpGrowth > 2.5 ? 2 : -2) - (nextUnemployment > 6 ? 3 : 0) + lawApprovalBonus + Math.round(welfareStabilityBoost * 0.2);
  if (nextUnrest > 40) approvalDelta -= 3;
  const nextPopularity = Math.max(0, Math.min(100, g.ruler.popularity + approvalDelta));

  const avgFactionLoyalty = (g.factions.military + g.factions.oligarchs + g.factions.commonWorkers + g.factions.clergy + g.factions.bureaucracy) / 5;
  const targetStability = (avgFactionLoyalty * 0.65) + (g.ruler.legitimacy * 0.3) - (nextUnrest * 0.35) + (g.fearIndex * 0.15) + (welfareStabilityBoost * 0.25);
  const nextStability = Math.max(0, Math.min(100, Math.round(targetStability)));

  // 13. Election Check
  let nextElectionYear = g.nextElectionYear;
  let termsServed = g.termsServed;
  let gameOverState = g.gameOver;

  if (g.governmentType === 'presidential_democracy' || g.governmentType === 'parliamentary_democracy') {
    if (g.nextElectionYear !== null && nextYear >= g.nextElectionYear && nextQuarter === 4) {
      if (nextPopularity >= 48) {
        termsServed += 1;
        if (g.maxTerms > 0 && termsServed > g.maxTerms) {
          gameOverState = {
            isOver: true,
            reason: `Verfassungsmäßige Amtszeitbeschränkung erreicht. Sie scheiden nach einer triumphalen Präsidentschaft von ${g.ruler.reignYears} Jahren in Würde aus.`,
            victory: true
          };
        } else {
          nextElectionYear = nextYear + g.termLength;
          g.historyLog.unshift({
            year: nextYear,
            quarter: nextQuarter,
            text: `WAHLSIEG: Sie wurden mit ${Math.round(nextPopularity)}% Wählerzustimmung für eine weitere Amtszeit bestätigt!`,
            type: 'positive'
          });
        }
      } else {
        gameOverState = {
          isOver: true,
          reason: `Abwahl: Die Nation hat Ihre Regierung mit nur ${Math.round(nextPopularity)}% Wählerzustimmung in den demokratischen Parlaments- und Präsidentschaftswahlen abgewählt.`,
          victory: false
        };
      }
    }
  }

  // 14. Coup and Collapse Game Over checks
  if (!gameOverState) {
    if (g.factions.military < 15 && nextUnrest > 65) {
      gameOverState = {
        isOver: true,
        reason: 'MILITÄRPUTSCH: Der Generalstab hat den Regierungspalast mit Panzern umstellt und die supreme Staatsgewalt übernommen.',
        victory: false
      };
    } else if (nextUnrest >= 92 && nextStability <= 12) {
      gameOverState = {
        isOver: true,
        reason: 'VOLKSREVOLUTION: Millionen Bürger stürmten das Regierungsviertel. Das Regime ist inmitten von Generalstreiks kollabiert.',
        victory: false
      };
    } else if (nextDebt > nextGdp * 3.5 && nextRating === 'D') {
      gameOverState = {
        isOver: true,
        reason: 'STAATSBANKROTT: Die Staatskasse ist zahlungsunfähig und internationale Gläubiger haben das Land unter Zwangsverwaltung gestellt.',
        victory: false
      };
    } else if (nextShadow && nextShadow.investigationPressure >= 95 && g.playMode === 'shadow_president') {
      gameOverState = {
        isOver: true,
        reason: 'STAATSANWALTSCHAFT & VERHAFTUNG: Die Bundespolizei und internationale Gerichte deckten Ihr Schattenimperium auf. Sie wurden im Palast festgenommen.',
        victory: false
      };
    } else if (g.ruler.reignYears >= 30 && nextStability >= 75) {
      gameOverState = {
        isOver: true,
        reason: 'GOLDENES ZEITALTER: Sie regierten 30 herausragende Jahre lang und hinterlassen eine blühende, stabile Weltmacht!',
        victory: true
      };
    }
  }

  // 15. Demografische Entwicklung pro Quartal
  const popGrowthFactor = 1 + (g.population.growthRate / 400);
  const nextPopTotal = Number((g.population.total * popGrowthFactor).toFixed(2));
  const nextPopulation = {
    ...g.population,
    total: nextPopTotal,
    hdiIndex: Math.min(0.999, Math.max(0.3, g.population.hdiIndex + (nextStability > 60 ? 0.001 : -0.001)))
  };

  // 16. Random Dilemma Trigger
  let nextDilemma: DilemmaEvent | null = g.activeDilemma;
  if (!nextDilemma && Math.random() < 0.38 && DILEMMA_EVENTS.length > 0) {
    const randomIdx = Math.floor(Math.random() * DILEMMA_EVENTS.length);
    nextDilemma = DILEMMA_EVENTS[randomIdx];
  }

  // 17. Private President Wealth Update
  const presidentPrivateBusinessesProfit = (g.ruler.privateBusinesses || []).reduce((sum, b) => sum + (b.quarterlyProfitMio / 1000), 0); // in Mrd
  const luxuryUpkeep = (g.ruler.luxuryAssets || []).filter(l => l.purchased).reduce((sum, l) => sum + (l.upkeepQuarterlyMio / 1000), 0);
  const netPrivateCashFlow = presidentPrivateBusinessesProfit + totalDividendToPresident - luxuryUpkeep;
  const nextPresidentSlushFund = Math.max(0.1, Number((g.ruler.slushFund + netPrivateCashFlow).toFixed(3)));
  const nextSecretSlushFund = Number((g.ruler.secretSlushFund + secretCashGain).toFixed(3));

  const summary: QuarterlySummary = {
    revenueTotal,
    taxBreakdown: {
      income: incomeTaxRev,
      corporate: corpTaxRev,
      vat: vatTaxRev,
      fuel: fuelTaxRev,
      inheritance: inheritanceTaxRev,
      luxury: 0,
      resources: 0,
      financial: 0
    },
    enterpriseProfits,
    armsExportRevenue: armsExportRev,
    expenditureTotal,
    militaryUpkeep,
    infrastructureUpkeep,
    cabinetBudgetsTotal,
    welfareExpenditure,
    debtRepaymentMade,
    lawExpenditures,
    debtInterest,
    netQuarterlyBalance,
    gdpDelta: nextGdp - g.macro.gdp,
    unrestDelta,
    approvalDelta
  };

  const nextHistory = [...g.historyLog];
  if (Math.abs(netQuarterlyBalance) > 50) {
    nextHistory.unshift({
      year: nextYear,
      quarter: nextQuarter,
      text: netQuarterlyBalance >= 0 
        ? `Haushaltsüberschuss von ${g.currencySymbol}${netQuarterlyBalance.toFixed(1)} Mrd. in Q${nextQuarter} verbucht.`
        : `Haushaltsdefizit von ${g.currencySymbol}${Math.abs(netQuarterlyBalance).toFixed(1)} Mrd. über Staatsanleihen refinanziert.`,
      type: netQuarterlyBalance >= 0 ? 'positive' : 'warning'
    });
  }

  const nextState: GameState = {
    ...g,
    year: nextYear,
    quarter: nextQuarter,
    termsServed,
    nextElectionYear,
    stability: nextStability,
    unrest: nextUnrest,
    population: nextPopulation,
    ruler: {
      ...g.ruler,
      popularity: nextPopularity,
      slushFund: nextPresidentSlushFund,
      secretSlushFund: nextSecretSlushFund
    },
    cabinet: nextCabinet,
    stocks: nextStocks,
    pensionSystem: nextPensionSystem,
    shadowSyndicate: nextShadow,
    macro: {
      ...g.macro,
      gdp: Number(nextGdp.toFixed(1)),
      gdpGrowthRate: Number(nextGdpGrowth.toFixed(2)),
      inflationRate: Number(nextInflation.toFixed(1)),
      nationalDebt: Number(nextDebt.toFixed(1)),
      unemploymentRate: Number(nextUnemployment.toFixed(1)),
      creditRating: nextRating,
      treasury: Number(nextTreasury.toFixed(1))
    },
    resources: nextResources,
    foreignLoans: nextForeignLoans,
    foreignInvestments: nextForeignInvestments,
    activeReparations: nextActiveReparations,
    covertOps: nextCovertOps,
    activeDilemma: nextDilemma,
    historyLog: nextHistory.slice(0, 30),
    gameOver: gameOverState
  };

  return { nextState, summary };
}
