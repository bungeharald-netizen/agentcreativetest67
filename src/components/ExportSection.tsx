import { FileSpreadsheet, FileText, Download, Loader2, CheckCircle, Presentation, File, FileJson } from "lucide-react";
import { AnalysisResult } from "@/types/analysis";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ExportSectionProps {
  analysis: AnalysisResult | {
    company: AnalysisResult['company'];
    suggestions: AnalysisResult['suggestions'];
    actionPlan: AnalysisResult['actionPlan'];
    roiEstimate: AnalysisResult['roiEstimate'] | null;
    generatedAt: Date;
    companyInfo?: AnalysisResult['companyInfo'];
    agentConversation?: AnalysisResult['agentConversation'];
  };
}

export function ExportSection({ analysis }: ExportSectionProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const { toast } = useToast();

  const handleExport = async (type: 'excel' | 'pdf' | 'pitch' | 'google-slides' | 'keynote') => {
    setIsExporting(type);
    setExportSuccess(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('export-analysis', {
        body: { 
          analysis: {
            company: analysis.company,
            suggestions: analysis.suggestions,
            actionPlan: analysis.actionPlan,
            roiEstimate: analysis.roiEstimate,
            generatedAt: analysis.generatedAt instanceof Date 
              ? analysis.generatedAt.toISOString() 
              : analysis.generatedAt,
          },
          format: type 
        }
      });

      if (error) throw error;

      // Create blob and download
      const blob = new Blob([data], { 
        type: type === 'excel' ? 'text/csv;charset=utf-8' : 'text/plain;charset=utf-8' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      let extension = 'txt';
      let filename = `CSA_AI_Analys_${analysis.company.companyName}.txt`;
      
      if (type === 'excel') {
        extension = 'csv';
        filename = `CSA_AI_Analys_${analysis.company.companyName}.csv`;
      } else if (type === 'pitch') {
        filename = `CSA_Pitch_Deck_${analysis.company.companyName}.txt`;
      } else if (type === 'google-slides') {
        extension = 'json';
        filename = `CSA_Presentation_${analysis.company.companyName}.slides.json`;
      } else if (type === 'keynote') {
        extension = 'key';
        filename = `CSA_Presentation_${analysis.company.companyName}.key`;
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExportSuccess(type);
      
      const typeLabels = {
        'excel': 'Excel-fil',
        'pdf': 'Textrapport',
        'pitch': 'Pitch Deck',
        'google-slides': 'Google Slides',
        'keynote': 'Apple Keynote'
      };
      const typeLabel = typeLabels[type] || 'fil';
      toast({
        title: "Export klar!",
        description: `Din ${typeLabel} har laddats ner.`,
      });
      
      setTimeout(() => setExportSuccess(null), 3000);
    } catch (error) {
      console.error('Export error:', error);
      toast({
        variant: "destructive",
        title: "Export misslyckades",
        description: "Kunde inte generera filen. Försök igen.",
      });
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="glass rounded-2xl p-6 animate-slide-up">
      <h3 className="text-lg font-semibold text-foreground mb-4">Exportera analys</h3>
      
      <div className="grid md:grid-cols-3 gap-4">
        <button
          onClick={() => handleExport('excel')}
          disabled={isExporting !== null}
          className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl border border-border/50 hover:border-success/50 hover:bg-success/5 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center group-hover:bg-success/30 transition-colors">
            <FileSpreadsheet className="w-6 h-6 text-success" />
          </div>
          <div className="text-left flex-1">
            <p className="font-medium text-foreground">Excel/CSV</p>
            <p className="text-sm text-muted-foreground">Action plan & ROI</p>
          </div>
          {isExporting === 'excel' ? (
            <Loader2 className="w-5 h-5 text-success animate-spin" />
          ) : exportSuccess === 'excel' ? (
            <CheckCircle className="w-5 h-5 text-success" />
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
            <p className="font-medium text-foreground">Textrapport</p>
            <p className="text-sm text-muted-foreground">Full presentation</p>
          </div>
          {isExporting === 'pdf' ? (
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          ) : exportSuccess === 'pdf' ? (
            <CheckCircle className="w-5 h-5 text-primary" />
          ) : (
            <Download className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
        </button>

<button
          onClick={() => handleExport('pitch')}
          disabled={isExporting !== null}
          className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl border border-border/50 hover:border-warning/50 hover:bg-warning/5 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center group-hover:bg-warning/30 transition-colors">
            <FileText className="w-6 h-6 text-warning" />
          </div>
          <div className="text-left flex-1">
            <p className="font-medium text-foreground">Textbaserad Pitch</p>
            <p className="text-sm text-muted-foreground">Enkel textfil</p>
          </div>
          {isExporting === 'pitch' ? (
            <Loader2 className="w-5 h-5 text-warning animate-spin" />
          ) : exportSuccess === 'pitch' ? (
            <CheckCircle className="w-5 h-5 text-warning" />
          ) : (
            <Download className="w-5 h-5 text-muted-foreground group-hover:text-warning transition-colors" />
          )}
        </button>

        <button
          onClick={() => handleExport('google-slides')}
          disabled={isExporting !== null}
          className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl border border-border/50 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
            <Presentation className="w-6 h-6 text-blue-500" />
          </div>
          <div className="text-left flex-1">
            <p className="font-medium text-foreground">Google Slides</p>
            <p className="text-sm text-muted-foreground">Online-presentation</p>
          </div>
          {isExporting === 'google-slides' ? (
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          ) : exportSuccess === 'google-slides' ? (
            <CheckCircle className="w-5 h-5 text-blue-500" />
          ) : (
            <Download className="w-5 h-5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
          )}
        </button>

        <button
          onClick={() => handleExport('keynote')}
          disabled={isExporting !== null}
          className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl border border-border/50 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
            <File className="w-6 h-6 text-purple-500" />
          </div>
          <div className="text-left flex-1">
            <p className="font-medium text-foreground">Apple Keynote</p>
            <p className="text-sm text-muted-foreground">Mac-presentation</p>
          </div>
          {isExporting === 'keynote' ? (
            <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
          ) : exportSuccess === 'keynote' ? (
            <CheckCircle className="w-5 h-5 text-purple-500" />
          ) : (
            <Download className="w-5 h-5 text-muted-foreground group-hover:text-purple-500 transition-colors" />
          )}
        </button>
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        CSV för Excel • Text för utskrift • Presentationer för Google Slides eller Apple Keynote
      </p>
    </div>
  );
}
