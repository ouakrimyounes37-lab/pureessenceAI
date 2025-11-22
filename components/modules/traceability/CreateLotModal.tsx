
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Lot } from '../../../types';

interface CreateLotModalProps {
  onClose: () => void;
  onSubmit: (data: Partial<Lot> & { notes?: string }) => void;
}

const CreateLotModal: React.FC<CreateLotModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    lotNumber: `PE-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
    productName: 'Huile d\'Argan Bio',
    batchSize: 100,
    unit: 'Unités',
    productionDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
        lotNumber: formData.lotNumber,
        productName: formData.productName,
        batchSize: Number(formData.batchSize),
        unit: formData.unit,
        productionDate: formData.productionDate,
        // Simulated expiry
        expiryDate: new Date(new Date(formData.productionDate).setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0],
        notes: formData.notes
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800">Nouveau Lot de Production</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase">Numéro Lot</label>
                    <input 
                        type="text" 
                        required
                        value={formData.lotNumber}
                        onChange={(e) => setFormData({...formData, lotNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" 
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase">Produit</label>
                    <select 
                        value={formData.productName}
                        onChange={(e) => setFormData({...formData, productName: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white"
                    >
                        <option value="Huile d'Argan Bio">Huile d'Argan Bio</option>
                        <option value="Sérum Vitamine C">Sérum Vitamine C</option>
                        <option value="Crème Hydratante">Crème Hydratante</option>
                        <option value="Savon Noir">Savon Noir</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase">Taille Batch</label>
                    <div className="flex">
                        <input 
                            type="number" 
                            min="1"
                            value={formData.batchSize}
                            onChange={(e) => setFormData({...formData, batchSize: Number(e.target.value)})}
                            className="w-full px-3 py-2 border border-slate-300 rounded-l-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" 
                        />
                        <select 
                            value={formData.unit}
                            onChange={(e) => setFormData({...formData, unit: e.target.value})}
                            className="bg-slate-100 border border-l-0 border-slate-300 px-2 py-2 text-sm text-slate-600 rounded-r-lg outline-none"
                        >
                            <option value="Unités">Unités</option>
                            <option value="kg">kg</option>
                            <option value="L">L</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase">Date Prod.</label>
                    <input 
                        type="date" 
                        value={formData.productionDate}
                        onChange={(e) => setFormData({...formData, productionDate: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" 
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase">Notes</label>
                <textarea 
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm h-20 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                    placeholder="Observations initiales..."
                ></textarea>
            </div>

            <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Annuler</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm">Créer Lot</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLotModal;
