import React, { useState } from 'react';
import { X } from 'lucide-react';
import { QCResult } from '../../../types';

interface AddQCModalProps {
  onClose: () => void;
  onSubmit: (result: Partial<QCResult>) => void;
}

const AddQCModal: React.FC<AddQCModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    testName: 'pH',
    result: 'pass',
    value: '',
    unit: '',
    inspector: 'Sophie Martin'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
        testName: formData.testName,
        result: formData.result as 'pass' | 'fail' | 'n/a',
        value: formData.value ? Number(formData.value) : undefined,
        unit: formData.unit,
        inspector: formData.inspector,
        date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50 rounded-t-xl">
          <h3 className="font-bold text-lg text-slate-800">Ajouter Résultat QC</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Nom du Test</label>
                <input 
                    type="text" 
                    required
                    value={formData.testName}
                    onChange={e => setFormData({...formData, testName: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="ex: pH, Viscosité, Microbiologie"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Valeur</label>
                    <input 
                        type="number" 
                        step="0.01"
                        value={formData.value}
                        onChange={e => setFormData({...formData, value: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
                        placeholder="0.00"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Unité</label>
                    <input 
                        type="text" 
                        value={formData.unit}
                        onChange={e => setFormData({...formData, unit: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
                        placeholder="ex: cP, °C"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Résultat</label>
                <select 
                    value={formData.result}
                    onChange={e => setFormData({...formData, result: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                    <option value="pass">Conforme (PASS)</option>
                    <option value="fail">Non-Conforme (FAIL)</option>
                    <option value="n/a">Non Applicable</option>
                </select>
            </div>
            
            <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Annuler</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg">Enregistrer</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddQCModal;