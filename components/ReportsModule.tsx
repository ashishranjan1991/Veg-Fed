
import React, { useState } from 'react';
import { UserRole, FeedbackEntry } from '../types';
import { Language, translations } from '../translations';

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
  const [activeTab, setActiveTab] = useState<'analytics' | 'tickets'>('analytics');
  const [reportType, setReportType] = useState('procurement-summary');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportReady, setReportReady] = useState(false);
  const [reportData, setReportData] = useState<ReportRow[]>([]);
  
  // Mock Feedback Data
  const [tickets, setTickets] = useState<FeedbackEntry[]>([
    { id: 1, name: 'Ram Prakash', mobile: '9800011122', category: 'Pricing', message: 'Tomato prices in Danapur PVCS are not matching the daily master rate.', status: 'Open', createdAt: '2026-01-11 09:30' },
    { id: 2, name: 'Sita Devi', mobile: '9700033344', category: 'Technical', message: 'Unable to upload land records photo from mobile app.', status: 'In Progress', createdAt: '2026-01-11 10:15' },
    { id: 3, name: 'Vikram Singh', mobile: '9922233344', category: 'Membership', message: 'DBT verification is taking too long for my account.', status: 'Open', createdAt: '2026-01-11 11:05' },
  ]);

  // Advanced Filters State
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
    { id: 'farmer-payouts', name: 'Farmer Payout Ledger', roles: [UserRole.PVCS_USER, UserRole.UNION_USER, UserRole.ADMIN] },
    { id: 'quality-audit', name: 'Quality Audit Log', roles: [UserRole.UNION_USER, UserRole.DEPT_OFFICIAL, UserRole.ADMIN] },
    { id: 'inventory-flow', name: 'Logistics & Hub Movement', roles: [UserRole.UNION_USER, UserRole.DEPT_OFFICIAL] },
    { id: 'financial-impact', name: 'Scheme Impact Analysis', roles: [UserRole.DEPT_OFFICIAL, UserRole.ADMIN] },
  ];

  const handleDatePreset = (days: number) => {
    const end = new Date().toISOString().split('T')[0];
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setFilters({ ...filters, startDate: start, endDate: end });
  };

  const handleGenerate = () => {
    if (!reportType) return;
    setIsGenerating(true);
    setReportReady(false);
    
    // Simulated multi-step processing logic to "fetch" data
    setTimeout(() => {
      const mockData: ReportRow[] = [
        { id: 'TXN-8821', date: filters.startDate || '2026-01-11', farmer: 'Sunil Mahto', item: filters.commodity === 'All' ? 'Tomato' : filters.commodity, qty: '250 Kg', amount: '₹ 6,625', status: 'Paid' },
        { id: 'TXN-8822', date: filters.startDate || '2026-01-11', farmer: 'Anita Devi', item: filters.commodity === 'All' ? 'Potato' : filters.commodity, qty: '180 Kg', amount: '₹ 2,736', status: 'Verified' },
        { id: 'TXN-8823', date: filters.startDate || '2026-01-11', farmer: 'Ram Jha', item: filters.commodity === 'All' ? 'Onion' : filters.commodity, qty: '400 Kg', amount: '₹ 13,600', status: 'Pending' },
        { id: 'TXN-8824', date: filters.startDate || '2026-01-11', farmer: 'Vikram Singh', item: filters.commodity === 'All' ? 'Tomato' : filters.commodity, qty: '120 Kg', amount: '₹ 3,180', status: 'Paid' },
        { id: 'TXN-8825', date: filters.startDate || '2026-01-11', farmer: 'Sita Kumari', item: filters.commodity === 'All' ? 'Brinjal' : filters.commodity, qty: '95 Kg', amount: '₹ 1,995', status: 'Paid' },
      ];
      setReportData(mockData);
      setIsGenerating(false);
      setReportReady(true);
    }, 2000);
  };

  const handleUpdateTicket = (id: number, newStatus: any) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const FilterSection = ({ title, icon, children }: { title: string, icon: string, children: React.ReactNode }) => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
        <i className={`fa-solid ${icon}`}></i>
        <span>{title}</span>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-slate-100 uppercase tracking-tight">System Intelligence</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1 font-medium">Bihar State Vegetable Scheme Distributed Analytics & Support</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-1 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex">
           <button onClick={() => setActiveTab('analytics')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'analytics' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400'}`}>Analytics</button>
           {(role === UserRole.ADMIN || role === UserRole.DEPT_OFFICIAL) && (
              <button onClick={() => setActiveTab('tickets')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'tickets' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400'}`}>Help Desk</button>
           )}
        </div>
      </div>

      {activeTab === 'analytics' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Step 1: Selection & Hierarchy (Col 4) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-lg shadow-emerald-200 dark:shadow-none">1</div>
                <h3 className="font-black dark:text-slate-100 uppercase tracking-widest text-xs">{t.selectReportType}</h3>
              </div>
              <div className="space-y-2.5">
                {reportTypes.filter(r => r.roles.includes(role)).map(type => (
                  <button
                    key={type.id}
                    onClick={() => { setReportType(type.id); setReportReady(false); }}
                    className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all group ${
                      reportType === type.id 
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl translate-x-2' 
                      : 'bg-white dark:bg-slate-800 border-gray-50 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:border-emerald-100 dark:hover:border-emerald-900'
                    }`}
                  >
                    <span className="text-sm font-bold leading-tight">{type.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-emerald-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden">
              <h4 className="font-black text-emerald-400 text-xs uppercase tracking-widest mb-2">Automated Scheduling</h4>
              <p className="text-sm text-emerald-50/70 font-medium leading-relaxed">Want these reports in your email daily? Configure automated dispatch in System Settings.</p>
              <i className="fa-solid fa-clock-rotate-left absolute -bottom-8 -right-8 text-8xl text-white/5 pointer-events-none"></i>
            </div>
          </div>

          {/* Step 2: Optimized Filters & Preview (Col 8) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col min-h-[600px]">
            {!reportReady ? (
              <>
                <div className="flex items-center space-x-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-200 dark:shadow-none">2</div>
                  <h3 className="font-black dark:text-slate-100 uppercase tracking-widest text-xs">{t.applyFilters}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  <FilterSection title={t.dateRange} icon="fa-calendar-days">
                    <div className="flex space-x-2 mb-2">
                      <button onClick={() => handleDatePreset(7)} className="flex-1 py-1.5 bg-gray-50 dark:bg-slate-800 rounded-lg text-[10px] font-black text-gray-400 hover:text-emerald-600 transition-colors border border-gray-100 dark:border-slate-700 uppercase tracking-widest">{t.last7Days}</button>
                      <button onClick={() => handleDatePreset(30)} className="flex-1 py-1.5 bg-gray-50 dark:bg-slate-800 rounded-lg text-[10px] font-black text-gray-400 hover:text-emerald-600 transition-colors border border-gray-100 dark:border-slate-700 uppercase tracking-widest">{t.thisMonth}</button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        type="date" 
                        value={filters.startDate}
                        className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-gray-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                        onChange={e => setFilters({...filters, startDate: e.target.value})}
                      />
                      <input 
                        type="date" 
                        value={filters.endDate}
                        className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-gray-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                        onChange={e => setFilters({...filters, endDate: e.target.value})}
                      />
                    </div>
                  </FilterSection>

                  <FilterSection title={t.commodity} icon="fa-leaf">
                    <select 
                      className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-gray-700 dark:text-slate-200 outline-none"
                      value={filters.commodity}
                      onChange={e => setFilters({...filters, commodity: e.target.value})}
                    >
                      <option value="All">All Produce Categories</option>
                      <option value="Tomato">Tomato (Processing Grade)</option>
                      <option value="Potato">Potato (Seed Grade)</option>
                      <option value="Onion">Onion (Red/Local)</option>
                      <option value="Brinjal">Brinjal (Variety-A)</option>
                    </select>
                    <div className="flex items-center bg-gray-50 dark:bg-slate-800 rounded-xl p-1 mt-3">
                      <button onClick={() => setFilters({...filters, depth: 'Detailed'})} className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${filters.depth === 'Detailed' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}>{t.detailed}</button>
                      <button onClick={() => setFilters({...filters, depth: 'Summary'})} className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${filters.depth === 'Summary' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}>{t.summary}</button>
                    </div>
                  </FilterSection>

                  <FilterSection title={t.district} icon="fa-map-location-dot">
                    <select 
                      className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-gray-700 dark:text-slate-200 outline-none"
                      value={filters.district}
                      onChange={e => setFilters({...filters, district: e.target.value})}
                    >
                      <option value="All">All Regional Unions</option>
                      <option value="Patna">Harit (Patna Union)</option>
                      <option value="Motihari">Tirhut (Motihari Union)</option>
                      <option value="Darbhanga">Mithila (Darbhanga Union)</option>
                      <option value="Gaya">Magadh (Gaya Union)</option>
                    </select>
                  </FilterSection>

                  <FilterSection title="Quality Metrics" icon="fa-magnifying-glass-chart">
                    <div className="grid grid-cols-2 gap-3">
                        <select 
                          className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-gray-700 dark:text-slate-200 outline-none"
                          onChange={e => setFilters({...filters, grade: e.target.value})}
                        >
                          <option value="All">{t.grade}: All</option>
                          <option value="A">Grade A (Premium)</option>
                          <option value="B">Grade B (Standard)</option>
                        </select>
                        <select 
                          className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-gray-700 dark:text-slate-200 outline-none"
                          onChange={e => setFilters({...filters, status: e.target.value})}
                        >
                          <option value="All">{t.status}: All</option>
                          <option value="Paid">Processed (Paid)</option>
                        </select>
                    </div>
                  </FilterSection>
                </div>

                <div className="mt-auto pt-10">
                  <button 
                    onClick={handleGenerate}
                    disabled={!reportType || isGenerating}
                    className="w-full bg-emerald-600 text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-emerald-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xl shadow-emerald-100 active:scale-95"
                  >
                    {isGenerating ? <i className="fa-solid fa-dna fa-spin mr-3"></i> : <i className="fa-solid fa-wand-magic-sparkles mr-3"></i>}
                    {t.generateReport}
                  </button>
                </div>
              </>
            ) : (
              <div className="animate-in slide-in-from-right-12 duration-500 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{reportTypes.find(r => r.id === reportType)?.name}</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">
                        Data Preview: {filters.startDate} to {filters.endDate} • {filters.commodity}
                    </p>
                  </div>
                  <button onClick={() => setReportReady(false)} className="bg-gray-50 dark:bg-slate-800 p-3 rounded-xl text-gray-400 hover:text-emerald-600 transition-colors">
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>

                <div className="flex-1 overflow-x-auto bg-gray-50/50 dark:bg-slate-800/30 rounded-3xl border dark:border-slate-800">
                  <table className="w-full text-left">
                    <thead className="border-b dark:border-slate-800">
                      <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <th className="px-6 py-4">Transaction ID</th>
                        <th className="px-6 py-4">Farmer</th>
                        <th className="px-6 py-4">Commodity</th>
                        <th className="px-6 py-4">Qty</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-slate-800">
                      {reportData.map(row => (
                        <tr key={row.id} className="hover:bg-white dark:hover:bg-slate-800 transition-colors group">
                          <td className="px-6 py-4 text-xs font-bold text-gray-500">{row.id}</td>
                          <td className="px-6 py-4 text-sm font-black text-gray-800 dark:text-slate-200">{row.farmer}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">{row.item}</td>
                          <td className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-slate-200">{row.qty}</td>
                          <td className="px-6 py-4 text-sm font-black text-emerald-600">{row.amount}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-white dark:bg-slate-700 border dark:border-slate-600 rounded-lg text-[9px] font-black uppercase text-emerald-600">{row.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex space-x-3 w-full sm:w-auto">
                      <button className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-emerald-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-200 dark:shadow-none hover:bg-emerald-700 transition-all active:scale-95">
                        <i className="fa-solid fa-file-pdf"></i>
                        <span>{t.downloadPDF}</span>
                      </button>
                      <button className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-all active:scale-95">
                        <i className="fa-solid fa-file-excel"></i>
                        <span>{t.downloadExcel}</span>
                      </button>
                  </div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic">Generated on {new Date().toLocaleString()}</p>
                </div>
              </div>
            )}

            {/* Results Overlay (Loading) */}
            {isGenerating && (
              <div className="absolute inset-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-12 text-center animate-in fade-in duration-300">
                <div className="space-y-8 max-w-md">
                  <div className="relative w-32 h-32 mx-auto">
                      <div className="absolute inset-0 border-8 border-emerald-100 dark:border-emerald-900/30 rounded-full"></div>
                      <div className="absolute inset-0 border-8 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{t.generating}</h4>
                    <p className="text-xs text-gray-400 mt-3 leading-relaxed font-bold uppercase tracking-widest animate-pulse">Aggregating records from {filters.district} Cluster...</p>
                  </div>
                </div>
              </div>
            )}
            
            <i className="fa-solid fa-chart-pie absolute -bottom-20 -left-20 text-[250px] text-gray-50 dark:text-slate-800/40 pointer-events-none -rotate-12"></i>
          </div>
        </div>
      ) : (
        /* Support Ticket Queue for Admins */
        <div className="animate-in fade-in duration-500">
           <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden p-8">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-black uppercase tracking-tight dark:text-white">Active Support Queue</h3>
                 <div className="flex space-x-2">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase">Live Monitoring</span>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                 {tickets.map(ticket => (
                    <div key={ticket.id} className="p-6 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-emerald-500">
                       <div className="flex items-start space-x-5">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${
                            ticket.status === 'Open' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            <i className={`fa-solid ${ticket.category === 'Technical' ? 'fa-microchip' : 'fa-indian-rupee-sign'}`}></i>
                          </div>
                          <div>
                             <div className="flex items-center space-x-3">
                                <h4 className="font-black text-gray-900 dark:text-slate-100">{ticket.name}</h4>
                                <span className="text-[9px] text-gray-400 font-bold uppercase bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-gray-100 dark:border-slate-700">{ticket.category}</span>
                             </div>
                             <p className="text-sm text-gray-500 mt-1 font-medium">{ticket.message}</p>
                             <div className="flex items-center space-x-4 mt-3">
                                <span className="text-[10px] text-emerald-600 font-bold"><i className="fa-solid fa-phone mr-1"></i> {ticket.mobile}</span>
                                <span className="text-[10px] text-gray-400 font-bold"><i className="fa-solid fa-clock mr-1"></i> {ticket.createdAt}</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex flex-col items-end gap-3 min-w-[150px]">
                          <select 
                            value={ticket.status}
                            onChange={(e) => handleUpdateTicket(ticket.id, e.target.value as any)}
                            className="w-full bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none"
                          >
                             <option value="Open">Open</option>
                             <option value="In Progress">In Progress</option>
                             <option value="Resolved">Resolved</option>
                          </select>
                          <button className="w-full bg-slate-900 dark:bg-emerald-900 text-white py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">Assign Case</button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ReportsModule;
