
import React, { useState } from 'react';
import { UserRole } from '../types';
import { Language, translations } from '../translations';

interface ReportsModuleProps {
  role: UserRole;
  language: Language;
}

const ReportsModule: React.FC<ReportsModuleProps> = ({ role, language }) => {
  const t = translations[language];
  const [reportType, setReportType] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportReady, setReportReady] = useState(false);
  
  // Advanced Filters State
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
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
    
    // Simulated multi-step processing logic
    setTimeout(() => {
      setIsGenerating(false);
      setReportReady(true);
    }, 2800);
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
          <h2 className="text-3xl font-black text-gray-900 dark:text-slate-100 uppercase tracking-tight">Reporting Engine</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1 font-medium">Bihar State Vegetable Scheme Distributed Analytics</p>
        </div>
        <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Real-time Connection: <span className="text-gray-900 dark:text-slate-200"> Bihar-Net-Node-01</span></span>
        </div>
      </div>

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

        {/* Step 2: Optimized Filters (Col 8) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center space-x-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-200 dark:shadow-none">2</div>
            <h3 className="font-black dark:text-slate-100 uppercase tracking-widest text-xs">{t.applyFilters}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {/* Group: Time Selection */}
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

            {/* Group: Production Categorization */}
            <FilterSection title={t.commodity} icon="fa-leaf">
              <select 
                className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-gray-700 dark:text-slate-200 outline-none"
                onChange={e => setFilters({...filters, commodity: e.target.value})}
              >
                <option value="All">All Produce Categories</option>
                <option value="Tomato">Tomato (Processing Grade)</option>
                <option value="Potato">Potato (Seed Grade)</option>
                <option value="Onion">Onion (Red/Local)</option>
                <option value="Brinjal">Brinjal (Variety-A)</option>
              </select>
              <div className="flex items-center bg-gray-50 dark:bg-slate-800 rounded-xl p-1">
                 <button onClick={() => setFilters({...filters, depth: 'Detailed'})} className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${filters.depth === 'Detailed' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}>{t.detailed}</button>
                 <button onClick={() => setFilters({...filters, depth: 'Summary'})} className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${filters.depth === 'Summary' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}>{t.summary}</button>
              </div>
            </FilterSection>

            {/* Group: Geographical Filters */}
            {(role === UserRole.ADMIN || role === UserRole.DEPT_OFFICIAL || role === UserRole.UNION_USER) && (
              <FilterSection title={t.district} icon="fa-map-location-dot">
                <select 
                  className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-gray-700 dark:text-slate-200 outline-none"
                  onChange={e => setFilters({...filters, district: e.target.value})}
                >
                  <option value="All">All Regional Unions</option>
                  <option value="Patna">Harit (Patna Union)</option>
                  <option value="Motihari">Tirhut (Motihari Union)</option>
                  <option value="Darbhanga">Mithila (Darbhanga Union)</option>
                  <option value="Gaya">Magadh (Gaya Union)</option>
                </select>
                <select 
                  className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-gray-700 dark:text-slate-200 outline-none"
                  onChange={e => setFilters({...filters, pvcs: e.target.value})}
                  disabled={filters.district === 'All'}
                >
                  <option value="All">All {filters.district} PVCS Centers</option>
                  <option>Urban Center 101</option>
                  <option>Block Center 102</option>
                  <option>Nodal Point 103</option>
                </select>
              </FilterSection>
            )}

            {/* Group: Operational Quality */}
            <FilterSection title="Quality & Payment Metrics" icon="fa-magnifying-glass-chart">
               <div className="grid grid-cols-2 gap-3">
                  <select 
                    className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-gray-700 dark:text-slate-200 outline-none"
                    onChange={e => setFilters({...filters, grade: e.target.value})}
                  >
                    <option value="All">{t.grade}: All</option>
                    <option value="A">Grade A (Premium)</option>
                    <option value="B">Grade B (Standard)</option>
                    <option value="C">Grade C (Industrial)</option>
                  </select>
                  <select 
                    className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-gray-700 dark:text-slate-200 outline-none"
                    onChange={e => setFilters({...filters, status: e.target.value})}
                  >
                    <option value="All">{t.status}: All</option>
                    <option value="Paid">Processed (Paid)</option>
                    <option value="Pending">Pending (Verification)</option>
                  </select>
               </div>
               <div className="pt-2">
                 <button 
                  onClick={handleGenerate}
                  disabled={!reportType || isGenerating}
                  className="w-full bg-emerald-600 text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-emerald-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xl shadow-emerald-100 active:scale-95"
                >
                  {isGenerating ? <i className="fa-solid fa-dna fa-spin mr-3"></i> : <i className="fa-solid fa-wand-magic-sparkles mr-3"></i>}
                  {t.generateReport}
                </button>
               </div>
            </FilterSection>
          </div>

          {/* Results Overlay */}
          {(isGenerating || reportReady) && (
            <div className="absolute inset-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-12 text-center animate-in fade-in duration-300">
               {isGenerating ? (
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
               ) : (
                 <div className="space-y-8 animate-in slide-in-from-bottom-12 duration-700">
                    <div className="w-32 h-32 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto shadow-inner border-4 border-white dark:border-slate-800 rotate-3">
                      <i className="fa-solid fa-file-shield"></i>
                    </div>
                    <div>
                      <h4 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none">{t.reportReady}</h4>
                      <p className="text-[10px] text-gray-400 mt-4 font-black uppercase tracking-widest">Type: {reportType.replace('-', ' ')} | Scope: {filters.depth}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                       <button className="flex flex-col items-center justify-center space-y-2 bg-emerald-600 text-white p-6 rounded-[2rem] shadow-xl hover:bg-emerald-700 transition-all active:scale-95 group">
                          <i className="fa-solid fa-file-pdf text-2xl group-hover:scale-110 transition-transform"></i>
                          <span className="text-[10px] font-black uppercase tracking-widest">{t.downloadPDF}</span>
                       </button>
                       <button className="flex flex-col items-center justify-center space-y-2 bg-blue-600 text-white p-6 rounded-[2rem] shadow-xl hover:bg-blue-700 transition-all active:scale-95 group">
                          <i className="fa-solid fa-file-excel text-2xl group-hover:scale-110 transition-transform"></i>
                          <span className="text-[10px] font-black uppercase tracking-widest">{t.downloadExcel}</span>
                       </button>
                    </div>
                    
                    <button onClick={() => setReportReady(false)} className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-emerald-600 transition-colors">
                      <i className="fa-solid fa-rotate-left mr-2"></i> Adjust Parameters
                    </button>
                 </div>
               )}
            </div>
          )}
          
          <i className="fa-solid fa-chart-pie absolute -bottom-20 -left-20 text-[250px] text-gray-50 dark:text-slate-800/40 pointer-events-none -rotate-12"></i>
        </div>
      </div>
    </div>
  );
};

export default ReportsModule;
