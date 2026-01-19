
import React, { useState, useEffect } from 'react';
import { ProcurementEntry, Vendor, DailyPrice } from '../types';
import { Language, translations } from '../translations';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ProcurementModuleProps {
  role: string;
  language?: Language;
}

const ProcurementModule: React.FC<ProcurementModuleProps> = ({ role, language = 'en' }) => {
  const t = translations[language];
  const [isRecording, setIsRecording] = useState(false);
  const [dbStatus, setDbStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  
  // Simulated Centralised Prices (Fetched from "MySQL Backend")
  const [centralPrices, setCentralPrices] = useState<DailyPrice[]>([
    { vegetable: 'Tomato', price: 26.50, lastUpdated: '2026-01-11 08:00', updatedBy: 'Admin' },
    { vegetable: 'Potato', price: 15.20, lastUpdated: '2026-01-11 08:00', updatedBy: 'Admin' },
    { vegetable: 'Onion', price: 34.00, lastUpdated: '2026-01-11 08:00', updatedBy: 'Admin' },
    { vegetable: 'Brinjal', price: 21.00, lastUpdated: '2026-01-11 08:00', updatedBy: 'Admin' },
  ]);

  // Simulated Vendors (Fetched from "MySQL Backend")
  const [vendors] = useState<Vendor[]>([
    { id: 'VEN-001', name: 'Bihar Fresh Mart', contactPerson: 'Arun Jha', mobile: '9988776655', type: 'Wholesaler', location: 'Patna' },
    { id: 'VEN-002', name: 'Metro Institutional', contactPerson: 'Sita Ram', mobile: '8877665544', type: 'Institutional', location: 'Gaya' },
  ]);

  const [entries, setEntries] = useState<ProcurementEntry[]>([
    { id: 'PROC-101', farmerName: 'Sunil Mahto', vendorId: 'VEN-001', vegetable: 'Tomato', quantity: 250, grade: 'A', pricePerKg: 26.50, totalAmount: 6625, timestamp: '2026-01-11 10:30' },
  ]);

  const [newEntry, setNewEntry] = useState<{
    farmerName: string;
    vendorId: string;
    vegetable: string;
    quantity: number;
    grade: 'A' | 'B' | 'C' | 'D';
  }>({
    farmerName: '',
    vendorId: '',
    vegetable: 'Tomato',
    quantity: 0,
    grade: 'A'
  });

  useEffect(() => {
    // Simulate MySQL Connectivity Check
    const timer = setTimeout(() => setDbStatus('connected'), 800);
    return () => clearTimeout(timer);
  }, []);

  const getBasePrice = (veg: string) => {
    const found = centralPrices.find(p => p.vegetable === veg);
    return found ? found.price : 0;
  };

  const getPriceMultiplier = (grade: string) => {
    switch(grade) {
      case 'A': return 1.0;
      case 'B': return 0.8;
      case 'C': return 0.6;
      case 'D': return 0;
      default: return 0.5;
    }
  };

  const calculatePrice = () => {
    const base = getBasePrice(newEntry.vegetable);
    return base * getPriceMultiplier(newEntry.grade);
  };

  const handleSave = () => {
    const price = calculatePrice();
    const total = price * newEntry.quantity;
    const entry: ProcurementEntry = {
      id: `PROC-${Date.now().toString().slice(-3)}`,
      farmerName: newEntry.farmerName,
      vendorId: newEntry.vendorId,
      vegetable: newEntry.vegetable,
      quantity: newEntry.quantity,
      grade: newEntry.grade,
      pricePerKg: price,
      totalAmount: total,
      timestamp: new Date().toLocaleString()
    };
    setEntries([entry, ...entries]);
    setIsRecording(false);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">{t.procurementOps}</h2>
          <div className="flex items-center mt-1 space-x-3">
             <p className="text-gray-500 dark:text-slate-400 text-sm">Record vegetable receipt and quality-based pricing</p>
             <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${dbStatus === 'connected' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                <i className={`fa-solid fa-database mr-1 ${dbStatus === 'connected' ? 'animate-none' : 'animate-pulse'}`}></i>
                {dbStatus === 'connected' ? 'MySQL Connected' : 'Syncing...'}
             </span>
          </div>
        </div>
        {!isRecording && (
          <button 
            onClick={() => setIsRecording(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:bg-emerald-700 flex items-center space-x-2 transition-all"
          >
            <i className="fa-solid fa-plus"></i>
            <span>{t.recordReceipt}</span>
          </button>
        )}
      </div>

      {isRecording ? (
        <div className="flex flex-col xl:flex-row gap-8 items-start">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 shadow-xl p-8 flex-1 w-full transition-colors duration-300">
            <h3 className="text-xl font-bold mb-6 dark:text-slate-100">New Procurement Entry</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Farmer Name / ID</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white font-bold" 
                  placeholder="e.g. Sunil Mahto"
                  value={newEntry.farmerName}
                  onChange={e => setNewEntry({...newEntry, farmerName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{t.vendor}</label>
                <select 
                  className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white"
                  value={newEntry.vendorId}
                  onChange={e => setNewEntry({...newEntry, vendorId: e.target.value})}
                >
                  <option value="">Direct Procurement</option>
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.type})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Vegetable Type</label>
                <select 
                  className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white"
                  value={newEntry.vegetable}
                  onChange={e => setNewEntry({...newEntry, vegetable: e.target.value})}
                >
                  <option>Tomato</option>
                  <option>Potato</option>
                  <option>Onion</option>
                  <option>Brinjal</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Quantity (Kg)</label>
                <input 
                  type="number" 
                  className="w-full bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white" 
                  value={newEntry.quantity || ''}
                  placeholder="0"
                  onChange={e => setNewEntry({...newEntry, quantity: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Quality Grade</label>
                <div className="flex space-x-2">
                  {(['A', 'B', 'C', 'D'] as const).map(g => (
                    <button
                      key={g}
                      onClick={() => setNewEntry({...newEntry, grade: g})}
                      className={`flex-1 py-3 rounded-xl border-2 font-black transition-all ${newEntry.grade === g 
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' 
                        : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-400 dark:text-slate-500'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl flex flex-col justify-center text-center border border-emerald-100 dark:border-emerald-800/50">
                <p className="text-[10px] uppercase font-black text-emerald-600 dark:text-emerald-400 tracking-widest">Central Daily Rate (Base)</p>
                <p className="text-3xl font-black text-emerald-700 dark:text-emerald-300 leading-none mt-1">₹ {getBasePrice(newEntry.vegetable)}</p>
                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Adjusted for Grade {newEntry.grade}: ₹ {calculatePrice().toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Payout Amount</p>
                <p className="text-3xl font-black text-gray-900 dark:text-slate-100 leading-none mt-1">₹ {(calculatePrice() * newEntry.quantity).toLocaleString()}</p>
              </div>
              <div className="flex space-x-3 w-full sm:w-auto">
                <button onClick={() => setIsRecording(false)} className="flex-1 sm:flex-none px-8 py-3 text-sm font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors">{t.back}</button>
                <button onClick={handleSave} className="flex-1 sm:flex-none px-8 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-200 dark:shadow-none hover:bg-emerald-700 transition-all active:scale-95">Save & Sync</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Receipt ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Farmer</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Vendor</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Vegetable</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Qty (Kg)</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Total (₹)</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {entries.map(entry => (
                  <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-slate-100">{entry.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-300">{entry.farmerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-300">
                      {entry.vendorId ? vendors.find(v => v.id === entry.vendorId)?.name : <span className="text-gray-400 italic">Self-Procured</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-300">{entry.vegetable}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-300 font-bold">{entry.quantity}</td>
                    <td className="px-6 py-4 text-sm font-black text-gray-900 dark:text-slate-100">₹ {entry.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-[10px] font-black uppercase text-emerald-600">Synced to MySQL</span>
                      </div>
                    </td>
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
