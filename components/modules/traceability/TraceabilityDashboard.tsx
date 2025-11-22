
import React, { useState } from 'react';
import { Lot, WaterQualityCheck, LotStatus, NonConformity, QCResult } from '../../../types';
import { Package, Droplets } from 'lucide-react';
import StatCard from '../../ui/StatCard';
import LotList from './LotList';
import LotDetail from './LotDetail';
import CreateLotModal from './CreateLotModal';
import WaterTracking from './WaterTracking';
import { Package as PackageIcon, ClipboardCheck, AlertOctagon, TrendingUp } from 'lucide-react';

interface TraceabilityDashboardProps {
  lots: Lot[];
  waterChecks: WaterQualityCheck[];
  ncs: NonConformity[];
  isReadOnly: boolean;
  notify: (msg: string, type: 'success' | 'error' | 'info') => void;
  // Handlers
  onSelectLot: (lot: Lot | null) => void;
  selectedLot: Lot | null;
  onUpdateLotStatus: (id: string, status: LotStatus) => void;
  onAddQC: (lotId: string, result: Partial<QCResult>) => void;
  onCreateLot: (data: Partial<Lot> & { notes?: string }) => void;
  onAddWaterCheck: (check: Partial<WaterQualityCheck>) => void;
}

const TraceabilityDashboard: React.FC<TraceabilityDashboardProps> = ({
  lots, waterChecks, ncs, isReadOnly, notify,
  onSelectLot, selectedLot, onUpdateLotStatus, onAddQC, onCreateLot, onAddWaterCheck
}) => {
  const [activeTab, setActiveTab] = useState<'lots' | 'water'>('lots');
  const [isCreateLotModalOpen, setIsCreateLotModalOpen] = useState(false);

  const lotWithNCs = selectedLot ? {
        ...selectedLot,
        linkedNCs: ncs.filter(nc => nc.lotId === selectedLot.id)
  } : null;

  return (
    <div className="space-y-6">
      {/* Sub-Navigation - Scrollable on mobile */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
          <button 
              onClick={() => setActiveTab('lots')}
              className={`px-6 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'lots' ? 'border-emerald-500 text-emerald-700 bg-emerald-50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
          >
              <Package size={18} /> Lots de Production
          </button>
          <button 
              onClick={() => setActiveTab('water')}
              className={`px-6 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'water' ? 'border-blue-500 text-blue-700 bg-blue-50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
          >
              <Droplets size={18} /> Traçabilité Eau
          </button>
      </div>

      {activeTab === 'lots' && (
        <div className="animate-in fade-in slide-in-from-left-4 duration-300 space-y-6">
            {/* Responsive Grid: 1 col mobile, 2 col tablet, 4 col desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard 
                    title="Total Lots Actifs" 
                    value={lots.length} 
                    trend={`${lots.filter(l => l.status === LotStatus.CREATED).length} nouveaux`}
                    trendUp={true} 
                    icon={<PackageIcon size={24} />} 
                    color="blue" 
                />
                <StatCard 
                    title="En Attente QC" 
                    value={lots.filter(l => l.status === LotStatus.QC_PENDING).length} 
                    trend="Priorité Haute" 
                    trendUp={false} 
                    icon={<ClipboardCheck size={24} />} 
                    color="orange" 
                />
                <StatCard 
                    title="Lots Bloqués" 
                    value={lots.filter(l => l.status === LotStatus.QUARANTINED).length} 
                    trend="Incidents Critiques" 
                    trendUp={false} 
                    icon={<AlertOctagon size={24} />} 
                    color="red" 
                />
                <StatCard 
                    title="Rendement Global" 
                    value="98.2%" 
                    trend="Stable" 
                    trendUp={true} 
                    icon={<TrendingUp size={24} />} 
                    color="green" 
                />
            </div>

            <LotList 
                lots={lots} 
                onSelectLot={onSelectLot} 
                onCreateLot={() => setIsCreateLotModalOpen(true)}
                isReadOnly={isReadOnly}
            />

            {lotWithNCs && (
                <>
                    <div className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm" onClick={() => onSelectLot(null)}></div>
                    <LotDetail 
                        lot={lotWithNCs} 
                        linkedNCs={lotWithNCs.linkedNCs}
                        onClose={() => onSelectLot(null)} 
                        notify={notify}
                        onUpdateStatus={onUpdateLotStatus}
                        onAddQC={onAddQC}
                    />
                </>
            )}

            {isCreateLotModalOpen && (
                <CreateLotModal 
                    onClose={() => setIsCreateLotModalOpen(false)} 
                    onSubmit={onCreateLot}
                />
            )}
        </div>
      )}

      {activeTab === 'water' && (
          <WaterTracking 
            checks={waterChecks}
            notify={notify}
            onAddCheck={onAddWaterCheck}
            isReadOnly={isReadOnly}
          />
      )}
    </div>
  );
};

export default TraceabilityDashboard;
