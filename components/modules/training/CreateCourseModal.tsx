import React, { useState } from 'react';
import { X, BookOpen, Video, FileText } from 'lucide-react';
import { TrainingCourse } from '../../../types';

interface CreateCourseModalProps {
  onClose: () => void;
  onSubmit: (course: Partial<TrainingCourse>) => void;
}

const CreateCourseModal: React.FC<CreateCourseModalProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('Tous');
  const [dueDate, setDueDate] = useState('');
  const [contentType, setContentType] = useState<'Video' | 'Document'>('Video');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
        title,
        assignedTo,
        dueDate,
        completionRate: 0,
        content: [{ type: contentType }]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50 rounded-t-xl">
          <h3 className="font-bold text-lg text-slate-800">Nouveau Module Formation</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Titre du Module</label>
                <input 
                    type="text" 
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ex: Sécurité Laboratoire"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Type de Contenu</label>
                    <div className="flex gap-2 mt-1">
                        <button 
                            type="button"
                            onClick={() => setContentType('Video')}
                            className={`flex-1 py-2 rounded-lg border text-sm flex flex-col items-center gap-1 ${contentType === 'Video' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-slate-200 text-slate-500'}`}
                        >
                            <Video size={16} /> Vidéo
                        </button>
                        <button 
                            type="button"
                            onClick={() => setContentType('Document')}
                            className={`flex-1 py-2 rounded-lg border text-sm flex flex-col items-center gap-1 ${contentType === 'Document' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-slate-200 text-slate-500'}`}
                        >
                            <FileText size={16} /> Doc
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Échéance</label>
                    <input 
                        type="date" 
                        required
                        value={dueDate}
                        onChange={e => setDueDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm mt-1"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Assigner à</label>
                <select 
                    value={assignedTo}
                    onChange={e => setAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white outline-none"
                >
                    <option value="Tous">Tous les employés</option>
                    <option value="Production">Équipe Production</option>
                    <option value="Qualité">Équipe Qualité</option>
                    <option value="R&D">R&D</option>
                </select>
            </div>
            
            <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Annuler</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Créer</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourseModal;