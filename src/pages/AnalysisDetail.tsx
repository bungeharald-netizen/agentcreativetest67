import { useParams, Link } from "react-router-dom";
import { Brain, Target, FileSpreadsheet, Bot, ArrowLeft, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useAnalysis } from "@/hooks/useAnalyses";
import { AISuggestionCard } from "@/components/AISuggestionCard";
import { ActionPlanSection } from "@/components/ActionPlanSection";
import { ROIDashboard } from "@/components/ROIDashboard";
import { AgentConversation } from "@/components/AgentConversation";
import { ExportSection } from "@/components/ExportSection";
import { DataQualityBanner } from "@/components/DataQualityBanner";
import { useState } from "react";

export default function AnalysisDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: analysis, isLoading } = useAnalysis(id);
  const [activeTab, setActiveTab] = useState<"suggestions" | "plan" | "roi" | "agents">("suggestions");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </main>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Analys hittades inte</h1>
            <Link to="/analyser">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Tillbaka till analyser
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Transform saved data back to AnalysisResult format
  const analysisResult = {
    company: {
      companyType: analysis.company_type || "",
      companyName: analysis.company_name,
      industry: analysis.industry,
      challenges: analysis.challenges || "",
      goals: analysis.goals || "",
      currentProcesses: analysis.current_processes || "",
    },
    companyInfo: analysis.company_info,
    suggestions: analysis.suggestions,
    actionPlan: analysis.action_plan,
    roiEstimate: analysis.roi_estimate,
    generatedAt: new Date(analysis.created_at),
    agentConversation: analysis.agent_conversation,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in">
            <div>
              <Link
                to="/analyser"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Tillbaka till analyser
              </Link>
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                AI-analys för {analysis.company_name}
              </h1>
              <p className="text-muted-foreground">
                Genererad{" "}
                {new Date(analysis.created_at).toLocaleDateString("sv-SE")} •{" "}
                {analysis.suggestions_count} AI-förslag •{" "}
                {analysis.action_plan.reduce(
                  (acc: number, p: any) => acc + (p.tasks?.length || 0),
                  0
                )}{" "}
                uppgifter
              </p>
            </div>
            <Link to="/">
              <Button variant="outline">Ny analys</Button>
            </Link>
          </div>

          {/* Data Quality Banner */}
          <div className="mb-8">
            <DataQualityBanner
              quality={analysisResult.companyInfo?.dataQuality || "partial"}
              missingData={analysisResult.companyInfo?.missingData || []}
              companyName={analysis.company_name}
            />
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {[
              { id: "suggestions" as const, label: "AI-förslag", icon: Brain },
              { id: "plan" as const, label: "Action Plan", icon: Target },
              { id: "roi" as const, label: "ROI-analys", icon: FileSpreadsheet },
              { id: "agents" as const, label: "AI-Agenter", icon: Bot },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "glass text-foreground hover:bg-secondary/50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "suggestions" && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analysisResult.suggestions.map((suggestion: any, index: number) => (
                  <AISuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    index={index}
                    companyName={analysisResult.company.companyName}
                    industry={analysisResult.company.industry}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === "plan" && (
            <div className="space-y-8">
              <ActionPlanSection phases={analysisResult.actionPlan} />
            </div>
          )}

          {activeTab === "roi" && (
            <div className="space-y-8">
              <ROIDashboard roi={analysisResult.roiEstimate} />
            </div>
          )}

          {activeTab === "agents" && analysisResult.agentConversation && (
            <div className="glass rounded-2xl p-6">
              <AgentConversation messages={analysisResult.agentConversation} />
            </div>
          )}

          {/* Export Section */}
          <div className="mt-12">
            <ExportSection analysis={analysisResult} />
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CSA AI Advisor • Internt verktyg för
            AI-konsultering
          </p>
        </div>
      </footer>
    </div>
  );
}
