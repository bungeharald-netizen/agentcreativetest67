import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Analyser from "./pages/Analyser";
import Mallar from "./pages/Mallar";
import AnalysisDetail from "./pages/AnalysisDetail";
import MailSvar from "./pages/MailSvar";
import BrainstormOutOfBox from "./pages/BrainstormOutOfBox";
import Playbooks from "./pages/Playbooks";
import NotFound from "./pages/NotFound";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const queryClient = new QueryClient();

const ACCESS_CODE_STORAGE_KEY = "csa_access_granted";
const ACCESS_CODE = "LABUBUDOMPA67";

function AccessGate({ onUnlocked }: { onUnlocked: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => code.trim().length > 0, [code]);

  const submit = () => {
    const input = code.trim();
    if (input !== ACCESS_CODE) {
      setError("Fel kod. Försök igen.");
      return;
    }
    localStorage.setItem(ACCESS_CODE_STORAGE_KEY, "true");
    onUnlocked();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="glass rounded-3xl w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome to Creative Solutions AI</CardTitle>
            <CardDescription>Skriv in access-koden för att fortsätta.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Access-kod"
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSubmit) submit();
              }}
            />
            {error && <div className="text-sm text-destructive">{error}</div>}
            <Button className="w-full" onClick={submit} disabled={!canSubmit}>
              Lås upp
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppWithAccessGate />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

function AppWithAccessGate() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setUnlocked(localStorage.getItem(ACCESS_CODE_STORAGE_KEY) === "true");
  }, []);

  if (!unlocked) {
    return <AccessGate onUnlocked={() => setUnlocked(true)} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/analyser" element={<Analyser />} />
      <Route path="/analys/:id" element={<AnalysisDetail />} />
      <Route path="/mallar" element={<Mallar />} />
      <Route path="/mail-svar" element={<MailSvar />} />
      <Route path="/brainstorm" element={<BrainstormOutOfBox />} />
      <Route path="/playbooks" element={<Playbooks />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
