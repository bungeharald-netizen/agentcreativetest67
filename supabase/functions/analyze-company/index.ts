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

// Helper function to call AI with retry logic
async function callAI(systemPrompt: string, userMessage: string, model = "google/gemini-2.5-flash", retries = 2): Promise<string> {
  console.log(`Calling AI with model: ${model}`);
  
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
            { role: "user", content: userMessage }
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

// Agent 1: Research Agent
async function researchAgent(input: CompanyInput): Promise<AgentResponse> {
  console.log("Research Agent starting...");
  
  const systemPrompt = `Du är en erfaren affärsanalytiker på en AI-konsultfirma. Din uppgift är att analysera företag och sammanställa relevant information.

VIKTIGT: 
- Basera din analys på den information som ges
- Om information saknas, notera detta tydligt
- Var konkret och affärsinriktad
- Skriv på svenska
- Returnera ENDAST valid JSON utan markdown-formatering

Returnera en strukturerad analys i JSON-format:
{
  "companyProfile": "Kort beskrivning av företaget",
  "industryContext": "Branschens nuläge och trender",
  "identifiedChallenges": ["utmaning1", "utmaning2"],
  "opportunityAreas": ["område1", "område2"],
  "dataQuality": "complete",
  "missingData": []
}

OBS: dataQuality ska vara exakt en av: "complete", "partial", "limited"`;

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

// Agent 2: Creative AI Solutions Agent
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
- ROI-procent ska vara ETT heltal (t.ex. 45), INTE ett intervall
- Skriv på svenska
- Returnera ENDAST valid JSON utan markdown-formatering

Returnera exakt 4-5 AI-förslag i detta JSON-format:
{
  "suggestions": [
    {
      "id": "suggestion-1",
      "category": "generative",
      "title": "Titel på lösning",
      "description": "Detaljerad beskrivning av lösningen",
      "useCases": ["användning1", "användning2", "användning3"],
      "estimatedROI": {
        "percentage": 45,
        "timeframe": "12 månader",
        "confidence": "medium"
      },
      "implementationComplexity": "medium",
      "priority": "strategic"
    }
  ]
}

KRITISKA REGLER:
- "category" måste vara exakt en av: "generative", "agentic", "automation", "analytics"
- "percentage" måste vara ett ENSKILT heltal mellan 20 och 80
- "confidence" måste vara exakt: "low", "medium", eller "high"
- "implementationComplexity" måste vara exakt: "low", "medium", eller "high"
- "priority" måste vara exakt: "quick-win", "strategic", eller "long-term"`;

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

// Agent 3: Project Manager Agent
async function projectManagerAgent(input: CompanyInput, solutions: string): Promise<AgentResponse> {
  console.log("Project Manager Agent starting...");
  
  const systemPrompt = `Du är en senior projektledare på en AI-konsultfirma med expertis inom PMBOK, PRINCE2 och agila metoder.

DIN UPPGIFT:
Skapa en detaljerad implementeringsplan för AI-lösningarna.

STRUKTURERA PLANEN I 4 FASER:
1. Förstudie & Planering (2-3 veckor)
2. Proof of Concept (4-6 veckor)
3. Pilot & Skalning (6-8 veckor)
4. Optimering & Kontinuerlig förbättring (Löpande)

Skriv på svenska och returnera ENDAST valid JSON utan markdown-formatering:
{
  "actionPlan": [
    {
      "id": "phase-1",
      "name": "Förstudie & Planering",
      "duration": "2-3 veckor",
      "tasks": [
        {
          "id": "t1",
          "title": "Uppgiftstitel",
          "description": "Beskrivning av uppgiften",
          "responsible": "Projektledare",
          "duration": "1 vecka",
          "dependencies": [],
          "status": "pending"
        }
      ],
      "milestones": ["Milstolpe 1"],
      "deliverables": ["Leverabel 1"]
    }
  ]
}

KRITISKT: 
- Skapa exakt 4 faser
- Varje fas ska ha 2-4 uppgifter
- "status" ska alltid vara "pending"`;

  const userMessage = `Skapa en implementeringsplan för AI-lösningar hos ${input.companyName}:

FÖRETAGSKONTEXT:
Typ: ${input.companyType}
Bransch: ${input.industry}

LÖSNINGAR ATT IMPLEMENTERA:
${solutions}`;

  const response = await callAI(systemPrompt, userMessage);
  console.log("Project Manager Agent completed");
  
  return { role: "Project Manager Agent", content: response };
}

// Agent 4: Financial Analyst Agent
async function financialAnalystAgent(input: CompanyInput, solutions: string, actionPlan: string): Promise<AgentResponse> {
  console.log("Financial Analyst Agent starting...");
  
  const investmentByType: Record<string, number> = {
    startup: 150000,
    sme: 400000,
    midmarket: 900000,
    enterprise: 2000000,
  };
  
  const baseInvestment = investmentByType[input.companyType] || 500000;
  
  const systemPrompt = `Du är en finansanalytiker specialiserad på AI-investeringar och ROI-beräkningar.

DIN UPPGIFT:
Beräkna detaljerad ROI för AI-implementeringen.

Skriv på svenska och returnera ENDAST valid JSON utan markdown-formatering:
{
  "roiEstimate": {
    "totalInvestment": ${baseInvestment},
    "yearOneReturns": ${Math.round(baseInvestment * 1.4)},
    "yearThreeReturns": ${Math.round(baseInvestment * 3.2)},
    "breakEvenMonths": 9,
    "costSavings": [
      {"category": "Personaleffektivisering", "amount": ${Math.round(baseInvestment * 0.25)}, "description": "Automation av repetitiva uppgifter"},
      {"category": "Processoptimering", "amount": ${Math.round(baseInvestment * 0.15)}, "description": "Snabbare genomloppstider"},
      {"category": "Kundtjänst", "amount": ${Math.round(baseInvestment * 0.12)}, "description": "AI-driven självbetjäning"}
    ],
    "revenueIncrease": [
      {"category": "Ökad försäljning", "amount": ${Math.round(baseInvestment * 0.30)}, "description": "Personalisering och bättre kundupplevelse"},
      {"category": "Nya möjligheter", "amount": ${Math.round(baseInvestment * 0.18)}, "description": "Datadrivna insikter och nya tjänster"}
    ],
    "confidenceLevel": "medium",
    "assumptions": [
      "Baserat på branschgenomsnitt för liknande AI-implementeringar",
      "Förutsätter tillgång till kvalitativ träningsdata",
      "Inkluderar inte kostnader för organisationsförändring",
      "ROI kan variera beroende på implementeringsframgång"
    ]
  }
}

KRITISKT:
- Alla belopp ska vara heltal i SEK
- "confidenceLevel" ska vara exakt: "low", "medium", eller "high"
- Anpassa siffrorna baserat på företagstyp och bransch`;

  const userMessage = `Beräkna ROI för AI-implementation hos ${input.companyName}:

FÖRETAGSTYP: ${input.companyType}
BRANSCH: ${input.industry}
BASBUDGET: ${baseInvestment} SEK

Justera ROI-beräkningen baserat på bransch och lösningarnas potential.`;

  const response = await callAI(systemPrompt, userMessage);
  console.log("Financial Analyst Agent completed");
  
  return { role: "Financial Analyst Agent", content: response };
}

// Parse JSON from AI response with robust error handling
function parseAIJson(response: string, agentName: string): any {
  // Remove markdown code blocks
  let cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  // Fix common AI JSON issues
  cleaned = cleaned.replace(/"percentage":\s*(\d+)-\d+/g, '"percentage": $1');
  cleaned = cleaned.replace(/:\s*(\d+)-(\d+)([,\n\r\s}])/g, ': $1$3');
  
  // Remove trailing commas before closing brackets
  cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');
  
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error(`${agentName} - Failed to parse JSON:`, e);
    console.log(`${agentName} - Cleaned response (first 1000 chars):`, cleaned.substring(0, 1000));
    throw new Error(`Failed to parse ${agentName} response as JSON`);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyInput } = await req.json() as { companyInput: CompanyInput };
    
    console.log("=== Starting multi-agent analysis ===");
    console.log("Company:", companyInput.companyName);
    console.log("Type:", companyInput.companyType);
    console.log("Industry:", companyInput.industry);

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Step 1: Research Agent
    const researchResult = await researchAgent(companyInput);
    const researchData = parseAIJson(researchResult.content, "Research Agent");
    console.log("✓ Research data parsed successfully");

    // Step 2: Creative Solutions Agent
    const solutionsResult = await creativeSolutionsAgent(companyInput, researchResult.content);
    const solutionsData = parseAIJson(solutionsResult.content, "Creative Solutions Agent");
    console.log("✓ Solutions data parsed successfully");

    // Step 3: Project Manager Agent
    const planResult = await projectManagerAgent(companyInput, solutionsResult.content);
    const planData = parseAIJson(planResult.content, "Project Manager Agent");
    console.log("✓ Plan data parsed successfully");

    // Step 4: Financial Analyst Agent
    const roiResult = await financialAnalystAgent(companyInput, solutionsResult.content, planResult.content);
    const roiData = parseAIJson(roiResult.content, "Financial Analyst Agent");
    console.log("✓ ROI data parsed successfully");

    // Combine all results
    const analysis = {
      company: companyInput,
      companyInfo: {
        found: true,
        details: researchData.companyProfile || `${companyInput.companyName} inom ${companyInput.industry}`,
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

    console.log("=== Analysis complete ===");
    console.log(`Generated ${analysis.suggestions.length} suggestions`);
    console.log(`Generated ${analysis.actionPlan.length} phases`);

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
