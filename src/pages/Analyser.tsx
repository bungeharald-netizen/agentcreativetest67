import { FileText, Search, Filter, Calendar, TrendingUp, Download, Eye, Trash2, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useAnalyses, useDeleteAnalysis } from "@/hooks/useAnalyses";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Analyser() {
  const { data: analyses, isLoading } = useAnalyses();
  const deleteAnalysis = useDeleteAnalysis();
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const filteredAnalyses = analyses?.filter(
    (a) =>
      a.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Vill du verkligen ta bort analysen för ${name}?`)) {
      try {
        await deleteAnalysis.mutateAsync(id);
        toast({
          title: "Analys borttagen",
          description: `Analysen för ${name} har tagits bort.`,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Fel",
          description: "Kunde inte ta bort analysen.",
        });
      }
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("sv-SE", {
      style: "currency",
      currency: "SEK",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                Sparade analyser
              </h1>
              <p className="text-muted-foreground">
                Hantera och granska tidigare genomförda AI-analyser
              </p>
            </div>
            <Link to="/">
              <Button variant="hero">Ny analys</Button>
            </Link>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 animate-slide-up">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Sök efter företag eller bransch..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}

          {/* Analyses Grid */}
          {!isLoading && filteredAnalyses && filteredAnalyses.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredAnalyses.map((analysis, i) => (
                <div
                  key={analysis.id}
                  className="glass rounded-2xl p-6 hover:border-primary/30 transition-all animate-slide-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {analysis.company_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {analysis.industry}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(analysis.created_at).toLocaleDateString("sv-SE")}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                      <p className="text-lg font-bold text-foreground">
                        {analysis.suggestions_count}
                      </p>
                      <p className="text-xs text-muted-foreground">AI-förslag</p>
                    </div>
                    <div className="text-center p-3 bg-success/10 rounded-lg">
                      <p className="text-lg font-bold text-success">
                        +{analysis.total_roi_percentage || 0}%
                      </p>
                      <p className="text-xs text-muted-foreground">Est. ROI</p>
                    </div>
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                      <p className="text-sm font-bold text-foreground">
                        {formatCurrency(analysis.total_investment)}
                      </p>
                      <p className="text-xs text-muted-foreground">Investering</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/analys/${analysis.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="w-4 h-4 mr-1" />
                        Visa
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(analysis.id, analysis.company_name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && (!filteredAnalyses || filteredAnalyses.length === 0) && (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Inga analyser ännu
              </h3>
              <p className="text-muted-foreground mb-6">
                Skapa din första AI-implementeringsanalys för att komma igång.
              </p>
              <Link to="/">
                <Button variant="hero">Skapa analys</Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CSA AI Advisor • Internt verktyg för
            AI-konsultering
          </p>
        </div>
      </footer>
    </div>
  );
}
