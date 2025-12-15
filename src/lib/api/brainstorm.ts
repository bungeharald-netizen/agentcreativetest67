import { supabase } from "@/integrations/supabase/client";

export interface BrainstormOutOfBoxResult {
  company: {
    companyName: string;
    inferredIndustry: string;
    companyType: "startup" | "sme" | "midmarket" | "enterprise";
    whatTheyLikelyDo: string;
    whyThisInference: string[];
    assumptions: string[];
    missingData: string[];
  };
  agentChat?: Array<{ role: string; content: string }>;
  chatHighlights?: string[];
  ideas: Array<{
    id: string;
    title: string;
    oneLiner: string;
    novelMechanism: string;
    howItWorks: string[];
    dataSignals: string[];
    mvpInWeeks: number;
    team: string[];
    canDoInHouse: boolean;
    keyRisks: string[];
    firstExperiment: string;
  }>;
  topIdeas: Array<{
    id: string;
    title: string;
    whyThisWins: string[];
    whatToDeRiskFirst: string[];
    mvpPlan: string[];
    kpis: string[];
    antiPatternsToAvoid: string[];
    promptToStartCoding: string;
  }>;
  generatedAt: string;
  agentConversation: Array<{ role: string; content: string }>;
}

export async function brainstormOutOfBox(companyName: string): Promise<BrainstormOutOfBoxResult> {
  const { data, error } = await supabase.functions.invoke("brainstorm-outofbox", {
    body: { companyName },
  });

  if (error) {
    const msg = error.message || "Kunde inte genomföra brainstorm";
    if (msg.includes("Failed to send a request to the Edge Function")) {
      throw new Error(
        "Kunde inte nå Edge Function. Det betyder nästan alltid att funktionen 'brainstorm-outofbox' inte är deployad (eller att Supabase-projektet/nycklarna är fel). Deploya funktionen i Supabase och säkerställ att LOVABLE_API_KEY är satt i Supabase secrets, sedan starta om dev-servern."
      );
    }
    throw new Error(msg);
  }

  if (data?.error) {
    throw new Error(data.details || data.error);
  }

  return data as BrainstormOutOfBoxResult;
}
