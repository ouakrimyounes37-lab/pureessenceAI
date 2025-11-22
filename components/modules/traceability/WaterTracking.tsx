
import React, { useState } from 'react';
import { WaterQualityCheck } from '../../../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Droplets, AlertTriangle, CheckCircle, Plus, Lock } from 'lucide-react';
import AddWaterCheckModal from './AddWaterCheckModal';

interface WaterTrackingProps {
  checks: WaterQualityCheck[];
  notify: (msg: string, type: 'success' | 'error' | 'info') => void;
  onAddCheck: (check: Partial<WaterQualityCheck>) => void;
  isReadOnly?: boolean;
}

const WaterTracking: React.FC<WaterTrackingProps> = ({ checks, notify, onAddCheck, isReadOnly = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Prepare chart data (reverse to show chronological left to right)
  const chartData = [...checks].reverse().map(c => ({
      name: c.date.split('-').slice(1).join('/'),
      ph: c.ph,
      cond: c.conductivity
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Droplets className="text-blue-500" /> Qualité de l'Eau
            </h3>
            <p className="text-sm text-slate-500">Suivi journalier pH et Conductivité</p>
        </div>
        {!isReadOnly ? (
             <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm text-sm"
            >
                <Plus size={16} /> Relevé
            </button>
        ) : (
             <div className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1">
                <Lock size={12} /> Lecture Seule
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <h4 className="text-sm font-bold text-slate-600 uppercase mb-4">Tendance pH (Derniers 7 jours)</h4>
              <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                          <defs>
                              <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis domain={[6, 9]} />
                          <Tooltip />
                          <Area type="monotone" dataKey="ph" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPh)" />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-4 border-b border-slate-100 bg-slate-50">
                   <h4 className="text-sm font-bold text-slate-600 uppercase">Historique Relevés</h4>
               </div>
               <div className="overflow-y-auto max-h-60">
                   <table className="w-full text-left text-sm">
                       <thead className="text-xs text-slate-500 bg-slate-50 sticky top-0">
                           <tr>
                               <th className="px-4 py-2">Date</th>
                               <th className="px-4 py-2">Source</th>
                               <th className="px-4 py-2">pH</th>
                               <th className="px-4 py-2">Cond.</th>
                               <th className="px-4 py-2">Statut</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                           {checks.map(check => (
                               <tr key={check.id} className="hover:bg-slate-50">
                                   <td className="px-4 py-2 text-slate-600">{check.date}</td>
                                   <td className="px-4 py-2 text-slate-800 font-medium">{check.source}</td>
                                   <td className="px-4 py-2 text-slate-600">{check.ph}</td>
                                   <td className="px-4 py-2 text-slate-600">{check.conductivity}</td>
                                   <td className="px-4 py-2">
                                       <span className={`flex items-center gap-1 text-xs font-bold ${check.status === 'Conforme' ? 'text-green-600' : 'text-red-600'}`}>
                                           {check.status === 'Conforme' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                                           {check.status}
                                       </span>
                                   </td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
               </div>
          </div>
      </div>

      {isModalOpen && (
          <AddWaterCheckModal 
            onClose={() => setIsModalOpen(false)}
            onSubmit={onAddCheck}
          />
      )}
    </div>
  );
};

export default WaterTracking;
