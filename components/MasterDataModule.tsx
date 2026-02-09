
import React, { useState, useMemo } from 'react';
import { UserRole, Vendor, DailyPrice } from '../types';
import { Language, translations } from '../translations';

const MasterDataModule: React.FC<{ role: UserRole, language?: Language }> = ({ role, language = 'en' }) => {
  const t = translations[language];
  const isPVCS = role === UserRole.PVCS_USER;
  
  const initialTabs = isPVCS 
    ? ['daily-pricing', 'vendors'] 
    : ['vegetables', 'daily-pricing', 'vendors', 'pricing', 'parameters'];

  const [activeSubTab, setActiveSubTab] = useState(initialTabs[0]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [vendorView, setVendorView] = useState<'cards' | 'scorecard'>('cards');

  // Vendor Filtering State
  const [vendorFilters, setVendorFilters] = useState({
    type: 'All',
    premiumOnly: false
  });

  const [dailyPrices, setDailyPrices] = useState<DailyPrice[]>([
    { vegetable: 'Tomato', price: 26.50, lastUpdated: '2026-01-11 08:00', updatedBy: 'Admin' },
    { vegetable: 'Potato', price: 15.20, lastUpdated: '2026-01-11 08:00', updatedBy: 'Admin' },
    { vegetable: 'Onion', price: 34.00, lastUpdated: '2026-01-11 08:00', updatedBy: 'Admin' },
    { vegetable: 'Brinjal', price: 21.00, lastUpdated: '2026-01-11 08:00', updatedBy: 'Admin' },
  ]);

  const [vendors] = useState<Vendor[]>([
    { id: 'VEN-001', name: 'Bihar Fresh Mart', contactPerson: 'Arun Jha', mobile: '9988776655', type: 'Wholesaler', location: 'Patna', rating: 4.8, fulfillmentRate: 96, priceDeviation: 2.5, isPremium: true },
    { id: 'VEN-002', name: 'Metro Institutional', contactPerson: 'Sita Ram', mobile: '8877665544', type: 'Institutional', location: 'Gaya', rating: 4.2, fulfillmentRate: 88, priceDeviation: 4.1 },
    { id: 'VEN-003', name: 'Saran Exports', contactPerson: 'Vikram Singh', mobile: '9122334455', type: 'Exporter', location: 'Chapra', rating: 4.5, fulfillmentRate: 92, priceDeviation: 1.8, isPremium: true },
    { id: 'VEN-004', name: 'Pataliputra Retail', contactPerson: 'Neha Kumari', mobile: '8005566778', type: 'Retailer', location: 'Patna', rating: 3.5, fulfillmentRate: 75, priceDeviation: 6.2 },
  ]);

  // Filter Logic for Vendors
  const filteredVendors = useMemo(() => {
    return vendors.filter(v => {
      const typeMatch = vendorFilters.type === 'All' || v.type === vendorFilters.type;
      const premiumMatch = !vendorFilters.premiumOnly || v.isPremium === true;
      return typeMatch && premiumMatch;
    });
  }, [vendors, vendorFilters]);

  const handleSyncWithDB = () => {
    setIsSyncing(true);
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

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={`fa-solid fa-star text-[10px] ${
              star <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200 dark:text-slate-800'
            }`}
          />
        ))}
        <span className="text-[10px] font-black ml-1 text-gray-500">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            {isPVCS ? "Local Node Master Data" : t.masterDataMgmt}
          </h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm">
            {isPVCS ? "Manage local center vendors and daily procurement prices" : "Configure system-wide reference data and MySQL synchronization"}
          </p>
        </div>
        <button 
          onClick={handleSyncWithDB}
          disabled={isSyncing}
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition-all flex items-center space-x-2"
        >
          {isSyncing ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-cloud-arrow-up"></i>}
          <span>{isPVCS ? "Sync to Cluster" : "Push to MySQL"}</span>
        </button>
      </div>

      <div className="flex bg-white dark:bg-slate-900 rounded-xl shadow-sm border dark:border-slate-800 overflow-hidden mb-6 transition-colors">
        {initialTabs.map((tab) => (
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

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border dark:border-slate-800 shadow-sm p-10 transition-colors min-h-[500px]">
        {activeSubTab === 'daily-pricing' && (
          <div className="space-y-8 animate-in fade-in">
            <div className="flex justify-between items-center">
               <h3 className="text-xl font-black text-gray-900 dark:text-slate-100 uppercase tracking-tight">
                 {isPVCS ? "Local Node Daily Pricing" : t.centralPrices}
               </h3>
               <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full uppercase tracking-widest">
                 {isPVCS ? "Center Level Override" : "Authorized Change Level"}
               </span>
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
          </div>
        )}

        {activeSubTab === 'vendors' && (
          <div className="space-y-8 animate-in fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-slate-100 uppercase tracking-tight">
                  {isPVCS ? "Local Center Vendors" : "Vendor Registry & Performance"}
                </h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Tier-Wise Compliance & Rating Matrix</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 dark:bg-slate-800 p-1 rounded-xl flex">
                  <button onClick={() => setVendorView('cards')} className={`px-4 py-2 text-[9px] font-black uppercase rounded-lg transition-all ${vendorView === 'cards' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}>Profile Cards</button>
                  <button onClick={() => setVendorView('scorecard')} className={`px-4 py-2 text-[9px] font-black uppercase rounded-lg transition-all ${vendorView === 'scorecard' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}>Scorecard View</button>
                </div>
                <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-200 dark:shadow-none transition-all">Add Vendor</button>
              </div>
            </div>

            {/* Vendor Filter UI */}
            <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border dark:border-slate-800 flex flex-wrap items-center gap-6 shadow-inner">
               <div className="flex items-center space-x-3">
                  <i className="fa-solid fa-filter text-emerald-600 text-xs"></i>
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Filter By</span>
               </div>
               
               <div className="flex flex-col space-y-1">
                  <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Vendor Category</label>
                  <select 
                    value={vendorFilters.type}
                    onChange={(e) => setVendorFilters({...vendorFilters, type: e.target.value})}
                    className="bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl px-4 py-2 text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
                  >
                    <option value="All">All Categories</option>
                    <option value="Wholesaler">Wholesaler</option>
                    <option value="Retailer">Retailer</option>
                    <option value="Exporter">Exporter</option>
                    <option value="Institutional">Institutional</option>
                  </select>
               </div>

               <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl px-4 py-2.5 transition-all">
                  <input 
                    type="checkbox" 
                    id="premium-toggle"
                    checked={vendorFilters.premiumOnly}
                    onChange={(e) => setVendorFilters({...vendorFilters, premiumOnly: e.target.checked})}
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="premium-toggle" className="text-[10px] font-black text-gray-600 dark:text-slate-300 uppercase tracking-widest cursor-pointer select-none">
                    Premium Partners Only
                  </label>
               </div>

               <button 
                onClick={() => setVendorFilters({type: 'All', premiumOnly: false})}
                className="text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:underline"
               >
                 Reset Filters
               </button>

               <div className="ml-auto">
                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Showing {filteredVendors.length} Partners</span>
               </div>
            </div>

            {vendorView === 'cards' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredVendors.map(v => (
                  <div key={v.id} className="p-8 bg-gray-50 dark:bg-slate-800/40 rounded-[2.5rem] border dark:border-slate-800 flex flex-col group hover:border-emerald-500/50 transition-all relative overflow-hidden shadow-sm">
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center space-x-5">
                        <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-3xl shadow-sm border transition-all ${v.isPremium ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-white dark:bg-slate-900 text-emerald-600 border-gray-100 dark:border-slate-700'}`}>
                          <i className="fa-solid fa-shop"></i>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                             <h4 className="font-black text-gray-900 dark:text-slate-100 text-xl tracking-tight">{v.name}</h4>
                             {v.isPremium && <i className="fa-solid fa-circle-check text-emerald-500 text-xs" title="Verified Premium Partner"></i>}
                          </div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{v.type} • {v.location}</p>
                          <div className="mt-2">
                            <StarRating rating={v.rating} />
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${v.rating >= 4.5 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {v.rating >= 4.5 ? 'Elite' : 'Standard'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-8">
                       <div className="space-y-3">
                          <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            <span>Fulfillment</span>
                            <span className="text-emerald-600">{v.fulfillmentRate}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${v.fulfillmentRate}%` }}></div>
                          </div>
                       </div>
                       <div className="space-y-3">
                          <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            <span>Price Deviation</span>
                            <span className={v.priceDeviation > 5 ? 'text-amber-500' : 'text-blue-500'}>{v.priceDeviation}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                             <div className={`h-full rounded-full ${v.priceDeviation > 5 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(v.priceDeviation * 10, 100)}%` }}></div>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-6 border-t dark:border-slate-800">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Contact Person</span>
                        <span className="text-xs font-bold text-gray-700 dark:text-slate-300">{v.contactPerson}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="w-10 h-10 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl flex items-center justify-center text-gray-400 hover:text-emerald-600 transition-all"><i className="fa-solid fa-phone-flip text-[10px]"></i></button>
                        <button className="w-10 h-10 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl flex items-center justify-center text-gray-400 hover:text-emerald-600 transition-all"><i className="fa-solid fa-chart-line text-[10px]"></i></button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredVendors.length === 0 && (
                  <div className="col-span-2 py-20 text-center bg-gray-50 dark:bg-slate-800/20 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-slate-800">
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest italic">No vendors match the active filters</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-50/50 dark:bg-slate-800/30 rounded-[2.5rem] border dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300 shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-slate-800/80 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b dark:border-slate-700">
                      <th className="px-8 py-5">Vendor ID & Name</th>
                      <th className="px-8 py-5">Performance Rating</th>
                      <th className="px-8 py-5 text-center">Fulfillment Rate</th>
                      <th className="px-8 py-5 text-center">Avg. Price Dev.</th>
                      <th className="px-8 py-5 text-right">Compliance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-800">
                    {filteredVendors.map(v => (
                      <tr key={v.id} className="hover:bg-white dark:hover:bg-slate-800 transition-colors group">
                        <td className="px-8 py-6">
                           <div className="flex items-center space-x-3">
                              <span className="text-[10px] font-mono text-gray-400">{v.id}</span>
                              <p className="text-sm font-black text-gray-900 dark:text-slate-100">{v.name}</p>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex flex-col space-y-1">
                              <StarRating rating={v.rating} />
                              <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">{v.rating >= 4.5 ? 'Exceeds Expectations' : 'Meeting Standards'}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                           <span className={`px-4 py-1.5 rounded-full text-[11px] font-black ${v.fulfillmentRate > 90 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                             {v.fulfillmentRate}%
                           </span>
                        </td>
                        <td className="px-8 py-6 text-center">
                           <span className={`text-[11px] font-black ${v.priceDeviation < 3 ? 'text-blue-600' : 'text-amber-500'}`}>
                             {v.priceDeviation > 0 ? '+' : ''}{v.priceDeviation}%
                           </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <div className="flex items-center justify-end space-x-3">
                              <div className={`w-2 h-2 rounded-full ${v.rating > 3 ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></div>
                              <span className="text-[9px] font-black uppercase text-gray-400">Validated</span>
                           </div>
                        </td>
                      </tr>
                    ))}
                    {filteredVendors.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-8 py-20 text-center">
                          <p className="text-xs font-black text-gray-400 uppercase tracking-widest italic">No matching records found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'vegetables' && (
          <div className="space-y-8 animate-in fade-in">
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
          <div className="space-y-8 animate-in fade-in">
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
