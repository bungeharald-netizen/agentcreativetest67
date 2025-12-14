import { FileText, Search, Filter, Calendar, TrendingUp, Download, Eye } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

export default function Analyser() {
  // Mock data - would come from database in production
  const analyses = [
    { 
      id: 1, 
      company: "TechStart AB", 
      industry: "Teknik & IT",
      date: "2024-01-10", 
      suggestions: 5,
      roi: "+42%",
      investment: "350 000 SEK"
    },
    { 
      id: 2, 
      company: "RetailPro Sverige", 
      industry: "Detaljhandel",
      date: "2024-01-09", 
      suggestions: 4,
      roi: "+38%",
      investment: "900 000 SEK"
    },
    { 
      id: 3, 
      company: "HealthCare Plus", 
      industry: "Hälso- & Sjukvård",
      date: "2024-01-08", 
      suggestions: 6,
      roi: "+55%",
      investment: "1 200 000 SEK"
    },
    { 
      id: 4, 
      company: "LogiTrans Nordic", 
      industry: "Logistik & Transport",
      date: "2024-01-05", 
      suggestions: 4,
      roi: "+31%",
      investment: "500 000 SEK"
    },
  ];

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
              <Button variant="hero">
                Ny analys
              </Button>
            </Link>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 animate-slide-up">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Sök efter företag eller bransch..." 
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Datum
            </Button>
          </div>

          {/* Analyses Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {analyses.map((analysis, i) => (
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
                      <h3 className="font-semibold text-foreground">{analysis.company}</h3>
                      <p className="text-sm text-muted-foreground">{analysis.industry}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{analysis.date}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-secondary/30 rounded-lg">
                    <p className="text-lg font-bold text-foreground">{analysis.suggestions}</p>
                    <p className="text-xs text-muted-foreground">AI-förslag</p>
                  </div>
                  <div className="text-center p-3 bg-success/10 rounded-lg">
                    <p className="text-lg font-bold text-success">{analysis.roi}</p>
                    <p className="text-xs text-muted-foreground">Est. ROI</p>
                  </div>
                  <div className="text-center p-3 bg-secondary/30 rounded-lg">
                    <p className="text-sm font-bold text-foreground">{analysis.investment}</p>
                    <p className="text-xs text-muted-foreground">Investering</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    Visa
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {analyses.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Inga analyser ännu</h3>
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
            © {new Date().getFullYear()} CSA AI Advisor • Internt verktyg för AI-konsultering
          </p>
        </div>
      </footer>
    </div>
  );
}
