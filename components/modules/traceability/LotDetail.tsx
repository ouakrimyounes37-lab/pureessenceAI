
import React, { useState } from 'react';
import { Lot, LotStatus, NonConformity, QCResult } from '../../../types';
import { X, Calendar, Package, AlertTriangle, CheckCircle, TrendingUp, Cpu, Download, XCircle } from 'lucide-react';
import { analyzeLotRisk } from '../../../services/geminiService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AddQCModal from './AddQCModal';

interface LotDetailProps {
  lot: Lot;
  linkedNCs?: NonConformity[];
  onClose: () => void;
  notify: (msg: string, type: 'success' | 'error' | 'info') => void;
  onUpdateStatus: (id: string, status: LotStatus) => void;
  onAddQC: (lotId: string, result: Partial<QCResult>) => void;
}

const LotDetail: React.FC<LotDetailProps> = ({ lot, linkedNCs = [], onClose, notify, onUpdateStatus, onAddQC }) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'qc' | 'ai' | 'nc'>('timeline');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isQCModalOpen, setIsQCModalOpen] = useState(false);

  const handleAiAnalyze = async () => {
    setIsLoadingAi(true);
    const result = await analyzeLotRisk(lot);
    setAiAnalysis(result);
    setIsLoadingAi(false);
    notify('Analyse IA terminée', 'success');
  };

  const handleExport = () => {
      // Generate a simulated text content for the PDF
      const content = `
RAPPORT DE TRAÇABILITÉ LOT - PURE ESSENCE
-----------------------------------------
Lot: ${lot.lotNumber}
Produit: ${lot.productName}
Date Prod: ${lot.productionDate}
Statut: ${lot.status}
Taille: ${lot.batchSize} ${lot.unit}

RÉSULTATS QC:
${lot.qcResults.map(qc => `- ${qc.testName}: ${qc.result.toUpperCase()} (${qc.value || '-'} ${qc.unit || ''})`).join('\n')}

HISTORIQUE:
${lot.events.map(e => `- ${e.timestamp}: ${e.eventType} (${e.actor})`).join('\n')}

Généré le: ${new Date().toLocaleString()}
      `;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Rapport_Lot_${lot.lotNumber}.txt`; // Using .txt for simplicity in browser, acting as PDF export
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      notify('Rapport téléchargé avec succès', 'success');
  };

  const handleQCSubmit = (result: Partial<QCResult>) => {
      onAddQC(lot.id, result);
      setIsQCModalOpen(false);
  };

  // Mock data for the chart
  const chartData = lot.events.map((e, index) => ({
    name: index + 1,
    anomaly: e.anomalyScore || 0,
    time: e.timestamp.split('T')[1].substring(0, 5)
  }));

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[600px] lg:w-[800px] bg-white shadow-2xl transform transition-transform duration-300 z-50 flex flex-col animate-in slide-in-from-right">
      {/* Header */}
      <div className="px-4 md:px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <div>
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
            <h2 className="text-xl font-bold text-slate-900">{lot.lotNumber}</h2>
            <span className={`self-start px-2 py-0.5 rounded text-xs font-bold uppercase ${
                lot.status === LotStatus.QUARANTINED ? 'bg-red-100 text-red-700' : 
                lot.status === LotStatus.RELEASED ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            }`}>
                {lot.status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">{lot.productName}</p>
        </div>
        <div className="flex items-center gap-2">
            <button 
                onClick={handleExport}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors" title="Exporter Rapport PDF"
            >
                <Download size={20} />
            </button>
            <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
                <X size={24} />
            </button>
        </div>
      </div>

      {/* Overview Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 md:p-6 bg-white border-b border-slate-200">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Calendar size={14} /> <span className="text-xs uppercase font-semibold">Production</span>
            </div>
            <p className="font-medium text-slate-800">{lot.productionDate}</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Package size={14} /> <span className="text-xs uppercase font-semibold">Taille Lot</span>
            </div>
            <p className="font-medium text-slate-800">{lot.batchSize} {lot.unit}</p>
        </div>
        <div className={`p-3 rounded-lg border ${lot.riskScore > 0.5 ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
            <div className={`flex items-center gap-2 mb-1 ${lot.riskScore > 0.5 ? 'text-red-600' : 'text-emerald-600'}`}>
                <AlertTriangle size={14} /> <span className="text-xs uppercase font-semibold">Risque IA</span>
            </div>
            <p className={`font-bold text-lg ${lot.riskScore > 0.5 ? 'text-red-700' : 'text-emerald-700'}`}>
                {(lot.riskScore * 100).toFixed(1)}%
            </p>
        </div>
      </div>

      {/* Tabs - Horizontal Scroll on Mobile */}
      <div className="flex border-b border-slate-200 px-4 md:px-6 overflow-x-auto whitespace-nowrap">
        <button 
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'timeline' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('timeline')}
        >
            Chronologie
        </button>
        <button 
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'qc' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('qc')}
        >
            Résultats QC
        </button>
        <button 
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'nc' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('nc')}
        >
            Non-Conformités {linkedNCs.length > 0 && <span className="ml-1 bg-red-500 text-white text-xs px-1.5 rounded-full">{linkedNCs.length}</span>}
        </button>
        <button 
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'ai' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('ai')}
        >
            Insights IA
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
        
        {activeTab === 'timeline' && (
            <div className="relative border-l-2 border-slate-200 ml-3 space-y-8">
                {lot.events.map((event, idx) => (
                    <div key={event.id} className="relative pl-8">
                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                            event.eventType.includes('failed') || (event.anomalyScore && event.anomalyScore > 0.5) ? 'bg-red-500' : 'bg-emerald-500'
                        }`}></div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-default">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-semibold text-slate-800 capitalize">{event.eventType.replace(/_/g, ' ')}</span>
                                <span className="text-xs text-slate-400">{new Date(event.timestamp).toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{event.details}</p>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">{event.actor}</span>
                                {event.anomalyScore !== undefined && event.anomalyScore > 0 && (
                                    <span className={`px-2 py-0.5 rounded font-medium ${event.anomalyScore > 0.5 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        Anomalie: {(event.anomalyScore * 100).toFixed(0)}%
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {activeTab === 'qc' && (
            <div className="space-y-4">
                {lot.qcResults.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">Aucun résultat QC enregistré.</div>
                ) : (
                    lot.qcResults.map((res) => (
                        <div key={res.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${res.result === 'pass' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                    {res.result === 'pass' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-semibold text-slate-800 truncate">{res.testName}</h4>
                                    <p className="text-xs text-slate-500 truncate">{res.date} • Insp: {res.inspector}</p>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <span className={`block font-bold ${res.result === 'pass' ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {res.result.toUpperCase()}
                                </span>
                                {res.value && (
                                    <span className="text-sm text-slate-600">{res.value} {res.unit}</span>
                                )}
                            </div>
                        </div>
                    ))
                )}
                <button 
                    onClick={() => setIsQCModalOpen(true)}
                    className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-emerald-500 hover:text-emerald-600 transition-colors text-sm font-medium"
                >
                    + Ajouter un résultat QC
                </button>
            </div>
        )}

        {activeTab === 'nc' && (
            <div className="space-y-4">
                {linkedNCs.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                        <CheckCircle className="mx-auto mb-2 opacity-50" size={32} />
                        Aucune Non-Conformité active.
                    </div>
                ) : (
                    linkedNCs.map(nc => (
                         <div key={nc.id} className="bg-white p-4 rounded-lg shadow-sm border border-l-4 border-red-500 flex flex-col sm:flex-row justify-between gap-4">
                             <div>
                                 <div className="flex items-center gap-2 mb-1">
                                     <span className="font-bold text-red-700">{nc.reference}</span>
                                     <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">{nc.severity}</span>
                                 </div>
                                 <p className="text-sm text-slate-700">{nc.description}</p>
                                 <p className="text-xs text-slate-500 mt-2">Source: {nc.source} • Date: {nc.date}</p>
                             </div>
                             <div className="flex flex-col justify-center shrink-0">
                                <span className="px-3 py-1 bg-slate-100 rounded text-xs font-bold text-center">{nc.status}</span>
                             </div>
                         </div>
                    ))
                )}
            </div>
        )}

        {activeTab === 'ai' && (
            <div className="space-y-6">
                <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100">
                    <h3 className="text-sm font-bold text-slate-700 uppercase mb-4 flex items-center gap-2">
                        <TrendingUp size={16} className="text-emerald-500" /> Détection d'anomalies (Temps Réel)
                    </h3>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorAnomaly" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" hide />
                                <YAxis hide />
                                <Tooltip />
                                <Area type="monotone" dataKey="anomaly" stroke="#ef4444" fillOpacity={1} fill="url(#colorAnomaly)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100">
                     <div className="flex justify-between items-center mb-3">
                         <h3 className="text-sm font-bold text-slate-700 uppercase flex items-center gap-2">
                            <Cpu size={16} className="text-purple-500" /> Analyse Gemini
                         </h3>
                         {!aiAnalysis && (
                            <button 
                                onClick={handleAiAnalyze}
                                disabled={isLoadingAi}
                                className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
                            >
                                {isLoadingAi ? 'Analyse en cours...' : 'Lancer Analyse'}
                            </button>
                         )}
                     </div>
                     
                     {aiAnalysis ? (
                         <div className="bg-purple-50 p-4 rounded-md text-sm text-slate-800 leading-relaxed border border-purple-100">
                             {aiAnalysis.split('\n').map((line, i) => <p key={i} className="mb-2 last:mb-0">{line}</p>)}
                         </div>
                     ) : (
                         <div className="text-center py-6 text-slate-400 text-sm">
                             Cliquez pour générer un résumé des risques et recommandations via l'IA.
                         </div>
                     )}
                </div>
            </div>
        )}

      </div>
      
      {/* Footer Actions */}
      <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Fermer</button>
          
          {lot.status !== LotStatus.QUARANTINED && lot.status !== LotStatus.RELEASED && (
               <button 
                    onClick={() => onUpdateStatus(lot.id, LotStatus.QUARANTINED)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm flex items-center gap-2"
               >
                   <AlertTriangle size={16} /> <span className="hidden sm:inline">Mettre en</span> Quarantaine
               </button>
          )}
          
          {(lot.status === LotStatus.QC_PENDING || lot.status === LotStatus.IN_PRODUCTION || lot.status === LotStatus.QUARANTINED) && (
              <button 
                onClick={() => onUpdateStatus(lot.id, LotStatus.RELEASED)}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
              >
                  Valider & Libérer
              </button>
          )}
      </div>
      
      {isQCModalOpen && (
          <AddQCModal onClose={() => setIsQCModalOpen(false)} onSubmit={handleQCSubmit} />
      )}
    </div>
  );
};

export default LotDetail;
