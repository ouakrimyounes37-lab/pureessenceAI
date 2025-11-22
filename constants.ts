
import { Lot, LotStatus, NonConformity, QualityDoc, Formula, TrainingCourse, Ingredient, User, ModuleType, InventoryItem, WaterQualityCheck } from './types';
import { Package, AlertTriangle, CheckCircle, Activity, ClipboardList, TrendingUp, Users, Droplets, Archive } from 'lucide-react';

export const MOCK_USERS: User[] = [
    { id: 'u1', name: 'Administrateur', email: 'administrator@pureessence.com', role: 'administrator' },
    { id: 'u2', name: 'QC Manager', email: 'qcmanager@pureessence.com', role: 'qc_manager' },
    { id: 'u3', name: 'Opérateur Prod', email: 'operator@pureessence.com', role: 'production_operator' },
    { id: 'u4', name: 'Staff R&D', email: 'rd@pureessence.com', role: 'rnd_staff' },
    { id: 'u5', name: 'RH / Formation', email: 'training@pureessence.com', role: 'hr_training' },
    { id: 'u6', name: 'Auditeur ISO', email: 'auditor@pureessence.com', role: 'iso_auditor' },
];

export const MODULE_ACCESS: Record<string, ModuleType[]> = {
    administrator: Object.values(ModuleType),
    qc_manager: [ModuleType.TRACEABILITY, ModuleType.NON_CONFORMITY, ModuleType.DOCUMENTS, ModuleType.INSPECTION, ModuleType.TRAINING, ModuleType.INVENTORY],
    production_operator: [ModuleType.TRACEABILITY, ModuleType.INSPECTION, ModuleType.SALES_PRODUCTION, ModuleType.TRAINING, ModuleType.INVENTORY],
    rnd_staff: [ModuleType.NON_CONFORMITY, ModuleType.DOCUMENTS, ModuleType.INSPECTION, ModuleType.R_AND_D, ModuleType.TRAINING],
    hr_training: [ModuleType.DOCUMENTS, ModuleType.TRAINING],
    iso_auditor: Object.values(ModuleType)
};

export const MOCK_LOTS: Lot[] = [
  {
    id: '1',
    lotNumber: 'PE-2025-0001',
    productId: 'prod-001',
    productName: 'Huile d’Argan Pure Bio',
    batchSize: 500,
    unit: 'L',
    productionDate: '2025-10-15',
    expiryDate: '2027-10-15',
    status: LotStatus.QC_PENDING,
    riskScore: 0.10,
    events: [
      { id: 'e1', lotId: '1', eventType: 'created', timestamp: '2025-10-15T08:00:00Z', actor: 'System', details: 'Lot created' },
      { id: 'e2', lotId: '1', eventType: 'production_start', timestamp: '2025-10-15T09:30:00Z', actor: 'Operator A', details: 'Mixing started' },
      { id: 'e3', lotId: '1', eventType: 'production_step', timestamp: '2025-10-15T14:00:00Z', actor: 'Operator A', details: 'Filtering completed', anomalyScore: 0.05 }
    ],
    qcResults: [
       { id: 'qc_w1', testName: 'Qualité Eau (pH)', result: 'pass', value: 7.2, unit: 'pH', inspector: 'Sondes IoT', date: '2025-10-15' },
       { id: 'qc_w2', testName: 'Conductivité Eau', result: 'pass', value: 450, unit: 'µS/cm', inspector: 'Sondes IoT', date: '2025-10-15' }
    ]
  },
  {
    id: '2',
    lotNumber: 'PE-2025-0002',
    productId: 'prod-002',
    productName: 'Sérum Éclat Visage',
    batchSize: 1200,
    unit: 'Unités',
    productionDate: '2025-10-16',
    expiryDate: '2026-10-16',
    status: LotStatus.IN_PRODUCTION,
    riskScore: 0.0,
    events: [
      { id: 'e4', lotId: '2', eventType: 'created', timestamp: '2025-10-16T07:00:00Z', actor: 'Supervisor B', details: 'Lot created' }
    ],
    qcResults: []
  },
  {
    id: '3',
    lotNumber: 'PE-2025-0003',
    productId: 'prod-003',
    productName: 'Crème Hydratante Rose',
    batchSize: 200,
    unit: 'kg',
    productionDate: '2025-10-10',
    expiryDate: '2026-04-10',
    status: LotStatus.RELEASED,
    riskScore: 0.05,
    events: [
      { id: 'e6', lotId: '3', eventType: 'shipped', timestamp: '2025-10-12T16:00:00Z', actor: 'Logistics', details: 'Shipped to Distributor X' }
    ],
    qcResults: [
      { id: 'qc1', testName: 'pH Level', result: 'pass', value: 5.5, unit: 'pH', inspector: 'Quality Mgr', date: '2025-10-11' },
      { id: 'qc2', testName: 'Viscosity', result: 'pass', value: 1200, unit: 'cP', inspector: 'Quality Mgr', date: '2025-10-11' }
    ]
  },
  {
    id: '4',
    lotNumber: 'PE-2025-0004',
    productId: 'prod-001',
    productName: 'Huile d’Argan Pure Bio',
    batchSize: 500,
    unit: 'L',
    productionDate: '2025-10-18',
    expiryDate: '2027-10-18',
    status: LotStatus.QUARANTINED,
    riskScore: 0.50, // High risk due to Critical NC (50pts)
    events: [
      { id: 'e7', lotId: '4', eventType: 'qc_failed', timestamp: '2025-10-18T11:00:00Z', actor: 'Quality Mgr', details: 'Microbiological contamination suspected', anomalyScore: 0.99 }
    ],
    qcResults: [
       { id: 'qc3', testName: 'Microbio', result: 'fail', inspector: 'Lab Ext', date: '2025-10-18' }
    ]
  }
];

