
import React, { useState } from 'react';
import { UserRole } from '../types';

const ProjectManagementModule: React.FC<{ role: UserRole }> = ({ role }) => {
  const [activeProject, setActiveProject] = useState<any>(null);

  const projects = [
    { id: 'PRJ-2025-01', name: 'Danapur Mini-Mandi Hub', type: 'Infrastructure', budget: 11430000, progress: 65, status: 'Active', location: 'Danapur' },
    { id: 'PRJ-2025-02', name: 'Khagaul Cold Storage Unit', type: 'Equipment', budget: 4500000, progress: 20, status: 'Planned', location: 'Patna' }
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Project Management</h2>
          <p className="text-gray-500 text-sm">Tracking State Infrastructure & Cooperative Assets (FR-06)</p>
        </div>
        <button className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-200 dark:shadow-none hover:bg-emerald-700">Initiate Project</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map(p => (
                <div key={p.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
                   <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center text-xl">
                        <i className="fa-solid fa-building-wheat"></i>
                      </div>
                      <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">{p.status}</span>
                   </div>
                   <h4 className="text-lg font-black text-gray-900 dark:text-white leading-tight mb-2 uppercase tracking-tight">{p.name}</h4>
                   <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6">{p.location}, Bihar</p>
                   
                   <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                         <span className="text-gray-400">Construction Progress</span>
                         <span className="text-blue-600">{p.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-50 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden border dark:border-slate-700">
                         <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${p.progress}%` }}></div>
                      </div>
                   </div>

                   <div className="mt-8 pt-6 border-t border-gray-50 dark:border-slate-800 flex justify-between items-center">
                      <div>
                         <p className="text-[9px] font-black text-gray-400 uppercase">Allocated Budget</p>
                         <p className="text-sm font-black text-gray-900 dark:text-slate-100">₹ {(p.budget/1000000).toFixed(2)} Cr</p>
                      </div>
                      <button onClick={() => setActiveProject(p)} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Full WBS</button>
                   </div>
                </div>
              ))}
           </div>
           
           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative">
              <div className="relative z-10">
                <h4 className="text-xl font-black mb-4 uppercase">Project Audit Log</h4>
                <div className="space-y-4">
                   {[1,2].map(i => (
                     <div key={i} className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <p className="text-xs font-medium text-slate-300">Phase 2 inspection completed for <span className="text-white font-bold">Danapur Mandi</span>. Quality verified.</p>
                        <span className="text-[9px] text-slate-500 ml-auto">2h ago</span>
                     </div>
                   ))}
                </div>
              </div>
              <i className="fa-solid fa-list-check absolute -bottom-10 -right-10 text-[180px] text-white/5 rotate-12"></i>
           </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm space-y-8">
           <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-widest border-b pb-4">Tender Board</h3>
           <div className="space-y-6">
              {[
                { title: 'Cold Room Puf Panels', date: 'Jan 25', bids: 4 },
                { title: 'Sorting Belt Conv.', date: 'Feb 02', bids: 12 }
              ].map((t, idx) => (
                <div key={idx} className="p-5 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border dark:border-slate-800 group hover:border-emerald-500 transition-all cursor-pointer">
                   <div className="flex justify-between items-center mb-3">
                      <span className="text-[9px] font-black text-emerald-600 bg-white dark:bg-slate-900 px-2 py-1 rounded border dark:border-slate-700 uppercase">Live Bid</span>
                      <span className="text-[9px] text-gray-400 font-bold uppercase">{t.date}</span>
                   </div>
                   <h5 className="font-black text-gray-800 dark:text-slate-100 uppercase tracking-tight">{t.title}</h5>
                   <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-widest">{t.bids} Vendors Participating</p>
                </div>
              ))}
           </div>
           <div className="bg-blue-900 rounded-3xl p-6 text-white text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300 mb-2">Total Project Spend (FY26)</p>
              <p className="text-4xl font-black">₹ 84.5 Cr</p>
              <button className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest">Download Cost Audit</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectManagementModule;
