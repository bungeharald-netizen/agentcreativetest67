import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExportRequest {
  analysis: any;
  format: 'excel' | 'pdf';
}

function generateCSVContent(analysis: any): string {
  const lines: string[] = [];
  
  // Header
  lines.push('CSA AI ADVISOR - ANALYS RAPPORT');
  lines.push(`Företag: ${analysis.company.companyName}`);
  lines.push(`Bransch: ${analysis.company.industry}`);
  lines.push(`Genererad: ${new Date(analysis.generatedAt).toLocaleDateString('sv-SE')}`);
  lines.push('');
  
  // AI Suggestions
  lines.push('=== AI-LÖSNINGSFÖRSLAG ===');
  lines.push('ID,Kategori,Titel,Beskrivning,ROI %,Tidsram,Komplexitet,Prioritet');
  
  analysis.suggestions?.forEach((s: any, i: number) => {
    const row = [
      i + 1,
      s.category || 'AI',
      `"${(s.title || '').replace(/"/g, '""')}"`,
      `"${(s.description || '').replace(/"/g, '""').substring(0, 200)}"`,
      s.estimatedROI?.percentage || '',
      s.estimatedROI?.timeframe || '',
      s.implementationComplexity || '',
      s.priority || ''
    ];
    lines.push(row.join(','));
  });
  
  lines.push('');
  
  // Action Plan
  lines.push('=== ACTION PLAN ===');
  lines.push('Fas,Fas Namn,Varaktighet,Uppgift,Beskrivning,Ansvarig,Uppgift Varaktighet');
  
  analysis.actionPlan?.forEach((phase: any, phaseIndex: number) => {
    phase.tasks?.forEach((task: any) => {
      const row = [
        phaseIndex + 1,
        `"${(phase.name || '').replace(/"/g, '""')}"`,
        phase.duration || '',
        `"${(task.title || '').replace(/"/g, '""')}"`,
        `"${(task.description || '').replace(/"/g, '""').substring(0, 150)}"`,
        `"${(task.responsible || '').replace(/"/g, '""')}"`,
        task.duration || ''
      ];
      lines.push(row.join(','));
    });
  });
  
  lines.push('');
  
  // ROI Summary
  lines.push('=== ROI ANALYS ===');
  const roi = analysis.roiEstimate || {};
  lines.push(`Total Investering,${roi.totalInvestment || 0} SEK`);
  lines.push(`Avkastning År 1,${roi.yearOneReturns || 0} SEK`);
  lines.push(`Avkastning År 3,${roi.yearThreeReturns || 0} SEK`);
  lines.push(`Break-even,${roi.breakEvenMonths || 0} månader`);
  
  lines.push('');
  lines.push('Kostnadsbesparingar:');
  roi.costSavings?.forEach((item: any) => {
    lines.push(`"${item.category}",${item.amount} SEK,"${item.description}"`);
  });
  
  lines.push('');
  lines.push('Intäktsökning:');
  roi.revenueIncrease?.forEach((item: any) => {
    lines.push(`"${item.category}",${item.amount} SEK,"${item.description}"`);
  });
  
  lines.push('');
  lines.push('Antaganden:');
  roi.assumptions?.forEach((assumption: string) => {
    lines.push(`"${assumption}"`);
  });
  
  return lines.join('\n');
}