export const MODULES_CONFIG = [
  { id: 'traceability', name: 'Traçabilité (Eau & Lots)', icon: Droplets, description: 'Suivi de production, eau et généalogie des lots' },
  { id: 'non_conformity', name: 'Non-Conformités', icon: AlertTriangle, description: 'Gestion des incidents et réclamations' },
  { id: 'inventory', name: 'Stocks & MP', icon: Archive, description: 'Matières premières et emballages' },
  { id: 'documents', name: 'Documents Qualité', icon: ClipboardList, description: 'GED et procédures ISO 9001' },
  { id: 'inspection', name: 'Inspection Visuelle', icon: Activity, description: 'Contrôle qualité par vision IA' },
  { id: 'sales_production', name: 'Ventes & Prod.', icon: TrendingUp, description: 'Prévisions et planification' },
  { id: 'r_and_d', name: 'Bureau d’Études', icon: CheckCircle, description: 'Formulation et simulations' },
  { id: 'training', name: 'Formation & RH', icon: Users, description: 'e-Learning et Chatbot Qualité' },
];

export const MOCK_NCS: NonConformity[] = [
  { id: 'nc1', reference: 'NC-2025-042', source: 'Interne', product: 'Sérum Éclat', description: 'Défaut étiquetage lot #23', severity: 'Mineure', status: 'Nouveau', date: '2025-10-19', lotId: '1' },
  { id: 'nc2', reference: 'REC-2025-009', source: 'Réclamation Client', product: 'Crème Rose', description: 'Texture trop liquide', severity: 'Majeure', status: 'En Cours', date: '2025-10-18', lotId: '3' },
  { id: 'nc3', reference: 'NC-2025-040', source: 'Interne', product: 'Huile Argan', description: 'Contamination possible cuve A', severity: 'Critique', status: 'Nouveau', date: '2025-10-18', lotId: '4' },
];

export const MOCK_DOCS: QualityDoc[] = [
  { id: 'd1', title: 'Procédure Inspection Visuelle', category: 'Procédure', version: 'v2.1', status: 'Approuvé', author: 'S. Martin', date: '2025-09-01', fileType: 'pdf' },
  { id: 'd2', title: 'Certificat Analyse Lot 45', category: 'Certificat', version: 'v1.0', status: 'Approuvé', author: 'Lab Ext.', date: '2025-10-15', fileType: 'pdf' },
  { id: 'd3', title: 'Protocole Nettoyage Cuves', category: 'Hygiène', version: 'v3.0', status: 'En Révision', author: 'P. Dubois', date: '2025-10-20', fileType: 'docx' },
];

export const MOCK_FORMULAS: Formula[] = [
  { 
    id: 'f1', name: 'Sérum Anti-Âge Gold', ingredients: [
        { ingredientId: 'i1', name: 'Huile d\'Argan', percentage: 80 },
        { ingredientId: 'i4', name: 'Huile Essentielle Citron', percentage: 20 }
    ], ingredientsCount: 2, allergensScore: 1, stabilityScore: 98, cost: 28, status: 'Validé', version: 'v3.0', author: 'Sophie M.', history: [
      { version: 'v2.0', date: '2025-09-01', author: 'Sophie M.', changeDescription: 'Ajustement texture', snapshot: {
          ingredients: [{ ingredientId: 'i1', name: 'Huile d\'Argan', percentage: 90 }, { ingredientId: 'i4', name: 'HE Citron', percentage: 10 }],
          stabilityScore: 95,
          allergensScore: 1,
          cost: 26.5
      }},
      { version: 'v1.0', date: '2025-08-15', author: 'Sophie M.', changeDescription: 'Création initiale', snapshot: {
          ingredients: [{ ingredientId: 'i1', name: 'Huile d\'Argan', percentage: 100 }],
          stabilityScore: 90,
          allergensScore: 0,
          cost: 25
      }}
    ] 
  },
  { 
    id: 'f2', name: 'Shampoing Solide Bio', ingredients: [], ingredientsCount: 8, allergensScore: 3, stabilityScore: 85, status: 'Test', version: 'v1.2', author: 'Paul D.', history: [] 
  },
  { 
    id: 'f3', name: 'Lait Corps Argan', ingredients: [], ingredientsCount: 15, allergensScore: 2, stabilityScore: 92, status: 'Développement', version: 'v0.5', author: 'Sophie M.', history: [] 
  },
];

