import { useMemo, useState } from "react";
import { BookOpen, Copy } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

type ChecklistItem = {
  id: string;
  title: string;
  description: string;
};

const readinessChecklist: ChecklistItem[] = [
  {
    id: "data_owner",
    title: "Dataägarskap är tydligt",
    description: "Vem äger datat, vem godkänner användning, och hur eskalerar man?",
  },
  {
    id: "data_quality",
    title: "Datakvalitet är tillräcklig",
    description: "Ni kan få fram 3–5 nyckelfält stabilt och med rimlig felgrad.",
  },
  {
    id: "integration",
    title: "Integrationer är möjliga",
    description: "Det finns API/exports från CRM/ERP/SharePoint/Teams eller en tydlig väg dit.",
  },
  {
    id: "process",
    title: "Processen är standardiserad",
    description: "Ni vet hur arbetet görs idag och kan beskriva det som steg/flöde.",
  },
  {
    id: "sponsor",
    title: "Sponsor + beslutskraft finns",
    description: "En ansvarig kan prioritera, ta bort hinder och fatta beslut varje vecka.",
  },
  {
    id: "adoption",
    title: "Adoption-plan finns",
    description: "Ni har plan för utrullning, träning och uppföljning av användning.",
  },
];

const governanceChecklist: ChecklistItem[] = [
  {
    id: "pii",
    title: "PII/sekretess-klassning",
    description: "Vilken data är persondata/sekretess? Regler för maskning och retention.",
  },
  {
    id: "logging",
    title: "Loggning & spårbarhet",
    description: "Vad loggas (inputs/outputs), var lagras det, och vem har access?",
  },
  {
    id: "hitl",
    title: "Human-in-the-loop",
    description: "När måste människa godkänna? Vad får AI aldrig göra?",
  },
  {
    id: "security",
    title: "Säkerhet & åtkomst",
    description: "Least privilege, service accounts, rotation av nycklar, environments.",
  },
  {
    id: "risk_register",
    title: "Riskregister",
    description: "Hot, failure modes, abuse scenarios, mitigations, ägare och deadline.",
  },
];

const roadmap030: string[] = [
  "Välj 1 use-case med tydlig sponsor och mätbar KPI",
  "Kartlägg process (as-is) och definiera to-be i 1 sida",
  "Säkra dataåtkomst (minsta möjliga) + skapa sandbox",
  "Bygg MVP (RAG/agent/workflow) med logging och guardrails",
  "Genomför 1–2 veckors experiment och mät baseline vs förbättring",
];

const roadmap3090: string[] = [
  "Skala till 2–3 team / avdelningar",
  "Bygg integrationshårdning (retry, idempotency, monitoring)",
  "Inför governance: HITL, incidentflöde, riskregister",
  "Sätt upp adoption: träning, champions, playbook för support",
  "Starta benefits tracking och rapportering till ledning",
];

const roadmap90180: string[] = [
  "Portföljstyrning: 3–8 use-cases i pipeline med impact/feasibility",
  "Produktifiera: gemensamma komponenter, prompt/agent library",
  "Mature ops: SLO/SLA, cost controls, audit och compliance",
  "Styrmodell: ägandeskap (RACI), roadmap cadence, kvartalsvisa ROI reviews",
];

function templateGovernanceKit() {
  return [
    "# AI Governance Kit (intern)\n",
    "## 1) Dataklassning & policy\n- Lista datakällor\n- PII/sekretess-klassning\n- Maskning/retention\n\n",
    "## 2) Human-in-the-loop\n- Vilka beslut kräver människa\n- Eskalering vid osäkerhet\n- Stop conditions\n\n",
    "## 3) Logging & audit\n- Logga inputs/outputs (utan PII om möjligt)\n- Audit trail + access\n- Incidenthantering\n\n",
    "## 4) Riskregister\n- Failure modes\n- Abuse scenarios\n- Mitigations\n- Ägare + deadline\n",
  ].join("\n");
}

