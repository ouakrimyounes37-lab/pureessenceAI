
import React, { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle, XCircle, Play, AlertTriangle, RefreshCw } from 'lucide-react';
import { Lot } from '../../../types';

interface InspectionModuleProps {
  notify: (msg: string, type: 'success' | 'error' | 'info') => void;
  pendingLots: Lot[];
  onInspectionResult: (lotId: string, passed: boolean, imageUrl: string, comments: string) => void;
}

const InspectionModule: React.FC<InspectionModuleProps> = ({ notify, pendingLots, onInspectionResult }) => {
  const [selectedLotId, setSelectedLotId] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'success' | 'failure' | null>(null);
  const [detectedDefects, setDetectedDefects] = useState<string[]>([]);
  
  const handleStartScan = () => {
      if (!selectedLotId) {
          notify("Veuillez sélectionner un lot à inspecter", "error");
          return;
      }
      setIsScanning(true);
      setScanResult(null);
      setDetectedDefects([]);

      // Simulate Analysis Time
      setTimeout(() => {
          setIsScanning(false);
          // Randomize result for simulation purposes
          const isSuccess = Math.random() > 0.3; 
          setScanResult(isSuccess ? 'success' : 'failure');
          if (!isSuccess) {
              setDetectedDefects(['Défaut d\'étiquetage', 'Niveau de remplissage incorrect']);
          }
      }, 2500);
  };

  const handleValidation = (forcedResult?: boolean) => {
      const passed = forcedResult !== undefined ? forcedResult : (scanResult === 'success');
      const defects = detectedDefects.join(', ');
      onInspectionResult(selectedLotId, passed, 'simulation_url', defects);
      setScanResult(null);
      setSelectedLotId('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 md:pb-0">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Inspection Visuelle IA</h2>
            <p className="text-slate-500">Workflow de contrôle qualité automatisé</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <select 
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white w-full sm:min-w-[200px]"
                value={selectedLotId}
                onChange={(e) => setSelectedLotId(e.target.value)}
            >
                <option value="">-- Sélectionner un Lot --</option>
                {pendingLots.map(lot => (
                    <option key={lot.id} value={lot.id}>{lot.lotNumber} - {lot.productName}</option>
                ))}
            </select>
             <button 
                onClick={handleStartScan}
                disabled={!selectedLotId || isScanning}
                className={`text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors w-full sm:w-auto ${
                    !selectedLotId || isScanning ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
            >
                {isScanning ? <RefreshCw className="animate-spin" size={18} /> : <Camera size={18} />}
                {isScanning ? 'Analyse...' : 'Lancer'}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Feed Simulation */}
          <div className="bg-slate-900 rounded-xl overflow-hidden relative aspect-video shadow-lg flex flex-col">
              <div className="flex-1 flex items-center justify-center relative">
                  {isScanning && (
                      <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center z-10">
                          <div className="w-full h-1 bg-red-500 absolute top-1/2 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.8)]"></div>
                          <span className="bg-black/70 text-white px-4 py-2 rounded text-sm font-mono">ANALYSE IA ACTIVE...</span>
                      </div>
                  )}
                  
                  {!selectedLotId ? (
                       <div className="text-slate-500 flex flex-col items-center">
                           <Camera size={48} className="mb-2 opacity-50" />
                           <span>En attente de lot...</span>
                       </div>
                  ) : (
                      <div className="relative w-full h-full bg-slate-800 flex items-center justify-center">
                          {/* Placeholder for product image */}
                          <div className="w-32 h-64 bg-white/10 rounded-lg border-2 border-white/20 backdrop-blur-sm"></div>
                          {scanResult === 'failure' && (
                              <div className="absolute top-10 right-10 bg-red-600/90 text-white px-3 py-1 rounded flex items-center gap-2 animate-bounce">
                                  <AlertTriangle size={16} /> DÉFAUT DÉTECTÉ
                              </div>
                          )}
                      </div>
                  )}
              </div>

              {/* Footer Overlay */}
              <div className="p-4 bg-gradient-to-t from-black/90 to-black/40 text-white flex justify-between items-end">
                  <div>
                      <p className="font-mono text-sm text-slate-300">Lot Actif: {selectedLotId ? pendingLots.find(l => l.id === selectedLotId)?.lotNumber : 'N/A'}</p>
                      <p className={`font-mono text-xs ${scanResult === 'failure' ? 'text-red-400' : 'text-emerald-400'}`}>
                          Status IA: {isScanning ? 'Scanning...' : scanResult ? scanResult.toUpperCase() : 'PRÊT'}
                      </p>
                  </div>
                  {scanResult && (
                      <div className="flex gap-2">
                          <button onClick={() => handleValidation(false)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs font-bold">
                              REJETER (NC)
                          </button>
                          <button onClick={() => handleValidation(true)} className="bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded text-xs font-bold">
                              VALIDER
                          </button>
                      </div>
                  )}
              </div>
          </div>

          {/* Results & Logs */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
              <h3 className="font-bold text-slate-800 mb-4">Résultats de l'Analyse</h3>
              
              <div className="flex-1 bg-slate-50 rounded-lg border border-slate-100 p-4 mb-4 overflow-y-auto min-h-[200px]">
                  {detectedDefects.length > 0 ? (
                      <div className="space-y-3">
                          <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                              <h4 className="text-red-800 font-bold text-sm mb-2 flex items-center gap-2">
                                  <XCircle size={16} /> Non-Conformités Détectées
                              </h4>
                              <ul className="list-disc list-inside text-sm text-red-700">
                                  {detectedDefects.map((d, i) => <li key={i}>{d}</li>)}
                              </ul>
                          </div>
                          <div className="text-xs text-slate-500 italic mt-2">
                              Une Non-Conformité sera automatiquement créée si vous confirmez le rejet.
                          </div>
                      </div>
                  ) : scanResult === 'success' ? (
                      <div className="h-full flex flex-col items-center justify-center text-emerald-600">
                          <CheckCircle size={48} className="mb-3" />
                          <span className="font-bold">Inspection Conforme</span>
                          <span className="text-sm text-slate-500">Aucun défaut visible détecté.</span>
                      </div>
                  ) : (
                      <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                          Les résultats s'afficheront ici après le scan.
                      </div>
                  )}
              </div>

              <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Lots en attente ({pendingLots.length})</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                      {pendingLots.map(lot => (
                          <div key={lot.id} className="flex justify-between items-center text-sm p-2 hover:bg-slate-50 rounded cursor-pointer" onClick={() => setSelectedLotId(lot.id)}>
                              <span className="font-medium text-slate-700">{lot.lotNumber}</span>
                              <span className="text-xs text-slate-500">{lot.productName}</span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default InspectionModule;
