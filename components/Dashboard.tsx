
import React from 'react';
import { UserRole } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Language, translations } from '../translations';

interface DashboardProps {
  role: UserRole;
  language: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ role, language }) => {
  const t = translations[language];
  
  const procurementData = [
    { name: 'Mon', qty: 450 }, { name: 'Tue', qty: 620 }, { name: 'Wed', qty: 380 },
    { name: 'Thu', qty: 540 }, { name: 'Fri', qty: 810 }, { name: 'Sat', qty: 700 }, { name: 'Sun', qty: 250 },
  ];

  const StatCard = ({ title, value, icon, color, trend }: { title: string, value: string, icon: string, color: string, trend?: string }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-2xl ${color}`}>
          <i className={`fa-solid ${icon}`}></i>
        </div>
        {trend && <span className="text-[10px] font-black px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg">{trend}</span>}
      </div>
      <div>
        <p className="text-gray-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">{title}</p>
        <p className="text-3xl font-black text-gray-900 dark:text-slate-100 mt-1">{value}</p>
      </div>
    </div>
  );

  const renderFarmerDash = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Membership Status" value="Verified" icon="fa-id-card-clip" color="text-emerald-600" trend="Active" />
        <StatCard title="Total Earnings (Mtd)" value="₹ 45,200" icon="fa-indian-rupee-sign" color="text-blue-600" trend="+12%" />
        <StatCard title="Plots Registered" value="2.5 Acres" icon="fa-mountain-sun" color="text-amber-600" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm">
           <h3 className="text-xl font-black mb-6 flex items-center dark:text-slate-100 uppercase tracking-tight">
             <i className="fa-solid fa-chart-line text-emerald-600 mr-3"></i>
             Live Market Rates (Farmer Price)
           </h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Tomato', 'Potato', 'Onion', 'Brinjal'].map(item => (
                <div key={item} className="p-6 border border-gray-50 dark:border-slate-800 rounded-3xl text-center bg-gray-50/50 dark:bg-slate-800/50 group hover:border-emerald-500 transition-all">
                  <p className="text-gray-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{item}</p>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹ 26.50</p>
                  <p className="text-[8px] font-bold text-gray-400 mt-2 uppercase">Base Grade A</p>
                </div>
              ))}
           </div>
        </div>
        <div className="bg-emerald-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-between relative overflow-hidden">
           <div className="relative z-10">
             <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-2">Upcoming Task</p>
             <h4 className="text-2xl font-black mb-4 leading-tight">Harvesting Alert: Tomato Batch A</h4>
             <p className="text-sm text-emerald-100/70">Estimated harvest in 4 days. Contact local PVCS for collection schedule.</p>
           </div>
           <button className="relative z-10 mt-6 w-full py-3 bg-white text-emerald-900 rounded-xl font-black text-xs uppercase tracking-widest">Mark as Ready</button>
           <i className="fa-solid fa-leaf absolute -bottom-10 -right-10 text-[180px] text-white/5 rotate-45"></i>
        </div>
      </div>
    </div>
  );

  // Added renderPVCSDash to fix missing reference error
  const renderPVCSDash = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Procurement (Today)" value="4.2 Tons" icon="fa-truck-ramp-box" color="text-emerald-600" trend="+5%" />
        <StatCard title="Active Farmers" value="128" icon="fa-users" color="text-blue-600" />
        <StatCard title="Inventory Value" value="₹ 2.1 Lakh" icon="fa-warehouse" color="text-amber-600" />
      </div>
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm">
         <h3 className="text-xl font-black mb-6 flex items-center dark:text-slate-100 uppercase tracking-tight">
           <i className="fa-solid fa-clock-rotate-left text-emerald-600 mr-3"></i>
           Recent Procurement Activity
         </h3>
         <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-slate-800/50 rounded-2xl border dark:border-slate-700">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
                    <i className="fa-solid fa-leaf"></i>
                  </div>
                  <div>
                    <p className="font-bold text-sm dark:text-white">Farmer Transaction #{1000 + i}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-black">250 Kg • Tomato Grade A</p>
                  </div>
                </div>
                <span className="font-black text-emerald-600">₹ 6,625</span>
              </div>
            ))}
         </div>
      </div>
    </div>
  );

  const renderStateDash = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="State Total Vol" value="142.8 Tons" icon="fa-globe" color="text-indigo-600" trend="All Unions" />
        <StatCard title="Scheme Utilization" value="₹ 4.2 Cr" icon="fa-landmark" color="text-emerald-600" trend="64%" />
        <StatCard title="Active Unions" value="08 / 08" icon="fa-map-location-dot" color="text-blue-600" />
        <StatCard title="Digital Farmer Base" value="48.5k" icon="fa-fingerprint" color="text-amber-600" trend="+400 today" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <h3 className="text-xl font-black uppercase tracking-tight dark:text-slate-100 text-gray-900">Regional Union Performance</h3>
              <select aria-label="Sort Performance" className="bg-gray-50 dark:bg-slate-800 border-none rounded-xl text-[10px] font-black uppercase p-3 outline-none dark:text-slate-300">
                <option>Volume: High to Low</option>
                <option>Efficiency: High to Low</option>
              </select>
            </div>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Patna', val: 1200 }, { name: 'Gaya', val: 950 }, { name: 'Muzaff.', val: 1400 },
                  { name: 'Purnia', val: 800 }, { name: 'Bhojpur', val: 1100 }, { name: 'Saran', val: 600 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.05} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', color: '#f1f5f9' }}
                    cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                  />
                  <Bar dataKey="val" fill="#3b82f6" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
         </div>

         <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col justify-between flex-1">
              <div className="space-y-6">
                <h4 className="text-2xl font-black leading-tight uppercase tracking-tight">Master Price Control</h4>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">System-wide prices last synced 4h ago. Next push to PVCS at 08:00 AM IST.</p>
                <div className="space-y-4">
                  {['Tomato', 'Onion'].map(item => (
                    <div key={item} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                      <span className="font-bold text-sm">{item}</span>
                      <span className="text-emerald-400 font-black">₹ 26.50</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className="mt-8 bg-emerald-600 hover:bg-emerald-700 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-emerald-950/40">Open Price Master</button>
            </div>
            
            {/* Tarkaari Consumer Price Comparison - NEW */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border-4 border-emerald-500/20 shadow-sm relative overflow-hidden group hover:border-emerald-500 transition-all duration-500">
               <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-6">Tarkaari Price Benefit</h4>
               <div className="space-y-4">
                  <div className="flex justify-between items-end border-b pb-4 dark:border-slate-800">
                     <span className="text-[10px] font-black text-gray-400 uppercase">Open Market Avg.</span>
                     <span className="text-lg font-black text-red-500">₹ 42.00</span>
                  </div>
                  <div className="flex justify-between items-end border-b pb-4 dark:border-slate-800">
                     <span className="text-[10px] font-black text-gray-400 uppercase">Tarkaari Mart</span>
                     <span className="text-lg font-black text-emerald-600">₹ 35.00</span>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-xl text-center">
                     <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase">Consumer Savings: 16.5%</p>
                  </div>
               </div>
               <i className="fa-solid fa-basket-shopping absolute -bottom-8 -right-8 text-[100px] text-emerald-50 dark:text-slate-800/50 -rotate-12 transition-transform group-hover:scale-110"></i>
            </div>
         </div>
      </div>

      {/* Top PVCS Nodes */}
      <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight dark:text-slate-100 text-gray-900">Top PVCS Nodes: Procurement & Sales</h3>
            <p className="text-gray-400 text-xs font-bold uppercase mt-1">Live competitive ranking of primary cooperatives</p>
          </div>
          <div className="flex items-center space-x-2 bg-gray-50 dark:bg-slate-800 p-1 rounded-xl">
             <button className="px-4 py-2 text-[9px] font-black uppercase rounded-lg bg-white dark:bg-slate-700 text-emerald-600 shadow-sm">Daily</button>
             <button className="px-4 py-2 text-[9px] font-black uppercase rounded-lg text-gray-400 hover:text-gray-600">Monthly</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Danapur Central PVCS', union: 'Harit', vol: '18.4', sales: '4.85', rank: '01' },
            { name: 'Sherghati Farmers Coop', union: 'Magadh', vol: '15.2', sales: '3.90', rank: '02' },
            { name: 'Darbhanga North Node', union: 'Mithila', vol: '12.8', sales: '2.45', rank: '03' }
          ].map((pvcs) => (
            <div key={pvcs.rank} className="bg-gray-50/50 dark:bg-slate-800/30 p-8 rounded-[2.5rem] border border-gray-50 dark:border-slate-800 group hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-lg">Rank #{pvcs.rank}</span>
                <i className="fa-solid fa-trophy text-amber-500 text-lg"></i>
              </div>
              <h4 className="font-black text-gray-900 dark:text-white text-lg leading-tight uppercase tracking-tight">{pvcs.name}</h4>
              <p className="text-[9px] font-bold text-gray-400 uppercase mt-1 mb-8">{pvcs.union} District Union</p>
              
              <div className="space-y-6">
                <div>
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                     <span className="text-gray-400">Procurement</span>
                     <span className="text-emerald-600">{pvcs.vol} Tons</span>
                   </div>
                   <div className="w-full bg-gray-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(Number(pvcs.vol)/20)*100}%` }}></div>
                   </div>
                </div>
                <div>
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                     <span className="text-gray-400">Total Sales</span>
                     <span className="text-blue-600">₹ {pvcs.sales} Lakh</span>
                   </div>
                   <div className="w-full bg-gray-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(Number(pvcs.sales)/5)*100}%` }}></div>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(role) {
      case UserRole.FARMER: return renderFarmerDash();
      // Updated PVCS_USER case to call renderPVCSDash()
      case UserRole.PVCS_USER: return renderPVCSDash();
      case UserRole.ADMIN:
      case UserRole.DEPT_OFFICIAL:
      case UserRole.UNION_USER: return renderStateDash();
      default: return renderFarmerDash();
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-slate-100 uppercase tracking-tighter">
            {role === UserRole.FARMER ? "Farmer Portal" : role === UserRole.PVCS_USER ? "PVCS Node Center" : "State Federation Control"}
          </h2>
          <p className="text-gray-400 dark:text-slate-500 text-sm font-medium mt-1">
             Bihar State Vegetable Processing & Marketing Network
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-500 dark:text-slate-400 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center space-x-2 transition-all">
            <i className="fa-solid fa-download"></i>
            <span>{t.exportReport}</span>
          </button>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default Dashboard;
