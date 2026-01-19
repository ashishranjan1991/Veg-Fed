
import React from 'react';
import { UserRole } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell, PieChart, Pie } from 'recharts';
import { Language, translations } from '../translations';

interface DashboardProps {
  role: UserRole;
  language: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ role, language }) => {
  const t = translations[language];
  
  // Mock data for visualizations
  const procurementData = [
    { name: 'Mon', qty: 450 },
    { name: 'Tue', qty: 620 },
    { name: 'Wed', qty: 380 },
    { name: 'Thu', qty: 540 },
    { name: 'Fri', qty: 810 },
    { name: 'Sat', qty: 700 },
    { name: 'Sun', qty: 250 },
  ];

  const qualityGradeData = [
    { name: 'Grade A', value: 400, color: '#10b981' },
    { name: 'Grade B', value: 300, color: '#3b82f6' },
    { name: 'Grade C', value: 200, color: '#f59e0b' },
    { name: 'Grade D', value: 50, color: '#ef4444' },
  ];

  const StatCard = ({ title, value, icon, color }: { title: string, value: string, icon: string, color: string }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex items-center space-x-4 transition-colors duration-300">
      <div className={`w-12 h-12 rounded-lg bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-2xl ${color}`}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div>
        <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-slate-100 leading-none mt-1">{value}</p>
      </div>
    </div>
  );

  const renderFarmerDash = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Membership Status" value="Approved" icon="fa-check-circle" color="text-emerald-600" />
        <StatCard title="Total Sales (Mtd)" value="₹ 45,200" icon="fa-wallet" color="text-blue-600" />
        <StatCard title="Upcoming Harvest" value="15 Jan 2026" icon="fa-calendar" color="text-amber-600" />
      </div>
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <h3 className="text-lg font-bold mb-4 dark:text-slate-100">Live Central Market Rates</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Tomato', 'Potato', 'Onion', 'Brinjal'].map(item => (
            <div key={item} className="p-4 border border-gray-100 dark:border-slate-800 rounded-lg text-center bg-gray-50/50 dark:bg-slate-800/50">
              <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">{item}</p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">₹ 26.50</p>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1 uppercase tracking-widest font-black">Central DB Rate</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPVCSDash = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Registered Farmers" value="1,245" icon="fa-users" color="text-blue-600" />
        <StatCard title="Today's Procurement" value="2.4 Tons" icon="fa-truck-field" color="text-emerald-600" />
        <StatCard title="Pending Verifications" value="14" icon="fa-clock" color="text-amber-600" />
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm flex items-center space-x-4">
           <div className="w-12 h-12 rounded-lg bg-emerald-900/30 flex items-center justify-center text-2xl text-emerald-500">
              <i className="fa-solid fa-server"></i>
           </div>
           <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">System Health</p>
              <p className="text-sm font-bold text-emerald-400 leading-none mt-1">MySQL Online</p>
              <p className="text-[9px] text-slate-600 mt-1">Sync: 1s ago</p>
           </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm h-80 transition-colors duration-300">
          <h3 className="text-lg font-bold mb-4 dark:text-slate-100">Weekly Procurement (Kg)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={procurementData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9' }}
                itemStyle={{ color: '#10b981' }}
              />
              <Bar dataKey="qty" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
          <h3 className="text-lg font-bold mb-4 dark:text-slate-100">Recent Transactions</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center justify-center font-bold text-xs">RM</div>
                  <div>
                    <p className="text-sm font-semibold dark:text-slate-200">Ram Mehto</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Tomato • 120 Kg • Grade A</p>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <p className="font-bold dark:text-slate-100">₹ 2,940</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-tight">Synced</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(role) {
      case UserRole.FARMER: return renderFarmerDash();
      case UserRole.PVCS_USER: return renderPVCSDash();
      case UserRole.UNION_USER: return renderPVCSDash(); // Re-use for demo
      case UserRole.DEPT_OFFICIAL: return renderPVCSDash(); // Re-use for demo
      default: return renderPVCSDash();
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">{t.dashboardOverview}</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm">{t.realtimeStats}</p>
        </div>
        <button className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center space-x-2 transition-all">
          <i className="fa-solid fa-download"></i>
          <span>{t.exportReport}</span>
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default Dashboard;
