
import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { DailyReport } from '../types';

interface PerformanceChartsProps {
  data: DailyReport[];
}

const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ data }) => {
  return (
    <div className="space-y-16">
      {/* Impressions Area Chart */}
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b2cf5" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#8b2cf5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} 
              dy={15}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
              tickFormatter={(value) => `${value / 1000}k`}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
              cursor={{ stroke: '#8b2cf5', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area 
              type="monotone" 
              dataKey="impressions" 
              stroke="#8b2cf5" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorImpressions)" 
              animationDuration={2500}
              activeDot={{ r: 8, strokeWidth: 0, fill: '#8b2cf5' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Clicks Bar Chart */}
        <div className="h-[320px]">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Frecuencia de Clics</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dx={-5} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none' }} />
              <Bar dataKey="clicks" radius={[6, 6, 0, 0]} barSize={24}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.clicks > 600 ? '#8b2cf5' : '#c084fc'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* CTR Line Chart */}
        <div className="h-[320px]">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Eficiencia CTR (%)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} unit="%" dx={-5} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
              <Line 
                type="monotone" 
                dataKey="ctr" 
                stroke="#f59e0b" 
                strokeWidth={4} 
                dot={{ r: 5, fill: '#fff', strokeWidth: 3, stroke: '#f59e0b' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCharts;
