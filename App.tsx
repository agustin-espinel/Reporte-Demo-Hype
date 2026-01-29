
import React, { useState } from 'react';
import { CAMPAIGN_SUMMARY, DAILY_BREAKDOWN, VERIFICATIONS as INITIAL_VERIFICATIONS } from './data';
import MetricCard from './components/MetricCard';
import PerformanceCharts from './components/PerformanceCharts';
import ReportTable from './components/ReportTable';
import InsightsPanel from './components/InsightsPanel';
import VerificationsGrid from './components/VerificationsGrid';
import { Verification } from './types';
import { analyzeVerificationImage } from './services/geminiService';
import { 
  BarChart3, 
  Target, 
  Wallet, 
  Eye, 
  Navigation2, 
  Calendar, 
  Users,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Download,
  Plus,
  EyeOff,
  FileText,
  Loader2
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'daily' | 'verifications'>('dashboard');
  const [verifications, setVerifications] = useState<Verification[]>(INITIAL_VERIFICATIONS);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadZone, setShowUploadZone] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const impressionsProgress = (CAMPAIGN_SUMMARY.servedImpressions / CAMPAIGN_SUMMARY.objectiveImpressions) * 100;
  const budgetProgress = (CAMPAIGN_SUMMARY.consumedBudget / CAMPAIGN_SUMMARY.investment) * 100;

  const handleDownloadPDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;

    setIsGeneratingPDF(true);

    // Si estamos en verificaciones, ocultamos la zona de carga para el PDF
    const originalShowUpload = showUploadZone;
    if (activeTab === 'verifications') {
      setShowUploadZone(false);
    }

    // Opciones para html2pdf
    const opt = {
      margin: [10, 10],
      filename: `Reporte_Hypeads_${CAMPAIGN_SUMMARY.campaignName.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        scrollX: 0,
        scrollY: 0
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // Agregamos clase de modo captura para asegurar estilos
      element.classList.add('pdf-capture-mode');
      
      // Esperamos un momento para que el DOM se asiente (especialmente si ocultamos la zona de carga)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // @ts-ignore - html2pdf se carga globalmente desde el script tag
      await html2pdf().set(opt).from(element).save();
      
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Hubo un problema al generar el PDF. Por favor, intenta de nuevo.');
    } finally {
      element.classList.remove('pdf-capture-mode');
      setShowUploadZone(originalShowUpload);
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadCSV = () => {
    const headers = ['Fecha', 'Impresiones', 'Clicks', 'CTR (%)', 'Viewability (%)', 'Inversion ($)'];
    const rows = DAILY_BREAKDOWN.map(r => [
      r.date,
      r.impressions,
      r.clicks,
      r.ctr,
      r.viewability,
      r.investment
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Hypeads_Data_${CAMPAIGN_SUMMARY.campaignName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadVerification = async (file: File) => {
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(',')[1];
      const previewUrl = e.target?.result as string;
      const aiDetails = await analyzeVerificationImage(base64);
      const newVerification: Verification = {
        id: Math.random().toString(36).substr(2, 9),
        title: aiDetails.title,
        site: aiDetails.site,
        url: aiDetails.url,
        timestamp: new Date().toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        imageUrl: previewUrl,
        device: aiDetails.device,
        format: aiDetails.format
      };
      setVerifications(prev => [newVerification, ...prev]);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteVerification = (id: string) => {
    setVerifications(prev => prev.filter(v => v.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      
      {/* Sidebar */}
      <aside className="print:hidden w-full lg:w-72 bg-white text-slate-900 flex flex-col border-r border-slate-200 shadow-sm z-30">
        <div className="p-8 pb-4">
          <div className="flex flex-col gap-0">
            <h1 className="text-3xl font-bold tracking-tight text-hypeads-primary leading-none">Hypeads<span className="text-[10px] align-top">®</span></h1>
            <p className="text-slate-400 text-sm font-medium tracking-wide">Success happens</p>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-3">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-200 ${activeTab === 'dashboard' ? 'bg-hypeads-primary text-white shadow-xl shadow-hypeads-primary/20' : 'text-slate-500 hover:bg-hypeads-light/50 hover:text-hypeads-primary'}`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="font-semibold">Resumen General</span>
          </button>
          <button 
            onClick={() => setActiveTab('daily')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-200 ${activeTab === 'daily' ? 'bg-hypeads-primary text-white shadow-xl shadow-hypeads-primary/20' : 'text-slate-500 hover:bg-hypeads-light/50 hover:text-hypeads-primary'}`}
          >
            <Calendar className="w-5 h-5" />
            <span className="font-semibold">Performance Diario</span>
          </button>
          <button 
            onClick={() => setActiveTab('verifications')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-200 ${activeTab === 'verifications' ? 'bg-hypeads-primary text-white shadow-xl shadow-hypeads-primary/20' : 'text-slate-500 hover:bg-hypeads-light/50 hover:text-hypeads-primary'}`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="font-semibold">Verificaciones</span>
          </button>
        </nav>

        <div className="p-8 mt-auto space-y-6">
          <button 
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all shadow-lg ${isGeneratingPDF ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'}`}
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Bajar Reporte PDF
              </>
            )}
          </button>
          
          <div className="bg-hypeads-light/40 p-5 rounded-2xl border border-hypeads-light">
            <h4 className="text-[10px] font-bold text-hypeads-primary uppercase mb-3 tracking-widest">Estado Campaña</h4>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-500 font-medium">Progreso Imp.</span>
              <span className="font-bold text-hypeads-primary">{impressionsProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-white h-2 rounded-full overflow-hidden">
              <div className="bg-hypeads-primary h-full rounded-full transition-all duration-1000" style={{ width: `${impressionsProgress}%` }} />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main id="report-content" className="flex-1 overflow-y-auto bg-slate-50">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 px-10 py-8 flex flex-col gap-4 print:relative print:bg-white print:border-none print:px-0">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-hypeads-primary/10 text-hypeads-primary text-[10px] font-black rounded uppercase tracking-tighter">Reporte Ejecutivo</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{CAMPAIGN_SUMMARY.agencyName}</p>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-3">
                {CAMPAIGN_SUMMARY.campaignName}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="text-xl font-bold text-hypeads-primary">{CAMPAIGN_SUMMARY.clientName}</p>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">{CAMPAIGN_SUMMARY.format}</span>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-4 print:hidden">
               <button 
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className={`bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm ${isGeneratingPDF ? 'opacity-50 cursor-not-allowed' : ''}`}
               >
                  {isGeneratingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {isGeneratingPDF ? 'Procesando...' : 'Bajar PDF'}
               </button>
               <div className="bg-hypeads-primary/5 p-4 rounded-3xl">
                  <Zap className="w-8 h-8 text-hypeads-primary" />
               </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[11px] text-slate-500 font-bold border-t border-slate-100 pt-4 uppercase tracking-widest">
            <span className="flex items-center gap-2"><Navigation2 className="w-3.5 h-3.5 text-hypeads-primary" /> {CAMPAIGN_SUMMARY.geo}</span>
            <span className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-hypeads-primary" /> {CAMPAIGN_SUMMARY.target}</span>
            <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-hypeads-primary" /> {CAMPAIGN_SUMMARY.startDate} - {CAMPAIGN_SUMMARY.endDate}</span>
          </div>
        </header>

        <div className="p-10 max-w-[1600px] mx-auto print:p-0">
          {activeTab === 'dashboard' && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <MetricCard 
                  title="Impresiones Totales" 
                  value={CAMPAIGN_SUMMARY.servedImpressions.toLocaleString()} 
                  goal={CAMPAIGN_SUMMARY.objectiveImpressions.toLocaleString()} 
                  percentage={impressionsProgress}
                  color="hypeads"
                  icon={<Target />}
                />
                <MetricCard 
                  title="Inversión Real" 
                  value={`$${CAMPAIGN_SUMMARY.consumedBudget.toLocaleString()}`} 
                  goal={`$${CAMPAIGN_SUMMARY.investment.toLocaleString()}`} 
                  percentage={budgetProgress}
                  color="emerald"
                  icon={<Wallet />}
                />
                <MetricCard 
                  title="CTR Global" 
                  value={`${CAMPAIGN_SUMMARY.totalCtr}%`} 
                  subtitle="Tasa de Clics"
                  color="amber"
                  icon={<BarChart3 />}
                />
                <MetricCard 
                  title="Viewability" 
                  value={`${CAMPAIGN_SUMMARY.totalViewability}%`} 
                  subtitle="Impacto Visual"
                  color="rose"
                  icon={<Eye />}
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                <div className="xl:col-span-2 space-y-10">
                  <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-200 print:shadow-none">
                    <PerformanceCharts data={DAILY_BREAKDOWN} />
                  </div>
                </div>
                <div className="xl:col-span-1 print:break-before-page">
                  <InsightsPanel summary={CAMPAIGN_SUMMARY} daily={DAILY_BREAKDOWN} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'daily' && (
            <div className="space-y-8">
              <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden print:shadow-none print:border">
                <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                   <div>
                      <h3 className="text-2xl font-bold text-slate-900">Desglose Técnico</h3>
                      <p className="text-sm text-slate-400 mt-1">Detalle diario de métricas servidas</p>
                   </div>
                   <div className="flex items-center gap-4 w-full md:w-auto print:hidden">
                      <button 
                        onClick={handleDownloadCSV}
                        className="flex items-center gap-2 bg-hypeads-primary text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-hypeads-primary/20 hover:bg-hypeads-dark transition-all"
                      >
                        <Download className="w-4 h-4" />
                        Descargar CSV
                      </button>
                   </div>
                </div>
                <ReportTable data={DAILY_BREAKDOWN} />
              </div>
            </div>
          )}

          {activeTab === 'verifications' && (
            <div className="space-y-8">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 print:mb-8">
                  <div>
                     <h3 className="text-3xl font-black text-slate-900 tracking-tight">Verificaciones AI</h3>
                     <p className="text-slate-500 font-medium mt-1">Evidencia visual de pauta auditada por inteligencia artificial.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 print:hidden">
                     <button 
                        onClick={() => setShowUploadZone(!showUploadZone)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all border shadow-sm ${showUploadZone ? 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50' : 'bg-hypeads-primary text-white border-hypeads-primary hover:bg-hypeads-dark shadow-hypeads-primary/20'}`}
                      >
                        {showUploadZone ? <><EyeOff className="w-4 h-4" /> Ocultar Carga</> : <><Plus className="w-4 h-4" /> Mostrar Carga</>}
                     </button>
                     <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-2xl border border-emerald-100 text-sm font-bold">
                        <CheckCircle2 className="w-4 h-4" /> Auditoría Activa
                     </div>
                  </div>
               </div>
               
               <VerificationsGrid 
                  verifications={verifications} 
                  onUpload={handleUploadVerification}
                  onDelete={handleDeleteVerification}
                  isUploading={isUploading}
                  showUploadZone={showUploadZone}
               />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
