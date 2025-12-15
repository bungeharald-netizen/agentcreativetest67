import { useMemo, useState } from "react";
import { Brain, Copy, Loader2, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { AgentConversation } from "@/components/AgentConversation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { brainstormOutOfBox, type BrainstormOutOfBoxResult } from "@/lib/api/brainstorm";

export default function BrainstormOutOfBox() {
  const { toast } = useToast();

  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BrainstormOutOfBoxResult | null>(null);

  const canRun = useMemo(() => companyName.trim().length > 1 && !isLoading, [companyName, isLoading]);

  const run = async () => {
    const name = companyName.trim();
    if (!name) return;

    setIsLoading(true);
    try {
      const data = await brainstormOutOfBox(name);
      setResult(data);
      toast({
        title: "Brainstorm klar",
        description: `Skapade ${data.ideas?.length || 0} idéer för ${name}`,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Kunde inte genomföra brainstorm";
      toast({
        variant: "destructive",
        title: "Fel vid brainstorm",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copy = async (label: string, text: string) => {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Kopierat",
      description: `${label} kopierat till urklipp.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Out of the box brainstorm</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Brainstorma AI-idéer som känns "nya"
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Skriv endast företagsnamn. Systemet försöker förstå bolaget och låter flera AI-agenter
              brainstorma, kritisera och syntetisera de mest intressanta idéerna.
            </p>
          </div>

          <Card className="glass rounded-2xl mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Företagsnamn
              </CardTitle>
              <CardDescription>Ex: "IKEA" / "Volvo" / "Ericsson"</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-3">
              <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Skriv företagsnamn..." />
              <Button onClick={run} disabled={!canRun} className="gap-2 md:w-56">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Brainstorma
              </Button>
            </CardContent>
          </Card>

          {result && (
            <div className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="glass rounded-2xl lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Förståelse av företaget</CardTitle>
                    <CardDescription>
                      Detta är en inferens baserad på namn (kan vara fel). Antaganden listas explicit.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{result.company.companyName}</Badge>
                      <Badge variant="outline">{result.company.inferredIndustry}</Badge>
                      <Badge variant="outline">{result.company.companyType}</Badge>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm font-medium text-foreground">Vad de troligen gör</div>
                      <div className="text-sm text-muted-foreground">{result.company.whatTheyLikelyDo}</div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-foreground">Antaganden</div>
                        <ul className="space-y-1">
                          {(result.company.assumptions || []).slice(0, 6).map((a) => (
                            <li key={a} className="text-sm text-muted-foreground">{a}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-foreground">Saknad info</div>
                        <ul className="space-y-1">
                          {(result.company.missingData || []).slice(0, 6).map((m) => (
                            <li key={m} className="text-sm text-muted-foreground">{m}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass rounded-2xl">
                  <CardHeader>
                    <CardTitle>Top 5 (synthesised)</CardTitle>
                    <CardDescription>
                      De 5 idéer som kritiker-agenten bedömer mest värdefulla och mest exekverbara.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(result.topIdeas || []).map((idea) => (
                      <div key={idea.id} className="border rounded-lg p-4">
                        <div className="text-sm font-semibold text-foreground">{idea.title}</div>
                        <div className="text-xs text-muted-foreground mt-2">Prompt för att börja koda</div>
                        <div className="mt-2 text-xs whitespace-pre-wrap font-mono text-muted-foreground">
                          {idea.promptToStartCoding}
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => copy("Kod-prompt", idea.promptToStartCoding)}
                          >
                            <Copy className="w-4 h-4" />
                            Kopiera
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {(result.chatHighlights?.length || 0) > 0 && (
                <Card className="glass rounded-2xl">
                  <CardHeader>
                    <CardTitle>Vad agent-teamet enades om</CardTitle>
                    <CardDescription>Snabb syntes från roundtable-chatten.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.chatHighlights?.map((h) => (
                        <li key={h} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {(result.agentChat?.length || 0) > 0 && (
                <Card className="glass rounded-2xl">
                  <CardHeader>
                    <CardTitle>Agent-chat (simulerad)</CardTitle>
                    <CardDescription>
                      Så här kan det låta när strateg, engineer, skeptic och domain-agent brainstormar tillsammans.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {result.agentChat?.map((m, i) => (
                      <div key={`${m.role}-${i}`} className="border rounded-lg p-4">
                        <div className="text-xs text-muted-foreground mb-1">{m.role}</div>
                        <div className="text-sm text-foreground whitespace-pre-wrap">{m.content}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              <Card className="glass rounded-2xl">
                <CardHeader>
                  <CardTitle>10 out-of-the-box idéer</CardTitle>
                  <CardDescription>
                    Divergent agent skapar 10 idéer. Här kan du plocka mekanismer, experiment och risker.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(result.ideas || []).map((idea) => (
                    <div key={idea.id} className="border rounded-lg p-4">
                      <div className="text-sm font-semibold text-foreground mb-1">{idea.title}</div>
                      <div className="text-sm text-muted-foreground mb-3">{idea.oneLiner}</div>

                      <div className="text-xs text-muted-foreground">Ny mekanism</div>
                      <div className="text-sm text-foreground mb-3">{idea.novelMechanism}</div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline">MVP: {idea.mvpInWeeks} v</Badge>
                        <Badge variant="outline">{idea.canDoInHouse ? "In-house möjligt" : "Behöver team"}</Badge>
                      </div>

                      <div className="text-xs text-muted-foreground">Första experiment</div>
                      <div className="text-sm text-foreground">{idea.firstExperiment}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="glass rounded-2xl p-6">
                <AgentConversation messages={result.agentConversation} />
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CSA AI Advisor • Internt verktyg för AI-konsultering
          </p>
        </div>
      </footer>
    </div>
  );
}
