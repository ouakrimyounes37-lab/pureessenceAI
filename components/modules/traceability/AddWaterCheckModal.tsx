
import React, { useState } from 'react';
import { X, Droplets } from 'lucide-react';
import { WaterQualityCheck } from '../../../types';

interface AddWaterCheckModalProps {
  onClose: () => void;
  onSubmit: (check: Partial<WaterQualityCheck>) => void;
}

const AddWaterCheckModal: React.FC<AddWaterCheckModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    source: 'Osmoseur Ligne 1',
    ph: 7.0,
    conductivity: 400,
    temperature: 20,
    inspector: 'Sondes IoT'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple logic for status: pH must be between 6.5 and 8.0
    const isPhOk = formData.ph >= 6.5 && formData.ph <= 8.0;
    const isCondOk = formData.conductivity < 500;
    const status = (isPhOk && isCondOk) ? 'Conforme' : 'Non-Conforme';

    onSubmit({
        date: new Date().toISOString().split('T')[0],
        source: formData.source,
        ph: Number(formData.ph),
        conductivity: Number(formData.conductivity),
        temperature: Number(formData.temperature),
        status: status as 'Conforme' | 'Non-Conforme',
        inspector: formData.inspector
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50 rounded-t-xl">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Droplets size={20} className="text-blue-500" /> Relevé Qualité Eau
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Source</label>
                <select 
                    value={formData.source}
                    onChange={e => setFormData({...formData, source: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white outline-none"
                >
                    <option>Osmoseur Ligne 1</option>
                    <option>Osmoseur Ligne 2</option>
                    <option>Robinet Labo QC</option>
                    <option>Arrivée Ville</option>
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">pH (6.5 - 8.0)</label>
                    <input 
                        type="number" 
                        step="0.1"
                        required
                        value={formData.ph}
                        onChange={e => setFormData({...formData, ph: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Conductivité (µS/cm)</label>
                    <input 
                        type="number" 
                        required
                        value={formData.conductivity}
                        onChange={e => setFormData({...formData, conductivity: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Température (°C)</label>
                <input 
                    type="number" 
                    step="0.1"
                    required
                    value={formData.temperature}
                    onChange={e => setFormData({...formData, temperature: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
                />
            </div>

             <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Inspecteur / Sonde</label>
                <input 
                    type="text" 
                    value={formData.inspector}
                    onChange={e => setFormData({...formData, inspector: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
                />
            </div>
            
            <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Annuler</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Enregistrer</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddWaterCheckModal;
