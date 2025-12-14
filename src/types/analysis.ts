export interface CompanyInput {
  companyType: string;
  companyName: string;
  industry: string;
  challenges: string;
  goals: string;
  currentProcesses: string;
}

export interface AISuggestion {
  id: string;
  category: 'generative' | 'agentic' | 'automation' | 'analytics';
  title: string;
  description: string;
  useCases: string[];
  estimatedROI: {
    percentage: number;
    timeframe: string;
    confidence: 'low' | 'medium' | 'high';
  };
  implementationComplexity: 'low' | 'medium' | 'high';
  priority: 'quick-win' | 'strategic' | 'long-term';
}

export interface ActionPhase {
  id: string;
  name: string;
  duration: string;
  tasks: ActionTask[];
  milestones: string[];
  deliverables: string[];
}

export interface ActionTask {
  id: string;
  title: string;
  description: string;
  responsible: string;
  duration: string;
  dependencies: string[];
  status: 'pending' | 'in-progress' | 'completed';
}

export interface ROIEstimate {
  totalInvestment: number;
  yearOneReturns: number;
  yearThreeReturns: number;
  breakEvenMonths: number;
  costSavings: {
    category: string;
    amount: number;
    description: string;
  }[];
  revenueIncrease: {
    category: string;
    amount: number;
    description: string;
  }[];
  confidenceLevel: 'low' | 'medium' | 'high';
  assumptions: string[];
}

export interface AgentMessage {
  role: string;
  content: string;
}

export interface AnalysisResult {
  company: CompanyInput;
  companyInfo: {
    found: boolean;
    details?: string;
    industry?: string;
    size?: string;
    dataQuality: 'complete' | 'partial' | 'limited';
    missingData: string[];
  };
  suggestions: AISuggestion[];
  actionPlan: ActionPhase[];
  roiEstimate: ROIEstimate;
  generatedAt: Date;
  agentConversation?: AgentMessage[];
}