export const MOCK_COURSES: TrainingCourse[] = [
  { id: 'c1', title: 'BPF - Bonnes Pratiques de Fabrication', content: [{ type: 'Video', duration: '20 min' }], completionRate: 100, dueDate: '2025-11-01', assignedTo: 'Équipe Prod.' },
  { id: 'c2', title: 'Gestion des Non-Conformités', content: [{ type: 'Document' }, { type: 'Quiz' }], completionRate: 45, dueDate: '2025-11-15', assignedTo: 'Qualité' },
  { id: 'c3', title: 'Hygiène et Sécurité', content: [{ type: 'Video' }], completionRate: 10, dueDate: '2025-12-01', assignedTo: 'Tous' },
];

export const MOCK_INGREDIENTS: Ingredient[] = [
    { id: 'i1', name: 'Huile d\'Argan', inci: 'Argania Spinosa Kernel Oil', function: 'Émollient', allergen: false, costPerKg: 25, stabilityImpact: 5 },
    { id: 'i2', name: 'Eau Purifiée', inci: 'Aqua', function: 'Solvant', allergen: false, costPerKg: 0.5, stabilityImpact: 0 },
    { id: 'i3', name: 'Glycérine Végétale', inci: 'Glycerin', function: 'Humectant', allergen: false, costPerKg: 3, stabilityImpact: 2 },
    { id: 'i4', name: 'Huile Essentielle Citron', inci: 'Citrus Limon Peel Oil', function: 'Parfum', allergen: true, costPerKg: 40, stabilityImpact: -2 },
    { id: 'i5', name: 'Conservateur Eco', inci: 'Benzyl Alcohol', function: 'Conservateur', allergen: true, costPerKg: 15, stabilityImpact: 8 },
    { id: 'i6', name: 'Beurre de Karité', inci: 'Butyrospermum Parkii', function: 'Agent de texture', allergen: false, costPerKg: 12, stabilityImpact: 4 },
];

export const MOCK_INVENTORY: InventoryItem[] = [
    { id: 'inv1', name: 'Huile d\'Argan Brute', reference: 'MP-ARG-001', type: 'Raw Material', quantity: 1500, unit: 'L', minThreshold: 200, supplier: 'Coopérative Atlas', expiryDate: '2026-06-01', status: 'In Stock' },
    { id: 'inv2', name: 'Flacon Verre 50ml', reference: 'PKG-FL-50', type: 'Packaging', quantity: 120, unit: 'Unités', minThreshold: 500, supplier: 'VerreTech SA', expiryDate: '2099-01-01', status: 'Critical' },
    { id: 'inv3', name: 'Étiquettes "Bio"', reference: 'PKG-ET-BIO', type: 'Packaging', quantity: 800, unit: 'Unités', minThreshold: 1000, supplier: 'PrintFast', expiryDate: '2026-01-01', status: 'Low' },
    { id: 'inv4', name: 'Vitamine E', reference: 'MP-VITE-05', type: 'Raw Material', quantity: 50, unit: 'kg', minThreshold: 10, supplier: 'ChimiePro', expiryDate: '2025-12-01', status: 'In Stock' },
];

export const MOCK_WATER_CHECKS: WaterQualityCheck[] = [
    { id: 'wc1', date: '2025-10-18', source: 'Osmoseur Ligne 1', ph: 7.1, conductivity: 420, temperature: 22.5, status: 'Conforme', inspector: 'Sondes IoT' },
    { id: 'wc2', date: '2025-10-17', source: 'Osmoseur Ligne 1', ph: 6.9, conductivity: 430, temperature: 21.0, status: 'Conforme', inspector: 'Sondes IoT' },
    { id: 'wc3', date: '2025-10-16', source: 'Osmoseur Ligne 1', ph: 7.8, conductivity: 450, temperature: 23.0, status: 'Conforme', inspector: 'Sondes IoT' },
    { id: 'wc4', date: '2025-10-15', source: 'Osmoseur Ligne 1', ph: 8.2, conductivity: 550, temperature: 24.5, status: 'Non-Conforme', inspector: 'S. Martin' }, // Failed
];
