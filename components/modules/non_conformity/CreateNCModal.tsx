
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { NonConformity, Lot } from '../../../types';

interface CreateNCModalProps {
  onClose: () => void;
  onSubmit: (data: Partial<NonConformity>) => void;
  availableLots?: Lot[];
}

const CreateNCModal: React.FC<CreateNCModalProps> = ({ onClose, onSubmit, availableLots = [] }) => {
  const [formData, setFormData] = useState({
    source: 'Interne',
    product: '',
    lotId: '',
    severity: 'Mineure',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
        source: formData.source as any,
        product: formData.product,
        lotId: formData.lotId,
        severity: formData.severity as any,
        description: formData.description
    });
    onClose();
  };

  const handleLotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const lotId = e.target.value;
      const selectedLot = availableLots.find(l => l.id === lotId);
      setFormData({
          ...formData, 
          lotId: lotId,
          product: selectedLot ? selectedLot.productName : formData.product
      });
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800">Déclarer Non-Conformité</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase">Source</label>
                    <select 
                        value={formData.source}
                        onChange={(e) => setFormData({...formData, source: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-red-500 outline-none"
                    >
                        <option value="Interne">Interne</option>
                        <option value="Réclamation Client">Réclamation Client</option>
                        <option value="Inspection IA">Inspection IA</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase">Sévérité</label>
                    <select 
                        value={formData.severity}
                        onChange={(e) => setFormData({...formData, severity: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-red-500 outline-none"
                    >
                        <option value="Mineure">Mineure</option>
                        <option value="Majeure">Majeure</option>
                        <option value="Critique">Critique</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase">Lier au Lot (Optionnel)</label>
                <select 
                    value={formData.lotId}
                    onChange={handleLotChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-red-500 outline-none mb-2"
                >
                    <option value="">-- Aucun --</option>
                    {availableLots.map(lot => (
                        <option key={lot.id} value={lot.id}>{lot.lotNumber} - {lot.productName}</option>
                    ))}
                </select>
                {formData.lotId && (
                    <p className="text-xs text-orange-600">
                        ⚠️ Une sévérité Majeure/Critique mettra automatiquement ce lot en quarantaine.
                    </p>
                )}
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase">Produit Concerné</label>
                <input 
                    type="text" 
                    value={formData.product}
                    onChange={(e) => setFormData({...formData, product: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none" 
                    placeholder={!formData.lotId ? "Nom du produit..." : "Auto-rempli par lot"}
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase">Description du Problème</label>
                <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm h-24 focus:ring-2 focus:ring-red-500 outline-none resize-none"
                    placeholder="Décrivez l'incident..."
                    required
                ></textarea>
            </div>

            <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Annuler</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm">Déclarer</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNCModal;
