import { Bot, User, Sparkles, Target, DollarSign, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentMessage {
  role: string;
  content: string;
}

interface AgentConversationProps {
  messages: AgentMessage[];
}

const agentConfig: Record<string, { icon: any; color: string; bgColor: string }> = {
  "Research Agent": {
    icon: Search,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
  },
  "Creative Solutions Agent": {
    icon: Sparkles,
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
  },
  "Project Manager Agent": {
    icon: Target,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
  },
  "Financial Analyst Agent": {
    icon: DollarSign,
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
  },
};

export function AgentConversation({ messages }: AgentConversationProps) {
  if (!messages || messages.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <Bot className="w-5 h-5 text-primary" />
        AI-Agenternas samarbete
      </h3>
      <p className="text-sm text-muted-foreground">
        Så här resonerade våra AI-agenter för att ta fram din analys:
      </p>
      
      <div className="space-y-4">
        {messages.map((message, index) => {
          const config = agentConfig[message.role] || {
            icon: Bot,
            color: "text-primary",
            bgColor: "bg-primary/20",
          };
          const Icon = config.icon;

          // Try to extract key insights from the content
          let summary = "";
          try {
            const parsed = JSON.parse(
              message.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
            );
            
            if (message.role === "Research Agent" && parsed.companyProfile) {
              summary = parsed.companyProfile;
            } else if (message.role === "Creative Solutions Agent" && parsed.suggestions) {
              summary = `Föreslog ${parsed.suggestions.length} AI-lösningar`;
            } else if (message.role === "Project Manager Agent" && parsed.actionPlan) {
              summary = `Skapade ${parsed.actionPlan.length} projektfaser`;
            } else if (message.role === "Financial Analyst Agent" && parsed.roiEstimate) {
              const roi = parsed.roiEstimate;
              const roiPercent = ((roi.yearOneReturns - roi.totalInvestment) / roi.totalInvestment * 100).toFixed(0);
              summary = `Beräknad ROI: +${roiPercent}% år 1`;
            }
          } catch {
            summary = "Analys genomförd";
          }

          return (
            <div
              key={index}
              className="glass rounded-xl p-4 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", config.bgColor)}>
                  <Icon className={cn("w-5 h-5", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn("font-semibold", config.color)}>
                      {message.role}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Steg {index + 1} av {messages.length}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">
                    {summary}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
