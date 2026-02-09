
import React, { useState, useEffect, useMemo } from 'react';
import { ProcurementEntry, Vendor, DailyPrice } from '../types';
import { Language, translations } from '../translations';

interface ProcurementModuleProps {
  role: string;
  language?: Language;
}

type SortField = 'timestamp' | 'totalAmount' | 'status' | 'id';
type SortOrder = 'asc' | 'desc';

const ProcurementModule: React.FC<ProcurementModuleProps> = ({ role, language = 'en' }) => {
  const t = translations[language];
  const [formStep, setFormStep] = useState<'list' | 'initiation' | 'capture' | 'review'>('list');
  const [dbStatus, setDbStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  
  // Filtering State
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    vegetable: 'All',
    grade: 'All',
    sourceType: 'All'
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

  const [entries, setEntries] = useState<ProcurementEntry[]>([
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
      procurementDate: '2026-01-11'
    },
    { 
      id: 'PROC-102', 
      farmerName: 'Anita Devi', 
      sourceType: 'Farmer',
      location: 'Patna Central PVCS',
      vegetable: 'Onion', 
      quantity: 500, 
      unit: 'Kg',
      grade: 'B', 
      pricePerUnit: 27.20, 
      totalAmount: 13600, 
      timestamp: '2026-01-10 14:15',
      status: 'Locked',
      procurementDate: '2026-01-10'
    },
    { 
      id: 'PROC-103', 
      farmerName: 'Bihar Fresh Ltd', 
      sourceType: 'Vendor',
      location: 'Gaya Regional Hub',
      vegetable: 'Potato', 
      quantity: 1200, 
      unit: 'Kg',
      grade: 'A', 
      pricePerUnit: 15.20, 
      totalAmount: 18240, 
      timestamp: '2026-01-12 09:45',
      status: 'Locked',
      procurementDate: '2026-01-12'
    },
  ]);

  const [newEntry, setNewEntry] = useState<Partial<ProcurementEntry>>({
    farmerName: '',
    vendorId: '',
    sourceType: 'Farmer',
    location: 'Patna Central PVCS',
    vegetable: 'Tomato',
    quantity: 0,
    unit: 'Kg',
    grade: 'A',
    procurementDate: new Date().toISOString().split('T')[0]
  });

  // Filter and Sort Logic
  const filteredAndSortedEntries = useMemo(() => {
    let result = [...entries];

    // Filter by Date
    if (filters.startDate) {
      result = result.filter(e => e.procurementDate >= filters.startDate);
    }
    if (filters.endDate) {
      result = result.filter(e => e.procurementDate <= filters.endDate);
    }

    // Filter by Vegetable
    if (filters.vegetable !== 'All') {
      result = result.filter(e => e.vegetable === filters.vegetable);
    }

    // Filter by Grade
    if (filters.grade !== 'All') {
      result = result.filter(e => e.grade === filters.grade);
    }

    // Filter by Source
    if (filters.sourceType !== 'All') {
      result = result.filter(e => e.sourceType === filters.sourceType);
    }

    // Sort
    result.sort((a, b) => {
      let valA: any = a[sortConfig.field];
      let valB: any = b[sortConfig.field];

      if (sortConfig.field === 'totalAmount') {
        return sortConfig.order === 'asc' ? valA - valB : valB - valA;
      }

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

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
      sourceType: 'All'
    });
  };

  const getBasePrice = (veg: string) => centralPrices.find(p => p.vegetable === veg)?.price || 0;
  const getPriceMultiplier = (grade: string) => {
    switch(grade) {
      case 'A': return 1.0;
      case 'B': return 0.8;
      case 'C': return 0.6;
      default: return 0;
    }
  };

  const calculatePrice = () => {
    const base = getBasePrice(newEntry.vegetable || 'Tomato');
    const multiplier = getPriceMultiplier(newEntry.grade || 'A');
    const price = base * multiplier;
    return newEntry.unit === 'Quintal' ? price * 100 : price;
  };

  const handleApproveAndSave = () => {
    const price = calculatePrice();
    const total = price * (newEntry.quantity || 0);
    const entry: ProcurementEntry = {
      ...newEntry as ProcurementEntry,
      id: `PROC-${Date.now().toString().slice(-6)}`,
      pricePerUnit: price,
      totalAmount: total,
      timestamp: new Date().toLocaleString(),
      status: 'Locked'
    };
    setEntries([entry, ...entries]);
    setFormStep('list');
  };

  const FormContainer = ({ title, children, nextStep, prevStep, nextLabel = "Continue" }: any) => (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 shadow-2xl p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-10 pb-6 border-b dark:border-slate-800">
        <h3 className="text-2xl font-black dark:text-white uppercase tracking-tight">{title}</h3>
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
          <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">FR-05.1 Integrated Transaction Process</p>
        </div>
        {formStep === 'list' && (
          <button 
            onClick={() => setFormStep('initiation')} 
            className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all"
          >
            <i className="fa-solid fa-plus mr-2"></i> New Procurement Entry
          </button>
        )}
      </div>

      {formStep === 'list' && (
        <div className="space-y-6 mb-10">
          {/* Advanced Filter Bar */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center">
                <i className="fa-solid fa-filter mr-2 text-emerald-600"></i> Active Filter Dashboard
              </h4>
              <button 
                onClick={resetFilters}
                className="text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:underline"
              >
                Clear All Filters
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Start Date</label>
                <input 
                  type="date" 
                  value={filters.startDate}
                  onChange={e => setFilters({...filters, startDate: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-1">End Date</label>
                <input 
                  type="date" 
                  value={filters.endDate}
                  onChange={e => setFilters({...filters, endDate: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Vegetable</label>
                <select 
                  value={filters.vegetable}
                  onChange={e => setFilters({...filters, vegetable: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold dark:text-white"
                >
                  <option value="All">All Produce</option>
                  {centralPrices.map(p => <option key={p.vegetable} value={p.vegetable}>{p.vegetable}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Source Type</label>
                <select 
                  value={filters.sourceType}
                  onChange={e => setFilters({...filters, sourceType: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold dark:text-white"
                >
                  <option value="All">All Sources</option>
                  <option value="Farmer">Farmer</option>
                  <option value="Vendor">Vendor</option>
                  <option value="Aggregator">Aggregator</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Quality Grade</label>
                <select 
                  value={filters.grade}
                  onChange={e => setFilters({...filters, grade: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold dark:text-white"
                >
                  <option value="All">All Grades</option>
                  <option value="A">Grade A</option>
                  <option value="B">Grade B</option>
                  <option value="C">Grade C</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in duration-500">
            <div className="overflow-x-auto">
              <table className="w-full text-left" aria-label="Procurement History">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-800 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b dark:border-slate-700">
                    <th className="px-8 py-5 cursor-pointer hover:text-emerald-600 transition-colors" onClick={() => toggleSort('id')}>
                      ID {sortConfig.field === 'id' && (sortConfig.order === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-8 py-5 cursor-pointer hover:text-emerald-600 transition-colors" onClick={() => toggleSort('timestamp')}>
                      Date / Supplier {sortConfig.field === 'timestamp' && (sortConfig.order === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-8 py-5">Vegetable</th>
                    <th className="px-8 py-5">Qty</th>
                    <th className="px-8 py-5 cursor-pointer hover:text-emerald-600 transition-colors" onClick={() => toggleSort('totalAmount')}>
                      Amount (₹) {sortConfig.field === 'totalAmount' && (sortConfig.order === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-8 py-5 cursor-pointer hover:text-emerald-600 transition-colors" onClick={() => toggleSort('status')}>
                      Status {sortConfig.field === 'status' && (sortConfig.order === 'asc' ? '↑' : '↓')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800">
                  {filteredAndSortedEntries.length > 0 ? (
                    filteredAndSortedEntries.map(e => (
                      <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                        <td className="px-8 py-6 font-black text-gray-900 dark:text-slate-100 text-sm">
                          {e.id}
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
                          <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase rounded-lg">
                            {e.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <i className="fa-solid fa-magnifying-glass text-4xl mb-4 opacity-20"></i>
                          <p className="font-black text-[10px] uppercase tracking-widest">No matching records found</p>
                          <button onClick={resetFilters} className="mt-4 text-emerald-600 font-bold text-xs uppercase hover:underline">Reset Filters</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {formStep === 'initiation' && (
        <FormContainer title="Procurement Initiation" prevStep={() => setFormStep('list')} nextStep={() => setFormStep('capture')}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Source Type</label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-gray-50 dark:bg-slate-800 rounded-2xl">
                {(['Farmer', 'Vendor', 'Aggregator'] as const).map(type => (
                  <button 
                    key={type} 
                    onClick={() => setNewEntry({...newEntry, sourceType: type})} 
                    className={`py-3 text-[10px] font-black uppercase rounded-xl transition-all ${newEntry.sourceType === type ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Procurement Date</label>
              <input 
                type="date" 
                value={newEntry.procurementDate} 
                onChange={e => setNewEntry({...newEntry, procurementDate: e.target.value})} 
                className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm font-bold dark:text-white" 
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Location</label>
              <select 
                value={newEntry.location} 
                onChange={e => setNewEntry({...newEntry, location: e.target.value})} 
                className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm font-bold dark:text-white"
              >
                <option>Patna Central PVCS</option>
                <option>Danapur Local Node</option>
                <option>Gaya Regional Hub</option>
              </select>
            </div>
          </div>
        </FormContainer>
      )}

      {formStep === 'capture' && (
        <FormContainer title="Data Capture" prevStep={() => setFormStep('initiation')} nextStep={() => setFormStep('review')}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2 space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Supplier Name</label>
              <input 
                type="text" 
                value={newEntry.farmerName} 
                onChange={e => setNewEntry({...newEntry, farmerName: e.target.value})} 
                placeholder="Search Farmer/Vendor Master..." 
                className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm font-bold dark:text-white" 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vegetable</label>
              <select 
                value={newEntry.vegetable} 
                onChange={e => setNewEntry({...newEntry, vegetable: e.target.value})} 
                className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm font-bold dark:text-white"
              >
                {centralPrices.map(p => <option key={p.vegetable}>{p.vegetable}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quality Grade</label>
              <div className="flex space-x-2">
                {['A', 'B', 'C'].map(g => (
                  <button 
                    key={g} 
                    onClick={() => setNewEntry({...newEntry, grade: g as any})} 
                    className={`flex-1 py-3 text-xs font-black rounded-xl border-2 transition-all ${newEntry.grade === g ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-400'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quantity</label>
              <div className="flex space-x-2">
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={newEntry.quantity || ''} 
                  onChange={e => setNewEntry({...newEntry, quantity: Number(e.target.value)})} 
                  className="flex-1 bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm font-bold dark:text-white" 
                />
                <select 
                  value={newEntry.unit} 
                  onChange={e => setNewEntry({...newEntry, unit: e.target.value as any})} 
                  className="w-32 bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-4 text-xs font-black uppercase dark:text-white"
                >
                  <option>Kg</option>
                  <option>Quintal</option>
                </select>
              </div>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/20 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-800/50 text-center flex flex-col justify-center">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Rate Per Unit</p>
              <p className="text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-1">₹ {calculatePrice().toFixed(2)}</p>
            </div>
          </div>
        </FormContainer>
      )}

      {formStep === 'review' && (
        <FormContainer title="Review & Approval" nextLabel="Confirm & Approve" prevStep={() => setFormStep('capture')} nextStep={handleApproveAndSave}>
          <div className="bg-gray-50 dark:bg-slate-800/50 p-8 rounded-[2.5rem] border dark:border-slate-800 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div><p className="text-[9px] font-black text-gray-400 uppercase">Date</p><p className="font-bold dark:text-white">{newEntry.procurementDate}</p></div>
              <div><p className="text-[9px] font-black text-gray-400 uppercase">Source</p><p className="font-bold dark:text-white">{newEntry.sourceType}</p></div>
              <div><p className="text-[9px] font-black text-gray-400 uppercase">Supplier</p><p className="font-bold dark:text-white">{newEntry.farmerName}</p></div>
              <div><p className="text-[9px] font-black text-gray-400 uppercase">Grade</p><span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg">Grade {newEntry.grade}</span></div>
            </div>
            <div className="p-6 bg-slate-900 rounded-3xl text-white flex justify-between items-center">
              <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Final Total Amount</p><p className="text-3xl font-black">₹ {(calculatePrice() * (newEntry.quantity || 0)).toLocaleString()}</p></div>
              <i className="fa-solid fa-file-invoice text-4xl text-emerald-500"></i>
            </div>
          </div>
        </FormContainer>
      )}
    </div>
  );
};

export default ProcurementModule;
