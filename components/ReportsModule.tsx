
import React, { useState } from 'react';
import { UserRole, FeedbackEntry } from '../types';
import { Language, translations } from '../translations';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';

interface ReportsModuleProps {
  role: UserRole;
  language: Language;
}

interface ReportRow {
  id: string;
  date: string;
  farmer: string;
  item: string;
  qty: string;
  amount: string;
  status: string;
}

const ReportsModule: React.FC<ReportsModuleProps> = ({ role, language }) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'analytics' | 'tickets' | 'vendors'>('analytics');
  const [reportType, setReportType] = useState('procurement-summary');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportReady, setReportReady] = useState(false);
  const [reportData, setReportData] = useState<ReportRow[]>([]);
  const [expandedTicketId, setExpandedTicketId] = useState<number | null>(null);
  
  // Vendor Analytics Data
  const vendorPerformanceData = [
    { name: 'Bihar Fresh', volume: 4500, avgPrice: 28.5, fulfillment: 98 },
    { name: 'Metro Mart', volume: 3200, avgPrice: 26.2, fulfillment: 92 },
    { name: 'Gaya Retail', volume: 2800, avgPrice: 27.8, fulfillment: 85 },
    { name: 'Saran Export', volume: 5100, avgPrice: 31.0, fulfillment: 95 },
    { name: 'Patna Union', volume: 1900, avgPrice: 25.5, fulfillment: 78 },
  ];

  const fulfillmentData = [
    { name: 'On-Time', value: 88, color: '#10b981' },
    { name: 'Delayed', value: 8, color: '#f59e0b' },
    { name: 'Incomplete', value: 4, color: '#ef4444' },
  ];

  const qualityData = [
    { name: 'Grade A', value: 45, color: '#10b981' },
    { name: 'Grade B', value: 30, color: '#3b82f6' },
    { name: 'Grade C', value: 15, color: '#f59e0b' },
    { name: 'Grade D', value: 10, color: '#ef4444' },
  ];

  const utilizationTrend = [
    { month: 'Oct', spent: 1.2, budget: 2.0 },
    { month: 'Nov', spent: 2.5, budget: 3.5 },
    { month: 'Dec', spent: 4.2, budget: 5.0 },
    { month: 'Jan', spent: 6.8, budget: 11.4 },
  ];

  const [tickets] = useState<(FeedbackEntry & { urgency: 'High' | 'Medium' | 'Low', assigned: string })[]>([
    { id: 1, name: 'Ram Prakash', mobile: '9800011122', category: 'Pricing', message: 'Tomato prices in Danapur PVCS are not matching the daily master rate.', status: 'Open', createdAt: '2026-01-11 09:30', urgency: 'High', assigned: 'Block Officer' },
    { id: 2, name: 'Sita Devi', mobile: '9700033344', category: 'Technical', message: 'Unable to upload land records photo from mobile app.', status: 'In Progress', createdAt: '2026-01-11 10:15', urgency: 'Medium', assigned: 'IT Support' },
    { id: 3, name: 'Amit Kumar', mobile: '9122233344', category: 'Membership', message: 'Daughter-in-law registration pending at PVCS union for 3 weeks.', status: 'Open', createdAt: '2026-01-11 11:45', urgency: 'Low', assigned: 'Union Supervisor' },
  ]);

  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    commodity: 'All',
    district: 'All',
    pvcs: 'All',
    grade: 'All',
    status: 'All',
    depth: 'Detailed'
  });

  const reportTypes = [
    { id: 'procurement-summary', name: 'Procurement Summary (Tiered)', roles: [UserRole.PVCS_USER, UserRole.UNION_USER, UserRole.ADMIN, UserRole.DEPT_OFFICIAL] },
    { id: 'batch-movement', name: 'Batch Movement & Traceability Log', roles: [UserRole.UNION_USER, UserRole.ADMIN] },
    { id: 'farmer-payouts', name: 'Farmer Payout Ledger', roles: [UserRole.PVCS_USER, UserRole.UNION_USER, UserRole.ADMIN] },
    { id: 'quality-audit', name: 'Quality Performance Report', roles: [UserRole.UNION_USER, UserRole.DEPT_OFFICIAL, UserRole.ADMIN] },
    { id: 'financial-impact', name: 'Scheme Impact & Budget Analysis', roles: [UserRole.DEPT_OFFICIAL, UserRole.ADMIN] },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setReportReady(false);
    setTimeout(() => {
      const mockData: ReportRow[] = [
        { id: 'TXN-8821', date: filters.startDate, farmer: 'Sunil Mahto', item: filters.commodity === 'All' ? 'Tomato' : filters.commodity, qty: '250 Kg', amount: '₹ 6,625', status: 'Paid' },
        { id: 'TXN-8822', date: filters.startDate, farmer: 'Anita Devi', item: filters.commodity === 'All' ? 'Potato' : filters.commodity, qty: '180 Kg', amount: '₹ 2,736', status: 'Verified' },
        { id: 'TXN-8823', date: filters.startDate, farmer: 'Ram Jha', item: filters.commodity === 'All' ? 'Onion' : filters.commodity, qty: '400 Kg', amount: '₹ 13,600', status: 'Pending' },
      ];
      setReportData(mockData);
      setIsGenerating(false);
      setReportReady(true);
    }, 1000);
  };

  const toggleTicket = (id: number) => {
    setExpandedTicketId(expandedTicketId === id ? null : id);
  };

  // Fixed FilterSection component with proper React.FC type to handle children correctly in TS
  const FilterSection: React.FC<{ title: string; icon: string; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
        <i className={`fa-solid ${icon}`}></i>
        <span>{title}</span>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );

  return (
    <div className="pb-20">
      {/* Tab Controls */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-slate-100 uppercase tracking-tight">System Intelligence</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1 font-medium">Bihar State Vegetable Scheme Distributed Analytics & Support</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex overflow-x-auto scrollbar-hide">
           <button 
              onClick={() => setActiveTab('analytics')} 
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'analytics' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400'}`}
           >
             Core Analytics
           </button>
           <button 
              onClick={() => setActiveTab('vendors')} 
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'vendors' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400'}`}
           >
             Vendor Insights
           </button>
           {(role === UserRole.ADMIN || role === UserRole.DEPT_OFFICIAL || role === UserRole.UNION_USER) && (
              <button 
                onClick={() => setActiveTab('tickets')} 
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'tickets' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400'}`}
              >
                Issues Registry
              </button>
           )}
        </div>
      </div>

      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Core Analytics View */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm h-[400px]">
               <h3 className="text-sm font-black uppercase text-gray-400 mb-6 flex items-center tracking-widest">
                 <i className="fa-solid fa-chart-area mr-2 text-blue-500"></i> Scheme Utilization (₹ Cr)
               </h3>
               <ResponsiveContainer width="100%" height="80%">
                  <AreaChart data={utilizationTrend}>
                    <defs>
                      <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#0f172a', color: '#fff' }} />
                    <Area type="monotone" dataKey="spent" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSpent)" />
                    <Area type="monotone" dataKey="budget" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm h-[400px]">
               <h3 className="text-sm font-black uppercase text-gray-400 mb-6 flex items-center tracking-widest">
                 <i className="fa-solid fa-microscope mr-2 text-emerald-500"></i> Quality Distribution
               </h3>
               <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie data={qualityData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                      {qualityData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
               <div className="grid grid-cols-2 gap-2 mt-2">
                  {qualityData.map(d => (
                    <div key={d.name} className="flex items-center space-x-2">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                       <span className="text-[9px] font-black uppercase text-gray-500">{d.name}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-lg">1</div>
                  <h3 className="font-black dark:text-slate-100 uppercase tracking-widest text-xs">Select Report</h3>
                </div>
                <div className="space-y-2.5">
                  {reportTypes.filter(r => r.roles.includes(role)).map(type => (
                    <button
                      key={type.id}
                      onClick={() => { setReportType(type.id); setReportReady(false); }}
                      className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-300 ${
                        reportType === type.id 
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl translate-x-2' 
                        : 'bg-white dark:bg-slate-800 border-gray-50 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:border-emerald-100'
                      }`}
                    >
                      <span className="text-xs font-black leading-tight uppercase tracking-tight">{type.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm relative min-h-[500px] flex flex-col">
              {!reportReady ? (
                <>
                  <div className="flex items-center space-x-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg">2</div>
                    <h3 className="font-black dark:text-slate-100 uppercase tracking-widest text-xs">Configure Filters</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    <FilterSection title="Date Range" icon="fa-calendar-days">
                      <div className="grid grid-cols-2 gap-3">
                        <input type="date" value={filters.startDate} className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold dark:text-white" onChange={e => setFilters({...filters, startDate: e.target.value})} />
                        <input type="date" value={filters.endDate} className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold dark:text-white" onChange={e => setFilters({...filters, endDate: e.target.value})} />
                      </div>
                    </FilterSection>
                    <FilterSection title="Commodity" icon="fa-leaf">
                      <select className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold dark:text-white" value={filters.commodity} onChange={e => setFilters({...filters, commodity: e.target.value})}>
                        <option value="All">All Produce</option>
                        <option value="Tomato">Tomato (Hybrid)</option>
                        <option value="Potato">Potato (Seed)</option>
                      </select>
                    </FilterSection>
                  </div>
                  <div className="mt-auto pt-12">
                    <button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-emerald-600 text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-2xl active:scale-95">
                      {isGenerating ? <i className="fa-solid fa-spinner fa-spin mr-3"></i> : <i className="fa-solid fa-wand-magic-sparkles mr-3"></i>}
                      Generate Dataset
                    </button>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col opacity-100 transition-opacity duration-500">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{reportTypes.find(r => r.id === reportType)?.name}</h3>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Snapshot: {filters.startDate} to {filters.endDate}</p>
                    </div>
                    <button onClick={() => setReportReady(false)} className="bg-gray-50 dark:bg-slate-800 px-4 py-2 rounded-xl text-gray-400 hover:text-emerald-600 transition-colors font-black text-[10px] uppercase tracking-widest">
                      <i className="fa-solid fa-arrow-left mr-2"></i> Reset
                    </button>
                  </div>
                  <div className="flex-1 overflow-x-auto bg-gray-50/50 dark:bg-slate-800/30 rounded-3xl border dark:border-slate-800">
                    <table className="w-full text-left">
                      <thead className="border-b dark:border-slate-800">
                        <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <th className="px-6 py-4">ID</th>
                          <th className="px-6 py-4">Farmer</th>
                          <th className="px-6 py-4">Item</th>
                          <th className="px-6 py-4">Total (₹)</th>
                          <th className="px-6 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-slate-800">
                        {reportData.map(row => (
                          <tr key={row.id} className="hover:bg-white dark:hover:bg-slate-800 transition-colors">
                            <td className="px-6 py-4 text-xs font-bold text-gray-500">{row.id}</td>
                            <td className="px-6 py-4 text-sm font-black text-gray-800 dark:text-slate-200">{row.farmer}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">{row.item}</td>
                            <td className="px-6 py-4 text-sm font-black text-emerald-600">{row.amount}</td>
                            <td className="px-6 py-4"><span className="px-2 py-1 bg-white dark:bg-slate-700 border dark:border-slate-600 rounded-lg text-[9px] font-black uppercase text-emerald-600">{row.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'vendors' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Vendor Performance View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Top Stats */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm h-[450px]">
               <h3 className="text-sm font-black uppercase text-gray-400 mb-8 flex items-center tracking-widest">
                 <i className="fa-solid fa-truck-fast mr-2 text-emerald-500"></i> Procurement Volume by Vendor (Kg)
               </h3>
               <ResponsiveContainer width="100%" height="75%">
                  <BarChart data={vendorPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: 'rgba(16, 185, 129, 0.05)'}} contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#0f172a', color: '#fff' }} />
                    <Bar dataKey="volume" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
                  </BarChart>
               </ResponsiveContainer>
            </div>

            <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm h-[450px] flex flex-col">
               <h3 className="text-sm font-black uppercase text-gray-400 mb-8 flex items-center tracking-widest">
                 <i className="fa-solid fa-clock mr-2 text-blue-500"></i> Fulfillment Score
               </h3>
               <div className="flex-1 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={fulfillmentData} 
                        cx="50%" cy="50%" 
                        innerRadius={70} outerRadius={100} 
                        paddingAngle={8} 
                        dataKey="value"
                        stroke="none"
                      >
                        {fulfillmentData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-4xl font-black text-gray-900 dark:text-white">88%</span>
                     <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-1">Efficiency</span>
                  </div>
               </div>
               <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t dark:border-slate-800">
                  {fulfillmentData.map(f => (
                    <div key={f.name} className="text-center">
                       <p className="text-[8px] font-black uppercase text-gray-400 mb-1">{f.name}</p>
                       <p className="text-xs font-black text-gray-900 dark:text-white">{f.value}%</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Vendor Scorecard Table */}
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-8 border-b dark:border-slate-800 flex items-center justify-between">
               <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Performance Scorecard</h3>
               <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Download Audit Log</button>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-slate-800/50">
                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <th className="px-8 py-4">Vendor Partner</th>
                      <th className="px-8 py-4">Avg. Price Paid (₹)</th>
                      <th className="px-8 py-4">Total Volume (Kg)</th>
                      <th className="px-8 py-4">Fulfillment Rate</th>
                      <th className="px-8 py-4">Performance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-800">
                    {vendorPerformanceData.map(v => (
                      <tr key={v.name} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-8 py-6">
                           <p className="text-sm font-black text-gray-900 dark:text-slate-100">{v.name}</p>
                           <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Bihar State Registered</p>
                        </td>
                        <td className="px-8 py-6">
                           <p className="text-sm font-black text-emerald-600">₹ {v.avgPrice.toFixed(2)}</p>
                        </td>
                        <td className="px-8 py-6">
                           <p className="text-sm font-bold text-gray-600 dark:text-slate-400">{v.volume.toLocaleString()}</p>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center space-x-3">
                              <div className="flex-1 bg-gray-100 dark:bg-slate-800 h-1.5 w-20 rounded-full overflow-hidden">
                                 <div className={`h-full rounded-full ${v.fulfillment > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{width: `${v.fulfillment}%`}}></div>
                              </div>
                              <span className="text-xs font-black text-gray-900 dark:text-white">{v.fulfillment}%</span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${v.fulfillment > 90 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                              {v.fulfillment > 90 ? 'Exemplary' : 'Warning'}
                           </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tickets' && (
        <div className="space-y-6">
           <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm p-8">
              <h3 className="text-xl font-black uppercase tracking-tight dark:text-white mb-8">Case Management Registry</h3>
              <div className="grid grid-cols-1 gap-4">
                 {tickets.map(ticket => {
                    const isExpanded = expandedTicketId === ticket.id;
                    return (
                      <div 
                        key={ticket.id} 
                        className={`rounded-[2rem] border transition-all duration-300 overflow-hidden ${
                          isExpanded ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20' : 'border-gray-50 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-200'
                        }`}
                      >
                         <div 
                           onClick={() => toggleTicket(ticket.id)}
                           className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                         >
                            <div className="flex items-center space-x-5">
                               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg ${
                                 ticket.urgency === 'High' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                               }`}>
                                 <i className={`fa-solid ${ticket.category === 'Technical' ? 'fa-microchip' : 'fa-indian-rupee-sign'}`}></i>
                               </div>
                               <div>
                                  <div className="flex items-center space-x-3">
                                     <h4 className="font-black text-gray-900 dark:text-slate-100 uppercase text-sm">{ticket.name}</h4>
                                     <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${ticket.urgency === 'High' ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'}`}>{ticket.urgency}</span>
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 line-clamp-1">{ticket.message}</p>
                               </div>
                            </div>
                            <div className="flex items-center space-x-4">
                               <span className="text-[10px] font-black uppercase text-gray-400">{ticket.createdAt}</span>
                               <i className={`fa-solid fa-chevron-down text-gray-300 transition-transform ${isExpanded ? 'rotate-180 text-emerald-500' : ''}`}></i>
                            </div>
                         </div>
                         
                         {/* Expanded Detail Panel */}
                         <div className={`transition-all duration-300 ${isExpanded ? 'max-h-[800px] border-t dark:border-slate-800 p-8 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                               <div className="space-y-6">
                                  <div>
                                     <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Detailed Complaint</label>
                                     <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 italic text-sm text-gray-700 dark:text-slate-300 leading-relaxed shadow-sm">
                                        "{ticket.message}"
                                     </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                     <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700">
                                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Assigned Official</p>
                                        <p className="text-xs font-bold text-gray-900 dark:text-slate-200">{ticket.assigned}</p>
                                     </div>
                                     <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700">
                                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Current Status</p>
                                        <p className="text-xs font-bold text-emerald-600">{ticket.status}</p>
                                     </div>
                                  </div>
                               </div>
                               <div className="space-y-6">
                                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Resolution Workspace</label>
                                  <textarea className="w-full bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white min-h-[120px]" placeholder="Add remarks or resolution steps..."></textarea>
                                  <div className="flex gap-3">
                                     <button className="flex-1 bg-emerald-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Update & Close</button>
                                     <button className="flex-1 bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Escalate Case</button>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                    );
                 })}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ReportsModule;
