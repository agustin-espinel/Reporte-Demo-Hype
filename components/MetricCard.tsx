
import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  goal?: string;
  subtitle?: string;
  percentage?: number;
  color: 'hypeads' | 'emerald' | 'amber' | 'rose';
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, goal, subtitle, percentage, color, icon }) => {
  const colorMap = {
    hypeads: 'bg-hypeads-light text-hypeads-primary border-hypeads-primary/10',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100'
  };

  const barColorMap = {
    hypeads: 'bg-hypeads-primary',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500'
  };

  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/50 hover:border-hypeads-primary/20 duration-500 group">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl ${colorMap[color]} border transition-transform group-hover:scale-110 duration-500`}>
          {React.cloneElement(icon as React.ReactElement, { size: 28 })}
        </div>
        {percentage !== undefined && (
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${colorMap[color]}`}>
            {percentage.toFixed(1)}%
          </span>
        )}
      </div>
      
      <div>
        <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-1.5">{title}</h4>
        <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
        
        {goal && (
          <div className="mt-6 space-y-2.5">
            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Performance</span>
              <span>KPI: {goal}</span>
            </div>
            <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-100">
              <div 
                className={`${barColorMap[color]} h-full rounded-full transition-all duration-1000 ease-out shadow-sm shadow-black/10`}
                style={{ width: `${Math.min(percentage || 0, 100)}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {subtitle && (
          <div className="flex items-center gap-1.5 mt-3">
             <div className={`w-1 h-1 rounded-full ${barColorMap[color]}`}></div>
             <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
