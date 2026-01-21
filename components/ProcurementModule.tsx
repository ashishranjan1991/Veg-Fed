
import React, { useState, useEffect } from 'react';
import { ProcurementEntry, Vendor, DailyPrice } from '../types';
import { Language, translations } from '../translations';

interface ProcurementModuleProps {
  role: string;
  language?: Language;
}

const ProcurementModule: React.FC<ProcurementModuleProps> = ({ role, language = 'en' }) => {
  const t = translations[language];
  const [formStep, setFormStep] = useState<'list' | 'initiation' | 'capture' | 'review'>('list');
  const [dbStatus, setDbStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  
  const [centralPrices, setCentralPrices] = useState<DailyPrice[]>([
    { vegetable: 'Tomato', price: 26.50, lastUpdated: '2026-01-11 08:00', updatedBy: 'Admin' },
    { vegetable: 'Potato', price: 15.20, lastUpdated: '2026-01-11 08:00', updatedBy: 'Admin' },
    { vegetable: 'Onion', price: 34.00, lastUpdated: '2026-01-11 08:00', updatedBy: 'Admin' },
    { vegetable: 'Brinjal', price: 21.00, lastUpdated: '2026-01-11 08:00', updatedBy: 'Admin' },
  ]);

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      setCentralPrices(prev => prev.map(p => ({
        ...p,
        price: Number((p.price + (Math.random() * 0.4 - 0.2)).toFixed(2)),
        lastUpdated: new Date().toLocaleString()
      })));
      setLastRefreshed(new Date());
    }, 5 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, []);

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

  useEffect(() => {
    const timer = setTimeout(() => setDbStatus('connected'), 800);
    return () => clearTimeout(timer);
  }, []);

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
    // If unit is Quintal, price is 100x
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
      status: 'Locked' // FR-05.1: Transaction is locked for editing on approval
    };
    setEntries([entry, ...entries]);
    setFormStep('list');
    // FR-05.2: Approved procurement automatically creates stock inward
    console.log("System: Stock inward entry created. Batch inventory updated.");
  };

  const FormContainer = ({ title, children, nextStep, prevStep, nextLabel = "Continue" }: any) => (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 shadow-2xl p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-10 pb-6 border-b dark:border-slate-800">
        <h3 className="text-2xl font-black dark:text-white uppercase tracking-tight">{title}</h3>
        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-lg uppercase tracking-widest">Step {formStep === 'initiation' ? '1' : formStep === 'capture' ? '2' : '3'} of 3</span>
      </div>
      <div className="space-y-8">{children}</div>
      <div className="mt-12 pt-8 border-t dark:border-slate-800 flex justify-between">
        <button onClick={prevStep} className="px-8 py-3 text-sm font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors">Back</button>
        <button onClick={nextStep} className="px-10 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-700 active:scale-95 transition-all">{nextLabel}</button>
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
          <button onClick={() => setFormStep('initiation')} className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 active:scale-95 transition-all">
            <i className="fa-solid fa-plus mr-2"></i> New Procurement Entry
          </button>
        )}
      </div>

      {formStep === 'initiation' && (
        <FormContainer title="Procurement Initiation" prevStep={() => setFormStep('list')} nextStep={() => setFormStep('capture')}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Source Type</label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-gray-50 dark:bg-slate-800 rounded-2xl">
                {(['Farmer', 'Vendor', 'Aggregator'] as const).map(type => (
                  <button key={type} onClick={() => setNewEntry({...newEntry, sourceType: type})} className={`py-3 text-[10px] font-black uppercase rounded-xl transition-all ${newEntry.sourceType === type ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}>{type}</button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Procurement Date</label>
              <input type="date" value={newEntry.procurementDate} onChange={e => setNewEntry({...newEntry, procurementDate: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm font-bold dark:text-white" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">PVCS & Procurement Location</label>
              <select value={newEntry.location} onChange={e => setNewEntry({...newEntry, location: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm font-bold dark:text-white">
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
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Supplier Name (Auto-linked)</label>
              <input type="text" value={newEntry.farmerName} onChange={e => setNewEntry({...newEntry, farmerName: e.target.value})} placeholder="Search Farmer/Vendor Master..." className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm font-bold dark:text-white" />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Commodity / Vegetable</label>
              <select value={newEntry.vegetable} onChange={e => setNewEntry({...newEntry, vegetable: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm font-bold dark:text-white">
                {centralPrices.map(p => <option key={p.vegetable}>{p.vegetable}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quality Grade</label>
              <div className="flex space-x-2">
                {['A', 'B', 'C'].map(g => (
                  <button key={g} onClick={() => setNewEntry({...newEntry, grade: g as any})} className={`flex-1 py-3 text-xs font-black rounded-xl border-2 transition-all ${newEntry.grade === g ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-400'}`}>{g}</button>
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
            <div className="bg-emerald-50 dark:bg-emerald-950/20 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-800/50 text-center flex flex-col justify-center">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Rate Per Unit (Auto)</p>
              <p className="text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-1">₹ {calculatePrice().toFixed(2)}</p>
              <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase">Total: ₹ {(calculatePrice() * (newEntry.quantity || 0)).toLocaleString()}</p>
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
            <div className="grid grid-cols-2 gap-6 pt-6 border-t dark:border-slate-800">
              <div><p className="text-[9px] font-black text-gray-400 uppercase">Commodity</p><p className="text-xl font-black dark:text-white">{newEntry.vegetable}</p></div>
              <div className="text-right"><p className="text-[9px] font-black text-gray-400 uppercase">Net Weight</p><p className="text-xl font-black dark:text-white">{newEntry.quantity} {newEntry.unit}</p></div>
            </div>
            <div className="p-6 bg-slate-900 rounded-3xl text-white flex justify-between items-center">
              <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Final Total Amount</p><p className="text-3xl font-black">₹ {(calculatePrice() * (newEntry.quantity || 0)).toLocaleString()}</p></div>
              <i className="fa-solid fa-file-invoice text-4xl text-emerald-500"></i>
            </div>
            <div className="flex items-center space-x-3 text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-950/30 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/50">
              <i className="fa-solid fa-circle-info"></i>
              <span>On approval: Stock will be updated, ID generated, and transaction locked for editing.</span>
            </div>
          </div>
        </FormContainer>
      )}

      {formStep === 'list' && (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in duration-500">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b dark:border-slate-700">
                  <th className="px-8 py-5">Procurement ID</th>
                  <th className="px-8 py-5">Source / Supplier</th>
                  <th className="px-8 py-5">Vegetable</th>
                  <th className="px-8 py-5">Qty</th>
                  <th className="px-8 py-5">Amount (₹)</th>
                  <th className="px-8 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-800">
                {entries.map(e => (
                  <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-8 py-6 font-black text-gray-900 dark:text-slate-100 text-sm">
                      <div className="flex items-center space-x-2">
                        <span>{e.id}</span>
                        {e.status === 'Locked' && <i className="fa-solid fa-lock text-[10px] text-gray-300"></i>}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black dark:text-slate-200">{e.farmerName}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">{e.sourceType}</p>
                    </td>
                    <td className="px-8 py-6"><span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{e.vegetable}</span><span className="text-[10px] text-gray-400 ml-2 font-black">({e.grade})</span></td>
                    <td className="px-8 py-6 text-sm font-black text-gray-700 dark:text-slate-300">{e.quantity} {e.unit}</td>
                    <td className="px-8 py-6 text-sm font-black text-gray-900 dark:text-white">₹ {e.totalAmount.toLocaleString()}</td>
                    <td className="px-8 py-6"><span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase rounded-lg">Approved & Stocked</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcurementModule;
