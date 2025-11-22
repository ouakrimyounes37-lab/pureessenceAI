
import React from 'react';

export enum ModuleType {
  TRACEABILITY = 'traceability',
  NON_CONFORMITY = 'non_conformity',
  DOCUMENTS = 'documents',
  INSPECTION = 'inspection',
  SALES_PRODUCTION = 'sales_production',
  R_AND_D = 'r_and_d',
  TRAINING = 'training',
  INVENTORY = 'inventory'
}

export enum LotStatus {
  CREATED = 'created',
  IN_PRODUCTION = 'in_production',
  QC_PENDING = 'qc_pending',
  QC_PASSED = 'qc_passed',
  QC_FAILED = 'qc_failed',
  QUARANTINED = 'quarantined',
  RELEASED = 'released',
  SHIPPED = 'shipped'
}

export enum AlertSeverity {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4
}

export type UserRole = 'administrator' | 'qc_manager' | 'production_operator' | 'rnd_staff' | 'hr_training' | 'iso_auditor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface UserLog {
    id: string;
    userId: string;
    userName: string;
    action: string;
    module: string;
    timestamp: string;
}

export interface AppNotification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    timestamp: string;
    read: boolean;
}

export interface LotEvent {
  id: string;
  lotId: string;
  eventType: string;
  timestamp: string;
  actor: string;
  details: string;
  anomalyScore?: number;
}

export interface QCResult {
  id: string;
  testName: string;
  result: 'pass' | 'fail' | 'n/a';
  value?: number;
  unit?: string;
  inspector: string;
  date: string;
}

export interface Lot {
  id: string;
  lotNumber: string;
  productId: string;
  productName: string;
  batchSize: number;
  unit: string;
  productionDate: string;
  expiryDate: string;
  status: LotStatus;
  riskScore: number;
  events: LotEvent[];
  qcResults: QCResult[];
}

export interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'orange' | 'purple';
}

// Module 2: Non-Conformity
export interface NonConformity {
  id: string;
  reference: string;
  source: 'Interne' | 'Réclamation Client' | 'Inspection IA';
  product: string;
  lotId?: string; // Link to Lot
  description: string;
  severity: 'Mineure' | 'Majeure' | 'Critique';
  status: 'Nouveau' | 'En Cours' | 'Clôturé';
  date: string;
  resolutionNotes?: string;
}

// Module 3: Documents
export interface QualityDoc {
    id: string;
    title: string;
    category: string;
    version: string;
    status: 'Brouillon' | 'En Révision' | 'Approuvé';
    author: string;
    date: string;
    lotId?: string;
    url?: string; // For preview
    fileType?: string;
    fileUrl?: string; // Blob URL for uploaded files
}

// Module 6: R&D
export interface Ingredient {
    id: string;
    name: string;
    inci: string;
    function: string;
    allergen: boolean;
    costPerKg: number; // Cost simulation
    stabilityImpact: number; // -10 to +10
}

export interface FormulaIngredient {
    ingredientId: string;
    name: string;
    percentage: number;
}

export interface FormulaSnapshot {
    ingredients: FormulaIngredient[];
    stabilityScore: number;
    allergensScore: number;
    cost: number;
}

export interface FormulaHistoryEntry {
    version: string;
    date: string;
    author: string;
    changeDescription: string;
    snapshot: FormulaSnapshot;
}

export interface Formula {
    id: string;
    name: string;
    ingredients: FormulaIngredient[];
    ingredientsCount: number;
    allergensScore: number; // 0-10
    stabilityScore: number; // 0-100%
    status: 'Développement' | 'Test' | 'Validé';
    cost?: number;
    version: string;
    author: string;
    history: FormulaHistoryEntry[];
}

// Module 7: Training
export interface TrainingContent {
    type: 'Video' | 'Document' | 'Quiz';
    url?: string;
    duration?: string; // e.g. "15 min"
}

export interface TrainingCourse {
    id: string;
    title: string;
    content: TrainingContent[];
    completionRate: number;
    dueDate: string;
    assignedTo: string;
}

// Inventory Module
export interface InventoryItem {
    id: string;
    name: string;
    reference: string;
    type: 'Raw Material' | 'Packaging';
    quantity: number;
    unit: string;
    minThreshold: number;
    supplier: string;
    expiryDate: string;
    status: 'In Stock' | 'Low' | 'Critical';
}

export interface StockMovement {
    id: string;
    itemId: string;
    type: 'IN' | 'OUT';
    quantity: number;
    reason: string;
    date: string;
    user: string;
}

// Water Traceability
export interface WaterQualityCheck {
    id: string;
    date: string;
    source: string; // e.g. "Source A", "Robinet Labo"
    ph: number;
    conductivity: number; // µS/cm
    temperature: number; // °C
    status: 'Conforme' | 'Non-Conforme';
    inspector: string;
}
