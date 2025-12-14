import { CheckCircle2, Circle, Clock, Users, Flag, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ActionPhase } from "@/types/analysis";
import { useState } from "react";

interface ActionPlanSectionProps {
  phases: ActionPhase[];
}

export function ActionPlanSection({ phases }: ActionPlanSectionProps) {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(phases[0]?.id || null);

  return (
    <div className="space-y-4">
      {phases.map((phase, index) => (
        <div
          key={phase.id}
          className="glass rounded-2xl overflow-hidden animate-slide-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Phase Header */}
          <button
            onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
            className="w-full p-6 flex items-center justify-between hover:bg-secondary/20 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">{index + 1}</span>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-foreground">{phase.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {phase.duration}
                  </span>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Flag className="w-3.5 h-3.5" />
                    {phase.tasks.length} uppgifter
                  </span>
                </div>
              </div>
            </div>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-muted-foreground transition-transform duration-300",
                expandedPhase === phase.id && "rotate-180"
              )}
            />
          </button>

          {/* Phase Content */}
          {expandedPhase === phase.id && (
            <div className="px-6 pb-6 space-y-6 animate-fade-in">
              {/* Tasks */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Uppgifter
                </h4>
                <div className="space-y-3">
                  {phase.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-secondary/30 rounded-xl p-4 border border-border/50"
                    >
                      <div className="flex items-start gap-3">
                        <Circle className="w-4 h-4 text-primary mt-1 shrink-0" />
                        <div className="flex-1">
                          <h5 className="font-medium text-foreground">{task.title}</h5>
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.description}
                          </p>
                          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              {task.responsible}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {task.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    Milstolpar
                  </h4>
                  <ul className="space-y-2">
                    {phase.milestones.map((milestone, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                        {milestone}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    Leverabler
                  </h4>
                  <ul className="space-y-2">
                    {phase.deliverables.map((deliverable, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                        <Flag className="w-4 h-4 text-primary shrink-0" />
                        {deliverable}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
