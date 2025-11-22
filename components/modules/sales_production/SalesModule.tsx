import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { TrendingUp, RefreshCw } from 'lucide-react';

interface SalesModuleProps {
  notify: (msg: string, type: 'success' | 'error' | 'info') => void;
}

const data = [
  { name: 'Lun', sales: 4000, prod: 2400 },
  { name: 'Mar', sales: 3000, prod: 1398 },
  { name: 'Mer', sales: 2000, prod: 9800 },
  { name: 'Jeu', sales: 2780, prod: 3908 },
  { name: 'Ven', sales: 1890, prod: 4800 },
  { name: 'Sam', sales: 2390, prod: 3800 },
  { name: 'Dim', sales: 3490, prod: 4300 },
];

const SalesModule: React.FC<SalesModuleProps> = ({ notify }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Ventes & Production</h2>
            <p className="text-slate-500">Prévisions IA et Planification Industrielle</p>
        </div>
        <button 
            onClick={() => notify('Plan de production recalculé avec succès', 'success')}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors"
        >
            <RefreshCw size={18} /> Recalculer Plan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <TrendingUp size={20} className="text-blue-500" /> Prévisions Ventes vs Production
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="sales" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSales)" />
                        <Area type="monotone" dataKey="prod" stroke="#10b981" fill="transparent" strokeDasharray="5 5" />
                    </AreaChart>
                </ResponsiveContainer>
              </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-6">Plan de Charge Hebdomadaire</h3>
               <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="prod" fill="#10b981" radius={[4, 4, 0, 0]} name="Unités Produites" />
                    </BarChart>
                </ResponsiveContainer>
              </div>
          </div>
      </div>
    </div>
  );
};

export default SalesModule;