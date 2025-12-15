import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

interface AgentResponse {
  role: string;
  content: string;
}

interface BrainstormRequest {
  companyName: string;
}

async function callAI(systemPrompt: string, userMessage: string, model = "google/gemini-2.5-flash", retries = 2): Promise<string> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`AI API error (attempt ${attempt + 1}): ${response.status} - ${errorText}`);
        if (attempt === retries) throw new Error(`AI API error: ${response.status}`);
        continue;
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error(`Error in AI call (attempt ${attempt + 1}):`, error);
      if (attempt === retries) throw error;
    }
  }
  throw new Error("All retry attempts failed");
}

function parseAIJson(response: string, agentName: string): any {
  let cleaned = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  cleaned = cleaned.replace(/,(\s*[}\]])/g, "$1");

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error(`${agentName} - Failed to parse JSON:`, e);
    console.log(`${agentName} - Cleaned response (first 1000 chars):`, cleaned.substring(0, 1000));
    throw new Error(`Failed to parse ${agentName} response as JSON`);
  }
}

async function profilerAgent(companyName: string): Promise<AgentResponse> {
  const systemPrompt = `Du är en senior research-analytiker och varumärkesdetektiv. Du ska "fatta" vilket företag det är baserat ENBART på företagsnamnet.

Skriv på svenska.
Returnera ENDAST valid JSON utan markdown.

Returnera:
{
  "company": {
    "companyName": "...",
    "inferredIndustry": "...",
    "companyType": "startup|sme|midmarket|enterprise",
    "whatTheyLikelyDo": "...",
    "whyThisInference": ["..."],
    "assumptions": ["..."],
    "missingData": ["..."]
  }
}

Regler:
- Var tydlig med osäkerhet och antaganden.
- Om du inte känner igen bolaget: gör en rimlig hypotetisk profil baserad på namn/kontext.
- companyType måste vara exakt en av: startup, sme, midmarket, enterprise.`;

  const userMessage = `Företagsnamn: ${companyName}`;
  const content = await callAI(systemPrompt, userMessage, "google/gemini-2.5-pro");
  return { role: "Company Profiler Agent", content };
}

async function divergentBrainstormAgent(profileJson: string): Promise<AgentResponse> {
  const systemPrompt = `Du är en extremt kreativ AI-strateg. Du ska skapa out-of-the-box AI-idéer som känns som att "ingen har tänkt på dem".

Skriv på svenska.
Returnera ENDAST valid JSON utan markdown.

Du brainstormar som ett team av flera agenter i ditt huvud och varje idé ska vara:
- kontraintuitiv men genomförbar
- tydligt kopplad till affärsvärde
- innehålla en ny mekanism (inte bara "chatbot"/"RAG"/"dashboard")

Returnera exakt 10 idéer:
{
  "ideas": [
    {
      "id": "idea-1",
      "title": "...",
      "oneLiner": "...",
      "novelMechanism": "Vad är den nya mekanismen?",
      "howItWorks": ["...", "..."],
      "dataSignals": ["Vilka signaler/data behövs?"],
      "mvpInWeeks": 2,
      "team": ["Roll 1", "Roll 2"],
      "canDoInHouse": true,
      "keyRisks": ["..."],
      "firstExperiment": "Exakt första testet (1-2 veckor)"
    }
  ]
}

Regler:
- mvpInWeeks måste vara ett heltal 1-12
- canDoInHouse måste vara boolean
- howItWorks måste vara en lista med 3-6 punkter
- Hög kreativitet utan sci-fi: det måste gå att bygga med dagens teknik.`;

  const userMessage = `Här är företagsprofilen (JSON). Generera idéerna baserat på den:\n\n${profileJson}`;
  const content = await callAI(systemPrompt, userMessage, "google/gemini-2.5-pro");
  return { role: "Divergent Brainstorm Agent", content };
}

async function criticAgent(profileJson: string, ideasJson: string): Promise<AgentResponse> {
  const systemPrompt = `Du är en krävande partner (konsult) och "kill your darlings"-kritiker. Du ska välja de 5 starkaste idéerna och förbättra dem.

Skriv på svenska.
Returnera ENDAST valid JSON utan markdown.

Returnera:
{
  "topIdeas": [
    {
      "id": "...",
      "title": "...",
      "whyThisWins": ["..."],
      "whatToDeRiskFirst": ["..."],
      "mvpPlan": ["Dag 1-2: ...", "Vecka 1: ...", "Vecka 2: ..."],
      "kpis": ["..."],
      "antiPatternsToAvoid": ["..."],
      "promptToStartCoding": "En kort prompt som en utvecklare kan klistra in i en AI för att börja bygga"
    }
  ]
}

Regler:
- Returnera exakt 5 topIdeas
- Var brutalt konkret (ingen fluff)
- promptToStartCoding ska vara 5-12 rader med tydliga instruktioner.`;

  const userMessage = `Företagsprofil:\n${profileJson}\n\nIdéer:\n${ideasJson}`;
  const content = await callAI(systemPrompt, userMessage, "google/gemini-2.5-pro");
  return { role: "Synthesis & Critic Agent", content };
}

async function roundtableChatAgent(profileJson: string, ideasJson: string, topIdeasJson: string): Promise<AgentResponse> {
  const systemPrompt = `Du ska simulera en intern brainstorming där flera AI-agenter chattar med varandra.

Skriv på svenska.
Returnera ENDAST valid JSON utan markdown.

Roller i chatten:
- "Strateg" (affärsvärde, prioritering)
- "Engineer" (hur man bygger, begränsningar)
- "Skeptic" (risker, vad som kan gå fel)
- "Domain" (branschrealism, kundvärde)

Returnera:
{
  "messages": [
    {"role": "Strateg", "content": "..."},
    {"role": "Engineer", "content": "..."}
  ],
  "highlights": ["...", "...", "..."]
}

Regler:
- Skapa 10-16 meddelanden totalt
- Var out-of-the-box men konkret
- Referera till 2-3 idéer från input och hur ni skulle testa dem i praktiken
- Inga priser eller säljsnack, bara planering och resonemang.`;

  const userMessage = `Här är underlag:\n\nFöretagsprofil:\n${profileJson}\n\nIdéer:\n${ideasJson}\n\nTop 5:\n${topIdeasJson}\n\nSimulera chatten.`;
  const content = await callAI(systemPrompt, userMessage, "google/gemini-2.5-pro");
  return { role: "Agent Roundtable", content };
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { companyName } = (await req.json()) as BrainstormRequest;

    if (!companyName || !companyName.trim()) {
      return new Response(JSON.stringify({ error: "companyName is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const profiler = await profilerAgent(companyName.trim());
    const profileData = parseAIJson(profiler.content, "Company Profiler Agent");

    const divergent = await divergentBrainstormAgent(profiler.content);
    const ideasData = parseAIJson(divergent.content, "Divergent Brainstorm Agent");

    const critic = await criticAgent(profiler.content, divergent.content);
    const topData = parseAIJson(critic.content, "Synthesis & Critic Agent");

    const roundtable = await roundtableChatAgent(profiler.content, divergent.content, critic.content);
    const chatData = parseAIJson(roundtable.content, "Agent Roundtable");

    const result = {
      company: profileData.company,
      ideas: ideasData.ideas || [],
      topIdeas: topData.topIdeas || [],
      agentChat: chatData.messages || [],
      chatHighlights: chatData.highlights || [],
      generatedAt: new Date().toISOString(),
      agentConversation: [profiler, divergent, critic, roundtable],
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in brainstorm-outofbox function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: "Ett fel uppstod vid brainstorm. Försök igen.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
