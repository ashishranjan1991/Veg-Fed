
import React, { useState } from 'react';
import { UserRole, FeedbackEntry } from '../types';
import { Language, translations } from '../translations';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area 
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

// FilterSection component handles the labeling and structure of report filters
const FilterSection = ({ title, icon, children }: { title: any; icon: string; children: React.ReactNode }) => (
  <div className="space-y-3">
    <div className="flex items-center space-x-2 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
      <i className={`fa-solid ${icon}`}></i>
      <span>{title}</span>
    </div>
    <div className="space-y-3">{children}</div>
  </div>
);

const ReportsModule: React.FC<ReportsModuleProps> = ({ role, language }) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'analytics' | 'tickets'>('analytics');
  const [reportType, setReportType] = useState('procurement-summary');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportReady, setReportReady] = useState(false);
  const [reportData, setReportData] = useState<ReportRow[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  
  // Analytics Data (SRS Page 67, 73)
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

  // Enhanced Tickets with Master-Detail logic
  const [tickets, setTickets] = useState<(FeedbackEntry & { urgency: 'High' | 'Medium' | 'Low', assigned: string })[]>([
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
    }, 1200);
  };

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-slate-100 uppercase tracking-tight">Intelligence & Support</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1 font-medium">Bihar State Vegetable Scheme Distributed Analytics & Help Desk (FRS-08)</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-1 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex">
           <button onClick={() => setActiveTab('analytics')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'analytics' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400'}`}>Analytics</button>
           {(role === UserRole.ADMIN || role === UserRole.DEPT_OFFICIAL || role === UserRole.UNION_USER) && (
              <button onClick={() => setActiveTab('tickets')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'tickets' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400'}`}>Issues Registry</button>
           )}
        </div>
      </div>

      {activeTab === 'analytics' ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm h-[400px]">
               <h3 className="text-sm font-black uppercase text-gray-400 mb-6 flex items-center tracking-widest">
                 <i className="fa-solid fa-chart-area mr-2 text-blue-500"></i> Scheme Utilization Trend (₹ Cr)
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
                 <i className="fa-solid fa-microscope mr-2 text-emerald-500"></i> Quality Distribution (Statewide)
               </h3>
               <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={qualityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {qualityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
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
                  <h3 className="font-black dark:text-slate-100 uppercase tracking-widest text-xs">{t.selectReportType}</h3>
                </div>
                <div className="space-y-2.5">
                  {reportTypes.filter(r => r.roles.includes(role)).map(type => (
                    <button
                      key={type.id}
                      onClick={() => { setReportType(type.id); setReportReady(false); }}
                      className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all ${
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

            <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm relative overflow-hidden min-h-[600px] flex flex-col">
              {!reportReady ? (
                <>
                  <div className="flex items-center space-x-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg">2</div>
                    <h3 className="font-black dark:text-slate-100 uppercase tracking-widest text-xs">{t.applyFilters}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    <FilterSection title={t.dateRange} icon="fa-calendar-days">
                      <div className="grid grid-cols-2 gap-3">
                        <input type="date" value={filters.startDate} className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold dark:text-white outline-none" onChange={e => setFilters({...filters, startDate: e.target.value})} />
                        <input type="date" value={filters.endDate} className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold dark:text-white outline-none" onChange={e => setFilters({...filters, endDate: e.target.value})} />
                      </div>
                    </FilterSection>

                    <FilterSection title={t.commodity} icon="fa-leaf">
                      <select className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold dark:text-white outline-none" value={filters.commodity} onChange={e => setFilters({...filters, commodity: e.target.value})}>
                        <option value="All">All Produce Categories</option>
                        <option value="Tomato">Tomato (Hybrid)</option>
                        <option value="Potato">Potato (Seed)</option>
                      </select>
                    </FilterSection>

                    <FilterSection title={t.district} icon="fa-map-location-dot">
                      <select className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold dark:text-white outline-none" value={filters.district} onChange={e => setFilters({...filters, district: e.target.value})}>
                        <option value="All">All Regional Unions</option>
                        <option value="Patna">Harit (Patna)</option>
                        <option value="Gaya">Magadh (Gaya)</option>
                      </select>
                    </FilterSection>

                    <FilterSection title="Output Format" icon="fa-file-export">
                        <div className="flex space-x-2">
                           <button className="flex-1 py-3 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">PDF Document</button>
                           <button className="flex-1 py-3 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100">Excel Sheet</button>
                        </div>
                    </FilterSection>
                  </div>

                  <div className="mt-auto pt-10">
                    <button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-emerald-600 text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-2xl active:scale-95">
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
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Snapshot: {filters.startDate} to {filters.endDate}</p>
                    </div>
                    <button onClick={() => setReportReady(false)} className="bg-gray-50 dark:bg-slate-800 p-3 rounded-xl text-gray-400 hover:text-emerald-600 transition-colors">
                      <i className="fa-solid fa-arrow-left mr-2"></i> <span className="text-[10px] font-black uppercase tracking-widest">Back to Filters</span>
                    </button>
                  </div>

                  <div className="flex-1 overflow-x-auto bg-gray-50/50 dark:bg-slate-800/30 rounded-3xl border dark:border-slate-800">
                    <table className="w-full text-left">
                      <thead className="border-b dark:border-slate-800">
                        <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <th className="px-6 py-4">ID</th>
                          <th className="px-6 py-4">Farmer</th>
                          <th className="px-6 py-4">Commodity</th>
                          <th className="px-6 py-4">Qty</th>
                          <th className="px-6 py-4">Total</th>
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

                  <div className="mt-8 flex space-x-3">
                    <button className="flex-1 flex items-center justify-center space-x-2 bg-emerald-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                      <i className="fa-solid fa-file-pdf"></i> <span>Download Full PDF</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                      <i className="fa-solid fa-file-excel"></i> <span>Export CSV</span>
                    </button>
                  </div>
                </div>
              )}

              {isGenerating && (
                <div className="absolute inset-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-12 text-center animate-in fade-in duration-300">
                  <div className="space-y-8">
                    <div className="w-20 h-20 border-8 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
                    <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{t.generating}</h4>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Support Ticket Master-Detail View (Optimized Click-then-Open) */
        <div className="animate-in fade-in duration-500 h-[700px] flex gap-8 relative overflow-hidden">
           {/* Master List */}
           <div className="flex-1 bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
              <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-xl font-black uppercase tracking-tight dark:text-white">Case Registry</h3>
                <div className="flex space-x-2">
                   <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-full">3 Active Issues</span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                 {tickets.map(ticket => (
                    <div 
                      key={ticket.id} 
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className={`p-6 rounded-[2rem] border transition-all cursor-pointer group active:scale-98 ${
                        selectedTicketId === ticket.id 
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl translate-x-2' 
                          : 'bg-gray-50/50 dark:bg-slate-800/30 border-gray-100 dark:border-slate-800 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black ${
                           selectedTicketId === ticket.id ? 'bg-white/20' : (ticket.urgency === 'High' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600')
                         }`}>
                           <i className={`fa-solid ${ticket.category === 'Technical' ? 'fa-microchip' : 'fa-indian-rupee-sign'}`}></i>
                         </div>
                         <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                           selectedTicketId === ticket.id ? 'bg-white/20 text-white' : (ticket.urgency === 'High' ? 'bg-red-600 text-white' : 'bg-amber-500 text-white')
                         }`}>{ticket.urgency} Priority</span>
                      </div>
                      <h4 className={`font-black uppercase tracking-tight ${selectedTicketId === ticket.id ? 'text-white' : 'text-gray-900 dark:text-slate-100'}`}>{ticket.name}</h4>
                      <p className={`text-[10px] mt-1 font-bold ${selectedTicketId === ticket.id ? 'text-emerald-100' : 'text-gray-400'}`}>{ticket.category} • {ticket.createdAt}</p>
                    </div>
                 ))}
              </div>
           </div>

           {/* Detail Sidebar (The "Open" State) */}
           <div className={`w-[450px] transition-all duration-500 absolute top-0 bottom-0 right-0 lg:relative ${
             selectedTicketId ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 lg:w-0'
           }`}>
             {selectedTicket && (
               <div className="h-full bg-white dark:bg-slate-900 rounded-[3rem] border-4 border-emerald-600/10 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
                  <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                     <div>
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Issue Details</p>
                        <h4 className="text-xl font-black uppercase tracking-tight">Case #00{selectedTicket.id}</h4>
                     </div>
                     <button onClick={() => setSelectedTicketId(null)} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all">
                        <i className="fa-solid fa-xmark"></i>
                     </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                     <section className="space-y-4">
                        <div className="flex items-center space-x-4">
                           <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 font-black">
                              {selectedTicket.name.charAt(0)}
                           </div>
                           <div>
                              <h5 className="font-black text-gray-900 dark:text-white uppercase">{selectedTicket.name}</h5>
                              <p className="text-[10px] text-gray-400 font-bold">{selectedTicket.mobile}</p>
                           </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border dark:border-slate-800">
                           <p className="text-sm text-gray-700 dark:text-slate-300 italic font-medium leading-relaxed">"{selectedTicket.message}"</p>
                        </div>
                     </section>

                     <section className="space-y-6">
                        <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b dark:border-slate-800 pb-3">Resolution Actions</h5>
                        <div className="space-y-4">
                           <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50 flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase text-blue-600">Assigned To</span>
                              <span className="text-sm font-bold text-blue-900 dark:text-blue-300">{selectedTicket.assigned}</span>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Official Remark</label>
                              <textarea className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white min-h-[100px]" placeholder="Add comments here..."></textarea>
                           </div>
                           <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-900/20 active:scale-95 transition-all">Mark as Resolved</button>
                        </div>
                     </section>
                  </div>
                  
                  <div className="p-6 bg-gray-50 dark:bg-slate-800/20 border-t dark:border-slate-800 text-center">
                     <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">VEGFED Bihar • Helpdesk v2.0</p>
                  </div>
               </div>
             )}
             {!selectedTicketId && (
               <div className="h-full flex items-center justify-center bg-gray-50/30 dark:bg-slate-900/30 rounded-[3rem] border border-dashed dark:border-slate-800">
                  <div className="text-center text-gray-300">
                     <i className="fa-solid fa-hand-pointer text-4xl mb-4"></i>
                     <p className="text-xs font-black uppercase tracking-widest">Select an issue to open</p>
                  </div>
               </div>
             )}
           </div>
        </div>
      )}
    </div>
  );
};

export default ReportsModule;
