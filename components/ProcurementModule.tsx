
import React, { useState, useMemo } from 'react';
import { ProcurementEntry, DailyPrice, UserRole } from '../types';
import { Language, translations } from '../translations';

interface ProcurementModuleProps {
  role: UserRole;
  language?: Language;
}

type SortField = 'timestamp' | 'totalAmount' | 'status' | 'id';
type SortOrder = 'asc' | 'desc';
type TransactionMode = 'PROCUREMENT' | 'SALES';
type ActiveTab = 'purchase' | 'sell';

const ProcurementModule: React.FC<ProcurementModuleProps> = ({ role, language = 'en' }) => {
  const t = translations[language];
  const [activeModuleTab, setActiveModuleTab] = useState<ActiveTab>('purchase');
  const [formStep, setFormStep] = useState<'list' | 'initiation' | 'capture' | 'review'>('list');
  const [transactionMode, setTransactionMode] = useState<TransactionMode>('PROCUREMENT');
  
  const isPVCS = role === UserRole.PVCS_USER;

  // Master Lists for Dropdowns
  const farmersList = [
    "Ramesh Mahto (FAR001)",
    "Sunil Mahto (FAR102)",
    "Anita Devi (FAR205)",
    "Ram Jha (FAR309)",
    "Sita Kumari (FAR412)",
    "Manoj Yadav (FAR550)"
  ];

  const vendorsList = [
    "Bihar Fresh Ltd",
    "Metro Mart Patna",
    "Pataliputra Retail",
    "Saran Exports",
    "Gaya Wholesale Mandi",
    "Reliance Fresh (Bihar Hub)"
  ];

  const unionsList = [
    "Harit (Patna) Union Hub",
    "Tirhut (Motihari) Union Hub",
    "Mithila (Darbhanga) Union Hub",
    "Magadh (Gaya) Union Hub",
    "Bhagalpur Union Hub",
    "Munger Union Hub",
    "Shahabad (Ara) Union Hub",
    "Saran (Chapra) Union Hub"
  ];

  // Filtering State
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    vegetable: 'All',
    grade: 'All',
    sourceType: 'All',
  });

  // Sorting State
  const [sortConfig, setSortConfig] = useState<{ field: SortField; order: SortOrder }>({
    field: 'timestamp',
    order: 'desc'
  });

  const [centralPrices] = useState<DailyPrice[]>([
    { vegetable: 'Tomato', price: 26.50, lastUpdated: '2026-01-11 08:00', updatedBy: 'Admin' },
    { vegetable: 'Potato', price: 15.20, lastUpdated: '2026-01-11 08:00', updatedBy: 'Admin' },
    { vegetable: 'Onion', price: 34.00, lastUpdated: '2026-01-11 08:00', updatedBy: 'Admin' },
    { vegetable: 'Brinjal', price: 21.00, lastUpdated: '2026-01-11 08:00', updatedBy: 'Admin' },
  ]);

  const [entries, setEntries] = useState<(ProcurementEntry & { mode: TransactionMode })[]>([
    { 
      id: 'PROC-101', 
      farmerName: 'Sunil Mahto (FAR102)', 
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
      mode: 'SALES',
      vehicleNo: 'BR-01-GH-4421',
      driverName: 'Mohan Das'
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
    procurementDate: new Date().toISOString().split('T')[0],
    vehicleNo: '',
    driverName: '',
    driverContact: ''
  });

  const filteredAndSortedEntries = useMemo(() => {
    const targetMode: TransactionMode = activeModuleTab === 'purchase' ? 'PROCUREMENT' : 'SALES';
    let result = entries.filter(e => e.mode === targetMode);

    if (filters.startDate) result = result.filter(e => e.procurementDate >= filters.startDate);
    if (filters.endDate) result = result.filter(e => e.procurementDate <= filters.endDate);
    if (filters.vegetable !== 'All') result = result.filter(e => e.vegetable === filters.vegetable);
    if (filters.grade !== 'All') result = result.filter(e => e.grade === filters.grade);
    if (filters.sourceType !== 'All') result = result.filter(e => e.sourceType === filters.sourceType);

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
  }, [entries, filters, sortConfig, activeModuleTab]);

  const toggleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      order: prev.field === field && prev.order === 'desc' ? 'asc' : 'desc'
    }));
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
          <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${transactionMode === 'PROCUREMENT' ? 'text-emerald-600' : 'text-blue-600'}`}>
            Transaction Mode: {transactionMode === 'PROCUREMENT' ? 'Purchase (Inbound)' : 'Sales (Outbound)'}
          </p>
        </div>
        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-lg uppercase tracking-widest">
          Step {formStep === 'initiation' ? '1' : formStep === 'capture' ? '2' : '3'} of 3
        </span>
      </div>
      <div className="space-y-8">{children}</div>
      <div className="mt-12 pt-8 border-t dark:border-slate-800 flex justify-between">
        <button onClick={prevStep} className="px-8 py-3 text-sm font-black text-gray-400 uppercase tracking-widest hover:text-gray-600">Back</button>
        <button 
          onClick={nextStep} 
          disabled={!newEntry.farmerName}
          className={`px-10 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed ${transactionMode === 'PROCUREMENT' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
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
              const mode: TransactionMode = activeModuleTab === 'purchase' ? 'PROCUREMENT' : 'SALES';
              setTransactionMode(mode);
              setNewEntry({
                farmerName: '',
                vendorId: '',
                sourceType: activeModuleTab === 'purchase' ? 'Farmer' : 'Vendor',
                location: isPVCS ? 'Patna Block PVCS' : 'Patna Central PVCS',
                vegetable: 'Tomato',
                quantity: 0,
                unit: 'Kg',
                grade: 'A',
                procurementDate: new Date().toISOString().split('T')[0],
                vehicleNo: '',
                driverName: '',
                driverContact: ''
              });
              setFormStep('initiation');
            }} 
            className={`${activeModuleTab === 'purchase' ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-blue-600 shadow-blue-500/20'} text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:opacity-90 transition-all`}
          >
            <i className="fa-solid fa-plus mr-2"></i> 
            New {activeModuleTab === 'purchase' ? 'Purchase' : 'Sales'} Entry
          </button>
        )}
      </div>

      {formStep === 'list' && (
        <div className="space-y-6">
          <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-[1.5rem] border border-gray-100 dark:border-slate-800 shadow-sm max-w-md mx-auto mb-8">
            <button 
              onClick={() => setActiveModuleTab('purchase')}
              className={`flex-1 flex items-center justify-center space-x-3 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeModuleTab === 'purchase' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
            >
              <i className="fa-solid fa-truck-ramp-box"></i>
              <span>Purchase (Farmer)</span>
            </button>
            <button 
              onClick={() => setActiveModuleTab('sell')}
              className={`flex-1 flex items-center justify-center space-x-3 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeModuleTab === 'sell' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
            >
              <i className="fa-solid fa-truck-moving"></i>
              <span>Sales (Vendor)</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center">
                <i className="fa-solid fa-filter mr-2 text-emerald-600"></i> Active Filters
              </h4>
              <button onClick={() => setFilters({startDate:'', endDate:'', vegetable:'All', grade:'All', sourceType:'All'})} className="text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Clear All</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase">Start Date</label>
                <input type="date" value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase">End Date</label>
                <input type="date" value={filters.endDate} onChange={e => setFilters({...filters, endDate: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase">Vegetable</label>
                <select value={filters.vegetable} onChange={e => setFilters({...filters, vegetable: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold dark:text-white">
                  <option value="All">All Produce</option>
                  {centralPrices.map(p => <option key={p.vegetable} value={p.vegetable}>{p.vegetable}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase">Grade</label>
                <select value={filters.grade} onChange={e => setFilters({...filters, grade: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold dark:text-white">
                  <option value="All">All Grades</option>
                  <option value="A">Grade A</option>
                  <option value="B">Grade B</option>
                  <option value="C">Grade C</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase">Source Type</label>
                <select value={filters.sourceType} onChange={e => setFilters({...filters, sourceType: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold dark:text-white">
                  <option value="All">All Sources</option>
                  <option value="Farmer">Farmer</option>
                  <option value="Vendor">Vendor</option>
                  <option value="Aggregator">Aggregator</option>
                  <option value="Union">Union Hub</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in duration-500">
            <div className="p-8 border-b dark:border-slate-800 flex items-center space-x-4">
               <div className={`w-3 h-3 rounded-full ${activeModuleTab === 'purchase' ? 'bg-emerald-500' : 'bg-blue-500'} animate-pulse`}></div>
               <h3 className="font-black uppercase tracking-tight text-gray-900 dark:text-white">
                  {activeModuleTab === 'purchase' ? 'Purchase Ledger (Farmers)' : 'Sales & Dispatch Registry'}
               </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-800 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b dark:border-slate-700">
                    <th className="px-8 py-5 cursor-pointer" onClick={() => toggleSort('id')}>Transaction ID</th>
                    <th className="px-8 py-5 cursor-pointer" onClick={() => toggleSort('timestamp')}>Date / {activeModuleTab === 'purchase' ? 'Farmer' : 'Buyer'}</th>
                    <th className="px-8 py-5">Item Details</th>
                    <th className="px-8 py-5">Quantity</th>
                    <th className="px-8 py-5 cursor-pointer" onClick={() => toggleSort('totalAmount')}>Total (₹)</th>
                    <th className="px-8 py-5 text-right">Logistics</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800">
                  {filteredAndSortedEntries.map(e => (
                    <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-8 py-6 font-mono text-[10px] text-gray-400">{e.id}</td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-black dark:text-slate-200">{e.farmerName}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase">{e.procurementDate} • {e.sourceType}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-sm font-bold ${activeModuleTab === 'purchase' ? 'text-emerald-600' : 'text-blue-600'}`}>{e.vegetable}</span>
                        <span className="text-[10px] text-gray-400 ml-2 font-black">({e.grade})</span>
                      </td>
                      <td className="px-8 py-6 text-sm font-black text-gray-700 dark:text-slate-300">{e.quantity} {e.unit}</td>
                      <td className="px-8 py-6 text-sm font-black text-gray-900 dark:text-white">₹ {e.totalAmount.toLocaleString()}</td>
                      <td className="px-8 py-6 text-right">
                        {e.vehicleNo ? (
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-tight">{e.vehicleNo}</span>
                            <span className="text-[8px] font-bold text-gray-400 uppercase">{e.driverName}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-300 font-bold uppercase">N/A</span>
                        )}
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
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Entity Type</label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-gray-50 dark:bg-slate-800 rounded-2xl">
                {transactionMode === 'PROCUREMENT' ? (
                  <>
                    <button 
                      type="button"
                      onClick={() => setNewEntry({...newEntry, sourceType: 'Farmer', farmerName: ''})} 
                      className={`py-3 text-[10px] font-black uppercase rounded-xl transition-all ${newEntry.sourceType === 'Farmer' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}
                    >Farmer</button>
                    {!isPVCS && (
                      <>
                        <button type="button" onClick={() => setNewEntry({...newEntry, sourceType: 'Vendor', farmerName: ''})} className={`py-3 text-[10px] font-black uppercase rounded-xl transition-all ${newEntry.sourceType === 'Vendor' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}>Vendor</button>
                        <button type="button" onClick={() => setNewEntry({...newEntry, sourceType: 'Aggregator', farmerName: ''})} className={`py-3 text-[10px] font-black uppercase rounded-xl transition-all ${newEntry.sourceType === 'Aggregator' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}>Aggregator</button>
                      </>
                    )}
                    {isPVCS && <div className="col-span-2 flex items-center px-4"><span className="text-[9px] font-black text-amber-600 uppercase">Purchase Locked to Farmers</span></div>}
                  </>
                ) : (
                  <>
                    <button type="button" onClick={() => setNewEntry({...newEntry, sourceType: 'Vendor', farmerName: ''})} className={`py-3 text-[10px] font-black uppercase rounded-xl transition-all ${newEntry.sourceType === 'Vendor' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-gray-400'}`}>Vendor</button>
                    <button type="button" onClick={() => setNewEntry({...newEntry, sourceType: 'Union', farmerName: ''})} className={`py-3 text-[10px] font-black uppercase rounded-xl transition-all ${newEntry.sourceType === 'Union' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-gray-400'}`}>District Union Hub</button>
                    <div className="bg-gray-200/20 rounded-xl"></div>
                  </>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Effective Date</label>
              <input type="date" value={newEntry.procurementDate} onChange={e => setNewEntry({...newEntry, procurementDate: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm font-bold dark:text-white" />
            </div>
          </div>
        </FormContainer>
      )}

      {formStep === 'capture' && (
        <FormContainer title="Data Capture" prevStep={() => setFormStep('initiation')} nextStep={() => setFormStep('review')}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2 space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                {transactionMode === 'PROCUREMENT' ? 'Select Supplier' : 'Select Recipient'} ({newEntry.sourceType})
              </label>
              <select 
                value={newEntry.farmerName} 
                onChange={e => setNewEntry({...newEntry, farmerName: e.target.value})} 
                className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
              >
                <option value="">-- Choose {newEntry.sourceType} --</option>
                {newEntry.sourceType === 'Farmer' && farmersList.map(f => <option key={f} value={f}>{f}</option>)}
                {(newEntry.sourceType === 'Vendor' || newEntry.sourceType === 'Aggregator') && vendorsList.map(v => <option key={v} value={v}>{v}</option>)}
                {newEntry.sourceType === 'Union' && unionsList.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Commodity</label>
              <select value={newEntry.vegetable} onChange={e => setNewEntry({...newEntry, vegetable: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm font-bold dark:text-white">
                {centralPrices.map(p => <option key={p.vegetable}>{p.vegetable}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Grade Level</label>
              <div className="flex space-x-2">
                {['A', 'B', 'C'].map(g => (
                  <button key={g} type="button" onClick={() => setNewEntry({...newEntry, grade: g as any})} className={`flex-1 py-3 text-xs font-black rounded-xl border-2 transition-all ${newEntry.grade === g ? (transactionMode === 'PROCUREMENT' ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'bg-blue-600 border-blue-600 text-white shadow-md') : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-400'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Volume / Quantity</label>
              <div className="flex space-x-2">
                <input type="number" placeholder="0.00" value={newEntry.quantity || ''} onChange={e => setNewEntry({...newEntry, quantity: Number(e.target.value)})} className="flex-1 bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm font-bold dark:text-white" />
                <select value={newEntry.unit} onChange={e => setNewEntry({...newEntry, unit: e.target.value as any})} className="w-32 bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-4 text-xs font-black uppercase dark:text-white">
                  <option>Kg</option>
                  <option>Quintal</option>
                </select>
              </div>
            </div>
            <div className={`${transactionMode === 'PROCUREMENT' ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100' : 'bg-blue-50 dark:bg-blue-950/20 border-blue-100'} p-6 rounded-3xl border text-center flex flex-col justify-center transition-colors`}>
              <p className={`text-[10px] font-black ${transactionMode === 'PROCUREMENT' ? 'text-emerald-600' : 'text-blue-600'} uppercase tracking-widest`}>Current Market Rate</p>
              <p className={`text-3xl font-black ${transactionMode === 'PROCUREMENT' ? 'text-emerald-700' : 'text-blue-700'} dark:text-white mt-1`}>₹ {calculatePrice().toFixed(2)}</p>
            </div>

            {transactionMode === 'SALES' && (
              <div className="md:col-span-2 mt-6 p-8 bg-gray-50 dark:bg-slate-800/50 rounded-[2.5rem] border dark:border-slate-700 space-y-6">
                 <div className="flex items-center space-x-3 mb-4">
                    <i className="fa-solid fa-truck text-blue-600"></i>
                    <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Logistics & Transport Details</h4>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Vehicle Number</label>
                      <input 
                        type="text" 
                        value={newEntry.vehicleNo}
                        onChange={e => setNewEntry({...newEntry, vehicleNo: e.target.value})}
                        placeholder="e.g. BR-01-GH-4421"
                        className="w-full bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Driver Name</label>
                      <input 
                        type="text" 
                        value={newEntry.driverName}
                        onChange={e => setNewEntry({...newEntry, driverName: e.target.value})}
                        placeholder="Full Name"
                        className="w-full bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Driver Contact</label>
                      <input 
                        type="text" 
                        value={newEntry.driverContact}
                        onChange={e => setNewEntry({...newEntry, driverContact: e.target.value})}
                        placeholder="Mobile No."
                        className="w-full bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                 </div>
              </div>
            )}
          </div>
        </FormContainer>
      )}

      {formStep === 'review' && (
        <FormContainer title="Final Validation" nextLabel={transactionMode === 'PROCUREMENT' ? "Approve Purchase" : "Confirm Dispatch"} prevStep={() => setFormStep('capture')} nextStep={handleApproveAndSave}>
          <div className="bg-gray-50 dark:bg-slate-800/50 p-8 rounded-[2.5rem] border dark:border-slate-800 space-y-6 shadow-inner">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div><p className="text-[9px] font-black text-gray-400 uppercase">Transaction</p><p className={`font-black ${transactionMode === 'PROCUREMENT' ? 'text-emerald-600' : 'text-blue-600'}`}>{transactionMode}</p></div>
              <div><p className="text-[9px] font-black text-gray-400 uppercase">Entity</p><p className="font-bold dark:text-white">{newEntry.farmerName}</p></div>
              <div><p className="text-[9px] font-black text-gray-400 uppercase">Commodity</p><p className="font-bold dark:text-white">{newEntry.vegetable}</p></div>
              <div><p className="text-[9px] font-black text-gray-400 uppercase">Grade</p><span className={`px-2 py-0.5 ${transactionMode === 'PROCUREMENT' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'} text-[10px] font-black rounded-lg`}>{newEntry.grade}</span></div>
            </div>

            {transactionMode === 'SALES' && newEntry.vehicleNo && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                    <i className="fa-solid fa-truck-fast text-blue-600"></i>
                    <span className="text-[10px] font-black uppercase text-blue-800 dark:text-blue-400">Transport: {newEntry.vehicleNo}</span>
                 </div>
                 <span className="text-[10px] font-bold text-blue-700 dark:text-blue-500">Driver: {newEntry.driverName}</span>
              </div>
            )}

            <div className={`${transactionMode === 'PROCUREMENT' ? 'bg-emerald-900' : 'bg-blue-900'} p-8 rounded-[2rem] text-white flex justify-between items-center shadow-2xl transition-colors`}>
              <div>
                <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Total Valuation (Calculated)</p>
                <p className="text-4xl font-black mt-2">₹ {(calculatePrice() * (newEntry.quantity || 0)).toLocaleString()}</p>
                <p className={`text-[9px] mt-2 font-black uppercase tracking-widest ${transactionMode === 'PROCUREMENT' ? 'text-emerald-400' : 'text-blue-300'}`}>
                  Unit Price: ₹ {calculatePrice().toFixed(2)} / {newEntry.unit}
                </p>
              </div>
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl">
                <i className={`fa-solid ${transactionMode === 'PROCUREMENT' ? 'fa-file-invoice-dollar' : 'fa-truck-moving'}`}></i>
              </div>
            </div>
          </div>
        </FormContainer>
      )}
    </div>
  );
};

export default ProcurementModule;
