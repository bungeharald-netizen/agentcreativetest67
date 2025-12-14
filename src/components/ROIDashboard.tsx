import { TrendingUp, TrendingDown, Clock, DollarSign, PiggyBank, Target, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROIEstimate } from "@/types/analysis";

interface ROIDashboardProps {
  roi: ROIEstimate;
}

export function ROIDashboard({ roi }: ROIDashboardProps) {
  const roiPercentage = ((roi.yearOneReturns - roi.totalInvestment) / roi.totalInvestment) * 100;
  const yearThreeROI = ((roi.yearThreeReturns - roi.totalInvestment) / roi.totalInvestment) * 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const confidenceConfig = {
    low: { label: "Låg konfidens", color: "text-warning", description: "Baserat på branschgenomsnitt och begränsad data" },
    medium: { label: "Medium konfidens", color: "text-primary", description: "Baserat på liknande implementeringar" },
    high: { label: "Hög konfidens", color: "text-success", description: "Baserat på verifierad företagsdata" },
  };

  const confidence = confidenceConfig[roi.confidenceLevel];

  return (
    <div className="space-y-6">
      {/* Main ROI Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-6 animate-scale-in">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">Total investering</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(roi.totalInvestment)}
          </p>
        </div>

        <div className="glass rounded-2xl p-6 animate-scale-in" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-sm">Avkastning år 1</span>
          </div>
          <p className="text-2xl font-bold text-success">
            {formatCurrency(roi.yearOneReturns)}
          </p>
          <p className="text-sm text-success mt-1">
            +{roiPercentage.toFixed(0)}% ROI
          </p>
        </div>

        <div className="glass rounded-2xl p-6 animate-scale-in" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm">Avkastning år 3</span>
          </div>
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(roi.yearThreeReturns)}
          </p>
          <p className="text-sm text-primary mt-1">
            +{yearThreeROI.toFixed(0)}% ROI
          </p>
        </div>

        <div className="glass rounded-2xl p-6 animate-scale-in" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Break-even</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {roi.breakEvenMonths} mån
          </p>
        </div>
      </div>

      {/* Cost Savings & Revenue */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Cost Savings */}
        <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "400ms" }}>
          <div className="flex items-center gap-2 mb-4">
            <PiggyBank className="w-5 h-5 text-success" />
            <h3 className="font-semibold text-foreground">Kostnadsbesparingar</h3>
          </div>
          <div className="space-y-3">
            {roi.costSavings.map((saving, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
                <div>
                  <p className="font-medium text-foreground">{saving.category}</p>
                  <p className="text-xs text-muted-foreground">{saving.description}</p>
                </div>
                <p className="font-bold text-success whitespace-nowrap">
                  {formatCurrency(saving.amount)}/år
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Increase */}
        <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "500ms" }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Intäktsökning</h3>
          </div>
          <div className="space-y-3">
            {roi.revenueIncrease.map((revenue, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
                <div>
                  <p className="font-medium text-foreground">{revenue.category}</p>
                  <p className="text-xs text-muted-foreground">{revenue.description}</p>
                </div>
                <p className="font-bold text-primary whitespace-nowrap">
                  +{formatCurrency(revenue.amount)}/år
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confidence & Assumptions */}
      <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "600ms" }}>
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
          <div className="space-y-3">
            <div>
              <span className={cn("font-semibold", confidence.color)}>{confidence.label}</span>
              <p className="text-sm text-muted-foreground">{confidence.description}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Antaganden:</p>
              <ul className="space-y-1">
                {roi.assumptions.map((assumption, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 shrink-0" />
                    {assumption}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
