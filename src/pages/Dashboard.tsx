import { 
  TrendingUp, 
  Users, 
  FileText, 
  Clock, 
  BarChart3,
  Sparkles,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Dashboard() {
  // Mock stats - in production these would come from the database
  const stats = {
    totalAnalyses: 12,
    activeProjects: 3,
    totalROI: "4.2M SEK",
    avgCompletionTime: "45 min",
  };

  const recentAnalyses = [
    { id: 1, company: "TechStart AB", date: "2024-01-10", status: "completed", roi: "+42%" },
    { id: 2, company: "RetailPro Sverige", date: "2024-01-09", status: "completed", roi: "+38%" },
    { id: 3, company: "HealthCare Plus", date: "2024-01-08", status: "in-progress", roi: "Beräknas" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Översikt över dina AI-implementeringsanalyser
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: "Totalt analyser", value: stats.totalAnalyses, icon: FileText, color: "text-primary" },
              { label: "Aktiva projekt", value: stats.activeProjects, icon: Users, color: "text-success" },
              { label: "Total estimerad ROI", value: stats.totalROI, icon: TrendingUp, color: "text-primary" },
              { label: "Snitt analystid", value: stats.avgCompletionTime, icon: Clock, color: "text-warning" },
            ].map((stat, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-6 animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions & Recent */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass rounded-2xl p-6 animate-slide-up">
                <h2 className="text-lg font-semibold text-foreground mb-4">Snabbåtgärder</h2>
                <div className="space-y-3">
                  <Link to="/">
                    <Button variant="hero" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Ny AI-analys
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to="/mallar">
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Visa mallar
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to="/analyser">
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Alla analyser
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Tips */}
              <div className="glass rounded-2xl p-6 border-primary/20 animate-slide-up" style={{ animationDelay: "100ms" }}>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Tips
                </h3>
                <p className="text-sm text-muted-foreground">
                  Ju mer detaljerad information du ger om företaget, desto bättre och mer 
                  relevanta blir AI-förslagen. Inkludera utmaningar, mål och nuvarande system.
                </p>
              </div>
            </div>

            {/* Recent Analyses */}
            <div className="lg:col-span-2">
              <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground">Senaste analyserna</h2>
                  <Link to="/analyser">
                    <Button variant="ghost" size="sm">
                      Visa alla
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {recentAnalyses.map((analysis) => (
                    <div
                      key={analysis.id}
                      className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{analysis.company}</p>
                          <p className="text-sm text-muted-foreground">{analysis.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={`font-semibold ${analysis.status === 'completed' ? 'text-success' : 'text-warning'}`}>
                            {analysis.roi}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {analysis.status === 'completed' ? (
                              <CheckCircle className="w-3 h-3 text-success" />
                            ) : (
                              <AlertCircle className="w-3 h-3 text-warning" />
                            )}
                            {analysis.status === 'completed' ? 'Klar' : 'Pågår'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {recentAnalyses.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Inga analyser ännu</p>
                    <Link to="/">
                      <Button variant="hero" size="sm" className="mt-4">
                        Skapa din första analys
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
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
