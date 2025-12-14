import { FileSpreadsheet, FileText, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalysisResult } from "@/types/analysis";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ExportSectionProps {
  analysis: AnalysisResult;
}

export function ExportSection({ analysis }: ExportSectionProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const { toast } = useToast();

  const handleExport = async (type: 'excel' | 'pdf') => {
    setIsExporting(type);
    
    // Simulate export - in production this would call a backend API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Export klar",
      description: `Din ${type === 'excel' ? 'Excel-fil' : 'PDF-rapport'} är redo för nedladdning.`,
    });
    
    setIsExporting(null);
  };

  return (
    <div className="glass rounded-2xl p-6 animate-slide-up">
      <h3 className="text-lg font-semibold text-foreground mb-4">Exportera analys</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <button
          onClick={() => handleExport('excel')}
          disabled={isExporting !== null}
          className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl border border-border/50 hover:border-success/50 hover:bg-success/5 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center group-hover:bg-success/30 transition-colors">
            <FileSpreadsheet className="w-6 h-6 text-success" />
          </div>
          <div className="text-left flex-1">
            <p className="font-medium text-foreground">Excel Action Plan</p>
            <p className="text-sm text-muted-foreground">Gantt-schema, uppgifter & ROI</p>
          </div>
          {isExporting === 'excel' ? (
            <Loader2 className="w-5 h-5 text-success animate-spin" />
          ) : (
            <Download className="w-5 h-5 text-muted-foreground group-hover:text-success transition-colors" />
          )}
        </button>

        <button
          onClick={() => handleExport('pdf')}
          disabled={isExporting !== null}
          className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div className="text-left flex-1">
            <p className="font-medium text-foreground">PDF Rapport</p>
            <p className="text-sm text-muted-foreground">Fullständig presentation</p>
          </div>
          {isExporting === 'pdf' ? (
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          ) : (
            <Download className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
        </button>
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        * Export till Excel/PDF kräver backend-integration med Lovable Cloud
      </p>
    </div>
  );
}
