
import React from 'react';
import { UserRole } from '../types';

const MarketingECommerceModule: React.FC<{ role: UserRole }> = ({ role }) => {
  const products = [
    { id: 1, name: 'Premium Hybrid Tomato', price: '₹ 45.00/Kg', img: 'https://images.unsplash.com/photo-1546097759-478e9ed1544b?auto=format&fit=crop&q=80&w=200', stock: '2400 Kg' },
    { id: 2, name: 'Red Local Onion', price: '₹ 38.00/Kg', img: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&q=80&w=200', stock: '1200 Kg' },
    { id: 3, name: 'Processing Potato', price: '₹ 22.00/Kg', img: 'https://images.unsplash.com/photo-1518977676601-b53f02ac6d31?auto=format&fit=crop&q=80&w=200', stock: '5000 Kg' }
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">E-Commerce & Marketing</h2>
          <p className="text-gray-500 text-sm font-medium">Direct-to-Consumer Digital Storefront (FR-07)</p>
        </div>
        <div className="flex space-x-2 bg-white dark:bg-slate-900 p-1 rounded-2xl border dark:border-slate-800 shadow-sm">
           <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Storefront</button>
           <button className="px-6 py-2.5 text-gray-400 text-[10px] font-black uppercase tracking-widest">Active Orders</button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-8">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => (
                <div key={p.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-slate-800 group shadow-sm hover:shadow-2xl transition-all duration-500">
                   <div className="h-48 overflow-hidden relative">
                      <img src={p.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={p.name} />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase text-emerald-600 border border-emerald-100">VEGFED Verified</div>
                   </div>
                   <div className="p-6">
                      <h4 className="text-sm font-black text-gray-800 dark:text-slate-200 uppercase tracking-tight mb-2">{p.name}</h4>
                      <div className="flex justify-between items-center mb-6">
                         <span className="text-xl font-black text-emerald-600">{p.price}</span>
                         <span className="text-[10px] font-bold text-gray-400 uppercase">Stock: {p.stock}</span>
                      </div>
                      <button className="w-full bg-slate-900 dark:bg-emerald-600 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">List for Sale</button>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Live Marketplace Stats</h3>
              <div className="space-y-6">
                 {[
                   { label: 'Today Revenue', val: '₹ 1.2 Lakh', color: 'text-emerald-600' },
                   { label: 'Active Buyers', val: '450+', color: 'text-blue-600' },
                   { label: 'Cart Abandonment', val: '12%', color: 'text-amber-600' }
                 ].map((s, i) => (
                    <div key={i} className="flex justify-between items-end border-b dark:border-slate-800 pb-4">
                       <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{s.label}</span>
                       <span className={`text-lg font-black ${s.color}`}>{s.val}</span>
                    </div>
                 ))}
              </div>
           </div>
           
           <div className="bg-indigo-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-300 mb-2">Institutional Linkage</p>
              <h4 className="text-xl font-black mb-4 leading-tight uppercase">Bulk Order Request: Metro Mart</h4>
              <p className="text-xs text-indigo-100/70 font-medium leading-relaxed">Request for 5 Tons Grade-A Potato. Response required within 4 hours for Bihar-Logistics Node.</p>
              <button className="mt-6 w-full py-4 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-900/40">Accept & Dispatch</button>
              <i className="fa-solid fa-truck-moving absolute -bottom-10 -right-10 text-[180px] text-white/5 pointer-events-none"></i>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingECommerceModule;
