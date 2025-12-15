import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, RefreshCw, Sparkles, CheckCircle, Clock, AlertCircle, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAnalyses } from "@/hooks/useAnalyses";

// Define types
interface GeneratedPrompts {
  system: string;
  base: string;
  context: string;
}

type TemplateKey = 'customerService' | 'salesAssistant' | 'inventory';

interface Template {
  name: string;
  description: string;
  systemPrompt: (company: any) => string;
  basePrompt: (company: any) => string;
}

// Predefined solution templates
const SOLUTION_TEMPLATES: Record<TemplateKey, Template> = {
  customerService: {
    name: "AI Kundtjänst",
    description: "Automatiserad kundsupport med AI",
    systemPrompt: (company: any) => `Du är en erfaren AI-utvecklare som specialiserar dig på att skapa avancerade kundtjänstlösningar. 

Företagsinformation:
- Namn: ${company?.company_name || 'Ej angivet'}
- Bransch: ${company?.industry || 'Ej angiven'}

Din uppgift är att hjälpa till att bygga en AI-driven kundtjänstlösning som förbättrar kundupplevelsen och effektiviteten.`,
    basePrompt: (company: any) => `# AI Kundtjänstlösning för ${company?.company_name || 'ditt företag'}

## Bakgrund
Företag: ${company?.company_name || 'Ej angivet'}
Bransch: ${company?.industry || 'Ej angiven'}

## Uppgift
Utveckla en AI-kundtjänstlösning som inkluderar:
1. En smart chatbot som kan hantera vanliga frågor
2. Automatisk kategorisering av ärenden
3. Förslag på lösningar baserade på tidigare fall
4. Integration med befintliga kundsystem
5. Analys av kundnöjdhet`
  },
  salesAssistant: {
    name: "AI Säljassistent",
    description: "AI för att stödja säljprocessen",
    systemPrompt: (company: any) => `Du är en erfaren säljchef med expertis på AI-verktyg.

Företagsinformation:
- Namn: ${company?.company_name || 'Ej angivet'}
- Bransch: ${company?.industry || 'Ej angiven'}

Din uppgift är att hjälpa till att bygga en AI-drivet säljverktyg som ökar försäljning och effektiviserar säljprocessen.`,
    basePrompt: (company: any) => `# AI Säljassistent för ${company?.company_name || 'ditt företag'}

## Bakgrund
Företag: ${company?.company_name || 'Ej angivet'}
Bransch: ${company?.industry || 'Ej angiven'}

## Uppgift
Utveckla en AI-säljassistent som inkluderar:
1. Lead-generering och -kvalificering
2. Personliga försäljningsförslag
3. Automatisk uppföljning av leads
4. Integration med CRM-system
5. Försäljningsanalys och prognoser`
  },
  inventory: {
    name: "AI Lageroptimering",
    description: "AI för att optimera lagerhållning",
    systemPrompt: (company: any) => `Du är en erfaren logistikexpert med fokus på lageroptimering.

Företagsinformation:
- Namn: ${company?.company_name || 'Ej angivet'}
- Bransch: ${company?.industry || 'Ej angiven'}

Din uppgift är att hjälpa till att bygga en AI-lösning för lageroptimering som minskar kostnader och förbättrar effektiviteten.`,
    basePrompt: (company: any) => `# AI Lageroptimering för ${company?.company_name || 'ditt företag'}

## Bakgrund
Företag: ${company?.company_name || 'Ej angivet'}
Bransch: ${company?.industry || 'Ej angiven'}

## Uppgift
Utveckla en AI-lageroptimering som inkluderar:
1. Prediktiv lagerstyrning
2. Automatiska beställningsförslag
3. Optimering av lagerlokaler
4. Integration med befintliga ERP-system
5. Rapportering och analys`
  }
};

