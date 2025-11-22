
import React, { useState } from 'react';
import { X, ArrowDown, ArrowUp } from 'lucide-react';
import { InventoryItem } from '../../../types';

interface StockMovementModalProps {
  items: InventoryItem[];
  onClose: () => void;
  onSubmit: (itemId: string, type: 'IN' | 'OUT', quantity: number, reason: string) => void;
}

const StockMovementModal: React.FC<StockMovementModalProps> = ({ items, onClose, onSubmit }) => {
  const [selectedItem, setSelectedItem] = useState(items[0]?.id || '');
  const [type, setType] = useState<'IN' | 'OUT'>('OUT');
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;
    onSubmit(selectedItem, type, quantity, reason);
    onClose();
  };

  const currentItem = items.find(i => i.id === selectedItem);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50 rounded-t-xl">
          <h3 className="font-bold text-lg text-slate-800">Mouvement de Stock</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
                <button 
                    type="button"
                    onClick={() => setType('IN')}
                    className={`p-3 rounded-lg border text-sm font-bold flex flex-col items-center gap-1 ${type === 'IN' ? 'bg-green-50 border-green-500 text-green-700' : 'border-slate-200 text-slate-500'}`}
                >
                    <ArrowDown size={20} /> ENTRÉE (Réception)
                </button>
                <button 
                    type="button"
                    onClick={() => setType('OUT')}
                    className={`p-3 rounded-lg border text-sm font-bold flex flex-col items-center gap-1 ${type === 'OUT' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'border-slate-200 text-slate-500'}`}
                >
                    <ArrowUp size={20} /> SORTIE (Consommation)
                </button>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Article</label>
                <select 
                    value={selectedItem}
                    onChange={e => setSelectedItem(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    {items.map(item => (
                        <option key={item.id} value={item.id}>
                            {item.name} ({item.quantity} {item.unit})
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Quantité</label>
                <div className="flex items-center gap-2">
                    <input 
                        type="number" 
                        min="1"
                        value={quantity}
                        onChange={e => setQuantity(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <span className="text-sm text-slate-500 font-medium">{currentItem?.unit}</span>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Motif / Commentaire</label>
                <input 
                    type="text" 
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder={type === 'IN' ? "ex: Livraison Supplier X" : "ex: Production Lot #123"}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Annuler</button>
                <button 
                    type="submit" 
                    className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm ${type === 'IN' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'}`}
                >
                    Valider Mouvement
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default StockMovementModal;
