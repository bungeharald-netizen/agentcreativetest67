export interface AISolution {
  id: string;
  name: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  steps: SolutionStep[];
  createdAt: Date;
  updatedAt: Date;
  analysisId?: string;
  githubRepo?: string;
  deploymentUrl?: string;
  teamMembers: AITeamMember[];
}

export interface SolutionStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  phase: 'discovery' | 'design' | 'development' | 'deployment' | 'delivery';
  startedAt?: Date;
  completedAt?: Date;
  output?: string;
  dependencies: string[];
}

export interface AITeamMember {
  id: string;
  name: string;
  role: 'product_owner' | 'tech_lead' | 'developer' | 'qa' | 'devops';
  description: string;
  isActive: boolean;
  lastActive: Date;
}

export const solutionPhases = [
  { id: 'discovery', name: 'Upptäckt', description: 'Förstå problemet och skapa en gemensam vision' },
  { id: 'design', name: 'Design', description: 'Skapa en lösningsdesign och arkitektur' },
  { id: 'development', name: 'Utveckling', description: 'Bygga lösningen enligt specifikationer' },
  { id: 'deployment', name: 'Driftsättning', description: 'Driftsätta lösningen i en produktionsmiljö' },
  { id: 'delivery', name: 'Överlämning', description: 'Överlämna och dokumentera lösningen' },
];
