import { supabase } from "@/integrations/supabase/client";
import { CompanyInput, AnalysisResult } from "@/types/analysis";

export async function analyzeCompany(input: CompanyInput): Promise<AnalysisResult> {
  console.log("Starting AI analysis for:", input.companyName);
  
  const { data, error } = await supabase.functions.invoke('analyze-company', {
    body: { companyInput: input }
  });

  if (error) {
    console.error("Error calling analyze-company:", error);
    throw new Error(error.message || "Kunde inte genomföra analysen");
  }

  if (data.error) {
    console.error("API error:", data.error);
    throw new Error(data.details || data.error);
  }

  // Transform the response to match our types
  return {
    company: data.company,
    companyInfo: {
      found: data.companyInfo.found,
      details: data.companyInfo.details,
      industry: data.companyInfo.industry,
      size: data.companyInfo.size,
      dataQuality: data.companyInfo.dataQuality as 'complete' | 'partial' | 'limited',
      missingData: data.companyInfo.missingData || [],
    },
    suggestions: data.suggestions.map((s: any, index: number) => ({
      id: s.id || `suggestion-${index}`,
      category: s.category as 'generative' | 'agentic' | 'automation' | 'analytics',
      title: s.title,
      description: s.description,
      useCases: s.useCases || [],
      estimatedROI: {
        percentage: s.estimatedROI?.percentage || 30,
        timeframe: s.estimatedROI?.timeframe || "12 månader",
        confidence: (s.estimatedROI?.confidence || 'medium') as 'low' | 'medium' | 'high',
      },
      implementationComplexity: (s.implementationComplexity || 'medium') as 'low' | 'medium' | 'high',
      priority: (s.priority || 'strategic') as 'quick-win' | 'strategic' | 'long-term',
    })),
    actionPlan: data.actionPlan.map((phase: any) => ({
      id: phase.id,
      name: phase.name,
      duration: phase.duration,
      tasks: (phase.tasks || []).map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        responsible: task.responsible,
        duration: task.duration,
        dependencies: task.dependencies || [],
        status: (task.status || 'pending') as 'pending' | 'in-progress' | 'completed',
      })),
      milestones: phase.milestones || [],
      deliverables: phase.deliverables || [],
    })),
    roiEstimate: {
      totalInvestment: data.roiEstimate?.totalInvestment || 0,
      yearOneReturns: data.roiEstimate?.yearOneReturns || 0,
      yearThreeReturns: data.roiEstimate?.yearThreeReturns || 0,
      breakEvenMonths: data.roiEstimate?.breakEvenMonths || 12,
      costSavings: data.roiEstimate?.costSavings || [],
      revenueIncrease: data.roiEstimate?.revenueIncrease || [],
      confidenceLevel: (data.roiEstimate?.confidenceLevel || 'medium') as 'low' | 'medium' | 'high',
      assumptions: data.roiEstimate?.assumptions || [],
    },
    generatedAt: new Date(data.generatedAt),
    agentConversation: data.agentConversation,
  };
}
