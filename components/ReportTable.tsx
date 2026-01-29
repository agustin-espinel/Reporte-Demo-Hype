
import React, { useState, useMemo } from 'react';
import { DailyReport } from '../types';
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';

interface ReportTableProps {
  data: DailyReport[];
}

type SortField = keyof DailyReport;
type SortOrder = 'asc' | 'desc';

const ReportTable: React.FC<ReportTableProps> = ({ data }) => {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc'); // Default to desc for numbers when switching
    }
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }

      const numA = aValue as number;
      const numB = bValue as number;

      return sortOrder === 'asc' ? numA - numB : numB - numA;
    });
  }, [data, sortField, sortOrder]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity ml-1" />;
    return sortOrder === 'asc' 
      ? <ChevronUp className="w-3 h-3 text-hypeads-primary ml-1" /> 
      : <ChevronDown className="w-3 h-3 text-hypeads-primary ml-1" />;
  };

  const HeaderCell = ({ field, label, align = 'left' }: { field: SortField, label: string, align?: 'left' | 'right' }) => (
    <th 
      className={`px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 cursor-pointer hover:bg-slate-100/50 transition-colors group select-none ${align === 'right' ? 'text-right' : ''}`}
      onClick={() => handleSort(field)}
    >
      <div className={`flex items-center ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
        {label}
        <SortIcon field={field} />
      </div>
    </th>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50">
            <HeaderCell field="date" label="Fecha" />
            <HeaderCell field="impressions" label="Impresiones" />
            <HeaderCell field="clicks" label="Clicks" />
            <HeaderCell field="ctr" label="CTR" />
            <HeaderCell field="viewability" label="Viewability" />
            <HeaderCell field="investment" label="Inversión" align="right" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {sortedData.map((row, idx) => (
            <tr key={idx} className="group hover:bg-hypeads-light/20 transition-all duration-300">
              <td className="px-8 py-5 text-sm font-bold text-slate-800">{row.date}</td>
              <td className="px-8 py-5 text-sm text-slate-500 font-medium">{row.impressions.toLocaleString()}</td>
              <td className="px-8 py-5 text-sm text-slate-900 font-black">{row.clicks.toLocaleString()}</td>
              <td className="px-8 py-5">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${row.ctr > 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {row.ctr.toFixed(2)}%
                </span>
              </td>
              <td className="px-8 py-5">
                 <div className="flex items-center gap-3">
                    <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden p-0.5">
                       <div className="bg-hypeads-primary h-full rounded-full" style={{ width: `${row.viewability}%` }}></div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">{row.viewability.toFixed(1)}%</span>
                 </div>
              </td>
              <td className="px-8 py-5 text-sm text-hypeads-primary font-black text-right">${row.investment.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-slate-50/80">
          <tr className="font-black border-t-2 border-slate-100">
            <td className="px-8 py-6 text-[10px] uppercase tracking-widest text-slate-400">Totales Consolidados</td>
            <td className="px-8 py-6 text-sm text-slate-900">
              {data.reduce((sum, r) => sum + r.impressions, 0).toLocaleString()}
            </td>
            <td className="px-8 py-6 text-sm text-slate-900">
              {data.reduce((sum, r) => sum + r.clicks, 0).toLocaleString()}
            </td>
            <td className="px-8 py-6 text-sm text-amber-600">
              {(data.reduce((sum, r) => sum + r.ctr, 0) / data.length).toFixed(2)}% <span className="text-[10px] font-bold text-slate-300 ml-1">AVG</span>
            </td>
            <td className="px-8 py-6 text-sm text-indigo-400">
              {(data.reduce((sum, r) => sum + r.viewability, 0) / data.length).toFixed(2)}% <span className="text-[10px] font-bold text-slate-300 ml-1">AVG</span>
            </td>
            <td className="px-8 py-6 text-lg text-hypeads-primary text-right">
              ${data.reduce((sum, r) => sum + r.investment, 0).toLocaleString()}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ReportTable;
