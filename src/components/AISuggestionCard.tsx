import { Sparkles, Bot, Zap, BarChart3, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AISuggestion } from "@/types/analysis";
import { Badge } from "@/components/ui/badge";

interface AISuggestionCardProps {
  suggestion: AISuggestion;
  index: number;
}

const categoryConfig: Record<string, { icon: typeof Sparkles; label: string; color: string }> = {
  generative: {
    icon: Sparkles,
    label: "Generativ AI",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  agentic: {
    icon: Bot,
    label: "Agentisk AI",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  automation: {
    icon: Zap,
    label: "Automation",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  analytics: {
    icon: BarChart3,
    label: "Analytics AI",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
};

const defaultCategory = {
  icon: Sparkles,
  label: "AI-lösning",
  color: "bg-primary/20 text-primary border-primary/30",
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  "quick-win": { label: "Quick Win", color: "bg-success/20 text-success border-success/30" },
  strategic: { label: "Strategisk", color: "bg-primary/20 text-primary border-primary/30" },
  "long-term": { label: "Långsiktig", color: "bg-muted text-muted-foreground border-border" },
};

const defaultPriority = { label: "Strategisk", color: "bg-primary/20 text-primary border-primary/30" };

const complexityConfig: Record<string, { label: string; color: string }> = {
  low: { label: "Låg", color: "text-success" },
  medium: { label: "Medium", color: "text-warning" },
  high: { label: "Hög", color: "text-destructive" },
};

const defaultComplexity = { label: "Medium", color: "text-warning" };

export function AISuggestionCard({ suggestion, index }: AISuggestionCardProps) {
  const category = categoryConfig[suggestion.category] || defaultCategory;
  const CategoryIcon = category.icon;
  const priority = priorityConfig[suggestion.priority] || defaultPriority;
  const complexity = complexityConfig[suggestion.implementationComplexity] || defaultComplexity;

  return (
    <div
      className="glass rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 animate-slide-up group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", category.color.split(' ')[0])}>
            <CategoryIcon className="w-5 h-5" />
          </div>
          <div>
            <Badge variant="outline" className={cn("text-xs", category.color)}>
              {category.label}
            </Badge>
          </div>
        </div>
        <Badge variant="outline" className={cn("text-xs", priority.color)}>
          {priority.label}
        </Badge>
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
        {suggestion.title}
      </h3>
      
      <p className="text-sm text-muted-foreground mb-4">
        {suggestion.description}
      </p>

      {/* Use Cases */}
      <div className="space-y-2 mb-4">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Användningsområden
        </h4>
        <ul className="space-y-1">
          {suggestion.useCases.map((useCase, i) => (
            <li key={i} className="text-sm text-foreground flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              {useCase}
            </li>
          ))}
        </ul>
      </div>

      {/* ROI & Metrics */}
      <div className="border-t border-border/50 pt-4 mt-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-success" />
              <span className="text-xs text-muted-foreground">Est. ROI</span>
            </div>
            <p className="text-lg font-bold text-success">
              +{suggestion.estimatedROI.percentage}%
            </p>
            <p className="text-xs text-muted-foreground">
              {suggestion.estimatedROI.timeframe}
            </p>
          </div>
          
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Komplexitet</span>
            </div>
            <p className={cn("text-sm font-medium", complexity.color)}>
              {complexity.label}
            </p>
          </div>
          
          <div>
            <div className="flex items-center gap-1 mb-1">
              <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Konfidens</span>
            </div>
            <p className="text-sm font-medium capitalize text-foreground">
              {suggestion.estimatedROI.confidence === 'low' ? 'Låg' : 
               suggestion.estimatedROI.confidence === 'medium' ? 'Medium' : 'Hög'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
