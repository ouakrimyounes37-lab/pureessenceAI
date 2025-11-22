import React, { useState } from 'react';
import { QualityDoc } from '../../../types';
import { FileText, Upload, Search, Download, Eye, Trash2 } from 'lucide-react';
import UploadDocModal from './UploadDocModal';

interface DocModuleProps {
  docs: QualityDoc[];
  notify: (msg: string, type: 'success' | 'error' | 'info') => void;
  onAddDoc: (doc: Partial<QualityDoc>, file: File | null) => void;
  onDeleteDoc: (id: string) => void;
}

const DocModule: React.FC<DocModuleProps> = ({ docs, notify, onAddDoc, onDeleteDoc }) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handlePreview = (doc: QualityDoc) => {
      if (doc.fileUrl) {
          window.open(doc.fileUrl, '_blank');
      } else {
          // Mock preview for pre-existing data
          window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank');
      }
  };

  const handleDownload = (doc: QualityDoc) => {
      if (doc.fileUrl) {
          const a = document.createElement('a');
          a.href = doc.fileUrl;
          a.download = `${doc.title}.${doc.fileType}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          notify('Téléchargement lancé...', 'success');
      } else {
          // Create a dummy download for mock data
          const blob = new Blob(['Contenu simulé du document ' + doc.title], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${doc.title}.txt`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          notify('Fichier simulé téléchargé', 'success');
      }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Documents Qualité (GED)</h2>
            <p className="text-slate-500">Procédures, Certificats et Rapports ISO 9001</p>
        </div>
        <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm"
        >
            <Upload size={18} /> Nouveau Document
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {docs.map(doc => (
              <div key={doc.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all group relative">
                  <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-slate-100 rounded-lg text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                          <FileText size={24} />
                      </div>
                      <span className={`px-2 py-0.5 text-xs font-bold rounded uppercase ${
                          doc.status === 'Approuvé' ? 'bg-green-100 text-green-700' : 
                          doc.status === 'En Révision' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-slate-100 text-slate-600'
                      }`}>
                          {doc.status}
                      </span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1 truncate" title={doc.title}>{doc.title}</h3>
                  <p className="text-xs text-slate-500 mb-4">{doc.category} • {doc.version} • {doc.date}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-xs text-slate-400">Par {doc.author}</span>
                      <div className="flex gap-1">
                        <button 
                            onClick={() => handlePreview(doc)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Aperçu"
                        >
                            <Eye size={16} />
                        </button>
                        <button 
                            onClick={() => handleDownload(doc)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                            title="Télécharger"
                        >
                            <Download size={16} />
                        </button>
                        <button 
                            onClick={() => {
                                if(window.confirm("Supprimer ce document ?")) onDeleteDoc(doc.id);
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Supprimer"
                        >
                            <Trash2 size={16} />
                        </button>
                      </div>
                  </div>
              </div>
          ))}
      </div>

      {isUploadModalOpen && (
          <UploadDocModal 
            onClose={() => setIsUploadModalOpen(false)} 
            onSubmit={onAddDoc}
          />
      )}
    </div>
  );
};

export default DocModule;