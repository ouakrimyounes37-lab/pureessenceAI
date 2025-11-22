
import React, { useState } from 'react';
import { Lot, LotStatus } from '../../../types';
import { Eye, AlertCircle, FileText, CheckCircle2, Clock, XCircle, Box, Lock } from 'lucide-react';

interface LotListProps {
  lots: Lot[];
  onSelectLot: (lot: Lot) => void;
  onCreateLot: () => void;
  isReadOnly?: boolean;
}

const StatusBadge: React.FC<{ status: LotStatus }> = ({ status }) => {
  const styles = {
    [LotStatus.CREATED]: 'bg-slate-100 text-slate-700 border-slate-200',
    [LotStatus.IN_PRODUCTION]: 'bg-blue-50 text-blue-700 border-blue-200',
    [LotStatus.QC_PENDING]: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    [LotStatus.QC_PASSED]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    [LotStatus.QC_FAILED]: 'bg-red-50 text-red-700 border-red-200',
    [LotStatus.QUARANTINED]: 'bg-orange-50 text-orange-700 border-orange-200',
    [LotStatus.RELEASED]: 'bg-green-100 text-green-800 border-green-300',
    [LotStatus.SHIPPED]: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };

  const labels = {
    [LotStatus.CREATED]: 'Créé',
    [LotStatus.IN_PRODUCTION]: 'En Prod.',
    [LotStatus.QC_PENDING]: 'Attente QC',
    [LotStatus.QC_PASSED]: 'QC Valide',
    [LotStatus.QC_FAILED]: 'QC Échoué',
    [LotStatus.QUARANTINED]: 'Quarantaine',
    [LotStatus.RELEASED]: 'Libéré',
    [LotStatus.SHIPPED]: 'Expédié',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

const LotList: React.FC<LotListProps> = ({ lots, onSelectLot, onCreateLot, isReadOnly = false }) => {
  const [filter, setFilter] = useState('');

  const filteredLots = lots.filter(lot => 
    lot.lotNumber.toLowerCase().includes(filter.toLowerCase()) ||
    lot.productName.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 md:p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
        <div>
           <h2 className="text-lg font-semibold text-slate-800">Lots de Production</h2>
           <p className="text-sm text-slate-500">Gérez le cycle de vie de vos lots en temps réel.</p>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
            <input 
                type="text" 
                placeholder="Filtrer..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="flex-1 sm:flex-none px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            {!isReadOnly ? (
                <button 
                    onClick={onCreateLot}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
                >
                    <Box size={16} /> <span className="hidden sm:inline">Nouveau Lot</span><span className="sm:hidden">Créer</span>
                </button>
            ) : (
                <div className="bg-slate-100 text-slate-500 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1 whitespace-nowrap">
                    <Lock size={12} /> Lecture Seule
                </div>
            )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
              <th className="px-6 py-4">Numéro Lot</th>
              <th className="px-6 py-4">Produit</th>
              <th className="px-6 py-4">Date Prod.</th>
              <th className="px-6 py-4">Taille</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4 text-center">Score Risque</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLots.map((lot) => (
              <tr key={lot.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => onSelectLot(lot)}>
                <td className="px-6 py-4 font-medium text-slate-900">{lot.lotNumber}</td>
                <td className="px-6 py-4 text-slate-600">{lot.productName}</td>
                <td className="px-6 py-4 text-slate-500 text-sm">{lot.productionDate}</td>
                <td className="px-6 py-4 text-slate-500 text-sm">{lot.batchSize} {lot.unit}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={lot.status} />
                </td>
                <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full ${lot.riskScore > 0.5 ? 'bg-red-500' : lot.riskScore > 0.2 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                style={{ width: `${lot.riskScore * 100}%` }}
                            ></div>
                        </div>
                        <span className={`text-xs font-bold ${lot.riskScore > 0.5 ? 'text-red-600' : 'text-slate-600'}`}>
                            {(lot.riskScore * 100).toFixed(0)}%
                        </span>
                    </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onSelectLot(lot); }}
                    className="text-slate-400 hover:text-emerald-600 transition-colors p-1"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLots.length === 0 && (
            <div className="p-12 text-center text-slate-400">
                Aucun lot trouvé.
            </div>
        )}
      </div>
    </div>
  );
};

export default LotList;
