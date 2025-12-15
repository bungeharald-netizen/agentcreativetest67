import { useState } from "react";
import { Sparkles, Brain, Target, FileSpreadsheet, Building2, Bot, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { CompanyInputForm } from "@/components/CompanyInputForm";
import { DataQualityBanner } from "@/components/DataQualityBanner";
import { AISuggestionCard } from "@/components/AISuggestionCard";
import { ActionPlanSection } from "@/components/ActionPlanSection";
import { ROIDashboard } from "@/components/ROIDashboard";
import { ExportSection } from "@/components/ExportSection";
import { AgentConversation } from "@/components/AgentConversation";
import { CompanyInput, AnalysisResult } from "@/types/analysis";
import { analyzeCompany } from "@/lib/api/analysis";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSaveAnalysis } from "@/hooks/useAnalyses";

export default function Index() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [activeTab, setActiveTab] = useState<'suggestions' | 'plan' | 'roi' | 'agents'>('suggestions');
  const { toast } = useToast();
  const saveAnalysis = useSaveAnalysis();

  const loadingSteps = [
    "Research Agent analyserar företaget...",
    "Creative Solutions Agent brainstormar AI-lösningar...",
    "Project Manager Agent skapar implementeringsplan...",
    "Financial Analyst Agent beräknar ROI...",
    "Sammanställer analys...",
  ];

  const handleSubmit = async (data: CompanyInput) => {
    setIsLoading(true);
    setLoadingStep(loadingSteps[0]);
    
    // Animate through loading steps
    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      stepIndex = (stepIndex + 1) % loadingSteps.length;
      setLoadingStep(loadingSteps[stepIndex]);
    }, 3000);

    try {
      const result = await analyzeCompany(data);
      setAnalysis(result);
      
      // Save analysis to database
      try {
        await saveAnalysis.mutateAsync(result);
        toast({
          title: "Analys klar och sparad!",
          description: `${result.suggestions.length} AI-lösningar genererade för ${data.companyName}`,
        });
      } catch (saveError) {
        console.error("Failed to save analysis:", saveError);
        toast({
          title: "Analys klar!",
          description: `${result.suggestions.length} AI-lösningar genererade för ${data.companyName}`,
        });
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        variant: "destructive",
        title: "Fel vid analys",
        description: error instanceof Error ? error.message : "Kunde inte genomföra analysen. Försök igen.",
      });
    } finally {
      clearInterval(stepInterval);
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setActiveTab('suggestions');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="glass rounded-3xl p-8 max-w-md mx-4 text-center animate-scale-in">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
              <Bot className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              AI-Agenter arbetar
            </h3>
            <p className="text-muted-foreground mb-4">
              {loadingStep}
            </p>
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              <span className="text-sm text-muted-foreground">Detta kan ta 30-60 sekunder</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero / Input Section */}
      {!analysis ? (
        <main className="pt-24 pb-16">
          {/* Hero Background Effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Hero Header */}
            <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">AI-Driven Affärsutveckling</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
                Transformera företag med{" "}
                <span className="text-gradient">intelligent AI</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Våra AI-agenter samarbetar för att analysera företag, generera kreativa 
                AI-lösningar och skapa detaljerade implementeringsplaner med beräknad ROI.
              </p>
            </div>

            {/* Agent Preview */}
            <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
              {[
                { icon: Brain, title: "Research Agent", desc: "Analyserar företaget" },
                { icon: Sparkles, title: "Solutions Agent", desc: "Föreslår AI-lösningar" },
                { icon: Target, title: "PM Agent", desc: "Skapar projektplan" },
                { icon: FileSpreadsheet, title: "Finance Agent", desc: "Beräknar ROI" },
              ].map((agent, i) => (
                <div
                  key={i}
                  className="glass rounded-2xl p-4 text-center animate-slide-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
                    <agent.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-medium text-foreground text-sm mb-1">{agent.title}</h3>
                  <p className="text-xs text-muted-foreground">{agent.desc}</p>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <div className="max-w-3xl mx-auto">
              <div className="glass rounded-3xl p-8 animate-scale-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Företagsanalys</h2>
                    <p className="text-sm text-muted-foreground">Beskriv företaget för att få AI-genererade förslag</p>
                  </div>
                </div>
                
                <CompanyInputForm onSubmit={handleSubmit} isLoading={isLoading} />
              </div>
            </div>
          </div>
        </main>
      ) : (
        /* Results Section */
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            {/* Results Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in">
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                  AI-analys för {analysis.company.companyName}
                </h1>
                <p className="text-muted-foreground">
                  Genererad {analysis.generatedAt.toLocaleDateString('sv-SE')} • {analysis.suggestions.length} AI-förslag • {analysis.actionPlan.reduce((acc, p) => acc + p.tasks.length, 0)} uppgifter
                </p>
              </div>
              <Button variant="outline" onClick={handleReset}>
                Ny analys
              </Button>
            </div>

            {/* Data Quality Banner */}
            <div className="mb-8">
              <DataQualityBanner
                quality={analysis.companyInfo.dataQuality}
                missingData={analysis.companyInfo.missingData}
                companyName={analysis.company.companyName}
              />
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {[
                { id: 'suggestions' as const, label: 'AI-förslag', icon: Brain },
                { id: 'plan' as const, label: 'Action Plan', icon: Target },
                { id: 'roi' as const, label: 'ROI-analys', icon: FileSpreadsheet },
                { id: 'agents' as const, label: 'AI-Agenter', icon: Bot },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground shadow-glow'
                      : 'glass text-foreground hover:bg-secondary/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'suggestions' && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {analysis.suggestions.map((suggestion, index) => (
                    <AISuggestionCard
                      key={suggestion.id}
                      suggestion={suggestion}
                      index={index}
                      companyName={analysis.company.companyName}
                      industry={analysis.company.industry}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'plan' && (
              <div className="space-y-8">
                <ActionPlanSection phases={analysis.actionPlan} />
              </div>
            )}

            {activeTab === 'roi' && (
              <div className="space-y-8">
                <ROIDashboard roi={analysis.roiEstimate} />
              </div>
            )}

            {activeTab === 'agents' && analysis.agentConversation && (
              <div className="glass rounded-2xl p-6">
                <AgentConversation messages={analysis.agentConversation} />
              </div>
            )}

            {/* Export Section */}
            <div className="mt-12">
              <ExportSection analysis={analysis} />
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CSA AI Advisor • Internt verktyg för AI-konsultering
          </p>
        </div>
      </footer>
    </div>
  );
}
