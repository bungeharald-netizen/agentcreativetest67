import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, RefreshCw, Sparkles } from "lucide-react";
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
    systemPrompt: (company: any) => `Du är en erfaren AI-utvecklare som specialiserar sig på att skapa avancerade kundtjänstlösningar. 

Företagsinformation:
- Namn: ${company?.company_name || 'Ej angivet'}
- Bransch: ${company?.industry || 'Ej angiven'}

Din uppgift är att hjälpa till att bygga en AI-driven kundtjänstlösning som förbättrar kundupplevelsen och effektiviteten. Var tydlig, konkret och följ bästa praxis för utveckling.`,
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
5. Analys av kundnöjdhet

## Specifika krav
- Lösningen ska vara skalbart och anpassningsbart
- Inkludera relevanta integrationer
- Följ bästa praxis för användarvänlighet
- Tänk på säkerhet och dataskydd
- Inkludera mätvärden för att utvärdera framgång`
  },
  salesAssistant: {
    name: "AI Säljassistent",
    description: "AI som hjälper till med försäljning",
    systemPrompt: (company: any) => `Du är en erfaren säljchef med expertis på AI-verktyg. 

Företagsinformation:
- Namn: ${company?.company_name || 'Ej angivet'}
- Bransch: ${company?.industry || 'Ej angiven'}

Din uppgift är att skapa en AI-säljassistent som ökar försäljning och effektiviserar säljprocessen.`,
    basePrompt: (company: any) => `# AI Säljassistent för ${company?.company_name || 'ditt företag'}

## Bakgrund
Företag: ${company?.company_name || 'Ej angivet'}
Bransch: ${company?.industry || 'Ej angiven'}

## Uppgift
Utveckla en AI-säljassistent som inkluderar:
1. Lead-generering och -kvalificering
2. Personliga förslag till kunder
3. Automatiserad uppföljning av leads
4. Prissättningsrekommendationer
5. Säljprognoser och analyser`
  },
  inventory: {
    name: "AI Lageroptimering",
    description: "AI för att optimera lagerhållning",
    systemPrompt: (company: any) => `Du är en erfaren logistikingenjör med expertis på lageroptimering. 

Företagsinformation:
- Namn: ${company?.company_name || 'Ej angivet'}
- Bransch: ${company?.industry || 'Ej angiven'}

Din uppgift är att skapa en AI-lösning som effektiviserar lagerhantering och minskar kostnader.`,
    basePrompt: (company: any) => `# Lageroptimeringslösning för ${company?.company_name || 'ditt företag'}

## Bakgrund
Företag: ${company?.company_name || 'Ej angivet'}
Bransch: ${company?.industry || 'Ej angiven'}

