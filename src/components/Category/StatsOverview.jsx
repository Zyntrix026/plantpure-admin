import React from 'react';
import { Box, Activity, AlertCircle } from 'lucide-react';

const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm animate-pulse">
        <div className="w-10 h-10 bg-slate-100 rounded-lg mb-4"></div>
        <div className="h-3 bg-slate-100 rounded w-24 mb-3"></div>
        <div className="flex items-center gap-2">
          <div className="h-7 bg-slate-100 rounded w-16"></div>
          <div className="h-3 bg-slate-50 rounded w-10"></div>
        </div>
      </div>
    ))}
  </div>
);

const StatsCard = ({ label, value, icon, trend, styleConfig }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm group hover:border-slate-300 transition-all">
      <div 
        style={{ backgroundColor: styleConfig.bg, color: styleConfig.text }} 
        className="p-2.5 rounded-lg inline-block mb-3"
      >
        {icon}
      </div>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{value || 0}</h3>
        {trend && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{trend}</span>}
      </div>
    </div>
  );
};

const StatsOverview = ({ stats, loading }) => {
  if (loading && !stats) return <StatsSkeleton />;
  if (!stats) return null;

  // Custom UI colors computed dynamically from theme variables
  const cardStyles = {
    total: {
      bg: "rgba(10, 71, 46, 0.06)",
      text: "var(--color-secondary)"
    },
    active: {
      bg: "rgba(84, 180, 53, 0.08)",
      text: "var(--color-primary)"
    },
    inactive: {
      bg: "#FEF3C7", // amber-100 remaining stable for alert system contexts
      text: "#D97706"  // amber-600
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatsCard 
        label="Total Categories" 
        value={stats.totalCategories} 
        icon={<Box size={20} />} 
        trend="Inventory" 
        styleConfig={cardStyles.total}
      />
      <StatsCard 
        label="Active Now" 
        value={stats.activeCategories} 
        icon={<Activity size={20} />} 
        trend="Live" 
        styleConfig={cardStyles.active}
      />
      <StatsCard 
        label="Inactive" 
        value={stats.inactiveCategories} 
        icon={<AlertCircle size={20} />} 
        trend={`${stats.activePercentage} Active`} 
        styleConfig={cardStyles.inactive}
      />
    </div>
  );
};

export default StatsOverview;