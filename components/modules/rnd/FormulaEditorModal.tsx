
import React, { useState, useEffect } from 'react';
import { X, Search, Plus, Trash, FlaskConical, Save, History, Edit2, ArrowRight, Calculator } from 'lucide-react';
import { Formula, Ingredient, FormulaIngredient } from '../../../types';
import { MOCK_INGREDIENTS } from '../../../constants';

interface FormulaEditorModalProps {
  initialFormula?: Formula; // If present, we are in Edit Mode
  onClose: () => void;
  onSubmit: (formula: Partial<Formula>, changeNote?: string) => void;
}

const FormulaEditorModal: React.FC<FormulaEditorModalProps> = ({ initialFormula, onClose, onSubmit }) => {
  const [activeTab, setActiveTab] = useState<'composition' | 'history'>('composition');
  
  // Form State
  const [name, setName] = useState('Nouvelle Formule');
  const [selectedIngredients, setSelectedIngredients] = useState<FormulaIngredient[]>([]);
  const [changeNote, setChangeNote] = useState('');
  
  // Manual override for stability
  const [stabilityScore, setStabilityScore] = useState<number>(0);

  // Load initial data if editing
  useEffect(() => {
      if (initialFormula) {
          setName(initialFormula.name);
          setSelectedIngredients(initialFormula.ingredients || []);
          setStabilityScore(initialFormula.stabilityScore);
      }
  }, [initialFormula]);

  const [searchTerm, setSearchTerm] = useState('');
  
  // State for adding new custom ingredients
  const [isCreatingIngredient, setIsCreatingIngredient] = useState(false);
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>(MOCK_INGREDIENTS);
  
  // Custom Ingredient Form State
  const [newIngName, setNewIngName] = useState('');
  const [newIngInci, setNewIngInci] = useState('');
  const [newIngCost, setNewIngCost] = useState(10);
  const [newIngAllergen, setNewIngAllergen] = useState(false);
  const [newIngStability, setNewIngStability] = useState(0); // -10 to +10

  // Calculations
  const totalPercentage = selectedIngredients.reduce((acc, curr) => acc + curr.percentage, 0);
  const allergenCount = selectedIngredients.reduce((acc, curr) => {
      const ing = allIngredients.find(i => i.id === curr.ingredientId);
      return acc + (ing?.allergen ? 1 : 0);
  }, 0);
  
  // Calculate theoretical stability based on ingredients
  const calculatedStability = Math.min(100, Math.max(0, 100 + selectedIngredients.reduce((acc, curr) => {
      const ing = allIngredients.find(i => i.id === curr.ingredientId);
      return acc + (ing ? ing.stabilityImpact * (curr.percentage / 100) : 0);
  }, 0)));

  const estimatedCost = selectedIngredients.reduce((acc, curr) => {
      const ing = allIngredients.find(i => i.id === curr.ingredientId);
      return acc + (ing ? ing.costPerKg * (curr.percentage / 100) : 0);
  }, 0);

  // Effect: Auto-update stability if it hasn't been manually set drastically different?
  // Simplified: On first load (create mode), sync. Otherwise, let user control.
  useEffect(() => {
      if (!initialFormula && selectedIngredients.length > 0) {
         // In create mode, we might want to auto-update, but user can override.
         // For now, we will just provide a button to "Apply Calculated".
      }
  }, [selectedIngredients, initialFormula]);

  const handleAddIngredient = (ing: Ingredient) => {
      if (selectedIngredients.find(i => i.ingredientId === ing.id)) return;
      setSelectedIngredients([...selectedIngredients, { ingredientId: ing.id, name: ing.name, percentage: 0 }]);
  };

  const handlePercentageChange = (id: string, val: number) => {
      setSelectedIngredients(selectedIngredients.map(i => i.ingredientId === id ? { ...i, percentage: val } : i));
  };

  const handleRemove = (id: string) => {
      setSelectedIngredients(selectedIngredients.filter(i => i.ingredientId !== id));
  };

  const handleCreateCustomIngredient = () => {
      if(!newIngName) return;
      const customIng: Ingredient = {
          id: `custom-${Date.now()}`,
          name: newIngName,
          inci: newIngInci || newIngName,
          function: 'Autre',
          allergen: newIngAllergen,
          costPerKg: newIngCost,
          stabilityImpact: newIngStability
      };
      setAllIngredients([customIng, ...allIngredients]);
      setIsCreatingIngredient(false);
      // Reset form
      setNewIngName('');
      setNewIngInci('');
      setNewIngAllergen(false);
      setNewIngStability(0);
  };

  const handleSubmit = () => {
      const formulaData = {
          name,
          ingredients: selectedIngredients,
          ingredientsCount: selectedIngredients.length,
          allergensScore: allergenCount,
          stabilityScore: Math.round(stabilityScore), // Use the manual input
          cost: parseFloat(estimatedCost.toFixed(2)),
          status: 'Développement' as const
      };
      
      onSubmit(formulaData, changeNote);
      onClose();
  };

  const filteredIngredients = allIngredients.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <FlaskConical size={20} />
            </div>
            <div>
                <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    className="font-bold text-lg text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-purple-500 focus:outline-none"
                />
                {initialFormula && (
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                        <span className="bg-slate-200 px-1.5 rounded text-slate-600 font-mono">{initialFormula.version}</span>
                        <span>Dernière modif: {initialFormula.history?.[0]?.date ? new Date(initialFormula.history[0].date).toLocaleDateString() : 'N/A'}</span>
                    </div>
                )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
                onClick={() => setActiveTab('composition')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'composition' ? 'bg-purple-100 text-purple-700' : 'text-slate-500 hover:bg-slate-100'}`}
            >
                Composition
            </button>
            {initialFormula && (
                <button 
                    onClick={() => setActiveTab('history')}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'history' ? 'bg-purple-100 text-purple-700' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                    <History size={16} /> Historique
                </button>
            )}
            <div className="w-px bg-slate-300 mx-2"></div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2">
                <X size={24} />
            </button>
          </div>
        </div>
        
        {activeTab === 'composition' ? (
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Ingredients Library & Creation */}
                <div className="w-1/3 border-r border-slate-200 flex flex-col bg-slate-50">
                    <div className="p-4 border-b border-slate-200">
                        {!isCreatingIngredient ? (
                            <>
                                <div className="relative mb-3">
                                    <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Rechercher ingrédient..." 
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                                <button 
                                    onClick={() => setIsCreatingIngredient(true)}
                                    className="w-full py-2 bg-white border border-purple-200 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-50 flex items-center justify-center gap-2"
                                >
                                    <Plus size={16} /> Créer Ingrédient
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-slate-700">Nouvel Ingrédient</h4>
                                <button onClick={() => setIsCreatingIngredient(false)} className="text-slate-400 hover:text-slate-600">
                                    <X size={18} />
                                </button>
                            </div>
                        )}
                    </div>

                    {isCreatingIngredient ? (
                        <div className="p-4 space-y-4 overflow-y-auto">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nom</label>
                                <input 
                                    type="text" 
                                    value={newIngName} 
                                    onChange={e => setNewIngName(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" 
                                />
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">INCI</label>
                                <input 
                                    type="text" 
                                    value={newIngInci} 
                                    onChange={e => setNewIngInci(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Coût (€/kg)</label>
                                    <input 
                                        type="number" 
                                        value={newIngCost} 
                                        onChange={e => setNewIngCost(Number(e.target.value))}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" 
                                    />
                                </div>
                                <div className="flex items-end">
                                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer pb-2">
                                        <input 
                                            type="checkbox" 
                                            checked={newIngAllergen}
                                            onChange={e => setNewIngAllergen(e.target.checked)}
                                            className="w-4 h-4 text-purple-600 rounded" 
                                        />
                                        Allergène ?
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                    Impact Stabilité ({newIngStability > 0 ? '+' : ''}{newIngStability})
                                </label>
                                <input 
                                    type="range" 
                                    min="-10" max="10" step="1"
                                    value={newIngStability}
                                    onChange={e => setNewIngStability(Number(e.target.value))}
                                    className="w-full accent-purple-600" 
                                />
                                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                    <span>-10 (Instable)</span>
                                    <span>0 (Neutre)</span>
                                    <span>+10 (Stabilisant)</span>
                                </div>
                            </div>
                            <button 
                                onClick={handleCreateCustomIngredient}
                                disabled={!newIngName}
                                className="w-full py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50"
                            >
                                Ajouter à la bibliothèque
                            </button>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto p-2 space-y-2">
                            {filteredIngredients.map(ing => (
                                <div key={ing.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex justify-between items-center group hover:border-purple-300 cursor-pointer" onClick={() => handleAddIngredient(ing)}>
                                    <div>
                                        <p className="font-bold text-sm text-slate-700">{ing.name}</p>
                                        <div className="flex gap-2 mt-1">
                                            {ing.allergen && <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded">Allergène</span>}
                                            <span className={`text-[10px] px-1 rounded ${ing.stabilityImpact >= 0 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                Stab: {ing.stabilityImpact > 0 ? '+' : ''}{ing.stabilityImpact}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="text-slate-300 group-hover:text-purple-600">
                                        <Plus size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Formula Composition */}
                <div className="flex-1 flex flex-col bg-white">
                    <div className="flex-1 overflow-y-auto p-6">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-600 font-bold uppercase">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">Ingrédient</th>
                                    <th className="px-4 py-3 w-32">%</th>
                                    <th className="px-4 py-3 text-right rounded-r-lg">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {selectedIngredients.map(item => (
                                    <tr key={item.ingredientId}>
                                        <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                                        <td className="px-4 py-3">
                                            <input 
                                                type="number" 
                                                min="0" max="100" step="0.1"
                                                value={item.percentage}
                                                onChange={e => handlePercentageChange(item.ingredientId, parseFloat(e.target.value))}
                                                className="w-20 px-2 py-1 border border-slate-300 rounded text-center focus:ring-2 focus:ring-purple-500 outline-none"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => handleRemove(item.ingredientId)} className="text-slate-400 hover:text-red-500">
                                                <Trash size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {selectedIngredients.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="text-center py-10 text-slate-400 italic">
                                            Ajoutez des ingrédients depuis la liste à gauche.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Real-time Stats Footer */}
                    <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
                        <div className="grid grid-cols-4 gap-4">
                            <div className={`p-3 rounded-lg border ${Math.abs(totalPercentage - 100) < 0.1 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                <p className="text-xs text-slate-500 uppercase font-bold">Total %</p>
                                <p className={`text-xl font-bold ${Math.abs(totalPercentage - 100) < 0.1 ? 'text-green-700' : 'text-red-700'}`}>{totalPercentage.toFixed(1)}%</p>
                            </div>
                            <div className="p-3 rounded-lg bg-white border border-slate-200">
                                <p className="text-xs text-slate-500 uppercase font-bold">Allergènes</p>
                                <p className="text-xl font-bold text-slate-700">{allergenCount}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-white border border-slate-200 relative group">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-xs text-slate-500 uppercase font-bold">Stabilité (Enreg.)</p>
                                    <button 
                                        onClick={() => setStabilityScore(Math.round(calculatedStability))}
                                        className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded hover:bg-purple-200 flex items-center gap-1"
                                        title="Utiliser le calcul théorique"
                                    >
                                        <Calculator size={10} /> {calculatedStability.toFixed(0)}%
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="number" 
                                        min="0" max="100"
                                        value={stabilityScore}
                                        onChange={(e) => setStabilityScore(Number(e.target.value))}
                                        className="text-xl font-bold text-slate-700 w-full bg-transparent outline-none border-b border-transparent hover:border-slate-300 focus:border-purple-500"
                                    />
                                    <span className="text-slate-400">%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-end">
                                <button 
                                    onClick={handleSubmit}
                                    disabled={Math.abs(totalPercentage - 100) > 0.1}
                                    className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <Save size={18} /> {initialFormula ? 'Enregistrer Modif' : 'Créer Formule'}
                                </button>
                            </div>
                        </div>
                        
                        {initialFormula && (
                            <div className="mt-2">
                                <input 
                                    type="text" 
                                    value={changeNote}
                                    onChange={(e) => setChangeNote(e.target.value)}
                                    placeholder="Note de modification (ex: Ajustement texture)..."
                                    className="w-full px-3 py-2 border border-purple-200 bg-purple-50 rounded-lg text-sm text-purple-800 placeholder-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ) : (
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
                <div className="max-w-5xl mx-auto">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <History className="text-purple-600" /> Historique Complet des Versions
                    </h3>
                    
                    <div className="relative border-l-2 border-slate-200 space-y-8 ml-3">
                        {initialFormula?.history && initialFormula.history.length > 0 ? (
                             initialFormula.history.map((entry, idx) => (
                                <div key={idx} className="relative pl-8">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-2 border-purple-500 rounded-full"></div>
                                    <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
                                        {/* Header of Entry */}
                                        <div className="flex justify-between items-start mb-2 border-b border-slate-100 pb-3">
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-xl text-purple-700">{entry.version}</span>
                                                <span className="text-sm text-slate-400">{new Date(entry.date).toLocaleDateString()} {new Date(entry.date).toLocaleTimeString()}</span>
                                            </div>
                                            <span className="text-xs font-medium bg-slate-100 px-2 py-1 rounded text-slate-600">{entry.author}</span>
                                        </div>
                                        
                                        <p className="text-slate-800 font-medium text-sm mb-4 italic">"{entry.changeDescription}"</p>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Snapshot Stats */}
                                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                                <h4 className="text-xs font-bold text-purple-800 uppercase mb-3">Métriques de la version</h4>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm text-slate-600">Stabilité Enregistrée:</span>
                                                    <span className={`font-bold ${entry.snapshot.stabilityScore >= 90 ? 'text-green-600' : 'text-orange-600'}`}>
                                                        {entry.snapshot.stabilityScore}%
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm text-slate-600">Score Allergènes:</span>
                                                    <span className="font-bold text-slate-700">{entry.snapshot.allergensScore}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-slate-600">Coût:</span>
                                                    <span className="font-bold text-slate-700">{entry.snapshot.cost} €/kg</span>
                                                </div>
                                            </div>

                                            {/* Snapshot Ingredients */}
                                            <div className="bg-white border border-slate-200 rounded-lg p-4">
                                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Composition ({entry.snapshot.ingredients.length} ingrédients)</h4>
                                                <ul className="space-y-2 text-sm">
                                                    {entry.snapshot.ingredients.map((ing, i) => (
                                                        <li key={i} className="flex justify-between items-center border-b border-slate-50 pb-1 last:border-0">
                                                            <span className="text-slate-700">{ing.name}</span>
                                                            <span className="font-mono text-slate-500">{ing.percentage}%</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             ))
                        ) : (
                            <div className="text-center text-slate-400 italic py-10">
                                Aucune modification archivée. C'est la première version.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default FormulaEditorModal;
