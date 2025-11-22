
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import LoginPage from './components/Auth/LoginPage';
import { ModuleType, Lot, LotStatus, NonConformity, QualityDoc, Formula, TrainingCourse, QCResult, FormulaHistoryEntry, FormulaSnapshot, User, UserLog, InventoryItem, WaterQualityCheck, StockMovement, AppNotification } from './types';
import { MOCK_LOTS, MOCK_NCS, MOCK_DOCS, MOCK_FORMULAS, MOCK_COURSES, MOCK_INVENTORY, MOCK_WATER_CHECKS, MODULE_ACCESS } from './constants';
import { Package, ClipboardCheck, AlertOctagon, TrendingUp, Bell } from 'lucide-react';
import StatCard from './components/ui/StatCard';
import TraceabilityDashboard from './components/modules/traceability/TraceabilityDashboard';
import Toast from './components/ui/Toast';

// Modules Imports
import NCModule from './components/modules/non_conformity/NCModule';
import DocModule from './components/modules/documents/DocModule';
import InspectionModule from './components/modules/inspection/InspectionModule';
import SalesModule from './components/modules/sales_production/SalesModule';
import RnDModule from './components/modules/rnd/RnDModule';
import TrainingModule from './components/modules/training/TrainingModule';
import InventoryModule from './components/modules/inventory/InventoryModule';

