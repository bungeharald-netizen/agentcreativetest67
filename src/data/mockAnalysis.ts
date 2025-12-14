import { AnalysisResult, CompanyInput } from "@/types/analysis";

export function generateMockAnalysis(input: CompanyInput): AnalysisResult {
  const industryData: Record<string, { suggestions: any[]; roiMultiplier: number }> = {
    retail: {
      roiMultiplier: 1.4,
      suggestions: [
        {
          id: "1",
          category: "generative" as const,
          title: "AI-driven produktbeskrivningsgenerering",
          description: "Automatisera skapandet av produktbeskrivningar, SEO-optimerad text och marknadsföringsmaterial med generativ AI.",
          useCases: [
            "Automatisk produktbeskrivning för e-handel",
            "Personaliserade mejlkampanjer",
            "Sociala medier-innehåll på skala",
          ],
          estimatedROI: { percentage: 45, timeframe: "12 månader", confidence: "high" as const },
          implementationComplexity: "low" as const,
          priority: "quick-win" as const,
        },
        {
          id: "2",
          category: "agentic" as const,
          title: "Intelligent kundtjänst-agent",
          description: "Deploy en AI-agent som autonomt hanterar kundärenden, från orderförfrågningar till returer och klagomål.",
          useCases: [
            "24/7 kundsupport utan bemanning",
            "Automatisk orderhantering och uppföljning",
            "Proaktiv kundkontakt vid leveransförseningar",
          ],
          estimatedROI: { percentage: 60, timeframe: "18 månader", confidence: "high" as const },
          implementationComplexity: "medium" as const,
          priority: "strategic" as const,
        },
        {
          id: "3",
          category: "analytics" as const,
          title: "Prediktiv lageroptimering",
          description: "Använd AI för att förutse efterfrågan och optimera lagernivåer, minska svinn och förbättra kapitalbindning.",
          useCases: [
            "Automatisk beställningspunkt-beräkning",
            "Säsongsbaserad efterfrågeprognos",
            "Identifiering av produkter med hög risk för inkurans",
          ],
          estimatedROI: { percentage: 35, timeframe: "12 månader", confidence: "medium" as const },
          implementationComplexity: "medium" as const,
          priority: "strategic" as const,
        },
      ],
    },
    finance: {
      roiMultiplier: 1.6,
      suggestions: [
        {
          id: "1",
          category: "agentic" as const,
          title: "Automatiserad regelefterlevnad (Compliance Agent)",
          description: "AI-agent som kontinuerligt övervakar transaktioner och dokument för att säkerställa regelefterlevnad och flagga avvikelser.",
          useCases: [
            "Anti-money laundering (AML) screening",
            "Know Your Customer (KYC) automatisering",
            "Rapportgenerering för tillsynsmyndigheter",
          ],
          estimatedROI: { percentage: 50, timeframe: "12 månader", confidence: "high" as const },
          implementationComplexity: "high" as const,
          priority: "strategic" as const,
        },
        {
          id: "2",
          category: "automation" as const,
          title: "Intelligent dokumentbearbetning",
          description: "Automatisera extraktion och validering av data från finansiella dokument som fakturor, kontrakt och ansökningar.",
          useCases: [
            "Automatisk fakturahantering",
            "Kreditansökningsprocessering",
            "Kontraktsanalys och nyckelordextraktion",
          ],
          estimatedROI: { percentage: 40, timeframe: "9 månader", confidence: "high" as const },
          implementationComplexity: "low" as const,
          priority: "quick-win" as const,
        },
        {
          id: "3",
          category: "analytics" as const,
          title: "Riskprediktionsmodell",
          description: "Implementera ML-modeller för att förutse kreditrisk, bedrägerier och marknadsrörelser.",
          useCases: [
            "Kreditbeslutsstöd i realtid",
            "Anomalidetektering för bedrägeribekämpning",
            "Portföljriskanalys",
          ],
          estimatedROI: { percentage: 55, timeframe: "18 månader", confidence: "medium" as const },
          implementationComplexity: "high" as const,
          priority: "long-term" as const,
        },
      ],
    },
    default: {
      roiMultiplier: 1.2,
      suggestions: [
        {
          id: "1",
          category: "generative" as const,
          title: "AI-assisterad innehållsproduktion",
          description: "Använd generativ AI för att skapa rapporter, dokumentation och kommunikationsmaterial snabbare.",
          useCases: [
            "Automatisk rapportgenerering",
            "Mötessammanfattningar och action points",
            "Internkommunikation och nyhetsbrev",
          ],
          estimatedROI: { percentage: 30, timeframe: "6 månader", confidence: "high" as const },
          implementationComplexity: "low" as const,
          priority: "quick-win" as const,
        },
        {
          id: "2",
          category: "automation" as const,
          title: "Processautomation med AI",
          description: "Identifiera och automatisera repetitiva arbetsflöden för att frigöra tid till värdeskapande aktiviteter.",
          useCases: [
            "E-posthantering och routing",
            "Dataregistrering och validering",
            "Schemaläggning och resursallokering",
          ],
          estimatedROI: { percentage: 40, timeframe: "12 månader", confidence: "medium" as const },
          implementationComplexity: "medium" as const,
          priority: "strategic" as const,
        },
        {
          id: "3",
          category: "agentic" as const,
          title: "Intern AI-assistent",
          description: "Implementera en företagsanpassad AI-assistent som hjälper medarbetare med vanliga frågor och uppgifter.",
          useCases: [
            "HR-relaterade frågor och policys",
            "IT-support och felsökning",
            "Onboarding av nyanställda",
          ],
          estimatedROI: { percentage: 25, timeframe: "9 månader", confidence: "medium" as const },
          implementationComplexity: "medium" as const,
          priority: "strategic" as const,
        },
      ],
    },
  };

  const industryConfig = industryData[input.industry] || industryData.default;

  const actionPlan = [
    {
      id: "phase-1",
      name: "Förstudie & Planering",
      duration: "2-3 veckor",
      tasks: [
        {
          id: "t1",
          title: "Intressentanalys och workshops",
          description: "Genomför workshops med nyckelintressenter för att kartlägga behov och förväntningar.",
          responsible: "Projektledare + Affärsanalytiker",
          duration: "1 vecka",
          dependencies: [],
          status: "pending" as const,
        },
        {
          id: "t2",
          title: "Datainventering",
          description: "Kartlägg tillgänglig data, datakvalitet och systemlandskap.",
          responsible: "Data Engineer",
          duration: "1 vecka",
          dependencies: [],
          status: "pending" as const,
        },
        {
          id: "t3",
          title: "ROI-validering och business case",
          description: "Fördjupa ROI-analysen med företagsspecifika siffror och skapa beslutsunderlag.",
          responsible: "Affärsanalytiker",
          duration: "1 vecka",
          dependencies: ["t1", "t2"],
          status: "pending" as const,
        },
      ],
      milestones: ["Go/No-go beslut", "Godkänd projektplan"],
      deliverables: ["Förstudierapport", "Detaljerad projektplan", "Riskanalys"],
    },
    {
      id: "phase-2",
      name: "Proof of Concept (PoC)",
      duration: "4-6 veckor",
      tasks: [
        {
          id: "t4",
          title: "Teknisk arkitekturdesign",
          description: "Designa systemarkitektur, integrationer och säkerhetsramverk.",
          responsible: "Lösningsarkitekt",
          duration: "1 vecka",
          dependencies: [],
          status: "pending" as const,
        },
        {
          id: "t5",
          title: "Utveckling av MVP",
          description: "Bygg en minimal viable product för det prioriterade användningsfallet.",
          responsible: "Utvecklingsteam",
          duration: "3 veckor",
          dependencies: ["t4"],
          status: "pending" as const,
        },
        {
          id: "t6",
          title: "Användartest och feedback",
          description: "Testa PoC med utvalda användare och samla in feedback.",
          responsible: "UX Designer + Testledare",
          duration: "1 vecka",
          dependencies: ["t5"],
          status: "pending" as const,
        },
      ],
      milestones: ["PoC-demo", "Godkänd teknisk validering"],
      deliverables: ["Fungerande PoC", "Teknisk dokumentation", "Feedbackrapport"],
    },
    {
      id: "phase-3",
      name: "Pilot & Skalning",
      duration: "6-8 veckor",
      tasks: [
        {
          id: "t7",
          title: "Produktionsförberedelse",
          description: "Förbered infrastruktur, säkerhet och övervakningssystem för produktionsmiljö.",
          responsible: "DevOps + Säkerhetsteam",
          duration: "2 veckor",
          dependencies: [],
          status: "pending" as const,
        },
        {
          id: "t8",
          title: "Pilotdriftsättning",
          description: "Rulla ut lösningen till ett begränsat antal användare/avdelningar.",
          responsible: "Projektledare + Utvecklingsteam",
          duration: "2 veckor",
          dependencies: ["t7"],
          status: "pending" as const,
        },
        {
          id: "t9",
          title: "Utbildning och change management",
          description: "Utbilda slutanvändare och implementera change management-program.",
          responsible: "Change Manager + HR",
          duration: "2 veckor",
          dependencies: ["t8"],
          status: "pending" as const,
        },
        {
          id: "t10",
          title: "Full utrullning",
          description: "Expandera lösningen till hela organisationen.",
          responsible: "Projektledare",
          duration: "2 veckor",
          dependencies: ["t9"],
          status: "pending" as const,
        },
      ],
      milestones: ["Pilot avslutad", "Full utrullning klar"],
      deliverables: ["Produktionssystem", "Utbildningsmaterial", "Driftdokumentation"],
    },
    {
      id: "phase-4",
      name: "Optimering & Kontinuerlig förbättring",
      duration: "Löpande",
      tasks: [
        {
          id: "t11",
          title: "KPI-uppföljning",
          description: "Mät och rapportera nyckeltal för att verifiera ROI.",
          responsible: "Business Analyst",
          duration: "Löpande",
          dependencies: [],
          status: "pending" as const,
        },
        {
          id: "t12",
          title: "Modelloptimering",
          description: "Kontinuerligt förbättra AI-modeller baserat på produktionsdata.",
          responsible: "ML Engineer",
          duration: "Löpande",
          dependencies: ["t11"],
          status: "pending" as const,
        },
      ],
      milestones: ["Första kvartalsrapport", "ROI-verifiering"],
      deliverables: ["Månadsrapporter", "Optimeringsplan"],
    },
  ];

  const baseInvestment = input.companyType === "enterprise" ? 2000000 : 
                         input.companyType === "midmarket" ? 800000 :
                         input.companyType === "sme" ? 350000 : 150000;

  const roiEstimate = {
    totalInvestment: baseInvestment,
    yearOneReturns: Math.round(baseInvestment * industryConfig.roiMultiplier),
    yearThreeReturns: Math.round(baseInvestment * industryConfig.roiMultiplier * 2.5),
    breakEvenMonths: Math.round(12 / industryConfig.roiMultiplier),
    costSavings: [
      { category: "Minskade personalkostnader", amount: Math.round(baseInvestment * 0.3), description: "Automation av repetitiva uppgifter" },
      { category: "Effektivare processer", amount: Math.round(baseInvestment * 0.2), description: "Snabbare genomloppstider och färre fel" },
      { category: "Reducerad kundtjänst", amount: Math.round(baseInvestment * 0.15), description: "AI-driven självbetjäning" },
    ],
    revenueIncrease: [
      { category: "Ökad försäljning", amount: Math.round(baseInvestment * 0.35), description: "Personalisering och bättre kundupplevelse" },
      { category: "Nya affärsmöjligheter", amount: Math.round(baseInvestment * 0.2), description: "Datadrivna insikter och nya tjänster" },
    ],
    confidenceLevel: "medium" as const,
    assumptions: [
      "Baserat på branschgenomsnitt för liknande AI-implementeringar",
      "Förutsätter tillgång till kvalitativ träningsdata",
      "Inkluderar inte kostnader för organisationsförändring",
      "ROI kan variera beroende på implementeringsframgång",
    ],
  };

  return {
    company: input,
    companyInfo: {
      found: true,
      details: `${input.companyName} är ett ${input.companyType === 'enterprise' ? 'storföretag' : input.companyType === 'midmarket' ? 'medelstort företag' : input.companyType === 'sme' ? 'småföretag' : 'startup'} verksamt inom ${getIndustryLabel(input.industry)}.`,
      industry: getIndustryLabel(input.industry),
      size: input.companyType,
      dataQuality: input.challenges && input.goals ? "partial" : "limited",
      missingData: !input.currentProcesses ? ["Detaljerad systeminformation", "Nuvarande IT-landskap"] : [],
    },
    suggestions: industryConfig.suggestions,
    actionPlan,
    roiEstimate,
    generatedAt: new Date(),
  };
}

function getIndustryLabel(industry: string): string {
  const labels: Record<string, string> = {
    retail: "Detaljhandel & E-handel",
    finance: "Bank & Finans",
    healthcare: "Hälso- & Sjukvård",
    manufacturing: "Tillverkning & Industri",
    technology: "Teknik & IT",
    consulting: "Konsulting & Tjänster",
    logistics: "Logistik & Transport",
    media: "Media & Underhållning",
    education: "Utbildning",
    "real-estate": "Fastigheter",
    other: "Annat",
  };
  return labels[industry] || industry;
}
