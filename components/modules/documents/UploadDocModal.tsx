import React, { useState } from 'react';
import { X, UploadCloud } from 'lucide-react';
import { QualityDoc } from '../../../types';

interface UploadDocModalProps {
  onClose: () => void;
  onSubmit: (doc: Partial<QualityDoc>, file: File | null) => void;
}

const UploadDocModal: React.FC<UploadDocModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Procédure',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          setSelectedFile(e.target.files[0]);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
        title: formData.title,
        category: formData.category,
        fileType: selectedFile?.name.split('.').pop() || 'pdf'
    }, selectedFile);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50 rounded-t-xl">
          <h3 className="font-bold text-lg text-slate-800">Uploader Document</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Titre Document</label>
                <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Catégorie</label>
                <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white outline-none"
                >
                    <option>Procédure</option>
                    <option>Certificat</option>
                    <option>Rapport</option>
                    <option>Hygiène</option>
                    <option>Formation</option>
                </select>
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 hover:border-emerald-400 transition-colors relative">
                <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" required />
                <UploadCloud className="mx-auto text-slate-400 mb-2" size={32} />
                {selectedFile ? (
                    <p className="text-sm font-bold text-emerald-600">{selectedFile.name}</p>
                ) : (
                    <>
                        <p className="text-sm font-medium text-slate-600">Cliquez pour choisir un fichier</p>
                        <p className="text-xs text-slate-400 mt-1">PDF, DOCX, PNG (Max 10Mo)</p>
                    </>
                )}
            </div>
            
            <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Annuler</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg">Uploader</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default UploadDocModal;