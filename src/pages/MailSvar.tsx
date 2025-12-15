import { useMemo, useState } from "react";
import { Mail, Copy, Wand2, RotateCcw } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

function buildProfessionalReply(customerEmail: string) {
  const cleaned = customerEmail.trim();

  const summary = cleaned
    ? "Tack för ditt mejl. Jag har tagit del av din återkoppling och sammanfattar nedan hur vi föreslår att ta det vidare."
    : "";

  const reply = `Hej!\n\n${summary}\n\nTack för att du hör av dig. För att säkerställa att vi hanterar detta snabbt och korrekt föreslår jag följande upplägg:\n\n1) Bekräftelse & förståelse\n- Vi bekräftar att vi har förstått er fråga/situation och vad som är viktigast för er (t.ex. tidslinje, risk, kvalitet).\n\n2) Snabb förtydligande (om något är oklart)\n- För att ge ett träffsäkert svar vill vi stämma av: (a) önskat utfall, (b) relevanta begränsningar, (c) vem som är beslutsfattare/ägare internt hos er.\n\n3) Nästa steg (konkret)\n- Vi föreslår ett kort avstämningsmöte (15–30 min) där vi går igenom nuläge, målbild och nästa praktiska steg.\n- Efter mötet återkommer vi med en tydlig plan: rekommenderade aktiviteter, ansvarsfördelning och en realistisk tidslinje.\n\n4) Leveransprinciper\n- Tydlighet: vi dokumenterar beslut och nästa steg skriftligt.\n- Framdrift: vi prioriterar det som ger effekt tidigt och minimerar omtag.\n- Kvalitet & risk: vi hanterar risker proaktivt (t.ex. beroenden, dataåtkomst, compliance).\n\nOm du kan dela lite mer kontext (t.ex. vad som triggat frågan och när ni behöver ha ett beslut på plats) så kan vi förbereda oss och göra mötet så effektivt som möjligt.\n\nVänliga hälsningar,\n[Förnamn Efternamn]\nCSA\n`;

  return reply;
}

export default function MailSvar() {
  const { toast } = useToast();

  const [customerEmail, setCustomerEmail] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");

  const canGenerate = useMemo(() => customerEmail.trim().length > 0, [customerEmail]);

  const generate = () => {
    const reply = buildProfessionalReply(customerEmail);
    setGeneratedReply(reply);
  };

  const reset = () => {
    setCustomerEmail("");
    setGeneratedReply("");
  };

  const copy = async () => {
    if (!generatedReply.trim()) return;
    await navigator.clipboard.writeText(generatedReply);
    toast({
      title: "Kopierat",
      description: "Mail-svaret har kopierats till urklipp.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Mail svar</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Skriv professionella kundsvar
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Klistra in vad kunden har skickat. Du får ett utförligt, trevligt och mänskligt svar i
              konsultstil. Svaret undviker att nämna priser och fokuserar på nästa steg, tydlighet och
              framdrift.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="glass rounded-2xl">
              <CardHeader>
                <CardTitle>Kundens mail</CardTitle>
                <CardDescription>Klistra in kundens text här.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Mail från kund</Label>
                  <Textarea
                    id="customerEmail"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Klistra in kundens mail..."
                    className="min-h-[280px]"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={generate} disabled={!canGenerate} className="gap-2">
                    <Wand2 className="w-4 h-4" />
                    Generera svar
                  </Button>
                  <Button variant="outline" onClick={reset} className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Rensa
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass rounded-2xl">
              <CardHeader>
                <CardTitle>Föreslaget svar</CardTitle>
                <CardDescription>Redigera gärna innan du skickar.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="generatedReply">Svarsmall</Label>
                  <Textarea
                    id="generatedReply"
                    value={generatedReply}
                    onChange={(e) => setGeneratedReply(e.target.value)}
                    placeholder="Klicka på 'Generera svar' för att skapa ett utkast..."
                    className="min-h-[280px] font-mono"
                  />
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" onClick={copy} disabled={!generatedReply.trim()} className="gap-2">
                    <Copy className="w-4 h-4" />
                    Kopiera
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
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
