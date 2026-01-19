
import React from 'react';
import { UserRole, Scheme } from '../types';

const SchemeModule: React.FC<{ role: UserRole }> = ({ role }) => {
  const schemes: Scheme[] = [
    { id: 'S001', name: 'आधारभूत संरचना योजना (Infrastructure Development)', code: 'VEGFED-INF-25', budget: 11430000, utilized: 4500000, status: 'Active' },
    { id: 'S002', name: 'तरकारी आउटलेट योजना (Outlet Program)', code: 'VEGFED-OUT-25', budget: 744000, utilized: 120000, status: 'Active' },
    { id: 'S003', name: 'प्याज भण्डारण योजना (Onion Storage)', code: 'VEGFED-ONS-25', budget: 1305105, utilized: 800000, status: 'Active' },
    { id: 'S004', name: 'Tomato & Potato Cultivation Subsidy', code: 'VEGFED-TPC-25', budget: 44400000, utilized: 0, status: 'Planned' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 uppercase tracking-tight">Active VEGFED Schemes</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm">Financial tracking and allocation of Bihar State Cooperative incentives</p>
        </div>
        {role === UserRole.DEPT_OFFICIAL && (
          <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition-all">
            New Allocation
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {schemes.map(scheme => (
          <div key={scheme.id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm p-8 hover:shadow-xl transition-all group overflow-hidden relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 relative z-10">
              <div className="flex items-center space-x-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:rotate-6 ${
                  scheme.status === 'Active' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                }`}>
                  <i className="fa-solid fa-landmark-dome"></i>
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-slate-100 leading-tight uppercase tracking-tight">{scheme.name}</h3>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Scheme Code: {scheme.code}</p>
                </div>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mt-4 md:mt-0 ${
                scheme.status === 'Active' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-none' : 'bg-blue-600 text-white'
              }`}>
                {scheme.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <span>Fund Utilization</span>
                  <span className="text-emerald-600">{Math.round((scheme.utilized / scheme.budget) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-3 p-1 border dark:border-slate-700">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000 shadow-sm" style={{ width: `${(scheme.utilized / scheme.budget) * 100}%` }}></div>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Approved Budget</p>
                <p className="text-2xl font-black text-gray-900 dark:text-slate-100 leading-none">₹ {(scheme.budget).toLocaleString()}</p>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Available Funds</p>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none">₹ {(scheme.budget - scheme.utilized).toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50 dark:border-slate-800 flex items-center space-x-6 relative z-10">
              <button className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 hover:text-emerald-700">View Beneficiary PVCS</button>
              <button className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600">Audit & Disbursement Log</button>
              <button className="hidden md:block text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600">Download Official Guidelines</button>
            </div>
            
            <i className="fa-solid fa-file-invoice-dollar absolute -bottom-10 -right-10 text-[180px] text-gray-50 dark:text-slate-800 pointer-events-none group-hover:text-emerald-50 group-hover:dark:text-emerald-950 transition-colors"></i>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchemeModule;
