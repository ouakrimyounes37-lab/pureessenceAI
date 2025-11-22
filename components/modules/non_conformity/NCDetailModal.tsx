import React, { useState } from 'react';
import { X, Save, AlertTriangle } from 'lucide-react';
import { NonConformity, Lot } from '../../../types';

interface NCDetailModalProps {
  nc: NonConformity;
  linkedLot?: Lot;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<NonConformity>) => void;
}

const NCDetailModal: React.FC<NCDetailModalProps> = ({ nc, linkedLot, onClose, onUpdate }) => {
  const [status, setStatus] = useState(nc.status);
  const [note, setNote] = useState(nc.resolutionNotes || '');

  const handleSave = () => {
      onUpdate(nc.id, { status, resolutionNotes: note });
      onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
             <h3 className="font-bold text-lg text-slate-800">Gérer Non-Conformité</h3>
             <span className="text-sm text-slate-500 font-mono">{nc.reference}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
                        <AlertTriangle size={18} />
                        Détails Incident
                    </div>
                    <p className="text-sm text-slate-800 mb-1"><strong>Produit:</strong> {nc.product}</p>
                    <p className="text-sm text-slate-800 mb-1"><strong>Sévérité:</strong> {nc.severity}</p>
                    <p className="text-sm text-slate-800 mb-1"><strong>Source:</strong> {nc.source}</p>
                    <p className="text-sm text-slate-600 mt-3 italic">"{nc.description}"</p>
                </div>
                
                {linkedLot && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-bold text-blue-800 text-sm mb-2">Lot Impacté</h4>
                        <p className="text-sm text-slate-700">Lot #: {linkedLot.lotNumber}</p>
                        <p className="text-sm text-slate-700">Statut Actuel: {linkedLot.status}</p>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Mettre à jour le statut</label>
                    <select 
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="Nouveau">Nouveau</option>
                        <option value="En Cours">En Cours (Investigation)</option>
                        <option value="Clôturé">Clôturé (Résolu)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Notes de Résolution / Investigation</label>
                    <textarea 
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        placeholder="Détaillez les actions correctives..."
                    ></textarea>
                </div>
            </div>
        </div>
        
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium text-sm">Annuler</button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 flex items-center gap-2">
                <Save size={16} /> Enregistrer Modifications
            </button>
        </div>
      </div>
    </div>
  );
};

export default NCDetailModal;