## Uppgift
Utveckla en lageroptimeringslösning som inkluderar:
1. Prognostisering av efterfrågan
2. Automatisk beställningsrekommendation
3. Lageroptimering baserat på försäljningsdata
4. Varningssystem för låga lagernivåer
5. Integration med befintliga ERP-system`
  }
} as const;

export default function ByggAI() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: analyses = [], isLoading: isLoadingAnalyses } = useAnalyses();
  
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey | "">("");
  const [generatedPrompts, setGeneratedPrompts] = useState<GeneratedPrompts>({ 
    system: "", 
    base: "", 
    context: "" 
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedAnalysis = analyses.find(a => a.id === selectedCompany);
  const template = selectedTemplate ? SOLUTION_TEMPLATES[selectedTemplate] : null;

  const generatePrompts = () => {
    if (!selectedCompany || !selectedTemplate) {
      toast({
        title: "Vänligen fyll i alla fält",
        description: "Du måste välja både företag och lösningstyp",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate API call
    setTimeout(() => {
      const systemPrompt = template?.systemPrompt(selectedAnalysis) || '';
      const basePrompt = template?.basePrompt(selectedAnalysis) || '';
      
      setGeneratedPrompts({
        system: systemPrompt,
        base: basePrompt,
        context: selectedAnalysis ? 
          `Företag: ${selectedAnalysis.company_name}\nBransch: ${selectedAnalysis.industry}` : 
          'Ingen företagsinformation tillgänglig'
      });
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
                    ) : analyses && analyses.length > 0 ? (
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
                  onValueChange={(value: TemplateKey) => setSelectedTemplate(value)}
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

              {(generatedPrompts.system || generatedPrompts.base) && (
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
                {selectedAnalysis.description && (
                  <div className="pt-2">
                    <div className="font-medium mb-1">Beskrivning:</div>
                    <p className="text-muted-foreground text-sm">
                      {selectedAnalysis.description}
                    </p>
                  </div>
                )}
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copyToClipboard(generatedPrompts.system, "Systemprompten")}
                    >
                      <Copy className="w-4 h-4 mr-2" /> Kopiera
                    </Button>
                  </div>
                  <CardDescription>
                    Använd denna prompt som grund för din AI-assistent
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted/50 rounded-md font-mono text-sm whitespace-pre-line">
                    {generatedPrompts.system}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Bas-prompt</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copyToClipboard(generatedPrompts.base, "Bas-prompten")}
                    >
                      <Copy className="w-4 h-4 mr-2" /> Kopiera
                    </Button>
                  </div>
                  <CardDescription>
                    Använd denna prompt för att generera lösningsförslag
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted/50 rounded-md font-mono text-sm whitespace-pre-line">
                    {generatedPrompts.base}
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
        phase: 'discovery',
        completedAt: '2022-01-01T12:00:00.000Z',
      },
      {
        id: 'step-2',
        name: 'Steg 2',
        description: 'Beskrivning av steg 2',
        status: 'in_progress',
        phase: 'discovery',
      },
    ],
  },
];

const solutionPhases = [
  {
    id: 'discovery',
    name: 'Upptäckt',
    description: 'Beskrivning av upptäcktsfasen',
  },
  {
    id: 'development',
    name: 'Utveckling',
    description: 'Beskrivning av utvecklingsfasen',
  },
];

export default function ByggAI() {
  const [solutions, setSolutions] = useState<AISolution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, fetch solutions from an API
    const fetchSolutions = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSolutions(mockSolutions);
      } catch (error) {
        console.error("Error fetching solutions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSolutions();
  }, []);

  const startNewSolution = () => {
    // Navigate to solution creation wizard
    navigate("/ny-ai-losning");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Klar</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" /> Pågår</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" /> Misslyckad</Badge>;
      default:
        return <Badge variant="outline">Inte påbörjad</Badge>;
    }
  };

  const getPhaseProgress = (phase: string, solution: AISolution) => {
    const phaseSteps = solution.steps.filter(step => step.phase === phase);
    if (phaseSteps.length === 0) return 0;
    
    const completedSteps = phaseSteps.filter(step => step.status === 'completed').length;
    return Math.round((completedSteps / phaseSteps.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Hämtar dina AI-lösningar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bygg AI-lösningar</h1>
          <p className="text-muted-foreground">
            Skapa och hantera dina AI-lösningar med vårt automatiserade utvecklingsteam
          </p>
        </div>
        <Button onClick={startNewSolution} className="gap-2">
          <Plus className="w-4 h-4" /> Ny AI-lösning
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="overview">Översikt</TabsTrigger>
          <TabsTrigger value="team">AI-team</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {solutions.length === 0 ? (
            <Card className="text-center p-8">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Inga AI-lösningar hittades</h3>
              <p className="text-muted-foreground mb-6">
                Skapa din första AI-lösning för att komma igång med automatiserad utveckling
              </p>
              <Button onClick={startNewSolution} className="gap-2">
                <Plus className="w-4 h-4" /> Skapa lösning
              </Button>
            </Card>
          ) : (
            <div className="grid gap-6">
              {solutions.map((solution) => (
                <Card key={solution.id} className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-xl font-semibold">{solution.name}</h2>
                          {getStatusBadge(solution.status)}
                        </div>
                        <p className="text-muted-foreground">{solution.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Terminal className="w-4 h-4" />
                          <span>Visa kod</span>
                        </Button>
                        <Button size="sm" className="gap-2">
                          <Rocket className="w-4 h-4" />
                          <span>Starta utveckling</span>
                        </Button>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Framsteg</span>
                        <span className="text-sm text-muted-foreground">{solution.progress}%</span>
                      </div>
                      <Progress value={solution.progress} className="h-2" />
                    </div>
                  </div>

                  <div className="border-t bg-muted/50">
                    <Tabs defaultValue={solutionPhases[0].id} className="w-full">
                      <div className="overflow-x-auto">
                        <TabsList className="w-full justify-start p-0 h-auto bg-transparent rounded-none border-b">
                          {solutionPhases.map((phase) => (
                            <TabsTrigger 
                              key={phase.id} 
                              value={phase.id}
                              className="flex-col h-auto py-3 px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                            >
                              <div className="text-xs font-medium mb-1">{phase.name}</div>
                              <div className="w-8 h-1 rounded-full bg-muted overflow-hidden">
                                <div 
                                  className="h-full bg-primary transition-all duration-300"
                                  style={{ width: `${getPhaseProgress(phase.id, solution)}%` }}
                                />
                              </div>
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </div>

                      {solutionPhases.map((phase) => (
                        <TabsContent key={phase.id} value={phase.id} className="p-6">
                          <div className="mb-6">
                            <h3 className="font-medium mb-1">{phase.name}</h3>
                            <p className="text-sm text-muted-foreground">{phase.description}</p>
                          </div>

                          <div className="space-y-4">
                            {solution.steps
                              .filter(step => step.phase === phase.id)
                              .map((step) => (
                                <div key={step.id} className="flex items-start gap-4 p-4 border rounded-lg">
                                  <div className="mt-0.5">
                                    {step.status === 'completed' ? (
                                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                        <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                                      </div>
                                    ) : step.status === 'in_progress' ? (
                                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Clock className="w-3 h-3 text-blue-600 animate-pulse" />
                                      </div>
                                    ) : (
                                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/20" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium">{step.name}</h4>
                                    <p className="text-sm text-muted-foreground">{step.description}</p>
                                  </div>
                                  {step.status === 'completed' && step.completedAt && (
                                    <div className="text-xs text-muted-foreground">
                                      Klar {new Date(step.completedAt).toLocaleDateString('sv-SE')}
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-utvecklingsteam</CardTitle>
              <CardDescription>
                Här är dina AI-utvecklare som arbetar med dina lösningar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">AI Product Owner</h4>
                      <p className="text-sm text-muted-foreground">Aktiv nu</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Ansvarar för att samla krav, prioritera funktioner och säkerställa att lösningen möter affärsmålen.
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                      Online
                    </span>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Code2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">AI Tech Lead</h4>
                      <p className="text-sm text-muted-foreground">Aktiv nu</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Ansvarar för arkitektur, tekniska beslut och kodkvalitet. Säkerställer att lösningen är skalbbar och underhållbara.
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                      Online
                    </span>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <GitBranch className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">AI Developer</h4>
                      <p className="text-sm text-muted-foreground">Tillgänglig vid behov</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Skriver och testar kod, implementerar funktioner och löser tekniska utmaningar enligt de uppsatta kraven.
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      Offline
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-medium mb-4">AI-verktyg och integrationer</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { name: 'Kodgenerering', icon: Code2, description: 'Automatisk kodgenerering' },
                    { name: 'Testning', icon: CheckCircle, description: 'Automatiserade tester' },
                    { name: 'CI/CD', icon: GitBranch, description: 'Kontinuerlig integration' },
                    { name: 'Dokumentation', icon: FileText, description: 'Autogenererad dokumentation' },
                    { name: 'API:er', icon: Server, description: 'Automatisk API-integrering' },
                    { name: 'UI/UX', icon: LayoutTemplate, description: 'Användargränssnittsdesign' },
                  ].map((tool, index) => (
                    <div key={index} className="border rounded-lg p-4 text-center">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <tool.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="font-medium">{tool.name}</h4>
                      <p className="text-xs text-muted-foreground">{tool.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
