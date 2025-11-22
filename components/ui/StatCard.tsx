import React from 'react';
import { StatCardProps } from '../../types';

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, trendUp, icon, color }) => {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    red: 'bg-red-50 text-red-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
          {trend && (
             <p className={`text-xs font-medium mt-1 ${trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
               {trendUp ? '↑' : '↓'} {trend}
             </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorStyles[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