const App: React.FC = () => {
  // --- AUTH STATE ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // --- APP STATE ---
  const [currentModule, setCurrentModule] = useState<ModuleType>(ModuleType.TRACEABILITY);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'|'info'} | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // --- DATA STATE ---
  const [lots, setLots] = useState<Lot[]>(MOCK_LOTS);
  const [ncs, setNcs] = useState<NonConformity[]>(MOCK_NCS);
  const [docs, setDocs] = useState<QualityDoc[]>(MOCK_DOCS);
  const [formulas, setFormulas] = useState<Formula[]>(MOCK_FORMULAS);
  const [courses, setCourses] = useState<TrainingCourse[]>(MOCK_COURSES);
  
  // New Modules State
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [waterChecks, setWaterChecks] = useState<WaterQualityCheck[]>(MOCK_WATER_CHECKS);
  
  // --- AUDIT LOG STATE ---
  const [userLogs, setUserLogs] = useState<UserLog[]>([]);

  // --- AUTH HANDLERS ---
  const handleLogin = (user: User) => {
      setCurrentUser(user);
      // Set default module based on role permissions
      const allowedModules = MODULE_ACCESS[user.role];
      if (allowedModules && allowedModules.length > 0) {
          setCurrentModule(allowedModules[0]);
      }
      logAction(user, 'Login', 'Authentication');
  };

  const handleLogout = () => {
      if (currentUser) logAction(currentUser, 'Logout', 'Authentication');
      setCurrentUser(null);
  };

  // --- AUDIT LOGGER ---
  const logAction = (user: User | null, action: string, module: string) => {
      if (!user) return;
      const log: UserLog = {
          id: Date.now().toString(),
          userId: user.id,
          userName: user.name,
          action,
          module,
          timestamp: new Date().toISOString()
      };
      setUserLogs(prev => [log, ...prev]);
      console.log('[AUDIT LOG]', log);
  };

  // --- HELPER: IS READ ONLY? ---
  // Granular permissions logic
  const canEdit = (module: ModuleType) => {
      if (!currentUser) return false;
      if (currentUser.role === 'administrator') return true;
      if (currentUser.role === 'iso_auditor') return false;

      // Role specific overrides
      if (currentUser.role === 'production_operator' && module === ModuleType.TRACEABILITY) return true;
      if (currentUser.role === 'production_operator' && module === ModuleType.INVENTORY) return true;
      if (currentUser.role === 'qc_manager' && module !== ModuleType.SALES_PRODUCTION) return true;
      if (currentUser.role === 'rnd_staff' && (module === ModuleType.R_AND_D || module === ModuleType.NON_CONFORMITY)) return true; // Can analyze NCs
      if (currentUser.role === 'hr_training' && (module === ModuleType.TRAINING || module === ModuleType.DOCUMENTS)) return true;

      return false;
  };

  const isReadOnly = !canEdit(currentModule);

  // --- HELPER: NOTIFICATIONS ---
  const addSystemNotification = (message: string, type: 'success' | 'error' | 'info') => {
      const newNotif: AppNotification = {
          id: Date.now().toString(),
          message,
          type,
          timestamp: new Date().toISOString(),
          read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
      setToast({ msg: message, type });
  };

  const markAllRead = () => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // --- HELPER: RISK CALCULATION LOGIC ---
  const calculateLotRisk = (lotId: string, currentNCs: NonConformity[]): number => {
      const linkedNCs = currentNCs.filter(nc => nc.lotId === lotId);
      let totalPoints = 0;

      linkedNCs.forEach(nc => {
          let points = 0;
          // Base points by Severity
          switch (nc.severity) {
              case 'Critique': points = 50; break;
              case 'Majeure': points = 30; break;
              case 'Mineure': points = 10; break;
              default: points = 0;
          }

          // Residual Risk Factor
          if (nc.status === 'Clôturé') {
              points = points * 0.5;
          }

          totalPoints += points;
      });

      return Math.min(1.0, totalPoints / 100);
  };

  // --- TRACEABILITY STATE & HANDLERS ---
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);

  const handleCreateLot = (newLotData: Partial<Lot> & { notes?: string }) => {
    if (isReadOnly) return;

    const newLot: Lot = {
      id: Date.now().toString(),
      lotNumber: newLotData.lotNumber || `PE-2025-${Math.floor(Math.random() * 1000)}`,
      productId: newLotData.productId || 'prod-new',
      productName: newLotData.productName || 'Nouveau Produit',
      batchSize: newLotData.batchSize || 0,
      unit: newLotData.unit || 'Unités',
      productionDate: newLotData.productionDate || new Date().toISOString().split('T')[0],
      expiryDate: newLotData.expiryDate || '',
      status: LotStatus.CREATED,
      riskScore: 0,
      events: [
        { 
          id: Date.now().toString(), 
          lotId: Date.now().toString(), 
          eventType: 'created', 
          timestamp: new Date().toISOString(), 
          actor: currentUser?.name || 'Unknown', 
          details: `Lot créé manuellement. Note: ${newLotData.notes || 'Aucune'}` 
        }
      ],
      qcResults: []
    };

    setLots(prev => [newLot, ...prev]);
    logAction(currentUser, `Created Lot ${newLot.lotNumber}`, 'Traceability');
    addSystemNotification(`Lot ${newLot.lotNumber} créé et ajouté à la production`, 'success');
  };

  const handleUpdateLotStatus = (lotId: string, newStatus: LotStatus) => {
    if (isReadOnly) return;

    setLots(prev => prev.map(lot => {
      if (lot.id === lotId) {
        const updatedLot = { 
            ...lot, 
            status: newStatus,
            events: [
                {
                    id: Date.now().toString(),
                    lotId: lot.id,
                    eventType: 'status_change',
                    timestamp: new Date().toISOString(),
                    actor: currentUser?.name || 'System',
                    details: `Statut changé vers ${newStatus}`
                },
                ...lot.events
            ]
        };
        
        if (selectedLot && selectedLot.id === lotId) {
            setSelectedLot(updatedLot);
        }
        return updatedLot;
      }
      return lot;
    }));
    logAction(currentUser, `Updated Lot ${lotId} status to ${newStatus}`, 'Traceability');
    addSystemNotification(`Statut du lot mis à jour : ${newStatus}`, 'success');
  };

  const handleAddQC = (lotId: string, result: Partial<QCResult>) => {
      if (isReadOnly) return;

      const qcEntry: QCResult = {
          id: Date.now().toString(),
          testName: result.testName || 'Test',
          result: result.result || 'pass',
          value: result.value,
          unit: result.unit,
          inspector: result.inspector || currentUser?.name || 'Unknown',
          date: new Date().toISOString().split('T')[0]
      };

      setLots(prev => prev.map(lot => {
          if (lot.id === lotId) {
              const updatedLot = {
                  ...lot,
                  qcResults: [qcEntry, ...lot.qcResults]
              };
              if (selectedLot && selectedLot.id === lotId) setSelectedLot(updatedLot);
              return updatedLot;
          }
          return lot;
      }));
      logAction(currentUser, `Added QC Result to Lot ${lotId}`, 'Traceability');
      addSystemNotification('Résultat QC ajouté au lot', 'success');
  };

  // --- WATER TRACEABILITY HANDLERS ---
  const handleAddWaterCheck = (check: Partial<WaterQualityCheck>) => {
      if (isReadOnly) return;
      
      const newCheck: WaterQualityCheck = {
          id: Date.now().toString(),
          date: check.date || new Date().toISOString().split('T')[0],
          source: check.source || 'Unknown',
          ph: check.ph || 7,
          conductivity: check.conductivity || 0,
          temperature: check.temperature || 20,
          status: check.status || 'Conforme',
          inspector: currentUser?.name || 'System'
      };

      setWaterChecks(prev => [newCheck, ...prev]);
      logAction(currentUser, `Added Water Check for ${newCheck.source}`, 'Traceability (Water)');

      if (newCheck.status === 'Non-Conforme') {
          handleCreateNC({
              source: 'Interne',
              product: 'EAU',
              description: `Qualité Eau Non-Conforme (pH: ${newCheck.ph}, Cond: ${newCheck.conductivity}). Impact potentiel sur production.`,
              severity: 'Critique' // Water issues are critical
          });
          addSystemNotification('Alerte Qualité Eau: NC Critique créée automatiquement', 'error');
      } else {
          addSystemNotification('Relevé eau enregistré', 'success');
      }
  };


  // --- NC HANDLERS ---
  const handleCreateNC = (ncData: Partial<NonConformity>) => {
    // R&D can analyze but usually not declare, but let's allow "Interne" source creation for simulation
    if (isReadOnly && currentUser?.role !== 'rnd_staff') return; 

    const newNC: NonConformity = {
        id: Date.now().toString(),
        reference: `NC-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        source: ncData.source || 'Interne',
        product: ncData.product || 'N/A',
        lotId: ncData.lotId,
        description: ncData.description || '',
        severity: ncData.severity || 'Mineure',
        status: 'Nouveau',
        date: new Date().toISOString().split('T')[0]
    };
    
    const updatedNCList = [newNC, ...ncs];
    setNcs(updatedNCList);

    logAction(currentUser, `Created NC ${newNC.reference} (${newNC.severity})`, 'Non-Conformity');

    // Interaction with Lots
    if (ncData.lotId) {
        const newRiskScore = calculateLotRisk(ncData.lotId, updatedNCList);
        
        setLots(prev => prev.map(lot => {
            if (lot.id === ncData.lotId) {
                const isSevere = ncData.severity === 'Critique' || ncData.severity === 'Majeure';
                const shouldQuarantine = isSevere && lot.status !== LotStatus.QUARANTINED && lot.status !== LotStatus.SHIPPED;
                
                let newStatus = lot.status;
                let newEvents = lot.events;

                if (shouldQuarantine) {
                    newStatus = LotStatus.QUARANTINED;
                    newEvents = [{
                        id: Date.now().toString(),
                        lotId: lot.id,
                        eventType: 'auto_quarantine',
                        timestamp: new Date().toISOString(),
                        actor: 'System (Risk AI)',
                        details: `Mise en quarantaine auto: NC ${newNC.severity} détectée.`
                    }, ...lot.events];
                    addSystemNotification(`Lot ${lot.lotNumber} mis en quarantaine automatiquement`, 'error');
                }

                return {
                    ...lot,
                    riskScore: newRiskScore,
                    status: newStatus,
                    events: newEvents
                };
            }
            return lot;
        }));
    } else {
        addSystemNotification('Non-Conformité déclarée', 'success');
    }
  };

  const handleUpdateNC = (id: string, updates: Partial<NonConformity>) => {
      if (isReadOnly && currentUser?.role !== 'rnd_staff') return; // R&D can update status/notes

      const updatedNCList = ncs.map(nc => nc.id === id ? { ...nc, ...updates } : nc);
      setNcs(updatedNCList);
      
      const targetNC = updatedNCList.find(nc => nc.id === id);
      if (targetNC && targetNC.lotId) {
          const newRiskScore = calculateLotRisk(targetNC.lotId, updatedNCList);
          
          setLots(prev => prev.map(lot => {
              if (lot.id === targetNC.lotId) {
                  return { ...lot, riskScore: newRiskScore };
              }
              return lot;
          }));
      }
      logAction(currentUser, `Updated NC ${id}`, 'Non-Conformity');
      addSystemNotification('Non-Conformité mise à jour', 'success');
  };

  // --- INSPECTION HANDLERS ---
  const handleInspectionResult = (lotId: string, passed: boolean, imageUrl: string, comments: string) => {
      if (isReadOnly) return;

      const newStatus = passed ? LotStatus.QC_PASSED : LotStatus.QC_FAILED;
      
      setLots(prev => prev.map(lot => {
          if (lot.id === lotId) {
              return {
                  ...lot,
                  status: newStatus,
                  riskScore: passed ? Math.max(0, lot.riskScore - 0.1) : Math.min(1, lot.riskScore + 0.2),
                  events: [
                      {
                          id: Date.now().toString(),
                          lotId,
                          eventType: passed ? 'inspection_passed' : 'inspection_failed',
                          timestamp: new Date().toISOString(),
                          actor: 'IA Camera',
                          details: `Inspection visuelle: ${passed ? 'Succès' : 'Échec'}`,
                          anomalyScore: passed ? 0 : 0.9
                      },
                      ...lot.events
                  ]
              };
          }
          return lot;
      }));

      logAction(currentUser, `Inspection Result for Lot ${lotId}: ${passed ? 'PASS' : 'FAIL'}`, 'Inspection');

      if (!passed) {
          handleCreateNC({
              source: 'Inspection IA',
              product: lots.find(l => l.id === lotId)?.productName || 'Inconnu',
              lotId: lotId,
              severity: 'Majeure',
              description: `Défaut visuel détecté par IA. ${comments}`
          });
          addSystemNotification(`Inspection Échouée: NC créée et Lot ${lotId} bloqué`, 'error');
      } else {
          addSystemNotification(`Inspection Validée pour le lot ${lotId}`, 'success');
      }
  };

  // --- DOC HANDLERS ---
  const handleAddDoc = (docData: Partial<QualityDoc>, file: File | null) => {
      if (isReadOnly) return;

      let fileUrl = undefined;
      if (file) {
          fileUrl = URL.createObjectURL(file);
      }

      const newDoc: QualityDoc = {
          id: Date.now().toString(),
          title: docData.title || 'Nouveau Document',
          category: docData.category || 'Autre',
          version: 'v1.0',
          status: 'Brouillon',
          author: currentUser?.name || 'Unknown',
          date: new Date().toISOString().split('T')[0],
          fileType: docData.fileType || 'pdf',
          fileUrl: fileUrl
      };
      setDocs(prev => [newDoc, ...prev]);
      logAction(currentUser, `Uploaded Document ${newDoc.title}`, 'Documents');
      addSystemNotification('Document ajouté avec succès', 'success');
  };

  const handleDeleteDoc = (id: string) => {
      if (isReadOnly) return;
      setDocs(prev => prev.filter(d => d.id !== id));
      logAction(currentUser, `Deleted Document ${id}`, 'Documents');
      addSystemNotification('Document supprimé', 'info');
  };

  // --- R&D HANDLERS ---
  const handleAddFormula = (formulaData: Partial<Formula>) => {
      if (isReadOnly) return;

      const newFormula: Formula = {
          id: Date.now().toString(),
          name: formulaData.name || 'Nouvelle Formule',
          ingredients: formulaData.ingredients || [],
          ingredientsCount: formulaData.ingredientsCount || 0,
          allergensScore: formulaData.allergensScore || 0,
          stabilityScore: formulaData.stabilityScore || 0,
          cost: formulaData.cost,
          status: 'Développement',
          version: 'v1.0',
          author: currentUser?.name || 'Unknown',
          history: []
      };
      setFormulas(prev => [newFormula, ...prev]);
      logAction(currentUser, `Created Formula ${newFormula.name}`, 'R&D');
      addSystemNotification('Nouvelle formule créée', 'success');
  };

  const handleUpdateFormula = (id: string, updates: Partial<Formula>, note?: string) => {
      if (isReadOnly) return;

      setFormulas(prev => prev.map(f => {
          if (f.id === id) {
              const currentVerNum = parseFloat(f.version.replace('v', ''));
              const newVer = `v${(currentVerNum + 0.1).toFixed(1)}`;
              
              const snapshot: FormulaSnapshot = {
                  ingredients: f.ingredients,
                  stabilityScore: f.stabilityScore,
                  allergensScore: f.allergensScore,
                  cost: f.cost || 0
              };

              const historyEntry: FormulaHistoryEntry = {
                  version: f.version,
                  date: new Date().toISOString(),
                  author: currentUser?.name || 'Unknown',
                  changeDescription: note || 'Mise à jour de la formule',
                  snapshot: snapshot
              };

              return {
                  ...f,
                  ...updates,
                  version: newVer,
                  history: [historyEntry, ...(f.history || [])]
              };
          }
          return f;
      }));
      logAction(currentUser, `Updated Formula ${id}`, 'R&D');
      addSystemNotification('Formule mise à jour et versionnée', 'success');
  };

  const handleOptimizeFormula = (id: string) => {
      if (isReadOnly) return;
      setFormulas(prev => prev.map(f => {
          if (f.id === id) {
              return {
                  ...f,
                  allergensScore: Math.max(0, f.allergensScore - 1),
                  stabilityScore: Math.min(100, f.stabilityScore + 5)
              };
          }
          return f;
      }));
      logAction(currentUser, `Optimized Formula ${id}`, 'R&D');
      addSystemNotification('Optimisation IA appliquée', 'success');
  };

  // --- INVENTORY HANDLERS ---
  const handleStockMovement = (itemId: string, type: 'IN' | 'OUT', quantity: number, reason: string) => {
      if (isReadOnly) return;

      setInventoryItems(prev => prev.map(item => {
          if (item.id === itemId) {
              const newQty = type === 'IN' ? item.quantity + quantity : item.quantity - quantity;
              const newStatus = newQty <= 0 ? 'Critical' : newQty < item.minThreshold ? 'Low' : 'In Stock';
              
              if (newStatus !== 'In Stock') {
                  addSystemNotification(`Alerte Stock: ${item.name} est ${newStatus === 'Low' ? 'Bas' : 'CRITIQUE'}`, 'error');
              }

              return { ...item, quantity: newQty, status: newStatus as any };
          }
          return item;
      }));

      logAction(currentUser, `Stock ${type}: ${quantity} on ${itemId}. Reason: ${reason}`, 'Inventory');
      addSystemNotification(`Mouvement de stock enregistré (${type})`, 'success');
  };

  // --- TRAINING HANDLERS ---
  const handleAddCourse = (courseData: Partial<TrainingCourse>) => {
      if (isReadOnly) return;

      const newCourse: TrainingCourse = {
          id: Date.now().toString(),
          title: courseData.title || 'Nouveau Cours',
          completionRate: 0,
          dueDate: courseData.dueDate || '2025-12-31',
          assignedTo: courseData.assignedTo || 'Tous',
          content: courseData.content || []
      };
      setCourses(prev => [newCourse, ...prev]);
      logAction(currentUser, `Created Course ${newCourse.title}`, 'Training');
      addSystemNotification('Module de formation créé', 'success');
  };

  // --- MAIN RENDER ---
  if (!currentUser) {
      return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Layout 
        currentModule={currentModule} 
        onModuleChange={setCurrentModule}
        currentUser={currentUser}
        onLogout={handleLogout}
        notifications={notifications}
        onMarkAllRead={markAllRead}
    >
      {currentModule === ModuleType.TRACEABILITY && (
          <TraceabilityDashboard 
             lots={lots}
             waterChecks={waterChecks}
             ncs={ncs}
             isReadOnly={isReadOnly}
             notify={addSystemNotification}
             onSelectLot={setSelectedLot}
             selectedLot={selectedLot}
             onCreateLot={handleCreateLot}
             onUpdateLotStatus={handleUpdateLotStatus}
             onAddQC={handleAddQC}
             onAddWaterCheck={handleAddWaterCheck}
          />
      )}
      
      {currentModule === ModuleType.NON_CONFORMITY && (
          <NCModule 
            ncs={ncs} 
            availableLots={lots}
            notify={addSystemNotification} 
            onCreateNC={handleCreateNC}
            onUpdateNC={handleUpdateNC}
            isReadOnly={isReadOnly}
          />
      )}

      {currentModule === ModuleType.INVENTORY && (
          <InventoryModule 
              items={inventoryItems}
              notify={addSystemNotification}
              onStockMovement={handleStockMovement}
              isReadOnly={isReadOnly}
          />
      )}

      {currentModule === ModuleType.DOCUMENTS && (
          <DocModule 
            docs={docs} 
            notify={addSystemNotification} 
            onAddDoc={handleAddDoc}
            onDeleteDoc={handleDeleteDoc}
          />
      )}
      {currentModule === ModuleType.INSPECTION && (
          <InspectionModule 
            pendingLots={lots.filter(l => l.status === LotStatus.QC_PENDING || l.status === LotStatus.IN_PRODUCTION)}
            onInspectionResult={handleInspectionResult}
            notify={addSystemNotification} 
          />
      )}
      {currentModule === ModuleType.SALES_PRODUCTION && <SalesModule notify={addSystemNotification} />}
      {currentModule === ModuleType.R_AND_D && (
          <RnDModule 
            formulas={formulas} 
            notify={addSystemNotification} 
            onAddFormula={handleAddFormula}
            onUpdateFormula={handleUpdateFormula}
            onOptimize={handleOptimizeFormula}
            isReadOnly={isReadOnly}
          />
      )}
      {currentModule === ModuleType.TRAINING && (
          <TrainingModule 
            courses={courses} 
            notify={addSystemNotification} 
            onAddCourse={handleAddCourse}
            isReadOnly={isReadOnly}
          />
      )}

      {toast && (
          <Toast 
            message={toast.msg} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
      )}
    </Layout>
  );
};

export default App;
