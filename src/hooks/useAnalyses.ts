import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AnalysisResult, AISuggestion, ActionPhase, ROIEstimate, AgentMessage } from "@/types/analysis";
import { Json } from "@/integrations/supabase/types";

export interface SavedAnalysis {
  id: string;
  company_name: string;
  industry: string;
  company_type: string | null;
  challenges: string | null;
  goals: string | null;
  current_processes: string | null;
  suggestions: AISuggestion[];
  action_plan: ActionPhase[];
  roi_estimate: ROIEstimate | null;
  company_info: {
    found: boolean;
    details?: string;
    industry?: string;
    size?: string;
    dataQuality: 'complete' | 'partial' | 'limited';
    missingData: string[];
  } | null;
  agent_conversation: AgentMessage[] | null;
  total_roi_percentage: number | null;
  total_investment: number | null;
  suggestions_count: number;
  status: string;
  created_at: string;
  updated_at: string;
}

const defaultRoiEstimate: ROIEstimate = {
  totalInvestment: 0,
  yearOneReturns: 0,
  yearThreeReturns: 0,
  breakEvenMonths: 0,
  costSavings: [],
  revenueIncrease: [],
  confidenceLevel: 'low',
  assumptions: [],
};

const defaultCompanyInfo = {
  found: false,
  dataQuality: 'limited' as const,
  missingData: [],
};

export function useAnalyses() {
  return useQuery({
    queryKey: ["analyses"],
    queryFn: async (): Promise<SavedAnalysis[]> => {
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      return (data || []).map((item) => ({
        ...item,
        suggestions: (item.suggestions as unknown as AISuggestion[]) || [],
        action_plan: (item.action_plan as unknown as ActionPhase[]) || [],
        roi_estimate: (item.roi_estimate as unknown as ROIEstimate) || null,
        company_info: (item.company_info as unknown as SavedAnalysis['company_info']) || null,
        agent_conversation: (item.agent_conversation as unknown as AgentMessage[]) || null,
      }));
    },
  });
}

export function useAnalysis(id: string | undefined) {
  return useQuery({
    queryKey: ["analysis", id],
    queryFn: async (): Promise<SavedAnalysis | null> => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      
      return {
        ...data,
        suggestions: (data.suggestions as unknown as AISuggestion[]) || [],
        action_plan: (data.action_plan as unknown as ActionPhase[]) || [],
        roi_estimate: (data.roi_estimate as unknown as ROIEstimate) || null,
        company_info: (data.company_info as unknown as SavedAnalysis['company_info']) || null,
        agent_conversation: (data.agent_conversation as unknown as AgentMessage[]) || null,
      };
    },
    enabled: !!id,
  });
}

export function useSaveAnalysis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (analysis: AnalysisResult): Promise<SavedAnalysis> => {
      const avgRoi = analysis.suggestions.length > 0
        ? Math.round(analysis.suggestions.reduce((acc, s) => acc + s.estimatedROI.percentage, 0) / analysis.suggestions.length)
        : 0;

      const { data, error } = await supabase
        .from("analyses")
        .insert({
          company_name: analysis.company.companyName,
          industry: analysis.company.industry,
          company_type: analysis.company.companyType,
          challenges: analysis.company.challenges,
          goals: analysis.company.goals,
          current_processes: analysis.company.currentProcesses,
          suggestions: analysis.suggestions as unknown as Json,
          action_plan: analysis.actionPlan as unknown as Json,
          roi_estimate: analysis.roiEstimate as unknown as Json,
          company_info: analysis.companyInfo as unknown as Json,
          agent_conversation: analysis.agentConversation as unknown as Json,
          total_roi_percentage: avgRoi,
          total_investment: analysis.roiEstimate.totalInvestment,
          suggestions_count: analysis.suggestions.length,
          status: "completed",
        })
        .select()
        .single();

      if (error) throw error;
      
      return {
        ...data,
        suggestions: (data.suggestions as unknown as AISuggestion[]) || [],
        action_plan: (data.action_plan as unknown as ActionPhase[]) || [],
        roi_estimate: (data.roi_estimate as unknown as ROIEstimate) || null,
        company_info: (data.company_info as unknown as SavedAnalysis['company_info']) || null,
        agent_conversation: (data.agent_conversation as unknown as AgentMessage[]) || null,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analyses"] });
    },
  });
}

export function useDeleteAnalysis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("analyses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analyses"] });
    },
  });
}