function templateBenefitsTracking() {
  return [
    "# Benefits Tracking Plan\n",
    "## KPI:er (exempel)\n- Tidsbesparing per ärende\n- First Contact Resolution\n- Genomsnittlig handläggningstid\n- Kundnöjdhet\n- Adoption: DAU/WAU\n\n",
    "## Mätplan\n- Baseline: 2–4 veckor historik\n- Experiment: 1–2 veckor\n- Uppföljning: veckovis första 8 veckor\n\n",
    "## Datakällor\n- CRM/Helpdesk\n- Telemetri/loggar\n- Enkät/CSAT\n\n",
    "## Rapportering\n- Weekly: sponsor + operations\n- Monthly: ledning (ROI, risker, nästa steg)\n",
  ].join("\n");
}

function templateRoadmap() {
  const render = (title: string, items: string[]) =>
    [title, ...items.map((x) => `- ${x}`)].join("\n");

  return [
    "# 0–180 dagars roadmap",
    "",
    render("## 0–30 dagar", roadmap030),
    "",
    render("## 30–90 dagar", roadmap3090),
    "",
    render("## 90–180 dagar", roadmap90180),
  ].join("\n");
}

export default function Playbooks() {
  const { toast } = useToast();

  const [readinessState, setReadinessState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(readinessChecklist.map((x) => [x.id, false]))
  );

  const [governanceState, setGovernanceState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(governanceChecklist.map((x) => [x.id, false]))
  );

  const readinessScore = useMemo(() => {
    const total = readinessChecklist.length;
    const checked = readinessChecklist.reduce((acc, x) => acc + (readinessState[x.id] ? 1 : 0), 0);
    return { total, checked, pct: Math.round((checked / total) * 100) };
  }, [readinessState]);

  const readinessRecommendation = useMemo(() => {
    if (readinessScore.pct >= 80) return "Redo för MVP: välj 1 use-case och kör 2-veckors experiment.";
    if (readinessScore.pct >= 50) return "Nästan redo: säkra data + sponsor + process innan MVP.";
    return "Inte redo ännu: börja med dataägarskap, processkartläggning och integrationer.";
  }, [readinessScore.pct]);

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast({ title: "Kopierat", description: `${label} kopierat till urklipp.` });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Playbooks</h1>
              <p className="text-muted-foreground">
                Interna standarder för att gå från idé till production – med governance, roadmap och mätbar ROI.
              </p>
            </div>
          </div>

          <Tabs defaultValue="readiness" className="space-y-6">
            <TabsList className="glass">
              <TabsTrigger value="readiness">Readiness</TabsTrigger>
              <TabsTrigger value="governance">Governance</TabsTrigger>
              <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
            </TabsList>

            <TabsContent value="readiness">
              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="glass rounded-2xl lg:col-span-2">
                  <CardHeader>
                    <CardTitle>AI Readiness Assessment</CardTitle>
                    <CardDescription>Checklist för att undvika pilot-träsk och välja rätt första use-case.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {readinessChecklist.map((item) => (
                      <div key={item.id} className="flex items-start gap-3 border rounded-lg p-4">
                        <Checkbox
                          checked={readinessState[item.id]}
                          onCheckedChange={(v) =>
                            setReadinessState((s) => ({ ...s, [item.id]: Boolean(v) }))
                          }
                        />
                        <div>
                          <div className="font-medium text-foreground">{item.title}</div>
                          <div className="text-sm text-muted-foreground">{item.description}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="glass rounded-2xl">
                  <CardHeader>
                    <CardTitle>Resultat</CardTitle>
                    <CardDescription>Snabb tolkning för nästa steg.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground">Readiness score</div>
                      <div className="text-2xl font-semibold text-foreground">{readinessScore.pct}%</div>
                      <div className="text-xs text-muted-foreground">
                        {readinessScore.checked}/{readinessScore.total} kriterier uppfyllda
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground">Rekommendation</div>
                      <div className="text-sm text-foreground mt-1">{readinessRecommendation}</div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() =>
                        copyToClipboard(
                          [
                            "# AI Readiness Assessment\n",
                            ...readinessChecklist.map(
                              (x) =>
                                `- [${readinessState[x.id] ? "x" : " "}] ${x.title} — ${x.description}`
                            ),
                            "\n\nRekommendation:\n" + readinessRecommendation,
                          ].join("\n"),
                          "Readiness-rapport"
                        )
                      }
                    >
                      <Copy className="w-4 h-4" />
                      Kopiera rapport
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="governance">
              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="glass rounded-2xl lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Governance Kit</CardTitle>
                    <CardDescription>Minimum viable governance för enterprise-ready AI.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {governanceChecklist.map((item) => (
                      <div key={item.id} className="flex items-start gap-3 border rounded-lg p-4">
                        <Checkbox
                          checked={governanceState[item.id]}
                          onCheckedChange={(v) =>
                            setGovernanceState((s) => ({ ...s, [item.id]: Boolean(v) }))
                          }
                        />
                        <div>
                          <div className="font-medium text-foreground">{item.title}</div>
                          <div className="text-sm text-muted-foreground">{item.description}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="glass rounded-2xl">
                  <CardHeader>
                    <CardTitle>Templates</CardTitle>
                    <CardDescription>Kopiera rakt in i kundens deck / doc.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => copyToClipboard(templateGovernanceKit(), "Governance kit")}
                    >
                      <Copy className="w-4 h-4" />
                      Kopiera governance kit
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() =>
                        copyToClipboard(
                          [
                            "# Governance checklist\n",
                            ...governanceChecklist.map(
                              (x) => `- [${governanceState[x.id] ? "x" : " "}] ${x.title}`
                            ),
                          ].join("\n"),
                          "Governance checklist"
                        )
                      }
                    >
                      <Copy className="w-4 h-4" />
                      Kopiera checklist
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="roadmap">
              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="glass rounded-2xl lg:col-span-2">
                  <CardHeader>
                    <CardTitle>0–180 dagars roadmap</CardTitle>
                    <CardDescription>Standard playbook för att gå från MVP till portfölj och driftmodell.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="font-medium text-foreground mb-2">0–30 dagar</div>
                      <ul className="space-y-2">
                        {roadmap030.map((x) => (
                          <li key={x} className="text-sm text-muted-foreground">- {x}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="font-medium text-foreground mb-2">30–90 dagar</div>
                      <ul className="space-y-2">
                        {roadmap3090.map((x) => (
                          <li key={x} className="text-sm text-muted-foreground">- {x}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="font-medium text-foreground mb-2">90–180 dagar</div>
                      <ul className="space-y-2">
                        {roadmap90180.map((x) => (
                          <li key={x} className="text-sm text-muted-foreground">- {x}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass rounded-2xl">
                  <CardHeader>
                    <CardTitle>Export</CardTitle>
                    <CardDescription>Kopiera roadmappen till slide eller dokument.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => copyToClipboard(templateRoadmap(), "Roadmap")}
                    >
                      <Copy className="w-4 h-4" />
                      Kopiera roadmap
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="benefits">
              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="glass rounded-2xl lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Benefits Tracking</CardTitle>
                    <CardDescription>Gör ROI mätbar efter go-live med tydlig KPI och cadens.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="font-medium text-foreground mb-2">Minimum vi alltid sätter upp</div>
                      <ul className="space-y-2">
                        {[
                          "Baseline före MVP (2–4 veckor historik)",
                          "Experiment-mätning (1–2 veckor)",
                          "Adoption-mått (DAU/WAU per målgrupp)",
                          "KPI-träd: operational → finansiell effekt",
                          "Weekly sponsor review + monthly exec summary",
                        ].map((x) => (
                          <li key={x} className="text-sm text-muted-foreground">- {x}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="font-medium text-foreground mb-2">Snabbcheck</div>
                      <ul className="space-y-2">
                        {[
                          "KPI definierad med datakälla",
                          "Ägare för benefits (business owner)",
                          "Mätfönster och cadens definierad",
                          "Dashboard eller rapportformat beslutat",
                        ].map((x) => (
                          <li key={x} className="text-sm text-muted-foreground">- {x}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass rounded-2xl">
                  <CardHeader>
                    <CardTitle>Template</CardTitle>
                    <CardDescription>Kopiera benefits-planen rakt in i kundprojektet.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => copyToClipboard(templateBenefitsTracking(), "Benefits tracking plan")}
                    >
                      <Copy className="w-4 h-4" />
                      Kopiera benefits plan
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
