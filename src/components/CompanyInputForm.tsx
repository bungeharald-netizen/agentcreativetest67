import { useState } from "react";
import { Building2, Target, Cog, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CompanyInput } from "@/types/analysis";

interface CompanyInputFormProps {
  onSubmit: (data: CompanyInput) => void;
  isLoading: boolean;
}

const companyTypes = [
  { value: "startup", label: "Startup (1-50 anställda)" },
  { value: "sme", label: "Småföretag (51-250 anställda)" },
  { value: "midmarket", label: "Medelstort (251-1000 anställda)" },
  { value: "enterprise", label: "Storföretag (1000+ anställda)" },
];

const industries = [
  { value: "retail", label: "Detaljhandel & E-handel" },
  { value: "finance", label: "Bank & Finans" },
  { value: "healthcare", label: "Hälso- & Sjukvård" },
  { value: "manufacturing", label: "Tillverkning & Industri" },
  { value: "technology", label: "Teknik & IT" },
  { value: "consulting", label: "Konsulting & Tjänster" },
  { value: "logistics", label: "Logistik & Transport" },
  { value: "media", label: "Media & Underhållning" },
  { value: "education", label: "Utbildning" },
  { value: "real-estate", label: "Fastigheter" },
  { value: "other", label: "Annat" },
];

export function CompanyInputForm({ onSubmit, isLoading }: CompanyInputFormProps) {
  const [formData, setFormData] = useState<CompanyInput>({
    companyType: "",
    companyName: "",
    industry: "",
    challenges: "",
    goals: "",
    currentProcesses: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isValid = formData.companyType && formData.companyName && formData.industry;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Company Type */}
        <div className="space-y-2">
          <Label htmlFor="companyType" className="flex items-center gap-2 text-foreground">
            <Building2 className="w-4 h-4 text-primary" />
            Företagstyp *
          </Label>
          <Select
            value={formData.companyType}
            onValueChange={(value) => setFormData({ ...formData, companyType: value })}
          >
            <SelectTrigger className="bg-secondary/50 border-border hover:border-muted-foreground/50 transition-colors">
              <SelectValue placeholder="Välj företagstyp" />
            </SelectTrigger>
            <SelectContent>
              {companyTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Company Name */}
        <div className="space-y-2">
          <Label htmlFor="companyName" className="flex items-center gap-2 text-foreground">
            <Building2 className="w-4 h-4 text-primary" />
            Företagsnamn *
          </Label>
          <Input
            id="companyName"
            placeholder="T.ex. Volvo, IKEA, Spotify..."
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          />
        </div>

        {/* Industry */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="industry" className="flex items-center gap-2 text-foreground">
            <Cog className="w-4 h-4 text-primary" />
            Bransch *
          </Label>
          <Select
            value={formData.industry}
            onValueChange={(value) => setFormData({ ...formData, industry: value })}
          >
            <SelectTrigger className="bg-secondary/50 border-border hover:border-muted-foreground/50 transition-colors">
              <SelectValue placeholder="Välj bransch" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((ind) => (
                <SelectItem key={ind.value} value={ind.value}>
                  {ind.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Challenges */}
      <div className="space-y-2">
        <Label htmlFor="challenges" className="flex items-center gap-2 text-foreground">
          <AlertTriangle className="w-4 h-4 text-warning" />
          Nuvarande utmaningar
        </Label>
        <Textarea
          id="challenges"
          placeholder="Beskriv de största utmaningarna företaget står inför. T.ex. hög personalomsättning, ineffektiva processer, låg kundnöjdhet..."
          value={formData.challenges}
          onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
          className="min-h-[100px]"
        />
      </div>

      {/* Goals */}
      <div className="space-y-2">
        <Label htmlFor="goals" className="flex items-center gap-2 text-foreground">
          <Target className="w-4 h-4 text-success" />
          Mål med AI-implementering
        </Label>
        <Textarea
          id="goals"
          placeholder="Vad vill företaget uppnå med AI? T.ex. reducera kostnader med 20%, öka försäljningen, förbättra kundupplevelsen..."
          value={formData.goals}
          onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
          className="min-h-[100px]"
        />
      </div>

      {/* Current Processes */}
      <div className="space-y-2">
        <Label htmlFor="currentProcesses" className="flex items-center gap-2 text-foreground">
          <Cog className="w-4 h-4 text-muted-foreground" />
          Nuvarande processer & system (valfritt)
        </Label>
        <Textarea
          id="currentProcesses"
          placeholder="Beskriv befintliga system och arbetsprocesser. T.ex. CRM-system, manuell fakturahantering, Excel-baserad rapportering..."
          value={formData.currentProcesses}
          onChange={(e) => setFormData({ ...formData, currentProcesses: e.target.value })}
          className="min-h-[100px]"
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          variant="hero"
          size="xl"
          disabled={!isValid || isLoading}
          className="min-w-[200px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyserar...
            </>
          ) : (
            <>
              Generera AI-analys
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
