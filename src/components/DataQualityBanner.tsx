import { AlertCircle, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataQualityBannerProps {
  quality: 'complete' | 'partial' | 'limited';
  missingData: string[];
  companyName: string;
}

export function DataQualityBanner({ quality, missingData, companyName }: DataQualityBannerProps) {
  const config = {
    complete: {
      icon: CheckCircle2,
      title: "Fullständig data tillgänglig",
      description: `Vi hittade detaljerad information om ${companyName}. Analysen baseras på verifierade källor.`,
      bgClass: "bg-success/10 border-success/30",
      iconClass: "text-success",
    },
    partial: {
      icon: AlertTriangle,
      title: "Delvis data tillgänglig",
      description: `Viss information om ${companyName} kunde inte verifieras. Rekommendationer kan behöva anpassas.`,
      bgClass: "bg-warning/10 border-warning/30",
      iconClass: "text-warning",
    },
    limited: {
      icon: AlertCircle,
      title: "Begränsad data tillgänglig",
      description: `Begränsad publik information finns om ${companyName}. Förslag baseras på branschstandarder och angivna uppgifter.`,
      bgClass: "bg-destructive/10 border-destructive/30",
      iconClass: "text-destructive",
    },
  };

  const { icon: Icon, title, description, bgClass, iconClass } = config[quality];

  return (
    <div className={cn("rounded-xl border p-4 animate-fade-in", bgClass)}>
      <div className="flex gap-3">
        <Icon className={cn("w-5 h-5 mt-0.5 shrink-0", iconClass)} />
        <div className="space-y-2">
          <div>
            <h4 className="font-semibold text-foreground">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          
          {missingData.length > 0 && (
            <div className="flex items-start gap-2 pt-2">
              <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="text-sm">
                <span className="text-muted-foreground">Saknas: </span>
                <span className="text-foreground">{missingData.join(", ")}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
