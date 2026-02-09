
import React, { useState, useEffect, useMemo } from 'react';
import { ProcurementEntry, Vendor, DailyPrice, UserRole } from '../types';
import { Language, translations } from '../translations';

interface ProcurementModuleProps {
  role: UserRole;
  language?: Language;
}

type SortField = 'timestamp' | 'totalAmount' | 'status' | 'id';
type SortOrder = 'asc' | 'desc';
type TransactionMode = 'PROCUREMENT' | 'SALES';

const ProcurementModule: React.FC<ProcurementModuleProps> = ({ role, language = 'en' }) => {
  const t = translations[language];
  const [formStep, setFormStep] = useState<'list' | 'initiation' | 'capture' | 'review'>('list');
  const [transactionMode, setTransactionMode] = useState<TransactionMode>('PROCUREMENT');
  const [dbStatus, setDbStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  
  const isPVCS = role === UserRole.PVCS_USER;

  // Filtering State
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    vegetable: 'All',
    grade: 'All',
    sourceType: 'All',
    mode: 'All' as TransactionMode | 'All'
  });

  // Sorting State
  const [sortConfig, setSortConfig] = useState<{ field: SortField; order: SortOrder }>({
    field: 'timestamp',
    order: 'desc'
  });

  const [centralPrices, setCentralPrices] = useState<DailyPrice[]>([
    { vegetable: 'Tomato', price: 26.50, lastUpdated: '2026-01-11 08:00', updatedBy: 'Admin' },
    { vegetable: 'Potato', price: 15.20, lastUpdated: '2026-01-11 08:00', updatedBy: 'Admin' },
    { vegetable: 'Onion', price: 34.00, lastUpdated: '2026-01-11 08:00', updatedBy: 'Admin' },
    { vegetable: 'Brinjal', price: 21.00, lastUpdated: '2026-01-11 08:00', updatedBy: 'Admin' },
  ]);

  const [entries, setEntries] = useState<(ProcurementEntry & { mode: TransactionMode })[]>([
    { 
      id: 'PROC-101', 
      farmerName: 'Sunil Mahto', 
      sourceType: 'Farmer',
      location: 'Danapur PVCS Center',
      vegetable: 'Tomato', 
      quantity: 250, 
      unit: 'Kg',
      grade: 'A', 
      pricePerUnit: 26.50, 
      totalAmount: 6625, 
      timestamp: '2026-01-11 10:30',
      status: 'Locked',
      procurementDate: '2026-01-11',
      mode: 'PROCUREMENT'
    },
    { 
      id: 'SALES-102', 
      farmerName: 'Bihar Fresh Ltd', 
      sourceType: 'Vendor',
      location: 'Patna Central PVCS',
      vegetable: 'Onion', 
      quantity: 500, 
      unit: 'Kg',
      grade: 'B', 
      pricePerUnit: 27.20, 
      totalAmount: 13600, 
      timestamp: '2026-01-10 14:15',
      status: 'Locked',
      procurementDate: '2026-01-10',
      mode: 'SALES'
    },
  ]);

  const [newEntry, setNewEntry] = useState<Partial<ProcurementEntry>>({
    farmerName: '',
    vendorId: '',
    sourceType: 'Farmer',
    location: isPVCS ? 'Patna Block PVCS' : 'Patna Central PVCS',
    vegetable: 'Tomato',
    quantity: 0,
    unit: 'Kg',
    grade: 'A',
    procurementDate: new Date().toISOString().split('T')[0]
  });

  // Filter and Sort Logic
  const filteredAndSortedEntries = useMemo(() => {
    let result = [...entries];

    if (filters.startDate) result = result.filter(e => e.procurementDate >= filters.startDate);
    if (filters.endDate) result = result.filter(e => e.procurementDate <= filters.endDate);
    if (filters.vegetable !== 'All') result = result.filter(e => e.vegetable === filters.vegetable);
    if (filters.grade !== 'All') result = result.filter(e => e.grade === filters.grade);
    if (filters.sourceType !== 'All') result = result.filter(e => e.sourceType === filters.sourceType);
    if (filters.mode !== 'All') result = result.filter(e => e.mode === filters.mode);

    result.sort((a, b) => {
      let valA: any = a[sortConfig.field];
      let valB: any = b[sortConfig.field];
      if (sortConfig.field === 'totalAmount') return sortConfig.order === 'asc' ? valA - valB : valB - valA;
      if (typeof valA === 'string') { valA = valA.toLowerCase(); valB = valB.toLowerCase(); }
      if (valA < valB) return sortConfig.order === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.order === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [entries, filters, sortConfig]);

  const toggleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      order: prev.field === field && prev.order === 'desc' ? 'asc' : 'desc'
    }));
  };

  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      vegetable: 'All',
      grade: 'All',
      sourceType: 'All',
      mode: 'All'
    });
  };

  const calculatePrice = () => {
    const base = centralPrices.find(p => p.vegetable === (newEntry.vegetable || 'Tomato'))?.price || 0;
    const gradeMultipliers: Record<string, number> = { 'A': 1.0, 'B': 0.8, 'C': 0.6 };
    const multiplier = gradeMultipliers[newEntry.grade || 'A'] || 0;
    const price = base * multiplier;
    return newEntry.unit === 'Quintal' ? price * 100 : price;
  };

  const handleApproveAndSave = () => {
    const price = calculatePrice();
    const total = price * (newEntry.quantity || 0);
    const entry: ProcurementEntry & { mode: TransactionMode } = {
      ...newEntry as ProcurementEntry,
      id: `${transactionMode === 'PROCUREMENT' ? 'PROC' : 'SALE'}-${Date.now().toString().slice(-6)}`,
      pricePerUnit: price,
      totalAmount: total,
      timestamp: new Date().toLocaleString(),
      status: 'Locked',
      mode: transactionMode
    };
    setEntries([entry, ...entries]);
    setFormStep('list');
  };

  const FormContainer = ({ title, children, nextStep, prevStep, nextLabel = "Continue" }: any) => (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 shadow-2xl p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-10 pb-6 border-b dark:border-slate-800">
        <div>
          <h3 className="text-2xl font-black dark:text-white uppercase tracking-tight">{title}</h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Mode: {transactionMode}</p>
        </div>
        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-lg uppercase tracking-widest">
          Step {formStep === 'initiation' ? '1' : formStep === 'capture' ? '2' : '3'} of 3
        </span>
      </div>
      <div className="space-y-8">{children}</div>
      <div className="mt-12 pt-8 border-t dark:border-slate-800 flex justify-between">
        <button onClick={prevStep} className="px-8 py-3 text-sm font-black text-gray-400 uppercase tracking-widest hover:text-gray-600">Back</button>
        <button onClick={nextStep} className="px-10 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-700">
          {nextLabel}
        </button>
      </div>
    </div>
  );

  return (
    <div className="pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-slate-100 uppercase tracking-tight">Procurement Gateway</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">FR-05.1 Transaction Management (3-Tier Framework)</p>
        </div>
        {formStep === 'list' && (
          <button 
            onClick={() => {
              setTransactionMode('PROCUREMENT');
              setNewEntry(prev => ({...prev, sourceType: 'Farmer'}));
              setFormStep('initiation');
            }} 
            className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all"
          >
            <i className="fa-solid fa-plus mr-2"></i> New Transaction
          </button>
        )}
      </div>

      {formStep === 'list' && (
        <div className="space-y-6 mb-10">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center">
                <i className="fa-solid fa-filter mr-2 text-emerald-600"></i> Active Filters
              </h4>
              <button onClick={resetFilters} className="text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Clear All</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase">Mode</label>
                <select value={filters.mode} onChange={e => setFilters({...filters, mode: e.target.value as any})} className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold dark:text-white">
                  <option value="All">All Modes</option>
                  <option value="PROCUREMENT">Procurement</option>
                  <option value="SALES">Sales/Dispatch</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase">Start Date</label>
                <input type="date" value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase">Vegetable</label>
                <select value={filters.vegetable} onChange={e => setFilters({...filters, vegetable: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold dark:text-white">
                  <option value="All">All Produce</option>
                  {centralPrices.map(p => <option key={p.vegetable} value={p.vegetable}>{p.vegetable}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in duration-500">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-800 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b dark:border-slate-700">
                    <th className="px-8 py-5">Mode</th>
                    <th className="px-8 py-5 cursor-pointer" onClick={() => toggleSort('timestamp')}>Date / Supplier</th>
                    <th className="px-8 py-5">Vegetable</th>
                    <th className="px-8 py-5">Qty</th>
                    <th className="px-8 py-5 cursor-pointer" onClick={() => toggleSort('totalAmount')}>Total (₹)</th>
                    <th className="px-8 py-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800">
                  {filteredAndSortedEntries.map(e => (
                    <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase ${e.mode === 'PROCUREMENT' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                          {e.mode}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-black dark:text-slate-200">{e.farmerName}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase">{e.procurementDate} • {e.sourceType}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{e.vegetable}</span>
                        <span className="text-[10px] text-gray-400 ml-2 font-black">({e.grade})</span>
                      </td>
                      <td className="px-8 py-6 text-sm font-black text-gray-700 dark:text-slate-300">{e.quantity} {e.unit}</td>
                      <td className="px-8 py-6 text-sm font-black text-gray-900 dark:text-white">₹ {e.totalAmount.toLocaleString()}</td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase rounded-lg">{e.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {formStep === 'initiation' && (
        <FormContainer title="Transaction Initiation" prevStep={() => setFormStep('list')} nextStep={() => setFormStep('capture')}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2 space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Transaction Mode</label>
              <div className="flex p-1 bg-gray-100 dark:bg-slate-800 rounded-2xl border dark:border-slate-700">
                <button 
                  onClick={() => {
                    setTransactionMode('PROCUREMENT');
                    setNewEntry({...newEntry, sourceType: 'Farmer'});
                  }}
                  className={`flex-1 py-4 text-xs font-black uppercase rounded-xl transition-all ${transactionMode === 'PROCUREMENT' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}
                >
                  <i className="fa-solid fa-truck-ramp-box mr-2"></i> Inbound (Procurement)
                </button>
                <button 
                  onClick={() => {
                    setTransactionMode('SALES');
                    setNewEntry({...newEntry, sourceType: 'Vendor'});
                  }}
                  className={`flex-1 py-4 text-xs font-black uppercase rounded-xl transition-all ${transactionMode === 'SALES' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-gray-400'}`}
                >
                  <i className="fa-solid fa-truck-moving mr-2"></i> Outbound (Sales/Dispatch)
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                {transactionMode === 'PROCUREMENT' ? 'Source' : 'Destination'} Entity
              </label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-gray-50 dark:bg-slate-800 rounded-2xl">
                {transactionMode === 'PROCUREMENT' ? (
                  <>
                    <button 
                      onClick={() => setNewEntry({...newEntry, sourceType: 'Farmer'})} 
                      className={`py-3 text-[10px] font-black uppercase rounded-xl transition-all ${newEntry.sourceType === 'Farmer' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}
                    >Farmer</button>
                    {!isPVCS && (
                      <>
                        <button onClick={() => setNewEntry({...newEntry, sourceType: 'Vendor'})} className={`py-3 text-[10px] font-black uppercase rounded-xl transition-all ${newEntry.sourceType === 'Vendor' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}>Vendor</button>
                        <button onClick={() => setNewEntry({...newEntry, sourceType: 'Aggregator'})} className={`py-3 text-[10px] font-black uppercase rounded-xl transition-all ${newEntry.sourceType === 'Aggregator' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}>Aggregator</button>
                      </>
                    )}
                    {isPVCS && <div className="col-span-2 flex items-center px-4"><span className="text-[9px] font-black text-amber-600 uppercase">Procurement Locked to Farmers</span></div>}
                  </>
                ) : (
                  <>
                    <button onClick={() => setNewEntry({...newEntry, sourceType: 'Vendor'})} className={`py-3 text-[10px] font-black uppercase rounded-xl transition-all ${newEntry.sourceType === 'Vendor' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-gray-400'}`}>Vendor</button>
                    <button onClick={() => setNewEntry({...newEntry, sourceType: 'Union'})} className={`py-3 text-[10px] font-black uppercase rounded-xl transition-all ${newEntry.sourceType === 'Union' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-gray-400'}`}>District Union</button>
                    <div className="bg-gray-200/20 rounded-xl"></div>
                  </>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Transaction Date</label>
              <input type="date" value={newEntry.procurementDate} onChange={e => setNewEntry({...newEntry, procurementDate: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm font-bold dark:text-white" />
            </div>
          </div>
        </FormContainer>
      )}

      {formStep === 'capture' && (
        <FormContainer title="Data Capture" prevStep={() => setFormStep('initiation')} nextStep={() => setFormStep('review')}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2 space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{transactionMode === 'PROCUREMENT' ? 'Supplier' : 'Recipient'} Name</label>
              <input 
                type="text" 
                value={newEntry.farmerName} 
                onChange={e => setNewEntry({...newEntry, farmerName: e.target.value})} 
                placeholder={transactionMode === 'PROCUREMENT' ? "Search Farmer/Aggregator..." : "Search Vendor/Union Hub..."} 
                className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm font-bold dark:text-white" 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vegetable</label>
              <select value={newEntry.vegetable} onChange={e => setNewEntry({...newEntry, vegetable: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm font-bold dark:text-white">
                {centralPrices.map(p => <option key={p.vegetable}>{p.vegetable}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quality Grade</label>
              <div className="flex space-x-2">
                {['A', 'B', 'C'].map(g => (
                  <button key={g} onClick={() => setNewEntry({...newEntry, grade: g as any})} className={`flex-1 py-3 text-xs font-black rounded-xl border-2 transition-all ${newEntry.grade === g ? (transactionMode === 'PROCUREMENT' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-blue-600 border-blue-600 text-white') : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-400'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quantity</label>
              <div className="flex space-x-2">
                <input type="number" placeholder="0.00" value={newEntry.quantity || ''} onChange={e => setNewEntry({...newEntry, quantity: Number(e.target.value)})} className="flex-1 bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm font-bold dark:text-white" />
                <select value={newEntry.unit} onChange={e => setNewEntry({...newEntry, unit: e.target.value as any})} className="w-32 bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-4 text-xs font-black uppercase dark:text-white">
                  <option>Kg</option>
                  <option>Quintal</option>
                </select>
              </div>
            </div>
            <div className={`${transactionMode === 'PROCUREMENT' ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100' : 'bg-blue-50 dark:bg-blue-950/20 border-blue-100'} p-6 rounded-3xl border text-center flex flex-col justify-center`}>
              <p className={`text-[10px] font-black ${transactionMode === 'PROCUREMENT' ? 'text-emerald-600' : 'text-blue-600'} uppercase tracking-widest`}>Rate Per Unit</p>
              <p className={`text-3xl font-black ${transactionMode === 'PROCUREMENT' ? 'text-emerald-700' : 'text-blue-700'} dark:text-white mt-1`}>₹ {calculatePrice().toFixed(2)}</p>
            </div>
          </div>
        </FormContainer>
      )}

      {formStep === 'review' && (
        <FormContainer title="Final Review" nextLabel={transactionMode === 'PROCUREMENT' ? "Approve Receipt" : "Confirm Dispatch"} prevStep={() => setFormStep('capture')} nextStep={handleApproveAndSave}>
          <div className="bg-gray-50 dark:bg-slate-800/50 p-8 rounded-[2.5rem] border dark:border-slate-800 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div><p className="text-[9px] font-black text-gray-400 uppercase">Mode</p><p className="font-bold dark:text-white">{transactionMode}</p></div>
              <div><p className="text-[9px] font-black text-gray-400 uppercase">Entity</p><p className="font-bold dark:text-white">{newEntry.farmerName}</p></div>
              <div><p className="text-[9px] font-black text-gray-400 uppercase">Vegetable</p><p className="font-bold dark:text-white">{newEntry.vegetable}</p></div>
              <div><p className="text-[9px] font-black text-gray-400 uppercase">Grade</p><span className={`px-2 py-0.5 ${transactionMode === 'PROCUREMENT' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'} text-[10px] font-black rounded-lg`}>{newEntry.grade}</span></div>
            </div>
            <div className="p-8 bg-slate-900 rounded-[2rem] text-white flex justify-between items-center shadow-xl">
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Calculated Total Valuation</p>
                <p className="text-4xl font-black mt-2">₹ {(calculatePrice() * (newEntry.quantity || 0)).toLocaleString()}</p>
                <p className="text-[9px] text-emerald-400 mt-2 font-black uppercase tracking-widest">Base Rate: ₹ {calculatePrice().toFixed(2)} / {newEntry.unit}</p>
              </div>
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-3xl">
                <i className={`fa-solid ${transactionMode === 'PROCUREMENT' ? 'fa-file-invoice-dollar' : 'fa-truck-arrow-right'}`}></i>
              </div>
            </div>
          </div>
        </FormContainer>
      )}
    </div>
  );
};

export default ProcurementModule;
