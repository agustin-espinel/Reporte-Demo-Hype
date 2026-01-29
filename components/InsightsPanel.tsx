
import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, BrainCircuit } from 'lucide-react';
import { analyzeCampaignPerformance } from '../services/geminiService';
import { CampaignSummary, DailyReport } from '../types';

interface InsightsPanelProps {
  summary: CampaignSummary;
  daily: DailyReport[];
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ summary, daily }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getInsights() {
      setLoading(true);
      const result = await analyzeCampaignPerformance(summary, daily);
      setInsight(result || "Análisis no disponible.");
      setLoading(false);
    }
    getInsights();
  }, [summary, daily]);

  return (
    <div className="hypeads-gradient text-white rounded-[40px] p-10 shadow-2xl shadow-hypeads-primary/30 border border-white/10 h-full flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-white/10 p-3 rounded-2xl border border-white/20 backdrop-blur-xl">
          <BrainCircuit className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-black tracking-tight leading-none uppercase">Hypeads AI</h3>
          <p className="text-[10px] font-bold text-white/50 mt-2 uppercase tracking-widest">Intelligent Analysis</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-6">
            <div className="relative">
               <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
               <Loader2 className="w-12 h-12 text-white animate-spin relative z-10" />
            </div>
            <p className="text-sm font-bold text-white/70 animate-pulse tracking-wide uppercase">Generando insights estratégicos...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {insight?.split('\n').filter(l => l.trim()).map((line, i) => (
              <div key={i} className="flex gap-4 group">
                 <div className="w-1 h-auto bg-white/20 rounded-full group-hover:bg-white/50 transition-colors"></div>
                 <p className="text-white/80 text-sm leading-relaxed font-medium py-1">
                   {line}
                 </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10 pt-8 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Real-Time Data Engine</span>
        </div>
        <Sparkles className="w-5 h-5 text-amber-300" />
      </div>
    </div>
  );
};

export default InsightsPanel;