function generateTextReport(analysis: any): string {
  const lines: string[] = [];
  const divider = '═'.repeat(60);
  const subDivider = '─'.repeat(40);
  
  lines.push(divider);
  lines.push('         CSA AI ADVISOR - ANALYSRAPPORT');
  lines.push(divider);
  lines.push('');
  lines.push(`Företag: ${analysis.company.companyName}`);
  lines.push(`Företagstyp: ${analysis.company.companyType}`);
  lines.push(`Bransch: ${analysis.company.industry}`);
  lines.push(`Genererad: ${new Date(analysis.generatedAt).toLocaleDateString('sv-SE')}`);
  lines.push('');
  
  if (analysis.company.challenges) {
    lines.push(`Utmaningar: ${analysis.company.challenges}`);
  }
  if (analysis.company.goals) {
    lines.push(`Mål: ${analysis.company.goals}`);
  }
  lines.push('');
  
  // AI Suggestions Section
  lines.push(divider);
  lines.push('               AI-LÖSNINGSFÖRSLAG');
  lines.push(divider);
  lines.push('');
  
  analysis.suggestions?.forEach((s: any, i: number) => {
    lines.push(`${i + 1}. ${s.title}`);
    lines.push(subDivider);
    lines.push(`   Kategori: ${s.category}`);
    lines.push(`   Prioritet: ${s.priority}`);
    lines.push(`   Komplexitet: ${s.implementationComplexity}`);
    lines.push('');
    lines.push(`   Beskrivning:`);
    lines.push(`   ${s.description}`);
    lines.push('');
    lines.push(`   Användningsområden:`);
    s.useCases?.forEach((uc: string) => {
      lines.push(`   • ${uc}`);
    });
    lines.push('');
    lines.push(`   Förväntad ROI: +${s.estimatedROI?.percentage}% (${s.estimatedROI?.timeframe})`);
    lines.push(`   Konfidens: ${s.estimatedROI?.confidence}`);
    lines.push('');
  });
  
  // Action Plan Section
  lines.push(divider);
  lines.push('              IMPLEMENTERINGSPLAN');
  lines.push(divider);
  lines.push('');
  
  analysis.actionPlan?.forEach((phase: any, phaseIndex: number) => {
    lines.push(`FAS ${phaseIndex + 1}: ${phase.name}`);
    lines.push(`Varaktighet: ${phase.duration}`);
    lines.push(subDivider);
    lines.push('');
    
    lines.push('Uppgifter:');
    phase.tasks?.forEach((task: any, taskIndex: number) => {
      lines.push(`  ${phaseIndex + 1}.${taskIndex + 1} ${task.title}`);
      lines.push(`      Ansvarig: ${task.responsible}`);
      lines.push(`      Tid: ${task.duration}`);
      if (task.description) {
        lines.push(`      ${task.description}`);
      }
      lines.push('');
    });
    
    if (phase.milestones?.length > 0) {
      lines.push('Milstolpar:');
      phase.milestones.forEach((m: string) => {
        lines.push(`  ✓ ${m}`);
      });
      lines.push('');
    }
    
    if (phase.deliverables?.length > 0) {
      lines.push('Leverabler:');
      phase.deliverables.forEach((d: string) => {
        lines.push(`  → ${d}`);
      });
      lines.push('');
    }
    lines.push('');
  });
  
  // ROI Section
  lines.push(divider);
  lines.push('                 ROI-ANALYS');
  lines.push(divider);
  lines.push('');
  
  const roi = analysis.roiEstimate || {};
  const formatCurrency = (n: number) => new Intl.NumberFormat('sv-SE').format(n);
  
  lines.push(`Total Investering:    ${formatCurrency(roi.totalInvestment || 0)} SEK`);
  lines.push(`Avkastning År 1:      ${formatCurrency(roi.yearOneReturns || 0)} SEK`);
  lines.push(`Avkastning År 3:      ${formatCurrency(roi.yearThreeReturns || 0)} SEK`);
  lines.push(`Break-even:           ${roi.breakEvenMonths || 0} månader`);
  lines.push(`Konfidensnivå:        ${roi.confidenceLevel}`);
  lines.push('');
  
  if (roi.costSavings?.length > 0) {
    lines.push('KOSTNADSBESPARINGAR:');
    roi.costSavings.forEach((item: any) => {
      lines.push(`  • ${item.category}: ${formatCurrency(item.amount)} SEK/år`);
      lines.push(`    ${item.description}`);
    });
    lines.push('');
  }
  
  if (roi.revenueIncrease?.length > 0) {
    lines.push('INTÄKTSÖKNING:');
    roi.revenueIncrease.forEach((item: any) => {
      lines.push(`  • ${item.category}: +${formatCurrency(item.amount)} SEK/år`);
      lines.push(`    ${item.description}`);
    });
    lines.push('');
  }
  
  if (roi.assumptions?.length > 0) {
    lines.push('ANTAGANDEN:');
    roi.assumptions.forEach((assumption: string) => {
      lines.push(`  ⚠ ${assumption}`);
    });
    lines.push('');
  }
  
  lines.push(divider);
  lines.push('         Genererad av CSA AI Advisor');
  lines.push(`              ${new Date().toISOString()}`);
  lines.push(divider);
  
  return lines.join('\n');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { analysis, format } = await req.json() as ExportRequest;
    
    console.log(`Generating ${format} export for ${analysis.company?.companyName}`);
    
    if (format === 'excel') {
      const csvContent = generateCSVContent(analysis);
      const encoder = new TextEncoder();
      const csvBytes = encoder.encode('\ufeff' + csvContent); // Add BOM for Excel
      
      return new Response(csvBytes, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="CSA_AI_Analys_${analysis.company?.companyName || 'rapport'}.csv"`,
        },
      });
    } else {
      const textContent = generateTextReport(analysis);
      const encoder = new TextEncoder();
      const textBytes = encoder.encode(textContent);
      
      return new Response(textBytes, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': `attachment; filename="CSA_AI_Analys_${analysis.company?.companyName || 'rapport'}.txt"`,
        },
      });
    }
  } catch (error) {
    console.error('Error in export-analysis function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
