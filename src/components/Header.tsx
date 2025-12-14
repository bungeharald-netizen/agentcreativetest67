import { Sparkles, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center glow">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">CSA AI Advisor</h1>
            <p className="text-xs text-muted-foreground">Intelligent Implementation Planning</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Analyser
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Mallar
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
          <div className="hidden md:flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center">
              <span className="text-xs font-medium text-primary">CSA</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
