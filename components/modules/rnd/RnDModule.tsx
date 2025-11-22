
import React, { useState } from 'react';
import { Formula } from '../../../types';
import { FlaskConical, Zap, BarChart3, Edit2, Eye, Lock } from 'lucide-react';
import FormulaEditorModal from './FormulaEditorModal';

interface RnDModuleProps {
  formulas: Formula[];
  notify: (msg: string, type: 'success' | 'error' | 'info') => void;
  onAddFormula: (f: Partial<Formula>) => void;
  onUpdateFormula: (id: string, updates: Partial<Formula>, note?: string) => void;
  onOptimize: (id: string) => void;
  isReadOnly?: boolean;
}

const RnDModule: React.FC<RnDModuleProps> = ({ formulas, notify, onAddFormula, onUpdateFormula, onOptimize, isReadOnly = false }) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingFormula, setEditingFormula] = useState<Formula | undefined>(undefined);

  const handleOpenNew = () => {
      if (isReadOnly) return;
      setEditingFormula(undefined);
      setIsEditorOpen(true);
  };

  const handleOpenEdit = (formula: Formula) => {
      setEditingFormula(formula);
      setIsEditorOpen(true);
  };

  const handleSubmit = (data: Partial<Formula>, note?: string) => {
      if (isReadOnly) return;
      if (editingFormula) {
          onUpdateFormula(editingFormula.id, data, note);
      } else {
          onAddFormula(data);
      }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">R&D & Formulation</h2>
            <p className="text-slate-500">Bureau d'études et simulations IA</p>
        </div>
        {!isReadOnly ? (
            <button 
                onClick={handleOpenNew}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors shadow-sm"
            >
                <FlaskConical size={18} /> Nouvelle Formule
            </button>
        ) : (
             <div className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1">
                <Lock size={12} /> Lecture Seule
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {formulas.map(formula => (
              <div key={formula.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all group relative">
                  <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                          <div>
                              <h3 className="font-bold text-slate-900">{formula.name}</h3>
                              <span className="text-xs text-slate-500 font-mono">{formula.version}</span>
                          </div>
                          <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${
                              formula.status === 'Validé' ? 'bg-green-100 text-green-700' : 
                              formula.status === 'Test' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                          }`}>
                              {formula.status}
                          </span>
                      </div>
                      
                      <div className="space-y-3 mt-4">
                          <div>
                              <div className="flex justify-between text-xs mb-1 text-slate-600">
                                  <span>Stabilité Estimée (IA)</span>
                                  <span className="font-bold">{formula.stabilityScore}%</span>
                              </div>
                              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-purple-500" style={{ width: `${formula.stabilityScore}%` }}></div>
                              </div>
                          </div>
                           <div>
                              <div className="flex justify-between text-xs mb-1 text-slate-600">
                                  <span>Score Allergène</span>
                                  <span className="font-bold">{formula.allergensScore}/10</span>
                              </div>
                              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div className={`h-full ${formula.allergensScore > 5 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${(formula.allergensScore / 10) * 100}%` }}></div>
                              </div>
                          </div>
                          {formula.cost && (
                              <div className="pt-2 border-t border-slate-100 flex justify-between text-sm">
                                  <span className="text-slate-500">Coût estimé:</span>
                                  <span className="font-bold text-slate-800">{formula.cost}€ /kg</span>
                              </div>
                          )}
                      </div>
                  </div>
                  <div className="bg-slate-50 p-3 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-xs text-slate-500">{formula.ingredientsCount} ingrédients</span>
                      <div className="flex gap-3">
                          <button 
                            onClick={() => handleOpenEdit(formula)}
                            className="text-xs font-medium text-slate-500 flex items-center gap-1 hover:text-purple-600 transition-colors"
                          >
                              {isReadOnly ? <Eye size={14} /> : <Edit2 size={14} />} {isReadOnly ? 'Voir' : 'Modifier'}
                          </button>
                          {!isReadOnly && (
                            <button 
                                onClick={() => onOptimize(formula.id)}
                                className="text-xs font-medium text-purple-600 flex items-center gap-1 hover:underline"
                            >
                                <Zap size={14} /> Optimiser
                            </button>
                          )}
                      </div>
                  </div>
              </div>
          ))}
      </div>

      {isEditorOpen && (
          <FormulaEditorModal 
            initialFormula={editingFormula}
            onClose={() => setIsEditorOpen(false)} 
            onSubmit={handleSubmit} 
          />
      )}
    </div>
  );
};

export default RnDModule;
