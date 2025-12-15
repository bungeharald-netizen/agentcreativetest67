import { useMemo } from "react";
import { Copy } from "lucide-react";
import type { AISuggestion } from "@/types/analysis";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

type ComplexityLabel = "Låg" | "Medium" | "Hög";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestion: AISuggestion;
  companyName?: string;
  industry?: string;
};

function getComplexityLabel(v: AISuggestion["implementationComplexity"]): ComplexityLabel {
  if (v === "low") return "Låg";
  if (v === "high") return "Hög";
  return "Medium";
}

function getPriorityLabel(v: AISuggestion["priority"]): string {
  if (v === "quick-win") return "Quick Win";
  if (v === "long-term") return "Långsiktig";
  return "Strategisk";
}

export function AISuggestionBuildGuideDialog({
  open,
  onOpenChange,
  suggestion,
  companyName,
  industry,
}: Props) {
  const { toast } = useToast();

  const companyLabel = companyName?.trim() ? companyName.trim() : "Företaget";
  const industryLabel = industry?.trim() ? industry.trim() : "din bransch";

  const complexityLabel = getComplexityLabel(suggestion.implementationComplexity);
  const priorityLabel = getPriorityLabel(suggestion.priority);

  const buildMeta = useMemo(() => {
    const complexityKey = suggestion.implementationComplexity;

    const timeline =
      complexityKey === "low" ? "2–4 veckor" : complexityKey === "medium" ? "4–8 veckor" : "8–16 veckor";

    const deliveryModel =
      complexityKey === "low"
        ? "Kan ofta göras in-house av 1–2 personer (förutsatt dataåtkomst och tydligt scope)"
        : complexityKey === "medium"
          ? "In-house möjligt, men kräver produktägare + engineering + stöd från IT/data/security"
          : "Rekommenderas som teamleverans (produkt + data + engineering + säkerhet). Extern hjälp är ofta rationellt.";

    const team =
      complexityKey === "low"
        ? [
            "Produktägare (0.1–0.2 FTE)",
            "Fullstack/AI-utvecklare (1 FTE)",
            "Domänexpert (2–4h/vecka)",
          ]
        : complexityKey === "medium"
          ? [
              "Produktägare (0.2–0.4 FTE)",
              "AI/ML engineer (1 FTE)",
              "Backend engineer (0.5–1 FTE)",
              "Domänexpert (0.1–0.2 FTE)",
              "Security/Legal (ad hoc)",
            ]
          : [
              "Produktägare (0.5 FTE)",
              "Tech lead (0.5–1 FTE)",
              "AI/ML engineer (1–2 FTE)",
              "Backend engineer (1 FTE)",
              "Data engineer (0.5–1 FTE)",
              "QA (0.5 FTE)",
              "Security/Legal (0.1–0.2 FTE)",
            ];

    const risks = [
      "Datakvalitet & åtkomst (rättigheter, GDPR, integrationer)",
      "Scope creep (för många use cases i första releasen)",
      "Mätbarhet (KPI:er måste definieras före bygg)",
      suggestion.category === "agentic"
        ? "Säker agent-exekvering (guardrails, begränsade verktyg, audit-logg, approvals)"
        : null,
      suggestion.category === "generative" ? "Hallucinationer (kräver RAG, citations, fallback)" : null,
    ].filter(Boolean) as string[];

    const kpis = [
      "Adoption: % aktiva användare som använder funktionen/vecka",
      "Cycle time: tid till löst ärende/utförd uppgift",
      "Quality: felgrad / manuell korrigering / återöppningar",
      "Business: kostnadsbesparing eller intäktslyft kopplat till use case",
    ];

    return { timeline, deliveryModel, team, risks, kpis };
  }, [suggestion]);

  const prompts = useMemo(() => {
    const useCases = suggestion.useCases.map((u) => `- ${u}`).join("\n");

    const systemPrompt = `Du är en senior AI-arkitekt och managementkonsult. Du arbetar strukturerat (MECE), konkret och beslutsorienterat. Du ger en genomförandeplan som är exekverbar med tydliga workstreams, deliverables, risker och KPI:er.

Kontext:
- Kund: ${companyLabel}
- Bransch: ${industryLabel}
- Idé: ${suggestion.title}
- Beskrivning: ${suggestion.description}
- Use cases:\n${useCases}
- Komplexitet: ${complexityLabel}
- Prioritet: ${priorityLabel}
- ROI-hypotes: +${suggestion.estimatedROI.percentage}% (${suggestion.estimatedROI.timeframe}, confidence ${suggestion.estimatedROI.confidence})`;

    const basePrompt = `# Uppdrag: Byggplan + första implementation

Ta fram en genomförandeplan för idén "${suggestion.title}" för ${companyLabel}.

## 1) Executive summary (max 8 bullets)
- Vad vi bygger och varför
- Vem som använder det
- Förväntad effekt (koppla till ROI)

## 2) Scope & MVP
- MVP (MUST)
- V1 (SHOULD)
- V2 (COULD)

## 3) Arkitektur (konkret)
- Datakällor (in/ut)
- Modellstrategi (LLM/RAG/klassisk ML/automation)
- Komponenter: frontend, backend, jobs, databaser, observability
- Säkerhet: behörigheter, PII, audit, rate-limits

## 4) Delivery plan (McKinsey-style workstreams)
Gör 4–6 workstreams med:
- mål
- aktiviteter
- deliverables
- risker
- beslutspunkter

## 5) Team & roller
Säg om detta kan göras av 1 person, ett litet team, eller kräver extern hjälp. Var tydlig med varför.

## 6) Tidslinje & estimat
- 0–2v, 2–4v, 4–8v (eller längre vid hög komplexitet)
- Kritiska beroenden

## 7) Starta utveckling
Ge en konkret "Day 1"-checklista och ett förslag på repo-struktur samt 10 första tasks i Jira-format.

Svara på svenska och skriv tydligt med rubriker.`;

    return { systemPrompt, basePrompt };
  }, [companyLabel, industryLabel, complexityLabel, priorityLabel, suggestion]);

  const copyToClipboard = async (label: string, text: string) => {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Kopierat",
      description: `${label} har kopierats till urklipp.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{suggestion.title}</DialogTitle>
          <DialogDescription>
            Genomförandeplan och promptförslag för {companyLabel} (konsultstil)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <div className="text-xs text-muted-foreground">Tidslinje (typiskt)</div>
              <div className="text-sm font-medium mt-1">{buildMeta.timeline}</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-xs text-muted-foreground">Leveransmodell</div>
              <div className="text-sm font-medium mt-1">{buildMeta.deliveryModel}</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-xs text-muted-foreground">Förväntad effekt</div>
              <div className="text-sm font-medium mt-1">+{suggestion.estimatedROI.percentage}%</div>
              <div className="text-xs text-muted-foreground">{suggestion.estimatedROI.timeframe}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">Vad vi bygger (MVP)</div>
            <ul className="space-y-1">
              {suggestion.useCases.slice(0, 4).map((u, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  {u}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">Team & roller (förslag)</div>
            <ul className="space-y-1">
              {buildMeta.team.map((t) => (
                <li key={t} className="text-sm text-muted-foreground">{t}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">Workstreams (MECE)</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  title: "Problem & KPI:er",
                  body: "Definiera mål, baseline, mått, acceptance criteria och beslutspunkter.",
                },
                {
                  title: "Data & integration",
                  body: "Kartlägg datakällor, access, event/ETL, datakvalitet och SLA.",
                },
                {
                  title: "Solution design",
                  body: "Arkitektur, modellstrategi, säkerhet, drift & loggning (observability).",
                },
                {
                  title: "Build & launch",
                  body: "Implementera MVP, test, staging, pilot, utbildning och rollout.",
                },
              ].map((ws) => (
                <div key={ws.title} className="border rounded-lg p-4">
                  <div className="text-sm font-medium">{ws.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{ws.body}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">Risker att hantera tidigt</div>
            <ul className="space-y-1">
              {buildMeta.risks.map((r) => (
                <li key={r} className="text-sm text-muted-foreground">{r}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">KPI:er (för styrning)</div>
            <ul className="space-y-1">
              {buildMeta.kpis.map((k) => (
                <li key={k} className="text-sm text-muted-foreground">{k}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold">Promptpaket (kopiera och börja bygga)</div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="text-sm font-medium">Systemprompt</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard("Systemprompt", prompts.systemPrompt)}
                  className="gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Kopiera
                </Button>
              </div>
              <div className="text-xs whitespace-pre-wrap font-mono text-muted-foreground">{prompts.systemPrompt}</div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="text-sm font-medium">Arbets-prompt</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard("Arbets-prompt", prompts.basePrompt)}
                  className="gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Kopiera
                </Button>
              </div>
              <div className="text-xs whitespace-pre-wrap font-mono text-muted-foreground">{prompts.basePrompt}</div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Stäng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