export default function ByggAI() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: analyses = [], isLoading: isLoadingAnalyses } = useAnalyses();
  
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey | "">("");
  const [generatedPrompts, setGeneratedPrompts] = useState<GeneratedPrompts>({ 
    system: "", 
    base: "", 
    context: "" 
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedAnalysis = analyses.find(a => a.id === selectedCompany);

  const generatePrompts = () => {
    if (!selectedCompany || !selectedTemplate) return;
    
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const template = SOLUTION_TEMPLATES[selectedTemplate as TemplateKey];
      if (template) {
        const system = template.systemPrompt(selectedAnalysis || {});
        const base = template.basePrompt(selectedAnalysis || {});
        
        setGeneratedPrompts({
          system,
          base,
          context: `Kontext för ${selectedAnalysis?.company_name || 'valt företag'} i ${selectedAnalysis?.industry || 'vald bransch'}`
        });
      }
      
      setIsGenerating(false);
    }, 1000);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Kopierad!",
      description: `${type} har kopierats till urklippet.`,
    });
  };

  const resetForm = () => {
    setSelectedCompany("");
    setSelectedTemplate("");
    setGeneratedPrompts({ system: "", base: "", context: "" });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI-lösningsgenerator</h1>
          <p className="text-muted-foreground">
            Generera anpassade prompts för att bygga AI-lösningar
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left sidebar - Form */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inställningar</CardTitle>
              <CardDescription>
                Välj företag och lösningstyp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company">Välj företag</Label>
                <Select 
                  value={selectedCompany} 
                  onValueChange={setSelectedCompany}
                  disabled={isLoadingAnalyses}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Välj ett företag" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingAnalyses ? (
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        Hämtar företag...
                      </div>
                    ) : analyses.length > 0 ? (
                      analyses.map((analysis) => (
                        <SelectItem key={analysis.id} value={analysis.id}>
                          {analysis.company_name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        Inga analyser hittades
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="template">Välj lösningstyp</Label>
                <Select 
                  value={selectedTemplate} 
                  onValueChange={(value) => setSelectedTemplate(value as TemplateKey)}
                  disabled={!selectedCompany}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Välj en lösningstyp" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SOLUTION_TEMPLATES).map(([key, template]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex flex-col">
                          <span>{template.name}</span>
                          <span className="text-xs text-muted-foreground">{template.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={generatePrompts}
                  disabled={!selectedCompany || !selectedTemplate || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Genererar...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generera prompts
                    </>
                  )}
                </Button>
              </div>

              {generatedPrompts.system && (
                <div className="pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={resetForm}
                    className="w-full"
                  >
                    Börja om
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle>Företagsinformation</CardTitle>
                <CardDescription>
                  Information om det valda företaget
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Företag:</span> {selectedAnalysis.company_name}
                </div>
                <div>
                  <span className="font-medium">Bransch:</span> {selectedAnalysis.industry}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main content - Generated prompts */}
        <div className="lg:col-span-2 space-y-6">
          {!generatedPrompts.system ? (
            <Card>
              <CardHeader>
                <CardTitle>Välkommen till AI-lösningsgeneratorn</CardTitle>
                <CardDescription>
                  Följ dessa steg för att generera anpassade prompts:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      1
                    </div>
                    <div>
                      <h3 className="font-medium">Välj företag</h3>
                      <p className="text-sm text-muted-foreground">
                        Välj bland dina analyserade företag
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      2
                    </div>
                    <div>
                      <h3 className="font-medium">Välj lösningstyp</h3>
                      <p className="text-sm text-muted-foreground">
                        Välj vilken typ av AI-lösning du vill bygga
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      3
                    </div>
                    <div>
                      <h3 className="font-medium">Generera prompts</h3>
                      <p className="text-sm text-muted-foreground">
                        Klicka på knappen för att generera anpassade prompts
                      </p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Systemprompt</CardTitle>
                  </div>
                  <CardDescription>
                    Använd denna prompt som grund för din AI-assistent
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="p-4 bg-muted/50 rounded-md font-mono text-sm whitespace-pre-line">
                      {generatedPrompts.system}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(generatedPrompts.system, "Systemprompten")}
                    >
                      <Copy className="w-4 h-4 mr-2" /> Kopiera
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Bas-prompt</CardTitle>
                  </div>
                  <CardDescription>
                    Använd denna prompt för att generera lösningsförslag
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="p-4 bg-muted/50 rounded-md font-mono text-sm whitespace-pre-line">
                      {generatedPrompts.base}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(generatedPrompts.base, "Bas-prompten")}
                    >
                      <Copy className="w-4 h-4 mr-2" /> Kopiera
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Användning</CardTitle>
                  <CardDescription>
                    Så här använder du dessa prompts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3 list-decimal pl-5">
                    <li>
                      <span className="font-medium">Kopiera systemprompten</span>
                      <p className="text-sm text-muted-foreground">
                        Använd denna som grundinställning för din AI-assistent
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Kopiera bas-prompten</span>
                      <p className="text-sm text-muted-foreground">
                        Använd denna för att generera specifika lösningsförslag
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Anpassa efter behov</span>
                      <p className="text-sm text-muted-foreground">
                        Justera prompts baserat på dina specifika krav
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Börja koda</span>
                      <p className="text-sm text-muted-foreground">
                        Använd genererade förslag som grund för din utveckling
                      </p>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
