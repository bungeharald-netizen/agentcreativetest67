import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

interface CompanyInput {
  companyType: string;
  companyName: string;
  industry: string;
  challenges: string;
  goals: string;
  currentProcesses: string;
}

interface AgentResponse {
  role: string;
  content: string;
}

// Helper function to call AI
async function callAI(systemPrompt: string, userMessage: string, model = "google/gemini-2.5-flash"): Promise<string> {
  console.log(`Calling AI with model: ${model}`);
  
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
        { role: "user", content: userMessage }
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`AI API error: ${response.status} - ${errorText}`);
    throw new Error(`AI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Agent 1: Research Agent - Gathers information about the company
async function researchAgent(input: CompanyInput): Promise<AgentResponse> {
  console.log("Research Agent starting...");
  
  const systemPrompt = `Du är en erfaren affärsanalytiker på en AI-konsultfirma. Din uppgift är att analysera företag och sammanställa relevant information.

VIKTIGT: 
- Basera din analys på den information som ges
- Om information saknas, notera detta tydligt
- Var konkret och affärsinriktad
- Skriv på svenska

Returnera en strukturerad analys i JSON-format med följande struktur:
{
  "companyProfile": "Kort beskrivning av företaget",
  "industryContext": "Branschens nuläge och trender",
  "identifiedChallenges": ["utmaning1", "utmaning2"],
  "opportunityAreas": ["område1", "område2"],
  "dataQuality": "complete" | "partial" | "limited",
  "missingData": ["saknad info1", "saknad info2"]
}`;

  const userMessage = `Analysera följande företag:
Företagsnamn: ${input.companyName}
Företagstyp: ${input.companyType}
Bransch: ${input.industry}
Utmaningar: ${input.challenges || "Ej specificerat"}
Mål: ${input.goals || "Ej specificerat"}
Nuvarande processer: ${input.currentProcesses || "Ej specificerat"}`;

  const response = await callAI(systemPrompt, userMessage);
  console.log("Research Agent completed");
  
  return { role: "Research Agent", content: response };
}

// Agent 2: Creative AI Solutions Agent - Brainstorms AI solutions
async function creativeSolutionsAgent(input: CompanyInput, researchData: string): Promise<AgentResponse> {
  console.log("Creative Solutions Agent starting...");
  
  const systemPrompt = `Du är en kreativ AI-strateg på en ledande AI-konsultfirma. Din uppgift är att föreslå innovativa AI-lösningar.

FOKUSERA PÅ:
- Generativ AI (innehållsskapande, automatisering av text/bild)
- Agentisk AI (autonoma system som agerar självständigt)
- Prediktiv analys och ML
- Processautomation med AI

VIKTIGT:
- Varje förslag ska vara konkret och genomförbart
- Inkludera uppskattad ROI baserat på branschdata
- Prioritera "quick wins" och strategiska initiativ
- Skriv på svenska

Returnera exakt 4-5 AI-förslag i JSON-format:
{
  "suggestions": [
    {
      "id": "unik-id",
      "category": "generative" | "agentic" | "automation" | "analytics",
      "title": "Titel på lösning",
      "description": "Detaljerad beskrivning",
      "useCases": ["användning1", "användning2", "användning3"],
      "estimatedROI": {
        "percentage": 30-80,
        "timeframe": "6-24 månader",
        "confidence": "low" | "medium" | "high"
      },
      "implementationComplexity": "low" | "medium" | "high",
      "priority": "quick-win" | "strategic" | "long-term"
    }
  ]
}`;

  const userMessage = `Baserat på följande företagsanalys, föreslå kreativa AI-lösningar:

FÖRETAGSINFORMATION:
Namn: ${input.companyName}
Typ: ${input.companyType}
Bransch: ${input.industry}
Utmaningar: ${input.challenges || "Ej specificerat"}
Mål: ${input.goals || "Ej specificerat"}

RESEARCH DATA:
${researchData}

Generera 4-5 konkreta AI-lösningar som skulle ge störst affärsvärde för detta företag.`;

  const response = await callAI(systemPrompt, userMessage, "google/gemini-2.5-pro");
  console.log("Creative Solutions Agent completed");
  
  return { role: "Creative Solutions Agent", content: response };
}

// Agent 3: Project Manager Agent - Creates action plan
async function projectManagerAgent(input: CompanyInput, solutions: string): Promise<AgentResponse> {
  console.log("Project Manager Agent starting...");
  
  const systemPrompt = `Du är en senior projektledare på en AI-konsultfirma med expertis inom PMBOK, PRINCE2 och agila metoder.

DIN UPPGIFT:
Skapa en detaljerad implementeringsplan för AI-lösningarna.

STRUKTURERA PLANEN I FASER:
1. Förstudie & Planering (2-3 veckor)
2. Proof of Concept (4-6 veckor)
3. Pilot & Skalning (6-8 veckor)
4. Optimering & Kontinuerlig förbättring (Löpande)

FÖR VARJE FAS, INKLUDERA:
- Konkreta uppgifter med ansvariga roller
- Tidsuppskattningar
- Milstolpar
- Leverabler

Skriv på svenska och returnera i JSON-format:
{
  "actionPlan": [
    {
      "id": "phase-1",
      "name": "Fasnamn",
      "duration": "X veckor",
      "tasks": [
        {
          "id": "t1",
          "title": "Uppgiftstitel",
          "description": "Beskrivning",
          "responsible": "Roll/Team",
          "duration": "X dagar/veckor",
          "dependencies": [],
          "status": "pending"
        }
      ],
      "milestones": ["milstolpe1"],
      "deliverables": ["leverabel1"]
    }
  ]
}`;

  const userMessage = `Skapa en implementeringsplan för följande AI-lösningar hos ${input.companyName}:

LÖSNINGAR ATT IMPLEMENTERA:
${solutions}

FÖRETAGSKONTEXT:
Typ: ${input.companyType}
Bransch: ${input.industry}`;

  const response = await callAI(systemPrompt, userMessage);
  console.log("Project Manager Agent completed");
  
  return { role: "Project Manager Agent", content: response };
}

// Agent 4: Financial Analyst Agent - Calculates ROI
async function financialAnalystAgent(input: CompanyInput, solutions: string, actionPlan: string): Promise<AgentResponse> {
  console.log("Financial Analyst Agent starting...");
  
  const systemPrompt = `Du är en finansanalytiker specialiserad på AI-investeringar och ROI-beräkningar.

DIN UPPGIFT:
Beräkna detaljerad ROI för AI-implementeringen.

BASERA INVESTERINGSBELOPP PÅ FÖRETAGSTYP:
- Startup: 100,000 - 200,000 SEK
- Småföretag (SME): 300,000 - 500,000 SEK  
- Medelstort: 700,000 - 1,200,000 SEK
- Storföretag: 1,500,000 - 3,000,000 SEK

INKLUDERA I ANALYSEN:
- Kostnadsbesparingar (personaleffektivisering, processoptimering, kundtjänst)
- Intäktsökning (försäljning, nya affärsmöjligheter)
- Break-even punkt
- Konfidensnivå med antaganden

Skriv på svenska och returnera i JSON-format:
{
  "roiEstimate": {
    "totalInvestment": 500000,
    "yearOneReturns": 750000,
    "yearThreeReturns": 2000000,
    "breakEvenMonths": 8,
    "costSavings": [
      {"category": "Kategori", "amount": 100000, "description": "Beskrivning"}
    ],
    "revenueIncrease": [
      {"category": "Kategori", "amount": 150000, "description": "Beskrivning"}
    ],
    "confidenceLevel": "medium",
    "assumptions": ["antagande1", "antagande2"]
  }
}`;

  const userMessage = `Beräkna ROI för AI-implementation hos ${input.companyName}:

FÖRETAGSTYP: ${input.companyType}
BRANSCH: ${input.industry}

FÖRESLAGNA LÖSNINGAR:
${solutions}

IMPLEMENTERINGSPLAN:
${actionPlan}`;

  const response = await callAI(systemPrompt, userMessage);
  console.log("Financial Analyst Agent completed");
  
  return { role: "Financial Analyst Agent", content: response };
}

// Parse JSON from AI response (handles markdown code blocks)
function parseAIJson(response: string): any {
  // Remove markdown code blocks if present
  let cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    console.log("Raw response:", response);
    throw new Error("Failed to parse AI response as JSON");
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyInput } = await req.json() as { companyInput: CompanyInput };
    
    console.log("Starting multi-agent analysis for:", companyInput.companyName);
    console.log("Company input:", JSON.stringify(companyInput));

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Step 1: Research Agent analyzes the company
    const researchResult = await researchAgent(companyInput);
    const researchData = parseAIJson(researchResult.content);
    console.log("Research data parsed successfully");

    // Step 2: Creative Solutions Agent brainstorms AI solutions
    const solutionsResult = await creativeSolutionsAgent(companyInput, researchResult.content);
    const solutionsData = parseAIJson(solutionsResult.content);
    console.log("Solutions data parsed successfully");

    // Step 3: Project Manager Agent creates action plan
    const planResult = await projectManagerAgent(companyInput, solutionsResult.content);
    const planData = parseAIJson(planResult.content);
    console.log("Plan data parsed successfully");

    // Step 4: Financial Analyst Agent calculates ROI
    const roiResult = await financialAnalystAgent(companyInput, solutionsResult.content, planResult.content);
    const roiData = parseAIJson(roiResult.content);
    console.log("ROI data parsed successfully");

    // Combine all results
    const analysis = {
      company: companyInput,
      companyInfo: {
        found: true,
        details: researchData.companyProfile,
        industry: companyInput.industry,
        size: companyInput.companyType,
        dataQuality: researchData.dataQuality || "partial",
        missingData: researchData.missingData || [],
      },
      suggestions: solutionsData.suggestions || [],
      actionPlan: planData.actionPlan || [],
      roiEstimate: roiData.roiEstimate || {},
      generatedAt: new Date().toISOString(),
      agentConversation: [
        researchResult,
        solutionsResult,
        planResult,
        roiResult,
      ],
    };

    console.log("Analysis complete, returning results");

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-company function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: "Ett fel uppstod vid AI-analysen. Försök igen."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
