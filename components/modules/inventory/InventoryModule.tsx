
import React, { useState } from 'react';
import { InventoryItem } from '../../../types';
import { Package, AlertTriangle, ArrowRightLeft, Lock } from 'lucide-react';
import StockMovementModal from './StockMovementModal';

interface InventoryModuleProps {
  items: InventoryItem[];
  notify: (msg: string, type: 'success' | 'error' | 'info') => void;
  onStockMovement: (itemId: string, type: 'IN' | 'OUT', quantity: number, reason: string) => void;
  isReadOnly?: boolean;
}

const InventoryModule: React.FC<InventoryModuleProps> = ({ items, notify, onStockMovement, isReadOnly = false }) => {
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [filter, setFilter] = useState('');

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(filter.toLowerCase()) || 
    i.reference.toLowerCase().includes(filter.toLowerCase())
  );

  const lowStockCount = items.filter(i => i.status !== 'In Stock').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Gestion des Stocks</h2>
            <p className="text-slate-500">Matières Premières et Emballages</p>
        </div>
        {!isReadOnly ? (
            <button 
                onClick={() => setIsMovementModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
            >
                <ArrowRightLeft size={18} /> Mouvement Stock
            </button>
        ) : (
             <div className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1">
                <Lock size={12} /> Lecture Seule
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-2 text-slate-500">
                  <Package size={20} />
                  <span className="text-xs font-bold uppercase">Total Références</span>
              </div>
              <p className="text-3xl font-bold text-slate-800">{items.length}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-2 text-orange-600">
                  <AlertTriangle size={20} />
                  <span className="text-xs font-bold uppercase">Alertes Stock Bas</span>
              </div>
              <p className="text-3xl font-bold text-orange-700">{lowStockCount}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-2 text-slate-500">
                  <span className="text-xs font-bold uppercase">Valeur Totale Est.</span>
              </div>
              <p className="text-3xl font-bold text-slate-800">45,200 €</p>
          </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
            <input 
                type="text" 
                placeholder="Rechercher article..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="w-full md:w-64 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
        <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase border-b border-slate-200">
                <tr>
                    <th className="px-6 py-4">Référence</th>
                    <th className="px-6 py-4">Article</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4 text-center">Quantité</th>
                    <th className="px-6 py-4 text-center">Seuil Min</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4">Fournisseur</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {filteredItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-slate-500">{item.reference}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">{item.name}</td>
                        <td className="px-6 py-4 text-slate-600">{item.type === 'Raw Material' ? 'Matière Première' : 'Emballage'}</td>
                        <td className="px-6 py-4 text-center font-bold text-slate-800">{item.quantity} {item.unit}</td>
                        <td className="px-6 py-4 text-center text-slate-500">{item.minThreshold}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                item.status === 'Critical' ? 'bg-red-100 text-red-700' :
                                item.status === 'Low' ? 'bg-orange-100 text-orange-700' :
                                'bg-green-100 text-green-700'
                            }`}>
                                {item.status === 'In Stock' ? 'En Stock' : item.status === 'Low' ? 'Bas' : 'Critique'}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{item.supplier}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {isMovementModalOpen && (
          <StockMovementModal 
            items={items}
            onClose={() => setIsMovementModalOpen(false)}
            onSubmit={onStockMovement}
          />
      )}
    </div>
  );
};

export default InventoryModule;
