import { 
  FolderOpen, 
  Sparkles, 
  ShoppingCart, 
  HeartPulse, 
  Factory, 
  Building2, 
  Truck,
  GraduationCap,
  ArrowRight,
  Star
} from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Mallar() {
  const templates = [
    {
      id: "retail",
      icon: ShoppingCart,
      title: "Detaljhandel & E-handel",
      description: "AI-lösningar för personalisering, lageroptimering och kundanalys",
      examples: ["AI-produktrekommendationer", "Prediktiv lagerhantering", "Chatbot för kundtjänst"],
      color: "bg-purple-500/20 text-purple-400",
      popular: true,
    },
    {
      id: "healthcare",
      icon: HeartPulse,
      title: "Hälso- & Sjukvård",
      description: "Automatisering av administration och patientflöden",
      examples: ["Automatisk triagering", "Dokumentationsassistent", "Schemaoptimering"],
      color: "bg-rose-500/20 text-rose-400",
      popular: false,
    },
    {
      id: "manufacturing",
      icon: Factory,
      title: "Tillverkning & Industri",
      description: "Prediktivt underhåll och kvalitetskontroll med AI",
      examples: ["Prediktivt underhåll", "Kvalitetsinspektion", "Produktionsoptimering"],
      color: "bg-amber-500/20 text-amber-400",
      popular: true,
    },
    {
      id: "finance",
      icon: Building2,
      title: "Bank & Finans",
      description: "Compliance-automation och riskanalys",
      examples: ["AML-screening", "Kreditbedömning", "Bedrägeridetektering"],
      color: "bg-blue-500/20 text-blue-400",
      popular: false,
    },
    {
      id: "logistics",
      icon: Truck,
      title: "Logistik & Transport",
      description: "Ruttoptimering och leveransförutsägelser",
      examples: ["Ruttplanering", "Efterfrågeprognos", "Lastoptimering"],
      color: "bg-emerald-500/20 text-emerald-400",
      popular: false,
    },
    {
      id: "education",
      icon: GraduationCap,
      title: "Utbildning",
      description: "Personaliserat lärande och administrationseffektivisering",
      examples: ["Adaptivt lärande", "Automatisk bedömning", "Studievägledning"],
      color: "bg-cyan-500/20 text-cyan-400",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <FolderOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Branschmallar</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Snabbstarta med branschmallar
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Välj en mall baserad på din bransch för att få fördefinierade utmaningar, 
              mål och AI-lösningar som är relevanta för din verksamhet.
            </p>
          </div>

          {/* Templates Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template, i) => (
              <div
                key={template.id}
                className="glass rounded-2xl p-6 hover:border-primary/30 transition-all group animate-slide-up relative"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {template.popular && (
                  <div className="absolute -top-2 -right-2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Populär
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl ${template.color.split(' ')[0]} flex items-center justify-center`}>
                    <template.icon className={`w-6 h-6 ${template.color.split(' ')[1]}`} />
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {template.title}
                  </h3>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {template.description}
                </p>

                <div className="space-y-2 mb-6">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Exempel på AI-lösningar:
                  </p>
                  <ul className="space-y-1">
                    {template.examples.map((example, j) => (
                      <li key={j} className="text-sm text-foreground flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-primary shrink-0" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link to={`/?template=${template.id}`}>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    Använd mall
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Custom Analysis CTA */}
          <div className="mt-12 glass rounded-2xl p-8 text-center animate-slide-up">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Hittar du inte din bransch?
            </h3>
            <p className="text-muted-foreground mb-6">
              Ingen mall som passar? Skapa en helt anpassad analys från grunden.
            </p>
            <Link to="/">
              <Button variant="hero" size="lg">
                <Sparkles className="w-5 h-5 mr-2" />
                Skapa anpassad analys
              </Button>
            </Link>
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
