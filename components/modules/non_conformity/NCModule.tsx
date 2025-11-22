
import React, { useState } from 'react';
import { NonConformity, Lot } from '../../../types';
import { AlertTriangle, Filter, Plus, Lock } from 'lucide-react';
import CreateNCModal from './CreateNCModal';
import NCDetailModal from './NCDetailModal';

interface NCModuleProps {
  ncs: NonConformity[];
  availableLots: Lot[];
  notify: (msg: string, type: 'success' | 'error' | 'info') => void;
  onCreateNC: (data: Partial<NonConformity>) => void;
  onUpdateNC: (id: string, updates: Partial<NonConformity>) => void;
  isReadOnly?: boolean;
}

const NCModule: React.FC<NCModuleProps> = ({ ncs, availableLots, notify, onCreateNC, onUpdateNC, isReadOnly = false }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedNC, setSelectedNC] = useState<NonConformity | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Non-Conformités & Réclamations</h2>
            <p className="text-slate-500">Gestion des incidents et actions correctives</p>
        </div>
        {!isReadOnly && (
            <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors shadow-sm"
            >
                <Plus size={18} /> Déclarer NC
            </button>
        )}
        {isReadOnly && (
            <div className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1">
                <Lock size={12} /> Lecture Seule
            </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-4">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-md text-sm hover:bg-slate-200">
                <Filter size={16} /> Filtrer
            </button>
        </div>
        <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase border-b border-slate-200">
                <tr>
                    <th className="px-6 py-4">Référence</th>
                    <th className="px-6 py-4">Source</th>
                    <th className="px-6 py-4">Produit</th>
                    <th className="px-6 py-4">Lot Lié</th>
                    <th className="px-6 py-4">Sévérité</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {ncs.map(nc => (
                    <tr key={nc.id} className="hover:bg-slate-50 group transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{nc.reference}</td>
                        <td className="px-6 py-4">{nc.source}</td>
                        <td className="px-6 py-4">{nc.product}</td>
                        <td className="px-6 py-4 text-xs font-mono text-slate-500">
                            {nc.lotId ? availableLots.find(l => l.id === nc.lotId)?.lotNumber || nc.lotId : '-'}
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                nc.severity === 'Critique' ? 'bg-red-100 text-red-700' : 
                                nc.severity === 'Majeure' ? 'bg-orange-100 text-orange-700' : 
                                'bg-blue-100 text-blue-700'
                            }`}>
                                {nc.severity}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                nc.status === 'Nouveau' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                nc.status === 'En Cours' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                                'bg-gray-100 text-gray-600 border-gray-200'
                            }`}>
                                {nc.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button 
                                onClick={() => setSelectedNC(nc)}
                                className="text-slate-400 hover:text-emerald-600 font-medium"
                            >
                                {isReadOnly ? 'Voir' : 'Gérer'}
                            </button>
                        </td>
                    </tr>
                ))}
                {ncs.length === 0 && (
                    <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                            Aucune non-conformité déclarée.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>

      {isCreateModalOpen && (
          <CreateNCModal 
            onClose={() => setIsCreateModalOpen(false)} 
            onSubmit={onCreateNC}
            availableLots={availableLots}
          />
      )}

      {selectedNC && (
          <NCDetailModal
            nc={selectedNC}
            linkedLot={availableLots.find(l => l.id === selectedNC.lotId)}
            onClose={() => setSelectedNC(null)}
            onUpdate={isReadOnly ? () => {} : onUpdateNC} // No-op if read-only
          />
      )}
    </div>
  );
};

export default NCModule;
