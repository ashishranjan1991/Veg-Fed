
import React, { useState, useEffect } from 'react';
import { UserRole, Vendor, DailyPrice } from '../types';
import { Language, translations } from '../translations';

const MasterDataModule: React.FC<{ role: UserRole, language?: Language }> = ({ role, language = 'en' }) => {
  const t = translations[language];
  const [activeSubTab, setActiveSubTab] = useState('vegetables');
  const [isSyncing, setIsSyncing] = useState(false);

  const [dailyPrices, setDailyPrices] = useState<DailyPrice[]>([
    { vegetable: 'Tomato', price: 26.50, lastUpdated: '2026-01-11 08:00', updatedBy: 'Admin' },
    { vegetable: 'Potato', price: 15.20, lastUpdated: '2026-01-11 08:00', updatedBy: 'Admin' },
    { vegetable: 'Onion', price: 34.00, lastUpdated: '2026-01-11 08:00', updatedBy: 'Admin' },
    { vegetable: 'Brinjal', price: 21.00, lastUpdated: '2026-01-11 08:00', updatedBy: 'Admin' },
  ]);

  const [vendors] = useState<Vendor[]>([
    { id: 'VEN-001', name: 'Bihar Fresh Mart', contactPerson: 'Arun Jha', mobile: '9988776655', type: 'Wholesaler', location: 'Patna' },
    { id: 'VEN-002', name: 'Metro Institutional', contactPerson: 'Sita Ram', mobile: '8877665544', type: 'Institutional', location: 'Gaya' },
  ]);

  const handleSyncWithDB = () => {
    setIsSyncing(true);
    // Simulate MySQL Write
    setTimeout(() => {
      setIsSyncing(false);
      alert(t.syncSuccess);
    }, 1200);
  };

  const handlePriceChange = (veg: string, val: string) => {
    const updated = dailyPrices.map(p => 
      p.vegetable === veg ? { ...p, price: Number(val), lastUpdated: new Date().toLocaleString() } : p
    );
    setDailyPrices(updated);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">{t.masterDataMgmt}</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm">Configure system-wide reference data and MySQL synchronization</p>
        </div>
        <button 
          onClick={handleSyncWithDB}
          disabled={isSyncing}
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition-all flex items-center space-x-2"
        >
          {isSyncing ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-cloud-arrow-up"></i>}
          <span>Push to MySQL</span>
        </button>
      </div>

      <div className="flex bg-white dark:bg-slate-900 rounded-xl shadow-sm border dark:border-slate-800 overflow-hidden mb-6 transition-colors">
        {['vegetables', 'daily-pricing', 'vendors', 'pricing', 'parameters'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex-1 border-r last:border-0 dark:border-slate-800 ${
              activeSubTab === tab ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border dark:border-slate-800 shadow-sm p-10 transition-colors">
        {activeSubTab === 'daily-pricing' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
               <h3 className="text-xl font-black text-gray-900 dark:text-slate-100 uppercase tracking-tight">{t.centralPrices}</h3>
               <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full uppercase tracking-widest">Authorized Change Level</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dailyPrices.map(p => (
                <div key={p.vegetable} className="p-6 rounded-2xl border dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 flex flex-col items-center group hover:border-emerald-500 transition-all">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{p.vegetable}</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-gray-400">₹</span>
                    <input 
                      type="number" 
                      value={p.price} 
                      onChange={(e) => handlePriceChange(p.vegetable, e.target.value)}
                      className="bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl px-8 py-3 w-32 text-center text-xl font-black text-emerald-600 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase mt-4">Last Updated: {p.lastUpdated}</p>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/50 flex items-start space-x-4">
               <i className="fa-solid fa-circle-info text-blue-600 mt-1"></i>
               <p className="text-xs text-blue-800 dark:text-blue-300 font-medium leading-relaxed">
                 Prices updated here are immediately visible to all PVCS nodes in the 3-tier network upon MySQL sync. Grade-wise multipliers will be applied automatically at the point of procurement.
               </p>
            </div>
          </div>
        )}

        {activeSubTab === 'vendors' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-900 dark:text-slate-100 uppercase tracking-tight">Vendor Master</h3>
              <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-200 dark:shadow-none transition-all">Add New Vendor</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vendors.map(v => (
                <div key={v.id} className="p-6 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border dark:border-slate-800 flex items-center justify-between group">
                  <div className="flex items-center space-x-5">
                    <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-600 text-2xl shadow-sm border dark:border-slate-700">
                      <i className="fa-solid fa-shop"></i>
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 dark:text-slate-100 text-lg">{v.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{v.type} • {v.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-700 dark:text-slate-300">{v.contactPerson}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{v.mobile}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'vegetables' && (
          <div className="space-y-8">
             <div className="flex justify-between items-center">
               <h3 className="text-xl font-black text-gray-900 dark:text-slate-100 uppercase tracking-tight">Vegetable Registry</h3>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="border-b dark:border-slate-800">
                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      <th className="pb-4">Name</th>
                      <th className="pb-4">Category</th>
                      <th className="pb-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-800">
                    {[{ name: 'Tomato', cat: 'Solanaceous' }, { name: 'Potato', cat: 'Tuber' }].map(v => (
                      <tr key={v.name} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                        <td className="py-5 font-black text-gray-800 dark:text-slate-200">{v.name}</td>
                        <td className="py-5 text-gray-500 dark:text-slate-400 text-sm">{v.cat}</td>
                        <td className="py-5 text-right">
                          <button className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">Edit Entry</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
             </div>
          </div>
        )}

        {activeSubTab === 'pricing' && (
          <div className="space-y-8">
            <h3 className="text-xl font-black text-gray-900 dark:text-slate-100 uppercase tracking-tight">Quality Multiplier Master</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {['A', 'B', 'C', 'D'].map((grade, i) => (
                <div key={grade} className="p-8 rounded-[2rem] border dark:border-slate-800 bg-gray-50 dark:bg-slate-800/30 flex flex-col items-center text-center">
                  <span className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl mb-6 shadow-xl shadow-emerald-200 dark:shadow-none">
                    {grade}
                  </span>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Grade Modifier</p>
                  <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400">x{(1.0 - (i*0.2)).toFixed(1)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterDataModule;
